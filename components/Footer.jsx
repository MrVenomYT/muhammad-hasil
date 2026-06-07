"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-paper/10 bg-[#100f15] px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-[1.4rem] border border-paper/10 bg-paper/[0.035] px-5 py-5 text-sm text-paper/62 sm:flex-row">
        <p>Copyright {new Date().getFullYear()} Muhammad Hasil. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <a href="mailto:hello@muhammadhasil.dev" className="rounded-full border border-paper/10 p-2 text-paper/60 transition hover:border-gold/60 hover:text-gold" aria-label="Email"><Mail className="h-4 w-4" /></a>
          <a href="https://github.com/MrVenomYT" target="_blank" className="rounded-full border border-paper/10 p-2 text-paper/60 transition hover:border-gold/60 hover:text-gold" aria-label="GitHub"><Github className="h-4 w-4" /></a>
          <a href="https://www.linkedin.com" target="_blank" className="rounded-full border border-paper/10 p-2 text-paper/60 transition hover:border-gold/60 hover:text-gold" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}
