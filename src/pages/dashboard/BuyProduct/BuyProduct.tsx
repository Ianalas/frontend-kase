import { QrScanner } from "./components/QrScanner";


export function BuyProduct() {
  return (
    <div className="flex flex-col align-middle p-2 text-center">
      <h1 className="font-bold text-xl">Scaneie o código de barras do produto</h1>
      <QrScanner />
    </div>
  );
}