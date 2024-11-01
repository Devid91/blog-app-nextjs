"use client";

import {
  signIn,
  signOut as NextAuthSignOut,
  useSession,
  signOut,
} from "next-auth/react";
import { useState } from "react";
import updateUserName from "@/actions/updateUserName";

export default function Home() {
  const { data: session, status, update } = useSession();
  const [userName, setUserName] = useState("");

  const handleUpdateUserName = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure session data is present
    if (session?.user?.email) {
      try {
        // Call the API to update the username in the database
        const result = await updateUserName(session.user.email, userName);

        // Check if result contains the updated username
        if (result && result.username) {
          // Wrap session update in an anonymous function
          (async () => {
            console.log("Attempting to update session...");
            try {
              await update({
                ...session,
                user: {
                  ...session.user,
                  username: result.username, // Use the actual updated username
                },
              });
              console.log("Session updated successfully.");
            } catch (updateError) {
              console.error("Error updating session:", updateError);
            }
          })();

          // Clear the input field after update
          setUserName("");
        } else {
          console.error(
            "Username update failed: No username returned in result."
          );
        }
      } catch (error) {
        console.error("Error updating userName:", error);
      }
    }
  };

  // Check session status
  if (status === "loading") {
    return <p>Loading...</p>; // Show loading message while session is loading
  }

  if (status === "authenticated" && session?.user?.email) {
    return (
      <>
        <div>
          <p>You are signed in as {session.user.name}!</p>
          <button
            type="button"
            onClick={async () => {
              // Sign out without redirection
              await signOut();
              await NextAuthSignOut();
            }}
          >
            Sign Out
          </button>
        </div>
        <div>
          <h1>Update userName</h1>
          <form onSubmit={handleUpdateUserName}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter new userName"
            />
            <button type="submit">Update userName</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <button type="submit" onClick={() => signIn("google")}>
      Sign Up with Google
    </button>
  );
}
