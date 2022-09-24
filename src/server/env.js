// @ts-check

/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */

const { z } = require('zod');

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  EMAIL_FROM: z.string().email(),
  EMAIL_SERVER: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  SITE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

module.exports.env = env;
