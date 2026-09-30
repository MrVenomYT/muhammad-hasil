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

export const contactFormSchema = z.object({
  from_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  from_email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address (e.g. name@domain.com)'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(150, 'Subject cannot exceed 150 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters long').max(2000, 'Message cannot exceed 2000 characters')
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(150, 'Subject cannot exceed 150 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters long').max(2000, 'Message cannot exceed 2000 characters'),
  serviceType: z.string().optional().default('Full-Stack Web App Development')
});
