const tagThemes = {
  "Node.js": ["#102019", "#3da36f", "#f0b45b"],
  Vanilla: ["#2a2114", "#f0b45b", "#d8647c"],
  "React.js": ["#122432", "#61dafb", "#f0b45b"],
  "Next.js": ["#121018", "#f8f1e7", "#7c3f58"],
  TypeScript: ["#10243f", "#3178c6", "#f8f1e7"]
};

const categoryMap = [
  { id: "food", words: ["food", "restaurant", "menu", "meal", "cafe"], label: "Food Website", icon: "MENU" },
  { id: "shop", words: ["shop", "store", "ecommerce", "commerce", "product", "cart", "mern"], label: "Commerce App", icon: "CART" },
  { id: "rental", words: ["rental", "car", "booking", "vehicle"], label: "Rental Platform", icon: "CAR" },
  { id: "portfolio", words: ["portfolio", "profile", "personal", "developer"], label: "Portfolio", icon: "DEV" },
  { id: "bot", words: ["bot", "discord", "automation", "server"], label: "Automation", icon: "BOT" },
  { id: "blog", words: ["blog", "article", "post", "content"], label: "Blog System", icon: "BLOG" },
  { id: "music", words: ["music", "audio", "song", "playlist"], label: "Music App", icon: "PLAY" },
  { id: "dashboard", words: ["dashboard", "admin", "analytics", "cms"], label: "Dashboard", icon: "CMS" }
];

