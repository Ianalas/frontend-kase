import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { TableCellStatus } from "./TableCellStatus";

export function TableRowHistoric(){
  return (
    <TableRow>
      <TableCell >
        <Dialog  /*open={/*isDetailsOpen} onOpenChange={setIsDetailsOpen}*/>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="max-w-8 ml-2" >
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da aula</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails orderId={order.orderId} openStatus={isDetailsOpen} /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-normal">
        28 de janeiro de 2025
      </TableCell>
      <TableCell />
      <TableCellStatus status="Em aula" />

      <TableCell className="font-normal">
        Doçes e travessuras
      </TableCell>
      <TableCell />
      <TableCell className="font-normal">
        Traycing
      </TableCell>
    </TableRow>
  );
}