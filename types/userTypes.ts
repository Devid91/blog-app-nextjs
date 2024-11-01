import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
  id: string;
  avatar?: string | null;
  username?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
