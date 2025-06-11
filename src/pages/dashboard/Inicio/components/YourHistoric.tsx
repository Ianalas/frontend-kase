import { Card } from "@/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface itemProps {
  horario: string;
  data: string;
  modalidade: string;
}

interface YourHistoricProps {
  data: itemProps[];
}

export function YourHistoric({ data }: YourHistoricProps) {
  return (
    <Card
      className="bg-transparent h-full w-[45%]" //lg:w-[440px] xl:w-[520px] 2xl:w-2xl
      title="Seu Histórico de Aulas"
      subtitle="Aqui se encontra seu histórico de aulas."
      footer={
        <Button variant="default" className="flex ml-auto mt-auto">
          Ver Mais
          <ChevronRight />
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Horário</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-left">Modalidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({horario, data, modalidade}: itemProps)=>{
            return(
              <TableRow>
                <TableCell>{horario}</TableCell>
                <TableCell>{data}</TableCell>
                <TableCell className="flex ml-auto">{modalidade}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>         
    </Card>
  );
}