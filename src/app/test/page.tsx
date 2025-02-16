"use client";

import React, { useState } from "react";

const Page = () => {
    const [uid, setUid] = useState<string>(""); // State for UID
    const [item, setItem] = useState<string>(""); // State for the new item to add
    const [itemsList, setItemsList] = useState<any[]>([]); // State to store the fetched list
    const [error, setError] = useState<string>(""); // State for error messages
    const [message, setMessage] = useState<string>(""); // State for success messages

    // Function to handle adding a new item to the list
    const handleAddItem = async () => {
        if (!uid || !item) {
            setError("UID and item are required!");
            return;
        }

        try {
            const res = await fetch("/api/pods", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid,
                    item,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setItem(""); // Clear the item input field
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("An error occurred while adding the item.");
        }
    };

    // Function to handle fetching the list of items
    const handleFetchList = async () => {
        if (!uid) {
            setError("UID is required!");
            return;
        }

        try {
            const res = await fetch(`/api/pods?uid=${uid}`);
            const data = await res.json();

            if (res.ok) {
                setItemsList(data);
                setMessage("Items fetched successfully!");
            } else {
                setError(data.error || "No items found");
            }
        } catch (error) {
            setError("An error occurred while fetching the list.");
        }
    };

    return (
        <div>
            <h1>Test Firebase API</h1>

            {/* Form to add a new item to the list */}
            <div>
                <h2>Add Item to List</h2>
                <input
                    type="text"
                    placeholder="Enter UID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                />
                <button onClick={handleAddItem}>Add Item</button>
            </div>

            {/* Form to fetch the list of items */}
            <div>
                <h2>Fetch Items</h2>
                <input
                    type="text"
                    placeholder="Enter UID to fetch list"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                />
                <button onClick={handleFetchList}>Fetch List</button>
            </div>

            {/* Display messages */}
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Display the fetched list of items */}
            <div>
                <h2>Items in List</h2>
                {itemsList.length > 0 ? (
                    <ul>
                        {itemsList.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No items to display.</p>
                )}
            </div>
        </div>
    );
};

export default Page;
