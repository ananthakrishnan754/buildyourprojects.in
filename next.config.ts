import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/images/[...path]": ["./images/**/*"],
    "/api/downloads/[token]": ["./private/downloads/**/*"],
  },
  async redirects() {
    return [
      { source: "/courses", destination: "/products", permanent: true },
      { source: "/courses.html", destination: "/products", permanent: true },
      { source: "/courses/:path*", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
