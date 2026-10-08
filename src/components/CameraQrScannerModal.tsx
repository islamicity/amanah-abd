import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  X,
  Camera,
  QrCode,
  ScanLine,
  Flashlight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UploadCloud,
  Copy,
  Sparkles,
  MapPin,
  Building,
  Clock,
  Flame,
  Zap,
  User,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Complaint } from '../types';
import { playNotificationTone } from '../services/audioNotification';

export interface CameraQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Complaint[];
  onSelectComplaint: (complaintId: string) => void;
  onNavigateToComplaintView?: () => void;
  initialSelectedId?: string | null;
}

export interface ParsedQrResult {
  raw: string;
  ticketId: string;
  matchedComplaint?: Complaint;
  isAmanahGov: boolean;
}

/**
 * Intelligent parser for official AmanahGov QR codes across various formats:
 * - Full URLs: https://amanahgov.id/?ticket=ADU-2026-0811
 * - Deep Links: https://.../#ticket-ADU-2026-0811
 * - Direct codes: ADU-2026-0811
 * - Prefixes: AmanahGov:ADU-2026-0811 or TICKET:ADU-2026-0811
 * - JSON: {"ticket":"ADU-2026-0811"}
 */
export function parseComplaintIdFromQr(
  rawText: string,
  complaints: Complaint[]
): ParsedQrResult | null {
  if (!rawText || typeof rawText !== 'string') return null;
  const trimmed = rawText.trim();

  // 1. Full URL matching (both absolute and relative URLs)
  try {
    const isFullUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://');
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://amanahgov.id';
    const url = isFullUrl ? new URL(trimmed) : new URL(trimmed, base);

    // 1a. Query parameters: ticket, id, complaint, nomor, nomorTiket, ref
    const ticketParam =
      url.searchParams.get('ticket') ||
      url.searchParams.get('id') ||
      url.searchParams.get('complaint') ||
      url.searchParams.get('nomor') ||
      url.searchParams.get('nomorTiket') ||
      url.searchParams.get('ref');

    if (ticketParam) {
      const cleanId = decodeURIComponent(ticketParam).trim();
      const match = complaints.find(
        (c) => c.id.toLowerCase() === cleanId.toLowerCase()
      );
      return {
        raw: trimmed,
        ticketId: match ? match.id : cleanId,
        matchedComplaint: match,
        isAmanahGov: true,
      };
    }

    // 1b. URL hash / fragment: #ticket-ADU-2026-0811 or #ADU-2026-0811
    if (url.hash) {
      const hashMatch = url.hash.match(/\b(ADU-[A-Za-z0-9-]+)\b/i);
      if (hashMatch) {
        const cleanId = hashMatch[1].toUpperCase();
        const match = complaints.find(
          (c) => c.id.toUpperCase() === cleanId
        );
        return {
          raw: trimmed,
          ticketId: match ? match.id : cleanId,
          matchedComplaint: match,
          isAmanahGov: true,
        };
      }
    }

    // 1c. URL pathname: e.g. /aduan/ADU-2026-0811 or /pengaduan/ADU-2026-0811
    if (url.pathname) {
      const pathMatch = url.pathname.match(/\b(ADU-[A-Za-z0-9-]+)\b/i);
      if (pathMatch) {
        const cleanId = pathMatch[1].toUpperCase();
        const match = complaints.find(
          (c) => c.id.toUpperCase() === cleanId
        );
        return {
          raw: trimmed,
          ticketId: match ? match.id : cleanId,
          matchedComplaint: match,
          isAmanahGov: true,
        };
      }
    }
  } catch {
    // Not a URL, continue with regex and string patterns
  }

  // 2. Query string in fragment or partial text (e.g. "?ticket=ADU-2026-0811")
  const queryMatch = trimmed.match(/[?&]?(?:ticket|id|complaint|nomor)=([^&#\s]+)/i);
  if (queryMatch) {
    const cleanId = decodeURIComponent(queryMatch[1]).trim();
    const match = complaints.find(
      (c) => c.id.toLowerCase() === cleanId.toLowerCase()
    );
    return {
      raw: trimmed,
      ticketId: match ? match.id : cleanId,
      matchedComplaint: match,
      isAmanahGov: true,
    };
  }

  // 3. JSON formatted QR payload
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      const possibleId =
        parsed.ticket ||
        parsed.ticketId ||
        parsed.id ||
        parsed.complaintId ||
        parsed.nomorTiket;
      if (possibleId && typeof possibleId === 'string') {
        const cleanId = possibleId.trim();
        const match = complaints.find(
          (c) => c.id.toLowerCase() === cleanId.toLowerCase()
        );
        return {
          raw: trimmed,
          ticketId: match ? match.id : cleanId,
          matchedComplaint: match,
          isAmanahGov: true,
        };
      }
    } catch {
      // Ignore JSON parse failure
    }
  }

  // 4. Prefixed format: "AmanahGov:ADU-..." or "TICKET:ADU-..."
  const prefixMatch = trimmed.match(/^(?:AmanahGov|TICKET|ADUAN|PENGADUAN)[:\s]+(.+)$/i);
  if (prefixMatch) {
    const cleanId = prefixMatch[1].trim();
    const match = complaints.find(
      (c) => c.id.toLowerCase() === cleanId.toLowerCase()
    );
    return {
      raw: trimmed,
      ticketId: match ? match.id : cleanId,
      matchedComplaint: match,
      isAmanahGov: true,
    };
  }

  // 5. Standard AmanahGov ticket code regex pattern: ADU-xxxx
  const aduMatch = trimmed.match(/\b(ADU-[A-Za-z0-9-]+)\b/i);
  if (aduMatch) {
    const cleanId = aduMatch[1].toUpperCase();
    const match = complaints.find((c) => c.id.toUpperCase() === cleanId);
    return {
      raw: trimmed,
      ticketId: match ? match.id : cleanId,
      matchedComplaint: match,
      isAmanahGov: true,
    };
  }

  // 6. Direct match with any loaded complaint ID
  const directMatch = complaints.find(
    (c) => c.id.toLowerCase() === trimmed.toLowerCase()
  );
  if (directMatch) {
    return {
      raw: trimmed,
      ticketId: directMatch.id,
      matchedComplaint: directMatch,
      isAmanahGov: true,
    };
  }

  // 7. Fallback: scanned text is not recognized as an official ticket
  return {
    raw: trimmed,
    ticketId: trimmed,
    matchedComplaint: undefined,
    isAmanahGov: false,
  };
}

type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'paused'
  | 'permission-denied'
  | 'no-camera'
  | 'camera-error';

export const CameraQrScannerModal: React.FC<CameraQrScannerModalProps> = ({
  isOpen,
  onClose,
  complaints,
  onSelectComplaint,
  onNavigateToComplaintView,
}) => {
  if (!isOpen) return null;

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');

  // Scanning detection state
  const [scanResult, setScanResult] = useState<ParsedQrResult | null>(null);
  const [autoOpenCountdown, setAutoOpenCountdown] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [manualTicketInput, setManualTicketInput] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop camera media stream
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsTorchOn(false);
    setHasTorch(false);
  }, []);

  // Handle successful QR detection
  const handleQrFound = useCallback(
    (detectedData: string) => {
      // Pause scan loop
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      const parsed = parseComplaintIdFromQr(detectedData, complaints);
      if (!parsed) return;

      // Play audio chime and device vibration
      try {
        playNotificationTone('success');
      } catch {
        // audio fallback
      }
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([70, 40, 70]);
        } catch {
          // vibration fallback
        }
      }

      setScanResult(parsed);

      // If matched with an official complaint, start auto-open transition (0.6s)
      if (parsed.matchedComplaint) {
        setAutoOpenCountdown(0.6);
      } else {
        setAutoOpenCountdown(null);
      }
    },
    [complaints]
  );

  // Frame processing loop with native BarcodeDetector & fallback jsQR
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(processFrame);
      return;
    }

    // 1. Try Hardware-accelerated native BarcodeDetector if available
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        detector
          .detect(video)
          .then((barcodes: any[]) => {
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleQrFound(barcodes[0].rawValue);
              return;
            }
          })
          .catch(() => {});
      } catch {
        // Fall back to jsQR
      }
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      animationFrameId.current = requestAnimationFrame(processFrame);
      return;
    }

    // Set canvas dimensions matching video stream
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.drawImage(video, 0, 0, width, height);

    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });

      if (code && code.data && code.data.trim().length > 0) {
        handleQrFound(code.data);
        return;
      }
    } catch (e) {
      console.warn('Frame scan tick error:', e);
    }

    // Continue scanning next frame
    animationFrameId.current = requestAnimationFrame(processFrame);
  }, [handleQrFound]);

  // Start camera media stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraStatus('requesting');
    setErrorMessage(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('no-camera');
      setErrorMessage('Akses kamera tidak didukung pada browser atau lingkungan iframe ini.');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback with minimal constraints if ideal constraints fail
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities?.() || {}) as { torch?: boolean };
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraStatus('active');
        animationFrameId.current = requestAnimationFrame(processFrame);
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or failed:', err);
      const errName = (err as Error)?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setCameraStatus('permission-denied');
        setErrorMessage(
          'Izin kamera ditolak. Silakan klik ikon gembok/kamera di bilah URL browser Anda untuk mengizinkan akses kamera.'
        );
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setCameraStatus('no-camera');
        setErrorMessage('Perangkat keras kamera tidak ditemukan di sistem ini.');
      } else {
        setCameraStatus('camera-error');
        setErrorMessage((err as Error)?.message || 'Terjadi gangguan saat menghubungkan kamera.');
      }
    }
  }, [facingMode, processFrame, stopCamera]);

  // Toggle Torch/Flashlight
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextTorch = !isTorchOn;
      await videoTrack.applyConstraints({
        advanced: [{ torch: nextTorch } as unknown as MediaTrackConstraintSet],
      });
      setIsTorchOn(nextTorch);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  // Flip Camera (Front / Rear)
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Lifecycle when modal opens or closes, or when active tab changes
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !scanResult) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, scanResult, startCamera, stopCamera]);

  // Auto-open countdown ticker
  useEffect(() => {
    if (autoOpenCountdown === null) return;

    if (autoOpenCountdown <= 0) {
      if (scanResult?.matchedComplaint) {
        handleConfirmOpen(scanResult.matchedComplaint.id);
      }
      return;
    }

    countdownTimerRef.current = setTimeout(() => {
      setAutoOpenCountdown((prev) => (prev !== null ? Math.max(0, +(prev - 0.2).toFixed(1)) : null));
    }, 200);

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [autoOpenCountdown, scanResult]);

  // Confirm navigation to the complaint detail view
  const handleConfirmOpen = (complaintId: string) => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
    }
    stopCamera();
    onSelectComplaint(complaintId);
    if (onNavigateToComplaintView) {
      onNavigateToComplaintView();
    }
    onClose();
  };

  // Reset scan to allow scanning another code
  const handleScanAgain = () => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
    }
    setScanResult(null);
    setAutoOpenCountdown(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  // Image file drop or upload scanner
  const handleFileScan = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (.png, .jpg, .jpeg, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          handleQrFound(code.data);
        } else {
          alert('Tidak ditemukan QR code yang terbaca pada gambar tersebut. Pastikan gambar cukup jelas dan tidak terpotong.');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileScan(e.dataTransfer.files[0]);
    }
  };

  // Manual ticket ID submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    if (!manualTicketInput.trim()) {
      setManualError('Silakan masukkan nomor atau ID tiket');
      return;
    }

    const parsed = parseComplaintIdFromQr(manualTicketInput.trim(), complaints);
    if (parsed && parsed.matchedComplaint) {
      handleQrFound(manualTicketInput.trim());
    } else {
      setManualError(`Tiket dengan ID "${manualTicketInput.trim()}" tidak ditemukan dalam sistem.`);
    }
  };

  // Quick sample test handler for demo verification
  const handleQuickTestSample = (sampleId: string) => {
    handleQrFound(`https://amanahgov.id/?ticket=${sampleId}`);
  };

  const matched = scanResult?.matchedComplaint;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md shadow-emerald-950">
              <ScanLine className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Pindai QR Tiket Pengaduan
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Resmi AmanahGov
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Arahkan kamera ke QR Code resmi untuk membuka lembar tiket seketika
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup Pemindai QR"
            id="btn-close-qr-scanner-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => {
              setActiveTab('camera');
              if (!scanResult) startCamera();
            }}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="tab-camera-scan"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Kamera Langsung</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="tab-upload-qr"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Unggah Gambar QR</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('manual');
              stopCamera();
            }}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="tab-manual-input"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ketik ID Tiket</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* STATE A: TICKET DETECTED (SUCCESS SCREEN) */}
          {scanResult ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {matched ? (
                /* OFFICIAL MATCHED COMPLAINT CARD */
                <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-emerald-500/70 rounded-2xl p-5 shadow-xl space-y-4">
                  {/* Verified Header Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        QR Tiket Terverifikasi Resmi
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-700">
                      {matched.id}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {matched.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {matched.description}
                    </p>
                  </div>

                  {/* Compact Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Status Terkini:</span>
                      <strong className="text-emerald-300 block truncate">
                        {matched.status.replace(/_/g, ' ')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">OPD Pelaksana:</span>
                      <strong className="text-slate-200 block truncate">
                        {matched.assignedDepartment}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tingkat Urgensi:</span>
                      <span className="font-bold text-amber-300 block">
                        {matched.urgency}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Target SLA:</span>
                      <span className="font-mono text-slate-200">
                        {matched.slaTargetHours} Jam
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10px]">Lokasi Penanganan:</span>
                      <span className="text-slate-200 block truncate">
                        {matched.location}
                      </span>
                    </div>
                  </div>

                  {/* Auto-Open Countdown Banner */}
                  {autoOpenCountdown !== null && (
                    <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="text-emerald-200">
                          Membuka detail tiket otomatis dalam{' '}
                          <strong className="font-mono text-white text-sm">
                            {autoOpenCountdown.toFixed(1)}s
                          </strong>
                          ...
                        </span>
                      </div>
                      <button
                        onClick={() => setAutoOpenCountdown(null)}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <button
                      onClick={() => handleConfirmOpen(matched.id)}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
                      id="btn-confirm-open-ticket"
                    >
                      <span>Buka Lembar Pengaduan Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleScanAgain}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Pindai Tiket Lain</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* UNMATCHED OR UNRECOGNIZED QR */
                <div className="bg-slate-950 border border-amber-600/50 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2.5 text-amber-400">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      QR Terbaca, Namun Tiket Tidak Ditemukan
                    </h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Kode QR berhasil dibaca, namun ID <strong className="text-amber-300 font-mono">#{scanResult.ticketId}</strong> tidak ditemukan pada database pengaduan aktif.
                  </p>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
                    <span className="text-[10px] text-slate-500 block mb-1 uppercase font-sans">
                      Data Mentah QR:
                    </span>
                    {scanResult.raw}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={handleScanAgain}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Pindai Ulang</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('manual')}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      Masukkan ID Manual
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STATE B: SCANNER VIEWPORT / MODES */
            <>
              {/* TAB 1: LIVE CAMERA */}
              {activeTab === 'camera' && (
                <div className="space-y-3">
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                    {/* The Live Video Element */}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`w-full h-full object-cover ${
                        cameraStatus === 'active' ? 'opacity-100' : 'opacity-0'
                      }`}
                    />

                    {/* Hidden Offscreen Canvas for Frame Decoding */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Overlay Grid Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

                    {/* CAMERA ACTIVE: HUD Viewfinder & Laser Animation */}
                    {cameraStatus === 'active' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        {/* Target Scanning Box with Emerald Corners */}
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 border border-emerald-500/40 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                          {/* Corner Reticles */}
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />

                          {/* Animated Scanning Laser Line */}
                          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_#34d399] animate-qr-laser" />

                          <div className="text-[11px] font-medium text-emerald-300/90 bg-slate-950/80 px-3 py-1 rounded-full border border-emerald-500/40 backdrop-blur-sm pointer-events-none shadow-md">
                            Arahkan ke QR Code Tiket
                          </div>
                        </div>

                        {/* Sub-label under viewfinder */}
                        <span className="mt-3 text-[11px] text-slate-300 font-medium bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700/60 shadow-md">
                          Deteksi Otomatis Aktif
                        </span>
                      </div>
                    )}

                    {/* CAMERA REQUESTING STATE */}
                    {cameraStatus === 'requesting' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90">
                        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                        <div>
                          <p className="text-sm font-semibold text-white">Menghubungkan ke Sensor Kamera...</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Mohon izinkan peramban Anda untuk mengakses kamera bila ada permintaan izin.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* CAMERA PERMISSION DENIED STATE */}
                    {cameraStatus === 'permission-denied' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/95">
                        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                          <h4 className="text-sm font-bold text-white">Izin Kamera Tidak Diberikan</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {errorMessage ||
                              'Akses kamera diblokir oleh peramban. Anda tetap dapat mengunggah gambar QR code atau mengetik nomor tiket.'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={startCamera}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Coba Izin Lagi
                          </button>
                          <button
                            onClick={() => setActiveTab('upload')}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                          >
                            Gunakan Unggah Gambar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* NO CAMERA HARDWARE DETECTED STATE */}
                    {cameraStatus === 'no-camera' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/95">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                          <h4 className="text-sm font-bold text-white">Kamera Tidak Terdeteksi</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {errorMessage ||
                              'Tidak ada modul kamera yang aktif. Anda dapat mengunggah screenshot gambar QR atau memilih tiket pengujian di bawah.'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setActiveTab('upload')}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Unggah File QR</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CAMERA ERROR STATE */}
                    {cameraStatus === 'camera-error' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/95">
                        <AlertTriangle className="w-8 h-8 text-rose-400" />
                        <p className="text-xs text-slate-300 max-w-xs">{errorMessage}</p>
                        <button
                          onClick={startCamera}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Muat Ulang Kamera
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Camera Action Toolbar (Flip camera & Torch) */}
                  <div className="flex items-center justify-between px-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleFlipCamera}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Ganti ke kamera depan / belakang"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kamera: {facingMode === 'environment' ? 'Belakang' : 'Depan'}</span>
                      </button>

                      {hasTorch && (
                        <button
                          onClick={handleToggleTorch}
                          className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                            isTorchOn
                              ? 'bg-amber-400 text-black border-amber-300 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                          }`}
                          title="Nyalakan/matikan lampu senter ponsel"
                        >
                          <Flashlight className="w-3.5 h-3.5" />
                          <span>Senter {isTorchOn ? 'ON' : 'OFF'}</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      Resolusi: HD 720p
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: UPLOAD IMAGE */}
              {activeTab === 'upload' && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isDraggingFile
                        ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01]'
                        : 'border-slate-700 bg-slate-950/50 hover:border-emerald-500/50 hover:bg-slate-950'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileScan(e.target.files[0]);
                        }
                      }}
                    />

                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                      <UploadCloud className="w-7 h-7" />
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      Pilih atau Tarik File Gambar QR Code
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                      Dukung file tangkapan layar (screenshot), foto slip cetak, atau unduhan gambar QR (.PNG, .JPG, .WEBP)
                    </p>

                    <button
                      type="button"
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
                    >
                      Jelajahi File Gambar
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: MANUAL INPUT */}
              {activeTab === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Masukkan Nomor / ID Tiket Pengaduan:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: ADU-2026-0811 atau tautan QR..."
                        value={manualTicketInput}
                        onChange={(e) => {
                          setManualTicketInput(e.target.value);
                          setManualError(null);
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        id="input-manual-ticket-id"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Buka Tiket
                      </button>
                    </div>

                    {manualError && (
                      <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{manualError}</span>
                      </p>
                    )}
                  </div>
                </form>
              )}

              {/* QUICK DEMO SAMPLES (ALLOWS INSTANT VERIFICATION WITHOUT PHYSICAL CAMERA) */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Uji Coba Cepat QR Tiket Resmi:
                  </span>
                  <span className="text-[10px] text-slate-500">Klik untuk simulasi pindaian instan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {complaints.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleQuickTestSample(item.id)}
                      className="text-left p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition-all cursor-pointer group"
                      title={item.title}
                    >
                      <span className="text-[10px] font-mono font-bold text-emerald-300 block group-hover:text-emerald-200">
                        {item.id}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">
                        {item.title}
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        {item.urgency}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enkripsi Tanda Tangan Digital AmanahGov • Anti-Palsu</span>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraQrScannerModal;
