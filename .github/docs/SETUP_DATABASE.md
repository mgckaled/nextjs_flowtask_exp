<!-- markdownlint-disable -->

# Guia Completo: Configurar Vercel Postgres (Neon)

## 💰 É Gratuito? SIM!

**Resumo rápido:**
- ✅ **Free tier generoso:** 3 GB de dados + 60 horas de compute/mês
- ✅ **Sem cartão de crédito necessário** (para plano Hobby)
- ✅ **Perfeito para desenvolvimento e projetos pequenos**
- ✅ **Faturamento unificado pela Vercel** (não precisa conta Neon separada)

## 📊 Limites do Free Tier (Neon - 2026)

| Recurso | Free Tier (Hobby) |
|---------|-------------------|
| **Projetos** | 1 projeto |
| **Branches** | 10 branches |
| **Armazenamento** | 3 GB por branch |
| **RAM** | 1 GB (shared compute) |
| **Compute Hours** | 60 horas/mês (Hobby) ou 100 horas/mês (Pro) |
| **Custo** | **$0** |

**Nota:** 60 horas de compute = ~2 horas/dia de uso contínuo, mais que suficiente para desenvolvimento!

## 🔄 Importante: Transição Vercel → Neon

**Desde Q4 2024/Q1 2025**, a Vercel migrou todos os databases Postgres para usar **Neon** como backend. Isso significa:

- ✅ Melhor performance e mais features
- ✅ Interface mais moderna (Neon Console)
- ✅ Faturamento continua pela Vercel (sem surpresas)
- ✅ Limites mais generosos no free tier

## 📋 Pré-requisitos

- Conta Vercel (gratuita)
- Projeto Next.js no Vercel (ou criar um novo)

---

## 🚀 Opção 1: Criar Database via Vercel Dashboard (Recomendada)

### Passo 1: Acessar o Vercel Dashboard

1. Acesse https://vercel.com/dashboard
2. Faça login na sua conta

### Passo 2: Navegar para Storage

1. No menu lateral esquerdo, clique em **"Storage"**
2. Ou vá direto: https://vercel.com/dashboard/stores

### Passo 3: Criar Novo Database

1. Clique no botão **"Create Database"** ou **"Browse Marketplace"**
2. Você verá várias opções de storage. Localize **"Postgres"** (powered by Neon)
3. Clique em **"Postgres"** ou em um dos providers (ex: Neon)

### Passo 4: Configurar o Database

**Nome do Database:**
- Digite um nome descritivo: `flowtask-db` (ou nome de sua preferência)

**Região:**
- Selecione a região mais próxima de você:
  - **us-east-1** (Virginia, EUA) - Boa para Brasil
  - **eu-west-1** (Dublin, Europa)
  - **ap-southeast-1** (Singapura, Ásia)

**Plano:**
- Selecione **"Hobby"** (gratuito)
- Você verá os limites: 3 GB storage, 60h compute

**Projeto (opcional):**
- Você pode vincular a um projeto específico agora
- Ou fazer isso depois

### Passo 5: Criar Database

1. Clique em **"Create"** ou **"Create Database"**
2. Aguarde alguns segundos enquanto o database é provisionado
3. Você será redirecionado para a página do database

### Passo 6: Conectar ao Projeto

#### Se você já vinculou ao criar:
- As variáveis de ambiente já foram adicionadas automaticamente! ✅

#### Se não vinculou ainda:
1. Na página do database, clique em **"Connect Project"**
2. Selecione seu projeto Next.js da lista
3. Clique em **"Connect"**
4. As variáveis serão automaticamente injetadas no projeto

### Passo 7: Copiar Connection String

Na página do database, você verá várias variáveis de ambiente:

```env
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

**Para este projeto (usando Drizzle + Neon):**
- Copie a variável **`POSTGRES_URL`**

### Passo 8: Adicionar ao .env.local

1. Abra o arquivo `.env.local` no seu projeto
2. Cole a connection string:

```env
POSTGRES_URL=postgresql://neondb_owner:npg_abc123...@ep-cool-cloud-123.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**IMPORTANTE:**
- Substitua o placeholder `your-postgres-connection-string` pela URL real
- Certifique-se de que não há espaços extras
- A string deve começar com `postgresql://`

---

## 🚀 Opção 2: Criar Database via Marketplace

### Passo 1: Acessar Marketplace

1. Vá para https://vercel.com/integrations
2. Ou no dashboard, clique em **"Integrations"** → **"Browse Marketplace"**

### Passo 2: Encontrar Postgres

1. Na busca, digite **"Postgres"**
2. Ou filtre por categoria: **"Storage"**
3. Você verá opções como:
   - **Neon Postgres** (recomendado - é o padrão)
   - Outros providers alternativos

### Passo 3: Instalar Neon Postgres

1. Clique em **"Neon Postgres"**
2. Clique em **"Install"** ou **"Add Integration"**
3. Revise os produtos disponíveis e os planos de faturamento
4. Clique em **"Install"** novamente para confirmar

### Passo 4: Configurar Database

