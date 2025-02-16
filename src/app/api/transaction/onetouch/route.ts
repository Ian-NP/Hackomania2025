import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Ensure Firebase Admin is properly initialized

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid"); 
    const walletid = searchParams.get("walletid"); 
    const amount = searchParams.get("amount"); 
    const senderwallet = "https://ilp.interledger-test.dev/" +searchParams.get("senderwallet"); 
    const baseurl = "http://localhost:3000"
    // create the incoming grant
    fetch(baseurl+`/api/transaction/incominggrant?uid=${uid}&senderwallet=${senderwallet}&walletid=${walletid}&amount=${amount}`)
    .catch(error => console.error('Error:', error));
    db.ref(`users/0/donations/${uid}/target_wallet`).set(`${searchParams.get("senderwallet")}`);
    db.ref(`users/0/donations/${uid}/amount`).set(`${amount/100}`);
    // // create the incoming transfer
    // fetch(baseurl+`/api/transaction/incomingtransfer?uid=${uid}&amount=${amount}&walletid=${walletid}`)
    // .catch(error => console.error('Error:', error));

    // // quote grant 
    // fetch(baseurl+`/api/transaction/quote?uid=${uid}&walletid=${walletid}`)
    // .catch(error => console.error('Error:', error));

    // //final 
    // // quote grant 
    // fetch(baseurl+`/api/transaction/finaltransfer?uid=${uid}&walletid=${walletid}`)
    // .catch(error => console.error('Error:', error));
    return NextResponse.json({
        amos:true
    });
}