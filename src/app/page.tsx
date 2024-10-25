"use client";

import { useState } from "react";
import axios from "axios";

import {
  signIn,
  signOut,
  useSession,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import checkUserNameInDB from "@/actions/checkUserNameInDB";

export default function Home() {
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState(""); // Use state to store the input value
  const { status } = useSession();

  const handleDeleteClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/delete-data"
      );
      console.log("Data deleted successfully:", response.data.message);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const setCookie = async (username: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/cookie", // Use relative URL for better portability
        { username },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Cookie set successfully");
    } catch (error) {
      console.error("Error setting cookie", error);
      throw new Error("Failed to set cookie");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSaving(true);

    await setCookie(userName);

    const userNameResult = await checkUserNameInDB(userName);

    if (userNameResult) {
      console.log(`userName already exist in DB: ${userName}`);
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      setIsSaving(false);
      signIn("google");
    }, 250);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;
    setUserName(username);
  };

  // Show loading state
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // User is authenticated (signed in)
  if (status === "authenticated") {
    return (
      <div>
        <p>You are signed in!</p>
        <button
          type="submit"
          onClick={async () => {
            // Sign out without redirection
            await signOut();
            await nextAuthSignOut({ redirect: false });
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  // User is not signed in
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username" // The form name should reflect the input purpose
            onChange={handleChange} // Handle changes using state updater
            value={userName} // Bind input value to state
            required
          />
        </div>
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Sign In With Google"}
        </button>
      </form>

      <button type="submit" onClick={handleDeleteClick}>
        Delete data from memory
      </button>
    </>
  );
}
