import Stripe from "stripe";

let _stripe: Stripe | null = null;
export function getStripeInstance(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Lazy proxy — safe to import in client components (never evaluated at module load time)
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripeInstance() as never)[prop as keyof Stripe];
  },
});

export const PLANS = {
  pro_monthly: {
    name: "Pro",
    price: "$34.99",
    period: "month",
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    features: [
      "Unlimited scans",
      "All protocols (12+)",
      "PDF export",
      "Priority AI model",
      "Scan history (90 days)",
    ],
  },
  pro_yearly: {
    name: "Pro Yearly",
    price: "$290",
    period: "year",
    badge: "Save 33%",
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "Early access to new protocols",
    ],
  },
  clinic: {
    name: "Clinic",
    price: "$89.99",
    period: "month",
    priceId: process.env.STRIPE_CLINIC_MONTHLY_PRICE_ID!,
    features: [
      "Unlimited scans",
      "Up to 5 team members",
      "Shared scan history",
      "Priority support",
      "Custom protocol requests",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export const FREE_SCAN_LIMIT = 5;
