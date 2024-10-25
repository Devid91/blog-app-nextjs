// actions/createNewUserInDB.js
"use server";

import UserModel from "@/lib/mongoose/scheemas/user";

export default async function createNewUserInDB(
  email: string,
  name: string,
  username: string | null
) {
  try {
    // Create a new user document
    const newUser = new UserModel({
      email,
      name,
      username,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return the saved user data (omit sensitive info if needed)
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null; // Handle errors gracefully
  }
}
