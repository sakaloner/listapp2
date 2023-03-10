/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAIN_URL: process.env.MAIN_URL
  },
  async rewrites () {
    return [
      {
        source: 'http://localhost:80/:path*', // Match all paths
        destination: 'http://localhost:3000/:path*' // Pass through to the next server
      }
    ]
  }
}

module.exports = nextConfig
