import { useContext, useEffect, useState } from "react";
import { DataPicker } from "@/components/data_picker";
import { DropDownMenu } from "@/components/dropdown_menu";
import { Section } from "@/components/section";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"; 
import { Button } from "@/components/ui/button";
import { ListFilter, Plus, Search, X } from "lucide-react";
import { TableRowHistoric } from "./components/TableRowHistoric"; 
import { FormNewClass } from "./components/FormNewClass";
import { ClassContext } from "@/contexts/ClassContext"; 

export function HistoricoAulas() {
  const { aulas, loading, error, findAllAulas } = useContext(ClassContext)!;

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {

    const fetchAulas = async () => {
      try {
        await findAllAulas(); 
      } catch (e) {
        console.error("Erro ao buscar histórico de aulas no componente:", e);
      }
    };

    fetchAulas();
  }, [findAllAulas]);

  return (
    <Section className="w-3/4 min-h-full flex flex-col mb-24">
      <h1 className="text-left text-4xl md:text-4xl mb-4 font-sans">Histórico de Aulas</h1>

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
            list={["Todas Modalidades", "Muay-Thai", "Jiu-Jitsu", "Boxe"]} 
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
          Adicionar aula
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border border-grey-900">
        <Table className="w-full p-6">
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead className="w-36">
                <p className="font-semibold text-gray-300">Data de Realização</p>
              </TableHead>
              <TableHead className="w-36"></TableHead>
              <TableHead className="w-52">
                <p className="font-semibold text-gray-300 ml-2">Status</p>
              </TableHead>
              <TableHead className="w-48">
                <p className="font-semibold text-gray-300">Professor</p>
              </TableHead>
              <TableHead className="w-80"></TableHead>
              <TableHead>
                <p className="font-semibold text-gray-300">Modalidade</p>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-6">
            {/* Renderização condicional para tratar estados de carregamento, erro e dados */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Carregando aulas...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500">
                  Erro ao carregar aulas: {error.message || "Erro desconhecido."}
                </TableCell>
              </TableRow>
            ) : aulas && aulas.length > 0 ? (
              // Mapeia os dados de 'aulas' para o componente TableRowHistoric
              aulas.map((aula) => (
                <TableRowHistoric key={aula.id} aula={aula} /> // Passe a aula completa como prop
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Nenhuma aula encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      {showForm && (
        <FormNewClass onClose={() => {
          setShowForm(false);
          findAllAulas();
        }} />
      )}
    </Section>
  );
}