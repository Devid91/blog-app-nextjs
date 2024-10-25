"use server";

import UserModel from "@/lib/mongoose/scheemas/user";

export default async function checkUserEmailInDB(email: string) {
  try {
    const user = await UserModel.findOne({
      email: email, // Only check if email matches
    });

    return user;
  } catch (error) {
    console.log("Error checking email in DB", error);
    return null;
  }
}
