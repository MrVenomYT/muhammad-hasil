import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import Project from '../models/Project';
import Product from '../models/Product';
import Inquiry from '../models/Inquiry';
import Review from '../models/Review';
import Service from '../models/Service';
import Profile from '../models/Profile';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(filename) {
  ensureDataDir();
  return path.join(DATA_DIR, filename);
}

function readJsonFile(filename, defaultData = []) {
  try {
    const file = getFilePath(filename);
    if (!fs.existsSync(file)) {
      writeJsonFile(filename, defaultData);
      return defaultData;
    }
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultData;
  }
}

function writeJsonFile(filename, data) {
  try {
    const file = getFilePath(filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
}

// Baseline Initial Seed Data
const initialProjects = [
  {
    id: 'takumisushi',
    title: 'Takumi Sushi',
    category: 'fullstack react',
    pill: 'React / Japanese Dining UI',
    description: 'Authentic Japanese dining and sushi ordering web application featuring interactive menus, sleek dark aesthetic UI, and seamless food ordering experience.',
    liveDemoUrl: 'https://takumi-psi.vercel.app/',
    githubUrl: 'https://github.com/venomous-studio',
    imageUrl: '/assets/thumbnail.png',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    featured: true,
    views: 420,
    likes: 38,
    createdAt: new Date('2025-01-10').toISOString()
  },
  {
    id: 'staypilot',
    title: 'StayPilot',
    category: 'fullstack react',
    pill: 'Full Stack Web App',
    description: 'All-in-one web platform for hospitality & property management, booking reservations, guest scheduling, and analytics.',
    liveDemoUrl: 'https://stay-pilot-liard.vercel.app/',
    githubUrl: 'https://github.com/venomous-studio',
    imageUrl: '/assets/StayPilot.png',
    technologies: ['React', 'Next.js', 'Firebase', 'Node.js', 'Stripe'],
    featured: true,
    views: 610,
    likes: 54,
    createdAt: new Date('2025-02-15').toISOString()
  },
  {
    id: 'vscheduler',
    title: 'VScheduler',
    category: 'fullstack react',
    pill: 'React / Web App',
    description: 'Interactive appointment booking and automated scheduling system built for seamless workflow management.',
    liveDemoUrl: 'https://vscheduler-five.vercel.app/',
    githubUrl: 'https://github.com/venomous-studio',
    imageUrl: '/assets/VScheduler.png',
    technologies: ['React', 'FullCalendar', 'EmailJS', 'Tailwind CSS'],
    featured: true,
    views: 380,
    likes: 29,
    createdAt: new Date('2025-03-01').toISOString()
  },
  {
    id: 'sushiman',
    title: 'Sushiman',
    category: 'design',
    pill: 'Web Design & UI',
    description: 'High-converting culinary website with authentic Japanese aesthetics, smooth scroll animations, and food ordering UI.',
    liveDemoUrl: 'https://vanilla-food-website.vercel.app/',
    githubUrl: 'https://github.com/venomous-studio',
    imageUrl: '/assets/shushiman.png',
    technologies: ['HTML5 Canvas', 'CSS3 Glassmorphism', 'Vanilla JS'],
    featured: true,
    views: 295,
    likes: 41,
    createdAt: new Date('2025-03-20').toISOString()
  },
  {
    id: 'coffee',
    title: 'Coffee Theme',
    category: 'design',
    pill: 'Artisanal Cafe Shop',
    description: 'Rich dark-themed website featuring artisanal coffee menus, online ordering, smooth scrolling, and brand aesthetics.',
    liveDemoUrl: 'https://coffee-theme.vercel.app/',
    githubUrl: 'https://github.com/venomous-studio',
    imageUrl: '/assets/coffee.png',
    technologies: ['React', 'Responsive Design', 'Tailwind CSS'],
    featured: false,
    views: 180,
    likes: 19,
    createdAt: new Date('2025-04-05').toISOString()
  },
  {
    id: 'studyhub',
    title: 'Study Hub',
    category: 'fullstack react',
    pill: 'Learning Portal',
    description: 'Comprehensive educational application designed to help students organize study sessions, resources, and progress tracking.',
    liveDemoUrl: 'https://study-app-steel.vercel.app/',
    githubUrl: 'https://github.com/venomous-studio',
    imageUrl: '/assets/Study-hub.png',
    technologies: ['React', 'Next.js', 'MongoDB', 'Node.js'],
    featured: false,
    views: 310,
    likes: 24,
    createdAt: new Date('2025-05-12').toISOString()
  },
  {
    id: 'venomousstudio',
    title: 'Venomous Studio',
    category: 'design react',
    pill: 'Digital Agency Showcase',
    description: 'Cutting-edge portfolio showcase for creative digital agency services, featuring glassmorphism UI and fluid animations.',
    liveDemoUrl: 'https://venomous-studio.vercel.app/',
    githubUrl: 'https://github.com/venomous-studio',
    imageUrl: '/assets/Venomous Studio.png',
    technologies: ['React', 'Canvas 192-Frame Engine', 'CSS Glassmorphism'],
    featured: true,
    views: 750,
    likes: 86,
    createdAt: new Date('2025-06-01').toISOString()
  }
];

const initialProducts = [
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
    features: ['Next.js Pages Router', 'Firebase Realtime DB', 'Stripe Billing Integration', 'Responsive Dark UI'],
    salesCount: 48,
    rating: 5.0,
    isPublished: true,
    createdAt: new Date('2025-02-18').toISOString()
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
    features: ['Calendar Sync', 'EmailJS Reminders', 'Clean React Code', 'Full Customizability'],
    salesCount: 32,
    rating: 4.9,
    isPublished: true,
    createdAt: new Date('2025-03-05').toISOString()
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
    features: ['HTML5 Canvas Animations', 'Dark Mode Palette', 'Mobile First Layout', '6 Prebuilt Pages'],
    salesCount: 19,
    rating: 4.8,
    isPublished: true,
    createdAt: new Date('2025-03-25').toISOString()
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
    features: ['Frame Animation Engine', 'Firebase & MongoDB Ready', 'SEO Optimized', 'Tailored CSS System'],
    salesCount: 65,
    rating: 5.0,
    isPublished: true,
    createdAt: new Date('2025-06-10').toISOString()
  }
];

const initialReviews = [
  {
    id: 'rev-1',
    authorName: 'Sarah K.',
    authorRole: 'Digital Marketing Director',
    company: 'Nexus Media',
    rating: 5,
    badge: 'Next.js & React',
    quote: 'Muhammad delivered our Next.js & React web application faster than expected with incredible attention to detail, clean full-stack code, and smooth 192-frame canvas animations.',
    verified: true,
    featured: true,
    createdAt: new Date('2025-04-10').toISOString()
  },
  {
    id: 'rev-2',
    authorName: 'David M.',
    authorRole: 'SaaS Founder',
    company: 'CloudSync Inc',
    rating: 5,
    badge: 'MongoDB & Node.js',
    quote: 'The interactive admin dashboard and MongoDB database persistence he built transformed how our client operations work. Highly recommended for any serious web project!',
    verified: true,
    featured: true,
    createdAt: new Date('2025-05-15').toISOString()
  },
  {
    id: 'rev-3',
    authorName: 'Alex R.',
    authorRole: 'E-Commerce Lead',
    company: 'Aura Collective',
    rating: 5,
    badge: 'Firebase & Security',
    quote: 'Outstanding full-stack engineering precision, Firebase authentication integration, and flawless responsiveness across all desktop and mobile devices. A true professional.',
    verified: true,
    featured: true,
    createdAt: new Date('2025-06-02').toISOString()
  },
  {
    id: 'rev-4',
    authorName: 'Elena V.',
    authorRole: 'Creative Director',
    company: 'Studio Lumina',
    rating: 5,
    badge: 'UI/UX & Web Design',
    quote: 'He transformed our brand UI with stunning dark glassmorphic design, smooth scroll physics, and fast Next.js Pages Router performance. Exceptional quality!',
    verified: true,
    featured: true,
    createdAt: new Date('2025-06-20').toISOString()
  },
  {
    id: 'rev-5',
    authorName: 'Marcus T.',
    authorRole: 'CTO',
    company: 'TechFlow',
    rating: 5,
    badge: 'Full-Stack Architecture',
    quote: 'Flawless real-time data sync with Firestore and clean RESTful API integration. His expertise in full-stack architecture saved us weeks of development time.',
    verified: true,
    featured: true,
    createdAt: new Date('2025-07-04').toISOString()
  },
  {
    id: 'rev-6',
    authorName: 'Brandon P.',
    authorRole: 'Product Manager',
    company: 'Elevate Apps',
    rating: 5,
    badge: 'Next.js & API Routes',
    quote: 'The digital product store and payment workflows he engineered were rock-solid. 100% persistent data even across hard reloads!',
    verified: true,
    featured: true,
    createdAt: new Date('2025-08-11').toISOString()
  }
];

const initialServices = [
  {
    id: 'srv-1',
    title: 'Full-Stack Web App Development',
    category: 'Engineering',
    icon: 'Layers',
    description: 'Custom web applications built from concept to deployment using modern React, Next.js, Node.js, Express, MongoDB, and Firebase.',
    deliverables: ['Production Next.js App', 'REST/GraphQL API endpoints', 'Database schemas & migrations', 'Deployment & CI/CD pipeline'],
    startingPrice: '$800',
    deliveryTime: '5-14 Days',
    active: true,
    order: 1
  },
  {
    id: 'srv-2',
    title: 'UI/UX Design & Frontend Engineering',
    category: 'Design & Code',
    icon: 'Palette',
    description: 'Bespoke dark-aesthetic, glassmorphism, responsive designs with fluid CSS micro-interactions and high-converting landing experiences.',
    deliverables: ['Responsive Web Design', 'Interactive Prototypes', 'Tailwind CSS system', 'Accessibility WCAG AA standard'],
    startingPrice: '$500',
    deliveryTime: '3-7 Days',
    active: true,
    order: 2
  },
  {
    id: 'srv-3',
    title: 'Custom Admin Dashboards & CMS',
    category: 'Enterprise SaaS',
    icon: 'LayoutDashboard',
    description: 'Feature-rich internal management dashboards with role-based auth, live analytics data grids, and CRUD content control.',
    deliverables: ['Secure Authentication', 'Real-time Data Grids', 'CRUD Management Panels', 'CSV/Data Export'],
    startingPrice: '$650',
    deliveryTime: '4-10 Days',
    active: true,
    order: 3
  },
  {
    id: 'srv-4',
    title: 'API Integration & Database Architecture',
    category: 'Backend Architecture',
    icon: 'Database',
    description: 'High-performance database modeling with MongoDB Mongoose schemas, Firebase real-time data sync, and third-party API webhooks.',
    deliverables: ['MongoDB Database Schemas', 'Authentication & Session Handling', 'Stripe / PayPal Payment Gates', 'EmailJS Webhooks'],
    startingPrice: '$450',
    deliveryTime: '3-5 Days',
    active: true,
    order: 4
  }
];

const initialProfile = {
  fullName: 'Muhammad Hasil',
  tagline: 'Full Stack Developer & UI/UX Designer',
  bio: 'Specializing in high-performance web applications, modern responsive UI/UX, MongoDB database architecture, and production Next.js engineering.',
  yearsExperience: 4,
  projectsCompleted: 35,
  happyClients: 28,
  hoursCoded: 3400,
  availableForHire: true,
  availabilityText: 'Available for freelance client work & full-stack contract roles',
  skills: [
    { name: 'React & Next.js', category: 'Frontend', level: 95 },
    { name: 'Node.js & Express', category: 'Backend', level: 90 },
    { name: 'MongoDB & Mongoose', category: 'Database', level: 92 },
    { name: 'Firebase & Firestore', category: 'Cloud', level: 88 },
    { name: 'Tailwind CSS & UI/UX', category: 'Styling', level: 94 },
    { name: 'REST APIs & Webhooks', category: 'Integration', level: 90 }
  ],
  socials: {
    github: 'https://github.com/venomous-studio',
    linkedin: 'https://www.linkedin.com/in/muhammad-hasil/',
    fiverr: 'https://pro.fiverr.com/users/venomdesigne613/',
    patreon: 'https://www.patreon.com/MrVenomYT',
    email: 'esp.hasil.insight@gmail.com'
  }
};

const initialInquiries = [
  {
    id: 'inq-sample-1',
    name: 'Julian Sterling',
    email: 'julian@apexventures.io',
    subject: 'Full-Stack SaaS Platform Architecture',
    message: 'Hi Muhammad, we reviewed your StayPilot and VScheduler portfolio projects. We want to commission a custom booking and member portal for our executive coworking spaces. Let us know your availability!',
    budget: '$3,000 - $5,000',
    timeline: '2-4 Weeks',
    serviceType: 'Full-Stack Web App Development',
    status: 'new',
    starred: true,
    notes: 'High priority inbound lead from Fiverr / Portfolio',
    createdAt: new Date('2026-09-28T14:20:00Z').toISOString()
  }
];

// Seed/Sync helper for MongoDB
async function syncCollectionWithSeed(Model, seedItems, filename) {
  try {
    if (Model.db && Model.db.readyState === 1) {
      const count = await Model.countDocuments();
      if (count === 0 && seedItems.length > 0) {
        // Seed MongoDB from existing disk items or defaults
        const diskItems = readJsonFile(filename, seedItems);
        const docsToInsert = diskItems.map(item => {
          const doc = { ...item };
          if (doc.id && !doc._id) {
            delete doc.id;
          }
          return doc;
        });
        await Model.insertMany(docsToInsert);
      }
    }
  } catch (err) {
    console.warn(`Sync ${Model.modelName} note:`, err.message);
  }
}

// -------------------------------------------------------------
// PROJECTS REPOSITORY
// -------------------------------------------------------------
export async function getProjects() {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('projects.json', initialProjects);

  try {
    if (Project.db && Project.db.readyState === 1) {
      await syncCollectionWithSeed(Project, disk, 'projects.json');
      const docs = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        const normalized = docs.map(d => ({
          ...d,
          id: d._id ? d._id.toString() : d.id,
          _id: d._id ? d._id.toString() : undefined
        }));
        // Update persistent disk backup
        writeJsonFile('projects.json', normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Projects Mongo read note:', err.message);
  }

  return disk;
}

export async function saveProject(projectData) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('projects.json', initialProjects);
  const id = projectData.id || projectData._id || 'proj-' + Date.now();

  const itemToSave = {
    ...projectData,
    id,
    updatedAt: new Date().toISOString()
  };

  // 1. Update persistent local storage first
  const existingIndex = disk.findIndex(p => p.id === id || p._id === id);
  if (existingIndex >= 0) {
    disk[existingIndex] = { ...disk[existingIndex], ...itemToSave };
  } else {
    disk.unshift(itemToSave);
  }
  writeJsonFile('projects.json', disk);

  // 2. Update MongoDB if connected
  try {
    if (Project.db && Project.db.readyState === 1) {
      if (projectData._id) {
        await Project.findByIdAndUpdate(projectData._id, itemToSave, { upsert: true });
      } else {
        const existing = await Project.findOne({ title: projectData.title });
        if (existing) {
          await Project.findByIdAndUpdate(existing._id, itemToSave);
        } else {
          await Project.create(itemToSave);
        }
      }
    }
  } catch (err) {
    console.warn('Projects Mongo save note:', err.message);
  }

  return itemToSave;
}

export async function deleteProject(id) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('projects.json', initialProjects);
  const filtered = disk.filter(p => p.id !== id && p._id !== id);
  writeJsonFile('projects.json', filtered);

  try {
    if (Project.db && Project.db.readyState === 1) {
      await Project.deleteOne({ $or: [{ _id: id }, { slug: id }, { title: id }] });
    }
  } catch (err) {
    console.warn('Projects Mongo delete note:', err.message);
  }

  return { success: true };
}

// -------------------------------------------------------------
// PRODUCTS REPOSITORY
// -------------------------------------------------------------
export async function getProducts() {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('products.json', initialProducts);

  try {
    if (Product.db && Product.db.readyState === 1) {
      await syncCollectionWithSeed(Product, disk, 'products.json');
      const docs = await Product.find({}).sort({ order: 1, createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        const normalized = docs.map(d => ({
          ...d,
          id: d._id ? d._id.toString() : d.id,
          _id: d._id ? d._id.toString() : undefined
        }));
        writeJsonFile('products.json', normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Products Mongo read note:', err.message);
  }

  return disk;
}

export async function saveProduct(productData) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('products.json', initialProducts);
  const id = productData.id || productData._id || 'prod-' + Date.now();

  const itemToSave = {
    ...productData,
    id,
    updatedAt: new Date().toISOString()
  };

  const existingIndex = disk.findIndex(p => p.id === id || p._id === id);
  if (existingIndex >= 0) {
    disk[existingIndex] = { ...disk[existingIndex], ...itemToSave };
  } else {
    disk.unshift(itemToSave);
  }
  writeJsonFile('products.json', disk);

  try {
    if (Product.db && Product.db.readyState === 1) {
      if (productData._id) {
        await Product.findByIdAndUpdate(productData._id, itemToSave, { upsert: true });
      } else {
        const existing = await Product.findOne({ title: productData.title });
        if (existing) {
          await Product.findByIdAndUpdate(existing._id, itemToSave);
        } else {
          await Product.create(itemToSave);
        }
      }
    }
  } catch (err) {
    console.warn('Products Mongo save note:', err.message);
  }

  return itemToSave;
}

export async function deleteProduct(id) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('products.json', initialProducts);
  const filtered = disk.filter(p => p.id !== id && p._id !== id);
  writeJsonFile('products.json', filtered);

  try {
    if (Product.db && Product.db.readyState === 1) {
      await Product.deleteOne({ $or: [{ _id: id }, { slug: id }, { title: id }] });
    }
  } catch (err) {
    console.warn('Products Mongo delete note:', err.message);
  }

  return { success: true };
}

// -------------------------------------------------------------
// INQUIRIES REPOSITORY
// -------------------------------------------------------------
export async function getInquiries() {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('inquiries.json', initialInquiries);

  try {
    if (Inquiry.db && Inquiry.db.readyState === 1) {
      await syncCollectionWithSeed(Inquiry, disk, 'inquiries.json');
      const docs = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        const normalized = docs.map(d => ({
          ...d,
          id: d._id ? d._id.toString() : d.id,
          _id: d._id ? d._id.toString() : undefined
        }));
        writeJsonFile('inquiries.json', normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Inquiries Mongo read note:', err.message);
  }

  return disk;
}

export async function saveInquiry(inquiryData) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('inquiries.json', initialInquiries);
  const id = inquiryData.id || inquiryData._id || 'inq-' + Date.now();

  const itemToSave = {
    ...inquiryData,
    id,
    createdAt: inquiryData.createdAt || new Date().toISOString()
  };

  const existingIndex = disk.findIndex(i => i.id === id || i._id === id);
  if (existingIndex >= 0) {
    disk[existingIndex] = { ...disk[existingIndex], ...itemToSave };
  } else {
    disk.unshift(itemToSave);
  }
  writeJsonFile('inquiries.json', disk);

  try {
    if (Inquiry.db && Inquiry.db.readyState === 1) {
      if (inquiryData._id) {
        await Inquiry.findByIdAndUpdate(inquiryData._id, itemToSave, { upsert: true });
      } else {
        await Inquiry.create(itemToSave);
      }
    }
  } catch (err) {
    console.warn('Inquiry Mongo save note:', err.message);
  }

  return itemToSave;
}

export async function deleteInquiry(id) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('inquiries.json', initialInquiries);
  const filtered = disk.filter(i => i.id !== id && i._id !== id);
  writeJsonFile('inquiries.json', filtered);

  try {
    if (Inquiry.db && Inquiry.db.readyState === 1) {
      await Inquiry.deleteOne({ $or: [{ _id: id }, { id }] });
    }
  } catch (err) {
    console.warn('Inquiry Mongo delete note:', err.message);
  }

  return { success: true };
}

// -------------------------------------------------------------
// REVIEWS REPOSITORY
// -------------------------------------------------------------
export async function getReviews() {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('reviews.json', initialReviews);

  try {
    if (Review.db && Review.db.readyState === 1) {
      await syncCollectionWithSeed(Review, disk, 'reviews.json');
      const docs = await Review.find({}).sort({ order: 1, createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        const normalized = docs.map(d => ({
          ...d,
          id: d._id ? d._id.toString() : d.id,
          _id: d._id ? d._id.toString() : undefined
        }));
        writeJsonFile('reviews.json', normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Reviews Mongo read note:', err.message);
  }

  return disk;
}

export async function saveReview(reviewData) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('reviews.json', initialReviews);
  const id = reviewData.id || reviewData._id || 'rev-' + Date.now();

  const itemToSave = {
    ...reviewData,
    id
  };

  const existingIndex = disk.findIndex(r => r.id === id || r._id === id);
  if (existingIndex >= 0) {
    disk[existingIndex] = { ...disk[existingIndex], ...itemToSave };
  } else {
    disk.unshift(itemToSave);
  }
  writeJsonFile('reviews.json', disk);

  try {
    if (Review.db && Review.db.readyState === 1) {
      if (reviewData._id) {
        await Review.findByIdAndUpdate(reviewData._id, itemToSave, { upsert: true });
      } else {
        await Review.create(itemToSave);
      }
    }
  } catch (err) {
    console.warn('Review Mongo save note:', err.message);
  }

  return itemToSave;
}

export async function deleteReview(id) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('reviews.json', initialReviews);
  const filtered = disk.filter(r => r.id !== id && r._id !== id);
  writeJsonFile('reviews.json', filtered);

  try {
    if (Review.db && Review.db.readyState === 1) {
      await Review.deleteOne({ $or: [{ _id: id }, { id }] });
    }
  } catch (err) {
    console.warn('Review Mongo delete note:', err.message);
  }

  return { success: true };
}

// -------------------------------------------------------------
// SERVICES REPOSITORY
// -------------------------------------------------------------
export async function getServices() {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('services.json', initialServices);

  try {
    if (Service.db && Service.db.readyState === 1) {
      await syncCollectionWithSeed(Service, disk, 'services.json');
      const docs = await Service.find({}).sort({ order: 1 }).lean();
      if (docs && docs.length > 0) {
        const normalized = docs.map(d => ({
          ...d,
          id: d._id ? d._id.toString() : d.id,
          _id: d._id ? d._id.toString() : undefined
        }));
        writeJsonFile('services.json', normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Services Mongo read note:', err.message);
  }

  return disk;
}

export async function saveService(serviceData) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('services.json', initialServices);
  const id = serviceData.id || serviceData._id || 'srv-' + Date.now();

  const itemToSave = {
    ...serviceData,
    id
  };

  const existingIndex = disk.findIndex(s => s.id === id || s._id === id);
  if (existingIndex >= 0) {
    disk[existingIndex] = { ...disk[existingIndex], ...itemToSave };
  } else {
    disk.push(itemToSave);
  }
  writeJsonFile('services.json', disk);

  try {
    if (Service.db && Service.db.readyState === 1) {
      if (serviceData._id) {
        await Service.findByIdAndUpdate(serviceData._id, itemToSave, { upsert: true });
      } else {
        await Service.create(itemToSave);
      }
    }
  } catch (err) {
    console.warn('Service Mongo save note:', err.message);
  }

  return itemToSave;
}

export async function deleteService(id) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('services.json', initialServices);
  const filtered = disk.filter(s => s.id !== id && s._id !== id);
  writeJsonFile('services.json', filtered);

  try {
    if (Service.db && Service.db.readyState === 1) {
      await Service.deleteOne({ $or: [{ _id: id }, { id }] });
    }
  } catch (err) {
    console.warn('Service Mongo delete note:', err.message);
  }

  return { success: true };
}

// -------------------------------------------------------------
// PROFILE & METRICS REPOSITORY
// -------------------------------------------------------------
export async function getProfile() {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('profile.json', initialProfile);

  try {
    if (Profile.db && Profile.db.readyState === 1) {
      const doc = await Profile.findOne({}).lean();
      if (doc) {
        const normalized = {
          ...doc,
          id: doc._id ? doc._id.toString() : 'profile',
        };
        writeJsonFile('profile.json', normalized);
        return normalized;
      } else {
        await Profile.create(disk);
      }
    }
  } catch (err) {
    console.warn('Profile Mongo read note:', err.message);
  }

  return disk;
}

export async function saveProfile(profileData) {
  await connectToDatabase().catch(() => {});
  const disk = readJsonFile('profile.json', initialProfile);
  const updated = {
    ...disk,
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  writeJsonFile('profile.json', updated);

  try {
    if (Profile.db && Profile.db.readyState === 1) {
      const existing = await Profile.findOne({});
      if (existing) {
        await Profile.findByIdAndUpdate(existing._id, updated);
      } else {
        await Profile.create(updated);
      }
    }
  } catch (err) {
    console.warn('Profile Mongo save note:', err.message);
  }

  return updated;
}
