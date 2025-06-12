import { apiUser } from "@/lib/axiosUser"; // Verifique se o caminho para apiUser está correto
import { createContext, ReactNode, useState } from "react";

// --- Interfaces (Sem alterações, elas já estão corretas como você as passou) ---
export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface FuncionarioDataReq {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  cargo: string;
  cpf: string;
  escolaridade?: string;
  cref?: string;
  data_nascimento?: string; // Mantido como string, o input type="date" retorna string YYYY-MM-DD
  endereco?: Endereco;
  uid?: string;
}

export interface FuncionarioDataResp {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  uid: string;
  data_nascimento: string; // Resposta pode vir como string também
  endereco?: Endereco;
  createdAt: string;
  updatedAt: string;
  cargo: string;
  escolaridade: string;
  cref: string;
}

export interface AlunoDataResp {
  uid?: string;
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: Endereco;
  plano: string;
  origem: string;
  inicio_plano: string;
  createdAt: string;
  updatedAt: string;
  inadimplente: string;
}

export interface AlunoDataReq {
  nome: string;
  cpf: string;
  email: string;
  senha: string; 
  telefone?: string;
  data_nascimento?: string;
  endereco?: Endereco;
  plano: string;
  origem: string;
  inicio_plano: string;
}

// --- UserContextType: Corrigindo tipos e retornos ---
interface UserContextType {
  funcionarioData: FuncionarioDataResp | null;
  funcionarioAll: FuncionarioDataResp[];
  createFuncionario: (data: FuncionarioDataReq) => Promise<FuncionarioDataResp>; // Adicionado retorno para usar a resposta da API
  getAllFuncionarios: () => Promise<FuncionarioDataResp[]>;
  getFuncionarioByUid: (uid: string) => Promise<FuncionarioDataResp>;
  getFuncionarioByCpf: (cpf: string) => Promise<FuncionarioDataResp>;
  getFuncionariosByCargo: (cargo: string) => Promise<FuncionarioDataResp[]>;
  updateFuncionario: (uid: string, data: Partial<FuncionarioDataReq>) => Promise<FuncionarioDataResp>; // Mudado para Partial<FuncionarioDataReq> para permitir atualização parcial com campos da requisição
  updateFuncionarioWithTimestamp: (uid: string, data: Partial<FuncionarioDataReq>) => Promise<FuncionarioDataResp>; // Mesma alteração aqui
  refreshUpdatedAt: (uid: string) => Promise<FuncionarioDataResp>; // Adicionado retorno
  deleteFuncionario: (uid: string) => Promise<void>;

  alunoData: AlunoDataResp | null;
  alunoAll: AlunoDataResp[]; // Adicionado estado para todos os alunos
  createAluno: (aluno: AlunoDataReq) => Promise<AlunoDataResp>; // Adicionado retorno
  findAlunoByCpfPublic: (cpf: string) => Promise<AlunoDataResp>; // Retorno completo, se a API retornar
  findAllAlunos: () => Promise<AlunoDataResp[]>; // Retorno de AlunoDataResp[]
  findAlunoByUid: (uid: string) => Promise<AlunoDataResp>; // Retorno de AlunoDataResp
  updateAluno: (uid: string, aluno: Partial<AlunoDataReq>) => Promise<AlunoDataResp>; // Mudado para Partial<AlunoDataReq>
  updateAlunoWithTimestamp: (uid: string, aluno: Partial<AlunoDataReq>) => Promise<AlunoDataResp>; // Mesma alteração aqui
  refreshAlunoTimestamp: (uid: string) => Promise<void>; // Retorno void
  deleteAluno: (uid: string) => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [funcionarioData, setFuncionarioData] = useState<FuncionarioDataResp | null>(null);
  const [alunoData, setAlunoData] = useState<AlunoDataResp | null>(null); // Tipo corrigido para AlunoDataResp
  const [funcionarioAll, setFuncionarioAll] = useState<FuncionarioDataResp[]>([]);
  const [alunoAll, setAlunoAll] = useState<AlunoDataResp[]>([]); // Adicionado estado para alunoAll

  /* FUNCIONARIO */

  const createFuncionario = async (data: FuncionarioDataReq): Promise<FuncionarioDataResp> => {
    try {
      const response = await apiUser.post("/funcionarios", data);
      // Ao criar, você provavelmente quer adicionar o novo funcionário à lista existente
      setFuncionarioAll((prev) => [...prev, response.data]);
      setFuncionarioData(response.data); // Opcional, para manter o último criado
      return response.data;
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      throw error;
    }
  };

  const getAllFuncionarios = async (): Promise<FuncionarioDataResp[]> => {
    try {
      const response = await apiUser.get("/funcionarios");
      setFuncionarioAll(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todos os funcionários:", error);
      throw error;
    }
  };

  const getFuncionarioByUid = async (uid: string): Promise<FuncionarioDataResp> => {
    try {
      const response = await apiUser.get(`/funcionarios/${uid}`);
      setFuncionarioData(response.data); // Atualiza o estado de um único funcionário
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário por UID ${uid}:`, error);
      throw error;
    }
  };

  const getFuncionarioByCpf = async (cpf: string): Promise<FuncionarioDataResp> => {
    try {
      const response = await apiUser.get(`/funcionarios/cpf/${cpf}`);
      setFuncionarioData(response.data); // Atualiza o estado de um único funcionário
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário por CPF ${cpf}:`, error);
      throw error;
    }
  };

