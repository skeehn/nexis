import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKeys, admin, twoFactor } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./auth-schema";

// SQLite database for auth (can be swapped for PostgreSQL/MySQL in production)
const sqlite = new Database(process.env.DATABASE_URL ?? "./markify-auth.db");
const db = drizzle(sqlite, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  // Email + password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set true for production
    autoSignIn: true,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Rate limiting
  rateLimit: {
    enabled: true,
    window: 60, // 60 seconds
    max: 100, // max requests per window
  },

  // API Keys for server-to-server auth
  plugins: [
    apiKeys({
      enableMetadata: true,
      keyExpiration: 90 * 24 * 60 * 60, // 90 days
    }),
    admin(),
    twoFactor(),
  ],

  // Social providers (optional, configure via env vars)
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
