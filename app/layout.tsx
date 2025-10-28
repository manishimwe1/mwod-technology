import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyFix - Sell and Buy some of electronics",
  description:
    "Your one-stop destination for electronics repair services and new device purchases. Expert repairs, great deals, and quality electronics.",
  icons: ["/logo.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics scripts */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-310YYST3HF"
        ></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-310YYST3HF');
          `}
        </Script>
        {/* ... existing head content ... */}
      </head>
      <body
        suppressHydrationWarning
        className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <NextTopLoader />
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
