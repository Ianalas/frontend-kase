import { Header } from "@/components/header";
import { Container } from "@/components/container";
import { Outlet } from "react-router";
import { Section } from "@/components/section";
import ItemHeader from "@/interfaces/Header";
import { Album, GraduationCap, History, Home, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/Autetication";

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();

  const [lista, setLista] = useState<ItemHeader[]>([
    { content: "Início", icon: <Home className="w-4 h-4" />, link: "/" },
    {
      content: "Histórico",
      icon: <History className="w-4 h-4" />,
      link: "/historico",
    },
    {
      content: "Pedidos",
      icon: <Package className="w-4 h-4" />,
      link: "/pedidos",
    },
  ]);

  useEffect(() => {
    if (user?.role === "admin") {
      setLista([
        { content: "Inicio", icon: <Home className="w-4 h-4" />, link: "/admin" },
        { content: "Relação de alunos", icon: <Album className="w-4 h-4" />, link: "/admin/relacao-alunos"},
        { content: "Historico de aulas", icon: <History className="w-4 h-4" />, link: "/admin/historico-aulas"},
        { content: "Relação de funcionários", icon: <GraduationCap className="w-4 h-4" />, link: "/admin/relacao-funcionarios"},
        { content: "Relação de produtos", icon:<Package className="w-4 h-4" />, link: "/admin/relacao-produtos"}
      ]);
    }
  }, [user?.role]);

  return (
    <Container className="w-full h-screen flex flex-col overflow-x-hidden">
      <Header pages={lista} className="border-b" />
      <Section className="flex-grow overflow-x-hidden overflow-y-auto p-4 flex justify-center">
        <Outlet />
      </Section>
    </Container>
  );
};

export default DashboardLayout;
