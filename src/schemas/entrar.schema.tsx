import { z } from "zod"
export const loginSchema = z.object({
  cpf: z.string().refine((val) => {
  const allowed = ["admin", "administrator"];
  const isAllowed = allowed.includes(val);
  const isCpf = /^\d{11}$/.test(val); // regex para 11 dígitos

  return isAllowed || isCpf;
}, {
  message: "Digite um CPF válido."
}),
  password: z.string().min(8, {
    message: "Sua senha deve ter o minimo de 8 caracteres",
  }).max(32, {
    message: "Sua sennha deve ter o maximo de caracteres 32 caracteres",
  }),
});

export type LoginData = z.infer<typeof loginSchema>;