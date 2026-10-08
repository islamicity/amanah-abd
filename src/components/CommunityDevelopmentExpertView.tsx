import React, { useState, useMemo } from 'react';
import {
  Users,
  Recycle,
  Leaf,
  Award,
  Sparkles,
  Calculator,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Calendar,
  Share2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  HeartHandshake,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Send,
  Building,
  Home,
  Droplet,
  ExternalLink,
} from 'lucide-react';

type TabKey = 'overview' | 'simulator' | 'methodology' | 'innovations' | 'templates' | 'assessment';

interface InnovationProgram {
  id: string;
  title: string;
  badge: string;
  category: string;
  tagline: string;
  problemSolved: string;
  mechanism: string[];
  impactBenefit: string;
  rolesInvolved: string[];
  tips: string;
  wisdom: string;
}

const INNOVATION_PROGRAMS: InnovationProgram[] = [
  {
    id: 'sedekah-sampah',
    title: 'Gerakan Sedekah Sampah Berkah (Ubah Sampah Jadi Amal Jariyah)',
    badge: 'Sosial & Keagamaan',
    category: 'Anorganik Sirkular',
    tagline: 'Warga tidak menuntut uang tunai, tapi meniatkan sampah anorganik bersih untuk santunan dhuafa & beasiswa anak gang.',
    problemSolved: 'Keengganan warga memilah sampah karena nilai rupiah per kilo dianggap kecil dan ribet dicatat di buku tabungan perseorangan.',
    mechanism: [
      'Setiap KK mengumpulkan kardus, kertas, botol plastik bersih, dan kaleng dalam satu wadah/karung berlabel "Sedekah Sampah".',
      'Tim Karang Taruna mengambil setiap 2 minggu sekali atau warga mengantarkan ke teras pos ronda/masjid.',
      'Pengepul mitra RT menimbang secara transparan di depan warga saat waktu penjemputan.',
      '100% hasil penjualan masuk ke Rekening/Kas Sedekah Sosial RT untuk biaya pengobatan warga tidak mampu, santunan yatim, dan beasiswa sekolah.',
      'Laporan saldo diumumkan secara terbuka via WhatsApp Group RT dan papan pengumuman musholla.',
    ],
    impactBenefit: 'Kas sosial RT bertambah Rp 800.000 - Rp 2.500.000 / bulan; kerukunan warga meningkat drastis; 0 sampah kardus/botol dibakar.',
    rolesInvolved: ['Ibu Dasawisma (edukasi pilah)', 'Karang Taruna (penimbangan)', 'Ketua RT & DKM Masjid (penyaluran santunan)'],
    tips: 'Sediakan cap atau stiker doa di setiap karung sedekah: "Semoga menjadi pemberat amal kebaikan di akhirat".',
    wisdom: '"Sedekah itu tidak akan mengurangi harta..." (HR. Muslim). Mengubah benda yang dianggap kotor menjadi sumber keberkahan kampung.',
  },
  {
    id: 'jelantah-emas',
    title: 'Gerakan Jelantah Jadi Emas (UCO / Used Cooking Oil to Gold)',
    badge: 'Ekonomi Dapur',
    category: 'Cairan Berbahaya',
    tagline: 'Cegah penyumbatan selokan dan penyakit jantung: kumpulkan minyak goreng bekas jadi tabungan emas Pegadaian.',
    problemSolved: 'Kebiasaan membuang minyak jelantah panas ke wastafel/selokan yang menyumbat saluran air, mencemari tanah, atau digunakan berulang kali hingga karsinogenik.',
    mechanism: [
      'Ibu-ibu mengumpulkan minyak jelantah dingin ke dalam botol air mineral atau jerigen bekas 5 liter.',
      'Setelah jerigen penuh, disetorkan ke Bank Sampah RT atau Posyandu saat penimbangan balita.',
      'RT bermitra resmi dengan perusahaan pengumpul biodiesel bersertifikasi (harga serap Rp 6.500 - Rp 8.000 / liter).',
      'Pilihan konversi: Langsung dikonversi jadi gramasi Tabungan Emas (via Pegadaian/BSI) atau kupon sembako minyak goreng baru.',
    ],
    impactBenefit: 'Menyelamatkan saluran selokan gang dari kerak lemak membusuk; 1 RT mampu mengumpulkan 150-300 liter jelantah per bulan.',
    rolesInvolved: ['Kader Posyandu & PKK', 'Pengepul Biodiesel Terverifikasi', 'Bendahara RT'],
    tips: 'Saring jelantah dari remah sisa gorengan menggunakan saringan teh bekas sebelum dituangkan ke jerigen agar nilai jualnya tinggi.',
    wisdom: 'Melindungi kebersihan sumber air dan kesehatan tubuh keluarga adalah amanah menjaga titipan raga dari Sang Pencipta.',
  },
  {
    id: 'maggot-komunal',
    title: 'Sentra Biokonversi Maggot BSF Komunal & Kolam Bersama RT',
    badge: 'Bio-Teknologi Rakyat',
    category: 'Organik Dapur & Warung',
    tagline: 'Mesin hayati pengurai tercepat di dunia: sampah organik ludes dalam hitungan jam tanpa bau, menghasilkan pakan ternak segar.',
    problemSolved: 'Sampah basah sisa makanan warung/warga cepat berbau busuk, memancing lalat hijau dan belatung kotor, serta membuat lingkungan kumuh.',
    mechanism: [
      'Mendirikan kandang lalat BSF dan biopond larva ukuran 2x3 meter di lahan tidur samping gardu ronda atau bantaran selokan tertutup.',
      'Karang Taruna atau petugas kebersihan mengambil ember sampah organik dari rumah-rumah tiap pagi jam 08.00 WIB.',
      'Sampah basah langsung dicacah dan diberikan ke biopond larva maggot; ludes habis dikonsumsi dalam 4-6 jam tanpa bau busuk.',
      'Larva maggot dipanen sebagai pakan gratis kolam lele komunal RT dan unggas warga.',
      'Kasgot (bekas maggot/residu kotoran) dipanen sebagai pupuk organik kualitas super untuk kebun toga RT.',
    ],
    impactBenefit: '100% sampah organik warga tuntas di tempat; panen lele 60 kg/siklus untuk konsumsi warga lansia dan anak stunting.',
    rolesInvolved: ['Karang Taruna (Operator Teknis)', 'Warung Makan Sekitar RT', 'Seksi Pembangunan RT'],
    tips: 'Kandang BSF diberi pencahayaan matahari yang cukup karena lalat dewasa butuh sinar matahari untuk kawin dan bertelur secara alami.',
    wisdom: 'Mempelajari keseimbangan alam ciptaan Allah: serangga yang tidak menggigit manusia ini diciptakan sebagai pembersih bumi paling efisien.',
  },
  {
    id: 'lemari-berbagi',
    title: 'Lemari Berbagi & Pojok Barter Pakaian/Buku Layak Pakai',
    badge: 'Solidaritas Warga',
    category: 'Barang Bekas Layak Pakai',
    tagline: 'Konsep "Ambil Bila Butuh, Letakkan Bila Lebih": sirkularitas barang layak pakai antar tetangga.',
    problemSolved: 'Lemari warga penuh baju bekas layak pakai yang akhirnya menumpuk berjamur atau dibuang ke tempat sampah, padahal tetangga lain membutuhkan.',
    mechanism: [
      'Menyediakan lemari kaca atau rak gantung bersih di area publik RT (teras balai RT atau samping pos ronda).',
      'Warga dapat menaruh pakaian bersih rapi, sepatu sekolah, tas, mainan anak, atau buku pelajaran yang sudah tidak terpakai.',
      'Warga atau anak-anak yang membutuhkan bebas memilih dan mengambil secara terhormat tanpa rasa canggung atau malu.',
      'Setiap akhir bulan, sisa pakaian yang belum terambil disortir untuk disumbangkan ke panti asuhan atau korban bencana.',
    ],
    impactBenefit: 'Memperpanjang umur pakai pakaian (slow fashion komunal); mengurangi beban pengeluaran seragam dan buku sekolah keluarga prasejahtera.',
    rolesInvolved: ['Seksi Kesejahteraan Sosial RT', 'Ibu-ibu Arisan', 'Remaja Masjid'],
    tips: 'Wajibkan baju yang disumbangkan sudah dicuci wangi dan diberi gantungan (hanger) agar tetap rapi dan terhormat saat dipajang.',
    wisdom: '"Kamu sekali-kali tidak sampai kepada kebajikan (yang sempurna), sebelum kamu menafkahkan sebahagian harta yang kamu cintai..." (QS. Ali Imran: 92).',
  },
  {
    id: 'dapur-zero-waste',
    title: 'Gerakan 1 Dapur 1 Ember Tumpuk & Pagar Sayur Hijau',
    badge: 'Kemandirian Dapur',
    category: 'Organik Rumah Tangga',
    tagline: 'Membuat pupuk cair sendiri di bawah wastafel dan memanen sayuran segar dari pagar depan rumah.',
    problemSolved: 'Ketergantungan terhadap pengangkutan gerobak sampah harian dan bau menyengat dari kantong kresek sampah basah yang dirobek kucing liar.',
    mechanism: [
      'Pengadaan massal ember tumpuk menggunakan dana swadaya RT atau subsidi kas (biaya ~Rp 45.000/set).',
      'Setiap KK menerima 1 set ember tumpuk dan 1 botol cairan starter pengurai mikroba.',
      'Ibu rumah tangga memasukkan sisa kupasan sayur, kulit buah, dan nasi sisa setiap selesai memasak.',
      'Pupuk Organik Cair (POC) dipanen dari kran ember tiap 2 minggu sekali dan disemprotkan ke tanaman pagar pekarangan.',
    ],
    impactBenefit: 'Timbulan sampah harian berkurang hingga 60%; lorong gang menjadi hijau asri dengan tanaman cabai, tomat, dan kemangi.',
    rolesInvolved: ['Kader Dasawisma (Monitoring berkala)', 'Ibu Rumah Tangga', 'Ketua Lingkungan'],
    tips: 'Buatkan perlombaan antar-gang: "Gang Paling Hijau & Paling Aktif Memanen Kompos" saat momentum 17 Agustus atau Hari Bumi.',
    wisdom: 'Pangan segar bebas pestisida yang dirawat dengan pupuk organik sendiri menjamin makanan thayyib (baik) untuk tumbuh kembang anak.',
  },
  {
    id: 'satgas-cilik',
    title: 'Satgas Cilik & Detektif Hijau Karang Taruna',
    badge: 'Edukasi Generasi',
    category: 'Pendidikan Karakter',
    tagline: 'Melibatkan anak-anak dan pemuda sebagai duta perubahan: edukasi pilah sampah sejak dini lewat permainan seru.',
    problemSolved: 'Kebiasaan anak-anak jajan makanan kemasan plastik dan membuang bungkus sembarangan di jalanan gang.',
    mechanism: [
      'Membentuk komunitas "Detektif Hijau" dari anak-anak usia SD dan SMP di wilayah RT/RW.',
      'Diberikan rompi/topi kecil sederhana dan buku catatan patroli kebersihan mingguan saat hari Minggu pagi.',
      'Anak-anak belajar mengidentifikasi jenis sampah (organik, kertas, plastik kresek, botol PET) melalui permainan interaktif.',
      'Sistem poin reward: setiap kilogram sampah plastik botol yang dikumpulkan dapat ditukar dengan buku tulis, pensil warna, atau susu UHT.',
    ],
    impactBenefit: 'Menanamkan akhlak peduli bumi sejak usia dini; gang bebas dari puntung rokok dan sampah bungkus jajanan plastik.',
    rolesInvolved: ['Pengurus Karang Taruna (Pembina)', 'Anak-anak Warga', 'Orang Tua Murid'],
    tips: 'Apresiasi anak-anak saat rapat warga atau perayaan HUT RI dengan piagam resmi bertanda tangan Ketua RW dan Lurah.',
    wisdom: 'Mendidik anak mencintai kebersihan sejak kecil merupakan investasi akhlak mulia yang pahalanya mengalir abadi.',
  },
];

