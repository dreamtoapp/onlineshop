'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, CheckCircle, Plus, Home, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddressListDialog from "./client/AddressListDialog";
import { Address as PrismaAddress } from "@prisma/client";
import { useRouter } from "next/navigation";
import GoogleMapsLink from "@/components/GoogleMapsLink";

export type AddressWithDefault = PrismaAddress & { isDefault?: boolean };

interface AddressBookProps {
    addresses: AddressWithDefault[];
    selectedAddressId: string;
    onSelectAddress: (id: string) => void;
}

export default function AddressBook({ addresses, selectedAddressId, onSelectAddress }: AddressBookProps) {
    const router = useRouter();

    // Safe check for undefined addresses
    const safeAddresses = addresses || [];
    const defaultAddress = safeAddresses.find(addr => addr.isDefault) || safeAddresses[0];

    const handleAddAddress = () => {
        router.push('/user/addresses?redirect=/checkout');
    };

    if (!safeAddresses || safeAddresses.length === 0) {
        return (
            <Card className="group relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-2xl transition-all duration-300 ease-out">
                {/* Decorative gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Status indicator bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

                <CardHeader className="pb-6 relative">
                    <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-slate-800">
                        <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl transition-all duration-200 group-hover:scale-110">
                            <MapPin className="h-7 w-7" />
                        </div>
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            عنوان التوصيل
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative">
                    <div className="text-center py-8">
                        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl mb-6">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Home className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-orange-800 mb-2">لم يتم إضافة عنوان بعد</h3>
                            <p className="text-base text-orange-700 leading-relaxed mb-4 font-medium">
                                يجب إضافة عنوان للتوصيل قبل المتابعة في عملية الشراء
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleAddAddress}
                                className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-6 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="h-4 w-4 ml-2 inline" />
                                إضافة عنوان جديد
                            </button>

                            <div className="text-base text-slate-500 bg-slate-100 px-3 py-2 rounded-lg font-medium">
                                أو
                            </div>

                            <AddressListDialog addresses={[]} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="group relative overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-2xl transition-all duration-300 ease-out">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Status indicator bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />

            <CardHeader className="pb-6 relative">
                <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-slate-800">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl transition-all duration-200 group-hover:scale-110">
                        <MapPin className="h-7 w-7" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        عنوان التوصيل
                    </span>
                    {defaultAddress && (
                        <div className="ml-auto flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-base font-semibold">
                                <CheckCircle className="h-4 w-4" />
                                متوفر
                            </div>
                        </div>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 relative">
                {/* Address List with selection */}
                <div className="space-y-4">
                    {safeAddresses.map(addr => (
                        <div
                            key={addr.id}
                            className={`group/address p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${selectedAddressId === addr.id
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                                }`}
                            onClick={() => onSelectAddress(addr.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg transition-all duration-200 ${selectedAddressId === addr.id
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-slate-100 text-slate-600 group-hover/address:bg-blue-100 group-hover/address:text-blue-600'
                                    }`}>
                                    <input
                                        type="radio"
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => onSelectAddress(addr.id)}
                                        className="accent-blue-600 w-4 h-4"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-xl text-slate-800">{addr.label || 'عنوان'}</h4>
                                        {addr.isDefault && (
                                            <Badge className="px-2 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold rounded-full">
                                                افتراضي
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="space-y-2 text-base text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-slate-500" />
                                            <span className="font-medium">{addr.district}, {addr.street}, مبنى {addr.buildingNumber}</span>
                                        </div>

                                        {addr.latitude && addr.longitude && (
                                            <div className="mt-3">
                                                <GoogleMapsLink
                                                    latitude={addr.latitude}
                                                    longitude={addr.longitude}
                                                    label="عرض على الخريطة"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors duration-200 text-base font-semibold"
                                                    showIcon={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Address Management */}
                <div className="pt-4 border-t border-slate-200">
                    <AddressListDialog addresses={safeAddresses} />
                </div>
            </CardContent>
        </Card>
    );
} 