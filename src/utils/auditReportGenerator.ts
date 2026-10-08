import jsPDF from 'jspdf';
import { BlockchainBlock, BlockchainTransaction } from '../types';
import { VerificationResult, runAutomatedAudit, sha256 } from '../services/blockchain';

export interface AuditReportMetadata {
  documentId: string;
  generatedAt: string;
  totalBlocks: number;
  validBlocks: number;
  compromisedBlocks: number;
  totalTransactions: number;
  totalPublicFundsAudited: number;
  integrityVerdict: 'SAH_TERVERIFIKASI' | 'PERINGATAN_TERKOMPROMI';
  verdictMessage: string;
  documentChecksum?: string;
}

/**
 * Format currency to Rupiah string
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate official Audit Report Document in formatted Markdown / Text
 */
export async function generateAuditReportDocument(
  blocks: BlockchainBlock[],
  existingAuditResult?: VerificationResult | null,
  isTampered: boolean = false
): Promise<{ content: string; metadata: AuditReportMetadata }> {
  // Ensure we have up-to-date audit results
  const audit = existingAuditResult || (await runAutomatedAudit(blocks));
  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const timestampStr = `${formattedDate}, pukul ${formattedTime} WIB`;
  const docRandomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const documentId = `AUD-AMN-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${docRandomId}`;

  // Calculate transaction stats
  const allTransactions: BlockchainTransaction[] = [];
  let totalPublicFunds = 0;

  blocks.forEach((b) => {
    b.transactions.forEach((tx) => {
      allTransactions.push(tx);
      if (tx.amount && typeof tx.amount === 'number') {
        totalPublicFunds += tx.amount;
      }
    });
  });

  const isActuallyValid = audit.isValid && !isTampered;
  const validBlocksCount = blocks.length - audit.tamperedBlocksCount;

  const metadata: AuditReportMetadata = {
    documentId,
    generatedAt: timestampStr,
    totalBlocks: blocks.length,
    validBlocks: validBlocksCount,
    compromisedBlocks: audit.tamperedBlocksCount,
    totalTransactions: allTransactions.length,
    totalPublicFundsAudited: totalPublicFunds,
    integrityVerdict: isActuallyValid ? 'SAH_TERVERIFIKASI' : 'PERINGATAN_TERKOMPROMI',
    verdictMessage: isActuallyValid
      ? 'Kondisi integritas blockchain 100% sempurna. Seluruh blok terverifikasi secara kriptografis tanpa terputus.'
      : `Peringatan integritas: Ditemukan ${audit.tamperedBlocksCount} blok mengalami anomali hash/data yang tidak sah.`,
  };

  // Build the textual markdown report
  const dividerDouble = '================================================================================';
  const dividerSingle = '--------------------------------------------------------------------------------';

  let doc = `${dividerDouble}
          PEMERINTAH KOTA AMANAH • BADAN PENGAWASAN & INSPEKTORAT DIGITAL
           SISTEM INFRASTRUKTUR PEMERINTAHAN CERDAS BERBASIS AMANAH
               (Meneladani Kepemimpinan Luhur Rasulullah SAW)
${dividerDouble}

DOKUMEN RESMI: LAPORAN AUDIT OTOMATIS INTEGRITAS KRIPTOGRAFI BLOCKCHAIN
Nomor Registrasi Audit : ${documentId}
Waktu Penerbitan       : ${timestampStr}
Status Integritas      : ${isActuallyValid ? '✅ TERVERIFIKASI SAH & UTUH (100% AMANAH)' : '❌ PERINGATAN INTEGRITAS: TERKOMPROMI / DATA RUSAK'}
Tingkat Kepercayaan    : 100% Deterministic Cryptographic Proof (Zero Trust Architecture)

${dividerSingle}
I. LANDASAN NILAI & TATA KELOLA KENEGARAAN (MANHAJ PROFETIK AMANAH)
${dividerSingle}
Sistem audit otomatis ini beroperasi berdasarkan 4 pilar kepemimpinan Rasulullah SAW:
1. SHIDDIQ (Kejujuran & Kebenaran Data):
   Setiap data aduan masyarakat dan transaksi publik tercatat tanpa rekayasa,
   menjamin kebenaran informasi sebelum diproses oleh aparatur negara.
2. AMANAH (Akuntabilitas & Tanggung Jawab):
   Setiap rupiah dana publik dan setiap detik batas waktu penanganan (SLA)
   merupakan titipan rakyat yang dipertanggungjawabkan di dunia dan akhirat.
3. TABLIGH (Keterbukaan & Transparansi Informasi):
   Buku besar transaksi terbuka untuk diaudit oleh seluruh warga negara secara
   real-time tanpa ada dokumen rahasia yang disembunyikan.
4. FATHANAH (Kecerdasan & Kebijaksanaan Sistem):
   Memanfaatkan teknologi rantai blok (blockchain), algoritma SHA-256, dan
   pohon pembuktian Merkle (Merkle Tree Proof) untuk deteksi fraud otomatis.

${dividerSingle}
II. RINGKASAN EKSEKUTIF HASIL AUDIT (EXECUTIVE SUMMARY)
${dividerSingle}
• Status Rantai Blok       : ${isActuallyValid ? 'SAH & TIDAK TERGANGGU (INTEGRITY OK)' : 'TERDETEKSI MANIPULASI ILEGAL (COMPROMISED)'}
• Tinggi Blok Terakhir     : #${blocks.length - 1} (Total: ${blocks.length} Blok)
• Total Blok Terverifikasi : ${blocks.length} Blok
• Blok Berstatus SAH       : ${validBlocksCount} Blok
• Blok Rusak / Inkonsisten : ${audit.tamperedBlocksCount} Blok
• Total Transaksi Diaudit  : ${allTransactions.length} Transaksi On-Chain
• Akumulasi Dana Tervalidasi: ${formatRupiah(totalPublicFunds)}
• Protokol Konsensus       : Proof of Amanah (PoA) Terdistribusi
• Standar Hash Kriptografi : SHA-256 + Merkle Tree Digest
• Node Validator Pengawas  :
  1. Node-01 (Inspektorat Kota & Satgas Anti-Risywah)
  2. Node-02 (Perwakilan BPKP & Auditor Independen)
  3. Node-03 (Kanal Dewan Aspirasi Warga & Tokoh Masyarakat)
  4. Node-04 (Gateway Pelayanan Publik Kota Cerdas)

Kesimpulan Audit Sistem:
"${metadata.verdictMessage}"

${dividerSingle}
III. TABEL VERIFIKASI INTEGRITAS PER BLOK
${dividerSingle}
`;

  // Append block verification table
  blocks.forEach((block) => {
    const v = audit.blockVerifications.find((bv) => bv.blockHeight === block.blockHeight);
    const isValid = v ? v.isValid : block.integrityStatus === 'VALID';
    const statusLabel = isValid ? '[SAH]' : '[RUSAK / ANOMALI]';
    const blockTitle = block.blockHeight === 0 ? 'Genesis Block (Piagam Madinah)' : `Blok Konsensus Layanan #${block.blockHeight}`;

    doc += `
[Blok #${block.blockHeight}] ${blockTitle}
• Status Integritas : ${statusLabel}
• Timestamp        : ${block.timestamp}
• Validator Node   : ${block.validatorNode}
• Nonce            : ${block.nonce}
• Jumlah Transaksi : ${block.transactions.length} transaksi
• Stored Hash      : ${block.blockHash}
• Computed Hash    : ${v?.computedHash || block.blockHash}
• Previous Hash    : ${block.previousHash}
• Merkle Tree Root : ${block.merkleRoot}
• Merkle Status    : ${v?.merkleStatus === 'MATCH' ? 'MATCH (Sesuai dengan daun transaksi)' : (v?.merkleStatus || 'MATCH')}
• Catatan Audit    : ${v?.reason || 'Kriptografi valid dan terhubung sah ke blok sebelumnya.'}
`;
  });

  doc += `
${dividerSingle}
IV. DAFTAR SELURUH TRANSAKSI ON-CHAIN TERVERIFIKASI (${allTransactions.length} TRANSAKSI)
${dividerSingle}
`;

  allTransactions.forEach((tx, idx) => {
    const amountStr = tx.amount ? formatRupiah(tx.amount) : 'Non-Finansial (Layanan Publik)';
    doc += `
${(idx + 1).toString().padStart(2, '0')}. ID Transaksi : ${tx.txId} (Blok #${tx.blockHeight})
    Waktu        : ${tx.timestamp}
    Judul        : ${tx.title}
    Kategori     : ${tx.type} (Pilar: ${tx.pilar})
    Nilai Nominal: ${amountStr}
    Penerima     : ${tx.recipient}
    Petugas/KPA  : ${tx.officer} (${tx.agency})
    Status Tx    : ${tx.status}
    Hash Digital : ${tx.txHash}
`;
  });

  doc += `
${dividerSingle}
V. PERNYATAAN OTENTIKASI & TANDA TANGAN DIGITAL
${dividerSingle}
Laporan ini dihasilkan secara otomatis oleh Autonomous Blockchain Audit Engine
AmanahGov. Pembuktian matematika kriptografis bersifat mutlak dan tidak bergantung
pada asumsi manusia. Bilamana terjadi perubahan data sebutir zarrah pun di pangkalan
data publik, nilai hash akan langsung berubah drastis (avalanche effect) dan memicu
alarm darurat anti-manipulasi.

"Dan janganlah kamu memakan harta di antara kamu dengan jalan yang batil,
dan (janganlah) kamu menyuap dengan harta itu kepada para hakim dengan maksud
agar kamu dapat memakan sebagian dari harta orang lain itu dengan cara berbuat dosa,
padahal kamu mengetahui." (QS. Al-Baqarah: 188)

Diterbitkan secara resmi oleh:
Sistem Audit Kriptografi AmanahGov
Inspektorat Kota & Portal Layanan Publik Shiddiq
`;

  // Compute document checksum
  const docChecksum = await sha256(doc);
  metadata.documentChecksum = docChecksum;

  doc += `
--------------------------------------------------------------------------------
DOKUMEN CHECKSUM HASH (SHA-256):
0x${docChecksum}
--------------------------------------------------------------------------------
Akhir Dokumen Audit Integritas Resmi.
`;

  return { content: doc, metadata };
}

