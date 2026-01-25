<!-- markdownlint-disable -->


# Plano: Sistema de OAuth com Google e GitHub (Drizzle ORM)

## Resumo
Implementar autenticação OAuth usando **Auth.js v5** (NextAuth) com **Drizzle ORM** e Google/GitHub como provedores. Adicionar header global com botões de login/logout e integrar autenticação nos botões CTA existentes.

## Stack Escolhida

### Auth.js v5 + Drizzle ORM + Vercel Postgres
- **Auth.js v5**: Autenticação moderna para Next.js App Router
- **Drizzle ORM**: ORM TypeScript type-safe, leve e performático
- **Vercel Postgres**: Database serverless com free tier (256MB, 60h compute)
- **@auth/drizzle-adapter**: Adapter oficial para integração

### Por quê Drizzle?
- Type-safe queries com inferência automática
- Melhor performance que Prisma (zero overhead)
- Migrations mais flexíveis e controláveis
- Menor bundle size
- SQL-like API mais próxima do metal

## Arquitetura

```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts          # Auth.js handlers (GET, POST)
├── components/
│   └── shared/
│       ├── Header.tsx             # NOVO: Header global com auth buttons
│       └── UserButton.tsx         # NOVO: Avatar/dropdown do usuário
├── layout.tsx                     # Adicionar SessionProvider + Header
└── auth.ts                        # NOVO: Configuração Auth.js (root)

db/
├── schema.ts                      # NOVO: Schema Drizzle (users, accounts, sessions)
└── index.ts                       # NOVO: Drizzle client singleton

drizzle/
└── [migrations]/                  # NOVO: Pasta de migrations auto-geradas

middleware.ts                      # NOVO: Proteção de rotas (opcional)
drizzle.config.ts                  # NOVO: Config do Drizzle Kit
```

## Schema Drizzle (PostgreSQL)

Baseado no schema padrão do Auth.js:

```typescript
// db/schema.ts
import { pgTable, text, timestamp, uuid, integer, primaryKey } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable("accounts", {
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compositePk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}))

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
}))
```

## Arquivos Críticos

### 1. Criar Novos Arquivos

**`db/schema.ts`**
- Schema completo com users, accounts, sessions, verificationTokens
- Tipos inferidos automaticamente

**`db/index.ts`**
- Singleton do Drizzle client (previne múltiplas conexões em dev)
- Connection string via `POSTGRES_URL`

**`drizzle.config.ts`**
- Configuração do Drizzle Kit para migrations
- Apontar para `db/schema.ts`

**`auth.ts`** (root)
- Configurar NextAuth com DrizzleAdapter
- Providers: Google e GitHub
- Callbacks para sessão customizada

**`app/api/auth/[...nextauth]/route.ts`**
- Exportar `handlers` (GET, POST)

**`app/components/shared/Header.tsx`**
- Header responsivo com logo
- Botões: "Entrar" e "Criar Conta" (não autenticado)
- `<UserButton />` (autenticado)
- Sticky com backdrop blur

**`app/components/shared/UserButton.tsx`**
- Avatar com imagem do OAuth
- Dropdown: Nome, Email, Sair
- Animações com Framer Motion

**`middleware.ts`** (opcional)
- Proteger rotas como `/dashboard`, `/account`

**`.env.local`** (CRIAR - não commitar)
```env
# Auth.js
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_URL=http://localhost:3000

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# GitHub OAuth
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Database
POSTGRES_URL=                   # Vercel Postgres URL
```

**`.env.example`** (CRIAR - commitar)
- Template sem valores sensíveis

### 2. Modificar Arquivos Existentes

**`package.json`**
- Adicionar: `next-auth@beta`, `@auth/drizzle-adapter`
- Adicionar: `drizzle-orm`, `drizzle-kit` (dev), `@neondatabase/serverless` ou `postgres`

**`app/layout.tsx`** (linha ~27)
- Adicionar `<SessionProvider>` wrapper (client component)
- Adicionar `<Header />` antes de `{children}`

**`app/components/home/HomePageContent.tsx`** (linha 48-55)
- Botão "Começar Gratuitamente" → `signIn()` com modal/redirect

**`app/components/demo/DemoPageContent.tsx`** (linha 257-264)
- Botão "Criar Conta Grátis" → `signIn()`

**`app/components/pricing/PricingCard.tsx`** (linha 25-27)
- `handleSubscribe` → verificar auth antes (`useSession`)

**`.gitignore`**
- Garantir `.env.local` ignorado

## Fluxo de Autenticação

### 1. Usuário Clica "Entrar" / "Criar Conta"
```typescript
'use client'
import { signIn } from 'next-auth/react'

<button onClick={() => signIn('google', { callbackUrl: '/' })}>
  Entrar com Google
</button>

<button onClick={() => signIn('github', { callbackUrl: '/' })}>
  Entrar com GitHub
</button>
```

### 2. Callback OAuth
- Auth.js redireciona para Google/GitHub
- Usuário autoriza
- Callback para `/api/auth/callback/[provider]`
- DrizzleAdapter cria/atualiza User, Account, Session no DB

### 3. Acesso à Sessão

**Client Component:**
```typescript
'use client'
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()
// status: 'loading' | 'authenticated' | 'unauthenticated'
```

**Server Component:**
```typescript
import { auth } from '@/auth'

const session = await auth()
if (!session?.user) redirect('/login')
```

## Dependências

