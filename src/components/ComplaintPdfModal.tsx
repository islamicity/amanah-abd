import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  ExternalLink,
  X,
  Lock,
  FileText,
  Check,
  Sparkles,
  Clock,
  Building,
  User,
  Copy,
  Download,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Complaint } from '../types';
import {
  generateAndDownloadComplaintPdf,
  generateComplaintSignatureHash,
  ComplaintPdfOptions,
} from '../utils/complaintPdfGenerator';
import { playNotificationTone } from '../services/audioNotification';

interface ComplaintPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
}

export const ComplaintPdfModal: React.FC<ComplaintPdfModalProps> = ({
  isOpen,
  onClose,
  complaint,
}) => {
  if (!isOpen || !complaint) return null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Export customization options
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeQrCode, setIncludeQrCode] = useState(true);
  const [includeDigitalSignature, setIncludeDigitalSignature] = useState(true);

  const signatureHash = generateComplaintSignatureHash(complaint);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setDownloadSuccess(null);

    try {
      const options: ComplaintPdfOptions = {
        includeTimeline,
        includeQrCode,
        includeDigitalSignature,
      };

      const result = await generateAndDownloadComplaintPdf(complaint, options);

      try {
        playNotificationTone('success');
      } catch {
        // audio fallback
      }

      setDownloadSuccess(result.filename);
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 7000);
    } catch (err) {
      console.error('Gagal mengunduh dokumen PDF:', err);
      alert('Terjadi kendala saat menghasilkan dokumen PDF. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyHash = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(signatureHash);
      }
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin hash:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md">
              <FileDown className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Ekspor Dokumen Bukti Fisik Aduan (PDF)
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tanda Tangan Digital BSrE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Surat bukti registrasi &amp; status penanganan aduan resmi berkekuatan hukum sah (UU ITE No. 11/2008)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            id="btn-close-pdf-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl p-4 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Dokumen PDF Berhasil Diunduh!</h4>
                  <p className="text-emerald-300 text-[11px] font-mono mt-0.5">
                    {downloadSuccess}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-900/60 px-2 py-1 rounded font-semibold">
                Tersimpan di Perangkat
              </span>
            </div>
          )}

          {/* Document Preview Card */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-inner">
            {/* Kop Preview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Pemerintah Kota Amanah Sejahtera
                </span>
                <h4 className="font-bold text-white text-sm">
                  Surat Bukti Registrasi Pengaduan Warga
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  No. Reg: REG-AG/2026/09/{complaint.id}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  #{complaint.id}
                </span>
                <span className="text-[11px] px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {complaint.category}
                </span>
              </div>
            </div>

            {/* Core Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 block">Pelapor Terlindungi (PDP):</span>
                <p className="font-semibold text-white">
                  {complaint.citizenName} ({complaint.citizenNikMasked})
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Kontak: {complaint.whatsappNumber || '+62 812-8821-0414'}
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 block">OPD Penanggung Jawab:</span>
                <p className="font-semibold text-white truncate">
                  {complaint.assignedDepartment}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  TRC: {complaint.officerName || 'Satgas Lapangan'}
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 block">Target Waktu SLA & Status:</span>
                <p className="font-semibold text-emerald-300">
                  {complaint.status.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-slate-400">
                  SLA: Maks. {complaint.slaTargetHours} Jam (Berjalan: {complaint.elapsedHours}j)
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-400 block">Lokasi Pelaporan:</span>
                <p className="font-semibold text-white truncate">{complaint.location}</p>
                <p className="text-[11px] text-emerald-400 font-bold">
                  Biaya: Rp 0 (Bebas Pungli)
                </p>
              </div>
            </div>

            {/* Complaint Title & Snippet */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Perihal Laporan:
              </span>
              <p className="font-bold text-white">{complaint.title}</p>
              <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Digital Signature & Cryptographic Seal Box */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-xs sm:text-sm">
                  Otentikasi Kriptografis & Sertifikat Digital (BSrE)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Resmi & Sah
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">Hash Integritas (SHA-256):</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-300 font-bold">
                    {signatureHash.slice(0, 18)}...{signatureHash.slice(-8)}
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Salin Hash Lengkap"
                  >
                    {copiedHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block">Buku Besar Blockchain:</span>
                  <span className="text-slate-200 font-semibold truncate block">
                    Blok #{complaint.blockHeight} (Konsensus 4 Node)
                  </span>
                </div>
                <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block">Sertifikasi Elektronik:</span>
                  <span className="text-emerald-300 font-semibold truncate block">
                    Balai Sertifikasi Elektronik (BSrE / BSSN)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Customization Options */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-white block">
              Pilihan Lampiran Dokumen:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimeline}
                  onChange={(e) => setIncludeTimeline(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px]">Riwayat Jejak Waktu</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQrCode}
                  onChange={(e) => setIncludeQrCode(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px]">Kode QR Verifikasi</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDigitalSignature}
                  onChange={(e) => setIncludeDigitalSignature(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px]">Klausul Tanda Tangan BSrE</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Format Standar LAKIP / Arsip Administrasi Pemerintahan</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="btn-confirm-download-pdf"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Menandatangani &amp; Mengunduh PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen PDF Resmi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintPdfModal;
