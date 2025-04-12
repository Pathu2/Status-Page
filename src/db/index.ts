import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // your table definitions

const connectionString = process.env.DATABASE_URL || "";

const client = postgres(connectionString, { prepare: false }); // ✅ no "schema" here
export const db = drizzle(client, { schema }); // ✅ pass schema here
