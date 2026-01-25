<!-- markdownlint-disable -->

# Guia de Configuração OAuth - Google e Facebook

Este guia contém o passo a passo completo para configurar autenticação OAuth com Google e Facebook no projeto FlowTask.

## 📋 Índice

- [Configuração Google OAuth](#configuração-google-oauth)
- [Configuração Facebook OAuth](#configuração-facebook-oauth)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Testando a Autenticação](#testando-a-autenticação)

---

## 🔵 Configuração Google OAuth

### Pré-requisitos
- Conta Google
- Acesso ao [Google Cloud Console](https://console.cloud.google.com/)

### Passo 1: Criar/Selecionar Projeto

1. Acesse https://console.cloud.google.com/
2. No topo da página, clique no seletor de projetos
3. Clique em **"Novo Projeto"** (ou selecione um existente)
4. Preencha:
   - **Nome do projeto:** FlowTask (ou nome de sua preferência)
   - **Organização:** Deixe como está (ou selecione sua organização)
5. Clique em **"Criar"**
6. Aguarde a criação do projeto (pode levar alguns segundos)

### Passo 2: Configurar Tela de Consentimento OAuth

💡 **DICA IMPORTANTE:** Alguns campos nesta tela **não aceitam localhost**. Não se preocupe! Você pode deixá-los vazios para desenvolvimento. O OAuth funcionará normalmente, pois o que realmente importa são as configurações do Passo 3 (que aceitam localhost).

1. No menu lateral, vá em **APIs e serviços** > **Tela de consentimento OAuth**
2. Selecione o tipo de usuário:
   - **Externo**: Para aplicação pública (qualquer usuário Google pode logar)
   - **Interno**: Apenas para usuários da sua organização Google Workspace
3. Clique em **"Criar"**

#### Configuração da Tela de Consentimento

**Informações do app:**
- **Nome do app:** FlowTask
- **E-mail de suporte do usuário:** seu-email@gmail.com
- **Logotipo do app:** (opcional - pode adicionar depois)

**Domínio do app:**

⚠️ **IMPORTANTE:** O Google **NÃO aceita** `localhost` ou URLs locais nestes campos.

**Opções para desenvolvimento:**

1. **Opção Recomendada - Deixar em branco:**
   - Deixe o campo **"Página inicial do aplicativo"** vazio
   - Você pode adicionar um domínio real depois quando fizer deploy

2. **Opção Alternativa - Usar domínio real:**
   - Se você já tem um domínio (ex: `https://seusite.com`), use-o
   - Ou use um domínio temporário/futuro que pretende usar

**Para preencher:**
- **Página inicial do aplicativo:** (deixe vazio ou use `https://seudominio.com`)
- **Política de Privacidade:** (deixe vazio inicialmente)
- **Termos de Serviço:** (deixe vazio inicialmente)

**Domínios autorizados:**
- ⚠️ **NÃO adicione** `localhost` aqui (não funciona)
- Deixe vazio para desenvolvimento
- Adicione `seudominio.com` quando fizer deploy

**Informações de contato do desenvolvedor:**
- **Endereços de e-mail:** seu-email@gmail.com

4. Clique em **"Salvar e continuar"**

**Escopos:**
- Clique em **"Adicionar ou remover escopos"**
- Selecione:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`
- Clique em **"Atualizar"**
- Clique em **"Salvar e continuar"**

**Usuários de teste** (apenas se escolheu "Externo"):
- Adicione e-mails de usuários que poderão testar (incluindo o seu)
- Clique em **"Salvar e continuar"**

5. Revise as informações e clique em **"Voltar ao painel"**

### Passo 3: Criar Credenciais OAuth 2.0

1. No menu lateral, vá em **APIs e serviços** > **Credenciais**
2. Clique em **"Criar credenciais"** no topo
3. Selecione **"ID do cliente OAuth"**

#### Configuração do Cliente OAuth

**Tipo de aplicativo:**
- Selecione: **Aplicativo da Web**

**Nome:**
- Digite: `FlowTask Web Client` (ou nome de sua preferência)

**Origens JavaScript autorizadas:**
- Clique em **"Adicionar URI"**
- Adicione:
  - `http://localhost:3000` (desenvolvimento)
  - `https://seudominio.com` (produção - quando tiver)

**URIs de redirecionamento autorizados:**
- Clique em **"Adicionar URI"**
- Adicione:
  - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
  - `https://seudominio.com/api/auth/callback/google` (produção)

✅ **NOTA IMPORTANTE:**
Diferente da "Página inicial do aplicativo" (Passo 2), aqui `localhost` **FUNCIONA PERFEITAMENTE** e é necessário para desenvolvimento local. O Google permite localhost nas **Origens JavaScript** e **URIs de redirecionamento**, que são os campos mais importantes para fazer o OAuth funcionar.

4. Clique em **"Criar"**

### Passo 4: Copiar Credenciais

Uma janela popup aparecerá com suas credenciais:

- **ID do cliente:** algo como `123456789-abc.apps.googleusercontent.com`
- **Chave secreta do cliente:** algo como `GOCSPX-abc123def456`

**IMPORTANTE:**
1. Copie o **ID do cliente** e cole no `.env.local` como `AUTH_GOOGLE_ID`
2. Copie a **Chave secreta** e cole no `.env.local` como `AUTH_GOOGLE_SECRET`
3. Você pode visualizar essas credenciais novamente clicando no nome do cliente OAuth criado

### 📌 Resumo: Localhost no Google OAuth

Para esclarecer a confusão sobre `localhost`:

| Campo | Aceita localhost? | O que usar |
|-------|-------------------|------------|
| **Página inicial do aplicativo** (Tela de Consentimento) | ❌ NÃO | Deixe vazio ou use domínio real |
| **Domínios autorizados** (Tela de Consentimento) | ❌ NÃO | Deixe vazio ou use domínio real |
| **Origens JavaScript autorizadas** (Credenciais) | ✅ SIM | `http://localhost:3000` |
| **URIs de redirecionamento** (Credenciais) | ✅ SIM | `http://localhost:3000/api/auth/callback/google` |

**Conclusão:** O OAuth funcionará perfeitamente em desenvolvimento mesmo que você deixe os campos da tela de consentimento vazios, pois o que realmente importa são as **Origens JavaScript** e **URIs de redirecionamento**, e estes aceitam localhost! 🎉

### Passo 5: Habilitar Google+ API (Opcional)

Para acessar informações de perfil adicionais:

1. No menu lateral, vá em **APIs e serviços** > **Biblioteca**
2. Pesquise por "Google+ API" ou "People API"
3. Clique na API
4. Clique em **"Ativar"**

---

## 🔷 Configuração Facebook OAuth

### Pré-requisitos
- Conta Facebook
- Acesso ao [Facebook Developers](https://developers.facebook.com/)

### Passo 1: Criar App Facebook

1. Acesse https://developers.facebook.com/
2. Clique em **"Meus Apps"** no canto superior direito
3. Clique em **"Criar App"**

#### Seleção do Tipo de App

- Selecione: **"Consumidor"** (para login de usuários)
- Clique em **"Avançar"**

#### Informações Básicas do App

**Detalhes do app:**
- **Nome de exibição do app:** FlowTask
- **E-mail de contato do app:** seu-email@email.com
- **Finalidade comercial do app:** Selecione a opção mais adequada

4. Clique em **"Criar app"**
5. Complete a verificação de segurança (CAPTCHA)

### Passo 2: Configurar Login do Facebook

1. No painel do app, localize **"Login do Facebook"**
2. Clique em **"Configurar"** no card "Login do Facebook"
3. Selecione a plataforma: **"Web"**

#### Configuração da URL do Site

- **URL do site:** `http://localhost:3000` (desenvolvimento)
- Clique em **"Salvar"**
- Clique em **"Continuar"**

Você pode pular os próximos passos do guia rápido clicando em **"Próximo"** até finalizar.

### Passo 3: Configurar URLs de Redirecionamento

1. No menu lateral esquerdo, vá em **"Login do Facebook"** > **"Configurações"**

#### URLs de Redirecionamento OAuth Válidas

Na seção **"URIs de redirecionamento do OAuth válidos"**, adicione:

```
http://localhost:3000/api/auth/callback/facebook
```

Para produção, adicione também:
```
https://seudominio.com/api/auth/callback/facebook
```

2. Clique em **"Salvar alterações"** no final da página

### Passo 4: Configurar Domínios do App

1. No menu lateral esquerdo, vá em **"Configurações"** > **"Básico"**

#### Domínios do App

Na seção **"Domínios do app"**, adicione:
- `localhost` (desenvolvimento)
- `seudominio.com` (produção - quando tiver)

#### URL da Política de Privacidade

- Adicione uma URL válida (obrigatório para publicação do app)
- Exemplo: `https://seudominio.com/privacy` (pode criar depois)

2. Clique em **"Salvar alterações"**

### Passo 5: Copiar Credenciais

1. Ainda em **"Configurações"** > **"Básico"**
2. Localize:

- **ID do Aplicativo:** número longo (ex: `1234567890123456`)
- **Chave Secreta do Aplicativo:** clique em **"Mostrar"** para revelar

**IMPORTANTE:**
1. Copie o **ID do Aplicativo** e cole no `.env.local` como `AUTH_FACEBOOK_ID`
2. Copie a **Chave Secreta** e cole no `.env.local` como `AUTH_FACEBOOK_SECRET`

### Passo 6: Configurar Modo do App

Por padrão, o app é criado em **Modo de Desenvolvimento**.

**Modo de Desenvolvimento:**
- Apenas usuários/testadores adicionados podem fazer login
- Ideal para desenvolvimento e testes

**Para adicionar testadores:**
1. Vá em **"Funções"** > **"Funções"** no menu lateral
2. Clique em **"Adicionar testadores"**
3. Digite o nome ou e-mail do Facebook do testador
4. Clique em **"Enviar"**

**Modo Ativo (Produção):**
- Qualquer usuário pode fazer login
- Requer aprovação do Facebook (análise de app)
- Para ativar, vá em **"Configurações"** > **"Básico"** e mude o toggle no topo

### Passo 7: Configurar Permissões (Opcional)

Para acessar dados além do perfil básico:

1. Vá em **"Login do Facebook"** > **"Configurações"**
2. Na seção **"Permissões de login"**, você pode solicitar:
   - `email` (já incluído por padrão)
   - `public_profile` (já incluído por padrão)
   - Outras permissões requerem revisão do Facebook

---

## 📝 Variáveis de Ambiente

Após configurar Google e Facebook, seu arquivo `.env.local` deve conter:

```env
# Auth.js Configuration
AUTH_SECRET=sua-chave-secreta-aqui-gere-com-openssl-rand-base64-32
AUTH_URL=http://localhost:3000

# Google OAuth
AUTH_GOOGLE_ID=123456789-abc.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-abc123def456

# GitHub OAuth (se já configurou)
AUTH_GITHUB_ID=seu-github-client-id
AUTH_GITHUB_SECRET=seu-github-client-secret

# Facebook OAuth
AUTH_FACEBOOK_ID=1234567890123456
AUTH_FACEBOOK_SECRET=sua-facebook-secret-aqui

# Database
POSTGRES_URL=sua-postgres-connection-string
```

### Gerar AUTH_SECRET

No terminal, execute:

```bash
openssl rand -base64 32
```

Copie o resultado e cole no `AUTH_SECRET`.

---

## ✅ Testando a Autenticação

### 1. Verificar Configuração

Certifique-se de que:
- ✅ Todas as variáveis estão preenchidas no `.env.local`
- ✅ Database está configurado (Vercel Postgres ou outro)
- ✅ Migrations foram executadas: `pnpm drizzle-kit push`

### 2. Iniciar o Servidor

```bash
pnpm dev
```

### 3. Testar Login

1. Acesse http://localhost:3000
2. Clique em **"Entrar"** ou **"Criar Conta Grátis"**
3. Você verá opções de login:
   - Google
   - GitHub (se configurado)
   - Facebook

#### Testar Google

1. Clique em **"Entrar com Google"**
2. Selecione sua conta Google
3. Autorize o app (primeira vez)
4. Você será redirecionado de volta autenticado
5. Seu nome e avatar devem aparecer no header

#### Testar Facebook

1. Clique em **"Entrar com Facebook"**
2. Faça login no Facebook (se necessário)
3. Autorize o app
4. Você será redirecionado de volta autenticado
5. Seu nome e avatar devem aparecer no header

### 4. Verificar Dados no Database

Execute o Drizzle Studio:

```bash
pnpm drizzle-kit studio
```

Acesse http://localhost:4983 e verifique:
- Tabela `users`: deve conter seu usuário
- Tabela `accounts`: deve conter a conexão OAuth (Google ou Facebook)
- Tabela `sessions`: deve conter sua sessão ativa

### 5. Testar Logout

1. Clique no seu avatar no header
2. Clique em **"Sair"**
3. Você deve ser deslogado e os botões de login voltam a aparecer

---

## 🔧 Solução de Problemas

### Erro: "redirect_uri_mismatch" (Google)

**Problema:** A URL de callback não está autorizada.

**Solução:**
1. Verifique se a URL em **"URIs de redirecionamento autorizados"** está exatamente: `http://localhost:3000/api/auth/callback/google`
2. Sem trailing slash `/` no final
3. Aguarde alguns minutos para as mudanças propagarem

### Erro: "App Not Setup: This app is still in development mode" (Facebook)

**Problema:** O app está em modo de desenvolvimento e você não está na lista de testadores.

**Solução:**
1. Adicione seu usuário como testador (veja Passo 6 - Facebook)
2. Ou mude o app para modo ativo (requer aprovação do Facebook)

### Erro: "Invalid client_id" ou "Invalid client_secret"

**Problema:** Credenciais incorretas no `.env.local`.

**Solução:**
1. Verifique se copiou as credenciais corretas dos consoles
2. Certifique-se de que não há espaços extras
3. Reinicie o servidor: `pnpm dev`

### Sessão não persiste após refresh

**Problema:** Cookies não estão sendo salvos.

**Solução:**
1. Verifique se `AUTH_SECRET` está definido
2. Certifique-se de que não há erros no console do navegador
3. Limpe os cookies do navegador e tente novamente

---

## 🚀 Deploy para Produção

Quando for fazer deploy:

### Google OAuth

1. Adicione a URL de produção em **"Origens JavaScript autorizadas"**:
   - `https://seudominio.com`

2. Adicione a URL de callback de produção em **"URIs de redirecionamento autorizados"**:
   - `https://seudominio.com/api/auth/callback/google`

3. Atualize o `.env` de produção:
   - `AUTH_URL=https://seudominio.com`

### Facebook OAuth

1. Adicione a URL de produção em **"Domínios do app"**:
   - `seudominio.com`

2. Adicione a URL de callback de produção em **"URIs de redirecionamento do OAuth válidos"**:
   - `https://seudominio.com/api/auth/callback/facebook`

3. Mude o app para **Modo Ativo** (requer revisão do Facebook):
   - Complete todos os requisitos (política de privacidade, ícone do app, etc.)
   - Envie para revisão
   - Aguarde aprovação (pode levar dias)

4. Atualize o `.env` de produção:
   - `AUTH_URL=https://seudominio.com`

---

## 📚 Recursos Adicionais

### Google OAuth
- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentação OAuth 2.0 do Google](https://developers.google.com/identity/protocols/oauth2)
- [Auth.js - Google Provider](https://authjs.dev/reference/core/providers/google)

### Facebook OAuth
- [Facebook Developers](https://developers.facebook.com/)
- [Documentação Login do Facebook](https://developers.facebook.com/docs/facebook-login)
- [Auth.js - Facebook Provider](https://authjs.dev/reference/core/providers/facebook)

### Auth.js
- [Documentação Oficial](https://authjs.dev/)
- [Guia de Configuração OAuth](https://authjs.dev/guides/configuring-oauth-providers)
- [Variáveis de Ambiente](https://authjs.dev/guides/environment-variables)

---

**Criado em:** 2026-01-25
**Projeto:** FlowTask - Sistema de Gestão de Tarefas
**Auth.js:** v5.0.0-beta.30
