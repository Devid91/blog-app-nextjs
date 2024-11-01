import { NextRequest } from "next/server";
import UserModel from "@/lib/mongoose/scheemas/user";
import connectToDatabase from "@/app/db";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  connectToDatabase();

  try {
    const userEmail = await UserModel.findOne({ email });

    // Respond with the user if found, otherwise respond with `null`
    return new Response(JSON.stringify({ userEmail }), { status: 200 });
  } catch (error) {
    console.error("Error checking username in DB", error);
    return new Response(JSON.stringify({ error: "Error checking username" }), {
      status: 500,
    });
  }
}
