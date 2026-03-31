/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/demo",
        destination: "/demo/index.html",
      },
      {
        source: "/demo/",
        destination: "/demo/index.html",
      },
    ];
  },
};

export default nextConfig;
