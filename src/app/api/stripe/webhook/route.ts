import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

// Raw body needed for Stripe signature verification
export const runtime = "nodejs";

function tierFromPriceId(priceId: string): "pro" | "free" {
  const {
    STRIPE_PRO_MONTHLY_PRICE_ID,
    STRIPE_PRO_YEARLY_PRICE_ID,
    // Legacy price IDs — kept so existing subscriber renewals still resolve to pro
    STRIPE_STUDENT_MONTHLY_PRICE_ID,
    STRIPE_STUDENT_YEARLY_PRICE_ID,
    STRIPE_TEAM_MONTHLY_PRICE_ID,
    STRIPE_TEAM_YEARLY_PRICE_ID,
  } = process.env;
  if (
    priceId === STRIPE_PRO_MONTHLY_PRICE_ID ||
    priceId === STRIPE_PRO_YEARLY_PRICE_ID ||
    priceId === STRIPE_STUDENT_MONTHLY_PRICE_ID ||
    priceId === STRIPE_STUDENT_YEARLY_PRICE_ID ||
    priceId === STRIPE_TEAM_MONTHLY_PRICE_ID ||
    priceId === STRIPE_TEAM_YEARLY_PRICE_ID
  ) return "pro";
  return "free";
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      // ── New subscription created ──────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const customerId    = session.customer as string;
        const subscriptionId = session.subscription as string;
        const subscription  = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId       = subscription.items.data[0]?.price.id;
        const tier          = tierFromPriceId(priceId);

        // Try to get supabase_user_id from metadata (authenticated checkout)
        let userId = (session.metadata as Record<string, string> | null)?.supabase_user_id;

        if (!userId) {
          // Unauthenticated checkout — find or create Supabase user by email
          const email = session.customer_details?.email;
          if (!email) {
            console.error("Webhook: no email in checkout session");
            break;
          }

          // Check if a profile with this email already exists
          const { data: existing } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email)
            .single();

          if (existing) {
            userId = existing.id;
          } else {
            // Create new Supabase user and send them an invite email to set password
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
            const { data: invited, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(
              email,
              { redirectTo: `${appUrl}/auth/callback?next=/auth/reset-password` },
            );
            if (inviteErr || !invited.user) {
              console.error("Webhook: failed to invite user:", inviteErr);
              break;
            }
            userId = invited.user.id;
          }

          // Stamp the subscription metadata so future webhook events can find the user
          await stripe.subscriptions.update(subscriptionId, {
            metadata: { supabase_user_id: userId ?? "" },
          });
        }

        await supabase.from("profiles").update({
          tier,
          stripe_customer_id:     customerId,
          stripe_subscription_id: subscriptionId,
          scans_used_this_month:  0,
          current_period_start:   new Date().toISOString(),
        }).eq("id", userId);

        break;
      }

      // ── Subscription renewed / invoice paid ───────────────────
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subDetails = invoice.parent?.type === "subscription_details"
          ? invoice.parent.subscription_details
          : null;
        const subscriptionId = subDetails?.subscription as string | undefined;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const tier = tierFromPriceId(priceId);

        await supabase.from("profiles").update({
          tier,
          scans_used_this_month: 0,
          current_period_start:  new Date().toISOString(),
        }).eq("id", userId);

        break;
      }

      // ── Subscription cancelled or payment failed ──────────────
      case "customer.subscription.deleted":
      case "invoice.payment_failed": {
        const obj = event.data.object as Stripe.Subscription | Stripe.Invoice;
        const subscriptionId = obj.object === "subscription"
          ? obj.id
          : ((obj as Stripe.Invoice).parent?.type === "subscription_details"
              ? ((obj as Stripe.Invoice).parent!.subscription_details!.subscription as string)
              : undefined);

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId).catch(() => null);
        const userId = subscription?.metadata?.supabase_user_id;
        if (!userId) break;

        await supabase.from("profiles").update({
          tier: "free",
          stripe_subscription_id: null,
        }).eq("id", userId);

        break;
      }

      // ── Subscription updated (plan change) ────────────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const tier = tierFromPriceId(priceId);

        await supabase.from("profiles").update({ tier }).eq("id", userId);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
