import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

export default NextAuth(authConfig).auth;

// Update matcher to protect specific routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/chat/:path*",
    "/api/chat/:path*",
    "/api/companions/:path*",
  ],
};