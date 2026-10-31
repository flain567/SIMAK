import React, { useState, useEffect, useRef, useCallback } from 'react';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

// Suara Beep Sukses Presensi menggunakan Web Audio API (Tanpa file eksternal)
function playBeepChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Nada ceria dua frekuensi A5 -> D6
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasBarcodeDetector, setHasBarcodeDetector] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScannedText, setLastScannedText] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [continuousMode, setContinuousMode] = useState<boolean>(true);

  // Bersihkan track kamera saat ditutup
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setTorchEnabled(false);
  }, []);

  // Nyalakan kamera
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setLastScannedText(null);

    // Cek ketersediaan BarcodeDetector API
    const isSupported = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    setHasBarcodeDetector(isSupported);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Akses kamera tidak didukung di browser ini. Gunakan browser modern (Google Chrome / Edge).');
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
      }

      // Periksa apakah perangkat mendukung lampu flash / senter
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities?.() || {}) as any;
        setHasTorch(Boolean(capabilities.torch));
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Gagal mengakses kamera. ';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg += 'Izin kamera ditolak. Berikan izin kamera di pengaturan browser.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg += 'Kamera tidak ditemukan pada perangkat ini.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg += 'Kamera sedang digunakan oleh aplikasi lain.';
      } else {
        msg += err.message || 'Periksa koneksi webcam Anda.';
      }
      setCameraError(msg);
      setIsScanning(false);
    }
  }, [facingMode, stopCamera]);

  // Loop deteksi barcode jika BarcodeDetector tersedia
  useEffect(() => {
    if (!isOpen || !isScanning || !hasBarcodeDetector || !videoRef.current) return;

    let detector: any = null;
    try {
      const BarcodeDetectorClass = (window as any).BarcodeDetector;
      detector = new BarcodeDetectorClass({
        formats: ['qr_code', 'code_128', 'code_39', 'data_matrix', 'ean_13'],
      });
    } catch (err) {
      console.warn('BarcodeDetector initialization error:', err);
      return;
    }

    let isProcessing = false;

    scanIntervalRef.current = window.setInterval(async () => {
      if (isProcessing || !videoRef.current || videoRef.current.readyState < 2) return;
      isProcessing = true;

      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes && barcodes.length > 0) {
          const rawValue = barcodes[0].rawValue?.trim();
          if (rawValue && rawValue !== lastScannedText) {
            setLastScannedText(rawValue);

            if (soundEnabled) {
              playBeepChime();
            }
            if (navigator.vibrate) {
              navigator.vibrate([80, 40, 80]);
            }

            onScanSuccess(rawValue);

            if (!continuousMode) {
              stopCamera();
              onClose();
            } else {
              // Delay sebentar sebelum bisa scan tiket yang sama lagi
              setTimeout(() => {
                setLastScannedText(null);
              }, 3000);
            }
          }
        }
      } catch {
        // Abaikan frame yang blur atau gagal dibaca
      } finally {
        isProcessing = false;
      }
    }, 180);

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, [isOpen, isScanning, hasBarcodeDetector, lastScannedText, soundEnabled, continuousMode, onScanSuccess, onClose, stopCamera]);

  // Jalankan kamera saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Handle tombol Flash/Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextTorch = !torchEnabled;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setTorchEnabled(nextTorch);
    } catch (err) {
      console.warn('Torch toggle failed:', err);
    }
  };

  // Handle ganti kamera depan/belakang
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/40 flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">photo_camera</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-on-surface">Kamera Pemindai Presensi</h2>
              <p className="text-xs text-secondary">Arahkan kamera ke QR Code E-Tiket peserta</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup Kamera"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Area Viewfinder Video */}
        <div className="relative aspect-4/3 w-full bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Kotak Bidik & Garis Laser Pemindai */}
          {isScanning && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Overlay gelap di luar kotak bidik */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-emerald-400/90 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                {/* 4 Sudut Bidik Target */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                {/* Garis Laser Animasi Bergerak Naik-Turun */}
                <div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse"
                  style={{
                    animation: 'scannerLaser 2s ease-in-out infinite alternate',
                  }}
                />

                {/* Indikator deteksi berhasil */}
                {lastScannedText && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs rounded-3xl flex items-center justify-center">
                    <div className="px-4 py-2 rounded-full bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg animate-bounce">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>QR Terdeteksi!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pesan Kesalahan Kamera */}
          {cameraError && (
            <div className="absolute inset-0 p-6 bg-surface-container-lowest/95 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">videocam_off</span>
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="font-extrabold text-sm text-on-surface">Kamera Belum Aktif</h3>
                <p className="text-xs text-secondary leading-relaxed">{cameraError}</p>
              </div>
              <button
                type="button"
                onClick={startCamera}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Coba Akses Lagi</span>
              </button>
            </div>
          )}

          {/* Banner Peringatan jika BarcodeDetector API belum ada di browser ini */}
          {!hasBarcodeDetector && !cameraError && (
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-amber-500/90 text-white text-[11px] font-semibold backdrop-blur-sm text-center shadow-lg">
              Browser ini belum mendukung pemindai barcode otomatis secara native. Gunakan <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong> untuk hasil pemindaian langsung terbaik.
            </div>
          )}
        </div>

        {/* Kontrol Kamera di Bawah */}
        <div className="p-4 sm:p-5 bg-surface-container-low/90 border-t border-outline-variant/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Tombol Balik Kamera (Depan / Belakang) */}
            <button
              type="button"
              onClick={switchCamera}
              className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Ganti Kamera Depan/Belakang"
            >
              <span className="material-symbols-outlined text-[18px]">flip_camera_android</span>
              <span className="hidden sm:inline">{facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}</span>
            </button>

            {/* Tombol Flash/Senter jika didukung */}
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  torchEnabled
                    ? 'bg-amber-400 text-amber-950 font-extrabold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
                title="Lampu Senter Kamera"
              >
                <span className="material-symbols-outlined text-[18px]">{torchEnabled ? 'flash_on' : 'flash_off'}</span>
                <span className="hidden sm:inline">Flash</span>
              </button>
            )}

            {/* Suara Beep Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                soundEnabled ? 'text-primary bg-primary/10' : 'text-secondary bg-surface-container'
              }`}
              title={soundEnabled ? 'Bunyi Beep Aktif' : 'Bunyi Beep Hening'}
            >
              <span className="material-symbols-outlined text-[18px]">{soundEnabled ? 'volume_up' : 'volume_off'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Pemindaian Berkelanjutan */}
            <button
              type="button"
              onClick={() => setContinuousMode(!continuousMode)}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                continuousMode
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-surface-container text-secondary'
              }`}
              title="Jika aktif, kamera tetap menyala untuk scan peserta berikutnya tanpa tertutup"
            >
              <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
              <span className="hidden sm:inline">Mode Beruntun</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-extrabold text-xs transition-colors cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scannerLaser {
          0% { top: 10%; }
          100% { top: 90%; }
        }
      `}</style>
    </div>
  );
};

