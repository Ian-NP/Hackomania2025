import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Import the db from the proper location

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const uid = url.searchParams.get("uid");
    const { earnings } = await request.json(); // Extract earnings from the request bod

    if (earnings === undefined) {
      return NextResponse.json({ message: "Earnings field is required" }, { status: 400 });
    }

    const userRef = db.ref(`users/${uid}`); // Get the reference to the user's data
    await userRef.update({ earnings });

    return NextResponse.json({ message: "Earnings updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating earnings:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: "Failed to update earnings", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Failed to update earnings", error: "Unknown error" }, { status: 500 });
  }
}
