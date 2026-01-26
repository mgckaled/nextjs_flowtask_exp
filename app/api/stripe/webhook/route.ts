import { stripe } from "@/lib/stripe"
import { db } from "@/db"
import { subscriptions, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import Stripe from "stripe"
import { sendPaymentConfirmation } from "@/app/actions/email"

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
          const subscriptionData = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const userId = session.metadata?.userId
          const plan = session.metadata?.plan || "pro"

          if (userId) {
            // Upsert subscription
            const existing = await db.query.subscriptions.findFirst({
              where: eq(subscriptions.userId, userId),
            })

            const periodEnd = (subscriptionData as unknown as { current_period_end?: number }).current_period_end
            const currentPeriodEnd = periodEnd
              ? new Date(periodEnd * 1000)
              : null

            if (existing) {
              await db
                .update(subscriptions)
                .set({
                  stripeCustomerId: session.customer as string,
                  stripeSubscriptionId: subscriptionData.id,
                  stripePriceId: subscriptionData.items.data[0]?.price.id,
                  plan,
                  status: subscriptionData.status,
                  currentPeriodEnd,
                  updatedAt: new Date(),
                })
                .where(eq(subscriptions.userId, userId))
            } else {
              await db.insert(subscriptions).values({
                userId,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscriptionData.id,
                stripePriceId: subscriptionData.items.data[0]?.price.id,
                plan,
                status: subscriptionData.status,
                currentPeriodEnd,
              })
            }

            // Enviar email de confirmação de pagamento
            const user = await db.query.users.findFirst({
              where: eq(users.id, userId),
            })

            if (user?.email) {
              const amount = session.amount_total
                ? `R$ ${(session.amount_total / 100).toFixed(2).replace('.', ',')}`
                : 'Valor não disponível'

              await sendPaymentConfirmation(user.email, {
                name: user.name || 'Cliente',
                plan: plan as 'pro' | 'max',
                amount,
                date: new Date().toLocaleDateString('pt-BR'),
                nextBillingDate: currentPeriodEnd
                  ? currentPeriodEnd.toLocaleDateString('pt-BR')
                  : undefined,
              })
            }
          }
        }
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subEvent = event.data.object as Stripe.Subscription
        const userId = subEvent.metadata?.userId

        if (userId) {
          const periodEnd = (subEvent as unknown as { current_period_end?: number }).current_period_end
          const currentPeriodEnd = periodEnd
            ? new Date(periodEnd * 1000)
            : null

          await db
            .update(subscriptions)
            .set({
              status: subEvent.status,
              plan: subEvent.status === "canceled" ? "free" : undefined,
              currentPeriodEnd,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.userId, userId))
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as unknown as { subscription?: string }).subscription

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
