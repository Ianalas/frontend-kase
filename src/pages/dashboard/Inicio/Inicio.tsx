
import { Section } from "@/components/section";

import { YourHistoric } from "./components/YourHistoric";
import { YourPlan } from "./components/Yourplan";
import { YourFrequency } from "./components/YourFrequency";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function Inicio() {

  const [chartHeight, setChartHeight] = useState<number>(300);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      if (width >= 1440) {
        setChartHeight(300); 
      } else if (width >= 1024) {
        setChartHeight(240);
      } else {
        setChartHeight(220);
      }
    }

    handleResize();

    // Adiciona o listener
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const data = [
    { horario: "19:20", data: "10/11/2025", modalidade: "Funcional" },
    { horario: "13:00", data: "11/10/2025", modalidade: "Muay-Thai" },
    { horario: "13:00", data: "11/10/2025", modalidade: "Muay-Thai" },
  ];

  return (
    <Section className="w-full h-fit flex flex-col pb-12 gap-14 lg:p-7 xl:p-12  2xl:p-20 ">

      <div className="flex max-h-[440px] justify-between">
        <YourFrequency heightChart={chartHeight} />

        <YourPlan />
      </div>

      <div className="flex max-h-[440px] justify-between">
        <YourHistoric data={data} />
      
        <Link to="/buy-product" >
          <Button className="w-84 h-32 text-2xl">
            Comprar
          </Button>
        </Link>
      </div>


     
    </Section>
  );
}
