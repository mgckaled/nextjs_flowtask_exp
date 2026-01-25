import type { Metadata } from 'next'
import HomePageContent from './components/home/HomePageContent'

export const metadata: Metadata = {
  title: 'FlowTask | Gestão de Projetos Simplificada',
  description: 'Gerencie projetos, tarefas e equipes com simplicidade e inteligência. Aumente a produtividade do seu time.',
}

export default function Home() {
  return <HomePageContent />
}
