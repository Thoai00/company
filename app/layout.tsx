import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Three Plug — Automation · Marketing · 3D · Software",
  description:
    "Full-service digital studio specialising in intelligent automation, performance marketing, 3D animation & visualization, ERP/CRM, and custom software development.",
  keywords: [
    "software development", "ERP CRM", "automation", "digital marketing",
    "3D animation", "Three.js", "WebGL", "web development",
  ],
  openGraph: {
    title: "Three Plug Software Solutions",
    description: "Automate. Market. Animate. All under one roof.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
