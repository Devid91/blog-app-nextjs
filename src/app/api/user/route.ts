// import "server-only";

// import connectToDatabase from "@/app/db/index"; // Path to your DB connection
// import UserModel from "@/lib/mongoose/scheemas/user"; // Path to your User schema
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Extract the username from the request body
//     const { name, email } = await req.json(); // `req.json()` in app router instead of `req.body`

//     // Create a new user
//     const newUser = new UserModel({ name, email });
//     await newUser.save();

//     // Return the new user
//     return NextResponse.json(newUser, { status: 201 });
//   } catch (error) {
//     console.error("Error creating user:", error);

//     const errorMessage =
//       (error as Error).message || "An unknown error occurred";
//     return NextResponse.json(
//       { message: "Server error", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }
// /pages/api/user.js

import { saveDBToFile } from "../../utils/memory-db";
import UserModel from "@/lib/mongoose/scheemas/user";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Connect to the in-memory MongoDB

  // Parse JSON from the request body
  const { email, name, username } = await req.json();

  // Create a new user in the in-memory MongoDB
  const newUser = await UserModel.create({ email, name, username });

  // Save the current DB state to db.json
  const savedUser = await newUser.save();

  if (savedUser) {
    console.log("user created ");
  }

  if (!savedUser) {
    console.log("failed to crete");
  }

  const savedUserToJSON = await saveDBToFile();

  if (savedUserToJSON) {
    console.log("user written to file");
  }

  if (!savedUserToJSON) {
    console.log("user written to file has failed");
  }
  // Return the response with status 201
  return NextResponse.json(
    { message: "User created", newUser },
    { status: 201 }
  );
}

export async function GET() {
  // Connect to the in-memory MongoDB

  // Retrieve all users from the in-memory MongoDB
  const users = await UserModel.find({});

  // Return the response with the list of users
  return NextResponse.json({ users }, { status: 200 });
}

export function handler() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
