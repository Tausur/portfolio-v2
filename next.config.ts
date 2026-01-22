import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "media.licdn.com",
      "www.maxai.co",
      "tausur.github.io",
      "raw.githubusercontent.com",
    ], // allow images from Cloudinary
    
  },
};

export default nextConfig;
