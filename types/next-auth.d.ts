// Extend the User type
declare module "next-auth/adapters" {
  interface AdapterUser {
    email: string;
    name: string;
    avatar?: string | null;
    username?: string | null; // Add the username property
    createdAt?: Date; // Optional createdAt field
    updatedAt?: Date; // Optional updatedAt field
  }
}
