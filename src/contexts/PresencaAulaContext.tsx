import { apiUser } from "@/lib/axiosUser";
import { createContext, ReactNode, useCallback, useMemo, useState } from "react";

export interface Aluno {
  uid: string; 
  nome: string;
}

export interface Aula {
  id: number;
  nome: string;
  modalidade: string;
  horario: string; 
  funcionario?: {
    nome: string;
  };
}

export interface PresencaAula {
  id: number;
  dataCheckin: string;
  aluno: Aluno;
  aula: Aula;
}

export interface DesempenhoRelatorio {
  dia: string;
  minutos: number;
}

export interface PlanoRelatorio {
  plano: string;
}

export interface PresencaAulaContextType {
  presencas: PresencaAula[];
  desempenho: DesempenhoRelatorio[];
  presencaSelecionada: PresencaAula | null;
  loading: boolean;
  error: any | null;

  plano: PlanoRelatorio;

  findAllPresencas: () => Promise<PresencaAula[]>;

  findOnePresenca: (id: number) => Promise<PresencaAula | null>;
  
  findPresencasByAlunoId: (alunoId: string) => Promise<PresencaAula[]>;
  
  findPresencasByAulaId: (aulaId: string) => Promise<PresencaAula[]>;

  getRelatorioDays: (alunoId: string) => Promise<DesempenhoRelatorio[]>;

  getRelatorioPlans:  (alunoId: string) => Promise<PlanoRelatorio>;
}

interface PresencaAulaProviderProps {
  children: ReactNode;
}

export const PresencaAulaContext = createContext<PresencaAulaContextType | undefined>(undefined);

export function PresencaAulaProvider({ children }: PresencaAulaProviderProps) {
  const [presencas, setPresencas] = useState<PresencaAula[]>([]);

  const [desempenho, setDesempenho] = useState<DesempenhoRelatorio[]>([]);
  const [plano, setPlano] = useState<PlanoRelatorio>({} as PlanoRelatorio);

  const [presencaSelecionada, setPresencaSelecionada] = useState<PresencaAula | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const getRelatorioPlans = useCallback(async ( alunoId:string ): Promise<PlanoRelatorio> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<PlanoRelatorio>(`/alunos/${alunoId}/plano`);
      setPlano(response.data)
      return response.data;
    } catch (e: any) {
      console.error('Erro ao buscar todas as presenças:', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRelatorioDays = useCallback(async ( alunoId:string ): Promise<DesempenhoRelatorio[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<DesempenhoRelatorio[]>(`/alunos/${alunoId}/desempenho`);
      setDesempenho(response.data)
      return response.data;
    } catch (e: any) {
      console.error('Erro ao buscar todas as presenças:', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const findAllPresencas = useCallback(async (): Promise<PresencaAula[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<PresencaAula[]>('/presencas');
      setPresencas(response.data)
      return response.data;
    } catch (e: any) {
      console.error('Erro ao buscar todas as presenças:', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const findOnePresenca = useCallback(async (id: number): Promise<PresencaAula | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<PresencaAula>(`/presencas/${id}`);
      setPresencaSelecionada(response.data);
      return response.data;
    } catch (e: any) {
      console.error(`Erro ao buscar presença com ID ${id}:`, e);
      setError(e);
      if (e.response && e.response.status === 404) {
        return null;
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const findPresencasByAlunoId = useCallback(async (alunoId: string): Promise<PresencaAula[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUser.get<PresencaAula[]>(`/presencas/aluno/${alunoId}`);
      console.log("dsds", response.data)
      setPresencas(response.data); 
      return response.data;
    } catch (e: any) {
      console.error(`Erro ao buscar presenças para o aluno ID ${alunoId}:`, e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const findPresencasByAulaId = useCallback(async (aulaId: string): Promise<PresencaAula[]> => {
    setLoading(true);
    setError(null);
    try {

      const response = await apiUser.get<PresencaAula[]>(`/presencas/aula/${aulaId}`);
     
      return response.data;
    } catch (e: any) {
      console.error(`Erro ao buscar presenças para a aula ID ${aulaId}:`, e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    desempenho,
    getRelatorioDays,
    plano,
    getRelatorioPlans,
    presencas,
    presencaSelecionada,
    loading,
    error,
    findAllPresencas,
    findOnePresenca,
    findPresencasByAlunoId,
    findPresencasByAulaId,
  }), [
    desempenho,
    getRelatorioDays,
    plano,
    getRelatorioPlans,
    presencas,
    presencaSelecionada,
    loading,
    error,
    findAllPresencas,
    findOnePresenca,
    findPresencasByAlunoId,
    findPresencasByAulaId,
  ]);

  return (
    <PresencaAulaContext.Provider value={contextValue}>
      {children}
    </PresencaAulaContext.Provider>
  );
}