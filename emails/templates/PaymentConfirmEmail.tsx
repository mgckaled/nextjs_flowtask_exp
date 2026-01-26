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
  Row,
  Column,
} from '@react-email/components'

interface PaymentConfirmEmailProps {
  name: string
  plan: 'pro' | 'max'
  amount: string
  date: string
  nextBillingDate?: string
  appUrl?: string
}

export function PaymentConfirmEmail({
  name,
  plan,
  amount,
  date,
  nextBillingDate,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}: PaymentConfirmEmailProps) {
  const planName = plan === 'pro' ? 'Pro' : 'Max'
  const planColor = plan === 'pro' ? '#9333ea' : '#f59e0b'

  return (
    <Html>
      <Head />
      <Preview>Pagamento confirmado - Plano {planName} FlowTask</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <div style={logoContainer}>
              <span style={logoIcon}>✓</span>
            </div>
            <Text style={logoText}>FlowTask</Text>
          </Section>

          {/* Badge de Sucesso */}
          <Section style={successBadge}>
            <Text style={successIcon}>✓</Text>
            <Text style={successText}>Pagamento Confirmado</Text>
          </Section>

          {/* Conteúdo Principal */}
          <Heading style={h1}>Obrigado, {name}!</Heading>

          <Text style={text}>
            Seu pagamento foi processado com sucesso. Agora você tem acesso
            completo a todos os recursos do plano{' '}
            <span style={{ color: planColor, fontWeight: 'bold' }}>{planName}</span>.
          </Text>

          {/* Detalhes do Pagamento */}
          <Section style={detailsCard}>
            <Text style={detailsTitle}>Detalhes da Compra</Text>

            <Row style={detailRow}>
              <Column style={detailLabel}>Plano</Column>
              <Column style={detailValue}>FlowTask {planName}</Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>Valor</Column>
              <Column style={detailValue}>{amount}</Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>Data</Column>
              <Column style={detailValue}>{date}</Column>
            </Row>

            {nextBillingDate && (
              <Row style={detailRow}>
                <Column style={detailLabel}>Próxima cobrança</Column>
                <Column style={detailValue}>{nextBillingDate}</Column>
              </Row>
            )}
          </Section>

          {/* Recursos do Plano */}
          <Text style={sectionTitle}>O que está incluso no seu plano:</Text>

          <Section style={featuresSection}>
            {plan === 'pro' ? (
              <>
                <Text style={featureItem}>✓ Tarefas ilimitadas</Text>
                <Text style={featureItem}>✓ Projetos ilimitados</Text>
                <Text style={featureItem}>✓ Colaboração em equipe (até 10 membros)</Text>
                <Text style={featureItem}>✓ Integrações avançadas</Text>
                <Text style={featureItem}>✓ Suporte prioritário</Text>
              </>
            ) : (
              <>
                <Text style={featureItem}>✓ Tudo do plano Pro</Text>
                <Text style={featureItem}>✓ Membros ilimitados</Text>
                <Text style={featureItem}>✓ Automações avançadas</Text>
                <Text style={featureItem}>✓ API completa</Text>
                <Text style={featureItem}>✓ Suporte dedicado 24/7</Text>
                <Text style={featureItem}>✓ Treinamento personalizado</Text>
              </>
            )}
          </Section>

          <Section style={buttonSection}>
            <Button href={`${appUrl}/dashboard`} style={button}>
              Acessar o Dashboard
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Text style={footer}>
            Você pode gerenciar sua assinatura a qualquer momento nas
            configurações da sua conta.
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

const successBadge = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const successIcon = {
  display: 'inline-block',
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#22c55e',
  color: '#ffffff',
  fontSize: '32px',
  lineHeight: '64px',
  textAlign: 'center' as const,
  margin: '0 0 12px',
}

const successText = {
  color: '#22c55e',
  fontSize: '18px',
  fontWeight: '600' as const,
  margin: '0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700' as const,
  lineHeight: '1.4',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const text = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const detailsCard = {
  backgroundColor: '#18181b',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const detailsTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '0 0 16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #27272a',
}

const detailRow = {
  marginBottom: '12px',
}

const detailLabel = {
  color: '#71717a',
  fontSize: '14px',
  width: '50%',
}

const detailValue = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500' as const,
  textAlign: 'right' as const,
  width: '50%',
}

const sectionTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '24px 0 16px',
}

const featuresSection = {
  backgroundColor: '#18181b',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '0 0 24px',
}

const featureItem = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 8px',
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

export default PaymentConfirmEmail
