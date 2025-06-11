import { useState } from "react";
import { QrScanner } from "./components/QrScanner";


export function BuyProduct() {
  const [data, setData] = useState("Not Found");

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Teste do Leitor QR</h1>
      <QrScanner />
    </div>
  );
}