import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Award,
  Layers,
  Check,
  Copy,
  Printer,
  SlidersHorizontal,
  Clock,
  Filter,
} from 'lucide-react';
import { Complaint } from '../types';
import {
  generateAndDownloadComplaintsSummaryPdf,
  ComplaintsSummaryPdfOptions,
} from '../utils/complaintPdfGenerator';
import { playNotificationTone } from '../services/audioNotification';

interface ComplaintsExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredComplaints: Complaint[];
  allComplaints: Complaint[];
  filterCategory: string;
  filterStatus: string;
  filterUrgency: string;
  searchQuery: string;
}

export const ComplaintsExportPdfModal: React.FC<ComplaintsExportPdfModalProps> = ({
  isOpen,
  onClose,
  filteredComplaints,
  allComplaints,
  filterCategory,
  filterStatus,
  filterUrgency,
  searchQuery,
}) => {
  if (!isOpen) return null;

  const [exportScope, setExportScope] = useState<'filtered' | 'all'>(
    filteredComplaints.length !== allComplaints.length ? 'filtered' : 'all'
  );
  const [includeKpiSummary, setIncludeKpiSummary] = useState(true);
  const [includeDigitalSignature, setIncludeDigitalSignature] = useState(true);
  const [includeQrCode, setIncludeQrCode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const selectedComplaints = exportScope === 'filtered' ? filteredComplaints : allComplaints;

  // Build human-friendly filter description
  const filterParts: string[] = [];
  if (filterCategory !== 'SEMUA') filterParts.push(`Kategori: ${filterCategory}`);
  if (filterStatus !== 'SEMUA') filterParts.push(`Status: ${filterStatus.replace(/_/g, ' ')}`);
  if (filterUrgency !== 'SEMUA') filterParts.push(`Urgensi: ${filterUrgency}`);
  if (searchQuery.trim()) filterParts.push(`Pencarian: "${searchQuery}"`);
  const filterSummaryText = filterParts.length > 0 ? filterParts.join(' • ') : 'Semua Data Terpilih';

  const completedCount = selectedComplaints.filter((c) => c.status === 'Selesai_Teruji').length;
  const activeCount = selectedComplaints.length - completedCount;
  const onTimeCount = selectedComplaints.filter((c) => c.elapsedHours <= c.slaTargetHours).length;
  const onTimeRate =
    selectedComplaints.length > 0
      ? ((onTimeCount / selectedComplaints.length) * 100).toFixed(1)
      : '100.0';

  const handleExecuteExport = async () => {
    setIsGenerating(true);
    setDownloadSuccess(null);

    try {
      const options: ComplaintsSummaryPdfOptions = {
        title: 'LAPORAN REKAPITULASI STATUS PENANGANAN PENGADUAN WARGA',
        scopeLabel:
          exportScope === 'filtered'
            ? `Data Hasil Filter (${selectedComplaints.length} Aduan)`
            : `Seluruh Data Aduan (${allComplaints.length} Aduan)`,
        filterSummary: filterSummaryText,
        includeKpiSummary,
        includeDigitalSignature,
        includeQrCode,
        agencyName: 'Pemerintah Kota Amanah Sejahtera',
      };

      const result = await generateAndDownloadComplaintsSummaryPdf(selectedComplaints, options);

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
      console.error('Failed to export complaints PDF:', err);
      alert('Terjadi kendala saat menghasilkan dokumen PDF. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md">
              <FileDown className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Ekspor Laporan Rekapitulasi Data Aduan (PDF)
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Bukti Fisik Resmi
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Unduh rekap status penanganan aduan masyarakat dalam format PDF A4 Landscape bertanda tangan digital
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            id="btn-close-export-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl p-4 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Laporan PDF Berhasil Diunduh!</h4>
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

          {/* Scope Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white block">Pilih Cakupan Data yang Diekspor:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setExportScope('filtered')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  exportScope === 'filtered'
                    ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs">Data Terfilter Saat Ini</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {filteredComplaints.length} Aduan
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mencakup aduan sesuai filter kategori, status, urgensi, dan kata kunci yang sedang aktif.
                </p>
              </div>

              <div
                onClick={() => setExportScope('all')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  exportScope === 'all'
                    ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-xs">Seluruh Database Aduan</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    {allComplaints.length} Aduan
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mengekspor seluruh rekapitulasi aduan warga yang tersimpan dalam sistem tanpa batasan filter.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Preview */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Ringkasan Data yang Akan Dicetak:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Laporan:</span>
                <span className="font-bold text-white text-sm">{selectedComplaints.length} Aduan</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Tuntas Selesai:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {completedCount} ({selectedComplaints.length > 0 ? Math.round((completedCount / selectedComplaints.length) * 100) : 0}%)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Sedang Ditangani:</span>
                <span className="font-bold text-sky-400 text-sm">{activeCount} Kasus</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Tingkat SLA:</span>
                <span className="font-bold text-amber-400 text-sm">{onTimeRate}% Tepat</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-400 font-semibold">Filter: </span>
              <span>{filterSummaryText}</span>
            </div>
          </div>

          {/* Options */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-white block">
              Konfigurasi Dokumen Bukti Fisik:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeKpiSummary}
                  onChange={(e) => setIncludeKpiSummary(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px]">Kartu KPI Ringkasan Eksekutif</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDigitalSignature}
                  onChange={(e) => setIncludeDigitalSignature(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px]">Stempel Tanda Tangan BSrE</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQrCode}
                  onChange={(e) => setIncludeQrCode(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px]">Kode QR Verifikasi Pangkalan</span>
              </label>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">Legalitas &amp; Keabsahan Bukti Fisik:</p>
              <p>
                Laporan PDF yang diunduh mencantumkan stempel digital terenkripsi SHA-256 yang tersinkronisasi dengan buku besar on-chain. Dokumen ini sah sebagai arsip pembuktian administratif warga sesuai UU ITE No. 11/2008 &amp; PP No. 71/2019.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Format Standar LAKIP / A4 Landscape Resmi</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handleExecuteExport}
              disabled={isGenerating || selectedComplaints.length === 0}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="btn-confirm-export-complaints-pdf"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Menyiapkan Laporan PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Unduh Laporan Rekap PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsExportPdfModal;
