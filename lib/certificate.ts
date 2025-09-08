import jsPDF from 'jspdf';

export interface CertificateData {
  studentName: string;
  studentEmail: string;
  quizTitle: string;
  score: number;
  completedAt: Date;
  certificateId: string;
}

// Generate a unique certificate ID
export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}

// Generate PDF certificate
export function generateCertificatePDF(data: CertificateData): void {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Background gradient-like effect (simulate with rectangles) ---
  doc.setFillColor(255, 251, 235); // soft golden base
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(255, 243, 200); // light golden overlay
  doc.rect(0, 0, pageWidth, pageHeight / 2, 'F');

  // --- Futuristic double border ---
  doc.setDrawColor(245, 158, 11); // golden
  doc.setLineWidth(4);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  doc.setDrawColor(217, 119, 6); // darker gold
  doc.setLineWidth(1.5);
  doc.rect(18, 18, pageWidth - 36, pageHeight - 36);

  // --- Placeholder for Logo ---
  doc.setDrawColor(200, 160, 60);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth / 2 - 20, 20, 40, 20); // placeholder box
  doc.setFontSize(10);
  doc.setTextColor(160, 120, 30);
  doc.text("LOGO", pageWidth / 2, 33, { align: "center" });

  // --- Title ---
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 70, { align: 'center' });

  // Subtitle
  doc.setFontSize(16);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 113, 108);
  doc.text('Decentralized Crypto Learning Platform', pageWidth / 2, 85, { align: 'center' });

  // Certificate ID
  doc.setFontSize(11);
  doc.setTextColor(130, 130, 130);
  doc.text(`Certificate ID: ${data.certificateId}`, pageWidth - 60, pageHeight - 25);

  // --- Main Content ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('This is to certify that', pageWidth / 2, 110, { align: 'center' });

  // Student name
  doc.setFontSize(28);
  doc.setFont('times', 'bold');
  doc.setTextColor(245, 158, 11); // golden
  doc.text(data.studentName, pageWidth / 2, 130, { align: 'center' });

  // Completion text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('has successfully completed the certification quiz', pageWidth / 2, 150, { align: 'center' });

  // Quiz title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`"${data.quizTitle}"`, pageWidth / 2, 170, { align: 'center' });

  // Score
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(`with a score of ${data.score}%`, pageWidth / 2, 190, { align: 'center' });

  // Date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const dateStr = data.completedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Completed on: ${dateStr}`, pageWidth / 2, 210, { align: 'center' });

  // --- Futuristic footer divider ---
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.line(80, pageHeight - 35, pageWidth - 80, pageHeight - 35);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('This certificate is digitally generated and verifiable on the blockchain.', pageWidth / 2, pageHeight - 25, { align: 'center' });
  doc.text('Crypto Learning Platform - Empowering Web3 Education', pageWidth / 2, pageHeight - 15, { align: 'center' });

  // Save
  doc.save(`certificate-${data.studentName.replace(/\s+/g, '-').toLowerCase()}-${data.quizTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}