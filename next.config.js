/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@supabase/supabase-js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.proamrank.gg',
      },
      {
        protocol: 'https',
        hostname: 'qwpxsufrgigpjcxtnery.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.leagueos.gg',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    // Force resolution to CJS build for Supabase
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/supabase-js': require.resolve('@supabase/supabase-js'),
    };
    return config;
  },
}

module.exports = nextConfig

