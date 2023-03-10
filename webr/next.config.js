/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAIN_URL: process.env.MAIN_URL
  }
}

module.exports = nextConfig