1. **Região:** Selecione a região mais próxima
2. **Plano:** Selecione **"Free"** ou **"Hobby"**
3. **Database Name:** Digite um nome (ex: `flowtask-db`)
4. Revise os detalhes e clique em **"Create"**

### Passo 5: Conectar ao Projeto

Siga os passos 6-8 da Opção 1.

---

## 🛠️ Executar Migrations com Drizzle

Após configurar a connection string no `.env.local`:

### 1. Verificar Configuração

```bash
# Ver se o POSTGRES_URL está definido (não mostra o valor)
echo $env:POSTGRES_URL  # Windows PowerShell
# ou
echo $POSTGRES_URL      # Mac/Linux
```

### 2. Gerar Migrations (se ainda não gerou)

```bash
pnpm drizzle-kit generate
```

Isso cria arquivos SQL em `drizzle/` com base no schema em `db/schema.ts`.

### 3. Aplicar Migrations ao Database

**Opção A: Push Direto (Recomendado para Dev)**

```bash
pnpm drizzle-kit push
```

Este comando:
- ✅ Lê seu schema em `db/schema.ts`
- ✅ Compara com o database atual
- ✅ Aplica as mudanças diretamente (cria tables, colunas, etc.)
- ✅ Não gera arquivos de migration

**Opção B: Migrations Tradicionais**

```bash
# 1. Gerar migration
pnpm drizzle-kit generate

# 2. Aplicar migration
pnpm drizzle-kit migrate
```

### 4. Verificar Tables Criadas

Abra o **Drizzle Studio** para visualizar as tables:

```bash
pnpm drizzle-kit studio
```

Acesse: http://localhost:4983

Você deve ver 4 tables:
- ✅ `users`
- ✅ `accounts`
- ✅ `sessions`
- ✅ `verification_tokens`

---

## 🔍 Verificar Conexão (Neon Console)

### Acessar Neon Console

1. Vá para https://console.neon.tech/
2. Faça login (use a mesma conta que sua Vercel)
3. Você verá seu database listado

### Explorar Database

1. Clique no database criado
2. Vá em **"Tables"** no menu lateral
3. Você verá as 4 tables do Auth.js criadas pelo Drizzle

### SQL Editor

1. Clique em **"SQL Editor"**
2. Execute queries para testar:

```sql
-- Ver todas as tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Ver estrutura da table users
\d users

-- Contar usuários (deve estar vazio inicialmente)
SELECT COUNT(*) FROM users;
```

---

## 🎯 Testar Autenticação Completa

Agora que o database está configurado:

### 1. Iniciar Servidor

```bash
pnpm dev
```

### 2. Fazer Login

1. Acesse http://localhost:3000
2. Clique em **"Entrar"** ou **"Criar Conta Grátis"**
3. Escolha um provider (Google, GitHub ou Facebook)
4. Complete a autenticação

### 3. Verificar Database

Abra o Drizzle Studio:

```bash
pnpm drizzle-kit studio
```

Vá para http://localhost:4983 e verifique:

**Table `users`:**
- Deve ter 1 registro com seu nome, email e imagem

**Table `accounts`:**
- Deve ter 1 registro com o provider (google/github/facebook)
- Inclui tokens OAuth

**Table `sessions`:**
- Deve ter 1 sessão ativa
- Inclui sessionToken e data de expiração

### 4. Testar Logout

1. Clique no seu avatar no header
2. Clique em **"Sair"**
3. No Drizzle Studio, a sessão deve ser removida

---

## 📊 Monitorar Uso do Free Tier

### No Vercel Dashboard

1. Vá para **"Storage"** → selecione seu database
2. Você verá:
   - **Storage Used:** X MB / 3 GB
   - **Compute Hours:** X / 60 horas
   - **Connections:** Número de conexões ativas

### No Neon Console

1. Acesse https://console.neon.tech/
2. Clique no seu projeto
3. Vá em **"Usage"** no menu lateral
4. Veja gráficos de:
   - Compute time (horas usadas)
   - Storage (GB usados)
   - Data transfer

### Alertas

Você pode configurar alertas no Neon Console:
1. Vá em **"Settings"** → **"Notifications"**
2. Configure alertas para:
   - 80% do compute usado
   - 80% do storage usado

---

## 🔐 Variáveis de Ambiente Disponíveis

Quando você conecta um database Vercel Postgres ao projeto, estas variáveis são automaticamente injetadas:

| Variável | Descrição | Quando usar |
|----------|-----------|-------------|
| `POSTGRES_URL` | **Connection string com pooling** | Drizzle, conexões em produção |
| `POSTGRES_URL_NON_POOLING` | Connection string sem pooling | Migrations, scripts admin |
| `POSTGRES_PRISMA_URL` | Otimizada para Prisma | Se usar Prisma |
| `POSTGRES_USER` | Username do database | Conexões manuais |
| `POSTGRES_HOST` | Host do database | Conexões manuais |
| `POSTGRES_PASSWORD` | Senha do database | Conexões manuais |
| `POSTGRES_DATABASE` | Nome do database | Conexões manuais |

