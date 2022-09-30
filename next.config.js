/** @type {import('next').NextConfig} */

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function getConfig(config) {
  return config;
}

module.exports = getConfig({
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en-AU'],
    defaultLocale: 'en-AU',
  },
  serverRuntimeConfig: {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL || '',
    EMAIL_SERVER: process.env.EMAIL_SERVER || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply-local@retrobox.app',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'secret',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://loclhost:3000',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  },
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    UNLEASH_PROXY_URL: process.env.UNLEASH_PROXY_URL || 'http://localhost:5000/proxy',
    UNLEASH_CLIENT_KEY: process.env.UNLEASH_CLIENT_KEY || 'development-proxy',
    UNLEASH_REFRESH_INTERVAL: parseInt(process.env.UNLEASH_REFRESH_INTERVAL) || 15,
    UNLEASH_APP_NAME: process.env.UNLEASH_APP_NAME || 'retrobox-development',
    UNLEASH_ENVIRONMENT: process.env.UNLEASH_ENVIRONMENT || 'development',
  },
});
