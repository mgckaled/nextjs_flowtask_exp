# Plano de Implementação: Gestão de Projetos e Tarefas - FlowTask

- `C:\Users\Usuário\.claude\plans\nested-scribbling-salamander.md`

## Visão Geral

Este plano detalha a implementação das features de **Gestão de Projetos** e **Gestão de Tarefas** para o FlowTask, incluindo o design completo do banco de dados em Drizzle ORM.

---

## 1. Schema do Banco de Dados (Drizzle ORM)

### 1.1 Novos Enums PostgreSQL

```typescript
// Enums para Projetos
export const projectStatusEnum = pgEnum('project_status', [
  'active', 'archived', 'completed'
])

// Enums para Tarefas
export const taskStatusEnum = pgEnum('task_status', [
  'backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'
])

export const taskPriorityEnum = pgEnum('task_priority', [
  'urgent', 'high', 'medium', 'low'
])

// Enums para Recorrência
export const recurrenceTypeEnum = pgEnum('recurrence_type', [
  'daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'custom'
])

export const recurrenceEndTypeEnum = pgEnum('recurrence_end_type', [
  'never', 'after_occurrences', 'on_date'
])
```

### 1.2 Tabela `projects`

```typescript
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Dados básicos
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#6366f1"), // cor do projeto (hex)
  icon: text("icon").default("folder"), // ícone do projeto

  // Status e organização
  status: projectStatusEnum("status").default("active").notNull(),
  isTemplate: boolean("is_template").default(false).notNull(),
  templateId: uuid("template_id").references(() => projects.id), // se foi criado de um template

  // Datas
  startDate: timestamp("start_date", { mode: "date" }),
  dueDate: timestamp("due_date", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
  archivedAt: timestamp("archived_at", { mode: "date" }),

  // Metadados
  settings: jsonb("settings").$type<ProjectSettings>().default({
    defaultView: 'kanban',
    allowSubtasks: true,
    enableTimeTracking: false,
  }),

  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("projects_user_id_idx").on(table.userId),
  statusIdx: index("projects_status_idx").on(table.status),
  isTemplateIdx: index("projects_is_template_idx").on(table.isTemplate),
}))

// Tipo para settings do projeto
export type ProjectSettings = {
  defaultView: 'kanban' | 'list' | 'calendar'
  allowSubtasks: boolean
  enableTimeTracking: boolean
}
```

### 1.3 Tabela `tags`

```typescript
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  color: text("color").default("#6366f1").notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("tags_user_id_idx").on(table.userId),
  uniqueUserTag: uniqueIndex("tags_user_name_idx").on(table.userId, table.name),
}))
```

### 1.4 Tabela `project_tags`

```typescript
export const projectTags = pgTable("project_tags", {
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.projectId, table.tagId] }),
}))
```

### 1.5 Tabela `tasks`

```typescript
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Dados básicos
  title: text("title").notNull(),
  description: text("description"),

  // Status e organização
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  position: integer("position").default(0).notNull(), // ordem no kanban

  // Hierarquia (para subtarefas)
  parentTaskId: uuid("parent_task_id").references(() => tasks.id, { onDelete: "cascade" }),

  // Datas
  startDate: timestamp("start_date", { mode: "date" }),
  dueDate: timestamp("due_date", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),

  // Estimativas de tempo (em minutos)
  estimatedTime: integer("estimated_time"),
  actualTime: integer("actual_time").default(0),

  // Recorrência
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurringConfigId: uuid("recurring_config_id").references(() => recurringTaskConfigs.id),

  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  projectIdIdx: index("tasks_project_id_idx").on(table.projectId),
  userIdIdx: index("tasks_user_id_idx").on(table.userId),
  statusIdx: index("tasks_status_idx").on(table.status),
  priorityIdx: index("tasks_priority_idx").on(table.priority),
  dueDateIdx: index("tasks_due_date_idx").on(table.dueDate),
  parentTaskIdx: index("tasks_parent_task_idx").on(table.parentTaskId),
  positionIdx: index("tasks_position_idx").on(table.projectId, table.status, table.position),
}))
```

### 1.6 Tabela `task_tags`

```typescript
export const taskTags = pgTable("task_tags", {
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.tagId] }),
}))
```

### 1.7 Tabela `checklists`

