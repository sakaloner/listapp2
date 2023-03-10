/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAIN_URL: process.env.MAIN_URL
  },
  async rewrites () {
    return [
      {
        source: ':path*:80', // Match all paths
        destination: ':path*:3000' // Pass through to the next server
      }
    ]
  }
}

module.exports = nextConfig
