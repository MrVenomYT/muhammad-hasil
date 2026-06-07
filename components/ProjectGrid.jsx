"use client";

import { useMemo } from "react";
import { AnimatePresence } from "@/components/Motion";
import { usePortfolioData } from "./DataProvider";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

export default function ProjectGrid({ tag, limit }) {
  const { projects, ready } = usePortfolioData();
  const visible = useMemo(() => {
    const tagKey = tag?.toLowerCase();
    const filtered = tagKey ? projects.filter((project) => project.tag.toLowerCase() === tagKey) : projects;
    return limit ? filtered.slice(0, limit) : filtered;
  }, [limit, projects, tag]);

  if (!ready) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-white/10" />)}
      </div>
    );
  }

  if (!visible.length) {
    return <div className="rounded-3xl border border-paper/10 bg-paper/[0.06] p-10 text-center text-paper/60">No projects found for this filter yet.</div>;
  }

  return (
    <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {visible.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.06} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </AnimatePresence>
    </div>
  );
}
