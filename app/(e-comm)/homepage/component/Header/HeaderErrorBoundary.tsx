'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';

interface HeaderErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface HeaderErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class HeaderErrorBoundary extends React.Component<HeaderErrorBoundaryProps, HeaderErrorBoundaryState> {
    constructor(props: HeaderErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): HeaderErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Header Error Boundary caught an error:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
            }

            return (
                <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-xl shadow-black/10 dark:shadow-black/30 transition-all duration-300 supports-[backdrop-filter]:bg-background/80 relative">
                    <div className='relative'>
                        <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
                            {/* Logo fallback */}
                            <div className='flex flex-shrink-0 items-center ml-2 md:ml-0'>
                                <Button variant="ghost" className="h-[30px] w-[120px] md:h-[40px] md:w-[160px] p-0">
                                    <Icon name="Home" className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Search Bar fallback */}
                            <div className='flex flex-1 items-center justify-center px-2 md:px-6'>
                                <div className='w-full max-w-xl relative'>
                                    <Button variant="outline" className="h-11 w-full justify-start text-muted-foreground">
                                        <Icon name="Search" className="w-4 h-4 mr-2" />
                                        ابحث عن المنتجات...
                                    </Button>
                                </div>
                            </div>

                            {/* Actions fallback */}
                            <div className='flex items-center gap-4 md:gap-6'>
                                <Button variant="ghost" size="icon" onClick={this.resetError}>
                                    <Icon name="RefreshCw" className="w-4 h-4" />
                                </Button>
                            </div>
                        </nav>
                    </div>
                </header>
            );
        }

        return this.props.children;
    }
}

export default HeaderErrorBoundary; 