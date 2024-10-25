import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Set a cookie server-side
export async function POST(req: Request) {
  const { username } = await req.json();
  const response = NextResponse.json({ message: "Cookie set successfully" });

  // Set the 'username' cookie
  response.cookies.set("username", username, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust for local vs. prod
    secure: process.env.NODE_ENV === "production", // Secure in production
  }); // 1-week expiry
  return response;
}

// Get the cookie server-side
export async function GET() {
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;

  if (!username) {
    return NextResponse.json({ message: "No username cookie found" });
  }

  return NextResponse.json({ username });
}

// import { NextRequest, NextResponse } from "next/server";

// // POST route to set the cookie
// export async function POST(req: NextRequest) {
//   const { username } = await req.json();

//   if (!username) {
//     return NextResponse.json(
//       { message: "Username is required" },
//       { status: 400 }
//     );
//   }

//   const response = NextResponse.json(
//     { message: "Cookie set successfully" },
//     { status: 200 }
//   );

//   // Set the username cookie
//   response.cookies.set("username", username, {
//     httpOnly: true,
//     path: "/",
//     maxAge: 60 * 60 * 24, // 1 day expiration
//   });

//   return response;
// }
