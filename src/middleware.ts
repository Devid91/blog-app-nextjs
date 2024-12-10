import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import {
  getTokenFromRequest,
  decodeToken,
  getUsernameFromToken,
} from "./server-utils/server-utils";
import { arcJetMiddleware } from "./server-utils/server-utils";

// TODO >> how to make a separate strings for production and development modes in NextJS
// Define the matcher for ArcJet middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply ArcJet to all routes except static and image assets
};

// Define routes that require token validation
const protectedRoutes = ["/write"];

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  // Step 1: Process ArcJet middleware
  // const arcJetResponse = await arcJetMiddleware(request, event);

  // // If ArcJet explicitly blocks or redirects, honor it
  // if (arcJetResponse && arcJetResponse.status !== 200) {
  //   return arcJetResponse; // If ArcJet returns a response (block or redirect), return it
  // }

  const pathname = request.nextUrl.pathname;

  // Step 2: Check if the pathname matches any protected route
  const isProtectedRoute = protectedRoutes.includes(pathname);

  // If it's a protected route, perform token validation
  if (isProtectedRoute) {
    const token = getTokenFromRequest(request);

    const decodedToken = token ? await decodeToken(token) : null;
    const user = decodedToken ? getUsernameFromToken(decodedToken) : null;

    if (!token || !decodedToken || !user) {
      // Redirect to home if token validation fails
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Step 3: Allow the request to proceed
  return NextResponse.next();
}
