import { Card } from "@/components/card";
import { useTheme } from "@/components/themes/theme-provider";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface FrequencyProps {
  heightChart: number;
}

export function YourFrequency({ heightChart}:FrequencyProps){
    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const tempoDeTreino = [60, 50, 0, 45, 0, 70, 0]; 
  const { theme } = useTheme();

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
      categories: weekDays,
      labels: {
        style: {
          colors: theme === "light" ? "#000" : "#e5e7eb",
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
          colors: theme === "light" ? "#000" : "#e5e7eb",
        },
      },
      min: 0,
      max: 90,
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
      data: tempoDeTreino,
    },
  ];

  return(
    <Card
      className="bg-transparent w-[45%]"
      title="Seu Desempenho"
      subtitle="Veja seu tempo de treino nesta semana!"
    >
      <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        height={heightChart}
      />
    </Card>
  )
}