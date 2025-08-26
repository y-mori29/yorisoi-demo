/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DISCLAIMER_TEXT: process.env.NEXT_PUBLIC_DISCLAIMER_TEXT,
  },
};

module.exports = nextConfig;
