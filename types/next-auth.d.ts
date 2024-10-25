import { DefaultSession, DefaultUser } from "next-auth";

// Extend the DefaultUser interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Assuming you're storing user ID
      emailVerified?: boolean; // Add the emailVerified field
    } & DefaultSession["user"]; // Include existing user properties
  }

  interface User extends DefaultUser {
    emailVerified?: boolean; // Add the emailVerified field to User
  }
}