```typescript
export const checklists = pgTable("checklists", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  position: integer("position").default(0).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  taskIdIdx: index("checklists_task_id_idx").on(table.taskId),
}))
```

### 1.8 Tabela `checklist_items`

```typescript
export const checklistItems = pgTable("checklist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  checklistId: uuid("checklist_id")
    .notNull()
    .references(() => checklists.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  position: integer("position").default(0).notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  checklistIdIdx: index("checklist_items_checklist_id_idx").on(table.checklistId),
}))
```

### 1.9 Tabela `task_reminders`

```typescript
export const taskReminders = pgTable("task_reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  remindAt: timestamp("remind_at", { mode: "date" }).notNull(),
  isSent: boolean("is_sent").default(false).notNull(),
  sentAt: timestamp("sent_at", { mode: "date" }),

  // Tipo de notificação
  notificationType: text("notification_type").default("email").notNull(), // email, push, in_app

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  taskIdIdx: index("task_reminders_task_id_idx").on(table.taskId),
  remindAtIdx: index("task_reminders_remind_at_idx").on(table.remindAt),
  isSentIdx: index("task_reminders_is_sent_idx").on(table.isSent),
}))
```

### 1.10 Tabela `recurring_task_configs`

```typescript
export const recurringTaskConfigs = pgTable("recurring_task_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Configuração de recorrência
  recurrenceType: recurrenceTypeEnum("recurrence_type").notNull(),
  interval: integer("interval").default(1).notNull(), // a cada X dias/semanas/meses

  // Para recorrência semanal: quais dias (0=domingo, 6=sábado)
  weekDays: jsonb("week_days").$type<number[]>().default([]),

  // Para recorrência mensal: dia do mês (1-31) ou -1 para último dia
  monthDay: integer("month_day"),

  // Condições de fim
  endType: recurrenceEndTypeEnum("end_type").default("never").notNull(),
  endAfterOccurrences: integer("end_after_occurrences"),
  endDate: timestamp("end_date", { mode: "date" }),

  // Contadores
  occurrencesCount: integer("occurrences_count").default(0).notNull(),
  lastGeneratedAt: timestamp("last_generated_at", { mode: "date" }),
  nextOccurrence: timestamp("next_occurrence", { mode: "date" }),

  // Template da tarefa
  taskTemplate: jsonb("task_template").$type<RecurringTaskTemplate>().notNull(),

  // Status
  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("recurring_task_configs_user_id_idx").on(table.userId),
  nextOccurrenceIdx: index("recurring_task_configs_next_occurrence_idx").on(table.nextOccurrence),
  isActiveIdx: index("recurring_task_configs_is_active_idx").on(table.isActive),
}))

// Tipo para template da tarefa recorrente
export type RecurringTaskTemplate = {
  title: string
  description?: string
  projectId: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  estimatedTime?: number
  tagIds?: string[]
  checklistTemplate?: {
    title: string
    items: string[]
  }[]
}
```

### 1.11 Relations (Drizzle ORM)

```typescript
// Projects Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  template: one(projects, {
    fields: [projects.templateId],
    references: [projects.id],
    relationName: 'projectTemplate',
  }),
  derivedProjects: many(projects, { relationName: 'projectTemplate' }),
  tasks: many(tasks),
  tags: many(projectTags),
}))

// Tasks Relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
    relationName: 'subtasks',
  }),
  subtasks: many(tasks, { relationName: 'subtasks' }),
  checklists: many(checklists),
  reminders: many(taskReminders),
  tags: many(taskTags),
  recurringConfig: one(recurringTaskConfigs, {
    fields: [tasks.recurringConfigId],
    references: [recurringTaskConfigs.id],
  }),
}))

// Tags Relations
export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  projects: many(projectTags),
  tasks: many(taskTags),
}))

// Project Tags Relations
export const projectTagsRelations = relations(projectTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectTags.projectId],
    references: [projects.id],
  }),
  tag: one(tags, {
    fields: [projectTags.tagId],
    references: [tags.id],
  }),
}))

// Task Tags Relations
export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id],
  }),
}))

// Checklists Relations
export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  task: one(tasks, {
    fields: [checklists.taskId],
    references: [tasks.id],
  }),
  items: many(checklistItems),
}))

// Checklist Items Relations
export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  checklist: one(checklists, {
    fields: [checklistItems.checklistId],
    references: [checklists.id],
  }),
}))

// Task Reminders Relations
export const taskRemindersRelations = relations(taskReminders, ({ one }) => ({
  task: one(tasks, {
    fields: [taskReminders.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskReminders.userId],
    references: [users.id],
  }),
}))

// Recurring Task Configs Relations
export const recurringTaskConfigsRelations = relations(recurringTaskConfigs, ({ one, many }) => ({
  user: one(users, {
    fields: [recurringTaskConfigs.userId],
    references: [users.id],
  }),
  generatedTasks: many(tasks),
}))

// Atualizar Users Relations (adicionar aos existentes)
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  projects: many(projects),
  tasks: many(tasks),
  tags: many(tags),
  reminders: many(taskReminders),
  recurringConfigs: many(recurringTaskConfigs),
}))
```

