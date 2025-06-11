
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "@/services/authService"
import { CircleDollarSign, CircleUser, Cog, Headset, LogOut } from "lucide-react"
import { ReactNode } from "react"
import { Link } from "react-router";

interface DropdownProps {
  children?: ReactNode;
  className?: string;
  title: string
}

export function UserDropDown({ children, className, title }: DropdownProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={className}>{children}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/perfil">
          <DropdownMenuItem>
            <CircleUser />Conta
          </DropdownMenuItem>
          </Link> 
          <DropdownMenuItem><CircleDollarSign />Faturas</DropdownMenuItem>
   
          <DropdownMenuItem>
            <Cog />Configurações
          </DropdownMenuItem>

        </DropdownMenuGroup>

        <DropdownMenuItem><Headset />Suporte</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logoutUser()} >
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}