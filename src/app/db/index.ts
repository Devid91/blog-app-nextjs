"use server";

import "server-only";

// import { Mongoose } from "mongoose";

// declare global {
//   // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
//   var mongoose: Mongoose | undefined; // This must be a `var` and not a `let / const`
// }

// const MONGODB_URL = process.env.MONGODB_URL;

// if (!MONGODB_URL) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// export default async function connectToDatabase() {
//   if (mongoose.connection.readyState === 1) {
//     // If already connected, use existing connection
//     console.log("Using existing database connection");
//     return mongoose.connection;
//   }

//   try {
//     await mongoose.connect(MONGODB_URL as string, {
//       serverSelectionTimeoutMS: 5000,
//       // ensure you're connecting with the right auth DB
//     });
//     console.log("Connected to DB");
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     throw error;
//   }
// }
