import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-9xl font-extrabold tracking-tight text-gray-200 select-none">404</h1>
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Página não encontrada
      </h2>
      <p className="mt-4 text-muted-foreground max-w-md">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button 
        className="mt-8"
        onClick={() => navigate("/")}
        variant="outline"
      >
        Voltar para o início
      </Button>
    </div>
  );
};
