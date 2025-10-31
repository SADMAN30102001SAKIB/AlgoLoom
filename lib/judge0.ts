import axios from "axios";

const JUDGE0_API_URL =
  process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export interface SubmissionData {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

interface Judge0BatchResponse {
  token?: string;
  tokens?: string[];
}

export interface Judge0Result {
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
}

// Batch submission - submit multiple test cases at once
export async function submitBatchToJudge0(
  submissions: SubmissionData[],
): Promise<string[]> {
  try {
    const response = await axios.post<Judge0BatchResponse>(
      `${JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
      { submissions },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      },
    );

    // Judge0 batch API can return either a single token or an array of tokens
    // Convert to array for consistency
    if (Array.isArray(response.data)) {
      return response.data.map((item: { token: string }) => item.token);
    }

    throw new Error("Unexpected batch response format");
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 429) {
        console.error("Judge0 rate limit exceeded");
        throw new Error(
          "Rate limit exceeded. Please try again later or wait for quota reset.",
        );
      }
    }
    console.error("Judge0 batch submission error:", error);
    throw new Error("Failed to submit batch to judge");
  }
}

// Get batch results
export async function getBatchResults(
  tokens: string[],
): Promise<Judge0Result[]> {
  try {
    const tokensString = tokens.join(",");
    const response = await axios.get<{ submissions: Judge0Result[] }>(
      `${JUDGE0_API_URL}/submissions/batch?tokens=${tokensString}&base64_encoded=true`,
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      },
    );

    // Decode base64 fields in the results
    const decodedSubmissions = response.data.submissions.map(result => {
      const decodeBase64 = (base64String: string | null): string | null => {
        if (!base64String) return null;
        try {
          return Buffer.from(base64String, "base64").toString("utf-8");
        } catch (error) {
          console.warn("Failed to decode base64 string:", error);
          return base64String; // Return original string if decoding fails
        }
      };

      return {
        ...result,
        stdout: decodeBase64(result.stdout),
        stderr: decodeBase64(result.stderr),
        compile_output: decodeBase64(result.compile_output),
        message: decodeBase64(result.message),
      };
    });

    return decodedSubmissions;
  } catch (error) {
    console.error("Judge0 batch result fetch error:", error);
    throw new Error("Failed to fetch batch results");
  }
}
