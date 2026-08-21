// Data Storage & Synchronization Utility
// Connects LocalStorage, Firestore, MongoDB API & Baseline Seed Data seamlessly

export const PROJECTS_CACHE_KEY = 'app_projects_cache';
export const DELETED_PROJECTS_KEY = 'app_deleted_projects_cache';

export const PRODUCTS_CACHE_KEY = 'app_products_cache';
export const DELETED_PRODUCTS_KEY = 'app_deleted_products_cache';

export const initialSeedProjects = [
  {
    id: 'takumisushi',
    title: 'Takumi Sushi',
    category: 'fullstack react design',
    pill: 'React / Japanese Dining UI',
    description: 'Authentic Japanese dining and sushi ordering web application featuring interactive menus, sleek dark aesthetic UI, and seamless food ordering experience.',
    liveDemoUrl: 'https://takumi-psi.vercel.app/',
    imageUrl: '/assets/thumbnail.png'
  },
  {
    id: 'staypilot',
    title: 'StayPilot',
    category: 'fullstack react',
    pill: 'Full Stack Web App',
    description: 'All-in-one web platform for hospitality & property management, booking reservations, guest scheduling, and analytics.',
    liveDemoUrl: 'https://stay-pilot-liard.vercel.app/',
    imageUrl: '/assets/StayPilot.png'
  },
  {
    id: 'vscheduler',
    title: 'VScheduler',
    category: 'fullstack react',
    pill: 'React / Web App',
    description: 'Interactive appointment booking and automated scheduling system built for seamless workflow management.',
    liveDemoUrl: 'https://vscheduler-five.vercel.app/',
    imageUrl: '/assets/VScheduler.png'
  },
  {
    id: 'sushiman',
    title: 'Sushiman',
    category: 'design',
    pill: 'Web Design & UI',
    description: 'High-converting culinary website with authentic Japanese aesthetics, smooth scroll animations, and food ordering UI.',
    liveDemoUrl: 'https://vanilla-food-website.vercel.app/',
    imageUrl: '/assets/shushiman.png'
  },
  {
    id: 'coffee',
    title: 'Coffee Theme',
    category: 'design',
    pill: 'Artisanal Cafe Shop',
    description: 'Rich dark-themed website featuring artisanal coffee menus, online ordering, smooth scrolling, and brand aesthetics.',
    liveDemoUrl: 'https://coffee-theme.vercel.app/',
    imageUrl: '/assets/coffee.png'
  },
  {
    id: 'studyhub',
    title: 'Study Hub',
    category: 'fullstack react',
    pill: 'Learning Portal',
    description: 'Comprehensive educational application designed to help students organize study sessions, resources, and progress tracking.',
    liveDemoUrl: 'https://study-app-steel.vercel.app/',
    imageUrl: '/assets/Study-hub.png'
  },
  {
    id: 'venomousstudio',
    title: 'Venomous Studio',
    category: 'design react',
    pill: 'Digital Agency Showcase',
    description: 'Cutting-edge portfolio showcase for creative digital agency services, featuring glassmorphism UI and fluid animations.',
    liveDemoUrl: 'https://venomous-studio.vercel.app/',
    imageUrl: '/assets/Venomous Studio.png'
  }
];

export const seedProductsList = [
  {
    id: 'prod-1',
    title: 'StayPilot Pro SaaS Starter',
    category: 'Web Apps',
    price: '$49',
    badge: 'Best Seller',
    description: 'Production-ready full-stack hotel & property management SaaS template built with React, Next.js, Firebase Auth & Stripe.',
    imageUrl: '/assets/StayPilot.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://stay-pilot-liard.vercel.app/',
    features: ['Next.js Pages Router', 'Firebase Realtime DB', 'Stripe Billing Integration', 'Responsive Dark UI']
  },
  {
    id: 'prod-2',
    title: 'VScheduler Booking Engine',
    category: 'Source Code',
    price: '$29',
    badge: 'Popular',
    description: 'Interactive appointment scheduling component with calendar synchronization, drag-drop slots, and automated email reminders.',
    imageUrl: '/assets/VScheduler.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://vscheduler-five.vercel.app/',
    features: ['Calendar Sync', 'EmailJS Reminders', 'Clean React Code', 'Full Customizability']
  },
  {
    id: 'prod-3',
    title: 'Sushiman Artisanal UI Kit',
    category: 'UI Kits',
    price: '$19',
    badge: 'New Release',
    description: 'High-converting Japanese restaurant UI template with glassmorphism design, smooth frame animations, and online menu ordering.',
    imageUrl: '/assets/shushiman.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://vanilla-food-website.vercel.app/',
    features: ['HTML5 Canvas Animations', 'Dark Mode Palette', 'Mobile First Layout', '6 Prebuilt Pages']
  },
  {
    id: 'prod-4',
    title: 'Venomous Dark Studio Theme',
    category: 'Templates',
    price: '$39',
    badge: 'Featured',
    description: 'Sleek portfolio & agency showcase template featuring 192-frame background animation canvas, reviews slider, and contact forms.',
    imageUrl: '/assets/Venomous Studio.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://venomous-studio.vercel.app/',
    features: ['Frame Animation Engine', 'Firebase & MongoDB Ready', 'SEO Optimized', 'Tailored CSS System']
  }
];

// Helper to get item array from localStorage safely
export function getLocalItems(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn(`Failed to parse localStorage key [${key}]:`, e);
    return [];
  }
}

// Helper to set item array in localStorage safely
export function setLocalItems(key, items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.warn(`Failed to set localStorage key [${key}]:`, e);
  }
}

