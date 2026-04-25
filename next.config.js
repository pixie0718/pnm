/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "prisma"],
  async redirects() {
    return [
      // URL encoding fixes — space (%20) → hyphen
      { source: "/packers-and-movers-in-bodh%20gaya",  destination: "/packers-and-movers-in-bodh-gaya",  permanent: true },
      { source: "/packers-and-movers-in-dum%20dum",    destination: "/packers-and-movers-in-dum-dum",    permanent: true },
      { source: "/packers-and-movers-in-mount%20abu",  destination: "/packers-and-movers-in-mount-abu",  permanent: true },
    ];
  },
};

module.exports = nextConfig;
