import {
  Card as Box,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // ou use clsx

interface CardProps {
  className?: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Card({ children, className, title, subtitle, footer }: CardProps) {
  return (
    <Box className={cn("rounded-xl shadow-md bg-card text-card-foreground flex flex-col w-full", className)}>
      <CardHeader className="w-full h-[15%]">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="w-full h-full">
        {children}
      </CardContent>
      {footer && <CardFooter className="w-full h-[15%]">{footer}</CardFooter>}
    </Box>
  );
}
