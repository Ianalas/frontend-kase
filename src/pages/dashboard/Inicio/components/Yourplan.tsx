import { Card } from "@/components/card";
import { PresencaAulaContext } from "@/contexts/PresencaAulaContext";
import { AuthContext } from "@/contexts/Autetication"; // Precisamos do AuthContext para o user.uid
import { CirclePlay, Flag } from "lucide-react";
import { useContext, useEffect, useState } from "react"; // Importar useEffect e useState
import { Link } from "react-router";

export function YourPlan() {
  const { getRelatorioPlans } = useContext(PresencaAulaContext)!;
  const { user, loading: authLoading } = useContext(AuthContext)!; // Obter user e authLoading

  // Estado para armazenar o nome do plano
  const [nomePlano, setNomePlano] = useState<string | null>(null);
  // Estado para controlar o carregamento
  const [loadingPlano, setLoadingPlano] = useState(true);
  // Estado para erros
  const [errorPlano, setErrorPlano] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoadingPlano(true);
      setErrorPlano(null);

      // Verificamos se a autenticação terminou e se há um usuário com UID
      if (!authLoading && user && user.uid) {
        try {
          const data = await getRelatorioPlans(user.uid);
          if (data && data.plano) {
            setNomePlano(data.plano);
          } else {
            setNomePlano("Nenhum plano encontrado"); // Caso a API retorne objeto vazio ou sem 'plano'
          }
        } catch (error) {
          console.error("Erro ao buscar relatório de plano:", error);
          setErrorPlano("Não foi possível carregar as informações do plano.");
          setNomePlano("Erro ao carregar"); // Exibe uma mensagem de erro no campo do plano
        } finally {
          setLoadingPlano(false);
        }
      } else if (!authLoading && !user) {
        // Se a autenticação terminou e não há usuário, não há plano para buscar
        setLoadingPlano(false);
        setNomePlano("Usuário não autenticado");
      }
    };

    fetchPlan();
  }, [authLoading, user, getRelatorioPlans]); // Dependências do useEffect

  return (
    <Card
      className="bg-transparent max-h-[440px] w-[45%] text-xl"
      title="Seu Plano"
      subtitle="Aqui você encontra informações sobre seu plano."
      footer={
        <footer className="text-red-500 text-sm w-full text-center">
          *Recomenda manter-se atento ao prazo de vencimento.*
        </footer>
      }
    >
      <div className="flex flex-col gap-4 h-full justify-center">
        {loadingPlano ? (
          <p className="text-white text-center">Carregando plano...</p>
        ) : errorPlano ? (
          <p className="text-red-500 text-center">{errorPlano}</p>
        ) : (
          <Link to="/" className="text-xl border-b-1 border-white w-fit max-lg:text-lg">
            {nomePlano || "Plano Indisponível"} {/* Exibe o nome do plano ou um fallback */}
          </Link>
        )}

        {/* As datas abaixo são estáticas. Se elas também vêm da API,
            você precisaria de estados adicionais para elas e lógica para exibi-las. */}
        <div className="w-full h-auto flex flex-row p-2 text-[1rem] max-lg:justify-between lg:gap-20 xl:gap-40 2xl:gap-60">
          <div className="flex gap-1.5 w-full md:w-auto">
            <CirclePlay style={{ color: "#AAAAAA" }} className="w-4" />
            <div className="flex flex-col gap-1" style={{ color: "#AAAAAA" }}>
              <span>Data de Início</span>
              <p className="text-white ml-1">28/07/2025</p> {/* Dados estáticos */}
            </div>
          </div>

          <div className="flex gap-1.5 w-full md:w-auto">
            <Flag style={{ color: "#AAAAAA" }} className="w-4" />
            <div className="flex flex-col gap-1" style={{ color: "#AAAAAA" }}>
              <span>Data de Vencimento</span>
              <p className="text-white ml-1">29/08/2025</p> {/* Dados estáticos */}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}