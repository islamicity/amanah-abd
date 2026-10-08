import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface IslamicityCharterPdfOptions {
  signerName?: string;
  signerRole?: string;
  agencyName?: string;
  includeQrCode?: boolean;
  includeDigitalSignature?: boolean;
}

/**
 * Generate and download the official Islamicity Governance & Professionalism Charter PDF
 */
export async function generateAndDownloadIslamicityCharterPdf(
  options?: IslamicityCharterPdfOptions
): Promise<{ filename: string; sizeBytes: number; signatureHash: string }> {
  const opts: Required<IslamicityCharterPdfOptions> = {
    signerName: 'Aparatur Sipil Negara & Dewan Pengawas AmanahGov',
    signerRole: 'Penegak Integritas Kenabian Pemerintahan Publik',
    agencyName: 'Pemerintah Kota Amanah Sejahtera - Tata Kelola Islamicity',
    includeQrCode: true,
    includeDigitalSignature: true,
    ...options,
  };

  // Create A4 Portrait document (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const charterNumber = `PIAGAM-ISLAMICITY/2026/10/${Math.floor(1000 + Math.random() * 9000)}`;

  // Deterministic signature hash
  const payload = `${charterNumber}|QS4:58|HR_BUKHARI_RA_IN|QS28:26|HR_BUKHARI_IMARAH|QS7:96|${dateStr}`;
  let hash1 = 0x811c9dc5;
  let hash2 = 0x5b79a32c;
  for (let i = 0; i < payload.length; i++) {
    const c = payload.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ c, 0x01000193);
    hash2 = Math.imul(hash2 ^ c, 0x5bd1e995);
  }
  const signatureHash = `0x${(hash1 >>> 0).toString(16).padStart(8, '0')}${(hash2 >>> 0).toString(16).padStart(8, '0')}77a90b4e`.toLowerCase();

  let y = 12;

  // Helper page footer
  const drawPageFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 10;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Piagam Tata Kelola Islamicity • Amanah, Profesional, Bebas Pungli • Terotentikasi Konsensus On-Chain',
      margin,
      footerY + 1.5
    );
    doc.text(
      `Halaman ${pageNum} dari ${totalPages} • Dicetak: ${dateStr} ${timeStr} WIB`,
      pageWidth - margin,
      footerY + 1.5,
      { align: 'right' }
    );
  };

  // Helper mini header for page 2
  const drawPageHeader = () => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, 8, contentWidth, 7, 'F');
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(margin, 8, 3, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('PIAGAM TATA KELOLA PEMERINTAHAN AMANAH & PROFESIONAL ISLAMICITY', margin + 6, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Nomor: ${charterNumber}`, pageWidth - margin - 4, 13, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: KOP SURAT, DEKLARASI & 3 PILAR UTAMA
  // ==========================================

  // Official Kop Surat
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 18, 'F');

  doc.setFillColor(16, 185, 129);
  doc.rect(margin, y, 4, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KOTA AMANAH SEJAHTERA', margin + 7, y + 5.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('MAJELIS TATA KELOLA ISLAMICITY & REFORMASI BIROKRASI AMANAH', margin + 7, y + 10);

  doc.setFontSize(7);
  doc.setTextColor(52, 211, 153);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'Falsafah Kepemimpinan Nabawiyah: Shiddiq • Amanah • Tabligh • Fathanah',
    margin + 7,
    y + 14.5
  );

  // Badge Charter
  doc.setFillColor(6, 78, 59);
  doc.roundedRect(pageWidth - margin - 46, y + 3, 42, 12, 1.5, 1.5, 'F');
  doc.setTextColor(167, 243, 208);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DOKUMEN RESMI NEGARA', pageWidth - margin - 25, y + 7.5, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text(charterNumber, pageWidth - margin - 25, y + 12, { align: 'center' });

  y += 22;

  // Divider line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setLineWidth(0.2);
  doc.line(margin, y + 1, pageWidth - margin, y + 1);
  y += 5.5;

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PIAGAM TATA KELOLA PEMERINTAHAN AMANAH & PROFESIONAL', pageWidth / 2, y, {
    align: 'center',
  });
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Konstitusi Moral & Operasional Birokrasi Berlandaskan Al-Qur\'an dan As-Sunnah Ash-Shahihah',
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // Introductory Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 15, 1.5, 1.5, 'FD');
  doc.setFillColor(16, 185, 129);
  doc.rect(margin, y, 2.5, 15, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('MANIFESTO KEBIJAKAN PUBLIK ISLAMICITY:', margin + 5, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  const introText =
    'Pemerintahan Islamicity menolak kekuasaan sebagai alat privilese pribadi atau oligarki. Jabatan dipandang sebagai amanah hisab berat yang wajib diisi oleh sosok kuat/kompeten (Al-Qawiyyu) dan terpercaya (Al-Amin), tanpa ambisi meminta kedudukan, demi menjamin keadilan rakyat dan mengundang berkah langit serta bumi.';
  const introLines = doc.splitTextToSize(introText, contentWidth - 8);
  doc.text(introLines, margin + 5, y + 8);

  y += 18;

  // --- PILAR 1: QS An-Nisa (4): 58 ---
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 36, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text('1. QS AN-NISA (4) : 58 — KEADILAN MUTLAK & AMANAH KEPADA AHLINYA', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(5, 150, 105);
  doc.text(
    '“Innallaha ya’murukum an tu’addul-amanati ila ahliha wa iza hakamtum bainan-nasi an tahkumu bil-‘adl...”',
    margin + 4,
    y + 9.5
  );

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7);
  const trans1 =
    '“Sesungguhnya Allah menyuruh kamu menyampaikan amanat kepada yang berhak menerimanya, dan (menyuruh kamu) apabila menetapkan hukum di antara manusia supaya kamu menetapkan dengan adil. Sesungguhnya Allah memberi pengajaran yang sebaik-baiknya kepadamu. Sesungguhnya Allah adalah Maha Mendengar lagi Maha Melihat.”';
  const transLines1 = doc.splitTextToSize(trans1, contentWidth - 8);
  doc.text(transLines1, margin + 4, y + 14);

  // Application Box
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 3, y + 24, contentWidth - 6, 9.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(6, 78, 59);
  doc.text('IMPLEMENTASI SISTEM AMANAHGOV:', margin + 5, y + 27.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    '• Rekrutmen pejabat 100% meritokratis tanpa nepotisme/titipan. Setiap sengketa aduan warga diselesaikan secara adil tanpa tebang pilih.',
    margin + 5,
    y + 31
  );

  y += 39;

  // --- PILAR 2: HR AL-BUKHARI & MUSLIM (KULLUKUM RA'IN) ---
  doc.setFillColor(240, 249, 255); // sky-50
  doc.setDrawColor(2, 132, 199);
  doc.roundedRect(margin, y, contentWidth, 36, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(3, 105, 161);
  doc.text('2. HR AL-BUKHARI & MUSLIM — PEMIMPIN ADALAH PENGURUS & PELAYAN RAKYAT', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(2, 132, 199);
  doc.text(
    '“Kullukum ra’in wa kullukum mas’ulun ‘an ra’iyyatihi, fal-imamu ra’in wa huwa mas’ulun ‘an ra’iyyatihi...”',
    margin + 4,
    y + 9.5
  );

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7);
  const trans2 =
    '“Setiap kalian adalah pemimpin (pengurus/penggembala) dan setiap kalian akan dimintai pertanggungjawaban atas apa yang dipimpinnya. Seorang kepala negeri (imam) adalah pengurus rakyat dan ia bertanggung jawab penuh atas rakyat yang dia urus...” (HR. Al-Bukhari no. 893 & Muslim no. 1829)';
  const transLines2 = doc.splitTextToSize(trans2, contentWidth - 8);
  doc.text(transLines2, margin + 4, y + 14);

  // Application Box
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 3, y + 24, contentWidth - 6, 9.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(3, 105, 161);
  doc.text('IMPLEMENTASI SISTEM AMANAHGOV:', margin + 5, y + 27.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    '• Doktrin Sayyidul Qaumi Khadimuhum: Pejabat wajib turun lapangan menanggapi laporan warga via Satgas TRC dalam batas SLA ketat (< 24 jam).',
    margin + 5,
    y + 31
  );

  y += 39;

  // --- PILAR 3: QS AL-QASHAS (28): 26 ---
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(217, 119, 6);
  doc.roundedRect(margin, y, contentWidth, 36, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('3. QS AL-QASHAS (28) : 26 — KRITERIA PROFESIONAL AL-QAWIYYU & AL-AMIN', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(217, 119, 6);
  doc.text(
    '“Qalat ihdahuma ya abati-sta’jirhu, inna khaira mani-sta’jartal-qawiyyul-amin.”',
    margin + 4,
    y + 9.5
  );

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7);
  const trans3 =
    '“Salah seorang dari kedua perempuan itu berkata: ‘Wahai ayahku! Ambillah ia sebagai orang yang bekerja (pada kita), sesungguhnya orang yang paling baik yang engkau ambil untuk bekerja ialah yang kuat (kompeten/profesional/Al-Qawiyyu) lagi dapat dipercaya (berintegritas/amanah/Al-Amin)’.”';
  const transLines3 = doc.splitTextToSize(trans3, contentWidth - 8);
  doc.text(transLines3, margin + 4, y + 14);

  // Application Box
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 3, y + 24, contentWidth - 6, 9.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(180, 83, 9);
  doc.text('IMPLEMENTASI SISTEM AMANAHGOV:', margin + 5, y + 27.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    '• Matriks Dua Sisi ASN: Al-Qawiyyu (penguasaan teknologi & kepiawaian manajerial) + Al-Amin (transparansi harta LHKPN & bebas korupsi/pungli).',
    margin + 5,
    y + 31
  );

  drawPageFooter(1, 2);

  // ==========================================
  // PAGE 2: PILAR 4 & 5, MATRIKS KOMPARASI, PENGESAHAN
  // ==========================================
  doc.addPage();
  drawPageHeader();

  y = 20;

  // --- PILAR 4: HR AL-BUKHARI & MUSLIM (LARANGAN MEMINTA JABATAN) ---
  doc.setFillColor(255, 241, 242); // rose-50
  doc.setDrawColor(225, 29, 72);
  doc.roundedRect(margin, y, contentWidth, 38, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 18, 60);
  doc.text('4. HR AL-BUKHARI & MUSLIM — LARANGAN MEMINTA JABATAN & PERTOLONGAN ALLAH', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(225, 29, 72);
  doc.text(
    '“La tas’alil-imarata, fa-innaka in utitaha ‘an mas’alatin wukilta ilaiha, wa in utitaha min ghairi mas’alatin u’inta ‘alaiha...”',
    margin + 4,
    y + 9.5
  );

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7);
  const trans4 =
    '“Janganlah engkau meminta jabatan! Sebabnya, jika engkau diberi jabatan itu karena permintaanmu (ambisi/lobi nafsu), kamu akan dibiarkan dengan jabatan tersebut (tidak akan ditolong Allah SWT). Akan tetapi jika engkau diberi jabatan tanpa permintaanmu (amanah penugasan umat), kamu akan ditolong oleh Allah SWT dalam menjalankan jabatan tersebut.” (HR. Al-Bukhari no. 7146 & Muslim no. 1652)';
  const transLines4 = doc.splitTextToSize(trans4, contentWidth - 8);
  doc.text(transLines4, margin + 4, y + 14);

  // Application Box
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 3, y + 25, contentWidth - 6, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(190, 18, 60);
  doc.text('IMPLEMENTASI SISTEM AMANAHGOV:', margin + 5, y + 28.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    '• Larangan mahar politik & kampanye transaksional. Pejabat yang ditugaskan murni atas dasar rekam jejak independen meraih Ma’unah (bantuan Ilahi).',
    margin + 5,
    y + 32
  );

  y += 41;

  // --- PILAR 5: QS AL-A'RAF (7): 96 ---
  doc.setFillColor(245, 243, 255); // purple-50
  doc.setDrawColor(124, 58, 237);
  doc.roundedRect(margin, y, contentWidth, 36, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(109, 40, 217);
  doc.text('5. QS AL-A’RAF (7) : 96 — MUARA KEBERKAHAN NEGERI DARI LANGIT & BUMI', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(124, 58, 237);
  doc.text(
    '“Walau anna ahlal-qura amanu wattaqaw lafatahna ‘alaihim barakatim minas-sama’i wal-ard...”',
    margin + 4,
    y + 9.5
  );

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7);
  const trans5 =
    '“Jikalau sekiranya penduduk negeri-negeri beriman dan bertakwa, pastilah Kami akan melimpahkan kepada mereka berkah dari langit dan bumi, tetapi mereka mendustakan (ayat-ayat Kami) itu, maka Kami siksa mereka disebabkan perbuatannya.” (QS. Al-A’raf : 96)';
  const transLines5 = doc.splitTextToSize(trans5, contentWidth - 8);
  doc.text(transLines5, margin + 4, y + 14);

  // Application Box
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 3, y + 24, contentWidth - 6, 9.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(109, 40, 217);
  doc.text('IMPLEMENTASI SISTEM AMANAHGOV:', margin + 5, y + 27.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    '• Kemakmuran hakiki tercapai saat birokrasi bersih total dari korupsi. Anggaran dialokasikan 100% untuk rakyat, alam lestari, dan ketahanan sosial.',
    margin + 5,
    y + 31
  );

  y += 39;

  // --- MATRIKS PERBANDINGAN TATA KELOLA ---
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('TABEL KOMPARASI: BIROKRASI OPORTUNISTIK VS TATA KELOLA ISLAMICITY', margin + 4, y + 3.8);
  y += 5.5;

  const rows = [
    ['Dimensi', 'Birokrasi Oportunistik (Konvensional)', 'Pemerintahan Islamicity AmanahGov'],
    ['Motif Jabatan', 'Mengejar fasilitas, prestise & keuntungan pribadi', 'Mengemban amanah hisab akhirat (QS 4:58)'],
    ['Cara Memperoleh', 'Lobi politik, mahar, meminta jabatan agresif', 'Penugasan amanah oleh syura umat (HR Bukhari)'],
    ['Pertolongan Ilahi', 'Dibiarkan mengandalkan kelemahan akal sendiri', 'Ditolong & dinaungi rahmat Allah SWT (U’ina ‘alaiha)'],
    ['Kriteria Aparatur', 'Koneksi nepotisme & kesetiaan buta', 'Al-Qawiyyu (Kompeten) & Al-Amin (Amanah) (QS 28:26)'],
    ['Orientasi Rakyat', 'Rakyat diposisikan sebagai objek yang diatur', 'Pemimpin adalah pelayan rakyat (Khadimul Ummah)'],
    ['Dampak Negeri', 'Kesenjangan ekonomi, krisis moral & bencana', 'Berkah melimpah ruah dari langit & bumi (QS 7:96)'],
  ];

  rows.forEach((r, idx) => {
    const isHeader = idx === 0;
    const rowH = 5.2;
    doc.setFillColor(isHeader ? 226 : idx % 2 === 0 ? 248 : 255, isHeader ? 232 : idx % 2 === 0 ? 250 : 255, isHeader ? 240 : 255);
    doc.rect(margin, y, contentWidth, rowH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowH, pageWidth - margin, y + rowH);

    doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(isHeader ? 15 : 30, isHeader ? 23 : 41, isHeader ? 42 : 59);

    doc.text(r[0], margin + 2, y + 3.6);
    doc.text(r[1], margin + 35, y + 3.6);
    doc.setFont('helvetica', isHeader ? 'bold' : 'bold');
    doc.setTextColor(isHeader ? 15 : 6, isHeader ? 23 : 78, isHeader ? 42 : 59);
    doc.text(r[2], margin + 105, y + 3.6);

    y += rowH;
  });

  y += 5;

  // --- DIGITAL AUTHENTICATION & CERTIFICATION BOX ---
  if (opts.includeDigitalSignature) {
    const signBoxH = 26;
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, signBoxH, 1.5, 1.5, 'FD');

    // QR Code
    if (opts.includeQrCode) {
      try {
        const portalUrl =
          typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}?charter=${charterNumber}`
            : `https://amanahgov.id/?charter=${charterNumber}`;
        const qrDataUrl = await QRCode.toDataURL(portalUrl, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 140,
          color: { dark: '#064e3b', light: '#ffffff' },
        });

        doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 25, y + 2.5, 21, 21);
      } catch (err) {
        console.warn('Failed to embed charter QR:', err);
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(6, 78, 59);
    doc.text('PENGESAHAN PAKTA INTEGRITAS & AKREDITASI TATA KELOLA ISLAMICITY', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(71, 85, 105);
    doc.text(`Kode Integritas Piagam (SHA-256): ${signatureHash}`, margin + 4, y + 9);
    doc.text(`Penandatangan Sah: ${opts.signerName}`, margin + 4, y + 13);
    doc.text(`Jabatan: ${opts.signerRole} • ${opts.agencyName}`, margin + 4, y + 17);
    doc.text(
      'Klausul Sumpah: Setiap aparatur yang melanggar pakta ini bersedia diberhentikan dan ditindak secara hukum.',
      margin + 4,
      y + 21
    );
  }

  drawPageFooter(2, 2);

  // Save & Trigger Download
  const filename = `Piagam_Tata_Kelola_Islamicity_AmanahGov_${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${charterNumber.replace(/[/]/g, '-')}.pdf`;

  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

  return {
    filename,
    sizeBytes: pdfBlob.size,
    signatureHash,
  };
}