### 1.12 Tipos Inferidos

```typescript
// Projects
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

// Tasks
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

// Tags
export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert

// Checklists
export type Checklist = typeof checklists.$inferSelect
export type NewChecklist = typeof checklists.$inferInsert

// Checklist Items
export type ChecklistItem = typeof checklistItems.$inferSelect
export type NewChecklistItem = typeof checklistItems.$inferInsert

// Task Reminders
export type TaskReminder = typeof taskReminders.$inferSelect
export type NewTaskReminder = typeof taskReminders.$inferInsert

// Recurring Task Configs
export type RecurringTaskConfig = typeof recurringTaskConfigs.$inferSelect
export type NewRecurringTaskConfig = typeof recurringTaskConfigs.$inferInsert
```

---

## 2. Estrutura de Arquivos

```
app/
├── (dashboard)/
│   ├── layout.tsx                    # Layout do dashboard com sidebar
│   ├── dashboard/
│   │   └── page.tsx                  # Overview com métricas
│   ├── projects/
│   │   ├── page.tsx                  # Lista de projetos
│   │   ├── new/
│   │   │   └── page.tsx              # Criar projeto
│   │   ├── templates/
│   │   │   └── page.tsx              # Templates de projeto
│   │   └── [projectId]/
│   │       ├── page.tsx              # Redirect para board
│   │       ├── board/
│   │       │   └── page.tsx          # Kanban board
│   │       ├── list/
│   │       │   └── page.tsx          # Lista de tarefas
│   │       ├── calendar/
│   │       │   └── page.tsx          # Calendário
│   │       └── settings/
│   │           └── page.tsx          # Configurações do projeto
│   └── tasks/
│       ├── page.tsx                  # Todas as tarefas (filtros)
│       └── [taskId]/
│           └── page.tsx              # Detalhes da tarefa
├── actions/
│   ├── projects.ts                   # Server Actions projetos
│   ├── tasks.ts                      # Server Actions tarefas
│   ├── tags.ts                       # Server Actions tags
│   ├── checklists.ts                 # Server Actions checklists
│   └── reminders.ts                  # Server Actions lembretes
├── api/
│   ├── cron/
│   │   ├── recurring-tasks/
│   │   │   └── route.ts              # Cron job tarefas recorrentes
│   │   └── reminders/
│   │       └── route.ts              # Cron job lembretes
│   └── tasks/
│       └── reorder/
│           └── route.ts              # API reordenação Kanban
├── components/
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectsList.tsx
│   │   └── TemplateSelector.tsx
│   ├── tasks/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskDetails.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── SubtaskList.tsx
│   │   ├── ChecklistManager.tsx
│   │   ├── ReminderPicker.tsx
│   │   └── RecurrenceConfig.tsx
│   ├── tags/
│   │   ├── TagPicker.tsx
│   │   └── TagManager.tsx
│   └── shared/
│       ├── DatePicker.tsx
│       ├── TimePicker.tsx
│       └── PriorityBadge.tsx
lib/
├── validations/
│   ├── project.ts                    # Schemas Zod projetos
│   ├── task.ts                       # Schemas Zod tarefas
│   ├── tag.ts                        # Schemas Zod tags
│   └── checklist.ts                  # Schemas Zod checklists
├── utils/
│   ├── recurrence.ts                 # Lógica de recorrência
│   └── kanban.ts                     # Helpers do Kanban
db/
└── schema.ts                         # Schema atualizado
```

---

## 3. Fases de Implementação

