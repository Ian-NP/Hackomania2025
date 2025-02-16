import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin";

export async function GET(req: NextRequest) {
    try {
        // Extract UID from query parameters
        const url = new URL(req.url);
        const uid = url.searchParams.get("uid");
        console.log("Requested UID:", uid);  // Log the requested UID
        
        if (!uid) {
            return NextResponse.json({ error: "Missing uid" }, { status: 400 });
        }

        // Fetch user data directly using UID   
        const userSnapshot = await db.ref(`users/${uid}`).once("value");

        if (!userSnapshot.exists()) {
            return NextResponse.json(false); // Return `false` if user doesn't exist
        }

        const userData = userSnapshot.val();
        return NextResponse.json(userData);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
