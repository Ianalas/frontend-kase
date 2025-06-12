// components/TableRowHistoric.tsx
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Aula } from "@/contexts/ClassContext"; // Importe a interface Aula
import { MoreHorizontal } from "lucide-react"; // Exemplo de ícone de ações

interface TableRowHistoricProps {
  aula: Aula; // Recebe o objeto completo da aula
}

export function TableRowHistoric({ aula }: TableRowHistoricProps) {
  // Função para formatar a data (opcional, pode ser feito no componente ou com lib)
  const formatHorario = (isoString: string) => {
    try {
      const date = new Date(isoString);
      // Exemplo de formatação: "DD/MM/YYYY HH:MM"
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      console.error("Erro ao formatar horário:", e);
      return isoString; // Retorna a string original em caso de erro
    }
  };

  return (
    <TableRow>
      <TableCell className="w-24">
        {/* Aqui você pode adicionar um ícone ou botão para ações, como editar ou ver detalhes */}
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </TableCell>
      <TableCell className="w-36">{formatHorario(aula.horario)}</TableCell> {/* Usa aula.horario */}
      <TableCell className="w-36" />
      <TableCell className="w-52 ml-2">{aula.descricao}</TableCell> {/* Usando a descrição como "status" ou algo similar */}
      <TableCell className="w-48">
        {aula.funcionario?.cargo && aula.funcionario?.nome
          ? `${aula.funcionario.cargo} ${aula.funcionario.nome}`
          : "Não tem nome"}
      </TableCell>
      <TableCell className="w-80" />
      <TableCell>{aula.modalidade}</TableCell>
    </TableRow>
  );
}