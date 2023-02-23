import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token is exist if the user is logged in

  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the request if the follloing is true...
  // 1) Its a request for next-auth session & provider fetching
  // 2) The Token exists

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect them to login if the request don't have token and are requesting a protedted route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
