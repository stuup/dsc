import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const lucideDir = require.resolve("lucide-static/package.json").replace(/package\.json$/, "icons/");

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/raleway/files/raleway-latin-wght-normal.woff2":
      "assets/fonts/raleway-latin-wght-normal.woff2",
  });

  // Tailwind writes straight to _site; reload the browser when it does.
  eleventyConfig.setServerOptions({ watch: ["_site/assets/css/**/*.css"] });
  eleventyConfig.watchIgnores.add("src/assets/css/**");

  eleventyConfig.addCollection("services", (api) =>
    api.getFilteredByGlob("src/services/*.md").sort((a, b) => a.data.order - b.data.order),
  );

  // {% icon "phone", "size-6 text-brand" %} — inlines a Lucide SVG.
  const iconCache = new Map();
  eleventyConfig.addShortcode("icon", (name, className = "size-6", strokeWidth = 1.5) => {
    if (!iconCache.has(name)) {
      iconCache.set(name, readFileSync(`${lucideDir}${name}.svg`, "utf8").replace(/<!--.*?-->\s*/s, ""));
    }
    return iconCache
      .get(name)
      .replace(/class="[^"]*"/, `class="${className}" aria-hidden="true" focusable="false"`)
      .replace(/stroke-width="[^"]*"/, `stroke-width="${strokeWidth}"`)
      .replace(/\s*\n\s*/g, " ");
  });

  eleventyConfig.addFilter(
    "isActive",
    (itemUrl, pageUrl) => itemUrl === pageUrl || (itemUrl !== "/" && pageUrl.startsWith(itemUrl)),
  );
  eleventyConfig.addFilter("head", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("bySlug", (arr, slug) => arr.find((item) => item.fileSlug === slug));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("telHref", (n) => "tel:+44" + n.replace(/\s/g, "").replace(/^0/, ""));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
