import { z } from "astro:content";

// Helper: optional string fields
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema.optional());

// Helper: optional numeric fields
const numericOrUndefined = () =>
  z.preprocess((val) => {
    if (val === undefined || val === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().optional());

export const propertySchema = z
  .object({
    "List Number": numericOrUndefined(),
    "Agency Name": emptyToUndefined(z.string()),
    "Agency Phone": emptyToUndefined(z.string()),
    "Listing Agent": z.string(),
    "Card Format": z
      .enum(["Commercial Sale", "Residential", "Residential Income", "Land"])
      .optional(),
    "End Date": z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce.date().optional()
    ),
    "Listing Contract Date": z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce.date().optional()
    ),
    "List Price": numericOrUndefined(),
    "Street Number": numericOrUndefined(),
    "Street Name": z.string(),
    City: emptyToUndefined(z.string()),
    State: z.string(),
    County: z.string(),
    "Zip Code": numericOrUndefined(),
    Latitude: numericOrUndefined(),
    Longitude: numericOrUndefined(),
    "Year Built": numericOrUndefined(),
    "Bedrooms Total": numericOrUndefined(),
    slug: z.string(),
    cover: z.string(),
  })
  .transform((data) => ({
    ...data,
    coverSrc: `/assets/properties/${data.slug}/images/${data.cover}`,
  }));