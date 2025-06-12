import Chart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ProductChartData {
  label: string;
  value: number;
}

interface ProductMoreBuyProps {
  data: ProductChartData[];
}

export const ProductMoreBuy = ({ data }: ProductMoreBuyProps) => {
  const options: ApexOptions = {
    chart: {
      type: 'pie',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.3
      }
    },
    labels: data.map(item => item.label),
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    legend: {
      position: 'right', // Posição da legenda
      offsetY: 0,
      height: 230,
      // --- AQUI É ONDE VOCÊ MUDA A COR DOS RÓTULOS DA LEGENDA! ---
      labels: {
        colors: '#A0A0A0', // Exemplo: cor cinza claro. Use qualquer cor hexadecimal, RGB ou nome.
        // Se você quiser cores diferentes para cada item na legenda, pode usar um array:
        // colors: ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#00FFFF', '#FFC0CB']
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        return opts.w.config.labels[opts.seriesIndex] + " - " + val.toFixed(1) + '%';
      },
      dropShadow: {
        enabled: true
      },
      style: {
        colors: ['#ffffff'] 
      }
      
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " unidades";
        }
      }
    }
  };

  const series = data.map(item => item.value);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 7 Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent className="flex my-auto justify-center items-center">
        {data.length > 0 ? (
          <Chart
            options={options}
            series={series}
            type="pie"
            width="100%"
            height="300"
          />
        ) : (
          <p className="text-center text-muted-foreground">Nenhum dado de produto disponível.</p>
        )}
      </CardContent>
    </Card>
  );
};