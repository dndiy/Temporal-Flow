import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import swup from "@swup/astro";
import Compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";/* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";/* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import mdx from "@astrojs/mdx";

// CORS middleware for friend content sharing
const corsMiddleware = (_, next) => {
  return async (context) => {
    const response = await next(context);
    
    // Add CORS headers to friend-content.json and API routes
    if (context.request.url.includes('friend-content.json') || 
        context.request.url.includes('/api/')) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    return response;
  };
};

// GitHub Pages automatic path detection
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
let basePath = '/';
let siteUrl = 'https://temporalflow.org';

// Auto-detect GitHub Pages environment
if (GITHUB_REPOSITORY) {
  const [username, repo] = GITHUB_REPOSITORY.split('/');
  basePath = `/${repo}/`;
  siteUrl = `https://${username}.github.io`;
  console.log(`Detected GitHub Pages deployment: ${siteUrl}${basePath}`);
}

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: basePath,
  trailingSlash: "always",
  integrations: [tailwind(
      {
        nesting: true,
      }
  ), swup({
    theme: false,
    animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
    // the default value `transition-` cause transition delay
    // when the Tailwind class `transition-all` is used
    containers: ["main", "#toc", "#banner-wrapper", "#swup-featured-content"],
    smoothScrolling: true,
    cache: true,
    preload: true,
    accessibility: true,
    updateHead: true,
    updateBodyClass: false,
    globalInstance: true,
  }), icon({
    include: {
      "preprocess: vitePreprocess(),": ["*"],
      "fa6-brands": ["*"],
      "fa6-regular": ["*"],
      "fa6-solid": ["*"],
    },
  }), svelte(), sitemap(), Compress({
    CSS: false,
    Image: false,
    Action: {
      Passed: async () => true, // https://github.com/PlayForm/Compress/issues/376
    },
  }), mdx()],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkExcerpt,
      remarkGithubAdmonitionsToDirectives,
      remarkDirective,
      remarkSectionize,
      parseDirectiveNode,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            note: (x, y) => AdmonitionComponent(x, y, "note"),
            tip: (x, y) => AdmonitionComponent(x, y, "tip"),
            important: (x, y) => AdmonitionComponent(x, y, "important"),
            caution: (x, y) => AdmonitionComponent(x, y, "caution"),
            warning: (x, y) => AdmonitionComponent(x, y, "warning"),
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["anchor"],
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {
              className: ["anchor-icon"],
              "data-pagefind-ignore": true,
            },
            children: [
              {
                type: "text",
                value: "#",
              },
            ],
          },
        },
      ],
    ],
  },
  vite: {
    optimizeDeps: {
      include: ['mammoth']
    },  
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // temporarily suppress this warning
          if (
            warning.message.includes("is dynamically imported by") &&
            warning.message.includes("but also statically imported by")
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
