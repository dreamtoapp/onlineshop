'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce } from '@/utils/debounce';

interface UseProductCardOptimizationsProps {
    productId: string;
    onVisible?: () => void;
    onHover?: () => void;
    debounceMs?: number;
    trackAnalytics?: boolean;
}

interface ProductCardOptimizations {
    isVisible: boolean;
    isHovered: boolean;
    cardRef: React.RefObject<HTMLDivElement | null>;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleClick: () => void;
    preloadImages: (urls: string[]) => void;
    trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

export const useProductCardOptimizations = ({
    productId,
    onVisible,
    onHover,
    debounceMs = 300,
    trackAnalytics = true
}: UseProductCardOptimizationsProps): ProductCardOptimizations => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const imageCache = useRef<Set<string>>(new Set());

    // Intersection Observer for visibility tracking
    useEffect(() => {
        if (!cardRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        onVisible?.();
                        
                        // Disconnect observer after first intersection
                        if (observerRef.current) {
                            observerRef.current.disconnect();
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        observerRef.current.observe(cardRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [onVisible]);

    // Analytics tracking - moved before useMemo to avoid dependency issues
    const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', eventName, {
                custom_parameter_product_id: productId,
                ...properties
            });
        }
    }, [productId]);

    // Debounced hover handlers with proper cleanup
    const debouncedHoverEnter = useMemo(() => {
        const debouncedFn = debounce(() => {
            setIsHovered(true);
            onHover?.();
            
            if (trackAnalytics) {
                trackEvent('product_card_hover', {
                    product_id: productId,
                    hover_duration: Date.now()
                });
            }
        }, debounceMs);
        
        return debouncedFn;
    }, [onHover, productId, trackAnalytics, debounceMs, trackEvent]);

    const debouncedHoverLeave = useMemo(() => {
        const debouncedFn = debounce(() => {
            setIsHovered(false);
        }, debounceMs);
        
        return debouncedFn;
    }, [debounceMs]);

    // Optimized event handlers
    const handleMouseEnter = useCallback(() => {
        debouncedHoverEnter();
    }, [debouncedHoverEnter]);

    const handleMouseLeave = useCallback(() => {
        debouncedHoverLeave();
    }, [debouncedHoverLeave]);

    const handleClick = useCallback(() => {
        if (trackAnalytics) {
            trackEvent('product_card_click', {
                product_id: productId,
                timestamp: Date.now()
            });
        }
    }, [productId, trackAnalytics, trackEvent]);

    // Image preloading for performance
    const preloadImages = useCallback((urls: string[]) => {
        urls.forEach((url) => {
            if (!imageCache.current.has(url)) {
                const img = new Image();
                img.src = url;
                imageCache.current.add(url);
                
                // Optional: Add loading and error handlers
                img.onload = () => {
                    // Image preloaded successfully
                };
                img.onerror = () => {
                    // Failed to preload image, remove from cache
                    imageCache.current.delete(url);
                };
            }
        });
    }, []);

    // Cleanup on unmount - check if cancel method exists
    useEffect(() => {
        return () => {
            // Only call cancel if the debounced function has this method
            if (typeof debouncedHoverEnter === 'function' && 'cancel' in debouncedHoverEnter) {
                (debouncedHoverEnter as any).cancel();
            }
            if (typeof debouncedHoverLeave === 'function' && 'cancel' in debouncedHoverLeave) {
                (debouncedHoverLeave as any).cancel();
            }
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [debouncedHoverEnter, debouncedHoverLeave]);

    return {
        isVisible,
        isHovered,
        cardRef,
        handleMouseEnter,
        handleMouseLeave,
        handleClick,
        preloadImages,
        trackEvent
    };
};

// Performance monitoring hook
export const useProductCardPerformance = () => {
    const renderCount = useRef<number>(0);

    useEffect(() => {
        renderCount.current += 1;
    });

    const logPerformance = useCallback(() => {
        // Performance logging removed for cleaner build output
    }, []);

    return { logPerformance, renderCount: renderCount.current };
};

// Memory management for large product lists
export const useProductCardMemory = (isVisible: boolean) => {
    const [shouldRenderContent, setShouldRenderContent] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isVisible) {
            setShouldRenderContent(true);
        } else {
            // Delay cleanup to avoid flashing
            timeoutRef.current = setTimeout(() => {
                setShouldRenderContent(false);
            }, 1000);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isVisible]);

    return shouldRenderContent;
}; 