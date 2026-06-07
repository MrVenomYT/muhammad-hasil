import Link from "next/link";
import { projectTags } from "@/lib/defaultData";
import { projectTagPath, slugToTag, tagToSlug } from "@/lib/projectUtils";
import ProjectGrid from "@/components/ProjectGrid";
import SectionHeading from "@/components/SectionHeading";

export function generateStaticParams() {
  return projectTags.map((tag) => ({ tag: tagToSlug(tag) }));
}

export function generateMetadata({ params }) {
  const tag = slugToTag(params.tag, projectTags);
  return { title: `${tag} Projects | Muhammad Hasil` };
}

export default function TaggedProjectsPage({ params }) {
  const tag = slugToTag(params.tag, projectTags);

  return (
    <div className="aurora-shell min-h-screen px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="precision-grid fixed inset-0 pointer-events-none" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Filtered projects" title={`${tag} projects`} copy="This route is powered by the same tag value selected when a project is created in the dashboard." />
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <Link href="/projects" className="magnetic-hover rounded-full border border-paper/10 bg-paper/5 px-4 py-2 text-sm font-semibold text-paper/70">All</Link>
          {projectTags.map((item) => (
            <Link key={item} href={projectTagPath(item)} className={`magnetic-hover rounded-full px-4 py-2 text-sm font-bold ${item === tag ? "bg-gold text-ink" : "border border-paper/10 bg-paper/5 text-paper/70"}`}>
              {item}
            </Link>
          ))}
        </div>
        <ProjectGrid tag={tag} />
      </div>
    </div>
  );
}
