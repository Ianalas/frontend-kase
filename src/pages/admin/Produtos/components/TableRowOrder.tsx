import { TableCell, TableRow } from "@/components/ui/table";


export function TableRowOrder(){
  const num = 49.99;

  return(
     <TableRow>
      <TableCell >
        <img src="https://images.tcdn.com.br/img/img_prod/996597/creatina_300g_pote_max_titanium_6940_1_27fd86d998d9077967d06165be82a759.png" alt="" className="w-20 h-20 rounded-md" />
      </TableCell>
      <TableCell className="font-normal">
        Creatina Pura 300g - Max titanium
      </TableCell>
      <TableCell />
      <TableCell className="font-normal">
       12131243423432
      </TableCell>
      <TableCell className="font-normal">
        {new Date().toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell />
      <TableCell className="font-normal">
        {num.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL", 
          }
        )}
      </TableCell>

    </TableRow>
  )
}