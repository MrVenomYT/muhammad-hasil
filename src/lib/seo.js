// Dynamic Global SEO & OpenGraph Metadata Generator for iHasil Portfolio
import { getStructuredDataGraph } from './schema-org';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app';

export function getFullImageUrl(imageUrl) {
  if (!imageUrl) return `${BASE_URL}/assets/muhammad-hasil.png`;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  const clean = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${BASE_URL}${clean}`;
}

export function generateSEOMetadata({
  title,
  description,
  imageUrl,
  url,
  type = 'website',
  category = 'Software Development',
  keywords = [
    'Muhammad Hasil',
    'iHasil',
    'Full Stack Developer',
    'React Developer',
    'Next.js Engineer',
    'UI/UX Designer',
    'Node.js',
    'MongoDB',
    'Web Development Portfolio'
  ],
  schemaType = null,
  schemaData = null
}) {
  const brandName = 'iHasil';
  const creatorName = 'Muhammad Hasil';
  
  const pageTitle = title
    ? `${title} – ${brandName} | ${creatorName}`
    : `${brandName} – ${creatorName} | Full Stack Developer & UI/UX Designer`;

  const defaultDesc = 'Explore production full-stack web applications, React & Next.js systems, digital store products, and engineering services by Muhammad Hasil (iHasil).';
  const pageDescription = description
    ? (description.length > 160 ? description.substring(0, 157) + '...' : description)
    : defaultDesc;

  const pageImage = getFullImageUrl(imageUrl);
  const pageUrl = url || BASE_URL;

  // Build page-specific item if provided
  let customItem = null;
  if (schemaType && schemaData) {
    customItem = {
      '@type': schemaType,
      name: title || brandName,
      description: pageDescription,
      url: pageUrl,
      ...schemaData
    };
  }

  // Get structured graph containing Person, Organization, and WebSite schemas
  const jsonLd = getStructuredDataGraph(pageUrl, customItem);

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords.join(', '),
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage: pageImage,
    ogUrl: pageUrl,
    ogType: type,
    ogSiteName: `${brandName} – ${creatorName}`,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: pageImage,
    jsonLd
  };
}
