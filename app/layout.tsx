import type { Metadata } from "next";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/components/Header";
import NextTopLoader from 'nextjs-toploader';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "ElectroX - Buy & Sell Electronics",
  description: "The world's first marketplace for buying and selling authentic electronics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white ${poppins.variable}`}>
        <Header />
        <NextTopLoader color="#16a34a" />
        {children}
        <SanityLive/>
      </body>
    </html>
  );
}
