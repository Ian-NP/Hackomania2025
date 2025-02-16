import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decodedToken = await getAuth().verifyIdToken(token);
        if (!decodedToken) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

        const { uid, email, displayName, photoURL } = await req.json();
        if (!uid || !email) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if user already exists in the database
        const existingUserSnapshot = await db.ref(`users`).orderByChild("email").equalTo(email).once("value");
        if (existingUserSnapshot.exists()) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        await db.ref(`users/${uid}`).set({
            uid,
            email,
            displayName: displayName || null,
            photoURL: photoURL || null,
            
        });

        return NextResponse.json({ message: "User stored successfully" });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        // Extract email from query parameters
        const url = new URL(req.url);
        const email = url.searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Missing email" }, { status: 400 });
        }

        let userSnapshot;

        if (email) {
            // Search users by email
            userSnapshot = await db.ref("users").orderByChild("email").equalTo(email).once("value");
        }

        if (!userSnapshot || !userSnapshot.exists()) {
            return NextResponse.json(false); // Return `false` if the user doesn't exist
        }

        const userData = userSnapshot.val();
        return NextResponse.json(userData);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

