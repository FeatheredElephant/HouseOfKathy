import { z } from "astro:content";

export const blogSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishDate: z.union([z.string(), z.date()]),
  description: z.string(),
});
