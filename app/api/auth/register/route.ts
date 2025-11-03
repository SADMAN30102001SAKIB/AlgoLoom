import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  generateVerificationToken,
  createVerificationToken,
  sendVerificationEmail,
} from "@/lib/email";

// Generate unique username from name
function generateUsername(name: string): string {
  // Convert to lowercase, remove special chars, replace spaces with empty string
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 20); // Limit length
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // Generate unique username from name
    const baseUsername = generateUsername(name);
    let username = baseUsername;
    let counter = 1;

    // Keep trying until we find a unique username
    while (true) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (!existingUsername) {
        break; // Username is unique
      }

      // Append counter and try again
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (emailVerified is null until they verify)
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: "USER",
        emailVerified: null, // Explicitly set to null - user must verify
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate and send verification email
    const verificationToken = generateVerificationToken();
    await createVerificationToken(email, verificationToken);
    await sendVerificationEmail(email, name, verificationToken);

    return NextResponse.json({
      success: true,
      message:
        "Account created successfully! Please check your email to verify your account.",
      user,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 },
    );
  }
}
