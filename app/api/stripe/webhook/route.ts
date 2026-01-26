import { stripe } from "@/lib/stripe"
import { db } from "@/db"
import { subscriptions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return Response.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return Response.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const userId = session.metadata?.userId
          const plan = session.metadata?.plan || "pro"

          if (userId) {
            // Upsert subscription
            const existing = await db.query.subscriptions.findFirst({
              where: eq(subscriptions.userId, userId),
            })

            if (existing) {
              await db
                .update(subscriptions)
                .set({
                  stripeCustomerId: session.customer as string,
                  stripeSubscriptionId: subscription.id,
                  stripePriceId: subscription.items.data[0]?.price.id,
                  plan,
                  status: subscription.status,
                  currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                  updatedAt: new Date(),
                })
                .where(eq(subscriptions.userId, userId))
            } else {
              await db.insert(subscriptions).values({
                userId,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price.id,
                plan,
                status: subscription.status,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              })
            }
          }
        }
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await db
            .update(subscriptions)
            .set({
              status: subscription.status,
              plan: subscription.status === "canceled" ? "free" : undefined,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.userId, userId))
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          await db
            .update(subscriptions)
            .set({
              status: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
        }
        break
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return Response.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
