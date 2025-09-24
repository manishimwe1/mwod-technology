import type { Metadata } from "next";
import "../globals.css";
import ClientLayout from "@/components/ClientWrapper";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "EasyFix - Electronics Repair & Shop",
  description:
    "Your one-stop destination for electronics repair services and new device purchases. Expert repairs, great deals, and quality electronics.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {isAuthenticated} = await auth()

  if(!isAuthenticated){
    redirect('/sign-in')
  }
  return (
    <main suppressHydrationWarning={true}>
      <ClientLayout>{children}</ClientLayout>
    </main>
  );
}
