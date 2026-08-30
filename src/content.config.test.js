// src/content.config.test.js
import { describe, it, expect } from "vitest";
import { collections } from "./content.config.js";
import { getCollection } from "astro:content";
import { propertySchema } from "./schemas/propertySchema.js";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

describe("content.config", () => {
  it("defines both 'posts' and 'properties' collections", () => {
    expect(collections).toHaveProperty("posts");
    expect(collections).toHaveProperty("properties");
  });

  it("validates sample 'properties' schema", () => {
    const { properties } = collections;

    const validProperty = {
      title: "1627-1635 Rt 9w",
      cover: "Sample_Photo.jpg",
      description:
        "Turnkey Investment Opportunity! Well established storage business along US Route 9W in upstate New York. Currently has 2 buildings with 104 storage units and stamped town approval for additional of 500 units.",
      publishDate: new Date("2025-10-19"),
      expirationDate: new Date("2025-11-30"),
      price: 2400000,
      type: "commercial",
    };
    const result = properties.schema.safeParse(validProperty);

    expect(result.success).toBe(true);
  });

  it("fails validation for missing required fields", () => {
    const { properties } = collections;
    const invalidProperty = {
      title: "Invalid Property",
      // Missing slug, price, etc.
    };

    const result = properties.schema.safeParse(invalidProperty);
    expect(result.success).toBe(false);
  });

  it("loads sample property correctly and logs checked paths", async () => {
    const properties = await getCollection("properties");

    if (properties.length === 0) {
      console.log(
        "\nNo properties loaded. Checking which files exist in the folder...",
      );

      // Absolute path to your properties folder
      const baseDir = path.resolve("./src/data/properties");

      function walkDir(dir, filelist = []) {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath, filelist);
          } else if (file.toLowerCase() === "index.yaml") {
            filelist.push(fullPath);
          }
        });
        return filelist;
      }

      const yamlFiles = walkDir(baseDir);
      if (yamlFiles.length === 0) {
        console.log("No index.yaml files found in src/data/properties/");
      } else {
        console.log("Found the following index.yaml files:");
        yamlFiles.forEach((file) => console.log("-", file));
      }

      console.log(
        "\nMake sure your folders and files match the glob pattern '**/index.yaml' and your YAML matches the schema.",
      );
    }

    expect(properties.length).toBeGreaterThan(0);
    expect(properties[0]?.data).toHaveProperty("title");
  });

  it("checks schema for each property file", () => {
    const propertiesDir = path.resolve("src/data/properties");
    const folders = fs
      .readdirSync(propertiesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders.forEach((folder) => {
      const filePath = path.join(propertiesDir, folder, "index.yaml");

      if (!fs.existsSync(filePath)) {
        console.warn(`No index.yaml found in folder: ${folder}`);
        return;
      }

      const raw = fs.readFileSync(filePath, "utf-8");
      const data = yaml.load(raw);

      const result = propertySchema.safeParse(data);
      if (!result.success) {
        console.error(`Validation failed for ${filePath}:`);
        console.error(result.error.format());
      } else {
        console.log(`✅ ${filePath} passed validation`);
      }
    });
  });

  it("checks schema for each property file", () => {
    const propertiesDir = path.resolve("src/data/properties");
    const folders = fs
      .readdirSync(propertiesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders.forEach((folder) => {
      const filePath = path.join(propertiesDir, folder, "index.yaml");

      if (!fs.existsSync(filePath)) {
        console.warn(`No index.yaml found in folder: ${folder}`);
        return;
      }

      const raw = fs.readFileSync(filePath, "utf-8");
      const data = yaml.load(raw);

      const result = propertySchema.safeParse(data);
      if (!result.success) {
        console.error(`Validation failed for ${filePath}:`);
        console.error(result.error.format());
      } else {
        console.log(`✅ ${filePath} passed validation`);
      }
    });
  });
});
