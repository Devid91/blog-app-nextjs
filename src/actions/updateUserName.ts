"use server";

import UserModel from "@/app/utils/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";
import { validateUsername } from "@/app/utils/lib/zodvalidation/validateUsername";
import { getServerSession } from "next-auth";
import validator from "email-validator";
import { ajEmail } from "@/app/utils/lib/arcjet/arcjet";
import { request } from "@arcjet/next";
import { validateEmail } from "@/app/utils/lib/zodvalidation/validateEmail";

export default async function UpdateUserName(email: string, username: string) {
  try {
    const session = await getServerSession();

    console.log("session: ", session);

    // Authentication and Authorization check: user must be logged in and can only update their own data

    if (!session) {
      console.log("Session is null, not authenticated");
      return { error: "Not authenticated" };
    }
    if (session.user.email !== email) {
      console.log("Not authorized");
      return { error: "Unauthorized" };
    }

    // Check that the email and username are provided correctly

    if (!email || typeof email !== "string") {
      console.error("Invalid email:", email);
      return { error: "Email is required and must be a string." };
    }

    // Validate the email length format using `validateEmail`
    const userEmailLengthValidation = validateEmail(email);

    if (!userEmailLengthValidation.success) {
      console.error(
        "Username validation failed:",
        userEmailLengthValidation.error
      );
      return { error: userEmailLengthValidation.error };
    }

    if (!username || typeof username !== "string") {
      console.error("Invalid username:", username);
      return { error: "Username is required and must be a string." };
    }

    // Check email formatted correctly locally before additional checks
    const EmailFormatLocalValidator = validator.validate(email);

    if (!EmailFormatLocalValidator) {
      console.log("Email format is not valid");
      return { error: "Invalid email format" };
    }

    // Enforce strict domain validation for `@gmail.com`
    const isGmailEmail = email.toLowerCase().endsWith("@gmail.com");
    if (!isGmailEmail) {
      console.error("Only Gmail emails are allowed");
      return { error: "Only emails ending with '@gmail.com' are allowed." };
    }

    // Validate the username using Zod validation
    const validation = validateUsername(username);

    if (!validation.success || !validation.data) {
      console.error("Username validation failed:", validation.error);
      return { error: validation.error || "Invalid username" };
    }

    // Validate the email using Arcjet's protect method
    const req = await request();
    const decision = await ajEmail.protect(req, {
      email,
    });

    // If the email is denied, return an error message
    if (decision.isDenied()) {
      console.log("Email is invalid or blocked");
      return { error: "Email is invalid or blocked." };
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
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        const saveError = error as any;
        const validationMessages = Object.values(saveError.errors).map(
          (err: any) => err.message
        );
        console.error("Validation errors:", validationMessages);
        return { error: validationMessages.join(", ") };
      }

      console.error("Error saving updated user:", error);
      return { error: "Failed to save updated user data." };
    }
  } catch (error) {
    console.error("Unexpected error in UpdateUserName:", error);
    // Catch all unexpected errors and return them in a structured format
    return { error: "An unexpected server error occurred." };
  }
}
