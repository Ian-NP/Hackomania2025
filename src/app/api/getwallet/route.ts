import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid"); // Retrieve `uid` from query parameters
    var walletid = await db.ref(`users/${uid}/wallet`).get();
    const walletidstring = walletid.val()
    console.log(walletidstring)
    return NextResponse.json({ wallet: walletidstring});
}