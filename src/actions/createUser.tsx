"use server";

import axios from "axios";
const createUser = async (name: string, email: string) => {
  // TODO >> hide with in an .env variable
  try {
    const apiResponse = await axios.post(
      "http://localhost:3000/api/user",
      { name, email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return apiResponse;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

export default createUser;
