import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Ensure Firebase Admin is properly initialized

export async function GET(req: NextRequest) {
    try {
        // Extract uid from query parameters
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid");

        if (!uid) {
            return NextResponse.json({ error: "Missing uid parameter" }, { status: 400 });
        }

        // Reference to the specific pod
        const podRef = db.ref(`users/0/pods/${uid}`);

        // Fetch pod data
        const snapshot = await podRef.once("value");

        if (!snapshot.exists()) {
            console.warn(`Pod with uid ${uid} not found.`);
            return NextResponse.json({ message: "Pod not found" }, { status: 404 });
        }

        const podData = snapshot.val();
        console.log(`Pod data for uid ${uid}:`, podData);

        // Ensure podData is valid
        if (typeof podData !== "object" || podData === null) {
            console.error("Unexpected data format:", podData);
            return NextResponse.json({ error: "Invalid data format" }, { status: 500 });
        }

        return NextResponse.json({ id: uid, ...podData });

    } catch (error) {
        console.error("Error fetching pod:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
