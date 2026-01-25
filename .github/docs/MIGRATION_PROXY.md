<!-- markdownlint-disable -->

# Migração: middleware.ts → proxy.ts (Next.js 16)

## 📌 Resumo da Mudança

No **Next.js 16**, o arquivo `middleware.ts` foi **deprecado** e substituído por `proxy.ts`. Esta mudança visa tornar mais explícito o papel deste arquivo como um **proxy de rede** que intercepta requisições antes delas chegarem às rotas.

## ⚠️ Aviso de Deprecação

```
⚠ The "middleware" file convention is deprecated.
Please use "proxy" instead.
```

## 🔄 O Que Mudou?

### Antes (Next.js 15 e anteriores)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(req) {
  // Lógica de proteção de rotas
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

### Depois (Next.js 16+)

```typescript
// proxy.ts
import { NextResponse } from 'next/server'

export function proxy(req) {
  // Mesma lógica de proteção de rotas
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## 🛠️ Como Migrar

### Opção 1: Migração Automática (Recomendada)

Use o codemod oficial do Next.js:

```bash
npx @next/codemod@latest middleware-to-proxy .
```

Este comando irá:
- ✅ Renomear `middleware.ts` → `proxy.ts`
- ✅ Atualizar a função exportada `middleware` → `proxy`
- ✅ Atualizar configurações experimentais (ex: `middlewarePrefetch` → `proxyPrefetch`)

### Opção 2: Migração Manual

1. **Renomear o arquivo:**
   ```bash
   mv middleware.ts proxy.ts
   # ou
   mv middleware.js proxy.js
   ```

2. **Manter o código igual:**
   - A lógica interna permanece a mesma
   - O `config.matcher` permanece o mesmo
   - Apenas o nome da função muda

3. **Se você exportava função nomeada, não precisa mudar nada!**
   - Se você usa Auth.js (como neste projeto), o export default já está correto

## ✅ Migração Realizada Neste Projeto

### Arquivo Antigo: `middleware.ts`

```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  const protectedRoutes = ['/dashboard', '/account', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
```

### Novo Arquivo: `proxy.ts`

```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  const protectedRoutes = ['/dashboard', '/account', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
```

**Mudança:** Apenas o nome do arquivo! O código permanece **idêntico**.

## 🔐 Auth.js Integration

O **Auth.js v5** já está preparado para funcionar como proxy. A função `auth()` retorna um handler compatível que:

1. Intercepta requisições
2. Verifica a sessão do usuário
3. Adiciona `req.auth` com os dados da sessão
4. Permite lógica customizada de redirecionamento

### Como Funciona

```typescript
import { auth } from "@/auth"

// auth() retorna uma função que pode ser usada diretamente como proxy
export default auth((req) => {
  // req.auth contém a sessão do usuário (ou null se não autenticado)
  const isAuthenticated = !!req.auth

  // Sua lógica de proteção aqui
  if (needsAuth && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})
```

## 🚀 Runtime: Node.js

**Importante:** O `proxy.ts` roda no **Node.js runtime**, não no Edge Runtime.

### Por Quê?

Esta mudança foi motivada pela **CVE-2025-29927**, uma vulnerabilidade onde autenticação em Edge Runtime podia ser contornada sob alta carga.

### Implicações

- ✅ Maior segurança para autenticação
- ✅ Acesso a todas as APIs do Node.js
- ❌ Não pode usar Edge Runtime APIs
- ❌ Pode ter latência ligeiramente maior que Edge

## 📚 Padrões Alternativos

O Next.js 16 também incentiva padrões alternativos para proteção de rotas:

### Layout-based Protection (Recomendado para Auth)

Em vez de um proxy global, você pode proteger rotas usando **layouts**:

```typescript
// app/dashboard/layout.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
```

**Vantagens:**
- ✅ Proteção mais próxima dos dados (React Server Components)
- ✅ Melhor para SEO e performance
- ✅ Evita roundtrips desnecessários

**Quando usar proxy.ts:**
- Redirects otimistas (antes de renderizar)
- Headers customizados globais
- Rate limiting
- Logs de acesso

**Quando usar layout.tsx:**
- Proteção de rotas com autenticação (recomendado)
- Verificações que precisam acessar banco de dados
- Componentes que dependem da sessão

## 🔍 Verificação

Após a migração, certifique-se:

1. ✅ O arquivo `proxy.ts` existe na raiz do projeto
2. ✅ O arquivo `middleware.ts` foi removido
3. ✅ O aviso de deprecação não aparece mais
4. ✅ A proteção de rotas funciona normalmente
5. ✅ Testes passam

### Testar Proteção de Rotas

```bash
# 1. Iniciar servidor
pnpm dev

# 2. Tentar acessar rota protegida sem autenticação
# Deve redirecionar para home com callbackUrl
curl -I http://localhost:3000/dashboard

# 3. Fazer login e tentar novamente
# Deve permitir acesso
```

## 📖 Recursos

### Documentação Oficial
- [Next.js 16: Proxy Migration](https://nextjs.org/docs/app/guides/upgrading/version-16#middleware-to-proxy)
- [Proxy File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16)

### Auth.js
- [Auth.js with Next.js](https://authjs.dev/getting-started/session-management/protecting)
- [Auth.js Middleware](https://authjs.dev/getting-started/session-management/protecting#nextjs-middleware)

### Artigos da Comunidade
- [Goodbye middleware.ts, Hello proxy.ts](https://www.rabinarayanpatra.com/blogs/hello-proxy-ts-nextjs-16)
- [Next.js 16 Update: What Developers Need to Know](https://medium.com/@amitupadhyay878/next-js-16-update-middleware-js-5a020bdf9ca7)
- [Step-by-step Migration Guide](https://medium.com/@szaranger/step-by-step-migration-guide-to-next-js-16-4500da7d27e0)

### Segurança
- [CVE-2025-29927](https://nvd.nist.gov/vuln/detail/CVE-2025-29927) - Vulnerabilidade que motivou a mudança
- [What's New for Auth in Next.js 16](https://auth0.com/blog/whats-new-nextjs-16/)

## ✨ Resumo

| Aspecto | middleware.ts | proxy.ts |
|---------|---------------|----------|
| **Status** | ❌ Deprecado | ✅ Atual |
| **Runtime** | Edge (opcional) | Node.js |
| **Segurança** | Vulnerável sob carga | Seguro |
| **Função** | `middleware()` | `proxy()` |
| **Uso com Auth.js** | ✅ Funciona | ✅ Funciona |
| **Codemod** | - | ✅ Disponível |

---

**Data da Migração:** 2026-01-25
**Next.js Version:** 16.1.4
**Auth.js Version:** 5.0.0-beta.30
