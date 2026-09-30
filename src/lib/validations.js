import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  category: z.string().optional().default('fullstack react'),
  pill: z.string().optional().default('Full Stack Web App'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  longDescription: z.string().optional().default(''),
  liveDemoUrl: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  imageUrl: z.string().optional().default('/assets/muhammad-hasil.png'),
  technologies: z.array(z.string()).optional().default(['React', 'Next.js', 'Node.js']),
  featured: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
  views: z.number().optional().default(0),
  likes: z.number().optional().default(0)
});
