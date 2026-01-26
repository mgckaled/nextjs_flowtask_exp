import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    priceId: null,
    price: 0,
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO,
    price: 49,
  },
  max: {
    name: 'Max',
    priceId: process.env.STRIPE_PRICE_MAX,
    price: 99,
  },
} as const

export type PlanType = keyof typeof PLANS
