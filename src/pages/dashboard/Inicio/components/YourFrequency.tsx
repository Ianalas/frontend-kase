import { Card } from "@/components/card";
import { useTheme } from "@/components/themes/theme-provider";
import { PresencaAulaContext } from "@/contexts/PresencaAulaContext";
import { AuthContext } from "@/contexts/Autetication"; // Precisamos do UID do usuário logado
import { ApexOptions } from "apexcharts";
import { useContext, useEffect, useState } from "react"; // Adicionando useEffect e useState
import Chart from "react-apexcharts";

interface FrequencyProps {
  heightChart: number;
}

// Interface para o formato da resposta do seu backend
interface RelatorioDia {
  dia: string;
  minutos: number;
}

export function YourFrequency({ heightChart }: FrequencyProps) {
  const { getRelatorioDays } = useContext(PresencaAulaContext)!; // Desestruturar getRelatorioDays
  const { user, loading: authLoading } = useContext(AuthContext)!; // Obter user e authLoading do AuthContext

  // Estado para armazenar os dados do relatório
  const [reportData, setReportData] = useState<RelatorioDia[]>([]);
  // Estado para controlar o carregamento dos dados do gráfico
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    // Definir a ordem desejada dos dias da semana para o gráfico
    const orderedWeekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    const fetchReport = async () => {
      setChartLoading(true);
      setChartError(null);
      if (!authLoading && user && user.uid) {
        try {
          const data = await getRelatorioDays(user.uid);
          
          const sortedData = orderedWeekDays.map(day => {
            const found = data.find(item => item.dia === day);
            return found || { dia: day, minutos: 0 }; 
          });
          setReportData(sortedData);
        } catch (err: any) {
          console.error("Erro ao carregar dados do relatório:", err);
          setChartError("Falha ao carregar dados do gráfico.");
        } finally {
          setChartLoading(false);
        }
      } else if (!authLoading && !user) {
        setChartLoading(false); 
        setChartError("Usuário não autenticado para carregar o gráfico.");
      }
    };

    fetchReport();
  }, [authLoading, user, getRelatorioDays]); 

  const categories = reportData.map(item => {
    // Abreviar os dias para o eixo X, se desejar
    switch(item.dia) {
      case "Segunda": return "Seg";
      case "Terça": return "Ter";
      case "Quarta": return "Qua";
      case "Quinta": return "Qui";
      case "Sexta": return "Sex";
      case "Sábado": return "Sáb";
      case "Domingo": return "Dom";
      default: return item.dia; // Caso haja um dia inesperado
    }
  });
  const dataSeries = reportData.map(item => item.minutos);

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      foreColor: theme === "light" ? "#000" : "#e5e7eb",
      background: "transparent",
    },
    tooltip: {
      theme: theme === "light" ? "light" : "dark",
      style: { fontSize: "12px" },
      y: { formatter: (value) => `${value} min` },
    },
    title: {
      text: "Tempo de treino por dia (min)",
      align: "left",
      style: {
        fontSize: "14px",
        fontWeight: "medium",
        color: theme === "light" ? "#000" : "#e5e7eb",
      },
    },
    xaxis: {

      categories: categories,
      labels: {
        style: {
          colors: theme === "light" ? ["#000"] : ["#e5e7eb"], 
        },
      },
    },
    yaxis: {
      title: {
        text: "Minutos de treino",
        style: {
          color: theme === "light" ? "#000" : "#e5e7eb",
        },
      },
      labels: {
        style: {
          colors: theme === "light" ? ["#000"] : ["#e5e7eb"], 
        },
      },
      min: 0,
   
      tickAmount: 3,
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    colors: [theme === "light" ? "#2563EB" : "#3B82F6"],
  };

  const series = [
    {
      name: "Tempo de treino",
      data: dataSeries, // Usar os dados reais da API
    },
  ];

  return (
    <Card
      className="bg-transparent w-[45%]"
      title="Seu Desempenho"
      subtitle="Veja seu tempo de treino nesta semana!"
    >
      {chartLoading ? (
        <div className="flex justify-center items-center h-[200px] text-gray-500">
          Carregando dados do gráfico...
        </div>
      ) : chartError ? (
        <div className="flex justify-center items-center h-[200px] text-red-500">
          {chartError}
        </div>
      ) : reportData.length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="line"
          width="100%"
          height={heightChart}
        />
      ) : (
        <div className="flex justify-center items-center h-[200px] text-gray-500">
          Nenhum dado de treino encontrado para esta semana.
        </div>
      )}
    </Card>
  );
}