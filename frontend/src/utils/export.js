import jsPDF from 'jspdf';
import { getRiskColor, getRiskLevel } from './formatters';

/**
 * Generates a PDF report from risk analysis results
 * @param {Object} enhancedResult - Enhanced result data with score, factors, recommendations
 * @param {Object} formData - Original form data (zip, day, hour, ampm)
 * @returns {jsPDF} PDF document instance
 */
export const generatePDF = (enhancedResult, formData) => {
  // Validate inputs
  if (!enhancedResult) {
    throw new Error('Enhanced result data is required');
  }
  if (!formData) {
    throw new Error('Form data is required');
  }
  if (!enhancedResult.analysis) {
    throw new Error('Analysis data is missing from result');
  }
  if (!enhancedResult.analysis.factors) {
    throw new Error('Risk factors data is missing');
  }
  if (!enhancedResult.analysis.recommendations) {
    throw new Error('Recommendations data is missing');
  }

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // Helper to add new page if needed
  const checkPageBreak = (neededSpace) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // ===== HEADER =====
  doc.setFillColor(17, 24, 39); // gray-900
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ParkSafe-LA', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Risk Analysis Report', pageWidth / 2, 38, { align: 'center' });

  yPosition = 60;

  // ===== TIMESTAMP =====
  doc.setTextColor(107, 114, 128); // gray-500
  doc.setFontSize(9);
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${timestamp}`, margin, yPosition);
  yPosition += 15;

  // ===== INPUT PARAMETERS SECTION =====
  doc.setTextColor(31, 41, 55); // gray-800
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Parameters', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81); // gray-700

  const params = [
    `Location: ZIP Code ${formData.zipcode || 'N/A'}`,
    `Day: ${formData.day_of_week || 'N/A'}`,
    `Time: ${formData.hour || 'N/A'}:00 ${formData.am_pm || 'N/A'}`,
  ];

  params.forEach((param) => {
    doc.text(param, margin + 5, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // ===== RISK SCORE SECTION =====
  checkPageBreak(40);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Risk Assessment', margin, yPosition);
  yPosition += 12;

  const riskScore = enhancedResult.riskPercentage || 0;
  const riskLevel = enhancedResult.riskLevel || 'Unknown';
  const riskColor = getRiskColor(riskScore);

  // Risk score box
  const boxHeight = 35;
  const boxY = yPosition;

  // Set color based on risk level
  let fillColor;
  if (riskLevel === 'High Risk') {
    fillColor = [239, 68, 68]; // red-500
  } else if (riskLevel === 'Medium Risk') {
    fillColor = [251, 146, 60]; // orange-400
  } else {
    fillColor = [34, 197, 94]; // green-500
  }

  doc.setFillColor(...fillColor);
  doc.roundedRect(margin, boxY, contentWidth, boxHeight, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Score', pageWidth / 2, boxY + 10, { align: 'center' });

  doc.setFontSize(28);
  doc.text(String(riskScore) + '%', pageWidth / 2, boxY + 22, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(riskLevel, pageWidth / 2, boxY + 30, { align: 'center' });

  yPosition += boxHeight + 15;

  // ===== RISK FACTORS SECTION =====
  checkPageBreak(50);

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Factor Breakdown', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);

  const factors = enhancedResult.analysis.factors;
  const factorsList = [
    { label: 'Location Risk', value: factors.location?.percentage || 0 },
    { label: 'Time of Day Risk', value: factors.timing?.percentage || 0 },
    { label: 'Day of Week Risk', value: factors.dayOfWeek?.percentage || 0 },
  ];

  factorsList.forEach((factor, index) => {
    checkPageBreak(15);

    doc.text(`${factor.label}:`, margin + 5, yPosition);

    // Draw progress bar
    const barWidth = 80;
    const barHeight = 6;
    const barX = margin + 70;
    const barY = yPosition - 4;

    // Background bar
    doc.setFillColor(229, 231, 235); // gray-200
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'F');

    // Filled bar
    const fillWidth = (barWidth * factor.value) / 100;
    doc.setFillColor(...fillColor);
    doc.roundedRect(barX, barY, fillWidth, barHeight, 2, 2, 'F');

    // Percentage text
    doc.text(String(factor.value) + '%', barX + barWidth + 5, yPosition);

    yPosition += 10;
  });

  yPosition += 10;

  // ===== RECOMMENDATIONS SECTION =====
  checkPageBreak(30);

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Safety Recommendations', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);

  enhancedResult.analysis.recommendations.forEach((rec, index) => {
    checkPageBreak(15);

    const bullet = '\u2022'; // Bullet point
    const text = `${bullet} ${rec}`;
    const lines = doc.splitTextToSize(text, contentWidth - 10);

    lines.forEach((line, lineIndex) => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 6;
    });

    yPosition += 2;
  });

  yPosition += 10;

  // ===== DISCLAIMER FOOTER =====
  checkPageBreak(25);

  doc.setFillColor(243, 244, 246); // gray-100
  doc.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.setFont('helvetica', 'italic');

  const disclaimer =
    'This risk assessment is based on historical data and should be used as a guide only. ' +
    'Always take appropriate safety precautions when parking your vehicle.';

  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 10);
  let disclaimerY = yPosition + 6;

  disclaimerLines.forEach((line) => {
    doc.text(line, margin + 5, disclaimerY);
    disclaimerY += 4;
  });

  // ===== PAGE FOOTER =====
  const footerY = pageHeight - 15;
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by ParkSafe-LA', pageWidth / 2, footerY, { align: 'center' });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, footerY, { align: 'right' });
  }

  return doc;
};

/**
 * Downloads the PDF report
 * @param {Object} enhancedResult - Enhanced result data
 * @param {Object} formData - Form data
 * @param {string} filename - Optional custom filename
 */
export const downloadPDF = (enhancedResult, formData, filename) => {
  const doc = generatePDF(enhancedResult, formData);

  const defaultFilename = `parksafe-report-${formData.zipcode}-${Date.now()}.pdf`;
  doc.save(filename || defaultFilename);
};
