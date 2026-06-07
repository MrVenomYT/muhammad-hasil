"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "@/components/Motion";
import { ArrowRight, BriefcaseBusiness, Code2, ExternalLink, Eye, Sparkles } from "lucide-react";
import { usePortfolioData } from "@/components/DataProvider";
import { defaultProfileInfo } from "@/lib/defaultData";
import ProjectGrid from "@/components/ProjectGrid";
import Reveal from "@/components/Reveal";
import ReviewCards from "@/components/ReviewCards";
import SectionHeading from "@/components/SectionHeading";

const skills = ["Next.js", "React.js", "Node.js", "Tailwind CSS", "UI Systems", "Dashboard UX"];
const roles = [
  "Full-Stack Dev",
  "Sales Engineer",
  "Lead Gen Expert",
  "Data Mining",
  "Translator",
  "Discord Mod",
  "Discord.js Expert",
  "Freelancer",
  "AI Vibe Coding"
];

export default function HomePage() {
  const { visits, projects, profileInfo } = usePortfolioData();
  const info = profileInfo || defaultProfileInfo;
  const typedRole = useTypingText(roles);

  return (
    <div className="aurora-shell overflow-hidden">
      <section className="relative min-h-screen px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <div className="precision-grid absolute inset-0 -z-10" />
        <div className="absolute right-10 top-36 -z-10 h-72 w-72 rounded-[2rem] border border-gold/20 bg-gold/8" />
        <div className="absolute left-4 top-64 -z-10 h-56 w-56 rounded-[2rem] border border-rose/20 bg-rose/8" />
        <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_.96fr]">
          <div className="hero-intro-card rounded-[2rem] p-5 sm:rounded-[2.2rem] sm:p-8 lg:p-10">
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-bold text-paper/78 backdrop-blur">
              <Sparkles className="h-4 w-4 text-gold" />
              Available for freelance and professional projects
            </motion.div>
            <motion.h1 animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="max-w-5xl text-4xl font-black leading-[0.98] tracking-tight text-paper sm:text-6xl lg:text-7xl xl:text-8xl">
              Muhammad Hasil
            </motion.h1>
            <div className="mt-5 min-h-[5.5rem] rounded-[1.5rem] border border-gold/20 bg-ink/55 px-5 py-4 shadow-[inset_0_1px_0_rgba(250,247,242,.08)] sm:min-h-[6rem]">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-gold/80">I work as</p>
              <p className="mt-2 text-2xl font-black leading-tight text-paper sm:text-3xl lg:text-4xl">
                {typedRole}
                <span className="typing-caret" />
              </p>
            </div>
            <motion.p animate={{ y: [0, -3, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="mt-7 max-w-2xl text-base leading-8 text-paper/68 sm:text-lg">
              I build modern websites, business tools, lead-generation workflows, Discord integrations, and clean client-focused digital experiences.
            </motion.p>
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link href="/projects" className="professional-hover inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-ink">
                View projects <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.a whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }} href={info.hireMeUrl || "https://www.fiverr.com/"} target="_blank" className="professional-hover inline-flex items-center justify-center gap-2 rounded-full bg-paper px-6 py-3 font-bold text-ink">
                Hire me <ExternalLink className="h-4 w-4" />
              </motion.a>
              <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link href="/contact" className="professional-hover inline-flex items-center justify-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-6 py-3 font-bold text-paper">
                  Contact me
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative">
            <div className="glass-panel animate-float-soft rounded-[2rem] p-4">
              <div className="rounded-[1.5rem] border border-paper/10 bg-panel/88 p-5 shadow-[inset_0_1px_0_rgba(255,248,237,.06)] sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-paper/40">Portfolio stats</p>
                    <h2 className="text-2xl font-black text-paper">Live profile</h2>
                  </div>
                  <span className="rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold text-teal">Updated</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Stat icon={Eye} label="Visits" value={visits.toLocaleString()} />
                  <Stat icon={BriefcaseBusiness} label="Projects" value={projects.length} />
                  <Stat icon={Code2} label="Tags" value="5" />
                </div>
                <div className="mt-6 space-y-3">
                  {skills.map((skill, index) => (
                    <motion.div key={skill} initial={{ width: "30%" }} whileInView={{ width: `${72 + index * 4}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="rounded-full border border-gold/25 bg-gold/10 px-4 py-3 text-sm font-semibold text-paper">
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Featured work" title="Recent polished builds" copy="The newest dashboard projects appear first, with detail pages, technology notes, and live project links." />
          <ProjectGrid limit={3} />
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-x-8 top-20 -z-10 h-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Reviews" title="Trusted by people who care about polish" copy="A clean review system with dashboard-managed testimonials and defaults that keep the page complete." />
          <ReviewCards />
        </div>
      </section>
    </div>
  );
}

function useTypingText(words) {
  const stableWords = useMemo(() => words, [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = stableWords[wordIndex];
    const doneTyping = !deleting && letterCount === currentWord.length;
    const doneDeleting = deleting && letterCount === 0;
    const delay = doneTyping ? 1200 : deleting ? 34 : 58;

    const timer = setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }

      if (doneDeleting) {
        setDeleting(false);
        setWordIndex((current) => (current + 1) % stableWords.length);
        return;
      }

      setLetterCount((current) => current + (deleting ? -1 : 1));
    }, delay);

    return () => clearTimeout(timer);
  }, [deleting, letterCount, stableWords, wordIndex]);

  return stableWords[wordIndex].slice(0, letterCount);
}

function Stat({ icon: Icon, label, value }) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-paper/10 bg-paper/[0.055] p-4">
        <Icon className="mb-4 h-5 w-5 text-gold" />
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs uppercase tracking-[0.24em] text-paper/40">{label}</p>
      </div>
    </Reveal>
  );
}
