"use server";

import UserModel from "@/lib/mongoose/scheemas/user";

export default async function checkUserNameInDB(username: string | undefined) {
  try {
    const user = await UserModel.findOne({
      username: username, // Only check if username matches
    });

    return user;
  } catch (error) {
    console.log("Error checking username in DB", error);
    return null;
  }
}
