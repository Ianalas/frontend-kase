import { useEffect, useState } from "react";
import { DataPicker } from "@/components/data_picker";
import { DropDownMenu } from "@/components/dropdown_menu";
import { Section } from "@/components/section";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListFilter, Plus, Search, X } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { TableRowHistoric } from "./components/TableRowHistoric";
import { FormNewClass } from "./components/FormNewClass";

interface TipoAula {
  data: string;
  status: "Em aula" | "Finalizado" | "Pendente";
  professor: string;
  modalidade: string;
}

// Simula a "API"
function simularAPI(pagina: number, limite: number): Promise<{ data: TipoAula[]; total: number }> {
  const all: TipoAula[] = Array(25).fill(0).map((_, i) => ({
    data: `20/${(i % 30) + 1}/2025`,
    status: (["Em aula", "Finalizado", "Pendente"][i % 3]) as "Em aula" | "Finalizado" | "Pendente",
    modalidade: ["Muay-Thai", "Jiu-Jitsu", "Boxe"][i % 3],
    professor: ["Jalinrabei", "Ana Clara", "Murilo"][i % 3],
  }));

  const start = (pagina - 1) * limite;
  const end = start + limite;

  return new Promise((res) =>
    setTimeout(() => {
      res({ data: all.slice(start, end), total: all.length });
    }, 500)
  );
}


export function HistoricoAulas() {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [_dados, setDados] = useState<TipoAula[]>([]);
  const [_totalPaginas, setTotalPaginas] = useState(1);
  const [_loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const itensPorPagina = 10;

  useEffect(() => {
    setLoading(true);

    simularAPI(paginaAtual, itensPorPagina)
      .then(({ data, total }) => {
        setDados(data);
        setTotalPaginas(Math.ceil(total / itensPorPagina));
      })
      .catch((e) => console.error("Erro ao buscar dados", e))
      .finally(() => setLoading(false));
  }, [paginaAtual]);



  return (
    <Section className="w-3/4 min-h-full flex flex-col mb-24">
      <h1 className="text-left text-4xl md:text-4xl mb-4 font-sans">Historico de aulas</h1>

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
              <TableHead className="w-36"><p className="font-semibold text-gray-300">Data de Realização</p></TableHead>
              <TableHead className="w-36"></TableHead>
              <TableHead className="w-52"><p className="font-semibold text-gray-300 ml-2">Status</p></TableHead>
              <TableHead className="w-48"><p className="font-semibold text-gray-300">Professor</p></TableHead>
              <TableHead className="w-80"></TableHead>
              <TableHead><p className="font-semibold text-gray-300">Modalidade</p></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-6">
            <TableRowHistoric key={34} />
            <TableRowHistoric key={33} />
            <TableRowHistoric key={32} />
            <TableRowHistoric key={31} />
          </TableBody>
        </Table>
      </div>

      <Pagination
        
        pageIndex={paginaAtual - 1}
        totalCount={52}
        perPage={itensPorPagina}
        onPageChange={(index) => setPaginaAtual(index + 1)}
      />

      {showForm && (
        <FormNewClass onClose={() => setShowForm(false)} />
      )}

    </Section>
  );
}
