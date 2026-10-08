import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Copy,
  Check,
  Download,
  Printer,
  ExternalLink,
  ShieldCheck,
  Clock,
  MapPin,
  Building,
  User,
  ScanLine,
  Camera,
  PlayCircle,
  FileCheck2,
  Sparkles,
  Phone,
  Hash,
  AlertTriangle,
  ArrowRight,
  FileDown,
} from 'lucide-react';
import { Complaint } from '../types';
import { generateAndDownloadComplaintPdf } from '../utils/complaintPdfGenerator';

interface TicketQrCodeModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateProgress?: (id: string) => void;
  onOpenWhatsApp?: (id: string) => void;
  allComplaints?: Complaint[];
  onSelectComplaint?: (id: string) => void;
  onOpenLiveCameraScanner?: () => void;
}

export const TicketQrCodeModal: React.FC<TicketQrCodeModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onSimulateProgress,
  onOpenWhatsApp,
  allComplaints = [],
  onSelectComplaint,
  onOpenLiveCameraScanner,
}) => {
  if (!isOpen || !complaint) return null;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'slip' | 'scanner'>('qr');
  const [isSimulatingScan, setIsSimulatingScan] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [errorCorrection, setErrorCorrection] = useState<'M' | 'H'>('H');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Compute the direct deep-link URL for this specific complaint
  const getTicketUrl = () => {
    if (typeof window === 'undefined') return `https://amanahgov.id/?ticket=${complaint.id}`;
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?ticket=${encodeURIComponent(complaint.id)}`;
  };

  const ticketUrl = getTicketUrl();

  // Generate QR Code data URL whenever complaint or errorCorrection changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(ticketUrl, {
      errorCorrectionLevel: errorCorrection,
      margin: 2,
      width: 400,
      color: {
        dark: '#064e3b', // Deep emerald
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [ticketUrl, errorCorrection, complaint.id]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(ticketUrl);
      } else {
        const input = document.createElement('input');
        input.value = ticketUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy ticket URL:', err);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-AmanahGov-${complaint.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleDownloadPdfDoc = async () => {
    if (!complaint) return;
    setIsDownloadingPdf(true);
    try {
      await generateAndDownloadComplaintPdf(complaint, {
        includeTimeline: true,
        includeQrCode: true,
        includeDigitalSignature: true,
      });
    } catch (err) {
      console.error('Failed to generate PDF from modal:', err);
      alert('Gagal membuat dokumen PDF. Silakan coba kembali.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleRunScannerSimulation = () => {
    setIsSimulatingScan(true);
    setScanSuccess(false);

    setTimeout(() => {
      setIsSimulatingScan(false);
      setScanSuccess(true);
    }, 1800);
  };

  const remainingHours = Math.max(0, complaint.slaTargetHours - complaint.elapsedHours);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-800/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {complaint.id}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Pelacakan Langsung QR Code
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {complaint.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-6 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Kode QR &amp; Tautan</span>
          </button>

          <button
            onClick={() => setActiveTab('slip')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'slip'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Lembar Tugas Lapangan / Cetak Slip</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scanner'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Simulator Pindai Petugas</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-5">
          {/* TAB 1: QR CODE & DIRECT LINK */}
          {activeTab === 'qr' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                {/* QR Display Container */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30 flex items-center justify-center">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR Code untuk Tiket ${complaint.id}`}
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                        Membuat QR Code...
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                    KODE VERIFIKASI RESMI
                  </span>
                </div>

                {/* Details & Action List */}
                <div className="flex-1 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                      Fungsi Quick-Scan Tiket:
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      Kode QR ini terhubung langsung ke rincian tiket <strong>#{complaint.id}</strong>.
                      Warga dan Petugas Lapangan cukup mengarahkan kamera ponsel untuk langsung memeriksa progres pengerjaan, SLA, dan validasi on-chain tanpa perlu login manual.
                    </p>
                  </div>

                  {/* Quick Meta Badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Status Terkini:</span>
                      <strong className="text-emerald-300">{complaint.status.replace(/_/g, ' ')}</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Sisa Target SLA:</span>
                      <strong className={remainingHours <= 4 && complaint.status !== 'Selesai_Teruji' ? 'text-rose-400' : 'text-slate-200'}>
                        {complaint.status === 'Selesai_Teruji' ? 'Tuntas 100%' : `${remainingHours} jam lagi`}
                      </strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Pelapor:</span>
                      <strong className="text-slate-200">{complaint.citizenName}</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">OPD:</span>
                      <strong className="text-slate-200 truncate block">{complaint.assignedDepartment}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={handleDownloadQr}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md cursor-pointer"
                      title="Unduh file gambar QR Code (.PNG)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Gambar QR (.PNG)</span>
                    </button>

                    <button
                      onClick={handleDownloadPdfDoc}
                      disabled={isDownloadingPdf}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                      title="Unduh Surat Bukti Pengaduan Resmi dalam format PDF yang ditandatangani digital"
                      id="btn-qr-modal-download-pdf"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>{isDownloadingPdf ? 'Membuat PDF...' : 'Unduh PDF Resmi'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('slip')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold transition-colors cursor-pointer"
                      title="Cetak lembar tugas lapangan dengan QR Code"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cetak Lembar Tugas</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Deep-Link Box with 1-Click Copy */}
              <div className="space-y-1.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tautan Langsung Tiket (Deep-Link URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Siap dibagikan ke WhatsApp / SMS</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={ticketUrl}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono select-all focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      copied
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Tautan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Practical Guidance for Citizens & Officers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <User className="w-3.5 h-3.5" />
                    <span>Bagi Warga Pelapor</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Simpan QR ini di ponsel Anda atau cetak. Setiap kali Anda ingin tahu progres aduan, cukup scan tanpa perlu menghafal NIK atau nomor registrasi panjang.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Bagi Petugas Lapangan (TRC)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Tempelkan kode QR pada stiker penanda pengerjaan di lokasi fisik. Petugas teknis memindai untuk check-in kedatangan dan validasi penyelesaian on-chain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRINTABLE FIELD TASK SLIP */}
          {activeTab === 'slip' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pratinjau Lembar Tugas Lapangan Resmi dengan Stempel QR Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdfDoc}
                    disabled={isDownloadingPdf}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                    title="Unduh Berkas PDF Resmi Bersertifikat Digital"
                    id="btn-slip-download-pdf"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{isDownloadingPdf ? 'Membuat PDF...' : 'Unduh PDF Resmi'}</span>
                  </button>
                  <button
                    onClick={handlePrintSlip}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Lembar Fisik</span>
                  </button>
                </div>
              </div>

              {/* Slip Card (Printable Area) */}
              <div
                ref={printRef}
                className="bg-white text-slate-900 p-6 rounded-xl border border-slate-300 shadow-lg space-y-4 font-sans text-xs"
                id="printable-complaint-slip"
              >
                {/* Header Kop Surat */}
                <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                        AG
                      </div>
                      <h2 className="text-sm font-black tracking-wide uppercase text-slate-900">
                        AMANAHGOV • PEMERINTAHAN CERDAS &amp; AMANAH
                      </h2>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Lembar Penugasan Lapangan &amp; Kartu Pantau Pengaduan Warga On-Chain
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold border border-slate-300">
                      NO: {complaint.id}
                    </span>
                    <p className="text-[9px] text-slate-500 mt-1">{complaint.createdAt}</p>
                  </div>
                </div>

                {/* Grid Content with QR */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2 space-y-2 text-[11px]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Judul Laporan Aduan:
                      </span>
                      <p className="font-bold text-sm text-slate-900 leading-tight">
                        {complaint.title}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-200">
                      <div>
                        <span className="text-slate-500">Kategori Layanan:</span>
                        <p className="font-semibold text-slate-800">{complaint.category}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Tingkat Urgensi:</span>
                        <p className="font-bold text-rose-700">{complaint.urgency} (Prioritas)</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Pelapor Warga:</span>
                        <p className="font-semibold text-slate-800">
                          {complaint.citizenName} ({complaint.citizenNikMasked})
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Kontak WhatsApp:</span>
                        <p className="font-mono text-slate-800">{complaint.whatsappNumber || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Lokasi Penanganan:</span>
                        <p className="font-semibold text-slate-800">{complaint.location}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">OPD Bertanggung Jawab:</span>
                        <p className="font-bold text-emerald-800">{complaint.assignedDepartment}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Image Box */}
                  <div className="flex flex-col items-center justify-center p-2 border border-slate-300 rounded-lg bg-slate-50 text-center">
                    {qrDataUrl && (
                      <img
                        src={qrDataUrl}
                        alt="QR Code Tiket"
                        className="w-28 h-28 object-contain"
                      />
                    )}
                    <span className="text-[9px] font-bold text-slate-700 mt-1 uppercase tracking-tighter">
                      Scan untuk Perbarui
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">
                      SLA Target: {complaint.slaTargetHours} Jam
                    </span>
                  </div>
                </div>

                {/* Blockchain Integrity Footnote */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>TX Hash: {complaint.txHash.slice(0, 24)}...</span>
                  <span>Blok #{complaint.blockHeight} • Bebas Pungli (Rp 0)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FIELD OFFICER SCANNER SIMULATOR */}
          {activeTab === 'scanner' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">
                      Simulasi Pemindaian Kamera Petugas Lapangan
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-semibold">
                    Kamera Aktif (Simulasi)
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Uji coba alur kerja petugas teknis saat memindai tiket ini menggunakan ponsel atau tablet di titik lokasi aduan warga.
                </p>

                {/* Scanner Viewport Visual */}
                <div className="relative h-60 w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Scanning Crosshair Box */}
                  <div className="relative w-44 h-44 border-2 border-emerald-500/80 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl shadow-emerald-500/10">
                    {qrDataUrl && (
                      <img
                        src={qrDataUrl}
                        alt="Target Scan"
                        className={`w-32 h-32 object-contain transition-opacity duration-300 ${
                          isSimulatingScan ? 'opacity-40' : 'opacity-90'
                        }`}
                      />
                    )}

                    {/* Animated Laser Line */}
                    {isSimulatingScan && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-lg shadow-emerald-400" />
                    )}

                    {/* Corner Reticles */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                  </div>

                  {/* Scan Status Feedback */}
                  <div className="mt-3 z-10">
                    {isSimulatingScan ? (
                      <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Membaca QR Code &amp; Memvalidasi Tanda Tangan Digital...</span>
                      </div>
                    ) : scanSuccess ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold bg-emerald-950/90 px-3.5 py-1.5 rounded-full border border-emerald-700 animate-in fade-in">
                        <FileCheck2 className="w-4 h-4 text-emerald-400" />
                        <span>Validasi Berhasil: Tiket #{complaint.id} Terotentikasi On-Chain!</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={handleRunScannerSimulation}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
                        >
                          <ScanLine className="w-4 h-4" />
                          <span>Mulai Pindai Tiket Ini</span>
                        </button>
                        {onOpenLiveCameraScanner && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenLiveCameraScanner();
                            }}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/40 font-bold text-xs shadow transition-all cursor-pointer"
                          >
                            <Camera className="w-4 h-4 text-emerald-400" />
                            <span>Buka Kamera Langsung</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Scan Result Actions */}
                {scanSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs">
                          Aksi Cepat Petugas Lapangan untuk #{complaint.id}
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          Data aduan telah diverifikasi identik dengan buku besar blockchain.
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        Sisa SLA: {remainingHours} Jam
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {onSimulateProgress && complaint.status !== 'Selesai_Teruji' && (
                        <button
                          onClick={() => {
                            onSimulateProgress(complaint.id);
                            handleRunScannerSimulation();
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Check-in Lapangan &amp; Perbarui Status</span>
                        </button>
                      )}

                      {onOpenWhatsApp && (
                        <button
                          onClick={() => onOpenWhatsApp(complaint.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Kirim Laporan Kedatangan via WA</span>
                        </button>
                      )}

                      <button
                        onClick={handleRunScannerSimulation}
                        className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Pindai Ulang
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Keamanan Kriptografi QR Code terproteksi SHA-256</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