export const CommunityDevelopmentExpertView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Simulator Parameters State
  const [kkCount, setKkCount] = useState<number>(65); // Default 65 KK di 1 RT
  const [organicParticipation, setOrganicParticipation] = useState<number>(75); // % pilah organik
  const [anorganicParticipation, setAnorganicParticipation] = useState<number>(85); // % pilah anorganik
  const [hasMaggot, setHasMaggot] = useState<boolean>(true);
  const [hasUsedOil, setHasUsedOil] = useState<boolean>(true);

  // Self-Assessment Checklist State
  const [auditScores, setAuditScores] = useState<Record<string, boolean>>({
    q1: true,
    q2: true,
    q3: false,
    q4: true,
    q5: false,
    q6: false,
    q7: false,
  });

  const toggleAudit = (key: string) => {
    setAuditScores((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const auditTotalScore = useMemo(() => {
    return Object.values(auditScores).filter(Boolean).length;
  }, [auditScores]);

  // Dynamic Simulator Computations
  const simulatorResult = useMemo(() => {
    // Rata-rata timbulan sampah per orang per hari di Indonesia: 0.7 kg
    // Rata-rata 1 KK = 3.8 jiwa -> ~2.6 kg sampah / KK / hari
    const dailyTotalWastePerKk = 2.6; // kg
    const totalDailyKg = Math.round(kkCount * dailyTotalWastePerKk);
    const totalMonthlyKg = totalDailyKg * 30;

    // Fraksi: Organik ~60% (1.56 kg), Anorganik bernilai jual ~25% (0.65 kg), Residu ~15% (0.39 kg)
    const organicShare = 0.6;
    const anorganicShare = 0.25;

    // Organik yang terkelola di RT
    const organicMonthlyTimbulan = totalMonthlyKg * organicShare;
    const organicMonthlyManaged = Math.round(organicMonthlyTimbulan * (organicParticipation / 100));

    // Anorganik yang terserap Bank Sampah / Sedekah
    const anorganicMonthlyTimbulan = totalMonthlyKg * anorganicShare;
    const anorganicMonthlyManaged = Math.round(anorganicMonthlyTimbulan * (anorganicParticipation / 100));

    // Sampah residu yang masih perlu diangkut ke TPS/TPA
    const residualMonthlyKg = totalMonthlyKg - organicMonthlyManaged - anorganicMonthlyManaged;
    const wasteDiversionRate = Math.round(((organicMonthlyManaged + anorganicMonthlyManaged) / totalMonthlyKg) * 100);

    // Nilai Ekonomi:
    // 1. Penjualan Sampah Anorganik (Rata-rata campur kardus, botol, plastik Rp 2.200 / kg)
    const anorganicCashMonthly = anorganicMonthlyManaged * 2200;

    // 2. Pupuk Organik Kompos / Maggot (30% dari berat organik) dinilai Rp 2.000 / kg
    const compostKgMonthly = Math.round(organicMonthlyManaged * 0.32);
    const compostValueMonthly = compostKgMonthly * 2500;

    // 3. Jelantah (Used Cooking Oil): Asumsi 1.8 liter / KK / bulan disetor x Rp 7.000 / liter
    const usedCookingOilLiters = hasUsedOil ? Math.round(kkCount * 1.6 * (anorganicParticipation / 100)) : 0;
    const usedOilCashMonthly = usedCookingOilLiters * 7000;

    // Total Potensi Kas / Nilai Sirkular RT per Bulan
    const totalMonthlyEconomicValue = anorganicCashMonthly + compostValueMonthly + usedOilCashMonthly;

    // Reduksi Emisi Gas Rumah Kaca (1 kg organik tidak ke TPA = ~0.65 kg CO2e)
    const co2eReducedKg = Math.round(organicMonthlyManaged * 0.65);

    // Status / Tingkat Kemandirian
    let statusLabel = 'RT Pemula Hijau';
    let statusColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    let stars = 2;

    if (wasteDiversionRate >= 80) {
      statusLabel = 'RT Paripurna • Bebas TPA (Bintang 5)';
      statusColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/15';
      stars = 5;
    } else if (wasteDiversionRate >= 65) {
      statusLabel = 'RT Mandiri Lestari (Bintang 4)';
      statusColor = 'text-teal-400 border-teal-500/40 bg-teal-500/15';
      stars = 4;
    } else if (wasteDiversionRate >= 50) {
      statusLabel = 'RT Tumbuh Sadar (Bintang 3)';
      statusColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-500/15';
      stars = 3;
    }

    return {
      totalDailyKg,
      totalMonthlyKg,
      organicMonthlyManaged,
      anorganicMonthlyManaged,
      residualMonthlyKg,
      wasteDiversionRate,
      anorganicCashMonthly,
      compostKgMonthly,
      compostValueMonthly,
      usedCookingOilLiters,
      usedOilCashMonthly,
      totalMonthlyEconomicValue,
      co2eReducedKg,
      statusLabel,
      statusColor,
      stars,
    };
  }, [kkCount, organicParticipation, anorganicParticipation, hasMaggot, hasUsedOil]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => {
      setCopiedTemplateId(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" id="community-dev-expert">
      {/* Header Banner: Community Development Expert */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 backdrop-blur-sm">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Community Development Expert</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>🌿 RT / RW Inovatif</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Recycle className="w-3.5 h-3.5 text-amber-400" />
              <span>♻️ Sampah Selesai di RT</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Panduan Operasional &amp; Toolkit Swadaya: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300">
              Menuntaskan 100% Sampah dari Sumber di Level RT Tanpa Beban TPA
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Kunci keberhasilan pengelolaan lingkungan bukan sekadar teknologi mahal, melainkan <strong>rekayasa sosial (social engineering)</strong>, kepemimpinan guyub rukun, dan model insentif berkah. Modul ini membekali Ketua RT, Pengurus RW, Kader Dasawisma, dan Pemuda Karang Taruna untuk mewujudkan rukun tetangga yang mandiri, bersih, dan berdaya ekonomi sirkular.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-teal-800/40 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-teal-500/20">
              <span className="text-slate-400 block text-[11px]">Target Reduksi</span>
              <strong className="text-emerald-400 font-mono text-base sm:text-lg font-black">
                80% - 100%
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Organik &amp; Anorganik di RT</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-teal-500/20">
              <span className="text-slate-400 block text-[11px]">Nilai Kas RT Mandiri</span>
              <strong className="text-amber-300 font-mono text-base sm:text-lg font-black">
                Rp 1.5jt - 4jt
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Per Bulan dari Sirkularitas</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-teal-500/20">
              <span className="text-slate-400 block text-[11px]">Metodologi Komunal</span>
              <strong className="text-teal-300 font-mono text-base sm:text-lg font-black">
                5 Tahap Rembug
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Dari Rumah ke Komunitas</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-teal-500/20">
              <span className="text-slate-400 block text-[11px]">Dampak Sosial</span>
              <strong className="text-cyan-300 font-mono text-base sm:text-lg font-black">
                Amal Jariyah
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Santunan &amp; Beasiswa Gang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 max-w-full text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Arsitektur "Sampah Selesai di RT"</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-300" />
          <span>Simulator Neraca &amp; Kas RT</span>
        </button>

        <button
          onClick={() => setActiveTab('methodology')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'methodology'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-cyan-300" />
          <span>5 Langkah Community Organizing</span>
        </button>

        <button
          onClick={() => setActiveTab('innovations')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'innovations'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>6 Inovasi RT/RW Unggulan</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'templates'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-300" />
          <span>Toolkit SOP &amp; Draft SK RT</span>
        </button>

        <button
          onClick={() => setActiveTab('assessment')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'assessment'
              ? 'bg-rose-700 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
          <span>Audit Kesiapan RT Merdeka Sampah</span>
        </button>
      </div>

      {/* TAB 1: ARSITEKTUR SAMPAH SELESAI DI RT */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-400">
                  Prinsip Dasar Pengelolaan di Hulu
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Piramida Sirkularitas 4 Fraksi di Tingkat Rukun Tetangga (RT)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                  Paradigma lama: "Kumpul - Angkut - Buang ke TPA" telah gagal dan memicu krisis darurat sampah nasional. Paradigma baru: <strong>Sampah dipilah di meja dapur dan diselesaikan 100% di dalam gang</strong> melalui 4 saluran terdedikasi.
                </p>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-semibold self-start md:self-auto flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Prinsip Zero Waste to Landfill</span>
              </div>
            </div>

            {/* 4 Fraksi Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Fraksi 1: Organik Basah */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base mb-3 border border-emerald-500/30">
                    1
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                    Porsi ~60% Timbulan
                  </span>
                  <h3 className="text-base font-bold text-white">Fraksi Organik Dapur &amp; Daun</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Sisa sayur, kulit buah, nasi basi, ampas kopi/teh, daun gugur pekarangan gang.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 text-xs space-y-2">
                  <div className="font-semibold text-emerald-300">Solusi Tuntas di RT:</div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Komposter Ember Tumpuk (POC)</li>
                    <li>Biokonversi Maggot BSF RT</li>
                    <li>Pipa Resapan Biopori Gang</li>
                  </ul>
                  <div className="text-[10px] text-emerald-400/90 font-mono bg-emerald-950/50 p-2 rounded-lg border border-emerald-900/60">
                    Hasil: Pupuk Organik + Pakan Ikan Lele
                  </div>
                </div>
              </div>

              {/* Fraksi 2: Anorganik Daur Ulang */}
              <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-teal-400 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-base mb-3 border border-teal-500/30">
                    2
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block mb-1">
                    Porsi ~25% Timbulan
                  </span>
                  <h3 className="text-base font-bold text-white">Fraksi Anorganik Bernilai Ekonomi</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Kardus, kertas arsip, botol kaca, botol PET, kaleng aluminium, besi, tembaga.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 text-xs space-y-2">
                  <div className="font-semibold text-teal-300">Solusi Tuntas di RT:</div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Bank Sampah Terjadwal Mingguan</li>
                    <li>Gerakan "Sedekah Sampah Berkah"</li>
                    <li>Pengepul Resmi Mitra RT</li>
                  </ul>
                  <div className="text-[10px] text-teal-400/90 font-mono bg-teal-950/50 p-2 rounded-lg border border-teal-900/60">
                    Hasil: Kas Sosial RT &amp; Beasiswa Anak
                  </div>
                </div>
              </div>

              {/* Fraksi 3: Minyak Jelantah & Baju Layak */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base mb-3 border border-amber-500/30">
                    3
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                    Porsi ~5% Khusus
                  </span>
                  <h3 className="text-base font-bold text-white">Minyak Jelantah &amp; Barang Layak</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Minyak goreng bekas pakai dapur rumah tangga, pakaian bekas layak, buku sekolah anak.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 text-xs space-y-2">
                  <div className="font-semibold text-amber-300">Solusi Tuntas di RT:</div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Setor Jelantah Jerigen ke Posyandu</li>
                    <li>Kerjasama Pengumpul Biodiesel</li>
                    <li>"Lemari Berbagi" di Balai RT</li>
                  </ul>
                  <div className="text-[10px] text-amber-400/90 font-mono bg-amber-950/50 p-2 rounded-lg border border-amber-900/60">
                    Hasil: Tabungan Emas + Pakaian Gratis
                  </div>
                </div>
              </div>

              {/* Fraksi 4: Residu & B3 */}
              <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-rose-400 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-base mb-3 border border-rose-500/30">
                    4
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
                    Porsi &lt;10% Residu Murni
                  </span>
                  <h3 className="text-base font-bold text-white">Residu Higienis &amp; B3 Rumah Tangga</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Pembalut wanita, popok bayi (diaper), puntung rokok, batu baterai bekas, lampu neon, sisa obat.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 text-xs space-y-2">
                  <div className="font-semibold text-rose-300">Solusi Tuntas di RT:</div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Wadah Khusus Residu Kedap</li>
                    <li>Drop-box B3 Pos Ronda RT</li>
                    <li>Hanya fraksi ini yang diangkut DLH</li>
                  </ul>
                  <div className="text-[10px] text-rose-400/90 font-mono bg-rose-950/50 p-2 rounded-lg border border-rose-900/60">
                    Beban TPA Berkurang s.d. 90%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tri Dharma Community Organizing RT/RW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">1. Nilai Guyub Rukun &amp; Gotong Royong</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Masyarakat Indonesia memiliki modal sosial terkuat di dunia: tradisi gotong royong dan rukun tetangga. Program lingkungan tidak didorong dengan denda represif, tetapi melalui sentuhan kehormatan, kebanggaan gang, dan kepedulian antar-keluarga.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">2. Sirkularitas Finansial yang Transparan</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Setiap rupiah yang dihasilkan dari timbangan bank sampah, minyak jelantah, dan pupuk organik dicatat terbuka di papan pengumuman musholla dan WhatsApp RT. Rasa percaya (trust) adalah fondasi keberlanjutan.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">3. Fastabiqul Khairat (Berlomba Kebaikan)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Menyuburkan iklim kompetisi sehat antar-dasawisma, antar-gang, atau antar-RT. Gang terbersih dan paling rajin menyetor sedekah sampah mendapatkan apresiasi khusus dan bibit sayuran gratis dari kelurahan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATOR NERACA & KAS RT */}
      {activeTab === 'simulator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>Perhitungan Neraca Massa &amp; Finansial Swadaya RT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Simulator Target: "Sampah Selesai di RT Anda"
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Sesuaikan jumlah KK di RT Anda dan lihat berapa ton sampah yang terselesaikan di tempat, berapa kas sosial yang tercipta, serta predikat kemandirian lingkungan RT Anda.
              </p>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold self-start md:self-auto ${simulatorResult.statusColor}`}>
              <span>{simulatorResult.statusLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Controls */}
            <div className="space-y-6 bg-slate-950/70 p-5 sm:p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Parameter Wilayah RT Anda</span>
              </h3>

              {/* KK Count */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Jumlah Kepala Keluarga (KK):</span>
                  <span className="font-mono font-bold text-teal-300 text-sm">{kkCount} KK</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="200"
                  step="5"
                  value={kkCount}
                  onChange={(e) => setKkCount(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>15 KK</span>
                  <span>65 KK (Rata-rata RT)</span>
                  <span>200 KK (RW Mini)</span>
                </div>
              </div>

              {/* Organic Participation */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Kepatuhan Pilah Organik Dapur:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{organicParticipation}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={organicParticipation}
                  onChange={(e) => setOrganicParticipation(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>20% (Awal)</span>
                  <span>75% (Aktif)</span>
                  <span>100% (Paripurna)</span>
                </div>
              </div>

              {/* Anorganic Participation */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Kepatuhan Setor Sedekah/Bank Sampah:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{anorganicParticipation}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={anorganicParticipation}
                  onChange={(e) => setAnorganicParticipation(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>20%</span>
                  <span>85%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-800 space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Biokonversi Maggot BSF Komunal:</span>
                  <input
                    type="checkbox"
                    checked={hasMaggot}
                    onChange={(e) => setHasMaggot(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Pengumpulan Minyak Jelantah (UCO):</span>
                  <input
                    type="checkbox"
                    checked={hasUsedOil}
                    onChange={(e) => setHasUsedOil(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
              </div>

              <div className="p-3 bg-teal-950/40 border border-teal-500/20 rounded-xl text-xs text-teal-300/90 leading-relaxed">
                Tip Fasilitator: "Mulai dari 1 dasawisma percontohan (10-15 rumah). Keberhasilan nyata tetangga sebelah jauh lebih persuasif dibanding ceramah di ruang rapat."
              </div>
            </div>

            {/* Simulated Live Results (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Big KPI: Tingkat Keberhasilan Bebas TPA */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Tingkat Tuntas Sampah di Tingkat RT
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
                      {simulatorResult.wasteDiversionRate}% <span className="text-base font-normal text-emerald-400">Selesai di Gang</span>
                    </h4>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Total Timbulan: {simulatorResult.totalMonthlyKg.toLocaleString('id-ID')} kg/bulan
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(simulatorResult.organicMonthlyManaged / simulatorResult.totalMonthlyKg) * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Organik: ${simulatorResult.organicMonthlyManaged} kg`}
                  />
                  <div
                    style={{ width: `${(simulatorResult.anorganicMonthlyManaged / simulatorResult.totalMonthlyKg) * 100}%` }}
                    className="bg-teal-400 h-full"
                    title={`Anorganik: ${simulatorResult.anorganicMonthlyManaged} kg`}
                  />
                  <div
                    style={{ width: `${(simulatorResult.residualMonthlyKg / simulatorResult.totalMonthlyKg) * 100}%` }}
                    className="bg-rose-500/60 h-full"
                    title={`Residu TPA: ${simulatorResult.residualMonthlyKg} kg`}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Organik Terurai ({simulatorResult.organicMonthlyManaged.toLocaleString('id-ID')} kg)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
                    <span>Anorganik Daur Ulang ({simulatorResult.anorganicMonthlyManaged.toLocaleString('id-ID')} kg)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 inline-block" />
                    <span>Residu ke TPS ({simulatorResult.residualMonthlyKg.toLocaleString('id-ID')} kg)</span>
                  </div>
                </div>
              </div>

              {/* Economic & Environmental Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nilai Finansial Kas RT */}
                <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                        Potensi Kas / Nilai Sirkular
                      </span>
                      <DollarSign className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                      Rp {simulatorResult.totalMonthlyEconomicValue.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">/bln</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Kombinasi hasil timbangan bank sampah, pupuk kasgot/kompos, dan setoran minyak jelantah RT.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300/90 font-medium">
                    Setara ~Rp {(simulatorResult.totalMonthlyEconomicValue * 12 / 1000000).toFixed(1)} Juta / Tahun Kas Mandiri
                  </div>
                </div>

                {/* Emisi Metana CO2e yang dicegah */}
                <div className="bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/30 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                        Reduksi Emisi Metana (CO2e)
                      </span>
                      <Leaf className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {simulatorResult.co2eReducedKg.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">kg CO2e</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Gas rumah kaca yang berhasil dicegah dari penumpukan membusuk di gunungan TPA kota.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-300 font-medium">
                    Kontribusi Nyata Aksi Iklim Lokal Tingkat RT
                  </div>
                </div>
              </div>

              {/* Detail Items Table */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-slate-300 mb-2">Rincian Alur Nilai Tambah Komunal:</div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Bank Sampah Anorganik Terjual:</span>
                  <span className="font-mono text-white font-semibold">{simulatorResult.anorganicMonthlyManaged} kg (Rp {simulatorResult.anorganicCashMonthly.toLocaleString('id-ID')})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Pupuk Kompos / Kasgot Maggot Dihasilkan:</span>
                  <span className="font-mono text-white font-semibold">{simulatorResult.compostKgMonthly} kg (Senilai Rp {simulatorResult.compostValueMonthly.toLocaleString('id-ID')})</span>
                </div>
                {hasUsedOil && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Minyak Jelantah Dapur Terkumpul:</span>
                    <span className="font-mono text-white font-semibold">{simulatorResult.usedCookingOilLiters} Liter (Rp {simulatorResult.usedOilCashMonthly.toLocaleString('id-ID')})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 5 LANGKAH COMMUNITY ORGANIZING */}
      {activeTab === 'methodology' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
              Metodologi Pengorganisasian Akar Rumput
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              5 Tahapan Transformasi RT: Dari Pasif Menjadi RT Inovatif Mandiri Sampah
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Panduan langkah demi langkah bagi fasilitator dan Ketua RT untuk menggerakkan warga tanpa konflik, tanpa paksaan, dan berkesinambungan bertahun-tahun.
            </p>
          </div>

          <div className="space-y-6">
            {/* Langkah 1 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row gap-5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 font-black text-xl flex items-center justify-center shrink-0 border border-cyan-500/30">
                01
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">
                    Tahap 1: Pemetaan Sosial (Social Mapping) &amp; Pendekatan Tokoh Kunci
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Durasi: Minggu ke-1
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jangan langsung membuat rapat besar yang sering kali berujung debat kusir. Temui tokoh-tokoh berpengaruh secara informal (ngopi santai atau silaturahmi sore):
                </p>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li><strong>Ibu Ketua PKK / Arisan Dasawisma</strong>: Pemegang kendali kebiasaan dapur dan pemilahan sampah.</li>
                  <li><strong>Ustadz / Pengurus Musholla</strong>: Membantu menggaungkan pesan kebersihan dan sedekah sampah saat kultum Jumat.</li>
                  <li><strong>Ketua Karang Taruna</strong>: Motor penggerak operasional penimbangan dan pemanfaatan maggot.</li>
                  <li><strong>Sesepuh / Tokoh Gang</strong>: Penjaga keharmonisan dan pemberi restu tradisi baru di kampung.</li>
                </ul>
              </div>
            </div>

            {/* Langkah 2 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-teal-500/40 transition-all flex flex-col md:flex-row gap-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 font-black text-xl flex items-center justify-center shrink-0 border border-teal-500/30">
                02
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">
                    Tahap 2: Rembug Warga &amp; Kesepakatan Bersama (Co-Design Solusi)
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-teal-950 text-teal-300 border border-teal-800">
                    Durasi: Minggu ke-2
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gelar pertemuan di pos ronda atau balai warga dengan suasana riang. Bawakan contoh nyata: perlihatkan ember tumpuk yang tidak berbau, botol plastik terpilah, dan simulasi rupiah yang bisa didapat untuk kas santunan.
                </p>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <strong>Kunci Keberhasilan:</strong> Sepakati aturan main secara demokratis. Bukan sanksi denda uang yang diutamakan, melainkan rasa saling menghormati agar jalan gang tidak kumuh dan selokan tidak tersumbat.
                </div>
              </div>
            </div>

            {/* Langkah 3 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 font-black text-xl flex items-center justify-center shrink-0 border border-emerald-500/30">
                03
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">
                    Tahap 3: Peluncuran Pilot Project (1 Gang Percontohan)
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Durasi: Minggu ke-3 s.d. 4
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jangan langsung mewajibkan seluruh RW sekaligus. Pilih 1 RT atau 1 gang kecil yang paling antusias (15-20 rumah). Pastikan mereka berhasil memilah selama 1 bulan penuh dan merasakan manfaat nyata:
                </p>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>Bau sampah dapur hilang sama sekali karena masuk ember tumpuk.</li>
                  <li>Sampah anorganik tertimbang dan menghasilkan uang kas pertama.</li>
                  <li>Dokumentasikan perubahan gang dalam video/foto sebelum dan sesudah untuk dibagikan di grup WhatsApp warga se-RW.</li>
                </ul>
              </div>
            </div>

            {/* Langkah 4 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all flex flex-col md:flex-row gap-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 font-black text-xl flex items-center justify-center shrink-0 border border-amber-500/30">
                04
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">
                    Tahap 4: Replikasi Cepat &amp; Pengukuhan Pengurus Satgas RT
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-800">
                    Durasi: Bulan ke-2
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Setelah bukti sukses terlihat, warga di gang lain akan terdorong mengikuti karena tidak ingin tertinggal (social proof). Terbitkan Surat Keputusan (SK) Ketua RT tentang Susunan Pengurus Bank Sampah &amp; Satgas Zero Waste agar memiliki legitimasi resmi.
                </p>
              </div>
            </div>

            {/* Langkah 5 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row gap-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 font-black text-xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                05
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">
                    Tahap 5: Institusionalisasi, Transparansi Kas &amp; Pesta Panen Warga
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Bulan ke-3 dan Seterusnya
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jaga keberlanjutan dengan ritual komunal yang menyenangkan:
                </p>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li><strong>Pesta Panen Ikan &amp; Sayur</strong> tiap 3 bulan sekali di pos ronda.</li>
                  <li><strong>Penyaluran Santunan Yatim</strong> dari hasil sedekah sampah saat hari besar Islam (Ramadhan / Muharram).</li>
                  <li><strong>Laporan Keuangan Transparan</strong> via Google Sheets / PDF sederhana di grup WA RT setiap akhir bulan.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 6 INOVASI RT/RW UNGGULAN */}
      {activeTab === 'innovations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                Katalog Model Aksi Lapangan
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                6 Program Inovasi "RT RW Inovatif" Siap Adaptasi
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Dapat langsung diterapkan sesuai karakteristik warga di RT Anda (perumahan padat, kampung gang sempit, atau kompleks kluster).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INNOVATION_PROGRAMS.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-amber-300/90 font-medium mt-1 leading-relaxed">
                    {item.tagline}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 block mb-1">Mekanisme Kerja:</span>
                      <ol className="space-y-1 list-decimal list-inside text-slate-300 text-[11px]">
                        {item.mechanism.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 mt-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Dampak Terukur:</span>
                      <span className="text-emerald-400 font-semibold text-xs">{item.impactBenefit}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1">
                  <div className="text-slate-400">
                    <strong>Pihak Terlibat:</strong> {item.rolesInvolved.join(', ')}
                  </div>
                  <div className="text-teal-300/90 italic mt-1">
                    "{item.wisdom}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TOOLKIT SOP & DRAFT SK RT */}
      {activeTab === 'templates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400">
              Perangkat Administrasi Siap Pakai
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Toolkit SOP, Draf Surat Keputusan (SK) RT &amp; Naskah WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Tinggal salin (copy) dan sesuaikan nama RT/RW Anda. Mempercepat pengurus RT untuk segera memulai program secara legal, terstruktur, dan transparan.
            </p>
          </div>

          <div className="space-y-6">
            {/* Template 1: Pesan Siaran WhatsApp RT */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Naskah Siaran WhatsApp RT: Peluncuran Sedekah Sampah &amp; Pilah Dapur</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Bahasa santun, guyub, dan menyentuh hati warga tanpa kesan menggurui.</p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      'wa-template',
                      `*Bismillahirrohmanirrohim.*
*Assalamu'alaikum Warahmatullahi Wabarakatuh,*
Selamat pagi/siang Bapak, Ibu, dan Sahabat Warga RT... tercinta. 🌿

Semoga kita sekeluarga senantiasa diberikan kesehatan dan keberkahan rezeki.

Demi menciptakan lingkungan gang kita yang bersih, sejuk, bebas bau, dan bernilai pahala sedekah, Pengurus RT bersama Ibu-Ibu Dasawisma & Karang Taruna meluncurkan inisiatif:
*GERAKAN RT MANDIRI: SAMPAH SELESAI DI RT & SEDEKAH SAMPAH BERKAH* ♻️

Mulai pekan ini, mohon dukungan seluruh warga untuk memilah sampah menjadi 2 wadah sederhana di rumah:
1. *Wadah Organik (Sisa Sayur/Buah/Nasi)*: Mohon dimasukkan ke ember terpisah untuk diolah menjadi pupuk POC & pakan lele komunal RT.
2. *Wadah Sedekah Sampah (Kardus, Botol Plastik, Kaleng bersih)*: Akan dijemput oleh adik-adik Karang Taruna setiap 2 pekan sekali.

*100% HASIL PENJUALAN SEDEKAH SAMPAH* akan disalurkan untuk kas santunan anak yatim/dhuafa warga RT kita tercinta dan bantuan pengobatan warga yang membutuhkan.

Mari kita ubah sampah rumah tangga menjadi sumber berkah dan ladang jariyah bersama.
_"Kebersihan itu sebagian dari Iman."_

Atas perhatian, kebaikan, dan gotong royong Bapak/Ibu sekalian, kami haturkan terima kasih sebesar-besarnya.

Hormat kami,
*Pengurus RT ... / RW ...*`
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  {copiedTemplateId === 'wa-template' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Naskah WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
{`*Bismillahirrohmanirrohim.*
*Assalamu'alaikum Warahmatullahi Wabarakatuh,*
Selamat pagi/siang Bapak, Ibu, dan Sahabat Warga RT... tercinta. 🌿

Semoga kita sekeluarga senantiasa diberikan kesehatan dan keberkahan rezeki.

Demi menciptakan lingkungan gang kita yang bersih, sejuk, bebas bau, dan bernilai pahala sedekah, Pengurus RT bersama Ibu-Ibu Dasawisma & Karang Taruna meluncurkan inisiatif:
*GERAKAN RT MANDIRI: SAMPAH SELESAI DI RT & SEDEKAH SAMPAH BERKAH* ♻️

Mulai pekan ini, mohon dukungan seluruh warga untuk memilah sampah menjadi 2 wadah sederhana di rumah:
1. *Wadah Organik (Sisa Sayur/Buah/Nasi)*: Mohon dimasukkan ke ember terpisah untuk diolah menjadi pupuk POC & pakan lele komunal RT.
2. *Wadah Sedekah Sampah (Kardus, Botol Plastik, Kaleng bersih)*: Akan dijemput oleh adik-adik Karang Taruna setiap 2 pekan sekali.

*100% HASIL PENJUALAN SEDEKAH SAMPAH* akan disalurkan untuk kas santunan anak yatim/dhuafa warga RT kita tercinta dan bantuan pengobatan warga yang membutuhkan.

Mari kita ubah sampah rumah tangga menjadi sumber berkah dan ladang jariyah bersama.
_"Kebersihan itu sebagian dari Iman."_

Atas perhatian, kebaikan, dan gotong royong Bapak/Ibu sekalian, kami haturkan terima kasih sebesar-besarnya.

Hormat kami,
*Pengurus RT ... / RW ...*`}
              </pre>
            </div>

            {/* Template 2: Draf SK Pengurus Bank Sampah & Satgas Zero Waste */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Draf Keputusan Ketua RT: Pembentukan Satgas RT Merdeka Sampah</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Dasar hukum komunal penetapan struktur tim pengelola, penimbang, dan bendahara kas.</p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      'sk-template',
                      `SURAT KEPUTUSAN KETUA RUKUN TETANGGA ... / RW ...
Nomor: ... / SK-RT / ... / 2026

TENTANG:
PEMBENTUKAN SATUAN TUGAS (SATGAS) KEMANDIRIAN LINGKUNGAN
DAN PENGURUS UNIT BANK SAMPAH SWADAYA RT ...

Menimbang:
a. Bahwa kebersihan, kesehatan, dan kelestarian lingkungan adalah tanggung jawab bersama seluruh warga RT ...;
b. Bahwa untuk mewujudkan kemandirian pengelolaan sampah dari sumber dan mengurangi beban TPA kota, diperlukan kelembagaan penggerak di tingkat rukun tetangga.

Mengingat:
1. UU No. 18 Tahun 2008 tentang Pengelolaan Sampah;
2. Hasil Rembug Musyawarah Warga RT ... tertanggal ...

MEMUTUSKAN:
Menetapkan:
Pertama : Membentuk Satgas Kemandirian Lingkungan & Unit Bank Sampah RT ... dengan susunan:
  1. Penanggung Jawab : Ketua RT ...
  2. Koordinator Lapangan : (Nama Kader / Karang Taruna)
  3. Seksi Edukasi & Pilah Dapur : (Nama Ketua Dasawisma)
  4. Seksi Logistik & Penimbangan : (Nama Pemuda)
  5. Bendahara Transparansi Kas : (Nama Bendahara)

Kedua   : Satgas bertugas mengkoordinasikan pemilahan sampah organik, penjemputan sedekah sampah anorganik, dan pengelolaan minyak jelantah.
Ketiga  : Seluruh penerimaan dana dicatat secara terbuka dan dilaporkan setiap bulan ke seluruh warga.

Ditetapkan di: ...
Pada tanggal : ...
Ketua RT ...`
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  {copiedTemplateId === 'sk-template' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Draf SK RT</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
{`SURAT KEPUTUSAN KETUA RUKUN TETANGGA ... / RW ...
Nomor: ... / SK-RT / ... / 2026

TENTANG:
PEMBENTUKAN SATUAN TUGAS (SATGAS) KEMANDIRIAN LINGKUNGAN
DAN PENGURUS UNIT BANK SAMPAH SWADAYA RT ...

Menimbang:
a. Bahwa kebersihan, kesehatan, dan kelestarian lingkungan adalah hak dan kewajiban bersama seluruh warga;
b. Bahwa penanganan sampah selesai di hulu (RT) meningkatkan kesehatan masyarakat dan bernilai ekonomi sosial.

MEMUTUSKAN:
1. Membentuk Satgas Lingkungan & Bank Sampah Mandiri RT ...
2. Menetapkan jadwal penjemputan berkala sampah terpilah setiap 2 pekan sekali.
3. Mengalokasikan 100% hasil sedekah sampah untuk dana sosial dan beasiswa anak prasejahtera warga RT.

Ditetapkan di: ...
Ketua RT ...`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT KESIAPAN RT MERDEKA SAMPAH */}
      {activeTab === 'assessment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
                Self-Assessment Readiness Check
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Audit Mandiri Kesiapan RT Merdeka Sampah
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Centang kondisi riil di RT Anda saat ini untuk mengetahui tingkat kesiapan dan rekomendasi tindakan berikutnya.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center shrink-0 self-start md:self-auto">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Skor Kesiapan:</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {auditTotalScore} <span className="text-sm font-normal text-slate-400">/ 7 Indikator</span>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'q1',
                title: '1. Komitmen Pengurus RT & Tokoh Kunci',
                desc: 'Ketua RT, Ibu Dasawisma, dan Pemuda Karang Taruna satu suara mendukung inisiatif pemilahan sampah.',
              },
              {
                key: 'q2',
                title: '2. Ketersediaan Saluran Komunikasi Aktif',
                desc: 'Memiliki WhatsApp Group RT atau rapat bulanan arisan yang rutin dihadiri mayoritas perwakilan keluarga.',
              },
              {
                key: 'q3',
                title: '3. Titik Penampungan / Transit Terpusat',
                desc: 'Tersedia sudut aman (teras balai RT, samping pos ronda, atau gudang kecil) untuk menaruh timbangan dan karung pilah.',
              },
              {
                key: 'q4',
                title: '4. Sarana Pengolahan Organik Sederhana',
                desc: 'Terdapat minimal 5 komposter ember tumpuk atau 10 lubang biopori yang aktif digunakan warga gang.',
              },
              {
                key: 'q5',
                title: '5. Kemitraan Pengepul Daur Ulang / Biodiesel',
                desc: 'Sudah memiliki kontak pengepul kardus/botol atau penyalur biodiesel jelantah yang siap jemput berkala.',
              },
              {
                key: 'q6',
                title: '6. Pembukuan & Rekening Kas Transparan',
                desc: 'Ada bendahara khusus yang mencatat setiap gram sampah dan rupiah hasil penjualan yang dapat dilihat seluruh warga.',
              },
              {
                key: 'q7',
                title: '7. Alokasi Manfaat Sosial Nyata',
                desc: 'Hasil sirkularitas sudah pernah disalurkan (misal sembako dhuafa, beasiswa sekolah, atau santunan lansia).',
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleAudit(item.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  auditScores[item.key]
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                    auditScores[item.key]
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {auditScores[item.key] && <Check className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Hasil Skor */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Evaluasi Kesiapan:
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {auditTotalScore >= 6
                  ? '🌟 Kategori Unggul: RT Anda Siap Menjadi Contoh RT Inovatif Percontohan Nasional!'
                  : auditTotalScore >= 4
                  ? '🌱 Kategori Berkembang: Fondasi Kuat Terbentuk, Segera Lengkapi Kemitraan Pengepul & SK RT.'
                  : '⏳ Kategori Awal: Mulai dari Tahap 1 (Pemetaan Tokoh & Obrolan Kopi Informal).'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {auditTotalScore >= 6
                  ? 'Segera ajukan wilayah RT Anda ke Dinas Lingkungan Hidup untuk mendapatkan sertifikasi Kampung Proklim Lestari.'
                  : 'Fokuskan energi pada sosialisasi 1 gang percontohan terlebih dahulu sebelum melangkah ke skala luas.'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('templates')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shrink-0 shadow-md flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <span>Buka Draf SK &amp; Naskah WA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
