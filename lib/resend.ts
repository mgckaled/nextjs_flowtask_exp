import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Para testes sem domínio verificado, use: 'FlowTask <onboarding@resend.dev>'
// Com domínio verificado, use: 'FlowTask <noreply@seudominio.com>'
export const EMAIL_FROM = process.env.EMAIL_FROM || 'FlowTask <onboarding@resend.dev>'
