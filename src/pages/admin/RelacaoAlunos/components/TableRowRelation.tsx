import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

export function TableRowRelation(){
  return (
    <TableRow>
      <TableCell >
        <Dialog  /*open={/*isDetailsOpen} onOpenChange={setIsDetailsOpen}*/>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="max-w-8 ml-2" >
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails orderId={order.orderId} openStatus={isDetailsOpen} /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-normal">
        Balajuquinha 1234
      </TableCell>
      <TableCell />

      <TableCell className="font-normal text-center">
        09 de junho de 2025
      </TableCell>
      <TableCell />

      <TableCell className="font-normal">
        088.xxx.xxx-32
      </TableCell>
      <TableCell className="font-normal text-center">
        12 de janeiro de 2024
      </TableCell>
      <TableCell />
      <TableCell className="font-normal">
        Total helf
      </TableCell>
    </TableRow>

      // <TableHead className="w-36"><p className="font-semibold text-gray-300">Nome completo</p></TableHead>
      // <TableHead className="w-36"></TableHead>
      // <TableHead className="w-52"><p className="font-semibold text-gray-300 ml-2">Data entrada</p></TableHead>
      // <TableHead className="w-48"><p className="font-semibold text-gray-300">CPF</p></TableHead>
      // <TableHead className="w-52"><p className="font-semibold text-gray-300 ml-2">Data de nascimento</p></TableHead>
      // <TableHead className="w-80"></TableHead>
      // <TableHead><p className="font-semibold text-gray-300">Plano</p></TableHead>

  );
}