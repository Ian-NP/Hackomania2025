import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Import the db from the proper location

export async function PUT(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const uid = url.searchParams.get("uid");
  
      if (!uid) {
        return NextResponse.json({ message: "UID is required" }, { status: 400 });
      }
  
      const { productiveTime } = await request.json();
  
      if (productiveTime === undefined) {
        return NextResponse.json({ message: "Productive time field is required" }, { status: 400 });
      }
  
      const userRef = db.ref(`users/${uid}`);
      await userRef.update({ productiveTime });
  
      return NextResponse.json({ message: "Productive time updated successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error updating productive time:", error);
  
      if (error instanceof Error) {
        return NextResponse.json({ message: "Failed to update productive time", error: error.message }, { status: 500 });
      }
  
      return NextResponse.json({ message: "Failed to update productive time", error: "Unknown error" }, { status: 500 });
    }
  }
  