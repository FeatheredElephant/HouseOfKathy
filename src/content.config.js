import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { propertySchema } from "./schemas/propertySchema";
import { blogSchema } from "./schemas/blogSchema";

// Blog posts
const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/data/blog-posts" }),
  schema: blogSchema,
});

// Properties
const properties = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/data/properties",
  }),
  schema: propertySchema,
});

export const collections = { posts, properties };
