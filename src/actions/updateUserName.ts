// actions/updateUsername.ts
"use server";

import axios from "axios";
import { validateUsername } from "@/app/utils/lib/zodvalidation/validateUsername";

const updateUsername = async (email: string, username: string) => {
  try {
    // Validate the username using the external validation function
    const validation = validateUsername(username);

    if (!validation.success) {
      // Return the error message if validation failed
      console.error("Validation failed:", validation.error);
      return { error: validation.error };
    }

    // Proceed to update the username if validation was successful
    const response = await axios.post(
      "http://localhost:3000/api/update-username",
      { email, username: validation.data },
      { headers: { "Content-Type": "application/json" } }
    );

    // Check if API response contains user data
    if (response.data && response.data.user) {
      return response.data.user; // Return updated user object
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
