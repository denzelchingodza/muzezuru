/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't ship .map files in the production build -- they expose original
  // source code to anyone who requests them.
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
