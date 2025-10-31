import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const allTags = await prisma.problem.findMany({
      select: {
        tags: true,
      },
    });

    // Flatten and count tag occurrences
    const tagCounts: Record<string, number> = {};
    allTags.forEach((problem) => {
      problem.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error("Tags fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
