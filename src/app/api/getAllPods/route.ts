import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Ensure Firebase Admin is properly initialized

export async function GET(req: NextRequest) {
    try {
        console.log("Fetching pods data...");

        // Reference to the "pods" node under the first user (index "0")
        const podsRef = db.ref("users/0/pods");

        // Fetch all pods
        const snapshot = await podsRef.once("value"); // Use `once("value")` instead of `get()`

        if (!snapshot.exists()) {
            console.warn("No pods found.");
            return NextResponse.json({ message: "No pods found" }, { status: 404 });
        }

        const podsData = snapshot.val();
        console.log("Raw pods data:", podsData);

        // Ensure podsData is an object before transforming
        if (typeof podsData !== "object" || podsData === null) {
            console.error("Unexpected data format:", podsData);
            return NextResponse.json({ error: "Invalid data format" }, { status: 500 });
        }

        // Convert object to an array with keys
        const podsArray = Object.entries(podsData).map(([key, pod]) => ({
            id: key, // Include Firebase key as `id`
            ...(typeof pod === "object" && pod !== null ? pod : {}),  // Ensure pod is an object before spreading
        }));

        console.log("Processed pods array:", podsArray);

        return NextResponse.json(podsArray);

    } catch (error) {
        console.error("Error fetching pods:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
