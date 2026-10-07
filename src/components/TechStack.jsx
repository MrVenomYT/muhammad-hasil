import React, { useState } from 'react';
import {
  Atom,
  Layers,
  Server,
  Database,
  Flame,
  Palette,
  Sparkles,
  CreditCard,
  FileCode,
  Boxes,
  Globe,
  Cpu,
  ShieldCheck,
  Workflow,
  Code2,
  Terminal,
  Zap,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

// Technology knowledge base with Lucide icons, categorized roles, and usage descriptions
const TECH_DATABASE = {
  react: {
    name: 'React.js',
    icon: Atom,
    category: 'Frontend Library',
    color: '#00d8ff',
    badgeBg: 'rgba(0, 216, 255, 0.12)',
    description: 'Powers declarative user interfaces, reactive component hierarchies, and rapid virtual DOM state synchronization.'
  },
  next: {
    name: 'Next.js',
    icon: Layers,
    category: 'Full-Stack Framework',
    color: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.14)',
    description: 'Enables high-performance hybrid rendering (SSR/SSG), optimized API route handlers, and static caching.'
  },
  'next.js': {
    name: 'Next.js',
    icon: Layers,
    category: 'Full-Stack Framework',
    color: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.14)',
    description: 'Enables high-performance hybrid rendering (SSR/SSG), optimized API route handlers, and static caching.'
  },
  node: {
    name: 'Node.js',
    icon: Server,
    category: 'Backend Runtime',
    color: '#68a063',
    badgeBg: 'rgba(104, 160, 99, 0.12)',
    description: 'Runs asynchronous server logic, microservices, and high-throughput event loops with non-blocking I/O.'
  },
  'node.js': {
    name: 'Node.js',
    icon: Server,
    category: 'Backend Runtime',
    color: '#68a063',
    badgeBg: 'rgba(104, 160, 99, 0.12)',
    description: 'Runs asynchronous server logic, microservices, and high-throughput event loops with non-blocking I/O.'
  },
  mongodb: {
    name: 'MongoDB Atlas',
    icon: Database,
    category: 'NoSQL Database',
    color: '#47a248',
    badgeBg: 'rgba(71, 162, 72, 0.12)',
    description: 'Persists structured JSON documents, executes fast indexed queries, and handles cloud-managed data synchronization.'
  },
  tailwind: {
    name: 'Tailwind CSS',
    icon: Palette,
    category: 'Design System',
    color: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    description: 'Delivers responsive utility-first styling, consistent design tokens, and purged production style bundles.'
  },
  'tailwind css': {
    name: 'Tailwind CSS',
    icon: Palette,
    category: 'Design System',
    color: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    description: 'Delivers responsive utility-first styling, consistent design tokens, and purged production style bundles.'
  },
  firebase: {
    name: 'Firebase',
    icon: Flame,
    category: 'Cloud Services',
    color: '#ffca28',
    badgeBg: 'rgba(255, 202, 40, 0.12)',
    description: 'Provides real-time cloud document sync, secure token authentication, and role-based security rules.'
  },
  'firebase auth': {
    name: 'Firebase Auth',
    icon: Flame,
    category: 'Identity & Auth',
    color: '#ffca28',
    badgeBg: 'rgba(255, 202, 40, 0.12)',
    description: 'Enforces user session security, token authorization, protected routes, and authentication state persistence.'
  },
  framer: {
    name: 'Framer Motion',
    icon: Sparkles,
    category: 'Physics Animations',
    color: '#ff0055',
    badgeBg: 'rgba(255, 0, 85, 0.12)',
    description: 'Orchestrates fluid spring animations, route fade transitions, interactive touch gestures, and layout morphing.'
  },
  'framer motion': {
    name: 'Framer Motion',
    icon: Sparkles,
    category: 'Physics Animations',
    color: '#ff0055',
    badgeBg: 'rgba(255, 0, 85, 0.12)',
    description: 'Orchestrates fluid spring animations, route fade transitions, interactive touch gestures, and layout morphing.'
  },
  stripe: {
    name: 'Stripe API',
    icon: CreditCard,
    category: 'Payment Gateway',
    color: '#6366f1',
    badgeBg: 'rgba(99, 102, 241, 0.12)',
    description: 'Handles secure PCI-compliant checkout flows, customer billing webhooks, and payment token validation.'
  },
  typescript: {
    name: 'TypeScript',
    icon: FileCode,
    category: 'Static Typing',
    color: '#3178c6',
    badgeBg: 'rgba(49, 120, 198, 0.12)',
    description: 'Guarantees end-to-end type safety, auto-documented API interfaces, and compile-time defect prevention.'
  },
  javascript: {
    name: 'JavaScript (ES6+)',
    icon: FileCode,
    category: 'Core Logic',
    color: '#f7df1e',
    badgeBg: 'rgba(247, 223, 30, 0.12)',
    description: 'Drives asynchronous promises, modern object manipulation, client runtime logic, and modular exports.'
  },
  redux: {
    name: 'Redux Toolkit',
    icon: Boxes,
    category: 'State Management',
    color: '#764abc',
    badgeBg: 'rgba(118, 74, 188, 0.12)',
    description: 'Centralizes global state management with unidirectional data dispatching and normalized cache slices.'
  },
  express: {
    name: 'Express.js',
    icon: Server,
    category: 'HTTP Middleware',
    color: '#e2e8f0',
    badgeBg: 'rgba(226, 232, 240, 0.12)',
    description: 'Serves lightweight REST API endpoints, routing logic, and extensible request middleware chains.'
  },
  'rest api': {
    name: 'RESTful APIs',
    icon: Globe,
    category: 'Network Protocol',
    color: '#ff7700',
    badgeBg: 'rgba(255, 119, 0, 0.12)',
    description: 'Connects client components with backend data models using structured JSON payloads and standard HTTP verbs.'
  },
  'restful apis': {
    name: 'RESTful APIs',
    icon: Globe,
    category: 'Network Protocol',
    color: '#ff7700',
    badgeBg: 'rgba(255, 119, 0, 0.12)',
    description: 'Connects client components with backend data models using structured JSON payloads and standard HTTP verbs.'
  },
  docker: {
    name: 'Docker',
    icon: Workflow,
    category: 'Containerization',
    color: '#2496ed',
    badgeBg: 'rgba(36, 150, 237, 0.12)',
    description: 'Packages production code, system dependencies, and environments into isolated, repeatable containers.'
  },
  postgresql: {
    name: 'PostgreSQL',
    icon: Database,
    category: 'Relational DB',
    color: '#336791',
    badgeBg: 'rgba(51, 103, 145, 0.12)',
    description: 'Enforces relational data consistency, complex SQL aggregations, and ACID-compliant transaction safety.'
  }
};

