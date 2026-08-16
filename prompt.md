# Master Prompt & System Execution Blueprint

This document aggregates all user prompts, technical specifications, and design directives into a single, cohesive **Master Prompt** structured phase-by-phase for building, optimizing, and deploying the **Muhammad Hasil Portfolio & Digital Products Store**.

---

## 🚀 Master Prompt Overview

You are an expert Senior Full-Stack Engineer and Creative UI/UX Designer. Your goal is to transform a static portfolio into a state-of-the-art Next.js web application with dynamic background canvas frame animations, an authenticated Admin Control Center, a MongoDB-backed Digital Products Store, and seamless Vercel deployment via GitHub.

---

## 📌 Phase 1: Architecture & Next.js Pages Router Conversion

1. **Convert HTML to Next.js**:
   - Convert all static `.html` files (`index.html`, `about.html`, `projects.html`, `services.html`, `contact.html`) into Next.js Pages Router files (`src/pages/index.jsx`, `about.jsx`, `projects.jsx`, `services.jsx`, `contact.jsx`, `admin/login.jsx`, `admin/dashboard.jsx`).
   - Use meaningful component names according to their usage (e.g., `HomeSection`, `ProjectsSection`, `ProductsSection`, `AdminDashboardSection`).
   - Safely remove static `.html` files after conversion without breaking assets or links.

2. **Core Component Tree**:
   - Build a global `_app.jsx` wrapping pages with `AuthProvider`, `Navbar`, `Footer`, and `CanvasAnimation`.
   - Implement interactive typewriter animation for the main hero heading ("MUHAMMAD HASIL").

---

## 📌 Phase 2: Environment Variables & Security Configuration

1. **Unified `.env` Architecture**:
   - Store all API credentials in [.env](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/.env) without key duplication:
     - `EMAILJS_*` (Service ID, Template ID, Public Key)
     - `FIREBASE_*` (API Key, Auth Domain, Project ID, Storage Bucket, Messaging Sender ID, App ID, Measurement ID)
     - `MONGODB_URI`
     - `FIREBASE_ADMIN_*` (Full Service Account credentials)
   - Create [.env.example](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/.env.example) as a public template.

2. **`next.config.js` Env Mapping**:
   - Configure [next.config.js](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/next.config.js) to expose environment variables directly to browser bundles without needing `NEXT_PUBLIC_` prefixes in `.env`.
   - Enable SWC minification (`swcMinify: true`), compression (`compress: true`), and remote image patterns for external images.

3. **Firebase Admin SDK Setup**:
   - Create [firebase-admin.js](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/firebase-admin.js) initializing `firebase-admin` using environment variables.

---

## 📌 Phase 3: Firebase Auth & Admin Dashboard Security

1. **Single-User Admin Access**:
   - Remove public signup functionality ("First time? Create Admin Account").
   - Restrict dashboard access strictly to authenticated admin credentials.

2. **Route Protection**:
   - Protect `/admin/dashboard` using `AuthContext`. Unauthenticated users are redirected immediately to `/admin/login`.

---

## 📌 Phase 4: Digital Products Store & MongoDB Data Persistence

1. **MongoDB Connection & Mongoose Models**:
   - Create database connection helper in [src/lib/mongodb.js](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/src/lib/mongodb.js) with `global.mongoose` connection caching.
   - Create Mongoose schema [src/models/Product.js](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/src/models/Product.js) with compound indexing on `createdAt` and `category`.

2. **REST API Endpoints**:
   - Build `/api/products/index.js` (GET all products & POST new product).
   - Build `/api/products/[id].js` (PUT update product & DELETE product).

3. **Zero Data Loss Dual Persistence**:
   - Mirror MongoDB data into `localStorage` cache (`app_products_cache`) as an immediate fallback to guarantee 0 data loss across hard browser reloads.

4. **Products Store Page & Admin CRUD**:
   - Create `/products` page and add "Products" link to [Navbar.jsx](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/src/components/Navbar.jsx).
   - Add full Products Management tab to [AdminDashboardSection.jsx](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/src/components/AdminDashboardSection.jsx).

---

## 📌 Phase 5: 30 FPS Background Canvas Scroll Animation Engine

1. **192-Frame Sequence**:
   - Render a fixed background `<canvas id="animation-canvas">` utilizing 192 keyframes (`/public/frames/frame_0001.png` to `/public/frames/frame_0192.png`).

2. **Smooth Scroll Scrubbing & Physics**:
   - Map scroll progress (`window.scrollY / maxScroll`) across the full range of 192 frames.
   - Implement lerp spring dampening (`currentFrame += diff * 0.22` to `0.28`).
   - Lock animation loop timing to a target 30 FPS interval (`1000 / 30 = ~33.33ms`) to prevent jitter on high refresh rate displays (60Hz, 120Hz, 144Hz).

3. **Gapless Rendering & Radial Preloading**:
   - Implement `getBestAvailableImage()` nearest-frame fallback so the canvas never clears to black.
   - Preload frames in 16-parallel image stream batches, prioritizing frames surrounding the active page target.

---

## 📌 Phase 6: Design Systems, Styling & Responsiveness

1. **Dark Glassmorphism Design Tokens**:
   - Use curated dark palette (`--bg-dark: #070605`, `--bg-card: rgba(22, 17, 13, 0.85)`, `--accent-orange: #f97316`, `backdrop-filter: blur(20px)`).

2. **Compact Pill Buttons**:
   - Restyle all admin dashboard submit, edit, delete, and tab buttons to match homepage compact pill buttons (`btn-primary` and `btn-secondary`).

3. **Auto-Playing Infinite Client Reviews Marquee**:
   - Create a buttonless, continuous auto-playing marquee slider for client reviews in [HomeSection.jsx](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/src/components/HomeSection.jsx) with pause-on-hover interaction.

4. **Responsive Breakpoints**:
   - Add media queries (`@media (max-width: 992px)`, `@media (max-width: 768px)`, `@media (max-width: 480px)`) ensuring fluid mobile and tablet layouts.
   - Implement `formatImageUrl()` and `onError` image fallback handling.

---

## 📌 Phase 7: Build Verification & Vercel Deployment via GitHub

1. **Vercel Configuration**:
   - Create [vercel.json](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/vercel.json) declaring Next.js framework settings.
   - Create [.gitignore](file:///c:/Users/No%20Need/Desktop/Muhammad%20Hasil/.gitignore) protecting `.env`, `.next/`, and `node_modules/`.

2. **Automated Verification**:
   - Run `npm run build` and ensure 0 compilation errors across static and dynamic API routes.

3. **GitHub Push**:
   - Commit and push clean codebase to `https://github.com/MrVenomYT/muhammad-hasil` on branch `main`.

---

## ⚡ Summary Checklist

- [x] Next.js Pages Router structure
- [x] Environment variable mapping in `next.config.js`
- [x] Firebase Auth admin protection
- [x] MongoDB Products Store & REST APIs
- [x] Dual `localStorage` + MongoDB persistence
- [x] 30 FPS 192-frame background scroll animation
- [x] Dark glassmorphic design system & compact pill buttons
- [x] Auto-playing reviews marquee
- [x] Full mobile & tablet responsiveness
- [x] GitHub push & Vercel deployment configuration
