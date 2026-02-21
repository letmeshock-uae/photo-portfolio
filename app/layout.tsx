import type { Metadata } from "next";
import "./globals.css";
import { Lightbox } from "@/components/Lightbox";
import { initDb } from "@/lib/init-db";

export const metadata: Metadata = {
  title: "Portfolio — Photography",
  description:
    "Commercial and still-life photography portfolio. Exploring form, light, and material.",
  openGraph: {
    title: "Portfolio — Photography",
    description: "Commercial and still-life photography portfolio.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // On Vercel, initialise the ephemeral SQLite DB on cold start
  await initDb();

  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white min-h-screen">
        {children}
        <Lightbox />
      </body>
    </html>
  );
}
