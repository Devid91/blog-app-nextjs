"use server";

import "server-only";
import mongoose, { Mongoose } from "mongoose";

// Define a global mongoose instance for re-use
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongooseInstance: Mongoose | undefined;
}

// Ensure MONGODB_URL is a string by confirming it's defined
const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error(
    "Please define the MONGODB_URL environment variable in your .env file."
  );
}

export default async function connectToDatabase() {
  // Check if mongooseInstance is already defined globally
  if (
    global.mongooseInstance &&
    global.mongooseInstance.connection.readyState === 1
  ) {
    console.log("Using existing database connection");
    return global.mongooseInstance;
  }

  try {
    // Initialize the mongoose connection if not already done
    global.mongooseInstance = await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");

    return global.mongooseInstance;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
