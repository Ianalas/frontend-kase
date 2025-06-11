import { z } from "zod"

export const profileSchema = z.object({
  name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/, {
    message: "Telefone inválido (ex: (11) 91234-5678)",
  }),
  plan: z.string().min(2, "Informe um plano válido"),
  bio: z.string().max(500).optional(),
  profileImage: z
    .instanceof(File)
    .optional()
})

export type PerfilSchema = z.infer<typeof profileSchema>
