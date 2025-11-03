"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";

export default function RegisterSuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Check your email
          </h1>

          <p className="text-muted-foreground text-lg">
            We&apos;ve sent a verification link to
          </p>

          <p className="text-lg font-semibold text-primary">
            {email || "your email"}
          </p>

          <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-3 text-left">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Next steps:</strong>
            </p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Open the verification email</li>
              <li>Click the verification link</li>
              <li>Sign in to start solving problems</li>
            </ol>
          </div>

          <div className="pt-4 space-y-3">
            <Link href="/login">
              <Button className="w-full" size="lg">
                Go to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link href="/register" className="text-primary hover:underline">
                try again
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
