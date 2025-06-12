import { useContext, useEffect, useState } from "react";
import { DataPicker } from "@/components/data_picker";
import { DropDownMenu } from "@/components/dropdown_menu";
import { Section } from "@/components/section";
// Importe TableCell se ainda não estiver importado
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListFilter, Plus, Search, X } from "lucide-react";
import { TableRowRelation } from "./components/TableRowRelation";
import { FormNewFuncionario } from "./components/FormNewFuncionario";
import {  UserContext } from "@/contexts/UserContext";

export function RelacaoFuncionario() {
  const { funcionarioAll, getAllFuncionarios } = useContext(UserContext)!;

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { // Removido 'async' diretamente do useEffect, pois o React desaconselha.
    const fetchFuncionarios = async () => {
      setLoading(true);
      try {
       await getAllFuncionarios();
      } catch (e) {
        console.error("Erro ao buscar funcionários:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, []); // Adicionado getAllFuncionarios como dependência, embora seja estável do contexto.

  return (
    <Section className="w-3/4 min-h-full flex flex-col mb-24">
      <h1 className="text-left text-4xl md:text-4xl mb-4 font-sans">Relação de Funcionários</h1>

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
            list={["Todas Modalidades", "teste 1", "teste 2", "teste 3"]}
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
          Adicionar Funcionário
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border border-grey-900">
        <Table className="w-full p-6">
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead className="w-36">
                <p className="font-semibold text-gray-300">Nome do Funcionário</p>
              </TableHead>
              <TableHead className="w-36" />
              <TableHead className="w-52">
                <p className="font-semibold text-gray-300 ml-2">Data de Nascimento</p>
              </TableHead>
              <TableHead className="w-12" />
              <TableHead className="w-48">
                <p className="font-semibold text-gray-300">CPF</p>
              </TableHead>
              <TableHead className="w-80"></TableHead>
              <TableHead>
                <p className="font-semibold text-gray-300">Cref</p>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-6">
            {/* Renderização condicional para tratar estados de carregamento e dados */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Carregando funcionários...</TableCell>
              </TableRow>
            ) : funcionarioAll && funcionarioAll.length > 0 ? (
              funcionarioAll.map((el) => (
                <TableRowRelation key={el.uid} {...el} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Nenhum funcionário encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showForm && (
        <FormNewFuncionario onClose={() => {
          setShowForm(false);
          getAllFuncionarios();
        }} />
      )}
    </Section>
  );
}