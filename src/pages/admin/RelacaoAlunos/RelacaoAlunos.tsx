import { useContext, useEffect, useState } from "react";
import { DataPicker } from "@/components/data_picker";
import { DropDownMenu } from "@/components/dropdown_menu";
import { Section } from "@/components/section";
// Importe TableCell se ainda não estiver importado
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListFilter, Plus, Search, X } from "lucide-react";
import { TableRowRelation } from "@/pages/admin/RelacaoAlunos/components/TableRowRelation"; // Assumindo que você terá um componente TableRowRelationAluno
import { FormNewAluno } from "./components/FormNewAluno";
import { UserContext } from "@/contexts/UserContext"; // Importa o UserContext

export function RelacaoAlunos() {
  // Consome o contexto para obter os dados dos alunos e a função de busca
  const { alunoAll, findAllAlunos } = useContext(UserContext)!;

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Função assíncrona para buscar os alunos
    const fetchAlunos = async () => {
      setLoading(true);
      try {
        await findAllAlunos(); // Chama a função do contexto para buscar todos os alunos
      } catch (e) {
        console.error("Erro ao buscar alunos:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []); 

  return (
    <Section className="w-3/4 min-h-full flex flex-col mb-24">
      <h1 className="text-left text-4xl md:text-4xl mb-4 font-sans">Relação de Alunos</h1>

      {/* Filtros */}
      <div className="flex 2xl:w-[100%] gap-3 mb-6">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
          Filtros <ListFilter className="w-4 h-4" />
        </div>
        <div className="min-w-48">
          <DataPicker className="w-full" />
        </div>
        <div className="min-w-0">
          <DropDownMenu
            list={["Todas Modalidades", "Muay-Thai", "Jiu-Jitsu", "Boxe"]} // Exemplo de modalidades
            className="w-full"
          />
        </div>
        <Button variant="default" className="flex justify-center items-center gap-2 max-w-full">
          <Search className="w-4 h-4" /> Filtrar Resultados
        </Button>
        <Button variant="secondary" className="flex justify-center items-center gap-2 max-w-full">
          <X className="w-4 h-4" /> Remover Filtros
        </Button>
        <Button className="ml-auto cursor-pointer hover:bg-red-700" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Adicionar aluno
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border border-grey-900">
        <Table className="w-full p-6">
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-24"></TableHead> {/* Coluna para o ícone de expandir/detalhes */}
              <TableHead className="w-36">
                <p className="font-semibold text-gray-300">Nome completo</p>
              </TableHead>
              <TableHead className="w-24" />
              <TableHead className="w-44">
                <p className="font-semibold text-gray-300 text-center">Data Entrada</p>
              </TableHead>
              <TableHead className="w-24" />
              <TableHead className="w-48">
                <p className="font-semibold text-gray-300">CPF</p>
              </TableHead>
              <TableHead className="w-52">
                <p className="font-semibold text-gray-300 text-center">Data de Nascimento</p>
              </TableHead>
              <TableHead className="w-32" />
              <TableHead>
                <p className="font-semibold text-gray-300">Plano</p>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-6">
            {/* Renderização condicional para tratar estados de carregamento e dados */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">Carregando alunos...</TableCell> {/* Colspan ajustado */}
              </TableRow>
            ) : alunoAll && alunoAll.length > 0 ? (
              // Mapeia os dados de alunoAll para o componente TableRowRelationAluno
              alunoAll.map((aluno) => (
                <TableRowRelation key={aluno.uid || aluno.id} aluno={aluno} /> // Usa uid ou id como key
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">Nenhum aluno encontrado.</TableCell> {/* Colspan ajustado */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      {showForm && (
        <FormNewAluno onClose={() => {
          setShowForm(false);
          findAllAlunos();
        }} />
      )}
    </Section>
  );
}