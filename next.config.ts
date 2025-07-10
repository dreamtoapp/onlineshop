import type { NextConfig } from 'next';
import createMDX from '@next/mdx'; // Import createMDX

// Enable bundle analyzer
// Use dynamic import for bundle analyzer in ESM
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
//   openAnalyzer: true,
// });


/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Optionally, add any other Next.js config options here
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
    // Optimized image settings for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // Cache optimized images for 24 hours
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add timeout and retry settings
    loader: 'default',
    loaderFile: undefined,
  },
  // Performance optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true, // Enable React strict mode

  // Optimize for production
  productionBrowserSourceMaps: false, // Disable source maps in production

  // Add experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Enable server actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
    },
    useCache: true, // Enable the useCache experimental feature
  },

  // Add webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Add headers for better caching
  async headers() {
    return [
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, immutable',
          },
        ],
      },
    ];
  },

  // We're using dynamic imports instead of webpack externals configuration
  // This avoids the deprecation warning and is a cleaner approach

  // We've removed the PDF-specific webpack configuration since we no longer use jspdf
};

// Initialize MDX plugin
const withMDX = createMDX({
  // Add remark/rehype plugins here if needed
  options: {
    format: 'mdx', // Explicitly set the format to MDX
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Export the combined config
// Temporarily removing withBundleAnalyzer to isolate withMDX
module.exports = withMDX(nextConfig);