### Fase 1: Fundação
1. Atualizar `db/schema.ts` com todas as tabelas e relations
2. Gerar e executar migrations (`npx drizzle-kit generate && npx drizzle-kit push`)
3. Criar schemas Zod em `lib/validations/`
4. Criar Server Actions básicas para projetos

### Fase 2: Projetos
1. CRUD completo de projetos
2. Sistema de tags
3. Templates de projeto
4. Arquivamento e restauração
5. Duplicação de projetos

### Fase 3: Tarefas Básicas
1. CRUD de tarefas
2. Kanban board com drag & drop (dnd-kit)
3. Lista de tarefas com filtros
4. Subtarefas
5. Checklists

### Fase 4: Recursos Avançados
1. Prioridades e datas
2. Estimativa de tempo
3. Sistema de lembretes
4. Tarefas recorrentes
5. Cron jobs (Vercel Cron)

---

## 4. Server Actions

### `app/actions/projects.ts`

```typescript
// CRUD
export async function createProject(data: CreateProjectData): Promise<ActionState>
export async function updateProject(id: string, data: UpdateProjectData): Promise<ActionState>
export async function deleteProject(id: string): Promise<ActionState>

// Queries
export async function getProjects(filters?: ProjectFilters)
export async function getProject(id: string)
export async function getProjectWithTasks(id: string)

// Ações especiais
export async function archiveProject(id: string): Promise<ActionState>
export async function restoreProject(id: string): Promise<ActionState>
export async function duplicateProject(id: string, newName: string): Promise<ActionState>
export async function createProjectFromTemplate(templateId: string, data: CreateProjectData): Promise<ActionState>
export async function saveProjectAsTemplate(id: string): Promise<ActionState>
```

### `app/actions/tasks.ts`

```typescript
// CRUD
export async function createTask(data: CreateTaskData): Promise<ActionState>
export async function updateTask(id: string, data: UpdateTaskData): Promise<ActionState>
export async function deleteTask(id: string): Promise<ActionState>

// Queries
export async function getTasks(filters?: TaskFilters)
export async function getTask(id: string)
export async function getTaskWithDetails(id: string)
export async function getTasksByProject(projectId: string)

// Ações especiais
export async function moveTask(id: string, status: TaskStatus, position: number): Promise<ActionState>
export async function reorderTasks(projectId: string, updates: ReorderUpdate[]): Promise<ActionState>
export async function completeTask(id: string): Promise<ActionState>
export async function duplicateTask(id: string): Promise<ActionState>

// Subtarefas
export async function createSubtask(parentId: string, data: CreateSubtaskData): Promise<ActionState>
export async function convertToSubtask(taskId: string, parentId: string): Promise<ActionState>
export async function promoteSubtask(taskId: string): Promise<ActionState>

// Tempo
export async function updateTimeTracking(id: string, actualTime: number): Promise<ActionState>
```

### `app/actions/checklists.ts`

```typescript
export async function createChecklist(taskId: string, title: string): Promise<ActionState>
export async function updateChecklist(id: string, title: string): Promise<ActionState>
export async function deleteChecklist(id: string): Promise<ActionState>

export async function addChecklistItem(checklistId: string, content: string): Promise<ActionState>
export async function toggleChecklistItem(id: string): Promise<ActionState>
export async function updateChecklistItem(id: string, content: string): Promise<ActionState>
export async function deleteChecklistItem(id: string): Promise<ActionState>
export async function reorderChecklistItems(checklistId: string, itemIds: string[]): Promise<ActionState>
```

### `app/actions/tags.ts`

```typescript
export async function createTag(data: CreateTagData): Promise<ActionState>
export async function updateTag(id: string, data: UpdateTagData): Promise<ActionState>
export async function deleteTag(id: string): Promise<ActionState>
export async function getUserTags()

export async function addTagToProject(projectId: string, tagId: string): Promise<ActionState>
export async function removeTagFromProject(projectId: string, tagId: string): Promise<ActionState>
export async function addTagToTask(taskId: string, tagId: string): Promise<ActionState>
export async function removeTagFromTask(taskId: string, tagId: string): Promise<ActionState>
```

---

## 5. Schemas Zod

### `lib/validations/project.ts`

```typescript
import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(50).optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  templateId: z.string().uuid().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectFiltersSchema = z.object({
  status: z.enum(['active', 'archived', 'completed']).optional(),
  search: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
})

export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectData = z.infer<typeof updateProjectSchema>
export type ProjectFilters = z.infer<typeof projectFiltersSchema>
```

