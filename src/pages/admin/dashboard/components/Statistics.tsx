import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';


function generateRandomRevenue(): number {
  const minRevenue = 100000;
  const maxRevenue = 250000;
  const randomValue = Math.random() * (maxRevenue - minRevenue) + minRevenue;
  return parseFloat(randomValue.toFixed(2));
}

function generateRandomCancellations(): number {
  const minCancellations = 10;
  const maxCancellations = 50;
  return Math.floor(Math.random() * (maxCancellations - minCancellations + 1)) + minCancellations;
}

function generateRandomNewSignupsPercentage(): number {
  const minPercentage = 3.0;
  const maxPercentage = 15.0;
  const randomValue = Math.random() * (maxPercentage - minPercentage) + minPercentage;
  return parseFloat(randomValue.toFixed(1));
}

export function Statistics() {
  const monthlyRevenue = generateRandomRevenue();
  const monthlyCancellations = generateRandomCancellations();
  const monthlyNewSignupsPercentage = generateRandomNewSignupsPercentage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Faturamento Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            +{generateRandomNewSignupsPercentage().toFixed(1)}% do mês passado
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cancelamentos (Mês)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyCancellations}
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 10)} cancelamentos em relação ao mês passado
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Novas Assinaturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            +{monthlyNewSignupsPercentage.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">

            {Math.random() > 0.5 ? '+' : '-'}{generateRandomNewSignupsPercentage().toFixed(1)}% do mês passado
          </p>
        </CardContent>
      </Card>
    </div>
  );
}