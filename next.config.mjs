/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.attackertv.so",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      }
    ],
  },
};

export default nextConfig;
