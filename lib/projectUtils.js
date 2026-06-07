export function projectDetailPath(project) {
  return `/project/${encodeURIComponent(project.id)}`;
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
