import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCellStatus } from "./TableCellStatus";
import { PresencaAula } from "@/contexts/PresencaAulaContext";

interface TableRowHistoricProps {
  presenca: PresencaAula; 
}

export function TableRowHistoric({ presenca }: TableRowHistoricProps) {
  const dataFormatada = new Date(presenca.dataCheckin).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const now = new Date();
  const aulaHorario = new Date(presenca.dataCheckin);
  let statusDisplay: "Em aula" | "Finalizado" | "Pendente" = "Pendente"; 

  if (now > aulaHorario) {
    const umaHoraEmMs = 60 * 60 * 1000;
    if (now.getTime() - aulaHorario.getTime() < umaHoraEmMs) {
      statusDisplay = "Em aula";
    } else {
      statusDisplay = "Finalizado";
    }
  } else {
    statusDisplay = "Em aula";
  }

  const professorNome = presenca.aula.nome || 'Não Informado';

  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="max-w-8 ml-2">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da Presença</span>
            </Button>
          </DialogTrigger>
        </Dialog>
      </TableCell>

      <TableCell className="font-normal">
        {dataFormatada}
      </TableCell>

      <TableCell />

      <TableCell>
        <TableCellStatus status={statusDisplay} />
      </TableCell>

      <TableCell className="font-normal">
        {professorNome}
      </TableCell>

      <TableCell /> 

      <TableCell className="font-normal">
        {presenca.aula.modalidade}
      </TableCell>
    </TableRow>
  );
}