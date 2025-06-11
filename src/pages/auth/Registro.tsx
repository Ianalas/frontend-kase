import { Link, useNavigate } from "react-router";
import { FieldErrors, useForm } from "react-hook-form";
import { RegisterData, registerSchema } from "@/schemas/registro.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/authService";

export function Registro() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      cpf: "",
      password: "",
      secondPassword: "",
    },
  });
  function onSubmit(values: RegisterData) {
    registerUser(values.cpf, values.password);
    navigate("/auth/entrar");
  }

  function onError(errors: FieldErrors<RegisterData>) {
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
    if (errors.secondPassword) {
      toast.error(errors.secondPassword.message, {
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
                <h1 className="text-2xl font-bold">Área de Cadastro</h1>
                <p className="text-balance text-muted-foreground">
                  Kase Box a melhor da região!
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
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha..."
                  {...register("password")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="secondPassword">
                    Digite a Senha Novamente
                  </Label>
                </div>
                <Input
                  id="secondPassword"
                  type="password"
                  placeholder="Digite sua senha..."
                  {...register("secondPassword")}
                />
              </div>

              <Button type="submit" className="w-full">
                Registrar-se
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
                  <span className="sr-only">Login com Google</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Já e Kase Box?{" "}
                <Link
                  to="/auth/entrar"
                  className="underline underline-offset-4"
                >
                  Logar-se
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
