"use client";
import dynamic from "next/dynamic";

const Newsletter = dynamic(() => import("@/app/(e-comm)/homepage/component/Fotter/Newsletter"), {
    ssr: false,
    loading: () => <div className="h-20 bg-muted/50 animate-pulse rounded"></div>,
});

export default function NewsletterClientWrapper() {
    return <Newsletter />;
} 