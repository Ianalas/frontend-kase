import { useEffect, useState } from "react";
import { Section } from "@/components/section";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, ListFilter, Search, X } from "lucide-react";
import { TableRowOrder } from "./components/TableRowOrder";
import { FormNewProduct } from "./components/FormNewProduct";
import { useProduct} from "@/contexts/ProductContext";

export function Produtos() {
  const { products, loadingProducts, errorProducts, listarProdutos } = useProduct();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
  
    listarProdutos();
  }, [listarProdutos]);

  return (
    <Section className="w-3/4 min-h-full flex flex-col">
      <h1 className="text-left text-4xl md:text-5xl mb-4">Produtos</h1>

     
      <div className="flex 2xl:w-[100%] gap-3 mb-6">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
          Filtros <ListFilter className="w-4 h-4" />
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

      <div className="rounded-lg overflow-hidden border border-grey-900">
        <Table className="w-full p-6">
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-36"></TableHead> {/* Imagem */}
              <TableHead className="w-36"><p className="font-semibold text-gray-300">Nome do produto</p></TableHead>
              <TableHead className="w-36 max-w-72"></TableHead>
              <TableHead className="w-72"><p className="font-semibold text-gray-300">Código do produto</p></TableHead>
              <TableHead className="w-48"><p className="font-semibold text-gray-300">Data de compra</p></TableHead>
              <TableHead className="w-60"></TableHead> {/* Ações */}
              <TableHead><p className="font-semibold text-gray-300">Valor pago</p></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="p-6">
            {loadingProducts ? (
              <TableRow>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Carregando produtos...
                </td>
              </TableRow>
            ) : errorProducts ? (
              <TableRow>
                <td colSpan={7} className="text-center py-8 text-red-500">
                  Erro ao carregar produtos: {errorProducts.message || "Verifique sua conexão ou tente novamente mais tarde."}
                </td>
              </TableRow>
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <TableRowOrder
                  key={product.id || product.codigo}
                  nome={product.nome}
                  codigo={product.codigo}
                  data={product.dataCompra} 
                  valorPago={parseFloat(product.valorPago)} 
                  urlImage={product.foto} 
                />
              ))
            ) : (
              <TableRow>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum produto encontrado.
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showForm && (
        <FormNewProduct onClose={() => {
          setShowForm(false);
          listarProdutos(); 
        }} />
      )}
    </Section>
  );
}