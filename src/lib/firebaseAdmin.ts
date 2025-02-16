import admin from "firebase-admin";
import { getDatabase } from "firebase-admin/database";

// Only initialize Firebase if it hasn't been initialized yet
if (admin.apps.length === 0) {
  const serviceAccount = require("./firebase.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://prodigi-e9dbf-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
} else {
  admin.app(); // Use the default app if already initialized
}

export const db = getDatabase();
export const auth = admin.auth();
