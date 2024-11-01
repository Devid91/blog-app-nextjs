"use server";
import axios from "axios";

const getUserByEmail = async (email: string) => {
  // TODO >> hide with in an .env variable
  try {
    const response = await axios.post(
      "http://localhost:3000/api/useremail",
      {
        email,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Return the found user, or `null` if the user was not found
    return response.data.userEmail;
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    throw error;
  }
};

export default getUserByEmail;
