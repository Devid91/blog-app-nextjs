"use server";

import "server-only";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import checkUserEmailInDB from "@/actions/checkUserEmailInDB";
import axios from "axios";

// Google Client Credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Must provide a Google Client ID and Client Secret");
}

const postToDBUrl = process.env.POST_TO_DB;

if (!postToDBUrl) {
  throw new Error("POST_TO_DB environment variable is not set.");
}

// Helper function to get the cookie value
const getCookie = async (): Promise<string | null> => {
  try {
    const response = await axios.get("http://localhost:3000/api/cookie", {
      withCredentials: true, // Ensure credentials are sent
      headers: { "Content-Type": "application/json" },
    });

    if (response?.data?.username) {
      console.log("Cookie fetched:", response.data.username);
      return response.data.username;
    } else {
      console.log("Cookie not found");
      console.log("Cookie data:", response.data.username);
      return null;
    }
  } catch (error) {
    console.error("Error fetching cookie:", error);
    return null;
  }
};

// Create a new user using the /api/user route
const createUserViaApi = async (
  email: string,
  name: string,
  username: string
) => {
  try {
    // Make a POST request to the /api/user route
    const response = await axios.post(
      "http://localhost:3000/api/user", // Adjust if needed for production
      { email, name, username },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User created successfully via API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating user via API:", error);
    throw new Error("Failed to create user");
  }
};

// Helper function to generate a random username (as fallback)
const generateRandomUsername = (): string => {
  const randomUserNumber = Math.floor(Math.random() * 10000) + 1;
  return `UserName${randomUserNumber}`;
};

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  callbacks: {
    // Callback to handle session
    async session({ session, user }: any) {
      try {
        const cookieValue = await getCookie();

        // If cookie exists, attach the username to the session
        if (session && user && cookieValue) {
          session.user.id = user.id;
          session.user.username = cookieValue;
          console.log("Session updated with cookie value:", cookieValue);
        } else if (session && user) {
          session.user.id = user.id;
          console.log("Session updated without cookie value");
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session; // Return session even in case of error, as a fallback
      }
    },

    // Sign-in callback to handle user sign-in and user creation
    async signIn({ user, account }: any) {
      try {
        if (account.provider === "google") {
          const emailFromGoogle = user.email;
          const nameFromGoogle = user.name;

          if (!emailFromGoogle) {
            console.error("Email is required");
            return false; // Fail sign-in if no email is provided
          }

          if (!nameFromGoogle) {
            console.error("Name is required");
            return false; // Fail sign-in if no name is provided
          }

          // Step 1: Check if email already exists in the DB
          const existingUser = await checkUserEmailInDB(emailFromGoogle);
          if (existingUser) {
            console.log(
              `User already exists with email: ${existingUser.email}`
            );
            return true; // User exists, proceed with sign-in
          }

          // Step 2: Retrieve cookie value for the username or generate a random one
          const cookieValue = await getCookie();
          const usernameToUse = cookieValue || generateRandomUsername();

          // Step 3: Create a new user in the DB
          await createUserViaApi(
            emailFromGoogle,
            nameFromGoogle,
            usernameToUse
          );
          console.log(`New user created with username: ${usernameToUse}`);
          return true;
        }

        return false; // Fail sign-in if the provider isn't Google
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Fail sign-in if an error occurs
      }
    },
  },
  // Secure cookies settings
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true, // Prevent access via JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax", // Protect against CSRF
        path: "/",
      },
    },
  },
};

// Export NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