```bash
pnpm add next-auth@beta @auth/drizzle-adapter drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

**Versões:**
- `next-auth`: ^5.0.0-beta
- `@auth/drizzle-adapter`: latest
- `drizzle-orm`: ^0.36.0+
- `drizzle-kit`: ^0.31.0+
- `@neondatabase/serverless`: latest (compatível com Vercel Postgres)

## Design do Header

### Estado Não Autenticado
```
[Logo FlowTask]                    [Entrar] [Criar Conta Grátis]
```

### Estado Autenticado
```
[Logo FlowTask]                              [Avatar ▼]
                                              ├─ João Silva
                                              ├─ joao@email.com
                                              ├─ ─────────
                                              └─ Sair
```

**Estilos:**
- Header fixo/sticky no topo
- Background: `bg-background/80 backdrop-blur-md`
- Border bottom: `border-b border-border`
- Altura: `h-16`
- Padding: `px-4 md:px-8`
- Animações: Framer Motion (fade in, scale)

## Steps de Implementação

### Fase 1: Setup Base
1. ✅ Instalar dependências
2. ✅ Criar `.env.local` com placeholders
3. ✅ Criar schema Drizzle (`db/schema.ts`)
4. ✅ Criar Drizzle client (`db/index.ts`)
5. ✅ Configurar `drizzle.config.ts`
6. ⏳ Setup Vercel Postgres (via dashboard)
7. ⏳ Rodar migrations: `pnpm drizzle-kit push`

### Fase 2: Configurar Auth.js
8. ✅ Criar `auth.ts` com DrizzleAdapter
9. ✅ Criar route handler `app/api/auth/[...nextauth]/route.ts`
10. ⏳ Configurar Google OAuth (console.cloud.google.com)
11. ⏳ Configurar GitHub OAuth (github.com/settings/developers)
12. ⏳ Adicionar credenciais no `.env.local`

### Fase 3: UI Components
13. ✅ Criar `Header.tsx`
14. ✅ Criar `UserButton.tsx`
15. ✅ Criar Provider wrapper client component
16. ✅ Adicionar Header no `layout.tsx`

### Fase 4: Integrar Botões Existentes
17. ✅ Modificar `HomePageContent.tsx`
18. ✅ Modificar `DemoPageContent.tsx`
19. ✅ Modificar `PricingCard.tsx`

### Fase 5: Proteção de Rotas (Opcional)
20. ✅ Criar `middleware.ts`
21. ✅ Testar fluxo completo

## Configuração OAuth

### Google Cloud Console
1. https://console.cloud.google.com/
2. Criar projeto ou selecionar existente
3. Habilitar "Google+ API"
4. Criar OAuth 2.0 Client ID
5. Authorized redirect URIs:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://yourdomain.com/api/auth/callback/google`
6. Copiar Client ID e Secret → `.env.local`

### GitHub Developer Settings
1. https://github.com/settings/developers
2. New OAuth App
3. Application name: "FlowTask"
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL:
   - Dev: `http://localhost:3000/api/auth/callback/github`
   - Prod: `https://yourdomain.com/api/auth/callback/github`
6. Copiar Client ID e Secret → `.env.local`

## Migrations com Drizzle Kit

### Gerar Migration
```bash
pnpm drizzle-kit generate
```

### Push para DB (sem migrations)
```bash
pnpm drizzle-kit push
```

### Rodar Migration
```bash
pnpm drizzle-kit migrate
```

### Drizzle Studio (GUI)
```bash
pnpm drizzle-kit studio
```

## Segurança

- ✅ `AUTH_SECRET` forte (32+ caracteres)
- ✅ HTTPS obrigatório em produção
- ✅ Cookies httpOnly e secure (built-in Auth.js)
- ✅ CSRF protection (built-in)
- ✅ `.env.local` no `.gitignore`
- ✅ Validação de email no callback (se necessário)

## Verificação

### Checklist de Testes
- [ ] Login com Google funciona
- [ ] Login com GitHub funciona
- [ ] Usuário criado no DB (verificar via Drizzle Studio)
- [ ] Session persiste após reload
- [ ] Avatar e nome aparecem no Header
- [ ] Dropdown funciona
- [ ] Logout limpa sessão
- [ ] Dark mode funciona
- [ ] Responsivo (mobile/desktop)
- [ ] Redirecionamento após login funciona

### Verificar Database
```bash
pnpm drizzle-kit studio
# Abre GUI em http://localhost:4983
```

### Debug Mode
```typescript
// auth.ts
export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  // ...
})
```

## Diferenças Prisma vs Drizzle

| Aspecto | Prisma | Drizzle |
|---------|--------|---------|
| Migrations | Auto-geradas | Mais controle manual |
| Type Safety | Schema próprio | TypeScript nativo |
| Performance | Client overhead | Zero overhead |
| Bundle Size | ~300kb | ~50kb |
| SQL Control | Abstrato | SQL-like (mais controle) |
| Dev Tools | Prisma Studio | Drizzle Studio |

## Melhorias Futuras (Fora do Escopo)

- Email/password authentication
- Magic link login
- Two-factor authentication
- Role-based access control (RBAC)
- User profile page
- Delete account

## Estimativa

- Setup inicial: ~1h
- Auth.js config: ~30min
- UI Components: ~1.5h
- Integração: ~30min
- Testes: ~30min
- **TOTAL: ~4h**

---

**Pronto para implementação com Drizzle ORM!** 🚀
