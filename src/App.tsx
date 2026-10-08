import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_COMPLAINTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BLOCKS,
  INITIAL_NOTIFICATIONS,
  DEPARTMENT_METRICS,
} from './data/initialData';
import {
  Complaint,
  BlockchainBlock,
  BlockchainTransaction,
  RealtimeNotification,
  ComplaintStatus,
} from './types';
import { Header } from './components/Header';
import { PillarsBanner } from './components/PillarsBanner';
import { CitizenComplaintView } from './components/CitizenComplaintView';
import { NewComplaintModal } from './components/NewComplaintModal';
import { PublicTransactionsLedger } from './components/PublicTransactionsLedger';
import { BlockchainAuditExplorer } from './components/BlockchainAuditExplorer';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { AiAmanahAssistantModal } from './components/AiAmanahAssistantModal';
import { TanyaAmanahGovView } from './components/TanyaAmanahGovView';
import { StandDigitalAntrean } from './components/StandDigitalAntrean';
import { WhatsAppSimulationModal } from './components/WhatsAppSimulationModal';
import { PlanetCrisisEducationView } from './components/PlanetCrisisEducationView';
import { CommunityDevelopmentExpertView } from './components/CommunityDevelopmentExpertView';
import { IslamicityGovernanceView } from './components/IslamicityGovernanceView';
import { CameraQrScannerModal } from './components/CameraQrScannerModal';
import { sendWhatsAppNotification } from './services/whatsappService';
import { playNotificationTone } from './services/audioNotification';
import {
  runAutomatedAudit,
  VerificationResult,
  sha256,
  calculateMerkleRoot,
  computeBlockHash,
} from './services/blockchain';
import {
  ShieldCheck,
  Radio,
  Building2,
  Cpu,
  BarChart3,
  Heart,
  Scale,
  Sparkles,
  CheckCircle2,
  Bot,
  Leaf,
  Recycle,
  Users,
  QrCode,
  ExternalLink,
  X,
} from 'lucide-react';

