// Check Judge0 RapidAPI quota
require("dotenv").config();

const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST || "judge0-ce.p.rapidapi.com";

if (!JUDGE0_API_KEY) {
  console.error("❌ JUDGE0_API_KEY not found in .env file");
  process.exit(1);
}

async function checkQuota() {
  try {
    console.log("🔍 Checking Judge0 API quota...\n");

    // Make a simple request to get headers
    const response = await fetch(`https://${JUDGE0_HOST}/languages`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": JUDGE0_HOST,
      },
    });

    // Extract quota information from headers
    const headers = response.headers;

    console.log("📊 RapidAPI Quota Information:");
    console.log("═".repeat(50));

    const quotaLimit = headers.get("x-ratelimit-requests-limit");
    const quotaRemaining = headers.get("x-ratelimit-requests-remaining");
    const quotaReset = headers.get("x-ratelimit-requests-reset");

    if (quotaLimit) {
      console.log(`✅ Total Requests Limit:     ${quotaLimit}`);
    }

    if (quotaRemaining) {
      console.log(`🔢 Requests Remaining:       ${quotaRemaining}`);
      const used = quotaLimit
        ? parseInt(quotaLimit) - parseInt(quotaRemaining)
        : "N/A";
      console.log(`📈 Requests Used:            ${used}`);

      // Calculate percentage
      if (quotaLimit) {
        const percentUsed = ((used / parseInt(quotaLimit)) * 100).toFixed(2);
        const percentRemaining = (100 - percentUsed).toFixed(2);
        console.log(`📊 Usage:                    ${percentUsed}%`);
        console.log(`💚 Remaining:                ${percentRemaining}%`);
      }
    }

    if (quotaReset) {
      const resetDate = new Date(parseInt(quotaReset) * 1000);
      console.log(`⏰ Quota Resets:             ${resetDate.toLocaleString()}`);
    }

    console.log("═".repeat(50));

    // Check response status
    if (response.ok) {
      console.log("✅ API Status:               Active and working!");
    } else {
      console.log(
        `⚠️  API Status:               ${response.status} ${response.statusText}`,
      );
    }

    // Show all rate-limit headers
    console.log("\n🔧 All Rate Limit Headers:");
    console.log("─".repeat(50));
    for (const [key, value] of headers.entries()) {
      if (
        key.toLowerCase().includes("rate") ||
        key.toLowerCase().includes("limit")
      ) {
        console.log(`${key}: ${value}`);
      }
    }
  } catch (error) {
    console.error("❌ Error checking quota:", error.message);
    process.exit(1);
  }
}

checkQuota();
