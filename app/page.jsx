"use client";

import Link from "next/link";
import { motion } from "@/components/Motion";
import { ArrowRight, BriefcaseBusiness, Code2, ExternalLink, Eye, Sparkles } from "lucide-react";
import { usePortfolioData } from "@/components/DataProvider";
import { defaultProfileInfo } from "@/lib/defaultData";
import ParallaxLayer from "@/components/ParallaxLayer";
import ProjectGrid from "@/components/ProjectGrid";
import Reveal from "@/components/Reveal";
import ReviewCards from "@/components/ReviewCards";
import SectionHeading from "@/components/SectionHeading";

const skills = ["Next.js", "React.js", "Node.js", "Tailwind CSS", "UI Systems", "Dashboard UX"];

export default function HomePage() {
  const { visits, projects, profileInfo } = usePortfolioData();
  const info = profileInfo || defaultProfileInfo;

  return (
    <div className="aurora-shell overflow-hidden">
      <section className="relative min-h-screen px-4 pt-36 sm:px-6 lg:px-8">
        <div className="precision-grid absolute inset-0 -z-10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" />
        <ParallaxLayer className="absolute right-10 top-36 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/12 blur-3xl" />
        <ParallaxLayer className="absolute left-4 top-64 -z-10 h-80 w-80 rounded-full bg-rose/10 blur-3xl" />
        <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_.96fr]">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-bold text-paper/78 backdrop-blur">
              <Sparkles className="h-4 w-4 text-gold" />
              Available for premium frontend projects
            </motion.div>
            <motion.h1 animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="max-w-5xl text-5xl font-black tracking-tight text-paper sm:text-7xl lg:text-8xl">
              Muhammad Hasil
              <span className="shine-text block bg-gradient-to-r from-gold via-paper via-teal to-gold bg-clip-text text-transparent">Frontend Developer</span>
            </motion.h1>
            <motion.p animate={{ y: [0, -3, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="mt-7 max-w-2xl text-lg leading-8 text-paper/68">
              I design and build refined portfolio websites, interactive dashboards, and frontend experiences that feel sharp, fast, and professional across every screen.
            </motion.p>
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link href="/projects" className="magnetic-hover inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-ink transition hover:bg-paper">
                View projects <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.a whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }} href={info.hireMeUrl || "https://www.fiverr.com/"} target="_blank" className="magnetic-hover inline-flex items-center justify-center gap-2 rounded-full bg-paper px-6 py-3 font-bold text-ink transition hover:bg-gold">
                Hire me <ExternalLink className="h-4 w-4" />
              </motion.a>
              <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link href="/contact" className="magnetic-hover inline-flex items-center justify-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-6 py-3 font-bold text-paper transition hover:border-gold/60 hover:bg-gold/10">
                  Contact me
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <ParallaxLayer className="relative">
            <div className="glass-panel animate-float-soft rounded-[2rem] p-4">
              <div className="rounded-[1.5rem] border border-paper/10 bg-ink/80 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-paper/40">Portfolio stats</p>
                    <h2 className="text-2xl font-bold text-paper">Live profile</h2>
                  </div>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">Updated</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Stat icon={Eye} label="Visits" value={visits.toLocaleString()} />
                  <Stat icon={BriefcaseBusiness} label="Projects" value={projects.length} />
                  <Stat icon={Code2} label="Tags" value="5" />
                </div>
                <div className="mt-6 space-y-3">
                  {skills.map((skill, index) => (
                    <motion.div key={skill} initial={{ width: "30%" }} whileInView={{ width: `${72 + index * 4}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="rounded-full border border-gold/20 bg-gold/10 px-4 py-3 text-sm font-semibold text-paper">
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ParallaxLayer>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Featured work" title="Recent polished builds" copy="The newest dashboard projects appear first, with detail pages, technology notes, and live project links." />
          <ProjectGrid limit={3} />
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <ParallaxLayer className="absolute inset-x-8 top-20 -z-10 h-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Reviews" title="Trusted by people who care about polish" copy="A clean review system with dashboard-managed testimonials and defaults that keep the page complete." />
          <ReviewCards />
        </div>
      </section>
    </div>
  );
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
