import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function GET(req: NextRequest) {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid"); 
        const amount = searchParams.get("amount"); 
        const current_earn = await db.ref(`users/${uid}/earnings`).get();
        const CURRENT_EARN = current_earn.val();
        db.ref(`users/0/GViBGtZnhpQ6SyBlCVrNh1Xh8zJ3`)
        db.ref(`users/${uid}/earnings`).set(CURRENT_EARN+amount);
        var walletid = await db.ref(`users/${uid}/wallet`).get();
        const walletidstring = walletid.val()
        fetch(`http://localhost:3000/api/transaction/onetouch?senderwallet=pranav&uid=DIT52qtgvQfD55taKUTjkc0ARBx1&walletid=http://ilp.interledger-test.dev/${walletidstring}&amount=${amount*100}`)
        return NextResponse.json({succes:true}); 

        
}