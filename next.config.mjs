/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/demo",
        destination: "https://demo.elysiummall.com",
      },
      {
        source: "/demo/:path*",
        destination: "https://demo.elysiummall.com/:path*",
      },
    ];
  },
};

export default nextConfig;
