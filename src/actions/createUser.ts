"use server";

import { validateUsername } from "@/app/utils/lib/zodvalidation/validateUsername";
import UserModel from "@/app/utils/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";
import validator from "email-validator";
import { request as ArcJetReq } from "@arcjet/next";
import { ajEmail } from "@/app/utils/lib/arcjet/arcjet";
import { validateEmail } from "@/app/utils/lib/zodvalidation/validateEmail";

const createUser = async (name: string, email: string) => {
  try {
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

    if (!name || typeof name !== "string") {
      console.error("Invalid username:", name);
      return { error: "Name is required and must be a string." };
    }

    // Validate email format locally to save unnecessary requests
    if (!validator.validate(email)) {
      console.error("Invalid email format");
      return { error: "Invalid email format." };
    }

    // Enforce strict domain validation for `@google.com`
    const isGmailEmail = email.toLowerCase().endsWith("@gmail.com");
    if (!isGmailEmail) {
      console.error("Only Gmail emails are allowed");
      console.log(email);
      console.log(isGmailEmail);
      return { error: "Only emails ending with '@gmail.com' are allowed." };
    }

    // Validate username using Zod validation
    const usernameValidation = validateUsername(name);
    if (!usernameValidation.success) {
      console.error("Username validation failed:", usernameValidation.error);
      return { error: usernameValidation.error };
    }

    // Check email against ArcJet
    const arcjetReq = await ArcJetReq();
    const decision = await ajEmail.protect(arcjetReq, { email });

    if (decision.isDenied()) {
      console.error("Email is invalid or blocked by ArcJet");
      return { error: "Email is invalid or blocked." };
    }

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.error("User with this email already exists");
      return { error: "User with this email already exists." };
    }

    const newUser = new UserModel({
      email,
      name,
      username: null, // Optional field
      avatar: null, // Default value, adjust as needed
    });

    try {
      await newUser.save();
      console.log("User created successfully");
      return { message: "User created successfully." };
    } catch (error) {
      console.log("Error saving new User");
      return { error: "Failed to save created user data." };
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    return { error: "An unexpected error occurred." };
  }
};

export default createUser;
