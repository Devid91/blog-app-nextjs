import { NextResponse } from "next/server";
import UserModel from "@/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";

export async function POST(request: Request) {
  const { email, name, username } = await request.json();
  connectToDatabase();

  try {
    const newUser = new UserModel({
      email,
      name,
      username: username || null, // Allow username to be null
      avatar: null, // Default value, adjust as necessar
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
