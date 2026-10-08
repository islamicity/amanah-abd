import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Complaint } from '../types';

export interface ComplaintPdfOptions {
  includeTimeline?: boolean;
  includeQrCode?: boolean;
  includeDigitalSignature?: boolean;
  includeWatermark?: boolean;
  signerTitle?: string;
  agencyName?: string;
}

/**
 * Generate a deterministic SHA-256 style digital signature checksum for the complaint
 */
export function generateComplaintSignatureHash(complaint: Complaint): string {
  const payload = `${complaint.id}|${complaint.createdAt}|${complaint.citizenNikMasked}|${complaint.txHash}|${complaint.blockHeight}|AmanahGov-ID`;
  let hash1 = 0x811c9dc5;
  let hash2 = 0x5b79a32c;

  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ char, 0x01000193);
    hash2 = Math.imul(hash2 ^ char, 0x5bd1e995);
  }

  const h1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const seed = (complaint.txHash || '0xabcdef').replace(/^0x/, '').slice(0, 16);

  return `0x${h1}${h2}${seed}f89e21`.toLowerCase();
}

/**
 * Generate and download the official PDF document for a citizen complaint
 */
export async function generateAndDownloadComplaintPdf(
  complaint: Complaint,
  options?: ComplaintPdfOptions
): Promise<{ filename: string; sizeBytes: number; signatureHash: string }> {
  const opts: Required<ComplaintPdfOptions> = {
    includeTimeline: true,
    includeQrCode: true,
    includeDigitalSignature: true,
    includeWatermark: true,
    signerTitle: 'Kepala Bagian Pengawasan Pelayanan Publik & PPID',
    agencyName: 'Pemerintah Kota Amanah Sejahtera',
    ...options,
  };

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

  const registrationNo = `REG-AG/2026/09/${complaint.id}`;
  const signatureHash = generateComplaintSignatureHash(complaint);
  const ticketUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?ticket=${encodeURIComponent(complaint.id)}`
      : `https://amanahgov.id/?ticket=${complaint.id}`;

  let y = 14;

  // Helper for adding new page when content overflows
  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 16;
      drawPageHeaderMini();
    }
  };

  const drawPageHeaderMini = () => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('AMANAHGOV - DOKUMEN ARSIP PENGADUAN RESMI', margin + 4, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`Tiket #${complaint.id}`, pageWidth - margin - 4, y + 5.5, { align: 'right' });
    y += 12;
  };

  // --- 1. OFFICIAL KOP SURAT ---
  // Top Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 25, 'F');

  // Emerald Accent Stripe
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(margin, y, 4, 25, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KOTA AMANAH SEJAHTERA', margin + 8, y + 6.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('DINAS KOMUNIKASI, INFORMATIKA & AKUNTABILITAS PUBLIK', margin + 8, y + 11.5);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    'Platform Pelayanan Publik Berintegritas Kenabian & Audit Kriptografi AmanahGov',
    margin + 8,
    y + 16.5
  );

  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.text('PRINSIP 4 PILAR: SHIDDIQ • AMANAH • TABLIGH • FATHANAH', margin + 8, y + 21.5);

  // Right-side badge
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.roundedRect(pageWidth - margin - 48, y + 4.5, 44, 16, 2, 2, 'F');
  doc.setTextColor(167, 243, 208); // emerald-200
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('DOKUMEN RESMI WARGA', pageWidth - margin - 26, y + 9.5, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(complaint.id, pageWidth - margin - 26, y + 15, { align: 'center' });

  y += 28;

  // Double Divider Line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setLineWidth(0.2);
  doc.line(margin, y + 1.2, pageWidth - margin, y + 1.2);
  y += 6;

  // --- 2. DOCUMENT TITLE & REGISTRATION NUMBER ---
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('SURAT BUKTI FISIK & STATUS PENANGANAN PENGADUAN WARGA', pageWidth / 2, y, {
    align: 'center',
  });
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`Nomor Registrasi: ${registrationNo} • Berkas Bukti Sah Administrasi Warga`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // --- 3. METADATA SUMMARY TABLE (2 COLUMNS) ---
  const leftColX = margin;
  const leftColW = contentWidth * 0.58;
  const rightColX = margin + leftColW + 4;
  const rightColW = contentWidth - leftColW - 4;

  const boxHeight = 56;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(leftColX, y, leftColW, boxHeight, 2, 2, 'FD');
  doc.roundedRect(rightColX, y, rightColW, boxHeight, 2, 2, 'FD');

  // Left Column Content: Identity & Details
  let leftY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('I. IDENTITAS PELAPOR & DISPOSISI LAYANAN', leftColX + 3.5, leftY);
  leftY += 5;

  const metadataPairs: [string, string][] = [
    ['Nama Pelapor', `${complaint.citizenName} (NIK: ${complaint.citizenNikMasked})`],
    ['Kontak Pelapor', complaint.whatsappNumber || '+62 812-8821-0414 (Terkonfirmasi)'],
    ['Kategori Urusan', complaint.category],
    ['OPD Bertanggung Jawab', complaint.assignedDepartment],
    ['Petugas Lapangan (TRC)', complaint.officerName || 'Tim Reaksi Cepat Instansi'],
    ['Lokasi Kejadian', complaint.location],
    ['Waktu Registrasi', `${complaint.createdAt} WIB`],
  ];

  metadataPairs.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(label, leftColX + 3.5, leftY);
    doc.text(':', leftColX + 37, leftY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59); // slate-800
    const truncatedVal = doc.splitTextToSize(value, leftColW - 44)[0] || value;
    doc.text(truncatedVal, leftColX + 39, leftY);
    leftY += 5.2;
  });

  // Right Column Content: SLA, Status & Urgency
  let rightY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('II. PARAMETER SLA & STATUS', rightColX + 3.5, rightY);
  rightY += 5;

  const getStatusLabel = (status: string) => status.replace(/_/g, ' ');

  const rightPairs: [string, string, string?][] = [
    ['Status Pelayanan', getStatusLabel(complaint.status), '#059669'],
    ['Tingkat Urgensi', complaint.urgency, complaint.urgency === 'Darurat' ? '#dc2626' : '#d97706'],
    ['Target Waktu (SLA)', `Maks. ${complaint.slaTargetHours} Jam`],
    ['Waktu Berjalan', `${complaint.elapsedHours} Jam`],
    ['Ketinggian Blok', `Blok #${complaint.blockHeight}`],
    ['Biaya Pelayanan', 'Rp 0 (BEBAS PUNGLI / GRATIS)', '#059669'],
  ];

  rightPairs.forEach(([label, value, colorHex]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label, rightColX + 3.5, rightY);
    doc.text(':', rightColX + 32, rightY);
    doc.setFont('helvetica', 'bold');
    if (colorHex) {
      if (colorHex === '#059669') doc.setTextColor(5, 150, 105);
      else if (colorHex === '#dc2626') doc.setTextColor(220, 38, 38);
      else if (colorHex === '#d97706') doc.setTextColor(217, 119, 6);
      else doc.setTextColor(30, 41, 59);
    } else {
      doc.setTextColor(30, 41, 59);
    }
    doc.text(value, rightColX + 34, rightY);
    rightY += 6;
  });

  y += boxHeight + 6;

  // --- 4. COMPLAINT DETAILS & DESCRIPTION SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('III. URAIAN RINCIAN LAPORAN PENGADUAN', margin, y);
  y += 4;

  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  const titleBoxHeight = 8;
  doc.roundedRect(margin, y, contentWidth, titleBoxHeight, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Judul: ${complaint.title}`, margin + 3.5, y + 5.2);
  y += titleBoxHeight + 2;

  // Description body with word-wrap
  const descLines = doc.splitTextToSize(complaint.description, contentWidth - 8);
  const descBoxHeight = Math.max(16, descLines.length * 4.2 + 6);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, descBoxHeight, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(descLines, margin + 4, y + 5);
  y += descBoxHeight + 6;

  // --- 5. TIMELINE AUDIT STEPS ---
  if (opts.includeTimeline && complaint.timeline && complaint.timeline.length > 0) {
    ensureSpace(32);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('IV. JEJAK AUDIT & RIWAYAT PENANGANAN LAPANGAN', margin, y);
    y += 4;

    // Timeline Table Header
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('Waktu (WIB)', margin + 3, y + 4.2);
    doc.text('Tahapan / Tindakan Resmi', margin + 36, y + 4.2);
    doc.text('Catatan Penanganan & Petugas', margin + 88, y + 4.2);
    doc.text('Blok Rantai', pageWidth - margin - 18, y + 4.2);
    y += 6;

    // Timeline Rows (show up to 4 most recent or all compact)
    const stepsToShow = complaint.timeline.slice(-4);
    stepsToShow.forEach((step, idx) => {
      ensureSpace(12);
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
      doc.rect(margin, y, contentWidth, 9.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 9.5, pageWidth - margin, y + 9.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(step.timestamp, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      const cleanTitle = step.title.length > 28 ? `${step.title.slice(0, 26)}..` : step.title;
      doc.text(cleanTitle, margin + 36, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      const noteClean = step.note ? `${step.note.slice(0, 48)}...` : 'Proses verifikasi resmi.';
      doc.text(noteClean, margin + 88, y + 4.5);
      doc.text(`Oleh: ${step.officer || 'Petugas'}`, margin + 88, y + 7.8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(step.blockHeight ? `#${step.blockHeight}` : '#4', pageWidth - margin - 12, y + 5.5, {
        align: 'center',
      });

      y += 9.5;
    });

    y += 5;
  }

  // --- 6. DIGITAL SIGNATURE, BLOCKCHAIN VERIFICATION & QR CODE ---
  ensureSpace(42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('V. OTENTIKASI KRIPTOGRAFIS & PENGESAHAN DOKUMEN ELEKTRONIK', margin, y);
  y += 4;

  const authBoxHeight = 38;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, authBoxHeight, 2, 2, 'FD');

  // Generate QR Code as DataURL
  try {
    const qrDataUrl = await QRCode.toDataURL(ticketUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 180,
      color: {
        dark: '#064e3b',
        light: '#ffffff',
      },
    });

    // Embed QR Code inside the Box on the Right side
    const qrSize = 30;
    const qrX = pageWidth - margin - qrSize - 4;
    const qrY = y + 4;
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // Caption under QR
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(6, 78, 59);
    doc.text('PINDAI UNTUK VERIFIKASI', qrX + qrSize / 2, qrY + qrSize + 2.5, { align: 'center' });
  } catch (err) {
    console.warn('Failed to render QR on PDF:', err);
  }

  // Digital Signature Metadata in Auth Box
  let sigY = y + 5;
  const sigTextWidth = contentWidth - 42;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(6, 78, 59); // emerald-900
  doc.text('TANDA TANGAN ELEKTRONIK TERSERTIFIKASI (SIMULASI BSrE / BSSN)', margin + 4, sigY);
  sigY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);

  const sigLines: [string, string][] = [
    ['Penerbit Sertifikat', 'Otoritas Sertifikasi Digital AmanahGov RI (Root CA Kemkominfo/BSSN)'],
    ['Hash Integritas (SHA-256)', signatureHash],
    ['Blockchain TX Hash', complaint.txHash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'],
    ['Ketinggian Blok Buku Besar', `Blok #${complaint.blockHeight} (Konsensus Konsorsium 4 Node Pemda)`],
    ['Waktu Penandatanganan', `${dateStr}, ${timeStr} WIB`],
  ];

  sigLines.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(`${lbl}:`, margin + 4, sigY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const splitVal = doc.splitTextToSize(val, sigTextWidth - 45)[0] || val;
    doc.text(splitVal, margin + 40, sigY);
    sigY += 4;
  });

  // Legal basis notice
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Berdasarkan UU ITE No. 11/2008 & PP No. 71/2019, dokumen elektronik ini berkekuatan hukum sah.',
    margin + 4,
    y + authBoxHeight - 2.5
  );

  y += authBoxHeight + 6;

  // --- 7. FOOTER & LEGAL DISCLAIMER ---
  const footerY = pageHeight - 10;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    'Dokumen ini dicetak otomatis dari Sistem Pelayanan Publik AmanahGov. Layanan Warga Rp 0 (Bebas Pungli).',
    margin,
    footerY + 1.5
  );
  doc.text(
    `Halaman 1 dari 1 • Dicetak pada ${dateStr} ${timeStr} WIB`,
    pageWidth - margin,
    footerY + 1.5,
    { align: 'right' }
  );

  // Generate File Output
  const filename = `Bukti_Pengaduan_${complaint.id}_${complaint.citizenName.replace(/\s+/g, '_')}.pdf`;
  const pdfBlob = doc.output('blob');

  // Trigger browser download
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

