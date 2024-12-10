"use client";

import { SessionProvider } from "next-auth/react";

interface NextAuthProvidersProps {
  children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProvidersProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
