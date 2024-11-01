import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET as string;

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")?.value;

  // Redirect to home if token is missing and not on the home page
  if (!token) {
    console.log("Error getting token: ", token);
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Attempt to decode the token
    const decodedToken = await decode({ token, secret });
    if (!decodedToken) {
      // Redirect to home if token decoding failed and not already on the home page
      console.log("error decoding token and session: ", token, secret);
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Extract user info from the decoded token
    const user = decodedToken?.username as string;

    // Redirect to /set-username if user.username is missing and not already there or on home page
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    // Redirect to home page on error
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Proceed if everything is fine
  return NextResponse.next();
}
// TODO >> figure out conditional middleware , if token ,session exist and decoded and user has truthy value allow to the protected routes
//Middleware configuration to match specific routes
export const config = {
  matcher: [
    "/dashboard/:path*", // Protect all routes under /dashboard
    "/profile/:path*", // Protect all routes under /profile // Protect a specific route
    "/write",
    "/login",
    // Another specific route
  ],
};
