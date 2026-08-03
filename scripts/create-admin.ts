import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function requireEnv(name: "ADMIN_NAME" | "ADMIN_EMAIL" | "ADMIN_PASSWORD") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const name = requireEnv("ADMIN_NAME");
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_PASSWORD");

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: "admin",
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: "admin",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log(`Admin user upserted successfully for ${user.email} with role ${user.role}.`);
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Failed to create or update admin user.";
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });