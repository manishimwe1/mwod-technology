"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";
import SignInButton from "@/components/SignInButton";

function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <section className="flex items-center justify-center w-full h-screen bg-gray-900">
        <span className="flex items-center gap-2 justify-center text-white">
          <Loader2 className="animate-spin h-5 w-5" />
          Loading...
        </span>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center w-full h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Sign in to EasyFix</h2>
        </div>

        {/* {message && (
          <div className="mb-4 text-green-500 text-center">{message}</div>
        )} */}

        <div className="w-full mb-6">
          <SignInButton />
        </div>

        <div className="text-center text-sm text-gray-400 mb-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </div>

        <div className="text-center text-xs text-gray-500">
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          {" "}and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginPage />
    </Suspense>
  );
}