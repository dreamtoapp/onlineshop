'use client';

import { useEffect } from 'react';

/**
 * Advanced PreloadScript Component for Homepage Performance Optimization
 * 
 * This component implements comprehensive performance optimizations including:
 * - Critical resource preloading
 * - Core Web Vitals monitoring
 * - Service Worker registration
 * - Image optimization
 * - Network resource hints
 */
export default function PreloadScript() {
  useEffect(() => {
    // Preload critical resources for faster initial page load
    const preloadResources = [
      { href: '/fallback/fallback.avif', as: 'image', type: 'image/avif' },
      { href: '/fallback/fallback.webp', as: 'image', type: 'image/webp' },
      { href: '/api/products?featured=true', as: 'fetch' },
      { href: '/api/categories', as: 'fetch' },
    ];

    preloadResources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    });

    // Prefetch likely user interactions for smoother navigation
    const prefetchResources = [
      '/categories',
      '/product',
      '/cart',
      '/auth/login',
    ];

    prefetchResources.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    });

    // Optimize viewport meta for mobile experience
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
    }

    // Critical performance optimizations
    const optimizePerformance = () => {
      // Enable passive event listeners for better scroll performance
      const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
      passiveEvents.forEach(event => {
        document.addEventListener(event, () => { }, { passive: true });
      });

      // Optimize images for Core Web Vitals using Intersection Observer
      const images = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (!img.src && img.dataset.src) {
              img.src = img.dataset.src;
            }
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      images.forEach(img => imageObserver.observe(img));

      // Preconnect to external domains for faster resource loading
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://res.cloudinary.com',
        'https://images.unsplash.com',
      ];

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // DNS prefetch for analytics and tracking domains
      const dnsPrefetchDomains = [
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
      ];

      dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Run optimizations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizePerformance);
    } else {
      optimizePerformance();
    }

    // Performance monitoring with manual implementations
    const measurePerformance = () => {
      if ('performance' in window) {
        // Try to load web-vitals library if available
        import('web-vitals').then((_webVitalsModule) => {
          // console.log('Web Vitals library loaded successfully');
          // Simple logging without complex type checking
          // console.log('Available methods:', Object.keys(webVitalsModule));
        }).catch(() => {
          // console.log('Web Vitals library not available, using fallback methods');
        });

        // Manual Core Web Vitals monitoring using PerformanceObserver
        if ('PerformanceObserver' in window) {
          try {
            // Monitor Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver(() => {
              // const entries = list.getEntries();
              // console.log('LCP (Largest Contentful Paint):', entries[entries.length - 1]?.startTime, 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (e) {
            // console.log('LCP observer not supported');
          }

          try {
            // Monitor First Contentful Paint (FCP)
            const fcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                  console.log('FCP (First Contentful Paint):', entry.startTime, 'ms');
                }
              });
            });
            fcpObserver.observe({ entryTypes: ['paint'] });
          } catch (e) {
            console.log('FCP observer not supported');
          }

          try {
            // Monitor layout shifts for CLS
            const clsObserver = new PerformanceObserver((list) => {
              let clsValue = 0;
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value;
                }
              }
              if (clsValue > 0) {
                console.log('CLS (Cumulative Layout Shift):', clsValue);
              }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
          } catch (e) {
            console.log('CLS observer not supported');
          }

          try {
            // Monitor long tasks that can affect user experience
            const longTaskObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                  console.warn('Long task detected:', {
                    duration: entry.duration,
                    startTime: entry.startTime,
                    name: entry.name
                  });
                }
              }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
          } catch (e) {
            console.log('Long task observer not supported in this browser');
          }
        }

        // Basic navigation timing metrics
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as any;
          if (navigation) {
            console.log('Page Load Metrics:', {
              'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
              'TCP Connection': navigation.connectEnd - navigation.connectStart,
              'Request Time': navigation.responseStart - navigation.requestStart,
              'Response Time': navigation.responseEnd - navigation.responseStart,
              'DOM Load': navigation.domContentLoadedEventEnd - navigation.navigationStart,
              'Page Load': navigation.loadEventEnd - navigation.navigationStart
            });
          }
        }, 2000);
      }
    };

    // Delay performance monitoring to avoid blocking critical rendering
    setTimeout(measurePerformance, 1000);

    // Service Worker registration for caching in production
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((_registration) => {
          // console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch((_error) => {
          // console.log('Service Worker registration failed:', error);
        });
    }

    // Cleanup function
    return () => {
      // Remove event listeners if needed during component unmount
    };
  }, []);

  return (
    <>
      {/* Critical font preload for faster text rendering */}
      <link
        rel="preload"
        href="/fonts/cairo.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />

      {/* Preload critical fallback images */}
      <link
        rel="preload"
        href="/fallback/fallback.avif"
        as="image"
        type="image/avif"
      />

      {/* Network resource hints for external services */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />

      {/* Critical path optimization inline script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Prevent layout shifts by setting CSS custom properties
            if (!window.CSS || !CSS.supports('content-visibility', 'auto')) {
              document.documentElement.style.setProperty('--content-visibility', 'visible');
            }
            
            // Optimize font loading to prevent FOUT (Flash of Unstyled Text)
            if ('fonts' in document) {
              document.fonts.ready.then(() => {
                document.documentElement.classList.add('fonts-loaded');
              });
            }
            
            // Use requestIdleCallback for non-critical tasks
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                // Analytics now handled by official Next.js GoogleAnalytics component
                console.log('Analytics handled by @next/third-parties/google');
              });
            }
            
            // Early performance marks for debugging
            if ('performance' in window && performance.mark) {
              performance.mark('preload-script-executed');
            }
          `
        }}
      />
    </>
  );
}
