/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "prisma"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.radhepackersandmovers.com" }],
        destination: "https://radhepackersandmovers.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
