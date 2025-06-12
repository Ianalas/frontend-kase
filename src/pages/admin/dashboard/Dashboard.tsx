import { Section } from "@/components/section";
import { CurrenryWeekly } from "./components/CurrenryWeekly";
import { Separator } from "@/components/ui/separator";
import { ProductChartData, ProductMoreBuy } from "./components/ProductMoreBuy";
import { Statistics } from "./components/Statistics";


export function Dashboard() {
  // CORREÇÃO: Declare 'data' como um ARRAY de ProductChartData
  const data: ProductChartData[] = [ 
    { label: "suco", value: 32 },   
    { label: "refri", value: 19 },  
    { label: "salgado", value: 12 } 
  ];

  return(
    <Section className="flex flex-col items-center justify-between w-full p-6">
      <div className="grid grid-cols-[2fr_1fr] gap-10 w-[80%] max-h-[500px]">
        <CurrenryWeekly heightChart={300}/>

        <ProductMoreBuy data={data} />
      </div>

      <Separator className="my-8" />

      <div className="flex justify-center gap-10 w-[80%] max-h-[500px]">
        <Statistics />
      </div>
    </Section>
  )
}