// Get combined list of projects (Firestore + localStorage + seedProjects - deletedProjects)
export function getCombinedProjects(firestoreProjects = []) {
  const localProjects = getLocalItems(PROJECTS_CACHE_KEY);
  const deletedIds = getLocalItems(DELETED_PROJECTS_KEY);

  const mergedMap = new Map();

  // 1. Add seed projects first (unless deleted)
  initialSeedProjects.forEach(seed => {
    const keyId = seed.id;
    if (!deletedIds.includes(keyId) && !deletedIds.includes(seed.title?.toLowerCase())) {
      mergedMap.set(keyId, seed);
    }
  });

  // 2. Add firestore projects (overrides seed if same id/title)
  firestoreProjects.forEach(p => {
    const keyId = p.id || p.title?.toLowerCase().replace(/\s+/g, '-');
    if (!deletedIds.includes(keyId) && !deletedIds.includes(p.title?.toLowerCase())) {
      mergedMap.set(keyId, { ...p, id: keyId });
    }
  });

  // 3. Add local projects (user created or updated via admin dashboard)
  localProjects.forEach(p => {
    const keyId = p.id || p._id || p.title?.toLowerCase().replace(/\s+/g, '-');
    if (!deletedIds.includes(keyId) && !deletedIds.includes(p.title?.toLowerCase())) {
      mergedMap.set(keyId, { ...p, id: keyId });
    }
  });

  return Array.from(mergedMap.values());
}

// Save or Update a project in localStorage
export function saveLocalProject(project) {
  const local = getLocalItems(PROJECTS_CACHE_KEY);
  const id = project.id || project._id || Date.now().toString();
  const newProj = { ...project, id };

  const existingIdx = local.findIndex(p => (p.id === id || (p.title && p.title.toLowerCase() === newProj.title?.toLowerCase())));
  if (existingIdx >= 0) {
    local[existingIdx] = newProj;
  } else {
    local.unshift(newProj);
  }

  setLocalItems(PROJECTS_CACHE_KEY, local);

  // Remove from deleted list if it was previously marked deleted
  const deleted = getLocalItems(DELETED_PROJECTS_KEY);
  const filteredDeleted = deleted.filter(d => d !== id && d !== newProj.title?.toLowerCase());
  setLocalItems(DELETED_PROJECTS_KEY, filteredDeleted);

  return newProj;
}

// Delete a project from localStorage & track deleted ID
export function deleteLocalProject(id, title) {
  const local = getLocalItems(PROJECTS_CACHE_KEY);
  const updated = local.filter(p => p.id !== id && p._id !== id && p.title?.toLowerCase() !== title?.toLowerCase());
  setLocalItems(PROJECTS_CACHE_KEY, updated);

  const deleted = getLocalItems(DELETED_PROJECTS_KEY);
  if (id && !deleted.includes(id)) deleted.push(id);
  if (title && !deleted.includes(title.toLowerCase())) deleted.push(title.toLowerCase());
  setLocalItems(DELETED_PROJECTS_KEY, deleted);
}

// Get combined list of products
export function getCombinedProducts(apiProducts = []) {
  const localProducts = getLocalItems(PRODUCTS_CACHE_KEY);
  const deletedIds = getLocalItems(DELETED_PRODUCTS_KEY);

  const mergedMap = new Map();

  // 1. Add seeds unless deleted
  seedProductsList.forEach(seed => {
    if (!deletedIds.includes(seed.id) && !deletedIds.includes(seed.title?.toLowerCase())) {
      mergedMap.set(seed.id, seed);
    }
  });

  // 2. Add API products
  apiProducts.forEach(p => {
    const id = p._id || p.id;
    if (!deletedIds.includes(id) && !deletedIds.includes(p.title?.toLowerCase())) {
      mergedMap.set(id, { ...p, id });
    }
  });

  // 3. Add local products
  localProducts.forEach(p => {
    const id = p._id || p.id;
    if (!deletedIds.includes(id) && !deletedIds.includes(p.title?.toLowerCase())) {
      mergedMap.set(id, { ...p, id });
    }
  });

  return Array.from(mergedMap.values());
}

// Save local product
export function saveLocalProduct(product) {
  const local = getLocalItems(PRODUCTS_CACHE_KEY);
  const id = product._id || product.id || Date.now().toString();
  const newProd = { ...product, id, _id: id };

  const idx = local.findIndex(p => p._id === id || p.id === id || p.title?.toLowerCase() === newProd.title?.toLowerCase());
  if (idx >= 0) {
    local[idx] = newProd;
  } else {
    local.unshift(newProd);
  }

  setLocalItems(PRODUCTS_CACHE_KEY, local);

  const deleted = getLocalItems(DELETED_PRODUCTS_KEY);
  const filteredDeleted = deleted.filter(d => d !== id && d !== newProd.title?.toLowerCase());
  setLocalItems(DELETED_PRODUCTS_KEY, filteredDeleted);

  return newProd;
}

// Delete local product
export function deleteLocalProduct(id, title) {
  const local = getLocalItems(PRODUCTS_CACHE_KEY);
  const updated = local.filter(p => p._id !== id && p.id !== id && p.title?.toLowerCase() !== title?.toLowerCase());
  setLocalItems(PRODUCTS_CACHE_KEY, updated);

  const deleted = getLocalItems(DELETED_PRODUCTS_KEY);
  if (id && !deleted.includes(id)) deleted.push(id);
  if (title && !deleted.includes(title.toLowerCase())) deleted.push(title.toLowerCase());
  setLocalItems(DELETED_PRODUCTS_KEY, deleted);
}
