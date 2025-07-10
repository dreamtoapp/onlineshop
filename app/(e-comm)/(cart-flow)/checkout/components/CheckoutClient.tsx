"use client";
import { useState } from "react";
import AddressBook from "./AddressBook";
import UserInfoCard from "./UserInfoCard";
import MiniCartSummary from "./MiniCartSummary";
import ShiftSelectorWrapper from "./ShiftSelectorWrapper";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PlaceOrderButton from "./PlaceOrderButton";
import BackButton from "@/components/BackButton";
import { AddressWithDefault } from "./AddressBook";
import { UserProfile } from "./UserInfoCard";
import { CartData } from "./PlaceOrderButton";
import TermsDialog from "./TermsDialog";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface CheckoutClientProps {
    user: UserProfile;
    cart: CartData;
    addresses: AddressWithDefault[];
}

export default function CheckoutClient({ user, cart, addresses }: CheckoutClientProps) {
    const [selectedAddress, setSelectedAddress] = useState<AddressWithDefault | null>(addresses.find(addr => addr.isDefault) || addresses[0] || null);
    const [selectedShiftId, setSelectedShiftId] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CASH");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsDialogOpen, setTermsDialogOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <BackButton variant="gradient" className="mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {user && <UserInfoCard user={user} />}
                        <AddressBook
                            addresses={addresses}
                            onSelectAddress={id => setSelectedAddress(addresses.find(a => a.id === id) || null)}
                            selectedAddressId={selectedAddress?.id || ""}
                        />
                        <ShiftSelectorWrapper selectedShiftId={selectedShiftId} onShiftSelect={setSelectedShiftId} />
                        <PaymentMethodSelector selectedPaymentMethod={selectedPaymentMethod} onSelectPayment={setSelectedPaymentMethod} />
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={termsAccepted}
                                onChange={e => setTermsAccepted(e.target.checked)}
                                className="accent-feature-commerce h-5 w-5"
                            />
                            <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
                                <DialogTrigger asChild>
                                    <label htmlFor="terms" className="cursor-pointer text-feature-commerce hover:underline text-base">
                                        الشروط والأحكام
                                    </label>
                                </DialogTrigger>
                                <TermsDialog />
                            </Dialog>
                        </div>
                        <PlaceOrderButton
                            cart={cart}
                            user={user}
                            selectedAddress={selectedAddress}
                            shiftId={selectedShiftId}
                            paymentMethod={selectedPaymentMethod}
                            termsAccepted={termsAccepted}
                        />
                    </div>
                    <div className="space-y-6">
                        <MiniCartSummary cart={cart} />
                    </div>
                </div>
            </div>
        </div>
    );
} 