function escapeSvg(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanText(value, fallback, max = 92) {
  return escapeSvg(value || fallback).trim().slice(0, max);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function projectKeywords(project) {
  return [
    project.title,
    project.description,
    project.tag,
    ...normalizeList(project.features),
    ...normalizeList(project.technologies),
    ...normalizeList(project.frameworks),
    ...normalizeList(project.tools)
  ]
    .join(" ")
    .toLowerCase();
}

function projectCategory(project) {
  const text = projectKeywords(project);
  return categoryMap.find((category) => category.words.some((word) => text.includes(word))) || {
    id: "app",
    label: `${project.tag || "Web"} Project`,
    icon: "APP"
  };
}

function initials(title) {
  return cleanText(title, "Project", 50)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AI";
}

function featureChips(project) {
  const source = [
    ...normalizeList(project.features),
    ...normalizeList(project.technologies),
    ...normalizeList(project.frameworks),
    project.tag
  ].filter(Boolean);

  const unique = [...new Set(source)].slice(0, 4);
  return unique.length ? unique : ["Responsive UI", "Live Project", project.tag || "Web App"];
}

function scene(category, accent, soft) {
  const screenBase = `
    <rect x="118" y="218" width="964" height="386" rx="40" fill="#f8f1e7"/>
    <rect x="118" y="218" width="964" height="64" rx="40" fill="#121018"/>
    <circle cx="164" cy="250" r="9" fill="#d8647c"/>
    <circle cx="194" cy="250" r="9" fill="#f0b45b"/>
    <circle cx="224" cy="250" r="9" fill="#3daaa2"/>
    <rect x="842" y="240" width="164" height="20" rx="10" fill="#f8f1e7" opacity=".16"/>
    <rect x="148" y="314" width="174" height="250" rx="28" fill="#121018" opacity=".92"/>
    <rect x="178" y="350" width="96" height="12" rx="6" fill="${accent}"/>
    <rect x="178" y="394" width="112" height="12" rx="6" fill="#f8f1e7" opacity=".25"/>
    <rect x="178" y="434" width="84" height="12" rx="6" fill="#f8f1e7" opacity=".18"/>
    <rect x="178" y="506" width="106" height="34" rx="17" fill="${soft}" opacity=".9"/>
  `;

  const scenes = {
    food: `
      ${screenBase}
      <rect x="360" y="320" width="300" height="214" rx="32" fill="#ffffff"/>
      <circle cx="510" cy="398" r="72" fill="${accent}" opacity=".18"/>
      <circle cx="510" cy="398" r="48" fill="${soft}"/>
      <rect x="396" y="490" width="228" height="16" rx="8" fill="#121018" opacity=".16"/>
      <rect x="700" y="320" width="300" height="72" rx="24" fill="${accent}" opacity=".86"/>
      <rect x="700" y="418" width="130" height="116" rx="24" fill="#ffffff"/>
      <rect x="862" y="418" width="138" height="116" rx="24" fill="#ffffff"/>
    `,
    shop: `
      ${screenBase}
      <rect x="360" y="320" width="194" height="214" rx="28" fill="#ffffff"/>
      <rect x="590" y="320" width="194" height="214" rx="28" fill="#ffffff"/>
      <rect x="820" y="320" width="194" height="214" rx="28" fill="#ffffff"/>
      <rect x="394" y="354" width="126" height="84" rx="22" fill="${accent}" opacity=".85"/>
      <rect x="624" y="354" width="126" height="84" rx="22" fill="${soft}" opacity=".85"/>
      <rect x="854" y="354" width="126" height="84" rx="22" fill="${accent}" opacity=".35"/>
      <rect x="394" y="474" width="92" height="16" rx="8" fill="#121018" opacity=".18"/>
      <rect x="624" y="474" width="92" height="16" rx="8" fill="#121018" opacity=".18"/>
      <rect x="854" y="474" width="92" height="16" rx="8" fill="#121018" opacity=".18"/>
    `,
    rental: `
      ${screenBase}
      <rect x="360" y="332" width="410" height="160" rx="34" fill="#ffffff"/>
      <rect x="408" y="396" width="238" height="62" rx="30" fill="${accent}"/>
      <rect x="444" y="356" width="132" height="58" rx="24" fill="${soft}"/>
      <circle cx="464" cy="468" r="20" fill="#121018"/>
      <circle cx="620" cy="468" r="20" fill="#121018"/>
      <rect x="812" y="332" width="194" height="160" rx="30" fill="#ffffff"/>
      <rect x="842" y="372" width="132" height="16" rx="8" fill="${accent}"/>
      <rect x="842" y="426" width="96" height="16" rx="8" fill="#121018" opacity=".15"/>
    `,
    portfolio: `
      ${screenBase}
      <rect x="372" y="326" width="236" height="222" rx="34" fill="#ffffff"/>
      <circle cx="490" cy="392" r="46" fill="${accent}"/>
      <rect x="420" y="464" width="140" height="16" rx="8" fill="#121018" opacity=".2"/>
      <rect x="688" y="326" width="310" height="78" rx="26" fill="${accent}" opacity=".88"/>
      <rect x="688" y="438" width="310" height="22" rx="11" fill="#121018" opacity=".15"/>
      <rect x="688" y="492" width="220" height="22" rx="11" fill="#121018" opacity=".1"/>
    `,
    dashboard: `
      ${screenBase}
      <rect x="360" y="326" width="190" height="88" rx="26" fill="${accent}" opacity=".9"/>
      <rect x="584" y="326" width="190" height="88" rx="26" fill="${soft}" opacity=".82"/>
      <rect x="808" y="326" width="190" height="88" rx="26" fill="#ffffff"/>
      <rect x="360" y="456" width="638" height="28" rx="14" fill="#121018" opacity=".14"/>
      <rect x="360" y="512" width="494" height="28" rx="14" fill="#121018" opacity=".09"/>
    `,
    app: `
      ${screenBase}
      <rect x="374" y="326" width="274" height="222" rx="36" fill="#ffffff"/>
      <rect x="414" y="370" width="194" height="28" rx="14" fill="${accent}"/>
      <rect x="414" y="438" width="148" height="18" rx="9" fill="#121018" opacity=".16"/>
      <rect x="710" y="326" width="286" height="222" rx="36" fill="#ffffff"/>
      <circle cx="852" cy="426" r="62" fill="${soft}" opacity=".82"/>
    `
  };

  return scenes[category.id] || scenes.app;
}

export function generateProjectThumbnail(project) {
  const title = cleanText(project.title, "New Project", 68);
  const tag = cleanText(project.tag, "Next.js", 22);
  const description = cleanText(project.description, "Developer project", 96);
  const [base, accent, soft] = tagThemes[project.tag] || tagThemes["Next.js"];
  const category = projectCategory(project);
  const mark = initials(project.title);
  const chips = featureChips(project).map((chip) => cleanText(chip, "Feature", 22));

  const chipMarkup = chips.map((chip, index) => {
    const x = 130 + index * 178;
    return `<rect x="${x}" y="624" width="150" height="42" rx="21" fill="#f8f1e7" opacity=".12"/>
      <text x="${x + 75}" y="651" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="800" fill="#f8f1e7">${chip}</text>`;
  }).join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${base}"/>
          <stop offset="55%" stop-color="#241a24"/>
          <stop offset="100%" stop-color="${accent}"/>
        </linearGradient>
        <radialGradient id="glow" cx="78%" cy="18%" r="70%">
          <stop offset="0%" stop-color="${soft}" stop-opacity=".5"/>
          <stop offset="100%" stop-color="${soft}" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="26" stdDeviation="24" flood-color="#000" flood-opacity=".28"/>
        </filter>
      </defs>
      <rect width="1200" height="750" rx="58" fill="url(#bg)"/>
      <rect width="1200" height="750" rx="58" fill="url(#glow)"/>
      <circle cx="1030" cy="118" r="156" fill="${soft}" opacity=".12"/>
      <circle cx="134" cy="646" r="198" fill="${accent}" opacity=".14"/>

      <text x="86" y="76" font-family="Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="5" fill="#f8f1e7" opacity=".72">${category.label.toUpperCase()}</text>
      <text x="86" y="132" font-family="Arial, sans-serif" font-size="46" font-weight="900" fill="#f8f1e7">${title}</text>
      <text x="88" y="176" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#f8f1e7" opacity=".68">${description}</text>

      <g filter="url(#shadow)">
        <rect x="78" y="210" width="1044" height="398" rx="48" fill="#ffffff" opacity=".14"/>
        <rect x="96" y="228" width="1008" height="362" rx="42" fill="#121018" opacity=".18"/>
        ${scene(category, accent, soft)}
      </g>

      <rect x="910" y="82" width="168" height="54" rx="27" fill="#f8f1e7" opacity=".14"/>
      <text x="994" y="116" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#f8f1e7">${tag}</text>
      <circle cx="1030" cy="622" r="62" fill="${accent}"/>
      <text x="1030" y="642" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="#f8f1e7">${mark}</text>
      ${chipMarkup}
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