**Para este projeto:** Use `POSTGRES_URL` (já configurado em `db/index.ts`).

---

## ⚠️ Solução de Problemas

### Erro: "Database connection string provided to neon() is not a valid URL"

**Problema:** A variável `POSTGRES_URL` não está definida ou está incorreta.

**Solução:**
1. Verifique se o `.env.local` existe na raiz do projeto
2. Certifique-se de que `POSTGRES_URL=` tem uma URL válida
3. A URL deve começar com `postgresql://`
4. Reinicie o servidor: `pnpm dev`

### Erro: "fetch failed" ou "ECONNREFUSED"

**Problema:** Não consegue conectar ao database.

**Solução:**
1. Verifique se o database foi criado no Vercel Dashboard
2. Confirme que a região está acessível
3. Teste a conexão no Neon Console (SQL Editor)
4. Verifique se há firewall bloqueando

### Erro: "relation 'users' does not exist"

**Problema:** As tables não foram criadas no database.

**Solução:**
1. Execute: `pnpm drizzle-kit push`
2. Verifique no Drizzle Studio se as tables existem
3. Se não, confira o schema em `db/schema.ts`

### "Compute hours exceeded"

**Problema:** Usou todas as 60 horas do mês.

**Solução:**
1. Aguarde o reset mensal (dia 1º de cada mês)
2. Ou faça upgrade para plano pago (Pro: 100 horas)
3. Otimize queries para reduzir tempo de compute

### "Storage limit exceeded"

**Problema:** Passou dos 3 GB de armazenamento.

**Solução:**
1. Limpe dados antigos
2. Use Blob Storage da Vercel para arquivos grandes
3. Ou faça upgrade para plano pago

---

## 💡 Dicas de Otimização

### 1. Use Connection Pooling

Já configurado no projeto com `POSTGRES_URL` (pooled).

### 2. Minimize Compute Time

```typescript
// ❌ Evite queries desnecessárias
const user = await db.select().from(users).where(eq(users.id, userId))
const posts = await db.select().from(posts).where(eq(posts.userId, userId))

// ✅ Combine em uma query
const result = await db.select()
  .from(users)
  .leftJoin(posts, eq(users.id, posts.userId))
  .where(eq(users.id, userId))
```

### 3. Use Indexes

Adicione indexes no schema para queries frequentes:

```typescript
// db/schema.ts
import { index } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email), // ✅ Index no email
}))
```

### 4. Monitore Performance

Use o Neon Console para ver:
- Queries mais lentas
- Uso de compute por query
- Otimizações sugeridas

---

## 🔄 Alternativas ao Vercel Postgres

Se você precisar de mais recursos ou preferir outra opção:

### 1. **Neon Direto** (sem Vercel)
- Free tier: 3 GB + 191 horas compute
- Mais controle e features
- https://neon.tech

### 2. **Supabase**
- Free tier: 500 MB + 2 projetos
- Inclui Auth, Storage, Realtime
- https://supabase.com

### 3. **PlanetScale**
- Free tier: 5 GB + 1 bilhão de reads
- MySQL (não Postgres)
- https://planetscale.com

### 4. **Railway**
- Free tier: $5 crédito/mês
- Postgres + outros services
- https://railway.app

**Recomendação:** Mantenha Vercel Postgres (Neon) para este projeto - a integração é perfeita!

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Vercel Postgres Docs](https://vercel.com/docs/postgres)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Storage Pricing](https://vercel.com/docs/pricing)
- [Vercel Marketplace](https://vercel.com/integrations?category=storage&search=postgres)

### Tutoriais
- [Vercel Postgres Transition Guide (Neon)](https://neon.com/docs/guides/vercel-postgres-transition-guide)
- [Top PostgreSQL Free Tiers 2026](https://www.koyeb.com/blog/top-postgresql-database-free-tiers-in-2026)
- [Neon Database on Vercel: Free Tier Explained](https://devradar.dev/guides/neon-database-on-vercel-free-tier-explained-cost-clarification)

### Drizzle ORM
- [Drizzle with Neon](https://orm.drizzle.team/docs/get-started-postgresql#neon)
- [Drizzle Kit Commands](https://orm.drizzle.team/kit-docs/overview)
- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)

---

## ✅ Checklist Final

Antes de continuar com o desenvolvimento:

- [ ] Database criado no Vercel Dashboard/Marketplace
- [ ] Database conectado ao projeto Next.js
- [ ] `POSTGRES_URL` adicionada ao `.env.local`
- [ ] Migrations executadas (`pnpm drizzle-kit push`)
- [ ] Tables criadas (verificado no Drizzle Studio)
- [ ] Autenticação testada (login e logout funcionando)
- [ ] Dados aparecendo no database (users, accounts, sessions)
- [ ] Servidor funcionando sem erros

---

**Criado em:** 2026-01-25
**Vercel Postgres:** Powered by Neon
**Free Tier:** 3 GB storage + 60 horas compute/mês
**Custo:** $0 💚
