import Link from "next/link";
import { projectTags } from "@/lib/defaultData";
import { projectTagPath } from "@/lib/projectUtils";
import ProjectGrid from "@/components/ProjectGrid";
import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Projects | Muhammad Hasil"
};

export default function ProjectsPage() {
  return (
    <div className="aurora-shell min-h-screen px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="precision-grid fixed inset-0 pointer-events-none" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Projects" title="Selected work, routed by technology" copy="Use the tag filters to open dedicated project pages for Node.js, Vanilla, React.js, Next.js, and TypeScript." />
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <Link href="/projects" className="magnetic-hover rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink">All</Link>
          {projectTags.map((tag) => (
            <Link key={tag} href={projectTagPath(tag)} className="magnetic-hover rounded-full border border-paper/10 bg-paper/5 px-4 py-2 text-sm font-semibold text-paper/70 transition hover:border-gold/45 hover:text-paper">
              {tag}
            </Link>
          ))}
        </div>
        <ProjectGrid />
      </div>
    </div>
  );
}
