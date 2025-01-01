import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Initialize NextAuth with the configuration
const { auth: nextAuth, handlers } = NextAuth(authConfig);

// Export the auth function
export const auth = nextAuth;

// Export handlers for the route
export const { GET, POST } = handlers;

// If you need these functions elsewhere in your application
export const signIn = async (provider?: string, options?: any) => {
  const { signIn } = await import("next-auth/react");
  return signIn(provider, options);
};

export const signOut = async (options?: any) => {
  const { signOut } = await import("next-auth/react");
  return signOut(options);
};