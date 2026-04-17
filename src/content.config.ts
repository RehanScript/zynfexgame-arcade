import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    image: z.string().optional(),
    author: z.string().default('ZynfexGame Team'),
    schemas: z.array(z.string()).optional()
  }),
});

export const collections = {
  'blog': blogCollection,
};
