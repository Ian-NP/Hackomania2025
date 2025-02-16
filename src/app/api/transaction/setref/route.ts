import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Ensure Firebase Admin is properly initialized

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid"); 
    const ref = searchParams.get("ref"); 
    db.ref(`users/${uid}/interactref`).set(ref);
    return NextResponse.json({
        succes:true
    });
}