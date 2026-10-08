import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Recycle,
  Home,
  Droplets,
  Sun,
  Wind,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  Calendar,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  AlertTriangle,
  TrendingUp,
  Layers,
  Users,
  ChevronDown,
  ChevronUp,
  Waves,
  Heart,
  Info,
  Check,
  Zap,
  Clock,
  Compass,
} from 'lucide-react';

type EduTab = 'all' | 'architecture' | 'zerowaste' | 'edufarm' | 'calculator' | 'actionplan';

interface EcoProject {
  id: string;
  category: 'architecture' | 'zerowaste' | 'edufarm';
  categoryLabel: string;
  title: string;
  subtitle: string;
  tagline: string;
  difficulty: 'Sangat Mudah' | 'Mudah' | 'Menengah';
  estCost: string;
  timeframe: string;
  impactScore: string;
  problemSolved: string;
  materials: string[];
  steps: string[];
  tips: string;
  islamicWisdom: string;
  badge: string;
}

const ECO_PROJECTS: EcoProject[] = [
  // 1. SURVIVAL ARCHITECTURE INDONESIA
  {
    id: 'arch-cross-vent',
    category: 'architecture',
    categoryLabel: 'Survival Architecture Indonesia',
    title: 'Ventilasi Silang Alami & Solar Chimney Bambu',
    subtitle: 'Solusi Gerah & Panas Ekstrem Rumah Gang Tanpa AC',
    tagline: 'Mendinginkan hunian gang 3°C - 5°C dengan sirkulasi termal alami',
    difficulty: 'Mudah',
    estCost: 'Rp 75.000 - Rp 150.000',
    timeframe: '1 Hari Kerja',
    impactScore: 'Hemat Listrik 35% - 45%',
    problemSolved: 'Rumah gang padat minim jendela samping, pengap, dan boros listrik kipas/AC.',
    materials: [
      '2-3 Batang bambu petung/ori diameter 10-12 cm (dibelah & dibersihkan sekatnya)',
      'Kawat kasa nyamuk stainless / aluminium',
      'Pipa PVC 4 inch atau talang seng bekas',
      'Lem silikon tahan cuaca & paku rivet',
    ],
    steps: [
      'Identifikasi titik tertinggi plafon rumah atau sambungan atap seng/asbes yang menahan panas.',
      'Buat bukaan vertikal seukuran bambu (cerobong termal) mengarah ke sisi teduh.',
      'Pasang bilah bambu sebagai insulasi termal alami di bawah plafon untuk memecah radiasi seng.',
      'Tutup ujung cerobong atas dengan kasa kawat nyamuk dan topi penahan tempias air hujan.',
      'Buka lubang ventilasi bawah (dekat lantai pintu gang) agar udara sejuk tersedot menggantikan udara panas yang naik.',
    ],
    tips: 'Padukan dengan tanaman merambat sirih gading di dinding depan gang untuk menyaring debu dan mendinginkan angin masuk.',
    islamicWisdom: 'Rasulullah SAW menganjurkan rumah yang lapang dan sejuk, serta melarang menyakiti diri dengan pemborosan berlebih (Israf).',
    badge: 'Adaptasi Iklim Tropis',
  },
  {
    id: 'arch-rain-harvest',
    category: 'architecture',
    categoryLabel: 'Survival Architecture Indonesia',
    title: 'Pemanen Air Hujan (Rainwater Harvesting) Gravitasi Gang',
    subtitle: 'Cadangan Air Bersih Mandiri & Anti Krisis Kemarau',
    tagline: 'Mengubah limpasan air genteng menjadi cadangan air wudhu, siram, dan cuci',
    difficulty: 'Menengah',
    estCost: 'Rp 180.000 - Rp 350.000',
    timeframe: '1 - 2 Hari',
    impactScore: 'Simpan 500L Air / Musim',
    problemSolved: 'Kekeringan saat kemarau dan beban genangan saluran drainase gang saat hujan lebat.',
    materials: [
      'Drum / tong plastik biru bekas 150 - 200 liter',
      'Pipa PVC 3 inch & sambungan T/elbow',
      'Kran air kuningan atau plastik 1/2 inch',
      'Media filter bertingkat: busa filter, arang aktif kelapa, pasir silika, kerikil zeolit',
      'Kain kasa penahan jentik nyamuk',
    ],
    steps: [
      'Hubungkan pipa talang air genteng ke tabung pengendap pertama (first-flush diverter) untuk membuang debu awal hujan.',
      'Alirkan air hujan bersih lanjutan ke tabung filter bertingkat (kerikil → pasir → arang kelapa).',
      'Tampung air hasil filtrasi ke tong drum penampung utama yang ditinggikan 30-50 cm dari lantai agar memiliki tekanan gravitasi.',
      'Pasang kran pada bagian bawah dan saluran pelimpah (overflow) diarahkan ke lubang biopori pekarangan.',
      'Tutup drum dengan rapat dan tambahkan kasa nyamuk pada lubang sirkulasi udara.',
    ],
    tips: 'Bilas tandon 3 bulan sekali. Air ini sangat segar untuk menyiram tanaman vertikultur dan kolam ikan lele karena bebas kaporit.',
    islamicWisdom: '"Dan Kami turunkan dari langit air yang suci menyucikan..." (QS. Al-Furqan: 48). Memuliakan setiap tetes nikmat hujan.',
    badge: 'Kemandirian Air Bersih',
  },
  {
    id: 'arch-rain-garden',
    category: 'architecture',
    categoryLabel: 'Survival Architecture Indonesia',
    title: 'Taman Hujan (Rain Garden) & Sumur Resapan Gang Sempit',
    subtitle: 'Solusi Cerdas Menolak Banjir Lokal di Pemukiman Padat',
    tagline: 'Cegah banjir gang dengan menyerapkan 100% genangan kembali ke tanah air',
    difficulty: 'Mudah',
    estCost: 'Rp 50.000 - Rp 120.000',
    timeframe: 'Setengah Hari (Kerja Bakti RT)',
    impactScore: 'Resapkan 80% Genangan',
    problemSolved: 'Air hujan menggenangi lantai rumah gang akibat permukaan tanah tertutup semen total.',
    materials: [
      'Pecahan bata merah & batu kerikil kali',
      'Ijuk aren atau kain geotekstil',
      'Tanaman penyerap air tinggi: pandan wangi, rumput payung, lili paris, alang-alang hias',
      'Kompos organik gembur',
    ],
    steps: [
      'Pilih ceruk atau sudut ujung gang tempat air hujan biasa mengendap.',
      'Gali cekungan sedalam 40-60 cm dengan diameter 80-100 cm.',
      'Isi dasar galian dengan kerikil dan pecahan batu bata setebal 15 cm sebagai kantong retensi air.',
      'Lapisi ijuk/kasa, lalu timbun dengan tanah subur berpasir dan kompos.',
      'Tanam tanaman penyerap air lokal yang akarnya mempercepat laju infiltrasi air ke akuifer tanah.',
    ],
    tips: 'Dapat digabungkan di depan gang dekat pos ronda sehingga selain bebas banjir, gang menjadi asri dan beraroma pandan segar.',
    islamicWisdom: 'Menyingkirkan marabahaya (genangan banjir dan lumpur) dari jalan adalah salah satu cabang iman yang mulia.',
    badge: 'Pertahanan Banjir',
  },

  // 2. RT MANDIRI • ZERO WASTE
  {
    id: 'zw-ember-tumpuk',
    category: 'zerowaste',
    categoryLabel: 'RT Mandiri • Zero Waste',
    title: 'Komposter Ember Tumpuk Dapur Tanpa Bau (POC & Padat)',
    subtitle: 'Hentikan Sampah Sisa Makanan Masuk TPA dari Meja Dapur',
    tagline: 'Ubah sisa sayur, kulit buah, dan nasi basi jadi Pupuk Organik Cair (POC) bernilai emas',
    difficulty: 'Sangat Mudah',
    estCost: 'Rp 40.000 - Rp 80.000',
    timeframe: '2 Jam Pembuatan',
    impactScore: 'Kurangi 60% Sampah Dapur',
    problemSolved: 'Bau busuk sampah basah di gang dan emisi gas metana pembakar lapisan ozon di TPA.',
    materials: [
      '2 buah ember cat bekas kapasitas 20-25 kg (bersihkan)',
      '1 kran plastik kecil (tipe galon air)',
      'Solder / bor untuk membuat lubang pori-pori halus',
      'Cairan starter EM4 atau air cucian beras pertama + molase/gula merah',
    ],
    steps: [
      'Lubangi dasar ember atas dengan bor/solder halus diameter 3-5 mm sebagai saringan lindi cairan.',
      'Pasang kran pada ember bawah sekitar 5 cm dari dasar untuk memanen cairan POC.',
      'Tumpuk ember atas ke dalam ember bawah secara pas dan kedap lalat.',
      'Masukkan sampah organik dapur (cacah kecil sisa sayur/buah). Taburi sedikit sekam bakar/dedak dan percikkan starter EM4.',
      'Tutup rapat ember atas. Dalam 10-14 hari, cairan POC di ember bawah siap dipanen dan diencerkan 1:20 untuk tanaman.',
    ],
    tips: 'Hindari memasukkan minyak goreng bekas, plastik, dan tulang besar. Jangan biarkan lalat bertelur dengan selalu menutup rapat.',
    islamicWisdom: '"Janganlah kamu berbuat kerusakan di muka bumi sesudah (Allah) memperbaikinya..." (QS. Al-A\'raf: 56).',
    badge: 'Ekonomi Sirkular Dapur',
  },
  {
    id: 'zw-biopori-gang',
    category: 'zerowaste',
    categoryLabel: 'RT Mandiri • Zero Waste',
    title: 'Gerakan 1 Rumah 2 Biopori: Pengurai Daun & Resapan',
    subtitle: 'Lumbung Humus Tanah di Lorong Paving Gang',
    tagline: 'Pipa resapan silinder yang membalikkan kesuburan tanah dan mengendalikan genangan',
    difficulty: 'Mudah',
    estCost: 'Rp 30.000 / Titik',
    timeframe: '30 Menit / Titik',
    impactScore: 'Resap 100L/Jam + Humus Kompos',
    problemSolved: 'Sampah dedaunan dibakar (menghasilkan asap beracun karsinogenik) dan air selokan meluap.',
    materials: [
      'Pipa PVC 4 inch sepanjang 80-100 cm',
      'Tutup pipa (dop) berpori',
      'Bor tangan / solder untuk melubangi dinding pipa',
      'Bor tanah biopori / linggis',
    ],
    steps: [
      'Lubangi sekeliling dinding pipa PVC dengan bor jarak 5 cm sebagai jalan keluar masuk cacing tanah.',
      'Bor lubang tegak lurus pada tanah atau sela konblok/paving gang sedalam 80-100 cm.',
      'Masukkan pipa berlubang hingga bibir pipa rata dengan permukaan tanah agar tidak mengganggu pejalan kaki.',
      'Masukkan sampah daun kering, sisa kulit buah, dan potongan rumput hingga penuh.',
      'Tutup dengan dop berlubang. Biarkan cacing dan mikroorganisme mengurai sampah menjadi kompos hitam pekat dalam 2 bulan.',
    ],
    tips: 'Panen kompos dengan alat penjepit spiral biopori. Kompos ini sangat subur untuk media tanam pot sayuran.',
    islamicWisdom: 'Menyuburkan tanah yang mati adalah sedekah jariyah ekologis yang terus mengalirkan pahala kebaikan.',
    badge: 'Resapan Lingkungan',
  },
  {
    id: 'zw-maggot-bsf',
    category: 'zerowaste',
    categoryLabel: 'RT Mandiri • Zero Waste',
    title: 'Biokonversi Maggot BSF (Black Soldier Fly) Skala RT',
    subtitle: 'Mesin Hayati Pengurai Sampah Tercepat Tanpa Bau',
    tagline: '1 kg larva maggot melahap 3-5 kg sampah organik per hari dan jadi pakan ikan/unggas gratis',
    difficulty: 'Menengah',
    estCost: 'Rp 100.000 - Rp 200.000',
    timeframe: '3 Hari Setup Kandang',
    impactScore: 'Pengurai 100kg Sampah/Bulan',
    problemSolved: 'Penumpukan sisa makanan catering/warung makan RT yang cepat membusuk dan memancing tikus.',
    materials: [
      'Kotak plastik / baki biopond pembesaran (tinggi 15-20 cm)',
      'Jaring paranet untuk kandang lalat BSF dewasa',
      'Media atraktan sisa buah manis untuk memancing indukan bertelur',
      'Bibit telur maggot BSF (5-10 gram)',
    ],
    steps: [
      'Tetaskan telur BSF di atas media dedak lembap selama 3-4 hari hingga menjadi baby larva.',
      'Pindahkan baby larva ke biopond pembesaran di sudut posyandu atau dekat bank sampah RT.',
      'Beri pakan harian berupa sisa makanan basah, nasi basi, sisa sayur, dan buah yang telah dicacah.',
      'Maggot akan menghabiskan makanan dalam hitungan jam tanpa menimbulkan bau busuk menyengat.',
      'Panen pre-pupa usia 15-18 hari untuk pakan lele kolam budikdamber atau unggas peliharaan warga.',
    ],
    tips: 'Lalat BSF bukan lalat hijau pembawa penyakit; BSF tidak memiliki mulut penggigit dan tidak hinggap di makanan manusia.',
    islamicWisdom: 'Hikmah penciptaan serangga pengurai sebagai bukti keadilan siklus alam ciptaan Allah SWT.',
    badge: 'Bio-Konversi Protein',
  },

  // 3. ECO EDUFARM INDONESIA
  {
    id: 'farm-budikdamber',
    category: 'edufarm',
    categoryLabel: 'Eco EduFarm Indonesia',
    title: 'Budikdamber: Kolam Lele + Kangkung Aquaponik Ember',
    subtitle: 'Lumbung Protein Ikan Segar & Sayuran di Sudut Teras',
    tagline: 'Hanya butuh 0.5 meter persegi: panen 50 ekor lele sehat dan puluhan ikat kangkung segar',
    difficulty: 'Sangat Mudah',
    estCost: 'Rp 95.000 - Rp 150.000',
    timeframe: '1 Jam Instalasi',
    impactScore: 'Panen Tiap 21 Hari',
    problemSolved: 'Ketergantungan belanja pasar harian, ketiadaan lahan terbuka untuk budidaya, dan risiko stunting anak.',
    materials: [
      'Ember plastik 80 liter dengan tutupnya',
      '10-12 buah gelas plastik air mineral bekas',
      'Kawat ram / pengait kawat',
      'Arang kayu / sekam bakar sebagai media tanam kangkung',
      '50-60 ekor bibit ikan lele ukuran 7-9 cm & benih kangkung darat',
    ],
    steps: [
      'Lubangi bagian samping tutup ember dan gantungkan gelas plastik yang telah dilubangi bawahnya.',
      'Isi gelas dengan arang kayu dan taburkan 8-10 butir benih kangkung di tiap gelas.',
      'Isi ember dengan air sumur/air hujan endapan sebanyak 60-70 liter, diamkan 2 hari agar stabil.',
      'Masukkan bibit lele yang sudah diaklimatisasi suhu. Pasang kran buang di dasar untuk siphon kotoran lele.',
      'Akar kangkung akan menyerap amonia dari kotoran lele sebagai pupuk alami; air kolam tetap jernih dan lele tumbuh sehat!',
    ],
    tips: 'Kangkung bisa dipanen potong pertama di hari ke-14 dan bertunas kembali 3-4 kali. Lele siap panen konsumsi di hari ke-60.',
    islamicWisdom: 'Menanam tumbuhan yang hasilnya dimakan oleh manusia, burung, atau hewan terhitung sebagai sedekah (HR. Bukhari & Muslim).',
    badge: 'Ketahanan Pangan Keluarga',
  },
  {
    id: 'farm-vertikultur-dinding',
    category: 'edufarm',
    categoryLabel: 'Eco EduFarm Indonesia',
    title: 'Vertikultur Dinding Paralon & Talang Gantung Lorong Gang',
    subtitle: 'Sulap Tembok Gersang Menjadi Apotek & Sayur Hidup',
    tagline: 'Memaksimalkan bidang tegak gang tanpa mengganggu akses jalan pejalan kaki & motor',
    difficulty: 'Mudah',
    estCost: 'Rp 65.000 - Rp 130.000',
    timeframe: 'Setengah Hari',
    impactScore: '24 Lubang Tanam / Meter',
    problemSolved: 'Ketiadaan pekarangan tanah di pemukiman padat dan harga cabai rawit/bawang yang sering fluktuatif.',
    materials: [
      'Pipa PVC 4 inch panjang 1.5 - 2 meter atau talang kotak PVC',
      'Media tanam: campuran tanah hitam, sekam bakar, dan kompos kascing perbandingan 1:1:1',
      'Benih cabai rawit, sawi pakcoy, selada keriting, seledri, daun bawang',
      'Klem pipa dinding & paku fisher beton',
    ],
    steps: [
      'Buat pola lubang tanam selang-seling berjarak 15-20 cm pada pipa PVC menggunakan heat gun / pisau panas.',
      'Pasang klem besi kokoh pada dinding tembok gang yang terkena sinar matahari minimal 4 jam sehari.',
      'Isi pipa vertikal dengan media tanam gembur kaya nutrisi organik.',
      'Pindahkan bibit sayuran semai yang sudah berdaun 4 ke setiap lubang tanam.',
      'Siram rutin pagi hari dengan semprotan air atau pasang sistem tetes infus sederhana dari botol bekas.',
    ],
    tips: 'Cat pipa paralon dengan warna putih atau warna cerah ceria agar gang tampak rapi, artistik, dan memantulkan panas berlebih.',
    islamicWisdom: 'Pemanfaatan ruang kosong untuk kemaslahatan bersama adalah manifestasi akhlak mulia dan kecintaan pada keindahan.',
    badge: 'Urban Micro-Farming',
  },
  {
    id: 'farm-microgreens-jendela',
    category: 'edufarm',
    categoryLabel: 'Eco EduFarm Indonesia',
    title: 'Microgreens Nutrisi Super & Kascing (Vermikompos)',
    subtitle: 'Panen Sayuran Kaya Vitamin di Kusen Jendela Dapur',
    tagline: 'Superfood konsentrasi gizi 9x lebih padat, panen kilat hanya dalam 7-10 hari',
    difficulty: 'Sangat Mudah',
    estCost: 'Rp 25.000 - Rp 50.000',
    timeframe: '15 Menit Semai',
    impactScore: 'Panen Nutrisi Tiap 7 Hari',
    problemSolved: 'Kekurangan asupan vitamin & gizi segar keluarga dan anak-anak balita.',
    materials: [
      'Baki plastik makanan / nampan cetakan kue bekas',
      'Media tanam: cocopeat halus, tisu basah tebal, atau kascing cacing lumbricus',
      'Benih bayam merah, lobak, brokoli, bunga matahari, atau kacang polong (pea shoots)',
      'Botol semprot air bersih (spray)',
    ],
    steps: [
      'Ratakan media tanam setebal 2-3 cm di atas baki berlubang drainase halus.',
      'Rendam benih selama 4-6 jam untuk memecah masa dormansi.',
      'Taburkan benih secara rapat dan merata di permukaan media.',
      'Semprot embun halus dengan air bersih dan tutup dengan nampan gelap selama 2 hari masa blackout.',
      'Setelah berkecambah, buka penutup dan letakkan di dekat jendela yang terang. Panen hari ke-7 dengan menggunting pangkal batang.',
    ],
    tips: 'Rasa microgreens sangat renyah, segar, manis, dan kaya antioksidan tinggi. Sangat lezat dicampurkan ke telur dadar atau mie kuah.',
    islamicWisdom: '"Makanlah dari rezeki yang baik yang telah Kami berikan kepadamu..." (QS. Al-Baqarah: 172). Menjaga kesehatan jasmani keluarga.',
    badge: 'Superfood Rumahan',
  },
];

