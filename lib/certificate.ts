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
  
  // Background color (golden gradient effect)
  doc.setFillColor(255, 251, 235);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Border (golden)
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(3);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
  
  // Inner border (darker golden)
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40);
  
  // Title
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 50, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 113, 108);
  doc.text('Crypto Learning Platform', pageWidth / 2, 65, { align: 'center' });
  
  // Certificate ID
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Certificate ID: ${data.certificateId}`, pageWidth / 2, 80, { align: 'center' });
  
  // Main content
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text('This is to certify that', pageWidth / 2, 110, { align: 'center' });
  
  // Student name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(data.studentName, pageWidth / 2, 130, { align: 'center' });
  
  // Completion text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text('has successfully completed the quiz', pageWidth / 2, 150, { align: 'center' });
  
  // Quiz title
  doc.setFontSize(18);
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
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('This certificate is digitally generated and verifiable', pageWidth / 2, pageHeight - 30, { align: 'center' });
  doc.text('Crypto Learning Platform - Empowering Crypto Education', pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  // Download the PDF
  doc.save(`certificate-${data.studentName.replace(/\s+/g, '-').toLowerCase()}-${data.quizTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

// Generate HTML certificate (alternative to PDF)
export function generateCertificateHTML(data: CertificateData): string {
  const dateStr = data.completedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <div class="certificate-container">
      <div class="certificate">
        <div class="certificate-header">
          <h1>CERTIFICATE OF COMPLETION</h1>
          <p class="platform-name">Crypto Learning Platform</p>
          <p class="certificate-id">Certificate ID: ${data.certificateId}</p>
        </div>
        
        <div class="certificate-body">
          <p class="intro-text">This is to certify that</p>
          <h2 class="student-name">${data.studentName}</h2>
          <p class="completion-text">has successfully completed the quiz</p>
          <h3 class="quiz-title">"${data.quizTitle}"</h3>
          <p class="score-text">with a score of ${data.score}%</p>
          <p class="date-text">Completed on: ${dateStr}</p>
        </div>
        
        <div class="certificate-footer">
          <p>This certificate is digitally generated and verifiable</p>
          <p>Crypto Learning Platform - Empowering Crypto Education</p>
        </div>
      </div>
    </div>
  `;
}
