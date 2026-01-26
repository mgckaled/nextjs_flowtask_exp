# Plano: Integração Stripe + Fluxo de Pricing

## Resumo

Implementação completa do fluxo de checkout com Stripe (modo teste), incluindo:
- Verificação de autenticação e onboarding antes do checkout
- Header com navegação central e botão "Upgrade Pro"
- Integração real com Stripe Checkout (hosted)
- Webhooks para sincronização de dados
- Tabela de subscriptions no banco

---

## 1. Fluxo de Checkout

```
Clica em botão de Pricing/Upgrade
         ↓
    Está logado?
    ├── NÃO → Login → volta para /pricing?plan=X
    └── SIM → Completou onboarding?
              ├── NÃO → /onboarding → /checkout?plan=X
              └── SIM → Cria Session → Stripe Checkout
                        ↓
                   Sucesso → /checkout/success
                   Cancelou → /pricing
```

---

## 2. Novo Header (Navegação Central + Upgrade)

### Não logado:
```
[Logo]    [Pricing] [Demo]    [ThemeToggle] [Entrar] [Criar Conta]
```

### Logado (plano Free):
```
[Logo]    [Dashboard] [Pricing]    [ThemeToggle] [⚡ Upgrade Pro] [UserButton]
```

### Logado (plano pago):
```
[Logo]    [Dashboard] [Pricing]    [ThemeToggle] [UserButton]
```

---

## 3. Arquivos a Criar

```
app/
├── checkout/
│   ├── page.tsx                    # Página intermediária
│   └── success/
│       └── page.tsx                # Sucesso pós-pagamento
├── api/
│   └── stripe/
│       ├── create-checkout/
│       │   └── route.ts            # Cria Checkout Session
│       └── webhook/
│           └── route.ts            # Recebe eventos Stripe
lib/
└── stripe.ts                       # Cliente Stripe
```

---

## 4. Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `db/schema.ts` | Tabela subscriptions |
| `auth.ts` | Adicionar plan na session |
| `PricingCard.tsx` | Verificação login/onboarding |
| `Header.tsx` | Navegação central + Upgrade |
| `onboarding/page.tsx` | Aceitar callbackUrl |
| `.env.example` | Variáveis Stripe |

---

## 5. Schema Subscriptions

```typescript
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
```

---

## 6. Dependências

```bash
pnpm add stripe @stripe/stripe-js
```

---

## 7. Variáveis de Ambiente

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_MAX=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 8. Ordem de Implementação

1. Instalar dependências (`stripe`, `@stripe/stripe-js`)
2. Criar `lib/stripe.ts`
3. Adicionar tabela `subscriptions` + migration
4. Atualizar `auth.ts` (plan na session)
5. Atualizar `Header.tsx` (navegação + Upgrade)
6. Atualizar `PricingCard.tsx` (verificações)
7. Atualizar `onboarding/page.tsx` (callbackUrl)
8. Criar `/checkout/page.tsx`
9. Criar `/api/stripe/create-checkout`
10. Criar `/checkout/success/page.tsx`
11. Criar `/api/stripe/webhook`
12. Atualizar `.env.example`

---

## 9. Verificação

- [ ] Usuário não logado → login → volta para pricing
- [ ] Usuário sem onboarding → onboarding → checkout
- [ ] Usuário pronto → Stripe Checkout → success
- [ ] Header mostra "Upgrade" apenas para Free
- [ ] Webhook atualiza subscription no DB
- [ ] Cartão teste 4242... funciona
