import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/problems/[slug]/mark-hint-used - Mark that user viewed hints for this problem
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get problem
    const problem = await prisma.problem.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Check if user has already solved this problem
    const existingStat = await prisma.problemStat.findUnique({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId: problem.id,
        },
      },
      select: {
        solved: true,
        hintsUsed: true,
      },
    });

    // Only mark hints as used if the problem was never solved
    // If already solved, hintsUsed should remain false
    if (existingStat?.solved === true) {
      return NextResponse.json({
        success: true,
        message: "Hints not tracked for already solved problems",
      });
    }

    // Upsert ProblemStat with hintsUsed = true (only if not already solved)
    await prisma.problemStat.upsert({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId: problem.id,
        },
      },
      update: {
        hintsUsed: true,
      },
      create: {
        userId: user.id,
        problemId: problem.id,
        hintsUsed: true,
        status: "UNTOUCHED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark hint used error:", error);
    return NextResponse.json(
      { error: "Failed to mark hint as used" },
      { status: 500 },
    );
  }
}
