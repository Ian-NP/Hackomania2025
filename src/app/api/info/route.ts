import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest) {
    try {
        const { uid } = await req.json();
        var a = await db.ref(`users/${uid}/pods`).get();

        return NextResponse.json({ message: a});
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
