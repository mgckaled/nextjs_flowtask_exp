import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Hr,
  Section,
  Link,
} from '@react-email/components'

interface MarketingEmailProps {
  name: string
  offerTitle: string
  offerDescription: string
  discount?: string
  originalPrice?: string
  newPrice?: string
  ctaText: string
  ctaUrl: string
  expiresAt?: string
  appUrl?: string
}

export function MarketingEmail({
  name,
  offerTitle,
  offerDescription,
  discount,
  originalPrice,
  newPrice,
  ctaText,
  ctaUrl,
  expiresAt,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}: MarketingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{offerTitle} - Oferta especial FlowTask</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <div style={logoContainer}>
              <span style={logoIcon}>✓</span>
            </div>
            <Text style={logoText}>FlowTask</Text>
          </Section>

          {/* Badge de Oferta */}
          {discount && (
            <Section style={discountBadge}>
              <Text style={discountText}>{discount} OFF</Text>
            </Section>
          )}

          {/* Título */}
          <Heading style={h1}>{offerTitle}</Heading>

          <Text style={greeting}>Olá, {name}!</Text>

          <Text style={descriptionText}>{offerDescription}</Text>

          {/* Card de Preços */}
          {(originalPrice || newPrice) && (
            <Section style={priceCard}>
              {originalPrice && (
                <Text style={originalPriceText}>
                  De: <span style={strikethrough}>{originalPrice}</span>
                </Text>
              )}
              {newPrice && (
                <Text style={newPriceText}>Por: {newPrice}</Text>
              )}
              {expiresAt && (
                <Text style={expiresText}>
                  ⏰ Oferta válida até {expiresAt}
                </Text>
              )}
            </Section>
          )}

          {/* Benefícios */}
          <Section style={benefitsSection}>
            <Text style={benefitsTitle}>O que você ganha:</Text>
            <Text style={benefitItem}>🚀 Produtividade turbinada</Text>
            <Text style={benefitItem}>📊 Relatórios detalhados</Text>
            <Text style={benefitItem}>🤝 Colaboração ilimitada</Text>
            <Text style={benefitItem}>🔒 Segurança empresarial</Text>
            <Text style={benefitItem}>💬 Suporte prioritário</Text>
          </Section>

          {/* CTA */}
          <Section style={buttonSection}>
            <Button href={ctaUrl} style={button}>
              {ctaText}
            </Button>
          </Section>

          {expiresAt && (
            <Text style={urgencyText}>
              Não perca essa oportunidade! A oferta expira em breve.
            </Text>
          )}

          <Hr style={divider} />

          {/* Footer */}
          <Text style={footer}>
            Você está recebendo este email porque optou por receber emails de
            marketing.{' '}
            <Link href={`${appUrl}/account`} style={footerLink}>
              Cancelar inscrição
            </Link>
          </Text>

          <Text style={footerSmall}>
            © {new Date().getFullYear()} FlowTask. Todos os direitos reservados.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '48px 24px',
  maxWidth: '580px',
}

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const logoContainer = {
  display: 'inline-block',
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
  textAlign: 'center' as const,
  lineHeight: '48px',
}

const logoIcon = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold' as const,
}

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#9333ea',
  margin: '12px 0 0',
}

const discountBadge = {
  textAlign: 'center' as const,
  marginBottom: '16px',
}

const discountText = {
  display: 'inline-block',
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  padding: '8px 20px',
  borderRadius: '20px',
  margin: '0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700' as const,
  lineHeight: '1.3',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const greeting = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '500' as const,
  margin: '0 0 16px',
}

const descriptionText = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const priceCard = {
  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const originalPriceText = {
  color: '#a1a1aa',
  fontSize: '16px',
  margin: '0 0 8px',
}

const strikethrough = {
  textDecoration: 'line-through',
}

const newPriceText = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: 'bold' as const,
  margin: '0 0 12px',
}

const expiresText = {
  color: '#fbbf24',
  fontSize: '14px',
  fontWeight: '500' as const,
  margin: '0',
}

const benefitsSection = {
  backgroundColor: '#18181b',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 24px',
}

const benefitsTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '0 0 16px',
}

const benefitItem = {
  color: '#a1a1aa',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 8px',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
  color: '#ffffff',
  padding: '16px 40px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '700' as const,
  fontSize: '18px',
  display: 'inline-block',
}

const urgencyText = {
  color: '#fbbf24',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  fontWeight: '500' as const,
}

const divider = {
  borderColor: '#27272a',
  margin: '32px 0',
}

const footer = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#9333ea',
  textDecoration: 'underline',
}

const footerSmall = {
  color: '#52525b',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
}

export default MarketingEmail
