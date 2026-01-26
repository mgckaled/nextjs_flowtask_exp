# Plano: Fluxo de Onboarding para Usuários

## Visão Geral

Criar fluxo de onboarding para usuários logados com formulário multi-step usando React Hook Form + Zod, salvando dados no banco via Drizzle ORM.

## Estrutura de Arquivos

```
app/
├── onboarding/
│   └── page.tsx                    # Página de onboarding protegida
├── dashboard/
│   └── page.tsx                    # Dashboard placeholder
├── actions/
│   └── onboarding.ts               # Server Action para salvar perfil
└── components/
    └── onboarding/
        ├── OnboardingForm.tsx      # Formulário principal multi-step
        ├── OnboardingProgress.tsx  # Indicador de progresso
        └── FormFields/
            ├── PhoneInput.tsx      # Input com máscara de telefone
            ├── SelectField.tsx     # Select reutilizável
            └── TextField.tsx       # Input de texto reutilizável
db/
└── schema.ts                       # MODIFICAR: adicionar userProfiles
lib/
└── validations/
    └── onboarding.ts               # Schema Zod
types/
└── next-auth.d.ts                  # Tipos extendidos da session
middleware.ts                       # Verificação de perfil completo
auth.ts                             # MODIFICAR: callback session
```

## Schema Drizzle - user_profiles

```typescript
// db/schema.ts - ADICIONAR

export const companySizeEnum = pgEnum('company_size', [
  '1-10', '11-50', '51-200', '201-500', '500+'
])

export const howDidYouHearEnum = pgEnum('how_did_you_hear', [
  'google', 'social_media', 'referral', 'other'
])

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique()
    .references(() => users.id, { onDelete: "cascade" }),
  phone: text("phone").notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  companySize: companySizeEnum("company_size").notNull(),
  industry: text("industry").notNull(),
  howDidYouHear: howDidYouHearEnum("how_did_you_hear").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})
```

## Campos do Formulário

| Campo | Tipo | Validação |
|-------|------|-----------|
| phone | text | Regex `(XX) XXXXX-XXXX` |
| jobTitle | text | min 2, max 100 chars |
| company | text | min 2, max 150 chars |
| companySize | enum | 1-10, 11-50, 51-200, 201-500, 500+ |
| industry | text | Seleção de lista |
| howDidYouHear | enum | google, social_media, referral, other |

## Fluxo de Verificação

```
Login OAuth → Callback NextAuth → Verifica user_profiles
                                        ↓
                          Perfil existe? → SIM → /dashboard
                                        → NÃO → /onboarding
                                                    ↓
                                        Preenche formulário multi-step
                                                    ↓
                                        Submit → Server Action → DB
                                                    ↓
                                              /dashboard
```

## Dependências

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

## Ordem de Implementação

### Fase 1: Infraestrutura
1. Instalar dependências
2. Adicionar schema `user_profiles` em `db/schema.ts`
3. Rodar migration: `pnpm drizzle-kit generate && pnpm drizzle-kit push`
4. Criar `types/next-auth.d.ts`
5. Modificar `auth.ts` - adicionar `hasCompletedProfile` na session

### Fase 2: Validação e Actions
6. Criar `lib/validations/onboarding.ts` (schema Zod)
7. Criar `app/actions/onboarding.ts` (Server Action)

### Fase 3: Componentes
8. Criar `FormFields/TextField.tsx`
9. Criar `FormFields/SelectField.tsx`
10. Criar `FormFields/PhoneInput.tsx`
11. Criar `OnboardingProgress.tsx`
12. Criar `OnboardingForm.tsx`

### Fase 4: Páginas
13. Criar `app/onboarding/page.tsx`
14. Criar `app/dashboard/page.tsx`

### Fase 5: Proteção de Rotas
15. Criar `middleware.ts`

## Arquivos Críticos a Modificar

- `db/schema.ts` - Adicionar tabela e enums
- `auth.ts` - Callback session com hasCompletedProfile

## Verificação

1. Fazer login com Google/GitHub
2. Verificar redirecionamento para `/onboarding`
3. Preencher formulário em 3 steps
4. Verificar dados salvos no banco (Drizzle Studio)
5. Verificar redirecionamento para `/dashboard`
6. Fazer logout e login novamente
7. Verificar que vai direto para `/dashboard` (sem onboarding)
