"use server";

import UserModel from "@/app/utils/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";
import { validateUsername } from "@/app/utils/lib/zodvalidation/validateUsername";
import { getServerSession } from "next-auth";
import validator from "email-validator";

export default async function testUpdateUserName(
  email: string = "markodavid19910320@gmail.com",
  username: string = "Devid91"
) {
  try {
    const session = await getServerSession();

    console.log(session);

    // Authentication and Authorization check: user must be logged in and can only update their own data
    //todo > good
    if (!session) {
      console.log("Session is null, not authenticated");
      return { error: "Not authenticated" };
    }
    //todo > good!
    if (session.user.email !== email) {
      console.log(" not authorized");
      return { error: "Unauthorized" };
    }

    // Check that the email and username are provided correctly
    //todo > good!
    if (!email || typeof email !== "string") {
      console.error("Invalid email:", email);
      return { error: "Email is required and must be a string." };
    }
    //todo > good!
    if (!username || typeof username !== "string") {
      console.error("Invalid username:", username);
      return { error: "Username is required and must be a string." };
    }

    // Check email formatted correct in local machine, before double check by Arcjet --potentially save extra reqs
    //todo > good!
    const EmailFormatLocalValidator = validator.validate(email);

    if (!EmailFormatLocalValidator) {
      console.log("Email format is not valid  checked");
      return { error: "Invalid email format" };
    }

    // Validate the username using Zod validation
    const validation = validateUsername(username);
    //todo > good!
    if (!validation.success || !validation.data) {
      console.error("Username validation failed:", validation.error);
      return { error: validation.error || "Invalid username" };
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user in the database
    const user = await UserModel.findOne({ email });

    if (!user) {
      return { error: "User not found." };
    }

    // Update the username in the database
    user.username = validation.data;

    try {
      await user.save();
      return { username: user.username };
    } catch (saveError) {
      console.error("Error saving updated user:", saveError);
      return { error: "Failed to save updated user data." };
    }
  } catch (error) {
    console.error("Unexpected error in updateUserName:", error);
    throw new Error("Failed to update username due to server error.");
  }
}
