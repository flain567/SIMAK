import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeGraphicProps {
  value: string;
  size?: number;
}

export const QrCodeGraphic: React.FC<QrCodeGraphicProps> = ({ value, size = 156 }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: Math.max(size * 2, 280), // High-DPI crisp rendering
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1c1b1f',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
  }, [value, size]);

  return (
    <div
      className="inline-flex items-center justify-center bg-white p-2 border-2 border-outline-variant/40 rounded-xl shadow-xs overflow-hidden"
      style={{ width: size, height: size }}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`QR Code ${value}`}
          className="w-full h-full object-contain"
          width={size}
          height={size}
        />
      ) : (
        <div className="w-full h-full animate-pulse bg-surface-container-low rounded-lg" />
      )}
    </div>
  );
};
