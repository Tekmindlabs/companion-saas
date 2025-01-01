import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { Resend } from 'resend';
import { JWT } from "next-auth/jwt";

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

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
      }
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role as UserRole;
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
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

        // Verify environment variables
        if (!process.env.RESEND_API_KEY) {
          logWithTimestamp('RESEND_API_KEY is not configured!', 'error');
        }
        if (!process.env.RESEND_FROM) {
          logWithTimestamp('RESEND_FROM is not configured!', 'error');
        }

        // Send login notification email
        if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
          try {
            const emailResponse = await resend.emails.send({
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
            logWithTimestamp(`Failed to send login notification email to ${user.email}`, 'error');
            logWithTimestamp(`Error details: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
            
            try {
              await db.auditLog.create({
                data: {
                  userId: user.id,
                  action: 'LOGIN_EMAIL_FAILED',
                  details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString(),
                    email: user.email
                  },
                }
              });
              logWithTimestamp('Audit log created for failed email attempt', 'info');
            } catch (logError) {
              logWithTimestamp(`Failed to create audit log: ${logError instanceof Error ? logError.message : 'Unknown error'}`, 'error');
            }
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || null,
          role: user.role as UserRole,
        };
      }
    })
  ]
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);