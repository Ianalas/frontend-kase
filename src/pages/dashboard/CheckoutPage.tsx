import { useState } from "react";
import { useProduct } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/card";
import { CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface  InfoProduct{
  amount: number;
  description: string;
}

export function CheckoutPage() {
  const { paymentData, createPayment } = useProduct();
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<InfoProduct>({} as InfoProduct)

  const handleCreatePayment = async () => {
    setLoading(true);
    try {
      await createPayment(productInfo.amount, productInfo.description);
    } catch {
      alert("Erro ao criar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setProductInfo((prev) => {
      let newValue: string | number = value;
      if (name === "amount") {
        newValue = value === '' ? 0 : parseFloat(value);
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });

  }


  return (
    <div className="mt-16 flex flex-col items-center gap-6 w-[50%]">
      <h1 className="text-2xl font-bold">Pagamento via PIX</h1>

      <Section className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
        <Label>
          Valor do pedido
        </Label>
        <Label>
          Descrição do pedido
        </Label>
        <Input type="number" placeholder="Valor" name="amount" value={productInfo.amount} onChange={handleOnChange} />
        <Input type="text" placeholder="Descrição" name="description" value={productInfo.description} onChange={handleOnChange} />
      </Section>
      <Button className="w-[45%] cursor-pointer" onClick={handleCreatePayment} disabled={loading}>
        {loading ? "Gerando..." : "Gerar QR Code"}
      </Button>

      {paymentData && (
        <div className="mt-5 grid gap-2 items-center">
          <p className="text-center">Status: {paymentData.status}</p>
          <p className="text-center">ID: {paymentData.id}</p>
          {paymentData.qr_code_base64 && (
            <div className="flex flex-col items-center">
              <img
                src={`data:image/png;base64,${paymentData.qr_code_base64}`}
                alt="QR Code PIX"
                style={{ width: 200, height: 200 }}
              />
              
              <Card title="Link para o pagamento" subtitle="Copie o link cole em sua barra de busca" className="mt-2">
                <CardContent>
                  <Link to={paymentData.ticket_url || "*"} target="_blank" >
                    <p className="font-light text-base">
                      {paymentData.ticket_url ?? "O link bugou"}
                    </p>
                  </Link>
                </CardContent>
              </Card>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