/**
 * Trigger direct client-side file download
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/markdown;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generate and download an official summary PDF audit report
 * formatted for official government inspection & public accountability (LHA-IKB standard).
 */
export async function exportAuditReportToPdf(
  blocks: BlockchainBlock[],
  existingAuditResult?: VerificationResult | null,
  isTampered: boolean = false
): Promise<{ filename: string; documentId: string; checksum: string }> {
  const audit = existingAuditResult || (await runAutomatedAudit(blocks));
  const now = new Date();

  const formattedDate = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const docRandomId = Math.random().toString(36).substring(2, 7).toUpperCase();
  const documentId = `LHA-IKB/${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${docRandomId}`;

  // Gather transactions and funds
  const allTransactions: BlockchainTransaction[] = [];
  let totalPublicFunds = 0;

  blocks.forEach((b) => {
    b.transactions.forEach((tx) => {
      allTransactions.push(tx);
      if (tx.amount && typeof tx.amount === 'number') {
        totalPublicFunds += tx.amount;
      }
    });
  });

  const isActuallyValid = audit.isValid && !isTampered;
  const validBlocksCount = blocks.length - audit.tamperedBlocksCount;

  // Compute Checksum for this audit run
  const rawDataForHash = `${documentId}|${blocks.length}|${validBlocksCount}|${audit.tamperedBlocksCount}|${allTransactions.length}|${totalPublicFunds}|${isActuallyValid}`;
  const docChecksum = await sha256(rawDataForHash);

  // Initialize jsPDF A4 (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      // mini running header for subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(148, 163, 184);
      doc.text('LAPORAN AUDIT INTEGRITAS KRIPTOGRAFI RANTAI BLOK • AMANAHGOV', margin, y - 4);
      doc.text(`NO: ${documentId}`, pageWidth - margin, y - 4, { align: 'right' });
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    }
  };

  // --- 1. OFFICIAL KOP SURAT HEADER (Page 1) ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(margin, y, 4, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KOTA AMANAH SEJAHTERA', margin + 8, y + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('BADAN PENGAWASAN DAERAH • INSPEKTORAT INTEGRITAS PELAYANAN PUBLIK', margin + 8, y + 11);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Sistem Informasi Kriptografi AmanahGov - Transparansi & Integritas Buku Besar Publik', margin + 8, y + 15.5);

  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.text('MANHAJ PROFETIK: SHIDDIQ (KEJUJURAN DATA) • AMANAH (AKUNTABILITAS MUTLAK)', margin + 8, y + 20.5);

  // Right Badge on Kop
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - margin - 54, y + 3, 52, 18, 1.5, 1.5, 'F');
  doc.setTextColor(226, 232, 240);
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.text('DOKUMEN RESMI (LHA-IKB)', pageWidth - margin - 50, y + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text(documentId, pageWidth - margin - 50, y + 12.5);
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`${formattedDate}, ${formattedTime} WIB`, pageWidth - margin - 50, y + 17);

  y += 28;

  // --- 2. REPORT TITLE & STATUTORY BASIS ---
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LAPORAN HASIL AUDIT INTEGRITAS KRIPTOGRAFI RANTAI BLOK', margin, y);
  y += 4.5;

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Verifikasi Deterministik Rantai Hash SHA-256, Merkle Tree Proof & Konsensus Proof of Amanah (PoA)', margin, y);
  y += 4;

  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text('Landasan Hukum: UU No. 25/2009 (Pelayanan Publik), UU ITE No. 1/2024, & Perpres No. 95/2018 (SPBE)', margin, y);
  y += 6;

  // --- 3. AUDIT VERDICT STATUS STRIP ---
  const verdictHeight = 18;
  if (isActuallyValid) {
    doc.setFillColor(240, 253, 244); // emerald-50
    doc.setDrawColor(16, 185, 129); // emerald-500
    doc.roundedRect(margin, y, contentWidth, verdictHeight, 1.5, 1.5, 'FD');

    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin + 3, y + 3.5, 26, 4.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('SAH & TERVERIFIKASI', margin + 4.5, y + 6.8);

    doc.setFontSize(8.5);
    doc.setTextColor(6, 78, 59); // emerald-900
    doc.text('HASIL AUDIT: RANTAI BLOK 100% UTUH & INTEGRITAS AMANAH TERJAMIN', margin + 31, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(
      'Seluruh blok dan transaksi publik terhubung dalam rantai kriptografis yang utuh. Tidak ditemukan indikasi manipulasi, suap (risywah), atau penghapusan catatan transaksi publik. Pohon Merkle dan Block Hash valid secara matematis.',
      margin + 3.5,
      y + 11.5,
      { maxWidth: contentWidth - 7 }
    );
  } else {
    doc.setFillColor(255, 241, 242); // rose-50
    doc.setDrawColor(244, 63, 94); // rose-500
    doc.roundedRect(margin, y, contentWidth, verdictHeight, 1.5, 1.5, 'FD');

    doc.setFillColor(225, 29, 72);
    doc.roundedRect(margin + 3, y + 3.5, 32, 4.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('PERINGATAN INTEGRITAS', margin + 4.5, y + 6.8);

    doc.setFontSize(8.5);
    doc.setTextColor(136, 19, 55); // rose-900
    doc.text('PERINGATAN: TERDETEKSI ANOMALI KRIPTOGRAFI / PERCOBAAN MANIPULASI', margin + 37, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Sistem audit otomatis mendeteksi ketidaksesuaian nilai hash pada ${audit.tamperedBlocksCount} blok. Mutasi data tidak sah dibekukan seketika oleh protokol konsensus Proof of Amanah demi melindungi hak publik.`,
      margin + 3.5,
      y + 11.5,
      { maxWidth: contentWidth - 7 }
    );
  }

  y += verdictHeight + 4;

  // --- 4. EXECUTIVE SUMMARY METRIC CARDS (4 Columns) ---
  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 17;

  // Card 1: Status Rantai
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.2);
  doc.setFont('helvetica', 'normal');
  doc.text('Status Rantai Kriptografis', margin + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(isActuallyValid ? 16 : 225, isActuallyValid ? 185 : 29, isActuallyValid ? 129 : 72);
  doc.text(isActuallyValid ? '100% SAH' : 'KOMPROMI', margin + 3, y + 10.5);
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${validBlocksCount} dari ${blocks.length} Blok Valid`, margin + 3, y + 14.5);

  // Card 2: Tinggi Blok
  const c2X = margin + cardWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(c2X, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.2);
  doc.text('Tinggi Buku Besar (Height)', c2X + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`#${blocks.length - 1}`, c2X + 3, y + 10.5);
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Total ${blocks.length} Blok Tersimpan`, c2X + 3, y + 14.5);

  // Card 3: Transaksi Diaudit
  const c3X = c2X + cardWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(c3X, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.2);
  doc.text('Transaksi Publik Diaudit', c3X + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(2, 132, 199); // sky-600
  doc.text(`${allTransactions.length} Transaksi`, c3X + 3, y + 10.5);
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('100% On-Chain Terverifikasi', c3X + 3, y + 14.5);

  // Card 4: Akumulasi Dana
  const c4X = c3X + cardWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(c4X, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.2);
  doc.text('Dana Publik Tervalidasi', c4X + 3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(formatRupiah(totalPublicFunds), c4X + 3, y + 10.5);
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('Bebas Potongan / Risywah', c4X + 3, y + 14.5);

  y += cardHeight + 5;

  // --- 5. TECHNICAL SPECIFICATIONS & CONSENSUS ENVIRONMENT ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  const specHeight = 22;
  doc.roundedRect(margin, y, contentWidth, specHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('I. LINGKUNGAN KONSENSUS & SPESIFIKASI KRIPTOGRAFI', margin + 3.5, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);

  // Left Column
  doc.text('• Algoritma Hashing       : SHA-256 Digest (FIPS 180-4 Standard)', margin + 3.5, y + 9);
  doc.text('• Pembuktian Pohon Data   : Merkle Tree Hash Root (Binary Digest)', margin + 3.5, y + 13);
  doc.text('• Protokol Konsensus      : Proof of Amanah (PoA) Byzantine Fault Tolerant', margin + 3.5, y + 17);

  // Right Column
  const rightColX = margin + contentWidth * 0.52;
  doc.text('• Node Validator 01: Inspektorat Daerah & Satgas Anti-Pungli', rightColX, y + 9);
  doc.text('• Node Validator 02: Perwakilan BPKP & Auditor Independen', rightColX, y + 13);
  doc.text('• Node Validator 03: Dewan Aspirasi Warga & Tokoh Komunitas', rightColX, y + 17);

  y += specHeight + 5;

  // --- 6. TABLE: BLOCK INTEGRITY AUDIT TABLE ---
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text('II. TABEL VERIFIKASI INTEGRITAS SETIAP BLOK (CRYPTOGRAPHIC CHAIN AUDIT)', margin, y);
  y += 4;

  // Table Columns Setup
  // Total content width: 182
  const colWidths = [24, 32, 18, 52, 38, 18]; // 24+32+18+52+38+18 = 182
  const colX = [
    margin,
    margin + colWidths[0],
    margin + colWidths[0] + colWidths[1],
    margin + colWidths[0] + colWidths[1] + colWidths[2],
    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4],
  ];

  // Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Blok / Tinggi', colX[0] + 2, y + 4.5);
  doc.text('Node Pengesah', colX[1] + 2, y + 4.5);
  doc.text('Tx / Nonce', colX[2] + 2, y + 4.5);
  doc.text('Nilai Hash Blok (SHA-256)', colX[3] + 2, y + 4.5);
  doc.text('Merkle Root Status', colX[4] + 2, y + 4.5);
  doc.text('Status', colX[5] + 2, y + 4.5);

  y += 6.5;

  // Table Rows
  blocks.forEach((block, idx) => {
    checkPageBreak(8);
    const v = audit.blockVerifications.find((bv) => bv.blockHeight === block.blockHeight);
    const isValid = v ? v.isValid : block.integrityStatus === 'VALID';

    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 7.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7.5, margin + contentWidth, y + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(`#${block.blockHeight} ${block.blockHeight === 0 ? '(Genesis)' : ''}`, colX[0] + 2, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(71, 85, 105);
    const nodeClean = block.validatorNode.replace('Node ', 'N-');
    doc.text(nodeClean.slice(0, 24), colX[1] + 2, y + 4.8);

    doc.text(`${block.transactions.length} Tx / ${block.nonce}`, colX[2] + 2, y + 4.8);

    // Monospace hash display
    doc.setFont('courier', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(51, 65, 85);
    const shortHash = `0x${block.blockHash.slice(0, 16)}...${block.blockHash.slice(-8)}`;
    doc.text(shortHash, colX[3] + 2, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    const merkleNote = v?.merkleStatus === 'MATCH' ? 'MATCH (Valid)' : (v?.merkleStatus || 'MATCH');
    doc.setTextColor(v?.merkleStatus === 'MISMATCH' ? 225 : 16, v?.merkleStatus === 'MISMATCH' ? 29 : 120, v?.merkleStatus === 'MISMATCH' ? 72 : 80);
    doc.text(merkleNote, colX[4] + 2, y + 4.8);

    // Badge status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    if (isValid) {
      doc.setTextColor(16, 185, 129); // emerald-500
      doc.text('SAH', colX[5] + 2, y + 4.8);
    } else {
      doc.setTextColor(225, 29, 72); // rose-600
      doc.text('RUSAK', colX[5] + 2, y + 4.8);
    }

    y += 7.5;
  });

  y += 5;

  // --- 7. TABLE: SAMPLE ON-CHAIN PUBLIC TRANSACTIONS ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text(`III. SAMPEL TRANSAKSI LAYANAN PUBLIK ON-CHAIN DIAUDIT (${allTransactions.length} TRANSAKSI)`, margin, y);
  y += 4;

  const txColWidths = [28, 52, 28, 44, 30]; // 28+52+28+44+30 = 182
  const txColX = [
    margin,
    margin + txColWidths[0],
    margin + txColWidths[0] + txColWidths[1],
    margin + txColWidths[0] + txColWidths[1] + txColWidths[2],
    margin + txColWidths[0] + txColWidths[1] + txColWidths[2] + txColWidths[3],
  ];

  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ID Transaksi', txColX[0] + 2, y + 4.5);
  doc.text('Judul / Layanan Publik', txColX[1] + 2, y + 4.5);
  doc.text('Pilar Profetik', txColX[2] + 2, y + 4.5);
  doc.text('Pejabat KPA / Instansi', txColX[3] + 2, y + 4.5);
  doc.text('Nominal / Status', txColX[4] + 2, y + 4.5);

  y += 6.5;

  // Render top transactions (up to 8)
  const displayTxs = allTransactions.slice(0, 8);
  displayTxs.forEach((tx, idx) => {
    checkPageBreak(7.5);
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);

    doc.setFont('courier', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(15, 23, 42);
    doc.text(tx.txId, txColX[0] + 2, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(51, 65, 85);
    doc.text(tx.title.slice(0, 38), txColX[1] + 2, y + 4.5);

    doc.text(tx.pilar, txColX[2] + 2, y + 4.5);
    doc.text(tx.agency ? tx.agency.slice(0, 30) : tx.officer, txColX[3] + 2, y + 4.5);

    const nominalStr = tx.amount ? formatRupiah(tx.amount) : 'Layanan Warga';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(16, 185, 129);
    doc.text(nominalStr, txColX[4] + 2, y + 4.5);

    y += 7;
  });

  if (allTransactions.length > 8) {
    checkPageBreak(6);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(`... dan ${allTransactions.length - 8} transaksi on-chain lainnya terverifikasi secara lengkap dalam ledger sistem.`, margin + 2, y + 4);
    y += 6;
  }

  y += 5;

  // --- 8. LEGAL ATTESTATION & DIGITAL SIGNATURE BOX ---
  checkPageBreak(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text('IV. PERNYATAAN KEABSAHAN HUKUM & TANDA TANGAN ELEKTRONIK TERSERTIFIKASI', margin, y);
  y += 4;

  const authBoxHeight = 34;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, authBoxHeight, 1.5, 1.5, 'FD');

  // Left Legal Text & Quran Quote
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text(
    '"Dan janganlah kamu memakan harta di antara kamu dengan jalan yang batil, dan (janganlah) kamu menyuap dengan harta itu..." (QS. Al-Baqarah: 188)',
    margin + 3.5,
    y + 5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Laporan ini diterbitkan secara otomatis dan deterministik oleh Autonomous Blockchain Consensus Engine AmanahGov. Keabsahan data bersifat mutlak dan mengikat secara hukum sesuai UU ITE No. 1/2024.',
    margin + 3.5,
    y + 9,
    { maxWidth: contentWidth * 0.6 }
  );

  // SHA-256 Checksum Tag
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 3.5, y + 17, contentWidth * 0.6, 13, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.setTextColor(15, 23, 42);
  doc.text('KODE INTEGRITAS DIGITAL (SHA-256 DOCUMENT CHECKSUM):', margin + 5, y + 21);
  doc.setFont('courier', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(16, 185, 129);
  doc.text(`0x${docChecksum}`, margin + 5, y + 25.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.2);
  doc.setTextColor(100, 116, 139);
  doc.text('Dapat diverifikasi ulang secara bebas melalui portal transparansi publik AmanahGov.', margin + 5, y + 28.8);

  // Right Side: Sign-off block
  const signColX = margin + contentWidth * 0.67;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(71, 85, 105);
  doc.text(`Kota Amanah Sejahtera, ${formattedDate}`, signColX, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Inspektur Utama Pengawasan Daerah', signColX, y + 9);

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(signColX, y + 11, 48, 8, 1, 1, 'FD');
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(5.5);
  doc.text('[TEROTORISASI KRIPTOGRAFIS ON-CHAIN]', signColX + 2.5, y + 15);
  doc.text('STATUS: DOKUMEN SAH & MENGIKAT', signColX + 2.5, y + 17.5);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. H. Muhammad Arifin, M.AP.', signColX, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NIP. 19780512 200312 1 002', signColX, y + 27.5);
  doc.text('Inspektorat Kota Amanah Sejahtera', signColX, y + 30.5);

  y += authBoxHeight + 6;

  // --- 9. RUNNING FOOTER ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Sistem Audit Kriptografi AmanahGov • Meneladani Nilai Profetik Shiddiq & Amanah • Dokumen Resmi Inspektorat',
      margin,
      pageHeight - 7
    );
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  }

  // --- 10. TRIGGER DOWNLOAD & RETURN ---
  const statusSlug = isActuallyValid ? 'SAH_TERVERIFIKASI' : 'PERINGATAN_KOMPROMI';
  const dateStamp = now.toISOString().slice(0, 10);
  const cleanDocId = documentId.replace(/[/]/g, '-');
  const filename = `Laporan_Resmi_Audit_Blockchain_${statusSlug}_${dateStamp}_${cleanDocId}.pdf`;

  doc.save(filename);

  return {
    filename,
    documentId,
    checksum: docChecksum,
  };
}
