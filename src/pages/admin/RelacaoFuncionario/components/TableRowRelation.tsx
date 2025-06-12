import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { FuncionarioDataResp } from "@/contexts/UserContext";

const formatCpf = (cpf: string | undefined): string => {
  if (!cpf) {
    return 'CPF inválido'; 
  }
  
  const cleanCpf = cpf.replace(/\D/g, '');

  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export function TableRowRelation({ nome, cpf, cref, uid, data_nascimento }: FuncionarioDataResp) {
 
  const formattedDate = data_nascimento
    ? new Date(data_nascimento).toLocaleDateString('pt-BR')
    : 'Data inválida';

  const formattedCpf = formatCpf(cpf);

  return (
    <TableRow id={uid}>
      <TableCell>
        <Dialog >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="max-w-8 ml-2">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
        </Dialog>
      </TableCell>
      <TableCell className="font-normal">
        {nome}
      </TableCell>
      <TableCell />
      <TableCell className="font-normal">
        {formattedDate}
      </TableCell>
      <TableCell />
      <TableCell className="font-normal">
        {formattedCpf}
      </TableCell>

      <TableCell />
      <TableCell className="font-normal">
        {cref}
      </TableCell>
    </TableRow>
  );
}