import { useEffect } from "react";
import {
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats
} from "html5-qrcode";

export const QrScanner = () => {
  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 350, height: 450 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [0], // 0 = camera (não arquivo)
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13]
    };

    const scanner = new Html5QrcodeScanner("reader", config, false);

    scanner.render(
      (decodedText, decodedResult) => {
        console.log("📦 Código detectado:", decodedText);
        if (decodedText === "7891000397077") {
          alert("EAN-13 reconhecido com sucesso: " + decodedText);
          scanner.clear(); // para parar o scanner
        }
      },
      (error) => {
        // Falha ao escanear (ignorar)
      }
    );

    return () => {
      scanner.clear().catch(console.warn);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div id="reader" className="w-full h-[80%]" />
    </div>
  );
};
