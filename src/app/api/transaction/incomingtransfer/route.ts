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
    const amount = searchParams.get("amount"); 
    const walletid = searchParams.get("walletid"); 
    const senderwallet = searchParams.get("senderwallet");
    const accessTokenSnapshot = await db.ref(`users/${uid}/incomingtoken`).get();
    const ACCESS_TOKEN = accessTokenSnapshot.val();
    console.log(ACCESS_TOKEN)
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

      const incomingPayment = await client.incomingPayment.create(
        {
          url: walletAddress.resourceServer,
          accessToken:  ACCESS_TOKEN,
        },
        {
          walletAddress: walletAddress.id,
          incomingAmount: {
            value: amount,
            assetCode: "SGD",
            assetScale: 2,
          },
          expiresAt: new Date(Date.now() + 60_000 * 10).toISOString(),
          
        },
        
      );
      console.log("INCOMING PAYMENT URL =", incomingPayment.id);
      db.ref(`users/${uid}/paymenturl`).set(incomingPayment.id);
      const baseurl = "http://localhost:3000"
      fetch(baseurl+`/api/transaction/quote?uid=${uid}&walletid=${walletid}&senderwallet=${senderwallet}`)
    .catch(error => console.error('Error:', error));
      return NextResponse.json({
        pranv:true
    });
      
}