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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { Eye, EyeOff, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useSession } from "next-auth/react";
import { api } from "@/convex/_generated/api";

// import SignInButton from "@/components/SignInButton"; // Removed

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  contact: z
    .string()
    .regex(/^\d{10}$/, { message: "Contact must be exactly 10 digits." }),
  role: z.string().optional(),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [errorInRegister, setErrorInRegister] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const registerUser = useAction(api.users.registerUser);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      contact: "",
      role: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { success, error } = await registerUser({
      fullname: values.fullname,
      username: values.username,
      email: values.email,
      password: values.password,
      contact: values.contact,
      position: "",
      role: process.env.ADMIN_EMAIL === values.email ? "admin" : "client",
    });

    if (error !== null) {
      setErrorInRegister(error);
      setLoading(false);
    }
    if (success) {
      form.reset();
      setLoading(false);
      router.push("/login");
    }
  }
  return (
    <section className="flex items-center justify-center w-full h-screen">
      {" "}
      {/* Center horizontally and vertically */}
      <div className="bg-[url('/images/bgimage.jpeg')] bg-cover bg-center bg-no-repeat h-full w-full -bg-conic-0z-50 fixed top-0 left-0" />
      <div className="bg-[url('/images/office.jpg')] absolute bg-cover bg-center bg-no-repeat h-full w-full opacity-40 top-0 left-0" />
      <div className="h-full w-full bg-indigo-900/10 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 z-50 absolute top-0 left-0" />
      <div className="flex items-center justify-center w-full h-full absolute top-0 left-0 z-50">
       
        <div className="py-10 px-5 md:px-10 bg-indigo-50 h-fit w-full md:w-[600px] rounded-xl shadow shadow-black/40 flex flex-col items-center justify-center z-50">
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4  lg:px:10 z-50">
            <div className="flex gap-2 flex-col">
              <h2 className=" text-balance text-xl md:text-3xl font-bold tracking-tighter text-indigo-950 mb-4">
                Create an account
              </h2>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 !w-full"
              >
                <div className="flex items-center justify-center gap-2 lg:gap-8 text-indigo-950  w-full">
                  <div className="flex items-start flex-col justify-center gap-2 w-full">
                    <FormField
                      control={form.control}
                      name="fullname"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl className="w-full">
                            <Input
                              className="text-indigo-950 border-indigo-200 !p-2 bg-white/60 border-2 !w-full"
                              type="text"
                              placeholder="Full name.."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-start flex-col justify-center gap-2 w-full">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Username</FormLabel>
                          <FormControl className="w-full">
                            <Input
                              className="text-indigo-950 border-indigo-200 !p-2 bg-white/60 border-2 !w-full"
                              type="text"
                              placeholder="Username"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center w-full">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-indigo-950">
                            Contact
                          </FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-indigo-600 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-indigo-900 text-white border-indigo-700 w-40">
                                <p className="text-pretty text-xs">
                                  Please provide your real phone number as it
                                  will be used to connect your account
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <Input
                            className="text-indigo-950 border-indigo-200 !p-2 bg-white/60 border-2"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-indigo-950 ">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="text-indigo-950 border-indigo-200 !p-2 bg-white/60 border-2"
                          type="email"
                          placeholder="john@gmail.com"
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
                      <FormLabel className="text-indigo-950 ">
                        Password
                      </FormLabel>
                     <FormControl className=" relative">
                          <div className="h-fit w-full">
                          
                          <Input
                            className="text-indigo-950 border-indigo-200 !p-2 bg-white/60 border-2"
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
                <div className="flex items-center justify-between w-full">
                  <Button
                    disabled={loading}
                    className="bg-indigo-600 disabled:bg-stone-700 disabled:cursor-wait hover:bg-indigo-700 shadow-lg shadow-black/40 cursor-pointer w-full"
                    type="submit"
                  >
                    {loading ? (
                      <p className="flex items-center gap-2 justify-center">
                        <Loader2 className="animate-spin h-4 w-4 " /> Sign up
                        &rarr;
                      </p>
                    ) : (
                      <p>Sign up &rarr;</p>
                    )}
                  </Button>
                </div>
                {errorInRegister ? (
                  <p className="flex items-center gap-1 justify-center text-red-500 font-thin text-sm">
                    {errorInRegister} try to{" "}
                    <Link
                      href="/login"
                      className="text-red-200 underline cursor-pointer underline-offset-2"
                    >
                      Login
                    </Link>
                  </p>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <p className="flex items-end gap-1 justify-end text-indigo-950  font-thin text-sm">
                      Already have an account{" "}
                      <Link
                        href="/login"
                        className="underline ml-2 cursor-pointer"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
