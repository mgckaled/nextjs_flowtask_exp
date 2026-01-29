# FlowTask - Roadmap de Funcionalidades

## Stack Atual

- Next.js 16 + React 19
- NextAuth (autenticação)
- Drizzle ORM + Neon (banco de dados)
- Stripe (pagamentos)
- Resend (emails)
- Tailwind CSS + Motion

---

## 1. Core Features (Alta Prioridade)

### 1.1 Gestão de Projetos

- [ ] CRUD completo de projetos
- [ ] Templates de projeto pré-definidos
- [ ] Arquivamento e restauração
- [ ] Duplicação de projetos
- [ ] Tags e categorias

### 1.2 Gestão de Tarefas

- [ ] Kanban board funcional (drag & drop)
- [ ] Lista de tarefas com filtros avançados
- [ ] Subtarefas e checklists
- [ ] Prioridades (urgente, alta, média, baixa)
- [ ] Datas de vencimento e lembretes
- [ ] Estimativa de tempo vs tempo real
- [ ] Tarefas recorrentes

### 1.3 Colaboração

- [ ] Convite de membros por email
- [ ] Roles e permissões (admin, editor, viewer)
- [ ] Atribuição de tarefas a membros
- [ ] Menções (@usuario) em comentários
- [ ] Atividade em tempo real (WebSockets)

---

## 2. Comunicação e Notificações

### 2.1 Sistema de Notificações

- [ ] Notificações in-app
- [ ] Notificações por email (digest diário/semanal)
- [ ] Push notifications (PWA)
- [ ] Configurações granulares por tipo

### 2.2 Comentários e Discussões

- [ ] Comentários em tarefas
- [ ] Threads de discussão
- [ ] Anexos em comentários
- [ ] Reações (emojis)

---

## 3. Produtividade

### 3.1 Time Tracking

- [ ] Timer integrado por tarefa
- [ ] Registro manual de horas
- [ ] Relatórios de tempo por projeto/membro
- [ ] Integração com faturamento

### 3.2 Automações

- [ ] Regras automáticas (quando X, então Y)
- [ ] Movimentação automática de tarefas
- [ ] Notificações automáticas por deadline
- [ ] Atribuição automática baseada em carga

### 3.3 Views Alternativas

- [ ] Calendário (mensal/semanal)
- [ ] Timeline/Gantt
- [ ] Tabela com colunas customizáveis
- [ ] Modo foco (uma tarefa por vez)

---

## 4. Analytics e Relatórios

### 4.1 Dashboards

- [ ] Métricas de produtividade
- [ ] Burndown/Burnup charts
- [ ] Velocity do time
- [ ] Tarefas por status/membro/período

### 4.2 Relatórios

- [ ] Exportação PDF/CSV
- [ ] Relatórios agendados por email
- [ ] Comparativo entre períodos
- [ ] ROI de projetos

---

## 5. Integrações

### 5.1 Primeira Fase

- [ ] Google Calendar (sync de deadlines)
- [ ] Slack (notificações e comandos)
- [ ] GitHub/GitLab (link commits a tarefas)
- [ ] Google Drive/Dropbox (anexos)

### 5.2 Segunda Fase

- [ ] Zapier/Make (automações externas)
- [ ] API REST pública
- [ ] Webhooks
- [ ] Import/Export de outros tools (Trello, Asana, Jira)

---

## 6. Mobile e Acessibilidade

### 6.1 PWA

- [ ] Instalação como app
- [ ] Modo offline (sync posterior)
- [ ] Push notifications nativas

### 6.2 Acessibilidade

- [ ] WCAG 2.1 AA compliance
- [ ] Navegação por teclado completa
- [ ] Screen reader support
- [ ] Alto contraste e tamanhos de fonte

---

## 7. Enterprise Features

### 7.1 Segurança

- [ ] SSO (SAML/OIDC)
- [ ] 2FA obrigatório
- [ ] Audit logs
- [ ] Data retention policies
- [ ] IP allowlisting

### 7.2 Administração

- [ ] Painel de admin
- [ ] Gerenciamento de usuários em massa
- [ ] Custom branding (white-label)
- [ ] SLA e suporte dedicado

---

## 8. Monetização

### 8.1 Tiers Sugeridos

| Feature | Free | Pro | Business |
| --------- | ------ | ----- | ---------- |
| Projetos | 3 | Ilimitado | Ilimitado |
| Membros | 5 | 20 | Ilimitado |
| Storage | 500MB | 10GB | 100GB |
| Integrações | 2 | 10 | Todas |
| Automações | - | 10/mês | Ilimitado |
| Analytics | Básico | Avançado | Custom |
| Suporte | Community | Email | Prioritário |

### 8.2 Add-ons

- [ ] Time tracking avançado
- [ ] Gantt/Timeline view
- [ ] Relatórios customizados
- [ ] API access

---

## 9. Quick Wins (Baixo Esforço, Alto Impacto)

1. **Atalhos de teclado** - Navegação rápida
2. **Busca global** - Cmd+K para buscar tudo
3. **Dark/Light mode** - Já implementado
4. **Favoritos** - Projetos e tarefas favoritos
5. **Filtros salvos** - Views customizadas
6. **Bulk actions** - Editar múltiplas tarefas
7. **Copy/Paste tasks** - Entre projetos
8. **Markdown support** - Em descrições e comentários

---

## 10. Tech Debt e Melhorias

- [ ] Testes unitários e E2E (Vitest + Playwright)
- [ ] Storybook para componentes
- [ ] CI/CD pipeline completo
- [ ] Monitoramento (Sentry, LogRocket)
- [ ] Performance (Core Web Vitals)
- [ ] SEO otimizado
- [ ] i18n (internacionalização)

---

## Priorização Sugerida

### Sprint 1-2: MVP Funcional

- CRUD projetos e tarefas
- Kanban drag & drop
- Convite de membros básico

### Sprint 3-4: Colaboração

- Comentários
- Notificações in-app
- Atribuição de tarefas

### Sprint 5-6: Produtividade

- Filtros e busca
- Views alternativas
- Time tracking básico

### Sprint 7-8: Analytics

- Dashboard de métricas
- Relatórios básicos
- Exportação

### Sprint 9-10: Integrações

- Google Calendar
- Slack
- API pública
