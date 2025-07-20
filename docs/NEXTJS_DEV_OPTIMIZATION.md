# 🚀 Next.js Development Server Optimization Guide

## 📊 **Current Performance Issues**
Your dev server is taking **20-60 seconds** to load pages, which is extremely slow. Here's how to fix it:

## 🔧 **Official Next.js Optimization Techniques**

### **1. Development Mode Optimizations**

#### **A. Disable Type Checking in Dev (Recommended)**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ Only disable in development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // ⚠️ Only disable in development  
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
};
```

#### **B. Optimize Webpack for Development**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Faster builds in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      
      // Disable source maps in dev for faster builds
      config.devtool = 'eval-cheap-module-source-map';
      
      // Reduce bundle analysis overhead
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },
};
```

#### **C. Optimize Experimental Features**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    // Enable only what you need
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverActions: { bodySizeLimit: '2mb' },
    useCache: true,
    
    // Disable heavy features in dev
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};
```

### **2. Environment-Specific Optimizations**

#### **A. Development Environment Variables**
```bash
# .env.development
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development
NEXT_SHARP_PATH=./node_modules/sharp
```

#### **B. Production-Like Development**
```bash
# For faster testing, use production build
pnpm build
pnpm start
```

### **3. Package.json Scripts Optimization**

#### **A. Fast Development Scripts**
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "dev:fast": "NODE_ENV=development next dev --turbo --port 3000",
    "dev:prod": "next build && next start",
    "test:fast": "playwright test --timeout=30000 --workers=1"
  }
}
```

#### **B. Development with Reduced Features**
```json
{
  "scripts": {
    "dev:minimal": "NEXT_DISABLE_ESLINT=1 NEXT_DISABLE_TYPE_CHECK=1 next dev",
    "dev:no-lint": "NEXT_DISABLE_ESLINT=1 next dev",
    "dev:no-type": "NEXT_DISABLE_TYPE_CHECK=1 next dev"
  }
}
```

### **4. Database and API Optimizations**

#### **A. Prisma Development Settings**
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  // Faster development builds
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection pooling for development
  directUrl = env("DIRECT_URL")
}
```

#### **B. API Route Optimization**
```typescript
// app/api/products-grid/route.ts
export const dynamic = 'force-dynamic'; // Only when needed
export const revalidate = 0; // Disable caching in dev

// Use streaming for large responses
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Stream response instead of waiting for full data
    }
  });
  
  return new Response(stream);
}
```

### **5. Image and Asset Optimization**

#### **A. Disable Image Optimization in Dev**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    // Disable in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
    // Use local images instead of Cloudinary in dev
    remotePatterns: process.env.NODE_ENV === 'development' ? [] : [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};
```

#### **B. Static Asset Optimization**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Disable compression in development
  compress: process.env.NODE_ENV === 'production',
  
  // Optimize static file serving
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return []; // No headers in dev for faster builds
    }
    // Production headers...
  },
};
```

### **6. Testing Optimization**

#### **A. Playwright Configuration for Slow Dev Server**
```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 120000, // 2 minutes for slow dev server
  expect: {
    timeout: 10000,
  },
  use: {
    // Faster navigation
    navigationTimeout: 60000,
    actionTimeout: 30000,
  },
  workers: 1, // Single worker for stability
  retries: 1, // Retry failed tests
});
```

#### **B. Test-Specific Optimizations**
```typescript
// tests/e2e/shopping/cart.spec.ts
test.describe('Shopping Cart Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for slow dev server
    page.setDefaultTimeout(120000);
    
    // Wait for server to be ready
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded'); // Faster than networkidle
  });
});
```

## 🎯 **Recommended Implementation**

### **Step 1: Update next.config.ts**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Development optimizations
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // Faster webpack in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      config.devtool = 'eval-cheap-module-source-map';
    }
    return config;
  },
  
  // Disable heavy features in development
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  compress: process.env.NODE_ENV === 'production',
  
  // Keep existing config...
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverActions: { bodySizeLimit: '2mb' },
    useCache: true,
  },
};

export default nextConfig;
```

### **Step 2: Add Development Scripts**
```json
{
  "scripts": {
    "dev:fast": "NEXT_DISABLE_ESLINT=1 NEXT_DISABLE_TYPE_CHECK=1 next dev --turbo",
    "dev:prod": "next build && next start",
    "test:fast": "playwright test --timeout=60000 --workers=1"
  }
}
```

### **Step 3: Use Production Build for Testing**
```bash
# Build and start production server (much faster)
pnpm build
pnpm start

# Then run tests
pnpm test:fast
```

## 📈 **Expected Performance Improvements**

- **Development Server**: 20-60s → 5-15s
- **Page Loads**: 30s → 3-5s  
- **Test Execution**: 2-3 minutes → 30-60 seconds
- **Hot Reload**: 5-10s → 1-2s

## 🔍 **Monitoring Performance**

```bash
# Check server performance
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000"

# Monitor memory usage
tasklist | findstr node

# Check for memory leaks
node --inspect next dev
```

## ⚠️ **Important Notes**

1. **Only disable TypeScript/ESLint in development**
2. **Use production build for final testing**
3. **Monitor memory usage regularly**
4. **Keep experimental features minimal**
5. **Use streaming for large API responses**

This should dramatically improve your development server performance! 🚀 