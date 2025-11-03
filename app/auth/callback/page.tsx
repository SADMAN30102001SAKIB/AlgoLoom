"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const callbackUrl = searchParams.get("callbackUrl");

      // Redirect based on role
      if (session.user.role === "ADMIN") {
        router.replace(callbackUrl || "/admin");
      } else {
        router.replace(callbackUrl || "/problems");
      }
    } else if (status === "unauthenticated") {
      // Not authenticated, redirect to login
      router.replace("/login");
    }
  }, [status, session, searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
