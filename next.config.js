const withTM = require('next-transpile-modules')(['@uiw/react-textarea-code-editor']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { esmExternals: 'loose' },
};

module.exports = withTM(nextConfig);
