import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const allCompanies = await prisma.problem.findMany({
      select: {
        companies: true,
      },
    });

    // Flatten and count company occurrences
    const companyCounts: Record<string, number> = {};
    allCompanies.forEach(problem => {
      problem.companies.forEach(company => {
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const companies = Object.entries(companyCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error("Companies fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 },
    );
  }
}
