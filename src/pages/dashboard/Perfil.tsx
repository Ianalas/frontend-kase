import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, PerfilSchema } from "@/schemas/perfil.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Dumbbell,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/section";

export function Perfil() {
  const [isNameEditable, setIsNameEditable] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PerfilSchema>({
    resolver: zodResolver(profileSchema),
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onSubmit: SubmitHandler<PerfilSchema> = (data) => {
    console.log(data);
    // enviar para Supabase ou backend
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <Section className="w-3/4 min-h-full flex justify-center items-center ">
      <Card className="max-w-2xl mx-auto p-6 w-[50%] bg-transparent">
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col justify-center items-center"
          >
            <div className="space-y-2 w-[75%]">
              <Label htmlFor="image" className="flex items-center gap-2">
                <ImageIcon size={16} />
                Foto de perfil
              </Label>
              <Input
                className="h-10"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Prévia"
                  className="h-24 w-24 rounded-full mt-2 object-cover"
                />
              )}
              {errors.profileImage && (
                <p className="text-sm text-red-500">
                  {errors.profileImage.message}
                </p>
              )}
            </div>

            <div className={`space-y-2 w-[75%] ${!isNameEditable ? "cursor-not-allowed" : "cursor-alias"  }`}>
              <div className="flex items-center justify-between ">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User size={16} />
                  Nome
                </Label>
                <button
                  type="button"
                  onClick={() => setIsNameEditable(!isNameEditable)}
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <Pencil size={16} />
                  Editar
                </button>
              </div>
              <Input
                id="name"
                className="h-10"
                disabled={!isNameEditable}
                {...register("name")}
                placeholder="Seu nome completo"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2 w-[75%]">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                Email
              </Label>
              <Input
                className="h-10"
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 w-[75%]">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={16} />
                Telefone
              </Label>
              <Input
                className="h-10"
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="(00) 00000-0000"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2 w-[75%] cursor-not-allowed">
              <Label htmlFor="plan" className="flex items-center gap-2">
                <Dumbbell size={16} />
                Plano de academia
              </Label>
              <Input
                className="h-10"
                id="plan"
                disabled
                {...register("plan")}
                placeholder="Mensal, Trimestral, etc."
              />
            </div>

            <div className="space-y-2 w-[75%]">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Fale um pouco sobre você..."
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button type="submit" className="w-auto p-6">
              Salvar alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </Section>
  );
}
