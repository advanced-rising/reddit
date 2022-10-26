/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'www.gravatar.com',
      'localhost',
      'ec2-44-201-201-18.compute-1.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
