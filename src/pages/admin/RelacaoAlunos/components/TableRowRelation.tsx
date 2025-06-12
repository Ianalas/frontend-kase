// components/TableRowRelationAluno.tsx
import { TableRow, TableCell } from "@/components/ui/table";
import { AlunoDataResp } from "@/contexts/UserContext"; // Importe a interface
import { ChevronRight } from "lucide-react"; // Exemplo de ícone

interface TableRowRelationAlunoProps {
  aluno: AlunoDataResp;
}

export function TableRowRelation({ aluno }: TableRowRelationAlunoProps) {

  const formatCpf = (cpf: string | undefined): string => {
  if (!cpf) {
    return 'CPF inválido'; 
  }
  
  const cleanCpf = cpf.replace(/\D/g, '');

  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

  const formattedDate = (date: string) => date
    ? new Date(date).toLocaleDateString('pt-BR')
    : 'Data inválida';

  return (
    <TableRow>
      <TableCell className="w-24">
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </TableCell>
      <TableCell className="w-36">{aluno.nome}</TableCell>
      <TableCell className="w-24" />
      <TableCell className="w-44 text-center">{formattedDate(aluno.inicio_plano)}</TableCell> {/* Usando inicio_plano como data de entrada */}
      <TableCell className="w-24" />
      <TableCell className="w-48">{formatCpf(aluno.cpf)}</TableCell>
      <TableCell className="w-52 text-center">{formattedDate(aluno.data_nascimento?? new Date().toISOString())}</TableCell>
      <TableCell className="w-32" />
      <TableCell>
        {aluno.plano
          ? aluno.plano.charAt(0).toUpperCase() + aluno.plano.slice(1).toLowerCase()
          : ''}
      </TableCell>
    </TableRow>
  );
}