export default function App() {
  // Primary States
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(INITIAL_TRANSACTIONS);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(INITIAL_BLOCKS);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>(INITIAL_NOTIFICATIONS);

  // Navigation & UI Modals
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    INITIAL_COMPLAINTS[0]?.id || null
  );
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // WhatsApp Gateway Simulation States
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppTargetComplaintId, setWhatsAppTargetComplaintId] = useState<string | undefined>(undefined);

  // High Contrast Accessibility Theme State (Persisted in localStorage)
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('amanahgov_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('amanahgov_high_contrast', String(next));
      } catch {
        // storage fallback
      }
      return next;
    });
  };

  // Manual WhatsApp Notification Sender
  const handleSendManualWhatsApp = (complaintId: string) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;
    const lastStep = target.timeline[target.timeline.length - 1];
    sendWhatsAppNotification(target, target.status, lastStep?.note || 'Pembaruan resmi instansi');
    setWhatsAppTargetComplaintId(complaintId);
    setIsWhatsAppModalOpen(true);

    const notif: RealtimeNotification = {
      id: `notif-wa-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'Notifikasi WhatsApp Warga Diteruskan',
      message: `Pembaruan aduan #${target.id} berhasil disimulasikan ke WhatsApp ${target.whatsappNumber || '+62 812-8821-0414'}.`,
      type: 'COMPLAINT_UPDATE',
      complaintId: target.id,
      read: false,
      severity: 'success',
    };
    setNotifications((n) => [notif, ...n]);

    if (isAudioEnabled) {
      playNotificationTone('success');
    }
  };

  // Blockchain Audit & Tamper Simulation States
  const [isAuditing, setIsAuditing] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [lastAuditResult, setLastAuditResult] = useState<VerificationResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Deep-Link & QR Code Scan Direct Navigation State
  const [deepLinkBanner, setDeepLinkBanner] = useState<{
    ticketId: string;
    title: string;
  } | null>(null);

  // Synchronized Complaint Selection (updates URL for effortless sharing & QR generation)
  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('ticket', id);
        window.history.replaceState(null, '', url.toString());
      } catch (e) {
        // ignore
      }
    }
  };

  // Check URL parameters on mount and on popstate/hashchange for direct ticket deep links
  useEffect(() => {
    const handleCheckUrlParam = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const ticketParam = params.get('ticket') || params.get('id') || params.get('complaint');
      const hashParam = window.location.hash.startsWith('#ticket-')
        ? window.location.hash.replace('#ticket-', '')
        : null;

      const targetId = ticketParam || hashParam;
      if (targetId) {
        const found = complaints.find(
          (c) => c.id.toLowerCase() === targetId.toLowerCase()
        );
        if (found) {
          setSelectedComplaintId(found.id);
          setActiveTab('pengaduan');
          setDeepLinkBanner({
            ticketId: found.id,
            title: found.title,
          });
        }
      }
    };

    handleCheckUrlParam();
    window.addEventListener('popstate', handleCheckUrlParam);
    window.addEventListener('hashchange', handleCheckUrlParam);
    return () => {
      window.removeEventListener('popstate', handleCheckUrlParam);
      window.removeEventListener('hashchange', handleCheckUrlParam);
    };
  }, [complaints]);

  // Auto-run initial verification on mount
  useEffect(() => {
    runAutomatedAudit(blocks).then((res) => {
      setLastAuditResult(res);
    });
  }, []);

  // Global search handler
  const handleSearchGlobal = (query: string) => {
    setSearchQuery(query);
    setActiveTab('pengaduan');
  };

  // Add new complaint handler
  const handleAddNewComplaint = async (newComplaint: Complaint) => {
    // 1. Add to complaints
    setComplaints((prev) => [newComplaint, ...prev]);
    setSelectedComplaintId(newComplaint.id);

    // 2. Create blockchain transaction
    const newTx: BlockchainTransaction = {
      txId: `TX-${newComplaint.id}`,
      timestamp: newComplaint.createdAt,
      type: 'PENGADUAN_WARGA',
      title: newComplaint.title,
      amount: 0,
      recipient: newComplaint.citizenName,
      officer: newComplaint.officerName,
      agency: newComplaint.assignedDepartment,
      pilar: 'Shiddiq',
      dataPayload: {
        complaintId: newComplaint.id,
        category: newComplaint.category,
        urgency: newComplaint.urgency,
        location: newComplaint.location,
      },
      txHash: newComplaint.txHash,
      blockHeight: 4,
      status: 'TERVERIFIKASI',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // 3. Add to notifications
    const newNotif: RealtimeNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      title: `Pengaduan #${newComplaint.id} Terdaftar`,
      message: `Aduan "${newComplaint.title.slice(0, 45)}..." telah diverifikasi dan masuk buku besar blockchain.`,
      type: 'COMPLAINT_UPDATE',
      complaintId: newComplaint.id,
      txHash: newComplaint.txHash,
      read: false,
      severity: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (isAudioEnabled) {
      playNotificationTone('success');
    }
  };

  // Real-time progress simulator for complaints
  const handleSimulateProgress = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        let nextStatus: ComplaintStatus = c.status;
        let note = '';
        let officer = c.officerName;

        const now = new Date();
        const dateFormatted = `${now.getDate().toString().padStart(2, '0')} Sep 2026, ${now
          .getHours()
          .toString()
          .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        if (c.status === 'Diajukan') {
          nextStatus = 'Diverifikasi_Shiddiq';
          note = 'Data lapangan dan bukti digital tervalidasi jujur sesuai prinsip Shiddiq.';
          officer = 'Satgas Verifikasi Shiddiq Wilayah';
        } else if (c.status === 'Diverifikasi_Shiddiq') {
          nextStatus = 'Disposisi_Amanah';
          note = 'Surat tugas diterbitkan, petugas lapangan ditugaskan dengan integritas amanah.';
          officer = 'Kepala Seksi Pelayanan Publik';
        } else if (c.status === 'Disposisi_Amanah') {
          nextStatus = 'Pengerjaan_Khidmat';
          note = 'Tim lapangan sedang mengeksekusi penanganan teknis di lokasi warga.';
          officer = c.officerName || 'Tim Reaksi Cepat';
        } else if (c.status === 'Pengerjaan_Khidmat') {
          nextStatus = 'Audit_Validasi';
          note = 'Pekerjaan selesai, inspektorat menjalankan verifikasi kualitas dan kepatuhan anggaran.';
          officer = 'Inspektorat Audit Mutu';
        } else if (c.status === 'Audit_Validasi') {
          nextStatus = 'Selesai_Teruji';
          note = 'Aduan tuntas 100%! Bukti penanganan ditutup dan dimint permanen ke rantai blok.';
          officer = 'Pimpinan Instansi (Khadimul Ummah)';
        }

        const newTimelineStep = {
          id: `tl-${Date.now()}`,
          status: nextStatus,
          title: `Status Diperbarui: ${nextStatus.replace('_', ' ')}`,
          timestamp: dateFormatted,
          note,
          officer,
          blockHeight: c.blockHeight,
        };

        const updated = {
          ...c,
          status: nextStatus,
          elapsedHours: c.elapsedHours + 2,
          timeline: [...c.timeline, newTimelineStep],
        };

        // Send real-time WhatsApp update to citizen
        sendWhatsAppNotification(updated, nextStatus, note);

        // Dispatch notification
        const notif: RealtimeNotification = {
          id: `notif-${Date.now()}`,
          timestamp: 'Baru saja',
          title: `Update Progres #${c.id}`,
          message: `${c.title.slice(0, 40)}... beralih status ke: ${nextStatus.replace('_', ' ')}.`,
          type: 'COMPLAINT_UPDATE',
          complaintId: c.id,
          read: false,
          severity: nextStatus === 'Selesai_Teruji' ? 'success' : 'info',
        };
        setNotifications((n) => [notif, ...n]);

        if (isAudioEnabled) {
          playNotificationTone(nextStatus === 'Selesai_Teruji' ? 'audit' : 'success');
        }

        if (nextStatus === 'Selesai_Teruji') {
          try {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // Ignore if confetti not ready
          }
        }

        return updated;
      })
    );
  };

  // Rating complaint handler
  const handleRateComplaint = (complaintId: string, rating: number, feedback: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          rating,
          feedback,
        };
      })
    );

    const notif: RealtimeNotification = {
      id: `notif-rate-${Date.now()}`,
      timestamp: 'Baru saja',
      title: `Evaluasi Warga Diterima (${rating} Bintang)`,
      message: `Terima kasih atas ulasan amanah Anda untuk aduan #${complaintId}.`,
      type: 'SYSTEM',
      complaintId,
      read: false,
      severity: 'success',
    };
    setNotifications((n) => [notif, ...n]);

    if (isAudioEnabled) {
      playNotificationTone('success');
    }
  };

  // Run automated audit on the blockchain
  const handleRunAudit = async (): Promise<VerificationResult> => {
    setIsAuditing(true);
    const result = await runAutomatedAudit(blocks);
    setLastAuditResult(result);
    setIsAuditing(false);

    const notif: RealtimeNotification = {
      id: `notif-audit-${Date.now()}`,
      timestamp: 'Baru saja',
      title: result.isValid ? 'Audit Otomatis Berhasil' : 'Audit Gagal: Manipulasi Ditemukan!',
      message: result.message,
      type: 'BLOCKCHAIN_AUDIT',
      read: false,
      severity: result.isValid ? 'success' : 'error',
    };
    setNotifications((n) => [notif, ...n]);

    if (isAudioEnabled) {
      playNotificationTone(result.isValid ? 'audit' : 'alert');
    }

    return result;
  };

  // Simulate data tampering (Anti-fraud demonstration)
  const handleSimulateTamper = async () => {
    setIsTampered(true);

    // Modify a transaction in block #2 maliciously to test the audit engine
    const tamperedBlocks = blocks.map((b) => {
      if (b.blockHeight === 2) {
        return {
          ...b,
          integrityStatus: 'COMPROMISED' as const,
          merkleRoot: '0xTAMPERED_FRAUD_MERKLE_ROOT_UNAUTHORIZED_MUTATION',
          transactions: b.transactions.map((tx, idx) => {
            if (idx === 0) {
              return {
                ...tx,
                title: 'PERCOBAAN ILEGAL: Pengurangan Jatah Bantuan & Pungutan Liar Gelap',
                amount: 999999999,
                isTampered: true,
              };
            }
            return tx;
          }),
        };
      }
      return b;
    });

    setBlocks(tamperedBlocks);

    // Re-run audit to trigger automated alarms
    const auditRes = await runAutomatedAudit(tamperedBlocks);
    setLastAuditResult(auditRes);

    const alertNotif: RealtimeNotification = {
      id: `notif-tamper-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'BAHAYA: Integritas Blok #2 Dirusak!',
      message: 'Sistem audit otomatis mendeteksi percobaan pemalsuan data transaksi bansos!',
      type: 'BLOCKCHAIN_AUDIT',
      read: false,
      severity: 'error',
    };
    setNotifications((n) => [alertNotif, ...n]);

    if (isAudioEnabled) {
      playNotificationTone('alert');
    }
  };

  // Restore chain to canonical state
  const handleRestoreChain = async () => {
    setIsTampered(false);
    setBlocks(INITIAL_BLOCKS);
    const auditRes = await runAutomatedAudit(INITIAL_BLOCKS);
    setLastAuditResult(auditRes);

    const restoredNotif: RealtimeNotification = {
      id: `notif-restore-${Date.now()}`,
      timestamp: 'Baru saja',
      title: 'Konsensus Kriptografis Dipulihkan',
      message: 'Manipulasi data ditolak. Buku besar blockchain kembali utuh 100%.',
      type: 'BLOCKCHAIN_AUDIT',
      read: false,
      severity: 'success',
    };
    setNotifications((n) => [restoredNotif, ...n]);

    if (isAudioEnabled) {
      playNotificationTone('audit');
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors ${
        isHighContrast ? 'high-contrast' : ''
      }`}
    >
      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isAudioEnabled={isAudioEnabled}
        setIsAudioEnabled={setIsAudioEnabled}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenWhatsAppSimulator={() => setIsWhatsAppModalOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        isHighContrast={isHighContrast}
        onToggleHighContrast={toggleHighContrast}
        onSearchGlobal={handleSearchGlobal}
        isAuditing={isAuditing}
      />

      {/* Deep Link & QR Code Notification Banner */}
      {deepLinkBanner && (
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border-b border-teal-500/40 px-4 py-2.5 text-xs text-teal-200 flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">
                Memuat Rincian Tiket #{deepLinkBanner.ticketId}
              </span>
              <span className="hidden sm:inline text-slate-300 ml-1.5 font-normal">
                via Pindai Kode QR / Tautan Langsung: {deepLinkBanner.title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('pengaduan');
                handleSelectComplaint(deepLinkBanner.ticketId);
              }}
              className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Buka Pengaduan
            </button>
            <button
              onClick={() => setDeepLinkBanner(null)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup Pemberitahuan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Tab 1: Beranda & Visi Kepemimpinan Kenabian */}
        {activeTab === 'beranda' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Pillars Banner */}
            <PillarsBanner
              onSelectPillarFilter={(pillar) => {
                setActiveTab('transparansi');
              }}
              onExploreFeature={(tab) => setActiveTab(tab)}
            />

            {/* Callout: Tanya AmanahGov AI */}
            <div
              onClick={() => setActiveTab('tanya')}
              className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 rounded-2xl p-5 hover:border-emerald-400/80 transition-all cursor-pointer group shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              id="banner-tanya-amanahgov"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
                  <Bot className="w-6 h-6 animate-pulse text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Fitur Baru AI Warga
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Gemini 3.8 Flash</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Tanya AmanahGov AI — Jawaban Otomatis Prosedur &amp; Regulasi Publik
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                    Bingung mengenai alur NIB UMKM Rp 0, standar waktu (SLA) jalan rusak, bansos bebas potongan, atau ingin mengecek status tiket aduan Anda? Tanyakan langsung ke AI.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800/60 transition-colors">
                <span>Mulai Konsultasi</span>
                <span>→</span>
              </div>
            </div>

            {/* Featured Banner: Cara Islamicity Menciptakan Pemerintahan Amanah & Profesional */}
            <div
              onClick={() => setActiveTab('islamicity')}
              className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/50 rounded-2xl p-5 sm:p-6 hover:border-emerald-400 transition-all cursor-pointer group shadow-xl shadow-emerald-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              id="banner-islamicity-governance"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  <Scale className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                      ISLAMICITY GOVERNANCE
                    </span>
                    <span className="text-xs text-teal-300 font-semibold">
                      QS 4:58 • HR Bukhari-Muslim • QS 28:26 • QS 7:96
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    Falsafah Islamicity: Menciptakan Pemerintahan yang Amanah dan Profesional
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Pemimpin kepala negeri adalah pengurus dan pelayan rakyat yang bertanggung jawab penuh (HR Bukhari &amp; Muslim), rekrutmen Al-Qawiyyu &amp; Al-Amin (QS 28:26), larangan meminta jabatan agar meraih pertolongan Allah (HR Bukhari &amp; Muslim), dan muara berkah langit bumi (QS 7:96).
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-500 group-hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md self-start md:self-auto cursor-pointer">
                <span>Pelajari Doktrin &amp; Simulator</span>
                <span>→</span>
              </div>
            </div>

            {/* Stand Digital: Simulasi Jadwal Giliran Antrean Layanan Publik Terintegrasi */}
            <StandDigitalAntrean
              isAudioEnabled={isAudioEnabled}
              onNavigateToServices={() => setActiveTab('pengaduan')}
            />

            {/* Quick Overview Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Transparansi Transaksi */}
              <div
                onClick={() => setActiveTab('transparansi')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Transparansi Publik
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Buku Besar Transparansi
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Menjamin seluruh penyaluran bansos, pengadaan alat kesehatan, dan alokasi anggaran tidak ada yang disembunyikan dari rakyat.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Lihat {transactions.length} Transaksi Terbuka</span>
                  <span>→</span>
                </div>
              </div>

              {/* Box 2: Audit Otomatis Blockchain */}
              <div
                onClick={() => setActiveTab('blockchain')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/50 hover:bg-slate-850 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Akuntabilitas Mutlak
                  </span>
                  <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 group-hover:scale-105 transition-transform">
                    <Cpu className="w-5 h-5 text-sky-400" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  Sistem Audit Otomatis
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Verifikasi SHA-256 otomatis dan penolakan manipulasi seketika tanpa kompromi, meneladani ketegasan Rasulullah SAW terhadap korupsi.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                  <span>Audit Kriptografi {blocks.length} Blok</span>
                  <span>→</span>
                </div>
              </div>

              {/* Box 3: Efisiensi Birokrasi Fathanah */}
              <div
                onClick={() => setActiveTab('kinerja')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:bg-slate-850 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Efisiensi Pelayanan
                  </span>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Dasbor Kinerja &amp; SLA
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Memangkas rantai birokrasi yang lambat dan memantau kepuasan masyarakat hingga 98.2% tepat waktu dengan eliminasi birokrasi berbelit.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>Rata-rata Respon: 6.8 Jam</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Inisiatif Lingkungan Unggulan: Pencegah Krisis Planet (Dari Gang Kecil untuk Indonesia) */}
            <div
              onClick={() => setActiveTab('edukasi-iklim')}
              className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 hover:border-emerald-400 transition-all cursor-pointer group shadow-lg shadow-emerald-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Leaf className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      FITUR EDUKASI WARGA
                    </span>
                    <span className="text-xs text-teal-300 font-semibold">
                      Pencegah Krisis Planet
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    Dari Gang Kecil untuk Indonesia: Survival Architecture, RT Zero Waste &amp; Eco EduFarm
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Solusi krisis iklim dari pekarangan mikro: Ventilasi silang alami bambu, ember tumpuk POC dapur, budikdamber lele, dan biopori gang mandiri tanpa biaya mahal.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 bg-emerald-600 group-hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md self-start md:self-auto">
                <span>Buka Modul Edukasi</span>
                <span>→</span>
              </div>
            </div>

            {/* Inisiatif Penggerak Komunal: RT RW Inovatif • Sampah Selesai di RT */}
            <div
              onClick={() => setActiveTab('community-dev')}
              className="bg-gradient-to-r from-teal-950/90 via-slate-900 to-emerald-950/90 border border-teal-500/40 rounded-2xl p-5 sm:p-6 hover:border-teal-400 transition-all cursor-pointer group shadow-lg shadow-teal-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      COMMUNITY DEVELOPMENT EXPERT
                    </span>
                    <span className="text-xs text-emerald-300 font-semibold">
                      🌿 RT/RW Inovatif • ♻️ Sampah Selesai di RT
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-teal-300 transition-colors">
                    Gerakan Swadaya Menuntaskan 100% Sampah dari Sumber di Level RT Tanpa Beban TPA
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Toolkit fasilitator &amp; Ketua RT: Rekayasa sosial rembug warga, sedekah sampah jadi beasiswa, konversi jelantah jadi emas, simulator neraca kas RT, dan draf SK siap pakai.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 bg-teal-600 group-hover:bg-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md self-start md:self-auto">
                <span>Buka Toolkit RT/RW</span>
                <span>→</span>
              </div>
            </div>

            {/* Quick Live Preview of Active Complaints */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Layanan &amp; Aduan Warga Aktif Saat Ini
                  </h3>
                  <p className="text-xs text-slate-400">
                    Memantau responsivitas tindak lanjut secara langsung
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('peta')}
                    className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 transition-colors"
                    id="btn-beranda-open-map"
                  >
                    <span>Peta Lapangan 📍</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pengaduan')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Buka Semua Layanan →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedComplaintId(item.id);
                      setActiveTab('pengaduan');
                    }}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-400">{item.id}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                      <span>{item.assignedDepartment}</span>
                      <span className="text-emerald-400 font-mono">{item.elapsedHours}j / {item.slaTargetHours}j</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tanya AmanahGov (AI Layanan Publik) */}
        {activeTab === 'tanya' && (
          <div className="animate-in fade-in duration-150">
            <TanyaAmanahGovView
              complaints={complaints}
              onSelectComplaint={(id) => {
                setSelectedComplaintId(id);
                setActiveTab('pengaduan');
              }}
              onOpenNewComplaintModal={() => setIsNewComplaintOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Layanan & Pengaduan Warga */}
        {activeTab === 'pengaduan' && (
          <div className="animate-in fade-in duration-150">
            <CitizenComplaintView
              complaints={complaints}
              selectedComplaintId={selectedComplaintId}
              onSelectComplaint={handleSelectComplaint}
              onOpenNewComplaintModal={() => setIsNewComplaintOpen(true)}
              onSimulateProgress={handleSimulateProgress}
              onRateComplaint={handleRateComplaint}
              onConsultAi={(c) => {
                handleSelectComplaint(c.id);
                setActiveTab('tanya');
              }}
              onOpenWhatsAppModal={(complaintId) => {
                setWhatsAppTargetComplaintId(complaintId || selectedComplaintId || complaints[0]?.id);
                setIsWhatsAppModalOpen(true);
              }}
              onSendManualWhatsApp={handleSendManualWhatsApp}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              initialViewMode="daftar"
            />
          </div>
        )}

        {/* Tab: Peta Sebaran Lapangan */}
        {activeTab === 'peta' && (
          <div className="animate-in fade-in duration-150">
            <CitizenComplaintView
              key="peta-view"
              complaints={complaints}
              selectedComplaintId={selectedComplaintId}
              onSelectComplaint={handleSelectComplaint}
              onOpenNewComplaintModal={() => setIsNewComplaintOpen(true)}
              onSimulateProgress={handleSimulateProgress}
              onRateComplaint={handleRateComplaint}
              onConsultAi={(c) => {
                setSelectedComplaintId(c.id);
                setActiveTab('tanya');
              }}
              onOpenWhatsAppModal={(complaintId) => {
                setWhatsAppTargetComplaintId(complaintId || selectedComplaintId || complaints[0]?.id);
                setIsWhatsAppModalOpen(true);
              }}
              onSendManualWhatsApp={handleSendManualWhatsApp}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              initialViewMode="peta"
            />
          </div>
        )}

        {/* Tab 3: Buku Besar Transparansi Transaksi Publik */}
        {activeTab === 'transparansi' && (
          <div className="animate-in fade-in duration-150">
            <PublicTransactionsLedger
              transactions={transactions}
              onViewBlockExplorer={(blockHeight) => {
                setActiveTab('blockchain');
              }}
            />
          </div>
        )}

        {/* Tab 4: Sistem Audit Otomatis Blockchain */}
        {activeTab === 'blockchain' && (
          <div className="animate-in fade-in duration-150">
            <BlockchainAuditExplorer
              blocks={blocks}
              onRunAudit={handleRunAudit}
              onSimulateTamper={handleSimulateTamper}
              onRestoreChain={handleRestoreChain}
              isTampered={isTampered}
              isAuditing={isAuditing}
              lastAuditResult={lastAuditResult}
            />
          </div>
        )}

        {/* Tab 5: Dasbor Statistik Kinerja Layanan & Efisiensi Birokrasi */}
        {activeTab === 'kinerja' && (
          <div className="animate-in fade-in duration-150">
            <PerformanceDashboard
              metrics={DEPARTMENT_METRICS}
              complaints={complaints}
              onSelectComplaint={(id) => {
                setSelectedComplaintId(id);
                setActiveTab('pengaduan');
              }}
            />
          </div>
        )}

        {/* Tab 6: Fitur Education Pencegah Krisis Planet (Dari Gang Kecil untuk Indonesia) */}
        {activeTab === 'edukasi-iklim' && (
          <div className="animate-in fade-in duration-150">
            <PlanetCrisisEducationView
              onNavigateToCommunityDev={() => setActiveTab('community-dev')}
            />
          </div>
        )}

        {/* Tab 7: Community Development Expert (RT/RW Inovatif • Sampah Selesai di RT) */}
        {activeTab === 'community-dev' && (
          <div className="animate-in fade-in duration-150">
            <CommunityDevelopmentExpertView />
          </div>
        )}

        {/* Tab 8: Tata Kelola Islamicity (Pemerintahan Amanah & Profesional) */}
        {activeTab === 'islamicity' && (
          <div className="animate-in fade-in duration-150">
            <IslamicityGovernanceView
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/80 text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200 font-semibold">AmanahGov</span>
            <span>— Pelayanan Publik Berintegritas Kenabian &amp; Kriptografi Mandiri</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Shiddiq • Amanah • Tabligh • Fathanah</span>
            <span>|</span>
            <span className="font-mono text-emerald-400">Node Konsensus: Madinah-01 (Active)</span>
          </div>
        </div>
      </footer>

      {/* Modals and Popovers */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSubmitComplaint={handleAddNewComplaint}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSelectComplaint={(complaintId) => {
          setSelectedComplaintId(complaintId);
          setActiveTab('pengaduan');
        }}
      />

      <AiAmanahAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onNavigateToFullChat={() => setActiveTab('tanya')}
      />

      {/* WhatsApp Citizen Notification Gateway Simulator Modal */}
      <WhatsAppSimulationModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        complaint={
          complaints.find((c) => c.id === whatsAppTargetComplaintId) ||
          complaints.find((c) => c.id === selectedComplaintId) ||
          complaints[0]
        }
      />

      {/* Universal Camera & Image File QR Scanner Modal */}
      <CameraQrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        complaints={complaints}
        onSelectComplaint={(id) => {
          handleSelectComplaint(id);
          setActiveTab('pengaduan');
          const found = complaints.find(
            (c) => c.id.toLowerCase() === id.toLowerCase()
          );
          if (found) {
            setDeepLinkBanner({
              ticketId: found.id,
              title: found.title,
            });
          }
        }}
        onNavigateToComplaintView={() => {
          setActiveTab('pengaduan');
        }}
        initialSelectedId={selectedComplaintId}
      />
    </div>
  );
}
