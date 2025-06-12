import { useState, useEffect, useRef } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScannerState,
} from "html5-qrcode";

// Componentes do Shadcn/UI (opcional, mas recomendado para a UI)
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Barcode, CameraOff } from "lucide-react";

// O ID do elemento HTML onde o scanner será renderizado
const QR_READER_ID = "barcode-reader";

export const QrScanner = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para iniciar o scanner
  const startScanner = () => {
    if (!scannerRef.current) {
      console.error("Scanner ref is not initialized.");
      return;
    }
    // Limpa o estado anterior
    setScannedCode(null);
    setError(null);

    // Configuração do Scanner
    const config = {
      fps: 10,
      // Caixa de leitura otimizada para códigos de barra (mais larga que alta)
      qrbox: { width: 300, height: 150 },
      // Formatos suportados - FOCO TOTAL EM EAN_13
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    };

    // Callback de sucesso
    const onScanSuccess = (decodedText: string) => {
      // Para o scanner e atualiza o estado com o código lido
      stopScanner();
      setScannedCode(decodedText);
      console.log(`📦 Código EAN-13 detectado: ${decodedText}`);
    };

    // Callback de falha (ignorado para não poluir o console)
    const onScanFailure = (errorMessage: string) => {
        alert("deu erro" + errorMessage)
    };

    // Inicia o scanner
    scannerRef.current
      .start(
        { facingMode: "environment" }, // Usa a câmera traseira
        config,
        onScanSuccess,
        onScanFailure
      )
      .catch((err) => {
        console.error("Erro ao iniciar o scanner:", err);
        setError("Não foi possível iniciar a câmera. Verifique as permissões.");
      });
  };
  
  // Função para parar o scanner
  const stopScanner = () => {
    if (
      scannerRef.current &&
      scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      scannerRef.current.stop().catch((err) => {
        console.error("Falha ao parar o scanner.", err);
      });
    }
  };

  // Hook para inicializar e limpar o scanner
  useEffect(() => {
    // Inicializa a instância do scanner no primeiro render
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(QR_READER_ID, {
        verbose: false // Opcional: remove logs detalhados da biblioteca
      });
    }

    startScanner();

    // Função de limpeza para parar o scanner quando o componente for desmontado
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {scannedCode ? (
        // --- TELA DE RESULTADO ---
        <div className="flex flex-col items-center gap-4">
          <Alert>
            <Barcode className="h-4 w-4" />
            <AlertTitle>Código de Barras Lido!</AlertTitle>
            <AlertDescription className="font-mono text-lg pt-2">
              {scannedCode}
            </AlertDescription>
          </Alert>
          <Button onClick={startScanner} size="lg">
            Escanear Novamente
          </Button>
        </div>
      ) : (
        // --- TELA DO SCANNER ---
        <div className="relative w-full">
          <div id={QR_READER_ID} className="w-full rounded-lg overflow-hidden" />
          {error && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col justify-center items-center text-white p-4">
               <CameraOff className="w-12 h-12 mb-4" />
               <p className="text-center font-semibold">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};