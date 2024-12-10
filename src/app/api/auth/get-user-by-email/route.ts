import { NextResponse } from "next/server";
import UserModel from "@/app/utils/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";
import { getServerSession } from "next-auth";
import authOptions from "@/app/utils/lib/nextauth/auth";
import validator from "email-validator";
import { validateEmail } from "@/app/utils/lib/zodvalidation/validateEmail";

export async function POST(request: Request) {
  try {
    // Parse JSON payload from the request body
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Add the cookies manually to the `getServerSession` request
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("Session is null, not authenticated");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.email !== email) {
      console.log("Not authorized");
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Validate the email format and length
    const userEmailLengthValidation = validateEmail(email);
    if (!userEmailLengthValidation.success) {
      return NextResponse.json(
        { error: "Email length validation failed" },
        { status: 400 }
      );
    }

    const EmailFormatLocalValidator = validator.validate(email);
    if (!EmailFormatLocalValidator) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user information
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
