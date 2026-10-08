import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  FileDown,
  Sparkles,
  Users,
  AlertTriangle,
  Sliders,
  Copy,
  Check,
  HeartHandshake,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
  Building2,
  Lock,
  Printer,
  ChevronRight,
  Flame,
  Info,
} from 'lucide-react';
import { generateAndDownloadIslamicityCharterPdf } from '../utils/islamicityCharterPdfGenerator';
import { playNotificationTone } from '../services/audioNotification';

interface IslamicityGovernanceViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const IslamicityGovernanceView: React.FC<IslamicityGovernanceViewProps> = ({
  onNavigateToTab,
}) => {
  // Navigation inside the view
  const [activeSection, setActiveSection] = useState<
    'fondasi-dalil' | 'simulator-meritokrasi' | 'komparasi-paradigma' | 'pakta-integritas'
  >('fondasi-dalil');

  // Selected Pillar for deeper highlight
  const [selectedPillarId, setSelectedPillarId] = useState<number>(1);

  // Copied state
  const [copiedDalilId, setCopiedDalilId] = useState<number | null>(null);

  // PDF Export States
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  // Oath / Pledge Form States
  const [pledgeName, setPledgeName] = useState('Hamba Allah / Aparatur Sipil Negara');
  const [pledgeAgency, setPledgeAgency] = useState('Pemerintah Kota Amanah Sejahtera');
  const [hasSignedPledge, setHasSignedPledge] = useState(false);
  const [pledgeSignatureHash, setPledgeSignatureHash] = useState<string | null>(null);

  // Interactive Simulator States (Al-Qawiyyu Al-Amin Index)
  const [technicalSkill, setTechnicalSkill] = useState<number>(85);
  const [executionSpeed, setExecutionSpeed] = useState<number>(80);
  const [innovationAdoption, setInnovationAdoption] = useState<number>(90);

  const [wealthTransparency, setWealthTransparency] = useState<number>(95);
  const [gratificationResistance, setGratificationResistance] = useState<number>(100);
  const [godConsciousness, setGodConsciousness] = useState<number>(95);

  const [demandedOffice, setDemandedOffice] = useState<boolean>(false);

  // Calculations for Simulator
  const qawiyyuScore = Math.round((technicalSkill + executionSpeed + innovationAdoption) / 3);
  const aminScore = Math.round((wealthTransparency + gratificationResistance + godConsciousness) / 3);
  const compositeScore = Math.round((qawiyyuScore + aminScore) / 2);

  const getMaunahStatus = () => {
    if (demandedOffice) {
      return {
        status: 'TERANCAM: DIBIARKAN SENDIRI TANPA PERTOLONGAN ALLAH',
        arabicKey: 'وُكِلْتَ إِلَيْهَا (Wukila Ilaiha)',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        textColor: 'text-rose-400',
        advice:
          'Peringatan Keras Rasulullah SAW (HR. Bukhari & Muslim): Orang yang meminta atau mengejar jabatan demi kepentingan ambisi pribadi tidak akan ditolong Allah SWT. Jabatan ini berisiko menjadi kehinaan dan beban laknat di akhirat.',
        recommended: false,
      };
    }

    if (compositeScore >= 80 && aminScore >= 80) {
      return {
        status: 'TERBEKALI MA\'UNAH & PERTOLONGAN ILAHI',
        arabicKey: 'أُعِنْتَ عَلَيْهَا (U\'ina \'Alaiha)',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        textColor: 'text-emerald-400',
        advice:
          'Sesuai sabda Rasulullah SAW: Diberi jabatan tanpa memintanya (ditugaskan atas amanah umat dan kompetensi) akan ditolong oleh Allah SWT dalam menjalankannya. Sosok Al-Qawiyyu Al-Amin ideal.',
        recommended: true,
      };
    }

    if (aminScore < 70) {
      return {
        status: 'DEFISIT INTEGRITAS: BAHAYA KHIANAT & KORUPSI',
        arabicKey: 'غَيْرُ أَمِينٍ (Ghairu Amin)',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        textColor: 'text-amber-400',
        advice:
          'Kecerdasan tanpa integritas akan melahirkan manipulasi anggaran canggih. Tidak layak diangkat sesuai QS 28:26 sampai amanah dan ketakutannya kepada hisab Allah terbukti kokoh.',
        recommended: false,
      };
    }

    return {
      status: 'DEFISIT KOMPETENSI TEKNIS: RISIKO KELUMPUHAN BIROKRASI',
      arabicKey: 'ضَعْفٌ فِي الْقُوَّةِ (Dha\'fun fil-Quwwah)',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      textColor: 'text-sky-400',
      advice:
        'Niat baik dan kejujuran saja tidak cukup memimpin institusi publik yang kompleks. Perlu pembekalan kapasitas teknis (Al-Qawiyyu) agar tidak menelantarkan hak warga.',
      recommended: false,
    };
  };

  const maunahStatus = getMaunahStatus();

  // 5 Foundation Pillars data with full Arabic, translation, and system application
  const foundationalPillars = [
    {
      id: 1,
      title: 'Amanah Kepada Ahlinya & Keadilan Mutlak',
      surah: 'QS An-Nisa (4) : 58',
      arabic:
        'إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُمْ بَيْنَ النَّاسِ أَنْ تَحْكُمُوا بِالْعَدْلِ ۚ إِنَّ اللَّهَ نِعِمَّا يَعِظُكُمْ بِهِ ۗ إِنَّ اللَّهَ كَانَ سَمِيعًا بَصِيرًا',
      transliteration:
        'Innallāha ya\'murukum an tu\'addul-amānāti ilā ahlihā wa iżā ḥakamtum bainan-nāsi an taḥkumū bil-\'adl, innallāha ni\'immā ya\'iẓukum bih, innallāha kāna samī\'am baṣīrā.',
      translation:
        '“Sesungguhnya Allah menyuruh kamu menyampaikan amanat kepada yang berhak menerimanya, dan (menyuruh kamu) apabila menetapkan hukum di antara manusia supaya kamu menetapkan dengan adil. Sesungguhnya Allah memberi pengajaran yang sebaik-baiknya kepadamu. Sesungguhnya Allah adalah Maha Mendengar lagi Maha Melihat.”',
      fiqhMeaning:
        'Kewajiban konstitusional memilih pejabat berdasarkan kompetensi hakiki (meritokrasi murni tanpa nepotisme atau mahar politik) dan menegakkan hukum yang setara bagi seluruh lapisan warga.',
      systemFeature:
        'Sistem Seleksi ASN Transparan & Audit Algoritma Putusan Aduan: Setiap laporan dinilai setara berdasarkan bukti on-chain, tanpa diskriminasi status sosial pelapor.',
      tag: 'Meritokrasi Murni & Keadilan Hukum',
      color: 'emerald',
    },
    {
      id: 2,
      title: 'Pemimpin adalah Pengurus & Pelayan Rakyat',
      surah: 'HR. Al-Bukhari & Muslim (Kullukum Ra\'in)',
      arabic:
        'كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ، فَالإِمَامُ رَاعٍ وَهُوَ مَسْئُولٌ عَنْ رَعِيَّتِهِ...',
      transliteration:
        'Kullukum rā\'in wa kullukum mas\'ūlun \'an ra\'iyyatihi, fal-imāmu rā\'in wa huwa mas\'ūlun \'an ra\'iyyatihi...',
      translation:
        '“Setiap kalian adalah pemimpin (pengurus/penggembala) dan setiap kalian akan dimintai pertanggungjawaban atas apa yang dipimpinnya. Seorang kepala negeri (imam) adalah pengurus rakyat dan ia bertanggung jawab penuh atas rakyat yang dia urus...” (HR. Al-Bukhari no. 893 & Muslim no. 1829)',
      fiqhMeaning:
        'Doktrin Nabawiyah Sayyidul qaumi khadimuhum (Pemimpin suatu kaum adalah pelayan bagi kaumnya). Kepemimpinan bukan takhta kehormatan atau fasilitas kemewahan, melainkan beban tanggung jawab (mas\'uliyyah) hisab berat di hadapan Allah SWT.',
      systemFeature:
        'Layanan Tanggap Darurat Lapangan & SLA Ketat: Pejabat dinas dan Tim Reaksi Cepat (TRC) wajib menyelesaikan keluhan warga dalam hitungan jam dan dicatat publik.',
      tag: 'Sayyidul Qaumi Khadimuhum',
      color: 'sky',
    },
    {
      id: 3,
      title: 'Standar Rekrutmen Profesional: Al-Qawiyyu & Al-Amin',
      surah: 'QS Al-Qashas (28) : 26',
      arabic:
        'قَالَتْ إِحْدَاهُمَا يَا أَبَتِ اسْتَأْجِرْهُ ۖ إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ الْقَوِيُّ الْأَمِينُ',
      transliteration:
        'Qālat iḥdāhumā yā abatista\'jirhu, inna khaira manista\'jartal-qawiyyul-amīn.',
      translation:
        '“Salah seorang dari kedua perempuan itu berkata: \'Wahai ayahku! Ambillah ia sebagai orang yang bekerja (pada kita), sesungguhnya orang yang paling baik yang engkau ambil untuk bekerja ialah yang kuat (kompeten/profesional/Al-Qawiyyu) lagi dapat dipercaya (berintegritas/amanah/Al-Amin)\'.”',
      fiqhMeaning:
        'Dua kualifikasi mutlak aparatur publik: 1. Al-Qawiyyu (kapabilitas teknis, kecerdasan strategis, ketahanan kerja, kecakapan digital); 2. Al-Amin (kejujuran moral, takut kepada hisab Allah, bersih dari suap, tidak tamak). Keduanya tidak boleh dipisahkan.',
      systemFeature:
        'Matriks Evaluasi Kinerja Pegawai Dua Dimensi: Mengukur indikator ketangkasan teknis (SLA & akurasi) sekaligus indeks integritas (LHKPN & audit bebas korupsi).',
      tag: 'Kapasitas Teknis & Integritas Moral',
      color: 'amber',
    },
    {
      id: 4,
      title: 'Larangan Meminta Jabatan & Rahasia Pertolongan Ilahi',
      surah: 'HR. Al-Bukhari & Muslim (La Tas\'alil Imarah)',
      arabic:
        'يَا عَبْدَ الرَّحْمَنِ بْنَ سَمُرَةَ، لاَ تَسْأَلِ الإِمَارَةَ، فَإِنَّكَ إِنْ أُوتِيتَهَا عَنْ مَسْأَلَةٍ وُكِلْتَ إِلَيْهَا، وَإِنْ أُوتِيتَهَا مِنْ غَيْرِ مَسْأَلَةٍ أُعِنْتَ عَلَيْهَا',
      transliteration:
        'Yā \'Abdar-Raḥmāni bna Samurah, lā tas\'alil-imārata, fa-innaka in ūtītahā \'an mas\'alatin wukilta ilaihā, wa in ūtītahā min ghairi mas\'alatin u\'inta \'alaihā.',
      translation:
        '“Wahai Abdurrahman bin Samurah, janganlah engkau meminta jabatan! Sebabnya, jika engkau diberi jabatan itu karena permintaanmu (ambisi/lobi nafsu), kamu akan dibiarkan dengan jabatan tersebut (tidak akan ditolong Allah SWT). Akan tetapi jika engkau diberi jabatan tanpa permintaanmu (amanah penugasan umat), kamu akan ditolong oleh Allah SWT dalam menjalankan jabatan tersebut.” (HR. Al-Bukhari no. 7146 & Muslim no. 1652)',
      fiqhMeaning:
        'Larangan keras terhadap politik transaksional, mahar jabatan, dan ambisi kekuasaan egois. Jabatan yang direbut dengan lobi dan uang akan kehilangan pertolongan Allah (Ma\'unah), mengakibatkan kekacauan moral, korupsi, dan kehinaan di dunia maupun akhirat.',
      systemFeature:
        'Pakta Integritas Bebas Mahar & Nominasi Berbasis Rekam Jejak: Menghilangkan sistem lobi gelap dengan buku besar transparansi transaksi dan penilaian publik objektif.',
      tag: 'Anti Ambisi Kekuasaan & Ma\'unah Ilahi',
      color: 'rose',
    },
    {
      id: 5,
      title: 'Muara Keberkahan Negeri dari Langit dan Bumi',
      surah: 'QS Al-A\'raf (7) : 96',
      arabic:
        'وَلَوْ أَنَّ أَهْلَ الْقُرَىٰ آمَنُوا وَاتَّقَوْا لَفَتَحْنَا عَلَيْهِم بَرَكَاتٍ مِّنَ السَّمَاءِ وَالْأَرْضِ وَلَٰكِن كَذَّبُوا فَأَخَذْنَاهُم بِمَا كَانُوا يَكْسِبُونَ',
      transliteration:
        'Walau anna ahlal-qurā āmanū wattaqau lafataḥnā \'alaihim barakātim minas-samā\'i wal-arḍi wa lākin każżabū fa\'akhażnāhum bimā kānū yaksibūn.',
      translation:
        '“Jikalau sekiranya penduduk negeri-negeri beriman dan bertakwa, pastilah Kami akan melimpahkan kepada mereka berkah dari langit dan bumi, tetapi mereka mendustakan (ayat-ayat Kami) itu, maka Kami siksa mereka disebabkan perbuatannya.”',
      fiqhMeaning:
        'Hukum alam spiritual dan sosial makro: Ketika kepemimpinan dan rakyat menjunjung tinggi iman, takwa, dan keadilan, Allah melimpahkan berkah material maupun batiniah (ketahanan pangan, kelestarian iklim, kemakmuran ekonomi yang adil, kedamaian sosial tanpa korupsi).',
      systemFeature:
        'Bansos Tepat Sasaran 100%, Inisiatif Zero Waste Lingkungan, dan Pelayanan Rp 0 Bebas Pungli: Membuka jalan kemakmuran berkelanjutan bagi seluruh warga.',
      tag: 'Negeri Baldatun Thayyibatun wa Rabbun Ghafur',
      color: 'purple',
    },
  ];

  const handleCopyDalil = (pillar: (typeof foundationalPillars)[0]) => {
    const textToCopy = `${pillar.title}\n${pillar.surah}\n\n${pillar.arabic}\n\n${pillar.translation}\n\nFilsafat Tata Kelola Islamicity: ${pillar.fiqhMeaning}\nImplementasi AmanahGov: ${pillar.systemFeature}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedDalilId(pillar.id);
    try {
      playNotificationTone('success');
    } catch {}
    setTimeout(() => setCopiedDalilId(null), 3000);
  };

  const handleSignPledge = () => {
    const hash = `0x${Date.now().toString(16)}8f4b219e${Math.floor(Math.random() * 100000).toString(16)}`;
    setPledgeSignatureHash(hash);
    setHasSignedPledge(true);
    try {
      playNotificationTone('audit');
    } catch {}
  };

  const handleDownloadPdfCharter = async () => {
    setIsExportingPdf(true);
    setExportSuccessMsg(null);
    try {
      const res = await generateAndDownloadIslamicityCharterPdf({
        signerName: pledgeName,
        signerRole: 'Aparatur Sipil Negara / Pengemban Amanah Publik',
        agencyName: pledgeAgency,
      });
      setExportSuccessMsg(res.filename);
      try {
        playNotificationTone('success');
      } catch {}
      setTimeout(() => setExportSuccessMsg(null), 8000);
    } catch (err) {
      console.error('Error generating charter PDF:', err);
      alert('Gagal menghasilkan Piagam PDF. Silakan coba kembali.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner: Falsafah Islamicity */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISLAMICITY GOVERNANCE BLUEPRINT</span>
            </span>
            <span className="text-xs font-medium text-slate-400">
              Meneladani Kepemimpinan Rasulullah SAW &amp; Khulafaur Rasyidin
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Cara Islamicity Menciptakan Pemerintahan yang{' '}
            <span className="text-emerald-400 underline decoration-emerald-500/50 decoration-wavy">
              Amanah
            </span>{' '}
            dan{' '}
            <span className="text-teal-400 underline decoration-teal-500/50 decoration-wavy">
              Profesional
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Membangun arsitektur tata kelola publik di mana pemimpin kepala negeri adalah pengurus dan pelayan rakyat yang bertanggung jawab penuh atas rakyat yang dia urus (HR Al-Bukhari &amp; Muslim). Setiap wewenang diserahkan kepada ahlinya (QS 4:58), aparatur memenuhi kriteria Al-Qawiyyu &amp; Al-Amin (QS 28:26), steril dari ambisi meminta jabatan demi pertolongan Allah (HR Al-Bukhari &amp; Muslim), hingga terbukanya berkah melimpah dari langit dan bumi (QS 7:96).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadPdfCharter}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              id="btn-hero-download-charter-pdf"
            >
              {isExportingPdf ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Menyiapkan Piagam PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Unduh Piagam Deklarasi Tata Kelola (PDF Resmi)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveSection('simulator-meritokrasi')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Coba Simulator Al-Qawiyyu &amp; Al-Amin</span>
            </button>
          </div>

          {exportSuccessMsg && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dokumen PDF berhasil diunduh: <strong>{exportSuccessMsg}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 sm:gap-4 pb-2">
        <button
          onClick={() => setActiveSection('fondasi-dalil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'fondasi-dalil'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          id="tab-fondasi-dalil"
        >
          <BookOpen className="w-4 h-4" />
          <span>5 Fondasi Ilahi Tata Kelola</span>
        </button>

        <button
          onClick={() => setActiveSection('simulator-meritokrasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'simulator-meritokrasi'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          id="tab-simulator-meritokrasi"
        >
          <Sliders className="w-4 h-4" />
          <span>Simulator Al-Qawiyyu &amp; Al-Amin (QS 28:26)</span>
        </button>

        <button
          onClick={() => setActiveSection('komparasi-paradigma')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'komparasi-paradigma'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          id="tab-komparasi-paradigma"
        >
          <Scale className="w-4 h-4" />
          <span>Komparasi Paradigma Birokrasi</span>
        </button>

        <button
          onClick={() => setActiveSection('pakta-integritas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'pakta-integritas'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          id="tab-pakta-integritas"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Ikrar Sumpah Integritas Aparatur</span>
        </button>
      </div>

      {/* SECTION 1: 5 FONDASI DALIL UTAMA */}
      {activeSection === 'fondasi-dalil' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Lima Pilar Doktrin Pemerintahan Amanah &amp; Profesional</span>
              </h2>
              <p className="text-xs text-slate-400">
                Klik kartu pilar di bawah untuk melihat rincian teks Arab, kaidah fikih siyasah, dan implementasinya di AmanahGov.
              </p>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs text-emerald-400 font-semibold bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Otentik Shahih</span>
            </div>
          </div>

          {/* Pillars Accordion / List */}
          <div className="space-y-4">
            {foundationalPillars.map((pillar) => {
              const isSelected = selectedPillarId === pillar.id;
              return (
                <div
                  key={pillar.id}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900/95 border-emerald-500/70 shadow-xl ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                  id={`pillar-card-${pillar.id}`}
                >
                  {/* Pillar Header Item */}
                  <div
                    onClick={() => setSelectedPillarId(isSelected ? 0 : pillar.id)}
                    className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                        0{pillar.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                            {pillar.surah}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                            {pillar.tag}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyDalil(pillar);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Salin Teks Arab & Terjemahan"
                      >
                        {copiedDalilId === pillar.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <ChevronRight
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          isSelected ? 'rotate-90 text-emerald-400' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isSelected && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-in fade-in duration-200">
                      {/* Arabic Calligraphy Style Card */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/30 text-right space-y-3">
                        <p className="text-xl sm:text-2xl font-serif text-emerald-100 leading-loose sm:leading-loose tracking-wide dir-rtl">
                          {pillar.arabic}
                        </p>
                        <p className="text-xs text-emerald-300/80 italic text-left font-mono">
                          {pillar.transliteration}
                        </p>
                      </div>

                      {/* Indonesian Translation */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Terjemahan Resmi:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic">
                          {pillar.translation}
                        </p>
                      </div>

                      {/* Two Columns: Fiqh Siyasah & System Implementation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Box Fiqh */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                            <Scale className="w-4 h-4 text-amber-400" />
                            <span>Kaidah Fikih Siyasah (Tata Negara Islam):</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {pillar.fiqhMeaning}
                          </p>
                        </div>

                        {/* Box System Feature */}
                        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                            <Cpu className="w-4 h-4 text-emerald-400" />
                            <span>Penerapan Nyata di Sistem AmanahGov:</span>
                          </div>
                          <p className="text-emerald-100/90 leading-relaxed">
                            {pillar.systemFeature}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: SIMULATOR MERITOKRASI (AL-QAWIYYU & AL-AMIN) */}
      {activeSection === 'simulator-meritokrasi' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Kalkulator &amp; Evaluator Kelayakan Kepemimpinan</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Simulator Indeks Al-Qawiyyu (Kompeten) &amp; Al-Amin (Amanah) — QS 28:26
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Uji kelayakan aparatur atau calon kepala instansi berdasarkan parameter kekuatan profesional (Al-Qawiyyu), integritas moral (Al-Amin), serta etika larangan meminta jabatan (HR Al-Bukhari &amp; Muslim).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Al-Qawiyyu Parameters */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                    Q
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Al-Qawiyyu (Kompetensi)</h3>
                    <p className="text-[10px] text-teal-400">Kekuatan Teknis &amp; Eksekusi</p>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-teal-300 bg-teal-950/70 px-2 py-0.5 rounded border border-teal-800">
                  {qawiyyuScore}/100
                </span>
              </div>

              {/* Slider 1: Technical skill */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Keahlian Teknis &amp; Regulasi:</span>
                  <span className="font-mono text-emerald-400 font-bold">{technicalSkill}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={technicalSkill}
                  onChange={(e) => setTechnicalSkill(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Execution speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Kecepatan Respons Lapangan (SLA):</span>
                  <span className="font-mono text-emerald-400 font-bold">{executionSpeed}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={executionSpeed}
                  onChange={(e) => setExecutionSpeed(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Digital Innovation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Adopsi AI &amp; Inovasi Digital:</span>
                  <span className="font-mono text-emerald-400 font-bold">{innovationAdoption}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={innovationAdoption}
                  onChange={(e) => setInnovationAdoption(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-400 border border-slate-800/80">
                Pilar Al-Qawiyyu menjamin kebijakan dieksekusi cepat, berbasis data ilmiah, dan tidak menghasilkan birokrasi yang lambat atau lumpuh.
              </div>
            </div>

            {/* Column 2: Al-Amin Parameters */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Al-Amin (Integritas)</h3>
                    <p className="text-[10px] text-emerald-400">Kejujuran &amp; Amanah Moral</p>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                  {aminScore}/100
                </span>
              </div>

              {/* Slider 1: Wealth Transparency */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Transparansi Harta &amp; LHKPN:</span>
                  <span className="font-mono text-emerald-400 font-bold">{wealthTransparency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wealthTransparency}
                  onChange={(e) => setWealthTransparency(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Gratification Resistance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Keteguhan Menolak Suap/Pungli:</span>
                  <span className="font-mono text-emerald-400 font-bold">{gratificationResistance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gratificationResistance}
                  onChange={(e) => setGratificationResistance(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: God Consciousness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Kesadaran Hisab Akhirat:</span>
                  <span className="font-mono text-emerald-400 font-bold">{godConsciousness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={godConsciousness}
                  onChange={(e) => setGodConsciousness(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-400 border border-slate-800/80">
                Pilar Al-Amin membentengi aparatur dari tipu daya korupsi, gratifikasi gelap, serta penyalahgunaan wewenang untuk kroni atau keluarga.
              </div>
            </div>

            {/* Column 3: Status Ma'unah & Pertolongan Ilahi */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Status Pertolongan Allah (Ma\'unah)</h3>
                  </div>
                </div>

                {/* Question: Did they demand office? */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    Parameter HR Al-Bukhari &amp; Muslim: Apakah Meminta/Mengejar Jabatan?
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setDemandedOffice(false)}
                      className={`p-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                        !demandedOffice
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Tidak (Ditugaskan)
                    </button>
                    <button
                      onClick={() => setDemandedOffice(true)}
                      className={`p-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                        demandedOffice
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Ya (Meminta/Lobi)
                    </button>
                  </div>
                </div>

                {/* Status Box */}
                <div className={`p-4 rounded-xl border ${maunahStatus.badgeColor} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                      HASIL EVALUASI FIKIH
                    </span>
                    <span className="font-serif text-sm font-bold text-white">
                      {maunahStatus.arabicKey}
                    </span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-extrabold ${maunahStatus.textColor}`}>
                    {maunahStatus.status}
                  </h4>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    {maunahStatus.advice}
                  </p>
                </div>
              </div>

              {/* Composite Index Score Display */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Indeks Komposit Kepemimpinan:</span>
                  <span className="text-lg font-mono font-bold text-white">{compositeScore} / 100</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Kelayakan Jabatan:</span>
                  <span
                    className={`font-bold ${
                      maunahStatus.recommended ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {maunahStatus.recommended ? 'MEMENUHI SYARAT ISLAMICITY' : 'TIDAK DIREKOMENDASIKAN'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: KOMPARASI PARADIGMA */}
      {activeSection === 'komparasi-paradigma' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Analisis Komparatif Model Tata Kelola</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Birokrasi Oportunistik Konvensional vs Tata Kelola Pemerintahan Islamicity
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Perbedaan mendasar antara paradigma kekuasaan sekuler oportunistik dengan paradigma kepemimpinan kenabian yang berorientasi khidmat ummah dan hisab akhirat.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4 w-1/4">Dimensi Kepemimpinan</th>
                  <th className="p-4 w-3/8 text-rose-300 bg-rose-950/20">
                    Birokrasi Oportunistik (Konvensional)
                  </th>
                  <th className="p-4 w-3/8 text-emerald-300 bg-emerald-950/30">
                    Pemerintahan Islamicity AmanahGov
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Motif &amp; Hakikat Jabatan</span>
                  </td>
                  <td className="p-4 text-slate-300 bg-rose-950/10">
                    Mengejar fasilitas kemewahan, status sosial, kekebalan hukum, dan akumulasi modal bagi lingkaran oligarki.
                  </td>
                  <td className="p-4 text-emerald-200 bg-emerald-950/20 font-medium">
                    Mengemban amanah hisab akhirat yang berat. Menjadi pelayan yang bertanggung jawab penuh atas rakyatnya (QS 4:58 &amp; HR Bukhari-Muslim).
                  </td>
                </tr>

                <tr className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Cara Memperoleh Kedudukan</span>
                  </td>
                  <td className="p-4 text-slate-300 bg-rose-950/10">
                    Membeli suara, mahar partai, lobi gelap, pencitraan manipulatif, dan meminta jabatan secara agresif.
                  </td>
                  <td className="p-4 text-emerald-200 bg-emerald-950/20 font-medium">
                    Penugasan murni oleh syura umat berdasarkan rekam jejak. Dilarang meminta jabatan agar meraih pertolongan Allah (HR Bukhari &amp; Muslim).
                  </td>
                </tr>

                <tr className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kriteria Pemilihan Aparatur</span>
                  </td>
                  <td className="p-4 text-slate-300 bg-rose-950/10">
                    Koneksi keluarga (nepotisme), balas budi tim sukses, atau setoran uang tanpa uji kompetensi objektif.
                  </td>
                  <td className="p-4 text-emerald-200 bg-emerald-950/20 font-medium">
                    Dua pilar tak terpisahkan: Al-Qawiyyu (kapabilitas teknis &amp; kecakapan sains) dan Al-Amin (integritas tak terbeli) (QS 28:26).
                  </td>
                </tr>

                <tr className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Hubungan Pemimpin &amp; Rakyat</span>
                  </td>
                  <td className="p-4 text-slate-300 bg-rose-950/10">
                    Feodalistik: Pemimpin dilayani, protokoler ketat membatasi warga, laporan masyarakat diabaikan atau dipersulit.
                  </td>
                  <td className="p-4 text-emerald-200 bg-emerald-950/20 font-medium">
                    Sayyidul Qaumi Khadimuhum: Pemimpin wajib turun ke lapangan melayani keluhan dhu\'afa, tanggap darurat 24 jam.
                  </td>
                </tr>

                <tr className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Pengawasan &amp; Transparansi</span>
                  </td>
                  <td className="p-4 text-slate-300 bg-rose-950/10">
                    Buku kas tertutup, kuitansi ganda, pungutan liar tersembunyi, dan saling melindungi kejahatan korupsi.
                  </td>
                  <td className="p-4 text-emerald-200 bg-emerald-950/20 font-medium">
                    Buku Besar Blockchain Publik yang tidak dapat dimanipulasi, verifikasi audit kriptografis, dan layanan Rp 0 tanpa pungli.
                  </td>
                </tr>

                <tr className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Muara &amp; Dampak terhadap Negeri</span>
                  </td>
                  <td className="p-4 text-slate-300 bg-rose-950/10">
                    Kesenjangan sosial melebar, utang menumpuk tanpa hasil, kerusakan lingkungan hidup, dan hilangnya keberkahan.
                  </td>
                  <td className="p-4 text-emerald-200 bg-emerald-950/20 font-medium">
                    Terbukanya pintu berkah dari langit dan bumi: ketahanan pangan, lingkungan asri, dan keadilan sosial (QS 7:96).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: PAKTA INTEGRITAS & DIGITAL OATH */}
      {activeSection === 'pakta-integritas' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Ikrar Komitmen Moral Publik</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Sumpah Jabatan &amp; Pakta Integritas Kepemimpinan Islamicity
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Formulir penandatanganan ikrar kenabian bagi aparatur dan warga. Menegaskan komitmen menolak suap, memegang amanah rakyat, dan siap dihisab di hadapan Allah SWT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Formulir Pengesahan Ikrar</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Nama Pejabat / Aparatur / Pengemban Amanah:
                </label>
                <input
                  type="text"
                  value={pledgeName}
                  onChange={(e) => setPledgeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Instansi / Dinas / Wilayah Penugasan:
                </label>
                <input
                  type="text"
                  value={pledgeAgency}
                  onChange={(e) => setPledgeAgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <span className="font-bold text-emerald-400 block">Isi Ikrar Sumpah Kenabian:</span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300 leading-relaxed">
                  <li>Saya tidak akan meminta atau membeli jabatan demi ambisi pribadi (HR Bukhari &amp; Muslim).</li>
                  <li>Saya bersedia dihisab penuh sebagai pengurus dan pelayan rakyat (HR Bukhari &amp; Muslim).</li>
                  <li>Saya akan menjalankan wewenang secara profesional (Al-Qawiyyu) dan jujur (Al-Amin) (QS 28:26).</li>
                  <li>Saya menjamin keadilan pelayanan bagi seluruh warga tanpa pungutan liar Rp 0 (QS 4:58).</li>
                  <li>Saya mengikhlaskan niat untuk membuka keberkahan negeri dari langit dan bumi (QS 7:96).</li>
                </ol>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSignPledge}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-sign-pledge"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{hasSignedPledge ? 'Perbarui Tanda Tangan' : 'Tandatangani Sumpah Digital'}</span>
                </button>

                <button
                  onClick={handleDownloadPdfCharter}
                  disabled={isExportingPdf}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  id="btn-download-charter-from-pledge"
                >
                  <FileDown className="w-4 h-4 text-emerald-400" />
                  <span>Cetak Piagam PDF</span>
                </button>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/70 border-2 border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SERTIFIKAT DIGITAL RESMI
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    Piagam Komitmen Kepemimpinan Islamicity
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    Nomor: PIAGAM-ISLAMICITY/2026/10/{Math.floor(1000 + Math.random() * 9000)}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 block">Diberikan kepada:</span>
                  <p className="text-sm font-bold text-white">{pledgeName}</p>
                  <p className="text-[11px] text-slate-300">{pledgeAgency}</p>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  “Menyatakan sumpah setia memegang teguh amanah kepemimpinan publik, melayani rakyat dengan adil, dan siap diberhentikan bila terbukti mengkhianati amanat rakyat.”
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Status Pengesahan:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{hasSignedPledge ? 'Telah Ditandatangani On-Chain' : 'Menunggu Tanda Tangan'}</span>
                  </span>
                </div>

                {pledgeSignatureHash && (
                  <div className="text-[10px] font-mono text-slate-400 truncate bg-slate-950 p-2 rounded border border-slate-800">
                    Hash Integritas: <span className="text-emerald-400">{pledgeSignatureHash}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IslamicityGovernanceView;
