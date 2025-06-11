import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormProps {
  onClose: () => void;
}

export function FormNewFuncionario({ onClose }: FormProps) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    logradouro: "",
    cep: "",
    uf: "",
    bairro: "",
    cidade: "",
    numero: "",
    complemento: "",
    dataNasc: "",
    escolaridade: "",
    funcao: "",
    cref: ""
  });

  // Quantos campos foram preenchidos?
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

  // Novo handler para os componentes Select
  function handleSelectChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <Card className="w-[60%] max-h-[90vh] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background shadow-2xl p-12 overflow-auto">
      <Button variant="ghost" size="icon"
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Fechar formulário">
        <X className="w-6 h-6" />
      </Button>
      <CardHeader>
        <Progress value={progress} className="w-[50%] mx-auto mb-8" />
        <CardTitle className="text-3xl text-center">Adicionar novo funcionário</CardTitle>
        <CardDescription className="text-center">Registre um novo funcionário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <Label>Nome completo</Label>
          <Label>CPF</Label>
          <Input placeholder="Digite o nome completo" name="nome" value={form.nome} onChange={handleChange} />
          <Input placeholder="Digite o cpf" name="cpf" value={form.cpf} onChange={handleChange} />
        </div>
        <div className="grid gap-x-8 gap-y-2 mt-6">
          <Label>Data nascimento</Label>
          <Input type="date" placeholder="Digite a data de nascimento" name="dataNasc" value={form.dataNasc} onChange={handleChange} />
        </div>

        <h1 className="text-2xl">Formação</h1>
        <Separator />

        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <Label>Função</Label>
          <Label>Escolaridade</Label>
          <Select value={form.funcao} onValueChange={(value) => handleSelectChange("funcao", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professor Interno">Professor Interno</SelectItem>
              <SelectItem value="Professor estagiário">Professor estagiário</SelectItem>
              <SelectItem value="Atendente">Atendente</SelectItem>
              <SelectItem value="Bem-estar">Bem-estar</SelectItem>
            </SelectContent>
          </Select>
          <Select value={form.escolaridade} onValueChange={(value) => handleSelectChange("escolaridade", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a escolaridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ensino médio completo">Ensino médio completo</SelectItem>
              <SelectItem value="Ensino técnico">Ensino técnico</SelectItem>
              <SelectItem value="Ensino superior em andamento">Ensino superior em andamento</SelectItem>
              <SelectItem value="Ensino superior">Ensino superior</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-x-8 gap-y-2">
          <Label>CREF <span className="font-light">(opcional)</span></Label>
          <Input placeholder="Digite o código de cref" name="cref" type="text" value={form.cref} onChange={handleChange} />
        </div>

        <h1 className="text-2xl">Contato</h1>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <Label>Email</Label>
          <Label>Número de telefone</Label>
          <Input placeholder="Digite o email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input placeholder="Digite o número" name="telefone" type="tel" value={form.telefone} onChange={handleChange} />
        </div>

        <h1 className="text-2xl">Endereço</h1>
        <Separator />
        <div className="grid [grid-template-columns:2fr_1fr_1fr] gap-x-8 gap-y-2">
          <Label>Logradouro</Label>
          <Label>CEP</Label>
          <Label>UF</Label>
          <Input placeholder="Digite o logradouro" name="logradouro" value={form.logradouro} onChange={handleChange} />
          <Input placeholder="Digite o CEP" name="cep" value={form.cep} onChange={handleChange} />
          <Input placeholder="Digite o UF" name="uf" value={form.uf} onChange={handleChange} />
        </div>
        <div className="grid [grid-template-columns:2fr_2fr_1fr] gap-x-8 gap-y-2 mt-6">
          <Label>Bairro</Label>
          <Label>Cidade</Label>
          <Label>Número</Label>
          <Input placeholder="Digite o bairro" name="bairro" value={form.bairro} onChange={handleChange} />
          <Input placeholder="Digite a cidade" name="cidade" value={form.cidade} onChange={handleChange} />
          <Input placeholder="Digite o número" name="numero" value={form.numero} onChange={handleChange} />
        </div>
        <div className="grid gap-x-8 gap-y-2 mt-6">
          <Label>Complemento <span className="text-[12px] font-light">(opcional)</span></Label>
          <Input type="text" placeholder="Digite o complemento" name="complemento" value={form.complemento} onChange={handleChange} />
        </div>
        <div className="grid gap-x-8 gap-y-2 mt-6">
          <Label>Plano desejado</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Plano mensal">Plano mensal</SelectItem>
              <SelectItem value="Plano trimestral">Plano trimestral</SelectItem>
              <SelectItem value="Plano semestral">Plano semestral</SelectItem>
              <SelectItem value="TotalPass">TotalPass</SelectItem>
              <SelectItem value="WellHub">WellHub</SelectItem>
            </SelectContent>
          </Select>
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