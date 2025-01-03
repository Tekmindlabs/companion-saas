import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { Resend } from 'resend';
import { Role } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";
import type { DefaultSession } from "next-auth";

// Define types
type UserRole = Role;

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      email?: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    id?: string;
    email?: string | null;
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

const logWithTimestamp = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
  const timestamp = new Date().toISOString();
  const icons = { info: 'ℹ️', error: '❌', success: '✅' };
  console.log(`[${timestamp}] ${icons[type]} ${message}`);
};

export const authConfig: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }: { session: any; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: User | undefined; }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string; }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logWithTimestamp('Login attempt failed: Missing credentials', 'error');
            return null;
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.password) {
            logWithTimestamp(`Login attempt failed: User not found - ${credentials.email}`, 'error');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            logWithTimestamp(`Login attempt failed: Invalid password - ${credentials.email}`, 'error');
            return null;
          }

          if (process.env.RESEND_API_KEY && process.env.RESEND_FROM && user.email) {
            try {
              await resend.emails.send({
                from: process.env.RESEND_FROM,
                to: [user.email],
                subject: "New Login to Your Account",
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>New Login Detected</h2>
                    <p>Hello ${user.name || user.email},</p>
                    <p>We detected a new login to your account.</p>
                    <p><strong>Details:</strong></p>
                    <ul>
                      <li>Time: ${new Date().toLocaleString()}</li>
                      <li>Email: ${user.email}</li>
                    </ul>
                    <p>If this wasn't you, please contact support immediately.</p>
                    <p>Best regards,<br>Your Application Team</p>
                  </div>
                `,
              });
              logWithTimestamp(`Email sent successfully!`, 'success');
            } catch (error) {
              logWithTimestamp(`Failed to send login notification email: ${error}`, 'error');
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          logWithTimestamp(`Authorization error: ${error}`, 'error');
          return null;
        }
      }
    })
  ],
  events: {
    async signIn({ user }: { user: User }) {
      logWithTimestamp(`User signed in: ${user.email}`, 'success');
    },
    async signOut() {
      logWithTimestamp(`User signed out`, 'info');
    }
  }
};