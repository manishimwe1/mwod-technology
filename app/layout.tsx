import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import AnalyticsWrapper from "@/components/AnalyticWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EasyFix - Sell and Buy some of electronics",
    template: "%s | EasyFix",
  },
  description:
    "Your one-stop destination for electronics repair services and new device purchases. Expert repairs, great deals, and quality electronics.",
  keywords: [
    "electronics repair",
    "buy electronics",
    "sell electronics",
    "tech services",
    "gadgets",
    "smartphones",
    "laptops",
    "accessories",
  ],
  authors: [{ name: "Mozze" }],
  creator: "Mozze",
  publisher: "Mozze",
  openGraph: {
    title: "EasyFix - Sell and Buy some of electronics",
    description:
      "Your one-stop destination for electronics repair services and new device purchases. Expert repairs, great deals, and quality electronics.",
    url: "https://easyfix.com", // Replace with your actual URL
    siteName: "EasyFix",
    images: [
      {
        url: "https://easyfix.com/og-image.jpg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "EasyFix - Electronics Repair and Sales",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyFix - Sell and Buy some of electronics",
    description:
      "Your one-stop destination for electronics repair services and new device purchases. Expert repairs, great deals, and quality electronics.",
    // images: ["https://easyfix.com/twitter-image.jpg"], // Replace with your actual Twitter image
    creator: "@eminodev", // Replace with your Twitter handle
  },
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
        className={`${poppins.variable} antialiased`}
      >
        <SessionProvider>
          <ConvexClientProvider>
            <NextTopLoader />
            
              {children}
               <Analytics />
               <AnalyticsWrapper />
            <Toaster />
          </ConvexClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
