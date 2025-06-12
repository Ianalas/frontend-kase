import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";

interface PaymentData {
  id: string;
  status: string;
  qr_code: string;
  qr_code_base64: string;
  ticket_url?: string;
}

interface ProductContextType {
  paymentData: PaymentData | null;
  createPayment: (amount: number, description: string) => Promise<void>;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: ProductProviderProps) {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const createPayment = async (amount: number, description: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/payment/create", {
        amount,
        description,
      });
      setPaymentData(response.data);
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      throw error; // Repassa para quem chamou lidar com erro se quiser
    }
  };

  return (
    <ProductContext.Provider value={{ paymentData, createPayment }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct deve ser usado dentro de ProductProvider");
  }
  return context;
}