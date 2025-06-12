import { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeResult
} from "html5-qrcode";

export const QrScanner = () => {
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const onScanSuccess = async (
      decodedText: string,
      decodedResult: Html5QrcodeResult
    ) => {
      const format = decodedResult.result.format?.format;

      if (format !== Html5QrcodeSupportedFormats.EAN_13) {
        console.warn("Formato não suportado:", format);
        return;
      }

      if (hasScannedRef.current || !isRunningRef.current) return;
      hasScannedRef.current = true;

      console.log("📦 Código EAN-13 detectado:", decodedText);

      await scanner.stop();
      isRunningRef.current = false;
    };

    scanner
      .start(
        { facingMode: "environment" }, // 1. cameraConfig
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          disableFlip: false
        }, // 2. config
        onScanSuccess, // 3. success callback
        undefined // 4. failure callback
      )
      .then(() => {
        isRunningRef.current = true;
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao iniciar o scanner:", err);
        setLoading(false);
      });

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current.stop().catch(console.warn);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div id="reader" className="w-full h-[80%]" />
      {loading && (
        <p className="absolute text-gray-500">Carregando câmera...</p>
      )}
    </div>
  );
};
