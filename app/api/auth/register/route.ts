import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Send verification email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: [email],
        subject: "Welcome to Our Platform!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Our Platform</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering! We're excited to have you on board.</p>
            <p>To get started, please verify your email by clicking the link below:</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${user.id}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>If you didn't create this account, please ignore this email.</p>
            <p>Best regards,<br>Your Application Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Continue with registration even if email fails
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}