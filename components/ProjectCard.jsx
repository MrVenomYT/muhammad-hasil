"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { motion } from "@/components/Motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { generateProjectThumbnail } from "@/lib/thumbnailGenerator";
import { projectDetailPath, projectTagPath } from "@/lib/projectUtils";

function ProjectCard({ project }) {
  const thumbnail = useMemo(() => project.thumbnail || generateProjectThumbnail(project), [project]);
  const detailHref = useMemo(() => projectDetailPath(project), [project]);

  return (
    <motion.article
      layout
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="elite-card professional-hover group flex h-[31rem] flex-col overflow-hidden rounded-[1.6rem] backdrop-blur-xl"
    >
      <div className="aspect-[16/10] overflow-hidden bg-white/5">
        <img src={thumbnail} alt={project.title} width="1200" height="750" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Link href={projectTagPath(project.tag)} className="mb-4 inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
          {project.tag}
        </Link>
        <h3 className="line-clamp-2 min-h-14 text-xl font-bold text-paper">{project.title}</h3>
        <p className="mt-3 line-clamp-4 h-28 text-sm leading-7 text-paper/62">{project.description}</p>
        <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
          <Link href={detailHref} data-cursor="interactive" className="professional-hover inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink">
            View project
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={project.liveUrl} target="_blank" data-cursor="interactive" className="professional-hover inline-flex items-center justify-center gap-2 rounded-full border border-paper/10 bg-paper/5 px-4 py-2 text-sm font-bold text-paper/75">
            Live
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default memo(ProjectCard);