function resolveTech(rawTech) {
  if (!rawTech || typeof rawTech !== 'string') return null;
  const clean = rawTech.trim();
  const lower = clean.toLowerCase();

  if (TECH_DATABASE[lower]) {
    return { ...TECH_DATABASE[lower], raw: clean };
  }

  for (const [key, item] of Object.entries(TECH_DATABASE)) {
    if (lower.includes(key) || key.includes(lower)) {
      return { ...item, raw: clean };
    }
  }

  // Fallback for custom or specialized technologies
  let Icon = Code2;
  let category = 'Engineering Tool';
  let color = '#ff7700';

  if (lower.includes('css') || lower.includes('style') || lower.includes('design')) {
    Icon = Palette;
    category = 'UI Styling';
    color = '#38bdf8';
  } else if (lower.includes('data') || lower.includes('sql') || lower.includes('db')) {
    Icon = Database;
    category = 'Data Layer';
    color = '#10b981';
  } else if (lower.includes('auth') || lower.includes('sec')) {
    Icon = ShieldCheck;
    category = 'Auth & Security';
    color = '#f59e0b';
  }

  return {
    name: clean,
    icon: Icon,
    category,
    color,
    badgeBg: 'rgba(255, 119, 0, 0.12)',
    description: `Integrated into the project architecture to deliver reliable production functionality and optimized performance.`,
    raw: clean
  };
}

