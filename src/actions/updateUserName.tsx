// actions/updateUsername.ts
"use server";

import axios from "axios";

const updateUsername = async (email: string, username: string) => {
  try {
    // Send a request to your API route to update the username
    const response = await axios.post(
      "http://localhost:3000/api/update-username",
      { email, username },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && response.data.user) {
      // Return the updated user object
      return response.data.user; // `user` should contain the updated username
    } else {
      console.error("No user data returned in API response");
      return null;
    }
  } catch (error) {
    console.error("Error in updateUsername:", error);
    throw error; // Re-throw error for handling in calling function
  }
};

export default updateUsername;
