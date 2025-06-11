import { Card } from "@/components/card";
import { CirclePlay, Flag } from "lucide-react";
import { Link } from "react-router";

export function YourPlan(){
  return(
    <Card
        className="bg-transparent max-h-[440px] w-[45%] text-xl" // Ocupa a largura total em telas menores
        title="Seu Plano"
        subtitle="Aqui você encontra informações sobre seu plano."
        footer={
          <footer className="text-red-500 text-sm w-full text-center">
            *Recomenda manter-se atento ao prazo de vencimento.*
          </footer>
        }
      >
        <div className="flex flex-col gap-4 h-full justify-center">

          <Link to="/" className="text-xl border-b-1 border-white w-fit max-lg:text-lg">
            Plano Trimestral
          </Link>
          <div className="w-full h-auto flex flex-row p-2 text-[1rem] max-lg:justify-between lg:gap-20 xl:gap-40 2xl:gap-60">

            <div className="flex gap-1.5 w-full md:w-auto">
              <CirclePlay style={{ color: "#AAAAAA" }} className="w-4"/>
             <div className="flex flex-col gap-1" 
                style={{ color: "#AAAAAA" }}>
              <span>Data de Inicio</span>
              <p className="text-white ml-1">28/07/2025</p>
             </div>
            </div>
            
            <div className="flex gap-1.5 w-full md:w-auto">
              <Flag style={{ color: "#AAAAAA" }} className="w-4" />
             <div className="flex flex-col gap-1" 
                style={{ color: "#AAAAAA" }}>
              <span>Data de Vencimento</span>
              <p className="text-white ml-1">29/08/2025</p>
             </div>
            </div>
          </div>
        </div>
      </Card>
  )
}