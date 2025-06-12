import { TableCell, TableRow } from "@/components/ui/table";

// 1. Definir a interface das props que o componente TableRowOrder espera
interface TableRowOrderProps {
  nome: string;
  codigo: string;
  data: string; // Ou 'dataCompra' para ser mais consistente com seu Product
  valorPago: number; // Agora espera um number, como é passado do Produtos.tsx
  urlImage?: string; // Opcional, para a imagem do produto
}

// 2. Receber as props no componente
export function TableRowOrder({ nome, codigo, data, valorPago, urlImage }: TableRowOrderProps) {
  // `num` e o Date fixo foram removidos, pois agora os valores vêm das props.

  return (
    <TableRow>
      <TableCell>
        {/* Usar urlImage das props, com um fallback se não houver */}
        <img
          src={urlImage || "https://via.placeholder.com/150"} // Placeholder se urlImage for null/undefined
          alt={nome} // Alt text para acessibilidade
          className="w-20 h-20 rounded-md object-cover" // object-cover para garantir que a imagem preencha o espaço
        />
      </TableCell>
      <TableCell className="font-normal">
        {nome} {/* Usar nome das props */}
      </TableCell>
      <TableCell /> {/* Esta célula está vazia, se não for usada, pode ser removida */}
      <TableCell className="font-normal">
        {codigo} {/* Usar codigo das props */}
      </TableCell>
      <TableCell className="font-normal">
        {/* Formatar a data. Se 'data' já vem formatada (ex: "DD/MM/YYYY"), use direto.
            Se vem como string ISO (ex: "YYYY-MM-DD"), converta para Date antes de formatar. */}
        {new Date(data).toLocaleDateString("pt-BR")} {/* Usar data das props */}
      </TableCell>
      <TableCell /> {/* Esta célula está vazia, se não for usada, pode ser removida */}
      <TableCell className="font-normal">

        {valorPago.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
    </TableRow>
  );
}