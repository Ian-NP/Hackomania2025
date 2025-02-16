import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin";

// GET method to retrieve data (using query param for `id`)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
  }

  try {
    const snapshot = await db.ref(`data/${id}`).get();
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(snapshot.val());
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST method to save data (using request body for `id`)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.data) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // Save the data to Firebase
    await db.ref(`data/${body.id}`).set(body.data);
    return NextResponse.json({ message: "Data saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PATCH method to update data (using request body for `id`)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.data) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await db.ref(`data/${body.id}`).update(body.data);
    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE method to remove data (using request body for `id`)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.ref(`data/${body.id}`).remove();
    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
