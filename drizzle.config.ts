import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: "postgresql://postgres.zspcfsnpamvjeclcsxln:supabase%402002@aws-0-ap-south-1.pooler.supabase.com:5432/postgres",
  },
});
