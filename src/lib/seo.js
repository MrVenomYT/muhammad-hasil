// Dynamic SEO Metadata Generator for Portfolio Projects, Services & Pages

export function generateSEOMetadata({
  title,
  description,
  imageUrl,
  url,
  type = 'website',
  category = 'Software Development',
  keywords = [],
  schemaType = 'WebApplication',
  schemaData = {}
}) {
  const baseTitle = 'Muhammad Hasil – Full Stack Developer & UI/UX Specialist';
  const pageTitle = title
    ? `${title} | Muhammad Hasil Portfolio`
    : baseTitle;

  const defaultDesc = 'Full Stack Software Engineer specializing in React, Next.js, Node.js, MongoDB, and high-performance dark glassmorphism web applications.';
  const pageDescription = description
    ? (description.length > 155 ? description.substring(0, 152) + '...' : description)
    : defaultDesc;

  const defaultImage = 'https://ais-dev-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/assets/muhammad-hasil.png';
  let pageImage = defaultImage;
  if (imageUrl) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      pageImage = imageUrl;
    } else {
      const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
      pageImage = `https://ais-dev-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app${cleanPath}`;
    }
  }

  const pageUrl = url || 'https://ais-dev-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app';

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: title || 'Muhammad Hasil Portfolio',
    description: pageDescription,
    image: pageImage,
    url: pageUrl,
    applicationCategory: category,
    operatingSystem: 'All Modern Browsers',
    author: {
      '@type': 'Person',
      name: 'Muhammad Hasil',
      jobTitle: 'Full Stack Developer',
      url: 'https://pro.fiverr.com/users/venomdesigne613/'
    },
    provider: {
      '@type': 'Organization',
      name: 'iHasil Studio',
      url: pageUrl
    },
    ...schemaData
  };

  return {
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage: pageImage,
    ogUrl: pageUrl,
    ogType: type,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: pageImage,
    jsonLd
  };
}
