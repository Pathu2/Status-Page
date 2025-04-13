import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
});

export const orgMembers = pgTable(
  "org_members",
  {
    orgId: uuid("org_id")
      .references(() => organizations.id)
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    role: varchar("role", { length: 50 }).notNull(), // 'owner', 'admin', 'member', 'viewer'
  },
  (table) => ({
    pk: [table.orgId, table.userId],
  })
);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .references(() => organizations.id)
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"), // You can add a description to specify the service details
  url: varchar("url", { length: 512 }), // You can add a URL for the service (optional)
  status: varchar("status", { length: 50 }).default("operational"), // Service status (optional)
  createdBy: text("created_by")
    .references(() => users.id)
    .notNull(),
  rolesAllowed: varchar("roles_allowed", { length: 255 }), // Comma separated roles allowed to view this service (e.g., "owner,admin") // Optional: specify roles that can view the service
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .references(() => organizations.id)
    .notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // 'owner', 'admin', 'member', 'viewer'
  invitedBy: text("invited_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
