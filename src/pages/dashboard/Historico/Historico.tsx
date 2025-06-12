import { useEffect, useContext } from "react";
import { DataPicker } from "@/components/data_picker";
import { DropDownMenu } from "@/components/dropdown_menu";
import { Section } from "@/components/section";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListFilter, Search, X } from "lucide-react";
import { TableRowHistoric } from "./components/TableRowHistoric"; 

import { PresencaAulaContext } from "@/contexts/PresencaAulaContext";
import { AuthContext } from "@/contexts/Autetication"; // Seu AuthContext

export function Historico() {
  const { presencas, loading: presencasLoading, error, findPresencasByAlunoId } = useContext(PresencaAulaContext)!;
  const { user, loading: authLoading } = useContext(AuthContext)!;

  useEffect(() => {
   
    if (!authLoading && user && user.uid) {
      findPresencasByAlunoId(user.uid);
    } else if (!authLoading && !user) {
      console.warn("Usuário não autenticado. Não é possível buscar histórico de aulas.");
    }
    
  }, [authLoading, user, findPresencasByAlunoId]); 

  return (
    <Section className="w-3/4 min-h-full flex flex-col mb-24">
      <h1 className="text-left text-4xl md:text-5xl mb-4 font-sans">Histórico de Aulas</h1>

      <div className="flex max-2xl:w-[100%] 2xl:w-[70%] gap-3 mb-6">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
          Filtros <ListFilter className="w-4 h-4" />
        </div>
        <div className="min-w-48">
          <DataPicker className="w-full" />
        </div>
        <div className="min-w-0">
          <DropDownMenu
            list={["Todas Modalidades", "Muay-Thai", "Jiu-Jitsu", "Boxe"]}
            className="w-full"
          />
        </div>
        <Button
          variant="default"
          className="flex justify-center items-center gap-2 max-w-full"
        >
          <Search className="w-4 h-4" /> Filtrar Resultados
        </Button>
        <Button
          variant="secondary"
          className="flex justify-center items-center gap-2 max-w-full"
        >
          <X className="w-4 h-4" /> Remover Filtros
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border border-grey-900">
        <Table className="w-full p-6">
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead className="w-36"><p className="font-semibold text-gray-300">Data de Realização</p></TableHead>
              <TableHead className="w-36"></TableHead>
              <TableHead className="w-52"><p className="font-semibold text-gray-300 ml-2">Status</p></TableHead>
              <TableHead className="w-48"><p className="font-semibold text-gray-300">Professor</p></TableHead>
              <TableHead className="w-80"></TableHead>
              <TableHead><p className="font-semibold text-gray-300">Modalidade</p></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-6">
            {authLoading ? ( 
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Verificando autenticação...</TableCell>
              </TableRow>
            ) : presencasLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Carregando histórico de aulas...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500 py-8">
                  Erro ao carregar histórico: {error.message || "Erro desconhecido."}
                </TableCell>
              </TableRow>
            ) : presencas.length > 0 ? ( 
              presencas.map((presenca) => (
                <TableRowHistoric key={presenca.id} presenca={presenca} />
              ))
            ) : ( 
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Nenhuma presença de aula encontrada para este aluno.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}