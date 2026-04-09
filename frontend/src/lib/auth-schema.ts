import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

// Better Auth schema for SQLite
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// API Keys plugin tables
export const apiKey = sqliteTable("api_key", {
  id: text("id").primaryKey(),
  name: text("name"),
  prefix: text("prefix"),
  start: text("start").notNull(),
  end: text("end").notNull(),
  hash: text("hash").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  lastUsed: integer("last_used", { mode: "timestamp" }),
  remaining: integer("remaining"),
  refillInterval: integer("refill_interval"),
  refillAmount: integer("refill_amount"),
  rateLimitEnabled: integer("rate_limit_enabled", { mode: "boolean" }),
  rateLimitTimeWindow: integer("rate_limit_time_window"),
  rateLimitMax: integer("rate_limit_max"),
  permissions: text("permissions"),
  enabled: integer("enabled", { mode: "boolean" }).notNull(),
});

// Tenant/Organization table (for multi-tenancy)
export const tenant = sqliteTable("tenant", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  plan: text("plan").notNull().default("free"), // free, pro, enterprise
  usageLimit: integer("usage_limit"), // pages/month
  usageCurrent: integer("usage_current").default(0),
  billingCycle: text("billing_cycle").default("monthly"),
});

export const tenantMember = sqliteTable("tenant_member", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenant.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  role: text("role").notNull().default("member"), // owner, admin, member
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
