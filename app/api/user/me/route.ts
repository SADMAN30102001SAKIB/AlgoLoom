import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        githubUrl: true,
        linkedinUrl: true,
        xp: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate dynamic statistics
    const [totalSubmissions, problemsSolved, currentStreak, maxStreak] =
      await Promise.all([
        prisma.submission.count({
          where: { userId: user.id },
        }),
        prisma.problemStat.count({
          where: { userId: user.id, solved: true },
        }),
        // For now, set streaks to 0 - can be calculated later if needed
        Promise.resolve(0),
        Promise.resolve(0),
      ]);

    const level = Math.floor(Math.sqrt(user.xp / 5)) + 1;

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        totalSubmissions,
        problemsSolved,
        currentStreak,
        maxStreak,
        level,
      },
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, username, bio, location, website, githubUrl, linkedinUrl } =
      body;

    // Check if username is taken (if changing)
    if (username && username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 },
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        username: username !== undefined ? username : user.username,
        bio: bio !== undefined ? bio : user.bio,
        location: location !== undefined ? location : user.location,
        website: website !== undefined ? website : user.website,
        githubUrl: githubUrl !== undefined ? githubUrl : user.githubUrl,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : user.linkedinUrl,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
