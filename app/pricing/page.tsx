import type { Metadata } from 'next'
import PricingPageContent from '../components/pricing/PricingPageContent'

export const metadata: Metadata = {
  title: 'Pricing | Exp Learning',
  description: 'Escolha o plano perfeito para você. Free, Pro ou Max.',
}

export default function PricingPage() {
  return <PricingPageContent />
}
