import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";

export async function POST(req: NextRequest) {
  connectToDatabase();

  try {
    const { email, username } = await req.json();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.username = username;

    await user.save();

    return NextResponse.json({
      message: "Username updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating detail: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
