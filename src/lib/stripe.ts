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
    price: "$9.99",
    period: "month",
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    features: [
      "Unlimited AI analyses",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat",
      "PDF report export",
      "PHI auto-redaction",
      "Priority AI queue",
    ],
  },
  pro_yearly: {
    name: "Pro",
    price: "$69.99",
    period: "year",
    badge: "4 months free",
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    features: [
      "Unlimited AI analyses",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat",
      "PDF report export",
      "PHI auto-redaction",
      "Priority AI queue",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export const FREE_SCAN_LIMIT = 5;
