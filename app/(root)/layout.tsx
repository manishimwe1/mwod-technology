import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "EasyFix - Electronics Repair & Shop",
  description:
    "Your one-stop destination for electronics repair services and new device purchases. Expert repairs, great deals, and quality electronics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="min-h-screen flex flex-col justify-start w-full border border-red-700">
        <Header />
        {children}
      </main>
  );
}
