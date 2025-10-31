import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where = category
      ? {
          category: category as
            | "PROBLEM_SOLVING"
            | "STREAK"
            | "LEVEL"
            | "SPECIAL",
        }
      : undefined;

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [
        {
          category: "asc",
        },
        {
          xpReward: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      achievements: achievements.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        requirement: a.requirement,
        xpReward: a.xpReward,
      })),
    });
  } catch (error) {
    console.error("Achievements fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 },
    );
  }
}
