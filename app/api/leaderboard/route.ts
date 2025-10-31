import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "all-time";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    let startDate: Date | undefined;

    // Calculate date range based on timeframe
    if (timeframe === "daily") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "weekly") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === "monthly") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }

    // Fetch users with rankings
    const users = await prisma.user.findMany({
      where: startDate
        ? {
            submissions: {
              some: {
                createdAt: {
                  gte: startDate,
                },
                verdict: "ACCEPTED",
              },
            },
          }
        : undefined,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        xp: true,
        _count: {
          select: {
            submissions: true,
            problemStats: {
              where: { solved: true },
            },
            achievements: true,
          },
        },
      },
      orderBy: [
        {
          xp: "desc",
        },
        {
          problemStats: {
            _count: "desc",
          },
        },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate level for each user
    const leaderboard = users.map((user, index) => {
      const level = Math.floor(Math.sqrt(user.xp / 5)) + 1;
      const rank = (page - 1) * limit + index + 1;

      return {
        rank,
        userId: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        xp: user.xp,
        level,
        problemsSolved: user._count.problemStats,
        totalSubmissions: user._count.submissions,
        acceptanceRate:
          user._count.submissions > 0
            ? Math.round(
                (user._count.problemStats / user._count.submissions) * 100,
              )
            : 0,
        currentStreak: 0, // TODO: Calculate streak
        maxStreak: 0, // TODO: Calculate streak
        achievementsCount: user._count.achievements,
      };
    });

    // Get total user count for pagination
    const totalCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      leaderboard,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      timeframe,
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}

// Get specific user rank
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's problem count for ranking
    const userProblemCount = await prisma.problemStat.count({
      where: { userId: user.id, solved: true },
    });

    // Count users who rank higher than this user
    // First, count users with higher XP
    const higherXpCount = await prisma.user.count({
      where: {
        xp: {
          gt: user.xp,
        },
      },
    });

    // Then count users with same XP but more solved problems
    const sameXpUsers = await prisma.user.findMany({
      where: {
        xp: user.xp,
        id: {
          not: user.id, // Exclude current user
        },
      },
      select: {
        id: true,
        _count: {
          select: {
            problemStats: {
              where: { solved: true },
            },
          },
        },
      },
    });

    const sameXpHigherProblems = sameXpUsers.filter(
      u => u._count.problemStats > userProblemCount,
    ).length;

    const rank = higherXpCount + sameXpHigherProblems + 1;
    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      success: true,
      rank,
      totalUsers,
      percentile: Math.round(((totalUsers - rank) / totalUsers) * 100),
    });
  } catch (error) {
    console.error("User rank fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user rank" },
      { status: 500 },
    );
  }
}
