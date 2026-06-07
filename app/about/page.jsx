"use client";

import { motion } from "@/components/Motion";
import { ArrowUpRight, Award, BookOpen, BriefcaseBusiness, CheckCircle2, Code2, ExternalLink, Layers3, MonitorSmartphone } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { usePortfolioData } from "@/components/DataProvider";
import { defaultProfileInfo } from "@/lib/defaultData";

export default function AboutPage() {
  const { profileInfo } = usePortfolioData();
  const info = profileInfo || defaultProfileInfo;

  return (
    <div className="aurora-shell px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="grid items-center gap-12 lg:grid-cols-[.92fr_1.08fr]">
          <div>
            <div className="relative overflow-hidden rounded-[2rem] border border-paper/10 bg-paper/8 p-3 shadow-glow">
              <div className="absolute left-6 top-6 z-10 rounded-full border border-gold/25 bg-ink/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold backdrop-blur">Coding Mode</div>
              <img src="/assets/hooded-coder.gif" alt="Animated hooded developer coding on a laptop" width="800" height="1000" className="aspect-[4/5] h-full w-full rounded-[1.4rem] object-cover" />
              <FloatingCode className="left-5 top-24" text="npm run dev" delay={0} />
              <FloatingCode className="right-5 top-36" text="<Next.js />" delay={0.4} />
              <FloatingCode className="left-8 bottom-28" text="useState()" delay={0.8} />
              <div className="absolute inset-x-6 bottom-6 grid gap-3 sm:grid-cols-3">
                <VisualBadge icon={Code2} label="Frontend" />
                <VisualBadge icon={Layers3} label="Dashboards" />
                <VisualBadge icon={MonitorSmartphone} label="Responsive" />
              </div>
            </div>
          </div>
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">About Muhammad</p>
            <h1 className="text-4xl font-black tracking-tight text-paper sm:text-6xl">Clean web experiences with personality and purpose.</h1>
            <p className="mt-6 text-lg leading-8 text-paper/68">{info.bio}</p>
            <motion.a
              href={info.hireMeUrl || "https://www.fiverr.com/"}
              target="_blank"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-black text-ink transition hover:bg-paper"
            >
              Hire me on Fiverr
              <ExternalLink className="h-4 w-4" />
            </motion.a>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {info.highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-paper/[0.055] p-4 text-paper/78">
                  <CheckCircle2 className="h-5 w-5 text-gold" />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-24">
          <SectionHeading eyebrow="Skills" title="What I work with" copy="These skills are managed from the hidden dashboard and reflected here automatically." />
          <div className="grid gap-5 md:grid-cols-2">
            {info.skills.map((skill, index) => (
              <Reveal key={skill.id} delay={index * 0.04}>
                <div className="rounded-3xl border border-paper/10 bg-paper/[0.055] p-5">
                  <div className="mb-3 flex justify-between text-sm font-semibold text-paper">
                    <span>{skill.title}</span>
                    <span className="text-gold">{skill.level}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-paper/10">
                    <motion.div className="h-full rounded-full bg-gold" initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <InfoSection icon={BookOpen} title="Education" items={info.education} />
        <InfoSection icon={Award} title="Certificates" items={info.certificates} certificates />
        <InfoSection icon={BriefcaseBusiness} title="Current & Past Experience" items={info.experience} />
      </div>
    </div>
  );
}

function VisualBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-paper/15 bg-ink/75 px-3 py-3 text-xs font-bold text-paper backdrop-blur">
      <Icon className="h-4 w-4 text-gold" />
      {label}
    </div>
  );
}

function FloatingCode({ className, text, delay }) {
  return (
    <motion.div
      className={`absolute z-10 hidden rounded-2xl border border-gold/20 bg-ink/72 px-4 py-2 text-xs font-black text-gold shadow-glow backdrop-blur md:block ${className}`}
      animate={{ y: [0, -10, 0], opacity: [0.72, 1, 0.72] }}
      transition={{ duration: 3.2, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {text}
    </motion.div>
  );
}

function InfoSection({ icon: Icon, title, items, certificates = false }) {
  return (
    <section className="pb-20">
      <SectionHeading eyebrow="Information" title={title} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-paper/10 bg-paper/[0.06] p-6 transition hover:-translate-y-1 hover:border-gold/45">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-gold/10 transition group-hover:bg-gold/20" />
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-gold/25 bg-gold/10">
                <Icon className="h-6 w-6 text-gold" />
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                <p className="rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold">{item.year}</p>
                {certificates && item.provider && <p className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">{item.provider}</p>}
              </div>
              <h3 className="mt-2 text-2xl font-black text-paper">{item.title}</h3>
              <p className="mt-1 font-semibold text-paper/58">{item.organization}</p>
              <p className="mt-4 text-sm leading-7 text-paper/66">{item.description}</p>
              {certificates && item.credentialUrl && (
                <a href={item.credentialUrl} target="_blank" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-black text-ink transition hover:bg-paper">
                  View certificate
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
