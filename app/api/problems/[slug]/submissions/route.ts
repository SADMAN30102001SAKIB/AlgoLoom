import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Get problem
    const problem = await prisma.problem.findUnique({
      where: { slug: params.slug },
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Problem not found" },
        { status: 404 },
      );
    }

    // Fetch user's submissions for this problem
    const submissions = await prisma.submission.findMany({
      where: {
        userId: user.id,
        problemId: problem.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        verdict: true,
        runtime: true,
        memory: true,
        language: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
