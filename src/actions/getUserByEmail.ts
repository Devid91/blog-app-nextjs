"use server";
import UserModel from "@/app/utils/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";
import { getServerSession } from "next-auth";
import validator from "email-validator";
import { validateEmail } from "@/app/utils/lib/zodvalidation/validateEmail";

// Function to get a user by email alongside username
const getUserByEmail = async (email: string) => {
  const session = await getServerSession();

  console.log(session);

  // Authentication and Authorization check: user must be logged in and can only update their own data
  if (!session) {
    console.log("Session is null, not authenticated");
    return null;
  }

  if (session.user.email !== email) {
    console.log("Not authorized");
    return null;
  }

  if (!email || typeof email !== "string") {
    console.error("Invalid email:", email);
    return null;
  }

  // Validate the email length format using `validateEmail`
  const userEmailLengthValidation = validateEmail(email);
  if (!userEmailLengthValidation.success) {
    console.error("Email validation failed:", userEmailLengthValidation.error);
    return null;
  }

  const isEmailFormatValid = validator.validate(email);
  if (!isEmailFormatValid) {
    console.log("Email format is invalid");
    return null;
  }

  // Connect to the database
  await connectToDatabase();

  try {
    // Fetch the user with email and username fields
    const user = await UserModel.findOne({ email }).select("email username");

    console.log("user from getuserbyemail: ", user?.email, user?.username);

    if (!user) {
      console.log("User not found");
      return null;
    }

    // Return the user object with email and username

    return {
      email: user.email,
      username: user.username ?? null, // Ensure `username` is explicitly set to `null` if not present
    };
  } catch (error) {
    console.error("Error fetching user from DB:", error);
    throw new Error("Error fetching user from the database.");
  }
};

export default getUserByEmail;