export function TechStack({ technologies = [], projectTitle = 'Project' }) {
  const techList = Array.isArray(technologies)
    ? technologies
    : (typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()) : []);

  const items = techList.map(resolveTech).filter(Boolean);
  const [hoveredIdx, setHoveredIdx] = useState(0);

  if (items.length === 0) return null;

  const currentTool = items[hoveredIdx] || items[0];
  const CurrentIcon = currentTool.icon;

  return (
    <div className="tech-stack-component" style={{ marginTop: '32px' }}>
      {/* Component Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#ff7700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            <Zap size={13} color="#ff7700" />
            <span>Technologies Used</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'var(--font-display, inherit)' }}>
            Tech Stack & Architectural Roles
          </h3>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          Hover any icon to inspect usage
        </span>
      </div>

      {/* Grid of Interactive Tech Icons & Cards with Hover Effects */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        {items.map((tech, idx) => {
          const Icon = tech.icon;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={`${tech.name}-${idx}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onClick={() => setHoveredIdx(idx)}
              style={{
                position: 'relative',
                backgroundColor: isHovered ? '#1a1614' : '#14110f',
                border: isHovered ? `1px solid ${tech.color || '#ff7700'}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered 
                  ? `0 12px 28px rgba(0, 0, 0, 0.7), 0 0 16px ${tech.badgeBg || 'rgba(255, 119, 0, 0.15)'}` 
                  : '0 4px 12px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              {/* Top Row: Icon Container and Category */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: isHovered ? (tech.badgeBg || 'rgba(255, 119, 0, 0.2)') : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isHovered ? tech.color : 'rgba(255, 255, 255, 0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <Icon size={22} color={isHovered ? tech.color : '#f1f5f9'} />
                </div>

                <span 
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: isHovered ? tech.color : '#64748b',
                    backgroundColor: isHovered ? (tech.badgeBg || 'rgba(255, 119, 0, 0.1)') : 'rgba(255, 255, 255, 0.03)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {isHovered ? 'Active' : tech.category.split(' ')[0]}
                </span>
              </div>

              {/* Tool Name & Category */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{tech.name}</span>
                  {isHovered && <CheckCircle2 size={13} color={tech.color || '#ff7700'} />}
                </h4>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                  {tech.category}
                </div>
              </div>

              {/* Hover Usage Description */}
              <div 
                style={{
                  fontSize: '12px',
                  color: isHovered ? '#f1f5f9' : '#64748b',
                  lineHeight: 1.45,
                  paddingTop: '8px',
                  borderTop: isHovered ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.04)',
                  display: '-webkit-box',
                  WebkitLineClamp: isHovered ? 4 : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  transition: 'color 0.2s ease'
                }}
              >
                {tech.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Hover Details Inspector Banner */}
      <div 
        style={{
          backgroundColor: '#120f0d',
          border: `1px solid ${currentTool.color ? currentTool.color + '40' : 'rgba(255, 119, 0, 0.35)'}`,
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '18px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '160px',
            height: '100%',
            background: `radial-gradient(circle at top left, ${currentTool.badgeBg || 'rgba(255, 119, 0, 0.2)'}, transparent 70%)`,
            pointerEvents: 'none'
          }}
        />

        <div 
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: currentTool.badgeBg || 'rgba(255, 119, 0, 0.15)',
            border: `1.5px solid ${currentTool.color || '#ff7700'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 18px ${currentTool.badgeBg || 'rgba(255, 119, 0, 0.3)'}`
          }}
        >
          <CurrentIcon size={28} color={currentTool.color || '#ff7700'} />
        </div>

        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
              {currentTool.name}
            </span>
            <span 
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 9px',
                borderRadius: '12px',
                backgroundColor: currentTool.badgeBg || 'rgba(255, 119, 0, 0.2)',
                color: currentTool.color || '#ff7700',
                border: `1px solid ${currentTool.color ? currentTool.color + '60' : 'rgba(255, 119, 0, 0.4)'}`
              }}
            >
              {currentTool.category}
            </span>
            <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              Verified in {projectTitle}
            </span>
          </div>

          <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#ffffff' }}>Usage Description: </strong>
            {currentTool.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TechStack;