interface PlanetCrisisEducationViewProps {
  onNavigateToCommunityDev?: () => void;
}

export const PlanetCrisisEducationView: React.FC<PlanetCrisisEducationViewProps> = ({
  onNavigateToCommunityDev,
}) => {
  const [activeTab, setActiveTab] = useState<EduTab>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Interactive Calculator State
  const [familyCount, setFamilyCount] = useState<number>(35); // KK di RT
  const [wasteReductionRate, setWasteReductionRate] = useState<number>(60); // % pemilahan aktif

  // Action Pledge Form State
  const [pledgeName, setPledgeName] = useState('');
  const [pledgeRt, setPledgeRt] = useState('RT 03 / RW 07');
  const [pledgeAction, setPledgeAction] = useState('Komposter Ember Tumpuk & Pemilahan Dapur');
  const [pledgeSubmitted, setPledgeSubmitted] = useState(false);

  // Dynamic Calculator Computations
  const calculatorResults = useMemo(() => {
    // Rata-rata timbulan sampah per keluarga per hari di Indonesia: ~2.5 kg (60% organik = 1.5 kg)
    const organicWastePerFamilyPerDay = 1.5;
    const monthlyOrganicKg = Math.round(
      familyCount * organicWastePerFamilyPerDay * 30 * (wasteReductionRate / 100)
    );

    // Pupuk organik yang dihasilkan: ~30% dari berat sampah organik
    const compostKgGenerated = Math.round(monthlyOrganicKg * 0.35);

    // Penghematan belanja pupuk & sembako sayur (asumsi Rp 15.000 / kg sayur/pupuk)
    const rupiahSavedPerMonth = monthlyOrganicKg * 8500;

    // Reduksi emisi metana CO2e (1 kg sampah organik di TPA = ~0.6 kg CO2e)
    const co2ReductionKg = Math.round(monthlyOrganicKg * 0.62);

    // Potensi panen lele & kangkung jika 30% KK punya budikdamber
    const budikdamberHouseholds = Math.max(1, Math.round(familyCount * 0.3));
    const fishYieldPerCycle = budikdamberHouseholds * 45; // ekor lele
    const vegetableBunchesPerMonth = budikdamberHouseholds * 16; // ikat kangkung

    return {
      monthlyOrganicKg,
      compostKgGenerated,
      rupiahSavedPerMonth,
      co2ReductionKg,
      budikdamberHouseholds,
      fishYieldPerCycle,
      vegetableBunchesPerMonth,
    };
  }, [familyCount, wasteReductionRate]);

  const filteredProjects = useMemo(() => {
    return ECO_PROJECTS.filter((project) => {
      const matchesCategory =
        activeTab === 'all' ||
        (activeTab === 'architecture' && project.category === 'architecture') ||
        (activeTab === 'zerowaste' && project.category === 'zerowaste') ||
        (activeTab === 'edufarm' && project.category === 'edufarm');

      const matchesSearch =
        searchFilter.trim() === '' ||
        project.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchFilter.toLowerCase()) ||
        project.categoryLabel.toLowerCase().includes(searchFilter.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchFilter]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return ECO_PROJECTS.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId]);

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) return;
    setPledgeSubmitted(true);
    setTimeout(() => {
      setPledgeSubmitted(false);
      setPledgeName('');
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" id="education-planet-crisis">
      {/* Hero Banner: Dari Gang Kecil untuk Indonesia */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Pencegah Krisis Planet • Edukasi Aksi Iklim Lapangan</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Dari Gang Kecil untuk Indonesia: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Gerakan Kemandirian Pangan &amp; Solusi Iklim Berbasis RT
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menyelamatkan bumi tidak harus menunggu proyek bernilai triliunan rupiah. Melalui inovasi
            <strong> Survival Architecture</strong>, <strong>Zero Waste Komunal</strong>, dan <strong>Eco EduFarm</strong> di pekarangan mikro, warga Indonesia di gang-gang sempit mampu menjadi garda terdepan penahan krisis iklim dunia.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/40 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-slate-400 block text-[11px]">Potensi Pengurangan</span>
              <strong className="text-emerald-400 font-mono text-sm sm:text-base font-black">
                60% - 80%
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Sampah Organik RT</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-slate-400 block text-[11px]">Suhu Mikro Gang</span>
              <strong className="text-teal-300 font-mono text-sm sm:text-base font-black">
                Turun 3°C - 5°C
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Dengan Kanopi Vertikal</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-slate-400 block text-[11px]">Kemandirian Pangan</span>
              <strong className="text-amber-300 font-mono text-sm sm:text-base font-black">
                Panen 21 Hari
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Lele &amp; Sayur Kangkung</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
              <span className="text-slate-400 block text-[11px]">Modal Awal</span>
              <strong className="text-emerald-300 font-mono text-sm sm:text-base font-black">
                Mulai Rp 25 Ribu
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Daur Ulang Ember Bekas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Link Callout to Community Development Expert */}
      {onNavigateToCommunityDev && (
        <div
          onClick={onNavigateToCommunityDev}
          className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/80 border border-teal-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-teal-400 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                  MODUL KHUSUS PENGURUS RT / RW
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  🌿 RT/RW Inovatif • ♻️ Sampah Selesai di RT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Ingin mewujudkan gerakan di seluruh lingkungan? Buka toolkit fasilitator: 5 tahap rembug warga, sedekah sampah jadi beasiswa, simulator neraca kas RT, dan draf SK siap pakai.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-teal-300 group-hover:text-teal-200 bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-800 self-start sm:self-auto">
            <span>Buka Toolkit RT/RW</span>
            <span>→</span>
          </div>
        </div>
      )}

      {/* Navigation & Section Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 max-w-full">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Semua Inovasi ({ECO_PROJECTS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-teal-400" />
            <span>♻️ Survival Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('zerowaste')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'zerowaste'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Recycle className="w-3.5 h-3.5 text-amber-400" />
            <span>🏘 RT Mandiri Zero Waste</span>
          </button>

          <button
            onClick={() => setActiveTab('edufarm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'edufarm'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>🌱 Eco EduFarm Indonesia</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kalkulator Dampak RT</span>
          </button>

          <button
            onClick={() => setActiveTab('actionplan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'actionplan'
                ? 'bg-rose-700 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>Panduan 30 Hari</span>
          </button>
        </div>

        {/* Quick Search */}
        {(activeTab === 'all' ||
          activeTab === 'architecture' ||
          activeTab === 'zerowaste' ||
          activeTab === 'edufarm') && (
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Cari solusi (misal: ember, lele)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* VIEW: TAB KALKULATOR DAMPAK GANG */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 mb-2">
                <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                <span>Simulasi Interaktif Dampak Nyata RT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Kalkulator Penyelamat Krisis Planet Skala Gang
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Berapa banyak sampah yang dapat dicegah ke TPA, berapa ton gas rumah kaca yang diredam, dan berapa rupiah belanja dapur yang dihemat oleh rukun tetangga Anda?
              </p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono self-start md:self-auto">
              Standar Emisi KLHK &amp; BPS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Controls */}
            <div className="space-y-6 bg-slate-950/70 p-5 sm:p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Parameter Lingkungan RT Anda</span>
              </h4>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Jumlah Kepala Keluarga (KK):</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{familyCount} KK</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={familyCount}
                  onChange={(e) => setFamilyCount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>10 KK (Gang Mini)</span>
                  <span>75 KK (RT Rata-rata)</span>
                  <span>150 KK (Kompleks Padat)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Tingkat Partisipasi Pemilahan Organik:</span>
                  <span className="font-mono font-bold text-teal-400 text-sm">{wasteReductionRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={wasteReductionRate}
                  onChange={(e) => setWasteReductionRate(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>20% (Awal Uji Coba)</span>
                  <span>60% (Mayoritas Sadar)</span>
                  <span>100% (RT Zero Waste Penuh)</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-300/90 leading-relaxed">
                <p className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Bila setiap RT di kota Anda menerapkan pemilahan 60%, TPA lokal akan bertahan 12 tahun lebih lama dan risiko ledakan gas metana dapat ditekan hingga 90%.
                  </span>
                </p>
              </div>
            </div>

            {/* Simulated Live Results (2 Cols) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Sampah Dicegah dari TPA
                    </span>
                    <Recycle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                    {calculatorResults.monthlyOrganicKg.toLocaleString('id-ID')} <span className="text-lg font-normal text-slate-400">kg/bulan</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Sampah basah dan sisa makanan yang terkelola tuntas di gang tanpa harus diangkut truk sampah kota.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-medium">
                  Setara {(calculatorResults.monthlyOrganicKg / 1000).toFixed(2)} Ton / Bulan
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-500/30 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                      Hasil Pupuk Organik Gembur
                    </span>
                    <Sprout className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                    {calculatorResults.compostKgGenerated.toLocaleString('id-ID')} <span className="text-lg font-normal text-slate-400">kg/bulan</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Kompos padat dan pupuk cair organik untuk menyuburkan seluruh pot vertikultur dan tanaman hias gang.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-300 font-medium">
                  100% Organik Bebas Kimia Sintetis
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Nilai Penghematan Warga
                    </span>
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
                    Rp {calculatorResults.rupiahSavedPerMonth.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Penghematan iuran sampah, pembelian pupuk tanaman, dan kebutuhan sayur dapur warga rukun tetangga.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300 font-medium">
                  Ekonomi Mandiri Berputar di Kas RT
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Reduksi Emisi Metana (CO2e)
                    </span>
                    <Wind className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                    {calculatorResults.co2ReductionKg.toLocaleString('id-ID')} <span className="text-lg font-normal text-slate-400">kg CO2e</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Kontribusi langsung warga RT dalam mencegah efek rumah kaca dan pemanasan suhu atmosfer global.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-indigo-300 font-medium">
                  Bukti Nyata Aksi Iklim Lokal ke Panggung Dunia
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TAB RENCANA AKSI 30 HARI */}
      {activeTab === 'actionplan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-2">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>Cetak Biru Transformasi Komunal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Roadmap 30 Hari: Transformasi Gang Gersang Menjadi Kampung Tangguh Iklim
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Langkah praktis per minggu yang mudah dieksekusi bersama pengurus RT, ibu-ibu dasawisma, karang taruna, dan warga sepuh.
            </p>
          </div>

          <div className="space-y-4">
            {/* Minggu 1 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center font-mono text-sm">
                    M1
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Minggu 1: Edukasi Dapur &amp; Pilah 3 Wadah
                    </h4>
                    <p className="text-xs text-emerald-400">Hari ke-1 s.d. Hari ke-7</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
                  Fondasi Mindset Warga
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sosialisasi WhatsApp RT</strong>: Bagikan infografis pemilahan 3 wadah (Organik Dapur, Anorganik Daur Ulang, dan Residu Pembalut/B3).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pengadaan Wadah Terpisah</strong>: Warga menyiapkan 1 ember kecil bekas di bawah bak cuci piring khusus untuk sisa sayur, kulit buah, dan nasi basi.
                  </span>
                </li>
              </ul>
            </div>

            {/* Minggu 2 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-teal-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-black flex items-center justify-center font-mono text-sm">
                    M2
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Minggu 2: Pemasangan Ember Tumpuk &amp; Pengeboran Biopori Gang
                    </h4>
                    <p className="text-xs text-teal-300">Hari ke-8 s.d. Hari ke-14</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-950 text-teal-300 border border-teal-800 self-start sm:self-auto">
                  Aksi Infrastruktur Komunal
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Kerja Bakti Biopori</strong>: Karang taruna mengebor 10-15 lubang biopori pipa paralon 4 inch di sela konblok sepanjang gang.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Distribusi Starter Kompos</strong>: Bagikan cairan starter EM4 atau molase fermentasi ke ibu-ibu pengelola komposter ember tumpuk.
                  </span>
                </li>
              </ul>
            </div>

            {/* Minggu 3 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-sm">
                    M3
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Minggu 3: Instalasi Vertikultur Dinding &amp; Budikdamber Lele
                    </h4>
                    <p className="text-xs text-amber-300">Hari ke-15 s.d. Hari ke-21</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 self-start sm:self-auto">
                  Lumbung Pangan Hidup
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pemasangan Pipa Vertikultur</strong>: Manfaatkan tembok batas gang kosong untuk menaruh 5-10 pipa paralon vertikal cabai rawit &amp; sawi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Penebaran Bibit Lele &amp; Kangkung</strong>: Isi ember 80 liter dengan 50 ekor bibit lele sehat dan benih kangkung di bibir ember.
                  </span>
                </li>
              </ul>
            </div>

            {/* Minggu 4 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white font-black flex items-center justify-center font-mono text-sm">
                    M4
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Minggu 4: Panen Perdana Kangkung &amp; Apresiasi Warga Tangguh
                    </h4>
                    <p className="text-xs text-indigo-300">Hari ke-22 s.d. Hari ke-30</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 self-start sm:self-auto">
                  Panen Bersama &amp; Evaluasi
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Panen Bersama Kangkung Aquaponik</strong>: Pemetikan kangkung pertama untuk dimasak bersama di pos ronda RT.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Panen Pupuk POC Pertama</strong>: Buka kran ember tumpuk untuk memanen cairan pupuk bernutrisi tinggi dan semprotkan ke tanaman vertikultur.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GRID KATALOG INOVASI (Untuk tab 'all', 'architecture', 'zerowaste', 'edufarm') */}
      {activeTab !== 'calculator' && activeTab !== 'actionplan' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Menampilkan <strong>{filteredProjects.length}</strong> panduan inovasi berbasis gang</span>
            <span className="hidden sm:inline">Klik salah satu kartu untuk melihat panduan blueprint lengkap</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Category Indicator Accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    project.category === 'architecture'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                      : project.category === 'zerowaste'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-emerald-500 to-green-500'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        project.category === 'architecture'
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                          : project.category === 'zerowaste'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {project.badge}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400 font-mono">
                      {project.estCost}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Tingkat</span>
                      <strong className="text-slate-200">{project.difficulty}</strong>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Dampak</span>
                      <strong className="text-emerald-400 font-mono">{project.impactScore}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-[11px] text-slate-400">{project.timeframe}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Lihat Panduan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL MODAL (BLUEPRINT & CARA MEMBUAT STEP BY STEP) */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-2 inline-block ${
                    selectedProject.category === 'architecture'
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : selectedProject.category === 'zerowaste'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {selectedProject.categoryLabel} • {selectedProject.badge}
                </span>
                <h3 className="text-xl font-black text-white">{selectedProject.title}</h3>
                <p className="text-xs text-emerald-400 mt-0.5">{selectedProject.subtitle}</p>
              </div>

              <button
                onClick={() => setSelectedProjectId(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Perkiraan Biaya</span>
                <strong className="text-emerald-400 font-mono">{selectedProject.estCost}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Waktu Pasang</span>
                <strong className="text-slate-200">{selectedProject.timeframe}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Tingkat Kesulitan</span>
                <strong className="text-slate-200">{selectedProject.difficulty}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Target Efisiensi</span>
                <strong className="text-amber-400 font-mono">{selectedProject.impactScore}</strong>
              </div>
            </div>

            {/* Masalah yang Dipecahkan */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block font-bold text-[11px] mb-1">
                🎯 Masalah Konkret Gang yang Dipecahkan:
              </span>
              <p className="text-slate-200">{selectedProject.problemSolved}</p>
            </div>

            {/* Bahan & Alat */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Bahan &amp; Komponen yang Diperlukan:</span>
              </h4>
              <ul className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                {selectedProject.materials.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Langkah Pengerjaan Step by Step */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Panduan Praktis Pembuatan (Step-by-Step):</span>
              </h4>
              <ol className="space-y-2.5 text-xs text-slate-300">
                {selectedProject.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips Sukses */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              <strong>💡 Tips Penting:</strong> {selectedProject.tips}
            </div>

            {/* Islamic Wisdom */}
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200/90 flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Nilai Amanah &amp; Hikmah Islam:</strong> {selectedProject.islamicWisdom}
              </span>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProjectId(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM: IKRAR AKSI WARGA & PARTISIPASI RT MANDIRI */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Gerakan Nasional Warga Berdaya</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Ikrar Aksi Warga: Daftarkan Inisiatif Gang Anda
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Catat inisiatif RT Anda ke dalam pangkalan data gerakan iklim warga. Setiap aksi kecil di gang Anda akan menginspirasi jutaan keluarga lainnya di seluruh Nusantara.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold self-start sm:self-auto">
            Terbuka untuk Seluruh RT se-Indonesia
          </span>
        </div>

        {pledgeSubmitted ? (
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              Alhamdulillah! Ikrar Inisiatif Gang Anda Telah Tercatat
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Terima kasih atas kepedulian Anda terhadap bumi dan generasi masa depan. Mari terus istiqomah menjaga lingkungan mulai dari gang terkecil.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePledgeSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nama Penggerak / Warga:
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Bpk. Ahmad Hidayat"
                value={pledgeName}
                onChange={(e) => setPledgeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Wilayah RT / RW &amp; Kota:
              </label>
              <input
                type="text"
                required
                placeholder="Misal: RT 04 / RW 02, Bandung"
                value={pledgeRt}
                onChange={(e) => setPledgeRt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pilihan Inisiatif yang Dijalankan:
              </label>
              <select
                value={pledgeAction}
                onChange={(e) => setPledgeAction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Komposter Ember Tumpuk & Pemilahan Dapur">
                  Komposter Ember Tumpuk (Zero Waste)
                </option>
                <option value="Budikdamber Lele & Kangkung">
                  Budikdamber Lele &amp; Kangkung (EduFarm)
                </option>
                <option value="Lubang Resapan Biopori Gang">
                  Pemasangan Biopori Gang Sempit
                </option>
                <option value="Pemanen Air Hujan Tandon Gravitasi">
                  Pemanen Air Hujan Tandon Gravitasi
                </option>
                <option value="Vertikultur Dinding Paralon">
                  Vertikultur Dinding Paralon Sayur
                </option>
                <option value="Microgreens Superfood Kusen Jendela">
                  Microgreens Kusen Jendela Dapur
                </option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Kirimkan Ikrar Aksi Lingkungan Gang</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
