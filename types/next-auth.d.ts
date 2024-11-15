// Extend the User type
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      image: string | null | undefined;
      avatar?: string | null;
      username?: string | null | undefined;
      createdAt?: Date | null | undefined;
      updatedAt?: Date | null | undefined; // Optional updatedAt field
    } & DefaultSession["user"];
  }
}
