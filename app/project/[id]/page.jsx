"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, ArrowUpRight, Layers3, ListChecks, Wrench } from "lucide-react";
import { motion } from "@/components/Motion";
import { usePortfolioData } from "@/components/DataProvider";
import { generateProjectThumbnail } from "@/lib/thumbnailGenerator";
import { projectDetails, projectTagPath } from "@/lib/projectUtils";

export default function ProjectDetailPage({ params }) {
  const { projects, ready } = usePortfolioData();
  const id = decodeURIComponent(params.id);
  const project = useMemo(() => projects.find((item) => item.id === id), [id, projects]);
  const details = useMemo(() => projectDetails(project), [project]);
  const thumbnail = useMemo(() => project ? project.thumbnail || generateProjectThumbnail(project) : "", [project]);
  const frameworksAndTools = useMemo(() => [...details.frameworks, ...details.tools], [details.frameworks, details.tools]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-ink px-4 pt-32 text-paper">
        <div className="mx-auto max-w-7xl">
          <div className="h-[32rem] animate-pulse rounded-[2rem] bg-paper/10" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink px-4 text-paper">
        <div className="max-w-xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-gold">Project not found</p>
          <h1 className="mt-4 text-4xl font-black">This project is not available</h1>
          <Link href="/projects" className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 font-black text-ink">Back to projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-shell min-h-screen px-4 pb-24 pt-36 text-paper sm:px-6 lg:px-8">
      <div className="precision-grid fixed inset-0 pointer-events-none" />
      <div className="mx-auto max-w-7xl">
        <Link href="/projects" className="mb-8 inline-flex items-center gap-2 rounded-full border border-paper/10 bg-paper/5 px-4 py-2 text-sm font-bold text-paper/70 transition hover:border-gold/45 hover:text-paper">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <section className="grid min-h-[34rem] gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <motion.div className="glass-panel flex h-full flex-col justify-center rounded-[2rem] p-6 sm:p-8">
            <p className="mb-4 inline-flex w-fit rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-black text-gold">{project.tag}</p>
            <h1 className="line-clamp-3 text-4xl font-black tracking-tight sm:text-6xl">{project.title}</h1>
            <div className="mt-6 max-h-48 max-w-3xl overflow-y-auto pr-2 text-base leading-8 text-paper/65 sm:text-lg">
              {project.description}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={project.liveUrl} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-black text-ink transition hover:bg-paper">
                Live version
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <Link href={projectTagPath(project.tag)} className="inline-flex items-center justify-center rounded-full border border-paper/10 bg-paper/5 px-6 py-3 font-black text-paper/75 transition hover:border-gold/50 hover:text-paper">
                More {project.tag} projects
              </Link>
            </div>
          </motion.div>

          <motion.div className="glass-panel overflow-hidden rounded-[2rem] p-3">
            <img src={thumbnail} alt={project.title} width="1200" height="750" className="aspect-[16/10] w-full rounded-[1.4rem] object-cover" />
          </motion.div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <DetailPanel icon={ListChecks} title="Features" items={details.features} />
          <DetailPanel icon={Layers3} title="Technologies" items={details.technologies} />
          <DetailPanel icon={Wrench} title="Frameworks and tools" items={frameworksAndTools} />
        </section>
      </div>
    </div>
  );
}

function DetailPanel({ icon: Icon, title, items }) {
  return (
    <motion.article className="elite-card h-80 overflow-hidden rounded-[1.8rem] p-6 backdrop-blur-xl">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5 flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-paper/10 bg-paper/7 px-3 py-2 text-sm font-bold text-paper/70">{item}</span>
        ))}
      </div>
    </motion.article>
  );
}
