import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Ensure Firebase Admin is properly initialized
import {
  createAuthenticatedClient,
  isPendingGrant,
} from "@interledger/open-payments";
import crypto from "crypto";

export async function GET(req: NextRequest) {

      const { searchParams } = new URL(req.url);
      const uid = searchParams.get("uid"); 
      const senderwallet = searchParams.get("senderwallet");
      const walletid = searchParams.get("walletid"); // Retrieve `uid` from query parameters
      const amount = searchParams.get("amount"); 
      console.log(walletid)
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

        const grant = await client.grant.request(
          {
            url: walletAddress.authServer,
          },
          {
            access_token: {
              access: [
                {
                  type: "incoming-payment",
                  actions: ["list", "read", "read-all", "complete", "create"],
                },
              ],
            },
          },
        );

        if (isPendingGrant(grant)) {
          throw new Error("Expected non-interactive grant");
        }
        db.ref(`users/${uid}/incomingtoken`).set(grant.access_token.value);
        console.log("reached incoming transfer")
        const baseurl = "http://localhost:3000"
        fetch(baseurl+`/api/transaction/incomingtransfer?uid=${uid}&amount=${amount}&walletid=${walletid}&senderwallet=${senderwallet}`)
    .catch(error => console.error('Error:', error));
        return NextResponse.json({
            continueToken: grant.access_token.value,
            url :  grant.access_token.manage,
        });
}
                
      