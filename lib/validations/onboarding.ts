import { z } from 'zod'

// Regex para telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/

export const companySizeOptions = [
  { value: '1-10', label: '1-10 funcionários' },
  { value: '11-50', label: '11-50 funcionários' },
  { value: '51-200', label: '51-200 funcionários' },
  { value: '201-500', label: '201-500 funcionários' },
  { value: '500+', label: 'Mais de 500 funcionários' },
] as const

export const howDidYouHearOptions = [
  { value: 'google', label: 'Pesquisa no Google' },
  { value: 'social_media', label: 'Redes Sociais' },
  { value: 'referral', label: 'Indicação' },
  { value: 'other', label: 'Outro' },
] as const

export const industryOptions = [
  { value: 'technology', label: 'Tecnologia' },
  { value: 'finance', label: 'Finanças e Bancos' },
  { value: 'healthcare', label: 'Saúde' },
  { value: 'education', label: 'Educação' },
  { value: 'retail', label: 'Varejo' },
  { value: 'manufacturing', label: 'Indústria' },
  { value: 'consulting', label: 'Consultoria' },
  { value: 'marketing', label: 'Marketing e Publicidade' },
  { value: 'real_estate', label: 'Imobiliário' },
  { value: 'other', label: 'Outro' },
] as const

export const onboardingSchema = z.object({
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(phoneRegex, 'Formato inválido. Use: (XX) XXXXX-XXXX'),
  jobTitle: z
    .string()
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(100, 'Cargo deve ter no máximo 100 caracteres'),
  company: z
    .string()
    .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
    .max(150, 'Nome da empresa deve ter no máximo 150 caracteres'),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    message: 'Selecione o tamanho da empresa',
  }),
  industry: z
    .string()
    .min(1, 'Selecione o setor de atuação'),
  howDidYouHear: z.enum(['google', 'social_media', 'referral', 'other'], {
    message: 'Selecione como conheceu o FlowTask',
  }),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
