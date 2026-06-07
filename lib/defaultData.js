export const projectTags = ["Node.js", "Vanilla", "React.js", "Next.js", "TypeScript"];

export const defaultProjects = [
  {
    id: "venomous",
    title: "Venomous",
    description: "A polished web experience with fast interactions, sharp visuals, and production deployment.",
    liveUrl: "https://venomous-gold.vercel.app",
    thumbnail: "/assets/projects/venomous.png",
    tag: "Next.js",
    featured: true,
    features: ["Responsive pages", "Smooth interactions", "Production deployment"],
    technologies: ["JavaScript", "Tailwind CSS", "Vercel"],
    frameworks: ["Next.js", "React.js"],
    tools: ["GitHub", "Vercel"]
  },
  {
    id: "vanilla-food",
    title: "Vanilla Food Website",
    description: "A clean restaurant website built with responsive layouts and lightweight client-side behavior.",
    liveUrl: "https://vanilla-food-website.vercel.app/",
    thumbnail: "/assets/projects/vanila-food.png",
    tag: "Vanilla",
    featured: true,
    features: ["Restaurant sections", "Menu presentation", "Mobile-friendly layout"],
    technologies: ["HTML", "CSS", "JavaScript"],
    frameworks: ["Vanilla JS"],
    tools: ["GitHub", "Vercel"]
  },
  {
    id: "proshop-mern",
    title: "Proshop MERN",
    description: "Full-stack ecommerce storefront with catalog browsing, product pages, and purchase flow foundations.",
    liveUrl: "https://proshop-mern.herokuapp.com/",
    thumbnail: "/assets/projects/proshopmern.gif",
    tag: "Node.js",
    featured: false,
    features: ["Product catalog", "Commerce flow", "Full-stack structure"],
    technologies: ["JavaScript", "MongoDB", "Express"],
    frameworks: ["React.js", "Node.js"],
    tools: ["Heroku", "GitHub"]
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Personal portfolio system designed to present work, skills, and developer personality clearly.",
    liveUrl: "https://mrvenomyt.herokuapp.com/",
    thumbnail: "/assets/projects/portfolio.gif",
    tag: "React.js",
    featured: false,
    features: ["Personal profile", "Project showcase", "Animated sections"],
    technologies: ["JavaScript", "CSS", "React components"],
    frameworks: ["React.js"],
    tools: ["GitHub", "Heroku"]
  },
  {
    id: "portfolio-beta",
    title: "Portfolio Beta Version",
    description: "Experimental portfolio iteration with animated sections, richer motion, and refined visual treatment.",
    liveUrl: "https://www.hasil.tk/",
    thumbnail: "/assets/projects/beta.gif",
    tag: "TypeScript",
    featured: false,
    features: ["Experimental UI", "Animated sections", "Portfolio content"],
    technologies: ["TypeScript", "CSS", "Component architecture"],
    frameworks: ["React.js"],
    tools: ["GitHub"]
  },
  {
    id: "rental-car",
    title: "Rental Car Web App",
    description: "Responsive rental interface for browsing vehicles, comparing options, and starting bookings.",
    liveUrl: "https://rental-car-webapp.vercel.app/",
    thumbnail: "/assets/projects/rental.png",
    tag: "React.js",
    featured: true,
    features: ["Vehicle listings", "Responsive browsing", "Booking entry flow"],
    technologies: ["JavaScript", "CSS", "React components"],
    frameworks: ["React.js"],
    tools: ["Vercel", "GitHub"]
  }
];

export const defaultReviews = [
  {
    id: "review-1",
    name: "Ayesha Khan",
    role: "Startup Founder",
    rating: 5,
    message: "Muhammad turns rough product ideas into clean, fast interfaces that feel ready for real users."
  },
  {
    id: "review-2",
    name: "Daniel Reed",
    role: "Product Manager",
    rating: 5,
    message: "The communication was excellent and the finished frontend had the kind of polish we usually expect from a full design team."
  },
  {
    id: "review-3",
    name: "Sara Malik",
    role: "Creative Director",
    rating: 4,
    message: "Strong visual taste, responsive execution, and thoughtful details across desktop and mobile."
  }
];

export const defaultProfileInfo = {
  bio: "I am Muhammad Hasil, a frontend-focused developer who builds clean portfolio websites, interactive dashboards, and responsive project experiences. I care about simple layouts, strong visual hierarchy, and interfaces that feel professional on every screen.",
  hireMeUrl: "https://www.fiverr.com/",
  highlights: ["Responsive frontend development", "Admin dashboard systems", "Project-based learning", "Clean portfolio presentation"],
  skills: [
    { id: "skill-1", title: "React.js", level: 94 },
    { id: "skill-2", title: "Next.js", level: 91 },
    { id: "skill-3", title: "Node.js", level: 84 },
    { id: "skill-4", title: "Tailwind CSS", level: 96 }
  ],
  education: [
    { id: "edu-1", title: "Computer Science Studies", organization: "Self-directed and academic learning", year: "2024 - Present", description: "Focused on frontend engineering, JavaScript fundamentals, responsive web development, and project deployment." }
  ],
  certificates: [
    {
      id: "cert-1",
      title: "Frontend Development",
      organization: "Portfolio Training",
      provider: "Udemy",
      credentialUrl: "https://www.udemy.com/",
      year: "2025",
      description: "Practical training in React, component design, Tailwind CSS, and modern website workflows."
    }
  ],
  experience: [
    { id: "job-1", title: "Frontend Developer", organization: "Freelance Projects", year: "2024 - Present", description: "Built responsive websites, portfolio systems, project dashboards, and polished UI flows for public-facing products." }
  ]
};
