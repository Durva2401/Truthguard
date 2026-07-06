import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TruthGuard — Real-Time Fake News Detection",
  description:
    "Verify news articles, social media posts, and text claims against real sources. AI-powered misinformation detection with source credibility scoring.",
  keywords: [
    "fact check",
    "fake news",
    "misinformation",
    "verification",
    "news credibility",
    "truth guard",
  ],
  openGraph: {
    title: "TruthGuard — Know What's Real Before You Share",
    description:
      "AI-powered real-time misinformation detection. Paste any claim and get an instant credibility verdict with sources.",
    type: "website",
    siteName: "TruthGuard",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruthGuard — Real-Time Fake News Detection",
    description:
      "Verify news articles, social media posts, and text claims against real sources.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-white min-h-screen`}
      >
        {/* Background grid pattern */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]" />
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-cyan-500/5 via-blue-500/3 to-transparent rounded-full blur-3xl" />
        </div>

        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
