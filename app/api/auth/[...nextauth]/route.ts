// app/api/auth/[...nextauth]/route.ts
import { authConfig } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authConfig);

export const GET = handler;
export const POST = handler;