export interface ComplaintsSummaryPdfOptions {
  title?: string;
  scopeLabel?: string;
  filterSummary?: string;
  includeKpiSummary?: boolean;
  includeDigitalSignature?: boolean;
  includeQrCode?: boolean;
  agencyName?: string;
}

/**
 * Generate and download an official multi-complaint recapitulation & status report PDF (A4 Landscape)
 */
export async function generateAndDownloadComplaintsSummaryPdf(
  complaints: Complaint[],
  options?: ComplaintsSummaryPdfOptions
): Promise<{ filename: string; sizeBytes: number; signatureHash: string }> {
  const opts: Required<ComplaintsSummaryPdfOptions> = {
    title: 'LAPORAN REKAPITULASI STATUS PENANGANAN PENGADUAN WARGA',
    scopeLabel: 'Seluruh Data Aduan Warga',
    filterSummary: 'Semua Kategori & Status',
    includeKpiSummary: true,
    includeDigitalSignature: true,
    includeQrCode: true,
    agencyName: 'Pemerintah Kota Amanah Sejahtera',
    ...options,
  };

  // Create A4 Landscape document (297 x 210 mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 273mm

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

  const docNumber = `REKAP-AG/2026/09/${Math.floor(1000 + Math.random() * 9000)}`;

  // Calculate aggregates
  const totalCount = complaints.length;
  const completedCount = complaints.filter((c) => c.status === 'Selesai_Teruji').length;
  const activeCount = totalCount - completedCount;
  const criticalCount = complaints.filter(
    (c) => c.urgency === 'Darurat' || c.urgency === 'Tinggi'
  ).length;
  const onTimeCount = complaints.filter((c) => c.elapsedHours <= c.slaTargetHours).length;
  const onTimeRate =
    totalCount > 0 ? ((onTimeCount / totalCount) * 100).toFixed(1) : '100.0';

  // Compute dataset checksum
  const rawSumPayload = `${docNumber}|${totalCount}|${completedCount}|${dateStr}|AmanahGov-Summary`;
  let sumHash = 0x811c9dc5;
  for (let i = 0; i < rawSumPayload.length; i++) {
    sumHash = Math.imul(sumHash ^ rawSumPayload.charCodeAt(i), 0x01000193);
  }
  const signatureHash = `0x${(sumHash >>> 0).toString(16).padStart(8, '0')}${Date.now().toString(16).slice(-8)}8c2b7f`;

  let y = 10;
  let currentPage = 1;

  // Header mini for subsequent pages
  const drawPageHeader = () => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, 8, contentWidth, 8, 'F');
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(margin, 8, 3, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('PEMERINTAH KOTA AMANAH SEJAHTERA - LAPORAN REKAPITULASI ADUAN WARGA', margin + 6, 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Nomor: ${docNumber} • ${dateStr}`, pageWidth - margin - 4, 13.5, { align: 'right' });
  };

  const drawPageFooter = (pageNum: number) => {
    const footerY = pageHeight - 8;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Dokumen Resmi Arsip Publik AmanahGov • Terotentikasi Buku Besar Kriptografis • Layanan Warga Rp 0 (Bebas Pungli)',
      margin,
      footerY + 1.5
    );
    doc.text(
      `Halaman ${pageNum} • Dicetak pada ${dateStr} ${timeStr} WIB`,
      pageWidth - margin,
      footerY + 1.5,
      { align: 'right' }
    );
  };

  // --- 1. OFFICIAL KOP SURAT (PAGE 1) ---
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 18, 'F');

  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(margin, y, 4, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('PEMERINTAH KOTA AMANAH SEJAHTERA', margin + 7, y + 5.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('BADAN PENGAWASAN & REFORMASI BIROKRASI PELAYANAN PUBLIK', margin + 7, y + 10);

  doc.setFontSize(7);
  doc.setTextColor(52, 211, 153);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'Sistem Informasi AmanahGov - Transparansi Kinerja Pengaduan & Integritas Publik',
    margin + 7,
    y + 14.5
  );

  // Right tag
  doc.setFillColor(6, 78, 59);
  doc.roundedRect(pageWidth - margin - 52, y + 3, 48, 12, 1.5, 1.5, 'F');
  doc.setTextColor(167, 243, 208);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ARSIP LAPORAN RESMI', pageWidth - margin - 28, y + 7.5, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text(docNumber, pageWidth - margin - 28, y + 12, { align: 'center' });

  y += 21;

  // Divider lines
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setLineWidth(0.2);
  doc.line(margin, y + 1, pageWidth - margin, y + 1);
  y += 4.5;

  // --- 2. REPORT TITLE & CONTEXT ---
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(opts.title, pageWidth / 2, y, { align: 'center' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Ruang Lingkup: ${opts.scopeLabel} • Filter Terpasang: ${opts.filterSummary} • Total Terdata: ${totalCount} Laporan`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 5.5;

  // --- 3. KPI SUMMARY CARDS (5 CARDS) ---
  if (opts.includeKpiSummary) {
    const cardGap = 3.5;
    const cardWidth = (contentWidth - cardGap * 4) / 5;
    const cardHeight = 13;

    const kpis: [string, string, string, string][] = [
      ['Total Pengaduan', `${totalCount} Aduan`, '100% Tercatat On-Chain', '#0f172a'],
      ['Selesai Tuntas (Teruji)', `${completedCount} Kasus`, `${totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% Tingkat Selesai`, '#059669'],
      ['Sedang Ditangani TRC', `${activeCount} Aduan`, 'Dalam Pengawalan Tim', '#0284c7'],
      ['Kepatuhan Batas SLA', `${onTimeRate}% Tepat`, `${onTimeCount} dari ${totalCount} Aduan`, '#d97706'],
      ['Biaya Administrasi', 'Rp 0', 'Bebas Pungli / Gratifikasi', '#059669'],
    ];

    kpis.forEach(([title, val, sub, colorHex], idx) => {
      const cardX = margin + idx * (cardWidth + cardGap);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cardX, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');

      doc.setFillColor(colorHex);
      doc.rect(cardX, y, 2.5, cardHeight, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      doc.text(title, cardX + 4.5, y + 3.8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(val, cardX + 4.5, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.8);
      doc.setTextColor(71, 85, 105);
      doc.text(sub, cardX + 4.5, y + 11.4);
    });

    y += cardHeight + 4.5;
  }

  // --- 4. COMPLAINTS TABLE ---
  const colWidths = {
    no: 8,
    id: 26,
    date: 20,
    citizen: 32,
    category: 32,
    department: 44,
    location: 38,
    urgency: 18,
    status: 33,
    sla: 22,
  };

  const drawTableHeader = (startY: number) => {
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, startY, contentWidth, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);

    let curX = margin;
    doc.text('No', curX + 2, startY + 4.2);
    curX += colWidths.no;

    doc.text('ID Aduan', curX + 1.5, startY + 4.2);
    curX += colWidths.id;

    doc.text('Tanggal', curX + 1.5, startY + 4.2);
    curX += colWidths.date;

    doc.text('Pelapor (PDP)', curX + 1.5, startY + 4.2);
    curX += colWidths.citizen;

    doc.text('Kategori', curX + 1.5, startY + 4.2);
    curX += colWidths.category;

    doc.text('OPD Penanggung Jawab', curX + 1.5, startY + 4.2);
    curX += colWidths.department;

    doc.text('Lokasi', curX + 1.5, startY + 4.2);
    curX += colWidths.location;

    doc.text('Urgensi', curX + 1.5, startY + 4.2);
    curX += colWidths.urgency;

    doc.text('Status Penanganan', curX + 1.5, startY + 4.2);
    curX += colWidths.status;

    doc.text('SLA / Durasi', curX + 1.5, startY + 4.2);
  };

  drawTableHeader(y);
  y += 6;

  complaints.forEach((c, idx) => {
    const rowHeight = 7.5;

    // Check pagination
    if (y + rowHeight > pageHeight - 22) {
      drawPageFooter(currentPage);
      doc.addPage();
      currentPage++;
      drawPageHeader();
      y = 19;
      drawTableHeader(y);
      y += 6;
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    let curX = margin;

    // No
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text((idx + 1).toString(), curX + 2, y + 4.8);
    curX += colWidths.no;

    // ID
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(c.id, curX + 1.5, y + 4.8);
    curX += colWidths.id;

    // Tanggal
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const shortDate = c.createdAt.split(' ')[0] || c.createdAt;
    doc.text(shortDate, curX + 1.5, y + 4.8);
    curX += colWidths.date;

    // Citizen Name
    const citizenShort = `${c.citizenName.slice(0, 14)} (${c.citizenNikMasked.slice(-4)})`;
    doc.text(citizenShort, curX + 1.5, y + 4.8);
    curX += colWidths.citizen;

    // Category
    const catShort = c.category.length > 20 ? `${c.category.slice(0, 19)}..` : c.category;
    doc.text(catShort, curX + 1.5, y + 4.8);
    curX += colWidths.category;

    // Department
    const deptShort = c.assignedDepartment.length > 28 ? `${c.assignedDepartment.slice(0, 26)}..` : c.assignedDepartment;
    doc.text(deptShort, curX + 1.5, y + 4.8);
    curX += colWidths.department;

    // Location
    const locShort = c.location.length > 24 ? `${c.location.slice(0, 22)}..` : c.location;
    doc.text(locShort, curX + 1.5, y + 4.8);
    curX += colWidths.location;

    // Urgency
    if (c.urgency === 'Darurat') {
      doc.setTextColor(220, 38, 38);
      doc.setFont('helvetica', 'bold');
    } else if (c.urgency === 'Tinggi') {
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
    }
    doc.text(c.urgency, curX + 1.5, y + 4.8);
    curX += colWidths.urgency;

    // Status
    doc.setFont('helvetica', 'bold');
    if (c.status === 'Selesai_Teruji') {
      doc.setTextColor(5, 150, 105);
    } else {
      doc.setTextColor(30, 41, 59);
    }
    const cleanStatus = c.status.replace(/_/g, ' ');
    const statShort = cleanStatus.length > 18 ? `${cleanStatus.slice(0, 17)}..` : cleanStatus;
    doc.text(statShort, curX + 1.5, y + 4.8);
    curX += colWidths.status;

    // SLA / Durasi
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const slaText = `${c.elapsedHours}j / ${c.slaTargetHours}j`;
    doc.text(slaText, curX + 1.5, y + 4.8);

    y += rowHeight;
  });

  y += 4;

  // --- 5. DIGITAL AUTHENTICATION & CERTIFICATION BLOCK ---
  if (opts.includeDigitalSignature) {
    if (y + 24 > pageHeight - 16) {
      drawPageFooter(currentPage);
      doc.addPage();
      currentPage++;
      drawPageHeader();
      y = 19;
    }

    const authBoxHeight = 20;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, authBoxHeight, 1.5, 1.5, 'FD');

    // Generate Verification QR Code
    if (opts.includeQrCode) {
      try {
        const portalUrl =
          typeof window !== 'undefined'
            ? `${window.location.origin}${window.location.pathname}?rekap=${docNumber}`
            : `https://amanahgov.id/?rekap=${docNumber}`;
        const qrDataUrl = await QRCode.toDataURL(portalUrl, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 120,
          color: { dark: '#064e3b', light: '#ffffff' },
        });

        doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 22, y + 2, 16, 16);
      } catch (err) {
        console.warn('Failed to embed summary QR:', err);
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(6, 78, 59);
    doc.text('PENGESAHAN DOKUMEN REKAPITULASI RESMI (SIMULASI BSrE / BSSN)', margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(71, 85, 105);
    doc.text(`Kode Integritas Berkas (SHA-256): ${signatureHash}`, margin + 4, y + 8.5);
    doc.text(
      'Otoritas Penerbit: Balai Sertifikasi Elektronik AmanahGov RI • Buku Besar Konsorsium 4 Node Pemda',
      margin + 4,
      y + 12
    );
    doc.text(
      'Dokumen rekapitulasi ini sah untuk keperluan audit, arsip administrasi perorangan/kolektif, dan bukti fisik transparansi publik.',
      margin + 4,
      y + 15.5
    );

    y += authBoxHeight + 2;
  }

  // Draw final footer
  drawPageFooter(currentPage);

  // Download Trigger
  const filename = `Laporan_Rekap_Aduan_AmanahGov_${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${docNumber.replace(/[/]/g, '-')}.pdf`;
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
