import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { LoginData, loginSchema } from "@/schemas/entrar.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { loginUser } from "@/services/authService";
import { getIdTokenResult } from "firebase/auth";

export function Entrar() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  async function onSubmit(user: LoginData) {
    try {
      const response = await loginUser(user.cpf, user.password);
      const tokenResult = await getIdTokenResult(response.user);
      const role = tokenResult.claims.role;
      if (role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (error) {
      // Tratar erro de rede ou outro erro
    }
  }

  function onError(errors: FieldErrors<LoginData>) {
    if (errors.cpf) {
      toast.error(errors.cpf.message, {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
    if (errors.password) {
      toast.error(errors.password.message, {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden bg-background">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  👋 Olá, Realize seu Login
                </h1>
                <p className="text-balance text-muted-foreground">
                  Seja sua melhor versão com Kase Box
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="123.456.789-00"
                  {...register("cpf")}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu Sua Senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha..."
                  {...register("password")}
                />
              </div>

              <Button type="submit" className="w-full">
                Entrar
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Continue com
                </span>
              </div>

              <div className="grid grid-cols-[50%] justify-center w-full gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Não tem conta?{" "}
                <Link
                  to="/auth/registro"
                  className="underline underline-offset-4"
                >
                  Registre-se
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/Foto-1.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
