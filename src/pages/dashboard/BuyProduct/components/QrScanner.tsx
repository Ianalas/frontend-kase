import { useState, useEffect, useRef } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScannerState,
} from "html5-qrcode";

// Componentes do Shadcn/UI
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Barcode, CameraOff, MoveHorizontal } from "lucide-react";

const QR_READER_ID = "barcode-reader";

export const QrScanner = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Adiciona um estado para forçar a remontagem do scanner div
  const [scannerKey, setScannerKey] = useState(0); 

  const cleanupScanner = async () => {
    if (scannerRef.current) {
      // Verifica o estado atual do scanner antes de tentar parar
      if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING || 
          scannerRef.current.getState() === Html5QrcodeScannerState.PAUSED) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          console.error("Falha ao parar o scanner.", e);
        }
      }
      scannerRef.current = null; // Limpa a referência após parar
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setScannedCode(decodedText);
    cleanupScanner();
  };

  const handleScanError = (_errorMessage: string) => {
    // Intencionalmente ignorado para não poluir o console ou a UI com erros temporários
  };

  const startScanner = async () => {
    // Passo 1: Limpa qualquer scanner existente e reseta os estados
    await cleanupScanner();
    setScannedCode(null);
    setError(null);
    // Incrementa a chave para forçar a remontagem do div do scanner
    setScannerKey(prevKey => prevKey + 1);

    // Damos um pequeno tempo para o React renderizar o novo div
    // Isso pode ser ajustado ou substituído por uma abordagem baseada em callbacks se o DOM não for atualizado rápido o suficiente
    await new Promise(resolve => setTimeout(resolve, 50)); 
    
    // Passo 2: Cria uma instância TOTALMENTE NOVA do scanner.
    const newScanner = new Html5Qrcode(QR_READER_ID, { verbose: false });
    scannerRef.current = newScanner;

    const config = {
      fps: 10,
      qrbox: { width: 360, height: 250 },
      supportedScanTypes: [], // Deixa vazio para detectar automaticamente
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
    };

    // Passo 3: Inicia a nova instância.
    try {
      await newScanner.start(
        { facingMode: "environment" },
        config,
        handleScanSuccess,
        handleScanError
      );
    } catch (err: any) {
      setError("Não foi possível acessar a câmera. Verifique se outra aplicação a está usando ou se deu permissão.");
      cleanupScanner(); // Limpa se houver erro ao iniciar
    }
  };

  useEffect(() => {
    startScanner(); // Inicia na primeira vez

    return () => {
      // Garante a limpeza quando o componente é desmontado
      cleanupScanner();
    };
  }, [scannerKey]); // Dependência adicionada para reiniciar o scanner quando a chave muda

  return (
    <div className="w-full max-w-md mx-auto p-4 text-center">
      {scannedCode ? (
        // --- TELA DE RESULTADO ---
        <div className="flex flex-col items-center gap-4">
          <Alert>
            <Barcode className="h-4 w-4" />
            <AlertTitle>Código de Barras Lido!</AlertTitle>
            <AlertDescription className="font-mono text-lg pt-2 break-all">
              {scannedCode}
            </AlertDescription>
          </Alert>
          <Button onClick={startScanner} size="lg">
            Escanear Novamente
          </Button>
        </div>
      ) : (
        // --- TELA DO SCANNER ---
        <>
          <p className="mb-2 text-muted-foreground">Aponte a câmera para o código de barras</p>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-black">
            {/* Adiciona a key para forçar a remontagem do div */}
            <div key={scannerKey} id={QR_READER_ID} className="w-full h-full" /> 
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
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};