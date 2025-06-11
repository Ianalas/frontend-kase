import { z } from "zod"
export const registerSchema = z.object({
  cpf: z.string().min(11, {
    message: "CPF Válidos tem 11 caracteres."
  }).max(11,{
    message: "CPF Válidos tem 11 caracteres."
  }),
  password: z.string().min(8, {
    message: "Sua senha deve ter o minimo de 8 caracteres",
  }).max(32, {
    message: "Sua sennha deve ter o maximo de caracteres 32 caracteres",
  }),
  secondPassword: z.string(),
}).refine((data) => data.password === data.secondPassword, {
    message: "As senhas não coincidem",
    path: ["secondPassword"]
});

export type RegisterData = z.infer<typeof registerSchema>;