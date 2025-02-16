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
        const walletid = searchParams.get("walletid"); // Retrieve `uid` from query parameters
        const quoteurl = await db.ref(`users/${uid}/quoteurl`).get();
        const interactref = await db.ref(`users/${uid}/interactref`).get();
        const INTERACT_REF = interactref.val();
        const senderwallet = searchParams.get("senderwallet");
        const QUOTEURL = quoteurl.val();
        const WALLET_ADDRESS = "https://ilp.interledger-test.dev/pranav";
        const outgoingurl = await db.ref(`users/${uid}/outgoinggranturl`).get();
        const OUTGOINGURL = outgoingurl.val();
        const accesstoken = await db.ref(`users/${uid}/outgoinggrant`).get();
        const ACCESSTOKEN = accesstoken.val()
        const KEY_ID = "064bc804-bd50-4136-bc10-4a39a59f7429";
        const client = await createAuthenticatedClient({
            walletAddressUrl: WALLET_ADDRESS,
            privateKey: Buffer.from("LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUNCTkQ3WnUwY2xUdkZ0Z2ZGUEwzV1lnWU1BbEtEUEFCUDUwcVYvTVhzQzkKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==", 'base64'),  // Pass the actual private key content
            keyId: KEY_ID,
            validateResponses: false,
        });
        const finalpaymentgrant = await db.ref(`users/${uid}/finalpaymentgrant`).get();
        var FINALPAYMENT = finalpaymentgrant.val()
        const walletAddress = await client.walletAddress.get({
            url: walletid,
          });

          const sendingwalletAddress = await client.walletAddress.get({
            url: senderwallet,
          });
        console.log("yes interact ref is updated")
        if (FINALPAYMENT == null){
            console.log("final");
            const finalizedOutgoingPaymentGrant = await client.grant.continue({
                url: OUTGOINGURL,
                accessToken: ACCESSTOKEN,
              },
              {
                interact_ref: INTERACT_REF,
              },);
              db.ref(`users/${uid}/finalpaymentgrant`).set(finalizedOutgoingPaymentGrant.access_token.value);
                FINALPAYMENT = finalizedOutgoingPaymentGrant.access_token.value;
        }
        console.log(FINALPAYMENT)
          const outgoingPayment = await client.outgoingPayment.create(
            {
              url: sendingwalletAddress.resourceServer,
              accessToken: FINALPAYMENT,
            },
            {
              walletAddress: sendingwalletAddress.id,
              quoteId: QUOTEURL,
            }
          );
          return NextResponse.json({
            statement:true
        });
}
