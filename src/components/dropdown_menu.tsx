import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react";


interface DropDownMenuProps{
    list: string[];
    className?: string
}

export function DropDownMenu({list,className} : DropDownMenuProps) {
  const [now, setNow] = useState(list[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <span>{now}</span> <ChevronDown  />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {list.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => setNow(item)}
            className={cn(
              "cursor-pointer",
              now === item && "font-semibold bg-muted"
            )}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
