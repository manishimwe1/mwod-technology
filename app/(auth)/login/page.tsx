"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Suspense } from "react";
import { handleSignIn } from "@/lib/actions/signinActions";
import SignInButton from "@/components/SignInButton";
// Move schema outside component to prevent recreating on each render
const formSchema = z.object({
  identifier: z.string().min(2, "Enter your email or username"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [showPassword, setShowPassword] = useState(false);
  // WORK IN PROGRESS SHYIRAHO UBURYO UWO TWOHEREJE LINK USERNAME NA PASSWORD BYI POPLING
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  console.log({ session, status });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Redirect based on user role
      if (session.user.role === "client") {
        redirect("/");
      } else {
        redirect("/dashboard"); // Admin or other roles
      }
    }
  }, [status, session]);

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      setError(null);

      // Pass identifier (email or username) to the sign-in handler
      const response = await handleSignIn(values.identifier, values.password);

      if (response.success) {
        // Success case - form will be reset and redirection handled by useEffect
        form.reset();
        // You can customize the redirect target as needed
        return;
      }

      // Error case
      setError(response.error || "Failed to sign in");
      form.reset({ identifier: values.identifier, password: "" }); // Keep identifier, clear password
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (redirecting) {
    return (
      <section className="flex items-center justify-center w-full h-screen">
        <span className="flex items-center gap-2 justify-center">
          <Loader2 className="animate-spin h-5 w-5" />
          Login successful! Redirecting...
        </span>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center w-full h-screen">
      <div className="bg-[url('/images/bgimage.jpeg')] bg-cover bg-center bg-no-repeat h-full w-full -bg-conic-0z-50 relative ">
        <div className="bg-[url('/images/office.jpg')] absolute bg-cover bg-center bg-no-repeat h-full w-full opacity-40" />
        <div className="h-full w-full bg-indigo-900/10 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 z-50 absolute" />

        <div className="flex absolute py-4 lg:p-10 bg-indigo-50 h-fit w-full md:w-[600px] mx-auto inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow shadow-black/40 z-50">
          <div className="w-full h-full flex items-center flex-col space-y-4 justify-center px-2 py-4 lg:px-10 z-50">
            <div className="w-full px-4 md:px-0 flex flex-col items-center justify-center">
              {message ? (
                <div className="flex gap-2 flex-col pb-8">
                  <span className="text-pretty text-base text-green-700">
                    {message}
                  </span>
                </div>
              ) : (
                <h2 className="text-balance text-xl md:text-3xl font-bold tracking-tighter text-indigo-950  mb-6">
                  Welcome back 🤝
                </h2>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full"
                >
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-indigo-950">
                          Email or Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-indigo-950 border-indigo-200 border-2"
                            type="text"
                            placeholder="Enter your email or username"
                            autoComplete="username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-950">
                          Password
                        </FormLabel>
                        <FormControl className=" relative">
                          <div className="h-fit w-full">
                            <Input
                              className="text-indigo-950 border-indigo-200 border-2"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              {...field}
                            />
                            {showPassword ? (
                              <EyeOff
                                className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer text-indigo-500 transition-all duration-1000 ease-in-out"
                                onClick={() => setShowPassword(false)}
                              />
                            ) : (
                              <Eye
                                className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer text-indigo-500"
                                onClick={() => setShowPassword(true)}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <Button
                    disabled={loading}
                    className="w-full bg-indigo-600 disabled:bg-stone-700 disabled:cursor-wait hover:bg-indigo-700 shadow-lg shadow-black/50 cursor-pointer"
                    type="submit"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Loader2 className="animate-spin h-4 w-4" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <div className="flex items-center justify-between gap-4 w-full">
                    <Link
                      href="/forgot-password"
                      className="text-indigo-700 underline text-sm ml-4 underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                    <div className="flex items-center gap-1">
                      <p className="flex items-end gap-1 justify-end text-indigo-950  font-thin text-sm">
                        Dont have an account?{" "}
                      </p>
                      <Link
                        href="/register"
                        className="underline underline-offset-4 hover:text-blue-300 transition-colors !text-stone-950 cursor-pointer"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            <SignInButton />
          </div>
        </div>
      </div>
      {/* <div className="bg-indigo-950/40 h-full w-12 blur-3xl -z-50 hidden md:flex"/> */}
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
