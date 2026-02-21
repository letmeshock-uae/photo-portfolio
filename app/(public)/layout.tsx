import Link from "next/link";
import { ViewSwitcher } from "@/components/ViewSwitcher";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-white/90 text-sm font-light tracking-[0.2em] uppercase hover:text-white transition-colors"
        >
          Portfolio
        </Link>

        <div className="flex items-center gap-4">
          <ViewSwitcher />
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">
              Work
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
