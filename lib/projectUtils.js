export function projectDetailPath(project) {
  return `/project/${encodeURIComponent(project.id)}`;
}

const tagSlugMap = {
  "Node.js": "node-js",
  Vanilla: "vanilla",
  "React.js": "react-js",
  "Next.js": "next-js",
  TypeScript: "typescript"
};

export function tagToSlug(tag) {
  return tagSlugMap[tag] || String(tag || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function slugToTag(slug, tags = []) {
  const decoded = decodeURIComponent(slug || "");
  return tags.find((tag) => tagToSlug(tag) === decoded) || tags.find((tag) => tag.toLowerCase() === decoded.toLowerCase()) || decoded;
}

export function projectTagPath(tag) {
  return `/projects/${tagToSlug(tag)}`;
}

export function normalizeList(value, fallback = []) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return fallback;
}

export function projectDetails(project) {
  const tag = project?.tag || "Project";
  return {
    features: normalizeList(project?.features, ["Responsive design", "Clean user interface", "Live project deployment"]),
    technologies: normalizeList(project?.technologies, ["JavaScript", "Tailwind CSS"]),
    frameworks: normalizeList(project?.frameworks, [tag]),
    tools: normalizeList(project?.tools, ["GitHub", "Vercel"])
  };
}
