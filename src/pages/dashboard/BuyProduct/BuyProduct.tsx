import { QrScanner } from "./components/QrScanner";


export function BuyProduct() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Teste do Leitor QR</h1>
      <QrScanner />
    </div>
  );
}