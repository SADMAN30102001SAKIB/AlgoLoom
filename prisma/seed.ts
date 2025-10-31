import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const seedsDir = path.join(__dirname, "seeds");

function loadJSON(filename: string) {
  const p = path.join(seedsDir, filename);
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) {
      console.error("Failed to parse", p, e);
      return [];
    }
  }
  return [];
}

const easyProblems: any[] = loadJSON("easyProblemSeeds.json");
const mediumProblems: any[] = loadJSON("mediumProblemSeeds.json");
const hardProblems: any[] = loadJSON("hardProblemSeeds.json");

// Allow seeding only a single chunk by setting SEED_CHUNK env var to 'easy'|'medium'|'hard'.
const SEED_CHUNK = (process.env.SEED_CHUNK || "all").toLowerCase();
let SAMPLE_PROBLEMS: any[] = [];
if (SEED_CHUNK === "easy") SAMPLE_PROBLEMS = easyProblems;
else if (SEED_CHUNK === "medium") SAMPLE_PROBLEMS = mediumProblems;
else if (SEED_CHUNK === "hard") SAMPLE_PROBLEMS = hardProblems;
else SAMPLE_PROBLEMS = [...easyProblems, ...mediumProblems, ...hardProblems];

const ACHIEVEMENTS = [
  {
    slug: "first-blood",
    name: "First Blood",
    description: "Solve your first problem",
    icon: "🎯",
    category: "MILESTONE",
    requirement: "1",
    xpReward: 20,
  },
  {
    slug: "problem-solver",
    name: "Problem Solver",
    description: "Solve 10 problems",
    icon: "🔥",
    category: "MILESTONE",
    requirement: "10",
    xpReward: 100,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@algoloom.com" },
    update: {},
    create: {
      email: "admin@algoloom.com",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
      xp: 1000,
      level: 11, // Math.floor(1000 / 100) + 1 = 11
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create achievements
  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: {},
      create: achievement as any,
    });
  }
  console.log("✅ Achievements created");

  // Create sample problems
  for (const problem of SAMPLE_PROBLEMS) {
    const { testCases, ...problemData } = problem;
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: {},
      create: {
        ...problemData,
        publishedAt: new Date(),
        testCases: {
          create: testCases,
        },
      } as any,
    });
  }
  console.log("✅ Sample problems created");

  console.log("🎉 Seeding completed!");
}

main()
  .catch(e => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
