import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Ensure Firebase Admin is properly initialized
import {
  createAuthenticatedClient,
  isPendingGrant,
} from "@interledger/open-payments";
import crypto from "crypto";

export async function GET(req: NextRequest) {

      const { searchParams } = new URL(req.url);
      const uid = searchParams.get("uid"); //from the sender
      const senderwalletid = "https://ilp.interledger-test.dev/" + searchParams.get("senderwalletid"); 
      const amount = searchParams.get("amount"); // Retrieve `uid` from query parameters
      const walletid = "https://ilp.interledger-test.dev/" + searchParams.get("walletid"); // Retrieve `uid` from query parameters
      console.log(senderwalletid)
      const WALLET_ADDRESS = "https://ilp.interledger-test.dev/pranav";
        const KEY_ID = "064bc804-bd50-4136-bc10-4a39a59f7429";
        const NONCE = crypto.randomUUID();
        const client = await createAuthenticatedClient({
            walletAddressUrl: WALLET_ADDRESS,
            privateKey: Buffer.from("LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUNCTkQ3WnUwY2xUdkZ0Z2ZGUEwzV1lnWU1BbEtEUEFCUDUwcVYvTVhzQzkKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==", 'base64'),  // Pass the actual private key content
            keyId: KEY_ID,
            validateResponses: false,
        });
        const walletAddress = await client.walletAddress.get({
            url: walletid,
        });
        const sendingwalletAddress = await client.walletAddress.get({
            url: senderwalletid,
        });
        const grant = await client.grant.request(
            {
                url: sendingwalletAddress.authServer,
            },
            {
                access_token: {
                    access: [
                        {
                            identifier: sendingwalletAddress.id,
                            type: "outgoing-payment",
                            actions: ["list", "list-all", "read", "read-all", "create"],
                            limits: {
                                debitAmount: {
                                    assetCode: "SGD",
                                    assetScale: 2,
                                    value: amount,
                                },
                            },
                        },
                    ],
                },
                interact: {
                    start: ["redirect"],
                    finish: {
                        method: "redirect",
                        uri: "http://localhost:3000/donor",
                        nonce: NONCE,
                    },
                },
            }
        );
        if (!isPendingGrant(grant)) {
            throw new Error("Expected interactive grant");
        }
        const quoteGrant = await client.grant.request(
            {
              url: sendingwalletAddress.authServer,
            },
            {
              access_token: {
                access: [
                  {
                    type: "quote",
                    actions: ["create", "read"],
                  },
                ],
              },
            }
          );
        
        db.ref(`users/${uid}/quotegrant`).set(quoteGrant.access_token.value);
        db.ref(`users/${uid}/outgoinggrant`).set(grant.continue.access_token.value);
        db.ref(`users/${uid}/outgoinggranturl`).set(grant.continue.uri);
        return NextResponse.json({
            grantUrl: grant.interact.redirect,
            continueToken: grant.continue.access_token.value,
            continueUri: grant.continue.uri,
        });
}