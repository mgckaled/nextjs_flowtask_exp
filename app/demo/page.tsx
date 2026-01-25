import type { Metadata } from 'next'
import DemoPageContent from '../components/demo/DemoPageContent'

export const metadata: Metadata = {
  title: 'Demo Interativa | FlowTask',
  description: 'Experimente o FlowTask em ação. Demonstração interativa completa da nossa plataforma de gestão de projetos.',
}

export default function DemoPage() {
  return <DemoPageContent />
}
