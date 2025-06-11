import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils"; // Utilitário opcional para classes condicionais

interface PropsStatus {
  status: 'Em aula' | 'Finalizado' | 'Faltou';
}

export function TableCellStatus({ status }: PropsStatus) {
  const colorMap = {
    "Em aula": "bg-amber-500",
    "Finalizado": "bg-emerald-500",
    "Faltou": "bg-rose-500"
  };

  const corDoStatus = colorMap[status];

  return (
    <TableCell className="font-normal">
      <div className="flex items-center gap-2">
        <span
          className={cn("h-2 w-2 rounded-full", corDoStatus)}
        />
        {status}
      </div>
    </TableCell>
  );
}
