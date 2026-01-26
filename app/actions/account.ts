'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { users, userProfiles, type UserPreferences } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export type ActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// Schema para atualizar nome
const updateNameSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
})

// Schema para atualizar dados profissionais
const updateProfileSchema = z.object({
  phone: z.string().min(1, 'Telefone é obrigatório'),
  jobTitle: z.string().min(2, 'Cargo deve ter pelo menos 2 caracteres'),
  company: z.string().min(2, 'Empresa deve ter pelo menos 2 caracteres'),
  industry: z.string().min(1, 'Selecione o setor'),
})

// Schema para preferências
const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
})

// Atualizar nome do usuário
export async function updateUserName(data: { name: string }): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = updateNameSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await db
      .update(users)
      .set({ name: validated.data.name })
      .where(eq(users.id, session.user.id))

    revalidatePath('/account')
    revalidatePath('/dashboard')

    return { success: true, message: "Nome atualizado com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar nome:", error)
    return { success: false, message: "Erro ao atualizar nome" }
  }
}

// Atualizar dados profissionais
export async function updateUserProfile(data: {
  phone: string
  jobTitle: string
  company: string
  industry: string
}): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = updateProfileSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await db
      .update(userProfiles)
      .set({
        phone: validated.data.phone,
        jobTitle: validated.data.jobTitle,
        company: validated.data.company,
        industry: validated.data.industry,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id))

    revalidatePath('/account')

    return { success: true, message: "Perfil atualizado com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return { success: false, message: "Erro ao atualizar perfil" }
  }
}

// Atualizar preferências
export async function updateUserPreferences(
  data: UserPreferences
): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado" }
  }

  const validated = updatePreferencesSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await db
      .update(userProfiles)
      .set({
        preferences: validated.data,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id))

    revalidatePath('/account')

    return { success: true, message: "Preferências atualizadas!" }
  } catch (error) {
    console.error("Erro ao atualizar preferências:", error)
    return { success: false, message: "Erro ao atualizar preferências" }
  }
}

// Buscar dados completos do usuário para a página de conta
export async function getUserAccountData() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      profile: true,
      subscription: true,
    },
  })

  return user
}
