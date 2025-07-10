'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/components/icons/Icon';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { DriverDetails } from '../actions/get-drivers';
import DriverCard from './DriverCard';

interface DriverSelectionGridProps {
    drivers: DriverDetails[];
    orderId: string;
    orderLocation: {
        address: string;
        latitude?: number;
        longitude?: number;
    } | null;
    view?: 'grid' | 'list';
    filter?: string;
    sort?: 'distance' | 'rating' | 'availability' | 'performance';
    onAssignDriver: (driverId: string) => void;
    isAssigning: string | null;
}

export default function DriverSelectionGrid({
    drivers,
    orderId,
    orderLocation,
    onAssignDriver,
    isAssigning
}: DriverSelectionGridProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter and sort drivers
    const filteredAndSortedDrivers = useMemo(() => {
        let filtered = drivers.filter(driver => {
            const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                driver.phone.includes(searchTerm) ||
                driver.vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());

            // Simplified status filtering - only two states
            let matchesStatus = true;

            if (statusFilter !== 'all') {
                switch (statusFilter) {
                    case 'available':
                        // TODO: Implement proper logic to check if driver is truly available
                        // This should check: driver.status === 'available' AND not currently on delivery
                        // For now using simple status check
                        matchesStatus = driver.status === 'available';
                        break;
                    case 'unavailable':
                        // TODO: Implement proper logic to check if driver is on delivery mission
                        // This should check: driver is currently assigned to active delivery orders
                        // For now using currentOrders > 0 as proxy for "on delivery"
                        matchesStatus = driver.currentOrders > 0;
                        break;
                    default:
                        matchesStatus = true;
                }
            }

            return matchesSearch && matchesStatus;
        });

        // Sort drivers by distance (default)
        return filtered.sort((a, b) => {
            return (a.distanceFromStore || Infinity) - (b.distanceFromStore || Infinity);
        });
    }, [drivers, searchTerm, statusFilter]);

    const handleAssignDriver = (driverId: string) => {
        onAssignDriver(driverId);
    };

    return (
        <div className="space-y-6">

            {/* Enhanced Filters & Search */}
            <Card className="shadow-lg border border-border rounded-xl overflow-hidden">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <div className="flex flex-col lg:flex-row gap-3">

                            {/* Enhanced Search */}
                            <div className="relative flex-1">
                                <Icon name="Search" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="البحث بالاسم، الهاتف، أو نوع المركبة..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10 h-11 bg-background border-border focus:border-feature-users focus:ring-feature-users/20 transition-all duration-200"
                                />
                            </div>

                            {/* Enhanced Status Filter */}
                            <div className="w-full lg:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="h-11 bg-background border-border focus:border-feature-users transition-all duration-200">
                                        <div className="flex items-center gap-2">
                                            <Icon name="Filter" className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="حالة السائق" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                                                الكل
                                            </div>
                                        </SelectItem>

                                        {/* Simplified delivery status - only two options */}
                                        <SelectItem value="available">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-status-delivered rounded-full"></div>
                                                متاح
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="unavailable">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center">
                                                    <Icon name="Truck" className="h-3 w-3 text-feature-commerce mr-1" />
                                                    <div className="w-2 h-2 bg-status-canceled rounded-full"></div>
                                                </div>
                                                غير متاح
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters Button */}
                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                    className="h-11 bg-background border-border hover:bg-gray-100 transition-all duration-200"
                                >
                                    <Icon name="AlertTriangle" className="h-4 w-4 ml-2" />
                                    مسح الفلاتر
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* No Results */}
            {filteredAndSortedDrivers.length === 0 ? (
                <Card className="shadow-lg border-l-4 border-l-status-pending card-hover-effect">
                    <CardContent className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="p-4 rounded-full bg-status-pending/10 w-fit mx-auto">
                                <Icon name="AlertTriangle" className="h-8 w-8 text-status-pending" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">لا يوجد سائقون متاحون</h3>
                                <p className="text-muted-foreground">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'لا توجد نتائج تطابق البحث. جرب تغيير الفلاتر أو البحث.'
                                        : 'لا يوجد سائقون متاحون حالياً لهذا الطلب.'
                                    }
                                </p>
                            </div>
                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                    className="btn-professional"
                                >
                                    <Icon name="CheckCircle" className="h-4 w-4 ml-2" />
                                    عرض جميع السائقين
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                // Driver Grid
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedDrivers.map((driver) => (
                        <DriverCard
                            key={driver.id}
                            driver={driver}
                            orderId={orderId}
                            orderLocation={orderLocation}
                            onAssign={() => handleAssignDriver(driver.id)}
                            isAssigning={isAssigning === driver.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 