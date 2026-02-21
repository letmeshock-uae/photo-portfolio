import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Portfolio",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-light tracking-wide mb-12 text-white/90">
        About
      </h1>

      <div className="space-y-6 text-white/60 text-sm leading-relaxed font-light">
        <p>
          I am a commercial and still-life photographer based in the studio.
          My work explores the relationship between light, material, and form —
          finding the extraordinary in everyday objects.
        </p>

        <p>
          Specializing in product photography, editorial shoots, and
          experimental compositions. Each image is approached as a sculptural
          problem: how does light define an edge, how does shadow suggest
          weight, how does texture communicate itself through a flat plane.
        </p>

        <p>
          Available for commercial projects, collaborations, and editorial
          commissions.
        </p>
      </div>

      <div className="mt-16 space-y-3">
        <h2 className="text-xs tracking-widest uppercase text-white/30">
          Contact
        </h2>
        <div className="space-y-2 text-sm text-white/50 font-light">
          <p>
            <a
              href="mailto:hello@portfolio.example"
              className="hover:text-white transition-colors"
            >
              hello@portfolio.example
            </a>
          </p>
          <p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram ↗
            </a>
          </p>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10">
        <Link
          href="/"
          className="text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase"
        >
          ← Back to work
        </Link>
      </div>
    </div>
  );
}
