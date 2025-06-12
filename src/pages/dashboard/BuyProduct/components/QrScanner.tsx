import { useState, useEffect, useRef } from "react"; // Removi useContext, pois será importado de ProductContext
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScannerState,
} from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Barcode, CameraOff, MoveHorizontal, Loader2 } from "lucide-react"; // Adicionei Loader2 para o estado de carregamento

// --- Importações Necessárias do seu Contexto ---
import { useProduct, PaymentData } from "@/contexts/ProductContext"; // Importa useProduct e PaymentData

const QR_READER_ID = "barcode-reader";

export const QrScanner = () => {
  // Use o hook useProduct para acessar as funções e estados do contexto
  const { createPayment, loadingPayment, errorPayment } = useProduct();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentData | null>(null); // Novo estado para o resultado do pagamento

  
  const [userUid, setUserUid] = useState<number>(123);
  const [cpf, setCpf] = useState<string>("123.456.789-00");
  // Estado para controlar se o scanner está ativo ou se estamos processando o pagamento
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const cleanupScanner = async () => {
    if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (e) {
        console.error("Falha ao parar o scanner.", e);
      }
    }
  };

  // --- Nova função para lidar com o código de barras lido e iniciar o pagamento ---
  const processScannedCode = async (code: string) => {
    setScannedCode(code); // Define o código lido
    await cleanupScanner(); // Para o scanner imediatamente
    setIsProcessingPayment(true); // Indica que o pagamento está sendo processado
    setPaymentResult(null); // Limpa resultados anteriores

    try {
      // Chama a função createPayment do contexto
      // idCodigo será o scannedCode
      // alunoId e cpf virão dos seus estados (ou props)
      const result = await createPayment(code, userId, cpf);
      setPaymentResult(result); // Armazena o resultado do pagamento
      console.log("Resultado do pagamento:", result);
    } catch (err: any) {
      // O erro do pagamento já é capturado no contexto, mas podemos exibir aqui
      setError(errorPayment?.message || "Erro ao processar o pagamento.");
      console.error("Erro no processamento do pagamento:", err);
    } finally {
      setIsProcessingPayment(false); // Finaliza o processamento
    }
  };


  // A função handleScanSuccess agora chama processScannedCode
  const handleScanSuccess = (decodedText: string) => {
    processScannedCode(decodedText);
  };

  const handleScanError = (_errorMessage: string) => {/* Intencionalmente ignorado */ };


  const startScanner = async () => {
    await cleanupScanner(); // Garante que o scanner anterior foi parado

    setScannedCode(null);
    setError(null);
    setPaymentResult(null); // Limpa o resultado do pagamento ao reiniciar o scanner
    setIsProcessingPayment(false); // Reinicia o estado de processamento

    const newScanner = new Html5Qrcode(QR_READER_ID, { verbose: false });
    scannerRef.current = newScanner;

    const config = {
      fps: 10,
      qrbox: { width: 360, height: 250 },
      supportedScanTypes: [], // Vazio para não tentar QR codes também, apenas o formato especificado
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13], // Apenas EAN_13 para códigos de barras
    };


    try {
      await newScanner.start(
        { facingMode: "environment" },
        config,
        handleScanSuccess,
        handleScanError
      );
    } catch (err: any) {
      setError("Não foi possível acessar a câmera. Verifique se outra aplicação a está usando e recarregue a página.");
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      cleanupScanner();
    };
  }, []); // Dependências vazias para rodar apenas no mount/unmount


  return (
    <div className="w-full max-w-md mx-auto p-4 text-center">
      {scannedCode && paymentResult ? ( // Exibe o resultado do pagamento se houver código lido e resultado
        <div className="flex flex-col items-center gap-4">
          <Alert>
            <Barcode className="h-4 w-4" />
            <AlertTitle>Pagamento Processado!</AlertTitle>
            <AlertDescription className="font-mono text-lg pt-2 break-all">
              Código de Barras: {scannedCode} <br />
              Status: <span className="font-bold">{paymentResult.status}</span> <br />
              {paymentResult.qr_code_base64 && (
                <>
                  <img src={paymentResult.qr_code_base64} alt="QR Code Pix" className="mx-auto my-4 w-40 h-40" />
                  <p className="text-sm">Escaneie o QR Code para finalizar.</p>
                </>
              )}
              {paymentResult.ticket_url && (
                <a href={paymentResult.ticket_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Ver Recibo
                </a>
              )}
            </AlertDescription>
          </Alert>
          <Button onClick={startScanner} size="lg">
            Escanear Novo Produto
          </Button>
        </div>
      ) : isProcessingPayment || loadingPayment ? ( // Estado de carregamento do pagamento
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-primary">Processando pagamento...</p>
          <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos.</p>
        </div>
      ) : ( // Exibe o scanner
        <>
          <p className="mb-2 text-muted-foreground">Aponte a câmera para o código de barras</p>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-black">
            <div id={QR_READER_ID} className="w-full h-full" />
            {!error && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-72 h-40 border-4 border-primary/50 rounded-lg shadow-2xl" />
                <MoveHorizontal className="text-primary/50 w-12 h-12 mt-4 animate-pulse" />
              </div>
            )}
            {error && (
              <div className="absolute inset-0 bg-background/90 flex flex-col justify-center items-center text-center p-4">
                <CameraOff className="w-12 h-12 mb-4 text-destructive" />
                <p className="font-semibold text-destructive">Erro de Câmera</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={startScanner} className="mt-4">Tentar Novamente</Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};