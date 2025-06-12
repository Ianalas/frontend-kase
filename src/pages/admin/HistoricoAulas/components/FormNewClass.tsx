import { useState, useMemo, useContext, useEffect } from "react";
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
import { ClassContext, CreateAulaDto } from "@/contexts/ClassContext"; // Importe o ClassContext e CreateAulaDto
import { UserContext } from "@/contexts/UserContext"; // Assumindo que você tem um UserContext para buscar funcionários
import { toast } from "sonner"; // Para notificações

interface FormProps {
  onClose: () => void;
}

// O FormData agora espelha CreateAulaDto e inclui o plano (que não vai direto para o DTO da aula)
interface FormData {
  nome: string; // Nome da aula
  modalidade: string; // Modalidade da aula
  descricao: string;
  horario: string; // "YYYY-MM-DDTHH:mm" ou "HH:mm" + data atual
  funcionarioNome: string; // Nome do funcionário
  plano: string; // Para "Planos permitidos"
  dataAula: string; // Adicionado para selecionar a data da aula
}

export function FormNewClass({ onClose }: FormProps) {
  const { createAula } = useContext(ClassContext)!;
  const { getAllFuncionarios, funcionarioAll } = useContext(UserContext)!; // Para buscar os funcionários

  const [form, setForm] = useState<FormData>({
    nome: "",
    modalidade: "",
    descricao: "",
    horario: "", 
    funcionarioNome: "",
    plano: "Todos", 
    dataAula: "", 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    getAllFuncionarios();
  }, []);

  const filledFieldsCount = useMemo(() => {
    const relevantFields = { ...form };

    return Object.values(relevantFields).filter((value) => {
      return typeof value === 'string' && value.trim() !== '';
    }).length;
  }, [form]);

  const totalFields = Object.keys(form).length - 2; 
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

  // Função de submissão do formulário
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const combinedDateTime = `${form.dataAula}T${form.horario}:00`; // Ex: "2025-06-12T14:30:00"
      const horarioIsoString = new Date(combinedDateTime).toISOString(); // Converte para ISO String

      const aulaToCreate: CreateAulaDto = {
        nome: form.nome,
        modalidade: form.modalidade,
        descricao: form.descricao,
        horario: horarioIsoString, // Envia o horário formatado para ISO String
        funcionarioNome: form.funcionarioNome,
      };

      await createAula(aulaToCreate);
      toast.success("Aula criada com sucesso!");
      onClose(); // Fecha o formulário
    } catch (error: any) {
      console.error("Falha ao criar aula:", error);
      toast.error(`Falha ao criar aula: ${error.response?.data?.message || error.message || "Erro desconhecido"}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-[60%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background shadow-2xl p-12 overflow-auto max-h-[90vh]">
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-x-8 gap-y-2 mb-6">
            <Label htmlFor="nome">Nome da Aula</Label>
            <Input
              id="nome"
              placeholder="Ex: Treino de Boxe para Iniciantes"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Label htmlFor="funcionarioNome">Funcionário Responsável</Label>
            <Label htmlFor="modalidade">Modalidade</Label>

            <Select
              value={form.funcionarioNome}
              onValueChange={(value) => handleSelectChange("funcionarioNome", value)}
              required
            >
              <SelectTrigger className="w-full" id="funcionarioNome">
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {funcionarioAll.length > 0 ? (
                  funcionarioAll.map((func) => (
                    <SelectItem key={func.id} value={func.nome}>
                      {func.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="Carregando" disabled>Carregando funcionários...</SelectItem>
                )}
              </SelectContent>
            </Select>

            <Select
              value={form.modalidade}
              onValueChange={(value) => handleSelectChange("modalidade", value)}
              required
            >
              <SelectTrigger className="w-full" id="modalidade">
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cross-fit">Cross-fit</SelectItem>
                <SelectItem value="Muay-Thai">Muay-Thai</SelectItem>
                <SelectItem value="Jiu-Jitsu">Jiu-Jitsu</SelectItem>
                <SelectItem value="Boxe">Boxe</SelectItem>
                <SelectItem value="Funcional">Funcional</SelectItem>
                {/* Adicione outras modalidades conforme necessário */}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6">
            <Label htmlFor="dataAula">Data da Aula</Label>
            <Label htmlFor="horario">Horário da Aula</Label>
            <Input
              id="dataAula"
              type="date"
              name="dataAula"
              value={form.dataAula}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <Input
                id="horario"
                type="time"
                name="horario"
                value={form.horario}
                onChange={handleChange}
                className="pr-10 text-white form-input"
                required
              />
              <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
            </div>
          </div>

          <h1 className="text-2xl mt-12">Avançado</h1>
          <Separator />

          {/* Planos permitidos e Descrição */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Label htmlFor="plano">Planos permitidos</Label>
            <Label htmlFor="descricao">
              Descrição <span className="text-[12px] font-light">(opcional)</span>
            </Label>

            <Select
              value={form.plano}
              onValueChange={(value) => handleSelectChange("plano", value)}
            >
              <SelectTrigger className="w-full" id="plano">
                <SelectValue placeholder="Selecione uma das opções" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Somente internos">Somente internos</SelectItem>
                <SelectItem value="Somente externos">Somente externos</SelectItem>
              </SelectContent>
            </Select>

            <Input
              id="descricao"
              type="text"
              placeholder="Digite a descrição"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}