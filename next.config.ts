import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: cloudinaryCloudName
      ? [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: `/${cloudinaryCloudName}/**`,
          },
        ]
      : [],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["rawafidequipment.com", "www.rawafidequipment.com"],
    },
  },
};

export default withNextIntl(nextConfig);
