import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession, AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { Resend } from 'resend';
import { JWT } from "next-auth/jwt";
import { User } from "@prisma/client";

// Define custom types
type UserRole = "USER" | "ADMIN";

// Extend the Session type instead of User
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    sub?: string;
    id?: string;
  }
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Add logging helper function
const logWithTimestamp = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
  const timestamp = new Date().toISOString();
  const icons = {
    info: 'ℹ️',
    error: '❌',
    success: '✅'
  };
  console.log(`[${timestamp}] ${icons[type]} ${message}`);
};

export const authConfig: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user: User | null; account: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<User | null> {
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

          logWithTimestamp(`Successful login: ${credentials.email}`, 'success');

          // Email notification logic
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

          return user;
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
    async signOut({ token }: { token: JWT }) {
      logWithTimestamp(`User signed out`, 'info');
    },
    async error(error: Error) {
      logWithTimestamp(`Auth error: ${error}`, 'error');
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);