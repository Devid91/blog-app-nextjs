// pages/test.tsx
"use client";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Session Data</h1>
      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre> // Pretty print session
      ) : (
        <p>No session found.</p>
      )}
    </div>
  );
}
