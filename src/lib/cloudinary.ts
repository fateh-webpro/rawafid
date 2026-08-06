import "server-only";

import { v2 as cloudinary } from "cloudinary";

let configured = false;

function getRequiredEnv(name: "CLOUDINARY_CLOUD_NAME" | "CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET") {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing Cloudinary configuration: ${name}`);
  }
  return value;
}

export function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
      api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
      api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}
