// Schema.org JSON-LD Structured Data for Person, Organization, and WebSite

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app';

export function getStructuredDataGraph(pageUrl = BASE_URL, customPageData = null) {
  const personId = `${BASE_URL}/#person`;
  const orgId = `${BASE_URL}/#organization`;
  const websiteId = `${BASE_URL}/#website`;

  const graph = [
    // 1. Person Schema
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Muhammad Hasil',
      alternateName: ['iHasil', 'MrVenomYT', 'venomdesigne613'],
      url: BASE_URL,
      image: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/muhammad-hasil.png`,
        caption: 'Muhammad Hasil – Full Stack Developer & UI/UX Designer'
      },
      jobTitle: 'Full Stack Software Engineer & UI/UX Designer',
      email: 'mailto:esp.hasil.insight@gmail.com',
      description: 'Senior full-stack web developer with 6+ years of experience delivering 299+ production web applications, React/Next.js systems, and custom databases.',
      worksFor: {
        '@id': orgId
      },
      sameAs: [
        'https://www.linkedin.com/in/muhammad-hasil/',
        'https://pro.fiverr.com/users/venomdesigne613/',
        'https://www.patreon.com/MrVenomYT',
        'https://github.com/venomous-studio'
      ],
      knowsAbout: [
        'Full Stack Web Development',
        'React.js',
        'Next.js',
        'Node.js',
        'TypeScript',
        'MongoDB Atlas',
        'PostgreSQL',
        'Firebase Authentication',
        'UI/UX Design',
        'Tailwind CSS',
        'RESTful APIs',
        'Canvas & WebGL Animations'
      ],
      knowsLanguage: ['English', 'Urdu']
    },

    // 2. Organization Schema
    {
      '@type': 'Organization',
      '@id': orgId,
      name: 'iHasil Studio',
      alternateName: 'iHasil',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/muhammad-hasil.png`,
        width: '512',
        height: '512'
      },
      founder: {
        '@id': personId
      },
      description: 'Professional digital engineering studio offering full-stack web application development, custom SaaS engineering, database architecture, and UI/UX design.',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'esp.hasil.insight@gmail.com',
          availableLanguage: ['English', 'Urdu'],
          areaServed: 'Worldwide'
        }
      ],
      sameAs: [
        'https://www.linkedin.com/in/muhammad-hasil/',
        'https://pro.fiverr.com/users/venomdesigne613/',
        'https://www.patreon.com/MrVenomYT'
      ]
    },

    // 3. WebSite Schema
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: BASE_URL,
      name: 'iHasil – Muhammad Hasil Portfolio',
      alternateName: 'Muhammad Hasil Full-Stack Showcase',
      publisher: {
        '@id': orgId
      },
      author: {
        '@id': personId
      },
      description: 'Official portfolio and project showcase for Muhammad Hasil featuring web applications, digital templates, and freelance engineering services.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/projects?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  // Optional page-specific schema item
  if (customPageData) {
    graph.push(customPageData);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}
