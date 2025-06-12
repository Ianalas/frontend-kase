import { apiProduct } from "@/lib/axiosProduct";
import { createContext, ReactNode, useContext, useState, useCallback, useMemo } from "react";

// --- Interfaces (Mantidas como estão) ---
export interface Product {
  id?: string; // Adicionei 'id' opcional, pois produtos geralmente têm um ID após serem salvos
  nome: string;
  foto: string;
  codigo: string;
  dataCompra: string;
  valorPago: string;
}

interface PaymentData {
  id: string;
  status: string;
  qr_code: string;
  qr_code_base64: string;
  ticket_url?: string;
}

export interface ProductContextType {
  products: Product[] | null;
  paymentData: PaymentData | null;
  loadingProducts: boolean;
  loadingPayment: boolean;
  errorProducts: any | null;
  errorPayment: any | null;

  criarProduto: (product: Product) => Promise<Product>;
  listarProdutos: () => Promise<Product[]>;
  createPayment: (idCodigo: string, alunoId: string, cpf: string) => Promise<PaymentData>;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [errorProducts, setErrorProducts] = useState<any | null>(null);

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const [errorPayment, setErrorPayment] = useState<any | null>(null);

  const listarProdutos = useCallback(async (): Promise<Product[]> => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const response = await apiProduct.get<Product[]>("/produtos");
      setProducts(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao listar produtos:", error);
      setErrorProducts(error);
      throw error;
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const criarProduto = useCallback(async (product: Product): Promise<Product> => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const response = await apiProduct.post<Product>("/produtos", product);
      listarProdutos();
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      setErrorProducts(error);
      throw error;
    } finally {
      setLoadingProducts(false);
    }
  }, [listarProdutos]);


  const createPayment = useCallback(async (idCodigo: string, alunoId: string, cpf: string): Promise<PaymentData> => {
    setLoadingPayment(true);
    setErrorPayment(null);
    try {
      const response = await apiProduct.post<PaymentData>("/venda/" + idCodigo, {
        alunoId,
        cpf,
      });
      setPaymentData(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar pagamento:", error);
      setErrorPayment(error);
      throw error;
    } finally {
      setLoadingPayment(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    products,
    paymentData,
    loadingProducts,
    loadingPayment,
    errorProducts,
    errorPayment,
    criarProduto,
    listarProdutos,
    createPayment,
  }), [
    products,
    paymentData,
    loadingProducts,
    loadingPayment,
    errorProducts,
    errorPayment,
    criarProduto,
    listarProdutos,
    createPayment,
  ]);

  return (
    <ProductContext.Provider value={contextValue}>
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