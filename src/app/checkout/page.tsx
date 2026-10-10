import type { Metadata } from "next";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

export const metadata: Metadata = { title: "Review your floor — OwnTheTop", robots: { index: false, follow: false } };
export default function CheckoutPage() { return <CheckoutSummary/>; }
