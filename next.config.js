/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en-AU"],
    defaultLocale: "en-AU",
  },
};

module.exports = nextConfig;
