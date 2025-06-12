import { useState, useMemo, useContext, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserContext, FuncionarioDataReq, Endereco } from "@/contexts/UserContext";
import { toast } from "sonner"; 
import axios from "axios";

interface FormProps {
  onClose: () => void;
}

interface FormState extends Omit<FuncionarioDataReq, 'dataNascimento' | 'endereco' | 'cargo'> {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  data_nascimento: string;
  cargo: string; 
  senha: string; 
}

export function FormNewFuncionario({ onClose }: FormProps) {
  const { createFuncionario } = useContext(UserContext)!;

  const [form, setForm] = useState<FormState>({
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
    data_nascimento: "", // YYYY-MM-DD
    escolaridade: "",
    cargo: "", // Corresponde a 'cargo' na interface FuncionarioDataReq
    cref: "",
    senha: "", // Adicionado
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  // Quantos campos foram preenchidos?
  const filledFieldsCount = useMemo(() => {
    // Excluímos campos opcionais ou que não contam para o progresso principal se for o caso
    const relevantFields = { ...form };
    delete relevantFields.cref; // CREF é opcional
    delete relevantFields.uid; // UID não é preenchido pelo usuário

    return Object.values(relevantFields).filter((value) => {
      // Ajuste para Selects que podem ter valor vazio '' mas não são "preenchidos" visualmente
      return typeof value === 'string' && value.trim() !== '';
    }).length;
  }, [form]);

  // Total de campos que consideramos para o progresso
  const totalFields = Object.keys(form).length - 3; // Exclui 'cref', 'complemento', 'uid'

  const progress = Math.round((filledFieldsCount / totalFields) * 100);

  // --- Funções de Formatação de Inputs ---
  const formatCpfInput = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 3) return cleanValue;
    if (cleanValue.length <= 6) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
    if (cleanValue.length <= 9) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
  };

  const formatPhoneInput = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 2) return `(${cleanValue}`;
    if (cleanValue.length <= 7) return `(${cleanValue.slice(0, 2)})${cleanValue.slice(2)}`;
    if (cleanValue.length <= 11) return `(${cleanValue.slice(0, 2)})${cleanValue.slice(2, 7)}-${cleanValue.slice(7)}`;
    return `(${cleanValue.slice(0, 2)})${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
  };

  // --- Handlers de Mudança ---
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "cpf") {
      setForm((prev) => ({ ...prev, [name]: formatCpfInput(value) }));
    } else if (name === "telefone") {
      setForm((prev) => ({ ...prev, [name]: formatPhoneInput(value) }));
    } else if (name === "cep") {
      setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 8) }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleSelectChange(name: keyof FormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // --- Efeito para Buscar Endereço por CEP ---
  useEffect(() => {
    const fetchAddressByCep = async () => {
      const cleanCep = form.cep.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        setCepLoading(true);
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = response.data;

          if (!data.erro) {
            setForm((prev) => ({
              ...prev,
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            }));
          } else {
            toast.error("CEP não encontrado ou inválido.");
            setForm((prev) => ({
              ...prev,
              logradouro: "",
              bairro: "",
              cidade: "",
              uf: "",
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          toast.error("Erro ao buscar CEP. Tente novamente.");
        } finally {
          setCepLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      fetchAddressByCep();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.cep]);

  // --- Função de Submissão do Formulário ---
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      // Limpar máscaras e preparar o objeto Endereco
      const rawCpf = form.cpf.replace(/\D/g, '');
      const rawTelefone = form.telefone.replace(/\D/g, '');
      const rawCep = form.cep.replace(/\D/g, '');

      const endereco: Endereco = {
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento || undefined, // undefined se vazio para não enviar string vazia
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
        cep: rawCep,
      };

      // Montar o objeto FuncionarioDataReq conforme a interface
      const funcionarioToSend: FuncionarioDataReq = {
        nome: form.nome,
        email: form.email,
        telefone: rawTelefone,
        senha: form.senha, // Campo de senha
        cargo: form.cargo, // 'funcao' do formulário mapeia para 'cargo'
        cpf: rawCpf,
        escolaridade: form.escolaridade || undefined,
        cref: form.cref || undefined,
        data_nascimento: form.data_nascimento || undefined, // Backend espera "YYYY-MM-DD" se for string
        endereco: endereco,
        // uid: undefined // UID é gerado pelo backend
      };

      console.log("Data:",funcionarioToSend.data_nascimento )

      await createFuncionario(funcionarioToSend);
      toast.success("Funcionário criado com sucesso!");
      onClose(); // Fecha o formulário
    } catch (error) {
      console.error("Falha ao criar funcionário:", error);
      toast.error("Falha ao criar funcionário. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-[60%] max-h-[90vh] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background shadow-2xl p-12 overflow-auto">
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
        <CardTitle className="text-3xl text-center">Adicionar novo funcionário</CardTitle>
        <CardDescription className="text-center">Registre um novo funcionário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário com onSubmit */}
        <form onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="nome"
              placeholder="Digite o nome completo"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <Input
              id="cpf"
              placeholder="Digite o cpf"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              maxLength={14}
              required
            />
          </div>
          <div className="grid gap-x-8 gap-y-2 mt-6">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              type="date"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
              required
            />
          </div>

          {/* Formação */}
          <h1 className="text-2xl mt-8">Formação</h1>
          <Separator />
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Label htmlFor="cargo">Função</Label>
            <Label htmlFor="escolaridade">Escolaridade</Label>
            <Select
              value={form.cargo}
              onValueChange={(value) => handleSelectChange("cargo", value)}
              required
            >
              <SelectTrigger className="w-full" id="funcao">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professor Interno">Professor Interno</SelectItem>
                <SelectItem value="Professor estagiário">Professor estagiário</SelectItem>
                <SelectItem value="Atendente">Atendente</SelectItem>
                <SelectItem value="Bem-estar">Bem-estar</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={form.escolaridade}
              onValueChange={(value) => handleSelectChange("escolaridade", value)}
              required
            >
              <SelectTrigger className="w-full" id="escolaridade">
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
            <Label htmlFor="cref">CREF <span className="font-light">(opcional)</span></Label>
            <Input
              id="cref"
              placeholder="Digite o código de cref"
              name="cref"
              type="text"
              value={form.cref}
              onChange={handleChange}
            />
          </div>

          {/* Contato e Senha */}
          <h1 className="text-2xl mt-8">Contato e Acesso</h1>
          <Separator />
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Label htmlFor="email">Email</Label>
            <Label htmlFor="telefone">Número de telefone</Label>
            <Input
              id="email"
              placeholder="Digite o email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              id="telefone"
              placeholder="Digite o número"
              name="telefone"
              type="tel"
              value={form.telefone}
              onChange={handleChange}
              maxLength={15}
              required
            />
          </div>
          <div className="grid gap-x-8 gap-y-2 mt-6">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              placeholder="Crie uma senha para o funcionário"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Endereço */}
          <h1 className="text-2xl mt-8">Endereço</h1>
          <Separator />
          <div className="grid [grid-template-columns:2fr_1fr_1fr] gap-x-8 gap-y-2">
            <Label htmlFor="logradouro">Logradouro</Label>
            <Label htmlFor="cep">CEP</Label>
            <Label htmlFor="uf">UF</Label>
            <Input
              id="logradouro"
              placeholder="Digite o logradouro"
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              readOnly={cepLoading}
              required
            />
            <Input
              id="cep"
              placeholder="Digite o CEP"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              maxLength={9}
              required
            />
            <Input
              id="uf"
              placeholder="Digite o UF"
              name="uf"
              value={form.uf}
              onChange={handleChange}
              readOnly={cepLoading}
              required
            />
          </div>
          <div className="grid [grid-template-columns:2fr_2fr_1fr] gap-x-8 gap-y-2 mt-6">
            <Label htmlFor="bairro">Bairro</Label>
            <Label htmlFor="cidade">Cidade</Label>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="bairro"
              placeholder="Digite o bairro"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              readOnly={cepLoading}
              required
            />
            <Input
              id="cidade"
              placeholder="Digite a cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              readOnly={cepLoading}
              required
            />
            <Input
              id="numero"
              placeholder="Digite o número"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-x-8 gap-y-2 mt-6">
            <Label htmlFor="complemento">Complemento <span className="text-[12px] font-light">(opcional)</span></Label>
            <Input
              id="complemento"
              type="text"
              placeholder="Digite o complemento"
              name="complemento"
              value={form.complemento}
              onChange={handleChange}
            />
          </div>

          {/* Botões de Ação */}
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