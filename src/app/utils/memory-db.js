import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import fs from "fs";
import chokidar from "chokidar";

(async () => {
  if (mongoose.connection.readyState === 1) {
    // If already connected, use existing connection
    console.log("Using existing database connection");
    return mongoose.connection;
  } else {
    (async () => {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      await mongoose.connect(mongoUri, { dbName: "next_blog_app" });
    })();
  }
})();

export async function saveDBToFile() {
  try {
    const collections = mongoose.connection.collections;
    const dbData = {};

    for (const key in collections) {
      if (collections.hasOwnProperty(key)) {
        const collection = collections[key];
        const data = await collection.find({}).toArray(); // Use `toArray()` instead of `lean()`
        dbData[key] = data;
      }
    }

    // Write the database state to db.json
    fs.writeFileSync("db.json", JSON.stringify(dbData, null, 2), "utf-8");
    console.log("Database state written to db.json");
    return true; // Indicate success
  } catch (error) {
    console.error("Error saving DB to file:", error);
    return false; // Indicate failure
  }
}

export async function deleteDataFromMemory() {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      if (collections.hasOwnProperty(key)) {
        const collection = collections[key];
        await collection.deleteMany({}); // Clear all documents in the collection
      }
    }

    console.log("All data deleted from in-memory database");
    return true; // Indicate success
  } catch (error) {
    console.error("Error deleting data from memory:", error);
    return false; // Indicate failure
  }
}

export async function watchDB() {
  chokidar.watch("./db.json").on("change", () => {
    console.log("db.json file has changed!");
  });
}
// Prevent operation if not connected
// Save DB state to a file