  const getFuncionariosByCargo = async (cargo: string): Promise<FuncionarioDataResp[]> => {
    try {
      const response = await apiUser.get(`/funcionarios/cargo/${cargo}`);
      // setFuncionarioAll(response.data); // Se você quiser atualizar a lista de todos com base no cargo
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionários por cargo ${cargo}:`, error);
      throw error;
    }
  };

  const updateFuncionario = async (uid: string, data: Partial<FuncionarioDataReq>): Promise<FuncionarioDataResp> => {
    try {
      const response = await apiUser.patch(`/funcionarios/${uid}`, data);
      setFuncionarioData(response.data);
      // Atualiza a lista 'funcionarioAll' com o funcionário atualizado
      setFuncionarioAll((prev) =>
        prev.map((func) => (func.uid === uid ? response.data : func))
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${uid}:`, error);
      throw error;
    }
  };

  const updateFuncionarioWithTimestamp = async (uid: string, data: Partial<FuncionarioDataReq>): Promise<FuncionarioDataResp> => {
    try {
      const response = await apiUser.patch(`/funcionarios/${uid}/with-timestamp`, data);
      setFuncionarioData(response.data);
      // Atualiza a lista 'funcionarioAll' com o funcionário atualizado
      setFuncionarioAll((prev) =>
        prev.map((func) => (func.uid === uid ? response.data : func))
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${uid} com timestamp:`, error);
      throw error;
    }
  };

  const refreshUpdatedAt = async (uid: string): Promise<FuncionarioDataResp> => {
    try {
      const response = await apiUser.patch(`/funcionarios/${uid}/refresh-timestamp`);
      setFuncionarioData(response.data);
      setFuncionarioAll((prev) =>
        prev.map((func) => (func.uid === uid ? response.data : func))
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar timestamp do funcionário ${uid}:`, error);
      throw error;
    }
  };

  const deleteFuncionario = async (uid: string): Promise<void> => {
    try {
      await apiUser.delete(`/funcionarios/${uid}`);
      setFuncionarioData(null); // Limpa o funcionário selecionado
      // Remove o funcionário da lista 'funcionarioAll'
      setFuncionarioAll((prev) => prev.filter((func) => func.uid !== uid));
    } catch (error) {
      console.error(`Erro ao deletar funcionário ${uid}:`, error);
      throw error;
    }
  };

  /* ALUNOS */

  const createAluno = async (data: AlunoDataReq): Promise<AlunoDataResp> => {
    try {
      const response = await apiUser.post("/aluno", data);
      setAlunoAll((prev) => [...prev, response.data]); // Adiciona à lista de todos
      setAlunoData(response.data); // Opcional, para manter o último criado
      return response.data;
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      throw error;
    }
  };

  const findAlunoByCpfPublic = async (cpf: string): Promise<AlunoDataResp> => { // Retorno AlunoDataResp
    try {
      const response = await apiUser.get(`/aluno/cpf/${cpf}`);
      setAlunoData(response.data); // Atualiza o estado de um único aluno
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar aluno por CPF ${cpf}:`, error);
      throw error;
    }
  };

  const findAllAlunos = async (): Promise<AlunoDataResp[]> => {
    try {
      const response = await apiUser.get("/aluno");
      setAlunoAll(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todos os alunos:", error);
      throw error;
    }
  };

  const findAlunoByUid = async (uid: string): Promise<AlunoDataResp> => {
    try {
      const response = await apiUser.get(`/aluno/${uid}`);
      setAlunoData(response.data); // Atualiza o estado de um único aluno
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar aluno por UID ${uid}:`, error);
      throw error;
    }
  };

  const updateAluno = async (uid: string, data: Partial<AlunoDataReq>): Promise<AlunoDataResp> => {
    try {
      const response = await apiUser.patch(`/aluno/${uid}`, data);
      setAlunoData(response.data);
      // Atualiza a lista 'alunoAll' com o aluno atualizado
      setAlunoAll((prev) =>
        prev.map((aluno) => (aluno.uid === uid ? response.data : aluno))
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar aluno ${uid}:`, error);
      throw error;
    }
  };

  const updateAlunoWithTimestamp = async (uid: string, data: Partial<AlunoDataReq>): Promise<AlunoDataResp> => {
    try {
      const response = await apiUser.patch(`/aluno/${uid}/with-timestamp`, data);
      setAlunoData(response.data);
      setAlunoAll((prev) =>
        prev.map((aluno) => (aluno.uid === uid ? response.data : aluno))
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar aluno ${uid} com timestamp:`, error);
      throw error;
    }
  };

  const refreshAlunoTimestamp = async (uid: string): Promise<void> => {
    try {
      await apiUser.patch(`/aluno/${uid}/refresh-timestamp`);
    } catch (error) {
      console.error(`Erro ao atualizar timestamp do aluno ${uid}:`, error);
      throw error;
    }
  };

  const deleteAluno = async (uid: string): Promise<void> => {
    try {
      await apiUser.delete(`/aluno/${uid}`);
      setAlunoData(null); // Limpa o aluno selecionado
      // Remove o aluno da lista 'alunoAll'
      setAlunoAll((prev) => prev.filter((aluno) => aluno.uid !== uid));
    } catch (error) {
      console.error(`Erro ao deletar aluno ${uid}:`, error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        funcionarioData,
        funcionarioAll,
        createFuncionario,
        getAllFuncionarios,
        getFuncionarioByUid,
        getFuncionarioByCpf,
        getFuncionariosByCargo,
        updateFuncionario,
        updateFuncionarioWithTimestamp,
        refreshUpdatedAt,
        deleteFuncionario,

        alunoData,
        alunoAll, // Exportando o estado alunoAll
        createAluno,
        findAlunoByCpfPublic,
        findAllAlunos,
        findAlunoByUid,
        updateAluno,
        updateAlunoWithTimestamp,
        refreshAlunoTimestamp,
        deleteAluno,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}