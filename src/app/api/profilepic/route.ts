import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid"); // Retrieve `uid` from query parameters

        if (!uid) {
            return NextResponse.json({ error: "UID parameter is required" }, { status: 400 });
        }

        // Reference to the 'pods' list in the Firebase Realtime Database for the specific user
        const listRef = db.ref(`users/${uid}/photoURL`);        

        // Fetch the list from Firebase
        const snapshot = await listRef.get();

        if (!snapshot.exists()) {
            return NextResponse.json({ message: "couldn't find" }, { status: 404 });
        }

        const podsList = snapshot.val(); // Get the value of the list

        return NextResponse.json(podsList); // Return the list as JSON

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
