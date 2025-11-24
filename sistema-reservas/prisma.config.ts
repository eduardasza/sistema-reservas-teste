// 🔹 Faz o Prisma carregar automaticamente o .env
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/database/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  engine: "classic",
  // 🔹 Aqui adicionamos explicitamente a datasource
  datasource: {
    url: process!.env.DATABASE_URL!,
  },
});
