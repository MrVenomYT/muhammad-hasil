# Muhammad Hasil Portfolio

Modern JavaScript-only Next.js portfolio with a hidden local admin dashboard, dynamic projects, reviews, contact submissions, and visit analytics.

## Routes

- `/` home with parallax sections, animated hero, featured projects, testimonials, and visits counter
- `/about` biography, animated skills, and experience timeline
- `/projects` all dynamic projects
- `/projects/[tag]` filtered projects for `Node.js`, `Vanilla`, `React.js`, `Next.js`, and `TypeScript`
- `/contact` animated contact form with local dashboard submissions
- `/admin` hidden login
- `/admin/dashboard` protected local CMS dashboard

## Admin Login

- Username: `Muhammad Hasil`
- Password: `H03214981005a`

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

`npm run dev` uses Next.js Turbopack for faster local startup. If a local machine has Turbopack issues, use:

```bash
npm run dev:webpack
```

If you ever see a stale missing chunk error from `.next`, stop the running dev server and run:

```bash
npm run clean
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Deploy To Vercel

1. Push this project to GitHub.
2. Import the GitHub repository in Vercel.
3. Vercel will detect Next.js automatically.
4. Build command: `npm run build`
5. Install command: `npm install`

The dashboard uses browser localStorage as a simple CMS simulation, so content is stored per browser/device.
