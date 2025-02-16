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
    const walletid = searchParams.get("walletid"); 
    const senderwallet = searchParams.get("senderwallet"); 
    const quote_Access_token = await db.ref(`users/${uid}/quotegrant`).get();
    const QUOTE_ACCESS_TOKEN = quote_Access_token.val();
    const receiverme = await db.ref(`users/${uid}/paymenturl`).get();
    const reciver = receiverme.val()
    const WALLET_ADDRESS = "https://ilp.interledger-test.dev/pranav";
    const KEY_ID = "064bc804-bd50-4136-bc10-4a39a59f7429";
    const NONCE = crypto.randomUUID();
    console.log(QUOTE_ACCESS_TOKEN);
    const client = await createAuthenticatedClient({
        walletAddressUrl: WALLET_ADDRESS,
        privateKey: Buffer.from("LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUNCTkQ3WnUwY2xUdkZ0Z2ZGUEwzV1lnWU1BbEtEUEFCUDUwcVYvTVhzQzkKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==", 'base64'),  // Pass the actual private key content
        keyId: KEY_ID,
        validateResponses: false,
    });
      const walletAddress = await client.walletAddress.get({
        url: senderwallet,
      });

      const quote = await client.quote.create(
        {
          url: walletAddress.resourceServer,
          accessToken: QUOTE_ACCESS_TOKEN,
        },
        {
          method: "ilp",
          walletAddress: walletAddress.id,
          receiver: reciver,
        },

        
      );
      db.ref(`users/${uid}/quoteurl`).set(quote.id);
      const baseurl = "http://localhost:3000"
    fetch(baseurl+`/api/transaction/finaltransfer?uid=${uid}&walletid=${walletid}&senderwallet=${senderwallet}`)
    .catch(error => console.error('Error:', error));
      return NextResponse.json({
        ian:true
    });


}