import "server-only";

import { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";
import { ajMiddleware } from "@/app/utils/lib/arcjet/arcjet";
import { createMiddleware } from "@arcjet/next";

const secret = process.env.NEXTAUTH_SECRET as string;

// Function to get the token from cookies
export const getTokenFromRequest = (request: NextRequest): string | null => {
  const token = request.cookies.get("next-auth.session-token")?.value || null;
  if (!token) {
    console.log("Error getting token: ", token);
  }
  return token;
};

// Function to decode the token
export const decodeToken = async (
  token: string | null
): Promise<any | null> => {
  if (!token) return null;

  try {
    const decodedToken = await decode({ token, secret });
    if (!decodedToken) {
      console.log("Error decoding token:", token, secret);
    }
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Function to extract the username from the decoded token
export const getUsernameFromToken = (decodedToken: any): string | null => {
  const user = decodedToken?.username || null;
  if (!user) {
    console.log("Username is missing in the decoded token:", decodedToken);
  }
  return user;
};

export const arcJetMiddleware = createMiddleware(ajMiddleware);
