import { auth } from "@/auth"
import { stripe, PLANS } from "@/lib/stripe"
import { db } from "@/db"
import { subscriptions } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session.user.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan } = await req.json()

    if (!plan || !['pro', 'max'].includes(plan)) {
      return Response.json({ error: "Invalid plan" }, { status: 400 })
    }

    const priceId = plan === 'pro' ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_MAX

    if (!priceId) {
      return Response.json({ error: "Price not configured" }, { status: 500 })
    }

    // Verificar se já tem subscription
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, session.user.id),
    })

    let customerId = existingSubscription?.stripeCustomerId

    // Criar customer no Stripe se não existir
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      })
      customerId = customer.id
    }

    // Criar Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: session.user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan,
        },
      },
      allow_promotion_codes: true,
    })

    return Response.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
