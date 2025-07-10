'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { DriverDetails } from '../actions/get-drivers';

interface SmartSuggestionsProps {
    drivers: DriverDetails[];
    isLoading: boolean;
    onAssignDriver: (driverId: string) => void;
    isAssigning: boolean;
    orderLocation: {
        address: string;
        latitude?: number;
        longitude?: number;
    } | null;
}

export default function SmartSuggestions({
    drivers,
    isLoading,
    onAssignDriver,
    isAssigning,
    orderLocation
}: SmartSuggestionsProps) {
    // Note: orderLocation is not currently used in the implementation
    // It's kept for future feature development
    void orderLocation;
    const [isExpanded, setIsExpanded] = useState(true);

    // Calculate smart scoring for drivers
    const calculateSmartScore = (driver: DriverDetails): number => {
        let score = 0;

        // Distance to store (40% weight) - closer is better
        const maxDistance = 50; // km
        const distanceScore = driver.distanceFromStore
            ? Math.max(0, (maxDistance - driver.distanceFromStore) / maxDistance) * 40
            : 0;

        // TODO: Rating (25% weight) - currently not available
        // const ratingScore = (driver.rating / 5) * 25;
        const ratingScore = 0; // No rating system yet

        // Availability (20% weight) - fewer current orders is better
        const availabilityScore = Math.max(0, (driver.maxOrders - driver.currentOrders) / driver.maxOrders) * 20;

        // Performance (10% weight) - higher completion rate is better
        const performanceScore = (driver.completionRate / 100) * 10;

        // Experience (5% weight) - more deliveries is better
        const experienceScore = Math.min(driver.totalDeliveries / 50, 1) * 5;

        score = distanceScore + ratingScore + availabilityScore + performanceScore + experienceScore;

        return Math.round(score);
    };

    // Get top 3 drivers with their scores
    const topDrivers = drivers
        .map(driver => ({
            ...driver,
            smartScore: calculateSmartScore(driver)
        }))
        .sort((a, b) => b.smartScore - a.smartScore)
        .slice(0, 3);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-status-delivered bg-status-delivered/10 border-status-delivered/20';
        if (score >= 60) return 'text-feature-users bg-feature-users/10 border-feature-users/20';
        if (score >= 40) return 'text-status-pending bg-status-pending/10 border-status-pending/20';
        return 'text-status-canceled bg-status-canceled/10 border-status-canceled/20';
    };

    const getRecommendationText = (driver: DriverDetails & { smartScore: number }) => {
        const reasons = [];

        if (driver.distanceFromStore && driver.distanceFromStore <= 5) {
            reasons.push('قريب جداً من المتجر');
        } else if (driver.distanceFromStore && driver.distanceFromStore <= 15) {
            reasons.push('قريب من المتجر');
        }

        if (driver.currentOrders === 0) {
            reasons.push('متاح فوراً');
        } else if (driver.currentOrders < driver.maxOrders / 2) {
            reasons.push('حمولة منخفضة');
        }

        if (driver.completionRate >= 90) {
            reasons.push('أداء ممتاز');
        } else if (driver.completionRate >= 70) {
            reasons.push('أداء جيد');
        }

        if (driver.totalDeliveries >= 100) {
            reasons.push('خبرة عالية');
        }

        // TODO: Add rating-based reasons when system is implemented
        if (driver.rating === 0) {
            reasons.push('بحاجة تقييم أولي');
        }

        return reasons.length > 0 ? reasons.join(' • ') : 'لا توجد مميزات واضحة';
    };

    if (isLoading) {
        return (
            <Card className="shadow-lg border-l-4 border-l-feature-analytics">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Icon name="Brain" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                        اقتراحات ذكية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Icon name="Loader2" className="h-6 w-6 animate-spin text-feature-analytics" />
                        <span className="mr-2 text-muted-foreground">جاري تحليل السائقين...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (topDrivers.length === 0) {
        return (
            <Card className="shadow-lg border-l-4 border-l-feature-analytics">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Icon name="AlertTriangle" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                        اقتراحات ذكية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <Icon name="AlertTriangle" className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">لا يوجد سائقين متاحين للتحليل</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-xl border-l-4 border-l-feature-analytics card-hover-effect overflow-hidden">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="pb-4 cursor-pointer hover:bg-gradient-to-r hover:from-feature-analytics/5 hover:to-transparent transition-all duration-200 group">
                        <CardTitle className="flex items-center justify-between text-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-feature-analytics/10 group-hover:bg-feature-analytics/20 transition-colors">
                                    <Icon name="Brain" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold">اقتراحات ذكية</span>
                                    <span className="text-sm text-muted-foreground block">أفضل {topDrivers.length} سائقين</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-feature-analytics/10 text-feature-analytics border-feature-analytics/30">
                                    AI مُحسّن
                                </Badge>
                                {isExpanded ? (
                                    <Icon name="ChevronUp" className="h-5 w-5 text-muted-foreground group-hover:text-feature-analytics transition-colors" />
                                ) : (
                                    <Icon name="ChevronDown" className="h-5 w-5 text-muted-foreground group-hover:text-feature-analytics transition-colors" />
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <div className="space-y-6">

                            {/* Enhanced Algorithm Info */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-feature-analytics/10 via-feature-analytics/5 to-feature-analytics/10 border border-feature-analytics/20 rounded-xl p-4">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-feature-analytics/10 rounded-full -translate-y-10 translate-x-10"></div>
                                <div className="relative">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-feature-analytics/10">
                                            <Icon name="Info" className="h-4 w-4 text-feature-analytics" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-feature-analytics font-semibold mb-2 flex items-center gap-2">
                                                معايير التقييم الذكي
                                                <Badge className="bg-feature-analytics/20 text-feature-analytics text-xs">v2.0</Badge>
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2 text-sm">
                                                <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                                                    <span className="text-feature-analytics font-medium">المسافة للمتجر</span>
                                                    <Badge className="bg-feature-analytics/10 text-feature-analytics">40%</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                                                    <span className="text-feature-analytics font-medium">التوفر</span>
                                                    <Badge className="bg-feature-products/10 text-feature-products">20%</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                                                    <span className="text-feature-analytics font-medium">الأداء</span>
                                                    <Badge className="bg-feature-users/10 text-feature-users">10%</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                                                    <span className="text-feature-analytics font-medium">الخبرة</span>
                                                    <Badge className="bg-feature-settings/10 text-feature-settings">5%</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-2 bg-status-pending/10 rounded-lg border border-status-pending/20">
                                                    <span className="text-status-pending font-medium">التقييم</span>
                                                    <Badge className="bg-status-pending/10 text-status-pending">25% قريباً</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Top Recommendations */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                    <Icon name="Target" className="h-5 w-5 text-feature-analytics" />
                                    أفضل الترشيحات
                                </h4>
                                {topDrivers.map((driver, index) => (
                                    <div
                                        key={driver.id}
                                        className={`relative group transition-all duration-300 hover:scale-[1.02] ${index === 0
                                            ? 'bg-gradient-to-r from-status-delivered/10 via-status-delivered/5 to-status-delivered/10 border-2 border-status-delivered/30 shadow-lg'
                                            : 'bg-background border border-border hover:border-border/60 shadow-sm hover:shadow-md'
                                            } rounded-xl p-5 overflow-hidden`}
                                    >
                                        {/* Background Pattern */}
                                        {index === 0 && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-status-delivered/5 rounded-full -translate-y-16 translate-x-16"></div>
                                        )}

                                        {/* Enhanced Rank Badge */}
                                        <div className="absolute -top-2 -right-2 z-10">
                                            <div className={`relative ${index === 0 ? 'bg-status-delivered' :
                                                index === 1 ? 'bg-feature-users' : 'bg-feature-settings'
                                                } text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg`}>
                                                {index + 1}
                                                {index === 0 && (
                                                    <div className="absolute -inset-1 bg-status-delivered/30 rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="relative space-y-4">

                                            {/* Enhanced Driver Header */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-feature-users/20">
                                                            <AvatarImage src={driver.profileImage} alt={driver.name} />
                                                            <AvatarFallback className="bg-gradient-to-br from-feature-users to-feature-users/80 text-white font-semibold">
                                                                {driver.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {index === 0 && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-delivered rounded-full flex items-center justify-center">
                                                                <Icon name="CheckCircle" className="h-3 w-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h4 className="font-bold text-lg flex items-center gap-2">
                                                            {driver.name}
                                                            {index === 0 && (
                                                                <Badge className="bg-status-delivered/10 text-status-delivered text-xs">الأفضل</Badge>
                                                            )}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1" dir="ltr">
                                                            <span className="w-2 h-2 bg-status-delivered rounded-full"></span>
                                                            {driver.phone}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className={`text-lg px-4 py-2 font-bold rounded-xl border-2 transition-all ${getScoreColor(driver.smartScore)} hover:scale-105`}>
                                                            <div className="flex items-center gap-2">
                                                                <Icon name="Target" className="h-4 w-4" />
                                                                {driver.smartScore}%
                                                            </div>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>النتيجة الذكية: {driver.smartScore}/100</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>

                                            {/* Recommendation Reason */}
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                {getRecommendationText(driver)}
                                            </div>

                                            {/* Assign Button */}
                                            <div className="mt-4">
                                                <Button
                                                    onClick={() => onAssignDriver(driver.id)}
                                                    disabled={isAssigning || driver.status !== 'available'}
                                                    className={`w-full h-12 text-base font-semibold transition-all duration-200 ${index === 0
                                                        ? 'bg-gradient-to-r from-status-delivered to-status-delivered/80 hover:from-status-delivered/90 hover:to-status-delivered/70 shadow-lg hover:shadow-xl'
                                                        : 'btn-professional hover:scale-[1.02]'
                                                        }`}
                                                    size="lg"
                                                >
                                                    {isAssigning ? (
                                                        <>
                                                            <Icon name="Loader2" className="h-5 w-5 ml-2 animate-spin" />
                                                            جاري التعيين...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icon name="CheckCircle" className="h-5 w-5 ml-2" />
                                                            {index === 0 ? 'تعيين السائق الأفضل' : 'تعيين هذا السائق'}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}