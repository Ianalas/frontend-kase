import { useEffect, useState } from "react";
import { DataPicker } from "@/components/data_picker";
import { DropDownMenu } from "@/components/dropdown_menu";
import { Section } from "@/components/section";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import { ListFilter, Search, X, Plus } from "lucide-react";
import { TableRowOrder } from "./components/TableRowOrder";
import { FormNewProduct } from "./components/FormNewProduct";

interface PedidoType {
  nome: string;
  codigo: string;
  data: string;
  valorPago: number;
  urlImage?: string;
}

const arrayCompleto: PedidoType[] = [
  {
    codigo: "12312312313123",
    data: "10 de janeiro de 2025",
    nome: "Redbull Azul - Zero Açúcar",
    valorPago: 10.99,
    urlImage: "/image.png",
  },
  {
    codigo: "456456456456",
    data: "12 de janeiro de 2025",
    nome: "Coca-Cola 2L",
    valorPago: 8.5,
    urlImage: "/image.png",
  },
  {
    codigo: "789789789789",
    data: "15 de janeiro de 2025",
    nome: "Pepsi Twist",
    valorPago: 7.0,
    urlImage: "/image.png",
  },
  {
    codigo: "111222333444",
    data: "18 de janeiro de 2025",
    nome: "Fanta Uva",
    valorPago: 6.75,
    urlImage: "/image.png",
  },
  {
    codigo: "999888777666",
    data: "20 de janeiro de 2025",
    nome: "Guaraná Antártica",
    valorPago: 5.99,
    urlImage: "/image.png",
  },
];

export function Produtos() {
  const itemsPerPage = 4;
  const totalPaginas = Math.ceil(arrayCompleto.length / itemsPerPage);
  const itensPorPagina = 6;

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [dados, setDados] = useState<PedidoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Simula uma requisição à API
    const timeout = setTimeout(() => {
      const start = paginaAtual * itemsPerPage;
      const end = start + itemsPerPage;
      setDados(arrayCompleto.slice(start, end));
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [paginaAtual]);

  return (
    <Section className="w-3/4 min-h-full flex flex-col ">
      <h1 className="text-left text-4xl md:text-5xl mb-4">Produtos</h1>

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
          Adicionar produto
        </Button>
      </div>


      {/* Tabela ou Loading */}
      <div className="rounded-lg overflow-hidden border border-grey-900">
        <Table className="w-full p-6">
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-36"></TableHead>
              <TableHead className="w-36"><p className="font-semibold text-gray-300">Nome do produto</p></TableHead>
              <TableHead className="w-36 max-w-72"></TableHead>
              <TableHead className="w-72"><p className="font-semibold text-gray-300">Código do produto</p></TableHead>
              <TableHead className="w-48"><p className="font-semibold text-gray-300">Data de compra</p></TableHead>
              <TableHead className="w-60"></TableHead>
              <TableHead><p className="font-semibold text-gray-300">Valor pago</p></TableHead>

            </TableRow>
          </TableHeader>
          <TableBody className="p-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRowOrder key={index} />
            ))}          
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
        <FormNewProduct onClose={() => setShowForm(false)} />
      )}
    </Section>
  );
}
