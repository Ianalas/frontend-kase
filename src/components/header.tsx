import { Separator } from "@radix-ui/react-separator";
import { Dumbbell, ChevronDown } from "lucide-react";
import { NavLink } from "./nav-link";
import { ModeToggle } from "@/components/themes/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDropDown } from "./UserDropdown";
import ItemHeader from "@/interfaces/Header";
import { useAuth } from "@/contexts/Autetication";

interface HeaderProps {
  className?: string;
  pages: ItemHeader[];
}

export function Header({ className, pages }: HeaderProps) {
  const { user } = useAuth();

  return (
    <div className={className}>
      <div className="flex h-16 items-center gap-6 px-6">
        <Dumbbell className="h-6 w-6" />
        <Separator orientation="vertical" className="h-6 " />
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {pages.map((item, index) => (
            <NavLink key={index} to={item.link}>
              {item.icon}
              {item.content}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
        <div className="flex items-center justify-center gap-1">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <UserDropDown title={!user?.displayName ? "Cliente " : user.displayName} className="bg-none outline-none focus:outline-none focus:ring-0">
            <ChevronDown />
          </UserDropDown>
        </div>
      </div>
    </div>
  );
}