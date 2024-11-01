import { getServerSession } from "next-auth";
import handler from "@/app/(auth)/auth";

export default async function Page() {
  const session = await getServerSession(handler);
  return (
    <div>
      <h1>Session Data</h1>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}
