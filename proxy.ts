import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Rotas públicas - não requerem autenticação
  const publicRoutes = ['/', '/demo', '/pricing']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Rotas públicas - qualquer um pode acessar
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Se não está logado e tenta acessar rota protegida, redireciona para home
  if (!isAuthenticated) {
    const loginUrl = new URL('/', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário logado - verifica perfil de onboarding
  const hasCompletedProfile = req.auth?.user?.hasCompletedProfile
  const isOnboardingPage = pathname === '/onboarding'
  const isDashboardPage = pathname.startsWith('/dashboard')
  const isAccountPage = pathname.startsWith('/account')
  const requiresProfile = isDashboardPage || isAccountPage

  // Se está no onboarding mas já completou perfil, vai pro dashboard
  if (isOnboardingPage && hasCompletedProfile) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Se tenta acessar páginas que requerem perfil sem completá-lo, vai pro onboarding
  if (requiresProfile && !hasCompletedProfile) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  return NextResponse.next()
})

// Rotas onde o proxy deve ser executado
export const config = {
  matcher: [
    '/((?!api/auth|api/stripe|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}
