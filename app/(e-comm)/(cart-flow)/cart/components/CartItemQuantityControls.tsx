"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";
import { updateItemQuantity, removeItem } from "@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions";
import { toast } from "sonner";
import { useCartStore } from '../cart-controller/cartStore';

interface CartItemControlsProps {
    itemId?: string;
    productId: string;
    isServerItem: boolean;
    currentQuantity: number;
    productName: string;
    onRemoved?: () => void;
}

const CartItemQuantityControls = function CartItemQuantityControls({
    itemId,
    productId,
    isServerItem,
    currentQuantity,
    productName,
    onRemoved
}: CartItemControlsProps) {
    const [isPending, startTransition] = useTransition();
    const [isRemoving, setIsRemoving] = useState(false);
    const { updateQuantity: updateLocalQuantity, removeItem: removeLocalItem } = useCartStore();

    // Optimistic updates for better UX
    const [optimisticQuantity, updateOptimisticQuantity] = useOptimistic(
        currentQuantity,
        (_: number, newQuantity: number) => newQuantity
    );

    const handleQuantityUpdate = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > 99) return;
        startTransition(async () => {
            updateOptimisticQuantity(newQuantity);
            try {
                if (isServerItem && itemId) {
                    await updateItemQuantity(itemId, newQuantity);
                } else {
                    await updateLocalQuantity(productId, newQuantity - currentQuantity, false);
                }
                toast.success(`تم تحديث كمية ${productName}`, { duration: 2000 });
            } catch (error) {
                updateOptimisticQuantity(currentQuantity);
                toast.error("فشل في تحديث الكمية، حاول مرة أخرى");
            }
        });
    };

    const handleRemove = () => {
        setIsRemoving(true);
        startTransition(async () => {
            try {
                if (isServerItem && itemId) {
                    await removeItem(itemId);
                    if (onRemoved) onRemoved();
                } else {
                    await removeLocalItem(productId, false);
                }
                toast.success(`تم حذف ${productName} من السلة`, {
                    duration: 3000,
                    action: {
                        label: "تراجع",
                        onClick: () => { toast.info("ميزة التراجع قريباً"); },
                    },
                });
            } catch (error) {
                setIsRemoving(false);
                toast.error("فشل في حذف المنتج، حاول مرة أخرى");
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value) || 1;
        if (newQuantity >= 1 && newQuantity <= 99) {
            handleQuantityUpdate(newQuantity);
        }
    };

    // Show loading state during removal
    if (isRemoving) {
        return (
            <div className="flex items-center gap-2 opacity-50">
                <Loader2 className="h-4 w-4 animate-spin text-feature-commerce" />
                <span className="text-sm text-muted-foreground">جاري الحذف...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center border border-feature-commerce/30 rounded-lg bg-feature-commerce-soft/20 backdrop-blur-sm overflow-hidden">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 sm:h-9 sm:w-9 hover:bg-feature-commerce/20 rounded-none border-r border-feature-commerce/20 active:scale-95 transition-all text-feature-commerce"
                    throttle={1000}
                    onClick={() => {
                        console.log('Decrement clicked at', new Date().toISOString());
                        handleQuantityUpdate(optimisticQuantity - 1);
                    }}
                    disabled={isPending || optimisticQuantity <= 1}
                    aria-label="تقليل الكمية"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Minus className="h-4 w-4" />
                    )}
                </Button>

                <Input
                    type="number"
                    value={optimisticQuantity}
                    onChange={handleInputChange}
                    className="w-14 h-11 sm:h-9 text-center border-0 focus-visible:ring-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium text-sm text-feature-commerce"
                    min="1"
                    max="99"
                    disabled={isPending}
                    aria-label={`الكمية: ${optimisticQuantity}`}
                />

                <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 sm:h-9 sm:w-9 hover:bg-feature-commerce/20 rounded-none border-l border-feature-commerce/20 active:scale-95 transition-all text-feature-commerce"
                    throttle={1000}
                    onClick={() => {
                        console.log('Increment clicked at', new Date().toISOString());
                        handleQuantityUpdate(optimisticQuantity + 1);
                    }}
                    disabled={isPending || optimisticQuantity >= 99}
                    aria-label="زيادة الكمية"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Remove Button */}
            <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 sm:h-9 sm:w-9 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg border border-destructive/20 active:scale-95 transition-all"
                onClick={handleRemove}
                disabled={isPending || isRemoving}
                aria-label={`حذف ${productName} من السلة`}
                title="حذف من السلة"
            >
                {isRemoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <X className="h-5 w-5" />
                )}
            </Button>
        </div>
    );
};

export default React.memo(CartItemQuantityControls); 