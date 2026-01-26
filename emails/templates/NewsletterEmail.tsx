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

interface NewsletterEmailProps {
  name: string
  title: string
  previewText: string
  content: {
    heading: string
    description: string
    ctaText?: string
    ctaUrl?: string
  }[]
  appUrl?: string
}

export function NewsletterEmail({
  name,
  title,
  previewText,
  content,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <div style={logoContainer}>
              <span style={logoIcon}>✓</span>
            </div>
            <Text style={logoText}>FlowTask</Text>
          </Section>

          {/* Título */}
          <Heading style={h1}>{title}</Heading>

          <Text style={greeting}>Olá, {name}!</Text>

          <Text style={introText}>
            Temos novidades incríveis para compartilhar com você. Confira as
            últimas atualizações e dicas para aumentar sua produtividade:
          </Text>

          {/* Seções de Conteúdo */}
          {content.map((item, index) => (
            <Section key={index} style={contentCard}>
              <Text style={contentHeading}>{item.heading}</Text>
              <Text style={contentDescription}>{item.description}</Text>
              {item.ctaText && item.ctaUrl && (
                <Link href={item.ctaUrl} style={contentLink}>
                  {item.ctaText} →
                </Link>
              )}
            </Section>
          ))}

          {/* Dica de Produtividade */}
          <Section style={tipSection}>
            <Text style={tipLabel}>💡 Dica de Produtividade</Text>
            <Text style={tipText}>
              Use a técnica Pomodoro: trabalhe focado por 25 minutos e faça uma
              pausa de 5 minutos. Após 4 ciclos, faça uma pausa maior de 15-30
              minutos. O FlowTask pode ajudar você a organizar suas tarefas
              para cada ciclo!
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button href={`${appUrl}/dashboard`} style={button}>
              Ver Mais no Dashboard
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Text style={footer}>
            Você está recebendo este email porque habilitou as notificações
            por email nas suas preferências.{' '}
            <Link href={`${appUrl}/account`} style={footerLink}>
              Gerenciar preferências
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
  marginBottom: '32px',
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

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700' as const,
  lineHeight: '1.4',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const greeting = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '500' as const,
  margin: '0 0 8px',
}

const introText = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px',
}

const contentCard = {
  backgroundColor: '#18181b',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '16px',
  borderLeft: '4px solid #9333ea',
}

const contentHeading = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600' as const,
  margin: '0 0 12px',
}

const contentDescription = {
  color: '#a1a1aa',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const contentLink = {
  color: '#9333ea',
  fontSize: '14px',
  fontWeight: '500' as const,
  textDecoration: 'none',
}

const tipSection = {
  backgroundColor: '#1e1b4b',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const tipLabel = {
  color: '#a78bfa',
  fontSize: '14px',
  fontWeight: '600' as const,
  margin: '0 0 8px',
}

const tipText = {
  color: '#c4b5fd',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#9333ea',
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '600' as const,
  fontSize: '16px',
  display: 'inline-block',
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

export default NewsletterEmail
