import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  STEAM_API_KEY: z.string(),
  STEAM_RETURN_URL: z.string(),
  ALGOLIA_API_KEY: z.string(),
  ALGOLIA_ADMIN_API_KEY: z.string(),
  ALGOLIA_APP_ID: z.string(),
  ALGOLIA_SEARCH_INDEX: z.string(),
  SENTRY_DSN: z.string(),
  VERCEL_ANALYTICS_ID: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  SESSION_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
