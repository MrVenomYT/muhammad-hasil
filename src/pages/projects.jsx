import ProjectsSection from '../components/ProjectsSection';
import { getProjects } from '../lib/server-store';
import { generateSEOMetadata } from '../lib/seo';
import SEOHead from '../components/SEOHead';

export async function getServerSideProps() {
  try {
    const projects = await getProjects();
    const projectTitles = projects.slice(0, 5).map(p => p.title).join(', ');
    const description = projects.length > 0
      ? `Explore ${projects.length}+ production web applications and full-stack projects built by Muhammad Hasil, including ${projectTitles}.`
      : 'Explore full-stack web applications, React SaaS portals, and custom API projects by Muhammad Hasil.';

    const seo = generateSEOMetadata({
      title: 'Full Stack Projects & Web Portfolio',
      description,
      imageUrl: projects[0]?.imageUrl || '/assets/Apex-motors.jpg',
      url: 'https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/projects',
      category: 'Software Projects',
      schemaType: 'ItemList',
      schemaData: {
        itemListElement: projects.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.title,
          url: `https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/projects`
        }))
      }
    });

    return {
      props: {
        initialProjects: JSON.parse(JSON.stringify(projects || [])),
        seo
      }
    };
  } catch (error) {
    console.error('getServerSideProps projects error:', error);
    return {
      props: {
        initialProjects: [],
        seo: generateSEOMetadata({ title: 'Full Stack Projects', description: 'Explore full-stack projects by Muhammad Hasil.' })
      }
    };
  }
}

export default function ProjectsPage({ initialProjects, seo }) {
  return (
    <>
      <SEOHead seo={seo} />
      <ProjectsSection initialProjects={initialProjects} />
    </>
  );
}
