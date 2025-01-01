import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

export const { auth, signIn, signOut } = NextAuth(authConfig)

// Export handlers
export const GET = auth
export const POST = auth