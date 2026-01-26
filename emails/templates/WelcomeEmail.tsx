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

interface WelcomeEmailProps {
  name: string
  appUrl?: string
}

export function WelcomeEmail({
  name,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao FlowTask - Sua jornada de produtividade começa agora!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <div style={logoContainer}>
              <span style={logoIcon}>✓</span>
            </div>
            <Text style={logoText}>FlowTask</Text>
          </Section>

          {/* Conteúdo Principal */}
          <Heading style={h1}>Bem-vindo ao FlowTask, {name}!</Heading>

          <Text style={text}>
            Estamos muito felizes em ter você conosco! O FlowTask foi criado para
            ajudar você a organizar suas tarefas e aumentar sua produtividade.
          </Text>

          <Text style={text}>
            Com o FlowTask, você pode:
          </Text>

          <Section style={featuresSection}>
            <Text style={featureItem}>📋 Criar e organizar tarefas de forma intuitiva</Text>
            <Text style={featureItem}>🎯 Definir prioridades e prazos</Text>
            <Text style={featureItem}>📊 Acompanhar seu progresso em tempo real</Text>
            <Text style={featureItem}>🤝 Colaborar com sua equipe</Text>
          </Section>

          <Text style={text}>
            Para começar, complete seu perfil e explore todas as funcionalidades
            disponíveis no seu plano.
          </Text>

          <Section style={buttonSection}>
            <Button href={`${appUrl}/dashboard`} style={button}>
              Acessar o Dashboard
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Text style={footer}>
            Precisa de ajuda? Entre em contato conosco respondendo este email
            ou acessando nossa{' '}
            <Link href={`${appUrl}/help`} style={link}>
              central de ajuda
            </Link>.
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
  background: 'linear-gradient(to right, #9333ea, #ec4899)',
  WebkitBackgroundClip: 'text',
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

const text = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const featuresSection = {
  backgroundColor: '#18181b',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const featureItem = {
  color: '#ffffff',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px',
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
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const footerSmall = {
  color: '#52525b',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
}

const link = {
  color: '#9333ea',
  textDecoration: 'underline',
}

export default WelcomeEmail
