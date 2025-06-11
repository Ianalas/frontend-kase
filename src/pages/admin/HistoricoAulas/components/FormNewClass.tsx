import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { X, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormProps {
  onClose: () => void;
}

interface FormData {
  nome: string;
  horario: string;
  descricao: string;
  plano: string;
}

export function FormNewClass({ onClose }: FormProps) {
  const [form, setForm] = useState<FormData>({
    nome: "",
    horario: "",
    descricao: "",
    plano: "Todos",
  });

  const filledFieldsCount = useMemo(() => {
    return Object.values(form).filter((value) => value.trim() !== "").length;
  }, [form]);

  const totalFields = Object.keys(form).length;
  const progress = Math.round((filledFieldsCount / totalFields) * 100);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSelectChange(name: keyof FormData, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <Card className="w-[60%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background shadow-2xl p-12">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
        aria-label="Fechar formulário"
      >
        <X className="w-6 h-6" />
      </Button>

      <CardHeader>
        <Progress value={progress} className="w-[50%] mx-auto mb-8" />
        <CardTitle className="text-3xl text-center">Adicionar nova aula</CardTitle>
        <CardDescription className="text-center">Registre uma nova aula</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <Label>Funcionário Responsável</Label>
          <Label>Modalidade</Label>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prof. Girafelas">Prof. Girafelas</SelectItem>
              <SelectItem value="Profa. Toguro">Profa. Toguro</SelectItem>
              <SelectItem value="Dr. Renato Cariani">Dr. Renato Cariani</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cross-fit">Cross-fit</SelectItem>
              <SelectItem value="Muay-Thai">Muay-Thai</SelectItem>
              <SelectItem value="Funcional">Funcional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Horário da Aula com ícone */}
        <div className="grid gap-x-8 gap-y-2 w-[25%]">
          <Label htmlFor="horario">Horário da aula</Label>
          <div className="relative">
            <Input
              id="horario"
              type="time"
              name="horario"
              value={form.horario}
              onChange={handleChange}
              className="pr-10 text-white form-input"
            />
            <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
          </div>
        </div>

        <h1 className="text-2xl mt-12">Avançado</h1>
        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <Label>Planos permitidos</Label>
          <Label>
            Descrição <span className="text-[12px] font-light">(opcional)</span>
          </Label>

          <Select
            value={form.plano}
            onValueChange={(value) => handleSelectChange("plano", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma das opções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Somente internos">Somente internos</SelectItem>
              <SelectItem value="Somente externos">Somente externos</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Digite a descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </CardContent>
    </Card>
  );
}