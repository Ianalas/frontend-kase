import { createContext, ReactNode, useState, useCallback } from "react"; // <--- Importe useCallback
import { apiUser } from "@/lib/axiosUser"; 

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Funcionario {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone?: string;
  uid: string;
  data_nascimento?: string;
  endereco?: string | Endereco; // Pode ser string JSON ou objeto Endereco
  createdAt: string;
  updatedAt: string;
  cargo: string;
  escolaridade?: string;
  cref?: string;
}


export interface Aula {
  id: number;
  nome: string; // Nome da aula (ex: "Treino de funcional")
  modalidade: string;
  horario: string; // "2025-06-20T18:30:00.000Z" (ISO 8601 string)
  descricao: string; // A descrição da aula
  createdAt: string;
  updatedAt: string;
  funcionario: Funcionario; // <--- A propriedade mais importante que mudou!
}


export interface CreateAulaDto {
  nome: string;
  modalidade: string;
  descricao: string;
  horario: string;
  funcionarioNome: string; 
}

export interface UpdateAulaDto {
  nome?: string;
  modalidade?: string;
  descricao?: string;
  horario?: string;
  funcionarioNome?: string;
}


interface ClassContextType {
  aulas: Aula[];
  aulaSelecionada: Aula | null;
  loading: boolean;
  error: any | null;

  createAula: (data: CreateAulaDto) => Promise<Aula>;
  findAllAulas: () => Promise<Aula[]>;
  findOneAula: (id: number) => Promise<Aula>;
  findByModalidade: (modalidade: string) => Promise<Aula[]>;
  findByData: (data: string) => Promise<Aula[]>;
  updateAula: (id: number, data: UpdateAulaDto) => Promise<Aula>;
  removeAula: (id: number) => Promise<void>;
}

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassContext = createContext<ClassContextType | undefined>(undefined);

export function ClassProvider({ children }: ClassProviderProps) {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [aulaSelecionada, setAulaSelecionada] = useState<Aula | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const createAula = useCallback(async (data: CreateAulaDto): Promise<Aula> => {
    setLoading(true);
    setError(null);
    try {
      console.log(data.nome)
      const response = await apiUser.post<Aula>("/aula", data);
      setAulas((prev) => [...prev, response.data]);
      setAulaSelecionada(response.data);
      return response.data;
    } catch (e) {
      console.error("Erro ao criar aula:", e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []); 

  const findAllAulas = useCallback(async (): Promise<Aula[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<Aula[]>("/aula");
      setAulas(response.data);
      return response.data;
    } catch (e) {
      console.error("Erro ao buscar todas as aulas:", e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const findOneAula = useCallback(async (id: number): Promise<Aula> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<Aula>(`/aula/${id}`);
      setAulaSelecionada(response.data);
      return response.data;
    } catch (e) {
      console.error(`Erro ao buscar aula com ID ${id}:`, e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const findByModalidade = useCallback(async (modalidade: string): Promise<Aula[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<Aula[]>(`/aula/modalidade/${modalidade}`);
      return response.data;
    } catch (e) {
      console.error(`Erro ao buscar aulas por modalidade "${modalidade}":`, e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const findByData = useCallback(async (data: string): Promise<Aula[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<Aula[]>(`/aula/data/${data}`);
      return response.data;
    } catch (e) {
      console.error(`Erro ao buscar aulas por data "${data}":`, e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAula = useCallback(async (id: number, data: UpdateAulaDto): Promise<Aula> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.patch<Aula>(`/aula/${id}`, data);
      setAulas((prev) => prev.map((aula) => (aula.id === id ? response.data : aula)));
      if (aulaSelecionada && aulaSelecionada.id === id) {
        setAulaSelecionada(response.data);
      }
      return response.data;
    } catch (e) {
      console.error(`Erro ao atualizar aula com ID ${id}:`, e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [aulaSelecionada]);

  const removeAula = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiUser.delete(`/aula/${id}`);
      setAulas((prev) => prev.filter((aula) => aula.id !== id));
      if (aulaSelecionada && aulaSelecionada.id === id) {
        setAulaSelecionada(null);
      }
    } catch (e) {
      console.error(`Erro ao remover aula com ID ${id}:`, e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [aulaSelecionada]);

  return (
    <ClassContext.Provider
      value={{
        aulas,
        aulaSelecionada,
        loading,
        error,
        createAula,
        findAllAulas,
        findOneAula,
        findByModalidade,
        findByData,
        updateAula,
        removeAula,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}