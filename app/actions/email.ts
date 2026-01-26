'use server'

import { resend, EMAIL_FROM } from '@/lib/resend'
import { db } from '@/db'
import { userProfiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import WelcomeEmail from '@/emails/templates/WelcomeEmail'
import PaymentConfirmEmail from '@/emails/templates/PaymentConfirmEmail'
import NewsletterEmail from '@/emails/templates/NewsletterEmail'
import MarketingEmail from '@/emails/templates/MarketingEmail'

type EmailResult = {
  success: boolean
  message: string
  id?: string
}

// Verificar preferências de email do usuário
async function canSendEmail(
  userId: string,
  type: 'notification' | 'marketing'
): Promise<boolean> {
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  })

  if (!profile?.preferences) return true // Default: pode enviar

  if (type === 'notification') {
    return profile.preferences.emailNotifications !== false
  }

  if (type === 'marketing') {
    return profile.preferences.marketingEmails === true
  }

  return true
}

// Email de boas-vindas (após primeiro cadastro)
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: 'Bem-vindo ao FlowTask! 🎉',
      react: WelcomeEmail({ name }),
    })

    if (error) {
      console.error('Erro ao enviar email de boas-vindas:', error)
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: 'Email de boas-vindas enviado!',
      id: data?.id,
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, message: 'Erro ao enviar email' }
  }
}

// Email de confirmação de pagamento
export async function sendPaymentConfirmation(
  to: string,
  data: {
    name: string
    plan: 'pro' | 'max'
    amount: string
    date: string
    nextBillingDate?: string
  }
): Promise<EmailResult> {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: `Pagamento confirmado - Plano ${data.plan === 'pro' ? 'Pro' : 'Max'} FlowTask`,
      react: PaymentConfirmEmail(data),
    })

    if (error) {
      console.error('Erro ao enviar confirmação de pagamento:', error)
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: 'Confirmação de pagamento enviada!',
      id: emailData?.id,
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, message: 'Erro ao enviar email' }
  }
}

// Email de newsletter/novidades
export async function sendNewsletterEmail(
  userId: string,
  to: string,
  data: {
    name: string
    title: string
    previewText: string
    content: {
      heading: string
      description: string
      ctaText?: string
      ctaUrl?: string
    }[]
  }
): Promise<EmailResult> {
  // Verificar se usuário permite notificações
  const canSend = await canSendEmail(userId, 'notification')
  if (!canSend) {
    return { success: false, message: 'Usuário desabilitou notificações por email' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: data.title,
      react: NewsletterEmail(data),
    })

    if (error) {
      console.error('Erro ao enviar newsletter:', error)
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: 'Newsletter enviada!',
      id: emailData?.id,
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, message: 'Erro ao enviar email' }
  }
}

// Email de marketing
export async function sendMarketingEmail(
  userId: string,
  to: string,
  data: {
    name: string
    offerTitle: string
    offerDescription: string
    discount?: string
    originalPrice?: string
    newPrice?: string
    ctaText: string
    ctaUrl: string
    expiresAt?: string
  }
): Promise<EmailResult> {
  // Verificar se usuário permite emails de marketing
  const canSend = await canSendEmail(userId, 'marketing')
  if (!canSend) {
    return { success: false, message: 'Usuário desabilitou emails de marketing' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: `${data.offerTitle} - Oferta Especial FlowTask`,
      react: MarketingEmail(data),
    })

    if (error) {
      console.error('Erro ao enviar email de marketing:', error)
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: 'Email de marketing enviado!',
      id: emailData?.id,
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, message: 'Erro ao enviar email' }
  }
}
