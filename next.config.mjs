/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/Ellylogo2/:path*",
        destination: "/demo/Ellylogo2/:path*",
      },
      {
        source: "/products/:path*",
        destination: "/demo/products/:path*",
      },
      {
        source: "/storefronts/:path*",
        destination: "/demo/storefronts/:path*",
      },
      {
        source: "/logos/:path*",
        destination: "/demo/logos/:path*",
      },
      {
        source: "/elly/:path*",
        destination: "/demo/elly/:path*",
      },
      {
        source: "/marblefloor.png",
        destination: "/demo/marblefloor.png",
      },
      {
        source: "/marble2.png",
        destination: "/demo/marble2.png",
      },
      {
        source: "/InviteFriendAIBrain.mp4",
        destination: "/demo/InviteFriendAIBrain.mp4",
      },
      {
        source: "/soloAIBrain.mp4",
        destination: "/demo/soloAIBrain.mp4",
      },
      {
        source: "/vite.svg",
        destination: "/demo/vite.svg",
      },
      {
        source: "/demo",
        destination: "/demo/index.html",
      },
      {
        source: "/demo/",
        destination: "/demo/index.html",
      },
      {
        source: "/landing-page",
        destination: "/demo/index.html",
      },
      {
        source: "/landing-page/:path*",
        destination: "/demo/index.html",
      },
    ];
  },
};

export default nextConfig;
