import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, QrCode } from 'lucide-react';

export const QrScanner: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!readerRef.current) return;

    scannerRef.current = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scannerRef.current.render(
      (decodedText: string) => {
        setScannedData(decodedText);
        scannerRef.current?.clear();
      },
      (error) => {
        console.warn('Erro na leitura:', error);
      }
    );

    setIsLoading(false);

    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
  }, []);

  return (
    <Card className="max-w-md mx-auto p-4 shadow-2xl rounded-2xl border border-neutral-300">
      <CardHeader className="text-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <QrCode className="w-6 h-6 text-primary" />
          <CardTitle className="text-xl font-semibold">Leitor de QR Code</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : (
          <div ref={readerRef} id="reader" className="w-full rounded-md overflow-hidden" />
        )}

        {scannedData && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Resultado do QR Code:</p>
            <Badge className="text-wrap break-words px-4 py-2">{scannedData}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
