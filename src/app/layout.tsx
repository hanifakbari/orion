import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/provider/provider";
import "../assets/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Orion — AI Infrastructure Control System",
    template: "%s | Orion",
  },
  description:
    "Orion is an AI infrastructure control system designed to manage, orchestrate, and scale intelligent systems across your entire stack. Build, deploy, and operate AI like an operating system.",
  keywords: [
    "AI infrastructure",
    "AI control system",
    "AI operating system",
    "machine learning platform",
    "AI orchestration",
    "AI deployment",
    "AI scaling platform",
    "LLM infrastructure",
    "AI backend system",
  ],
  authors: [{ name: "Orion" }],
  creator: "Orion",
  metadataBase: new URL("https://orion-lovat-tau.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://orion-lovat-tau.vercel.app/",
    siteName: "Orion",
    title: "Orion — AI Infrastructure Control System",
    description:
      "Manage and scale your AI systems with Orion. A powerful AI operating system for orchestration, deployment, and control.",
    images: [
      {
        url: "https://orion-lovat-tau.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Orion — AI Infrastructure Control System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orion — AI Infrastructure Control System",
    description:
      "Manage and scale your AI systems with Orion. A powerful AI operating system.",
    images: ["https://orion-lovat-tau.vercel.app/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://orion-lovat-tau.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="bg-gradient-radial pointer-events-none fixed inset-0 -z-20 animate-bg-pulse" />
          <div className="bg-noise pointer-events-none fixed inset-0 -z-10" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
