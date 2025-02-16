import { NextRequest, NextResponse } from "next/server";
import { db } from "lib/firebaseAdmin"; // Ensure Firebase Admin is properly initialized

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newItem = body.item; // New item to add to the list
        const uid = body.uid; // Ensure we are extracting uid correctly

        if (!newItem || !uid) {
            return NextResponse.json({ error: "Item and UID are required" }, { status: 400 });
        }

        // Reference to the 'pods' list in the Firebase Realtime Database for a specific user
        const listRef = db.ref(`users/${uid}/pods`);

        // Fetch the current list from Firebase
        const snapshot = await listRef.get();

        // Check if the list exists or is empty
        if (!snapshot.exists() || !Array.isArray(snapshot.val()) || snapshot.val().length === 0) {
            // If the list doesn't exist or is empty, create a new list with the new item
            await listRef.set([newItem]);
        } else {
            // If the list exists, add the new item to the existing list
            const currentList = snapshot.val();
            currentList.push(newItem);
            await listRef.set(currentList); // Overwrite the list with the new item added
        }

        return NextResponse.json({ message: "Item added successfully" });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid"); // Retrieve `uid` from query parameters

        if (!uid) {
            return NextResponse.json({ error: "UID parameter is required" }, { status: 400 });
        }

        // Reference to the 'pods' list in the Firebase Realtime Database for the specific user
        const listRef = db.ref(`users/${uid}/pods`);

        // Fetch the list from Firebase
        const snapshot = await listRef.get();

        if (!snapshot.exists()) {
            return NextResponse.json({ message: "No items found" }, { status: 404 });
        }

        const podsList = snapshot.val(); // Get the value of the list
        if (!Array.isArray(podsList)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 500 });
        }

        // Fetch each item from Firebase asynchronously
        const fetchedItems = await Promise.all(
            podsList.map(async (key) => {
                const itemSnapshot = await db.ref(`users/0/pods/${key}`).get();
                const itemData = itemSnapshot.exists() ? itemSnapshot.val() : null;
                if (itemData) {
                    return {
                        id: key, // Include the ID directly in the same object
                        ...itemData // Spread the data into the same object
                    };
                }
                return null;
            })
        );

        // Filter out any null values
        const filteredItems = fetchedItems.filter(item => item !== null);

        return NextResponse.json(filteredItems);

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// DELETE method to remove an item from the 'pods' list
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const itemToRemove = body.item; // Item to remove
        const uid = body.uid; // Ensure UID is provided to identify the user

        if (!itemToRemove || !uid) {
            return NextResponse.json({ error: "Item and UID are required" }, { status: 400 });
        }

        // Reference to the 'pods' list in the Firebase Realtime Database for the specific user
        const listRef = db.ref(`users/${uid}/pods`);

        // Fetch the current list from Firebase
        const snapshot = await listRef.get();

        if (!snapshot.exists()) {
            return NextResponse.json({ error: "No items found to delete" }, { status: 404 });
        }

        const currentList = snapshot.val(); // Get the current list

        // Find the index of the item to remove
        const itemIndex = currentList.indexOf(itemToRemove);
        
        if (itemIndex === -1) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // Remove the item from the list
        currentList.splice(itemIndex, 1);
        
        // Save the updated list back to Firebase
        await listRef.set(currentList);

        return NextResponse.json({ message: "Item deleted successfully" });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


