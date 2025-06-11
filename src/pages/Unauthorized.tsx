import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router";

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl border ">
        <CardHeader className="flex flex-col items-center text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mb-2" />
          <CardTitle className="text-2xl font-bold">Acesso não autorizado</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground space-y-4">
          <p>Você não tem permissão para acessar esta página.</p>
          <Button asChild variant="outline">
            <Link to="/">Voltar para a Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
