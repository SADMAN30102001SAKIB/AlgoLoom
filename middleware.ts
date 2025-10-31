import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rate limiting storage (use Redis/Upstash in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // API rate limiting
  if (pathname.startsWith("/api/")) {
    const identifier = request.ip || "anonymous";

    // Different limits for different endpoints
    let limit = 100; // requests per minute
    const windowMs = 60 * 1000; // 1 minute

    if (pathname.startsWith("/api/submit-stream")) {
      limit = 1; // 1 submission per minute
    } else if (pathname.startsWith("/api/hints")) {
      limit = 5; // 5 hints per minute
    } else if (pathname.startsWith("/api/problems")) {
      limit = 30; // 30 problem fetches per minute
    }

    if (!rateLimit(identifier, limit, windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: response.headers },
      );
    }
  }

  // Protected routes - require authentication
  const protectedPaths = ["/problems", "/profile", "/leaderboard"];
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path),
  );

  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL("/login", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Admin-only routes
  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  if (isAdminPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
