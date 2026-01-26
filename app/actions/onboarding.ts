'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { userProfiles } from "@/db/schema"
import { onboardingSchema, type OnboardingFormData } from "@/lib/validations/onboarding"
import { revalidatePath } from "next/cache"

export type ActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function saveOnboardingProfile(
  data: OnboardingFormData
): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Você precisa estar logado para completar o onboarding",
    }
  }

  // Validação server-side
  const validatedFields = onboardingSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await db.insert(userProfiles).values({
      userId: session.user.id,
      phone: validatedFields.data.phone,
      jobTitle: validatedFields.data.jobTitle,
      company: validatedFields.data.company,
      companySize: validatedFields.data.companySize,
      industry: validatedFields.data.industry,
      howDidYouHear: validatedFields.data.howDidYouHear,
      onboardingCompleted: true,
    })

    revalidatePath('/dashboard')

    return {
      success: true,
      message: "Perfil salvo com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao salvar perfil:", error)

    // Verifica se é erro de duplicata (perfil já existe)
    if (error instanceof Error && error.message.includes('duplicate')) {
      return {
        success: false,
        message: "Perfil já foi preenchido anteriormente",
      }
    }

    return {
      success: false,
      message: "Erro ao salvar perfil. Tente novamente.",
    }
  }
}
