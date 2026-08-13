import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake barrel imports so a single `<Icon />` doesn't pull the whole
  // package graph into the client bundle.
  experimental: {
    optimizePackageImports: ["motion", "@reduxjs/toolkit", "react-redux"],
    // Tailwind output is small and atomic; inlining removes the render-blocking
    // stylesheet request on first paint.
    inlineCss: true,
  },
  // Typed `href` on <Link> — a bad route becomes a build error, not a 404.
  typedRoutes: true,
  poweredByHeader: false,
};

export default nextConfig;