### `lib/validations/task.ts`

```typescript
import { z } from 'zod'

export const taskStatusValues = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'] as const
export const taskPriorityValues = ['urgent', 'high', 'medium', 'low'] as const

export const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1, 'Título é obrigatório').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(taskStatusValues).default('todo'),
  priority: z.enum(taskPriorityValues).default('medium'),
  parentTaskId: z.string().uuid().optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  estimatedTime: z.number().int().positive().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
})

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true })

export const taskFiltersSchema = z.object({
  projectId: z.string().uuid().optional(),
  status: z.array(z.enum(taskStatusValues)).optional(),
  priority: z.array(z.enum(taskPriorityValues)).optional(),
  search: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
  hasSubtasks: z.boolean().optional(),
  isOverdue: z.boolean().optional(),
})

export type CreateTaskData = z.infer<typeof createTaskSchema>
export type UpdateTaskData = z.infer<typeof updateTaskSchema>
export type TaskFilters = z.infer<typeof taskFiltersSchema>
```

---

## 6. Considerações Técnicas

### 6.1 Templates de Projeto

Usar a própria tabela `projects` com flag `isTemplate`. Ao criar projeto a partir de template:
- Copiar estrutura do projeto
- Copiar tags associadas
- Copiar tarefas com checklists
- Manter referência ao template original

### 6.2 Tarefas Recorrentes

**Estratégia Híbrida**: Cron job diário + geração on-demand.

1. **Cron Job (Vercel Cron)**: Roda 1x ao dia às 00:00 UTC
2. **On-Demand**: Ao acessar projeto, verifica se há tarefas pendentes de geração

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/recurring-tasks",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/reminders",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

### 6.3 Sistema de Lembretes

- Cron job a cada 15 minutos
- Envio via Resend (já configurado no projeto)
- Suporte a email, push e in-app (futuro)

### 6.4 Performance do Kanban

1. **dnd-kit**: Biblioteca acessível para drag & drop
2. **Virtualização**: Para projetos com muitas tarefas (react-virtual)
3. **Optimistic Updates**: Atualizar UI imediatamente
4. **Batch Updates**: Reordenação em lote via transação
5. **Índices Compostos**: Já incluídos no schema

---

## 7. Arquivos Críticos

| Arquivo                                   | Descrição                                           |
| ----------------------------------------- | --------------------------------------------------- |
| `db/schema.ts`                            | Adicionar todas as novas tabelas, enums e relations |
| `app/actions/onboarding.ts`               | Padrão para ActionState e Server Actions            |
| `lib/validations/onboarding.ts`           | Padrão para schemas Zod                             |
| `app/components/demo/DemoKanbanBoard.tsx` | Base para Kanban real com dnd-kit                   |
| `drizzle.config.ts`                       | Configuração para migrations                        |

---

## 8. Verificação

### Como testar as mudanças:

1. **Schema/Migrations**:
2. 
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit push
   ```

3. **Server Actions**: Testar via formulários ou chamadas diretas

4. **Kanban**: Testar drag & drop em diferentes cenários

5. **Tarefas Recorrentes**: Simular cron manualmente via endpoint

6. **Lembretes**: Criar lembrete e verificar envio via Resend dashboard


## Resumo

 Resumo do que foi planejado
  Componente: 10 tabelas
  Descrição: projects, tasks, tags, project_tags,
    task_tags, checklists, checklist_items,
    task_reminders, recurring_task_configs
  ────────────────────────────────────────
  Componente: 5 enums
  Descrição: project_status, task_status, task_priority,  
    recurrence_type, recurrence_end_type
  ────────────────────────────────────────
  Componente: 4 fases
  Descrição: Fundação → Projetos → Tarefas Básicas →
    Recursos Avançados
  ────────────────────────────────────────
  Componente: 5 Server Actions
  Descrição: projects.ts, tasks.ts, tags.ts,
  checklists.ts,
     reminders.ts
  ────────────────────────────────────────
  Componente: 4 schemas Zod
  Descrição: project.ts, task.ts, tag.ts, checklist.ts 
  Deseja que eu comece a implementação? Posso iniciar pela   Fase 1 (Fundação) - atualizando o db/schema.ts com todas as novas tabelas e enums.