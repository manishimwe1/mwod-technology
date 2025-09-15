import type { Metadata } from "next";
import "../globals.css";
import ClientLayout from "@/components/ClientWrapper";

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
    <body suppressHydrationWarning>
      <ClientLayout>{children}</ClientLayout>
    </body>
  );
}
