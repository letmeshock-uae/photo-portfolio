import type { Metadata } from "next";
import "./globals.css";
import { Lightbox } from "@/components/Lightbox";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white min-h-screen">
        {children}
        <Lightbox />
      </body>
    </html>
  );
}
