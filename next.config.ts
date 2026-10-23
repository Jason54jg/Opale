import type { NextConfig } from "next";

/** Hébergement temporaire : https://jason54jg.github.io/Opale/ */
const repoName = "Opale";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const isDocker = process.env.DOCKER === "true";

const nextConfig: NextConfig = {
  // Image Docker : serveur Node minimal (`server.js`) sans node_modules complet.
  ...(isDocker ? { output: "standalone" as const } : {}),
  // Export statique uniquement pour Pages (temporaire).
  // En local / Vercel : serveur + API `/api/google-rating` live.
  ...(isGithubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : "",
    NEXT_PUBLIC_STATIC_EXPORT: isGithubPages ? "true" : "",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
