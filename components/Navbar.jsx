"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Code2, FolderKanban, Home, Mail, Menu, User, X } from "lucide-react";
import { projectTags } from "@/lib/defaultData";
import { projectTagPath } from "@/lib/projectUtils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/contact", label: "Contact", icon: Mail }
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const activeClass = (href) => pathname === href ? "bg-paper text-ink shadow-glow" : "text-paper/68 hover:bg-paper/8 hover:text-paper";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="mx-auto max-w-7xl rounded-[1.4rem] border border-paper/10 bg-ink/78 shadow-[0_18px_55px_rgba(0,0,0,.22)] backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-gold/25 bg-gold shadow-glow">
            <Code2 className="h-5 w-5 text-ink" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-paper/50">Muhammad</span>
            <span className="-mt-1 block text-lg font-bold text-paper">Hasil</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${activeClass(item.href)}`}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="relative" onMouseEnter={() => setProjectsOpen(true)} onMouseLeave={() => setProjectsOpen(false)}>
            <Link href="/projects" className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${pathname.startsWith("/projects") ? "bg-paper text-ink shadow-glow" : "text-paper/68 hover:bg-paper/8 hover:text-paper"}`}>
              <FolderKanban className="h-4 w-4" />
              Projects
              <ChevronDown className="h-4 w-4" />
            </Link>
            {projectsOpen && (
              <div className="glass-panel absolute right-0 top-12 w-60 rounded-2xl p-2">
                <Link href="/projects" className="block rounded-xl px-3 py-2 text-sm text-paper/70 hover:bg-paper/10 hover:text-paper">All Projects</Link>
                {projectTags.map((tag) => (
                  <Link key={tag} href={projectTagPath(tag)} className="block rounded-xl px-3 py-2 text-sm text-paper/70 hover:bg-paper/10 hover:text-paper">
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="grid h-11 w-11 place-items-center rounded-xl border border-paper/10 bg-paper/5 transition hover:bg-paper/10 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-paper/10 bg-ink/95 px-4 py-4 backdrop-blur-2xl md:hidden">
          {[...navItems, { href: "/projects", label: "Projects", icon: FolderKanban }].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="mb-2 flex items-center gap-3 rounded-2xl border border-paper/10 bg-paper/[0.03] px-4 py-3 text-paper/80">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {projectTags.map((tag) => (
              <Link key={tag} href={projectTagPath(tag)} onClick={() => setOpen(false)} className="rounded-xl bg-paper/5 px-3 py-2 text-center text-xs text-paper/65">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </header>
  );
}
