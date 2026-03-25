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
  student_monthly: {
    name: "Student",
    price: "$9.99",
    period: "month",
    priceId: process.env.STRIPE_STUDENT_MONTHLY_PRICE_ID!,
    features: [
      "50 AI analyses/month",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat (150 msgs/mo)",
      "90-day scan history",
      "PHI auto-redaction",
    ],
  },
  student_yearly: {
    name: "Student",
    price: "$79.99",
    period: "year",
    badge: "Save 33%",
    priceId: process.env.STRIPE_STUDENT_YEARLY_PRICE_ID!,
    features: [
      "50 AI analyses/month",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat (150 msgs/mo)",
      "90-day scan history",
      "PHI auto-redaction",
    ],
  },
  pro_monthly: {
    name: "Professional",
    price: "$19.99",
    period: "month",
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    features: [
      "150 AI analyses/month",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat (500 msgs/mo)",
      "PDF report export",
      "1-year scan history",
      "PHI auto-redaction",
      "Priority AI queue",
    ],
  },
  pro_yearly: {
    name: "Professional",
    price: "$159",
    period: "year",
    badge: "Save 34%",
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    features: [
      "150 AI analyses/month",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat (500 msgs/mo)",
      "PDF report export",
      "1-year scan history",
      "PHI auto-redaction",
      "Priority AI queue",
    ],
  },
  team_monthly: {
    name: "Team",
    price: "$99",
    period: "month",
    priceId: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID!,
    features: [
      "500 AI analyses/month (pooled)",
      "Up to 10 seats",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat (2,000 msgs/mo)",
      "PDF export",
      "Unlimited history",
      "PHI auto-redaction",
      "Priority support",
    ],
  },
  team_yearly: {
    name: "Team",
    price: "$799",
    period: "year",
    badge: "Save 33%",
    priceId: process.env.STRIPE_TEAM_YEARLY_PRICE_ID!,
    features: [
      "500 AI analyses/month (pooled)",
      "Up to 10 seats",
      "All 31 protocols",
      "Full measurements suite",
      "AI chat (2,000 msgs/mo)",
      "PDF export",
      "Unlimited history",
      "PHI auto-redaction",
      "Priority support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export const FREE_SCAN_LIMIT = 5;
