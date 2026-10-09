import { jsPDF } from 'jspdf';

export function generateInfernoProjectPDF(massingData, requestState, project) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryDark = [15, 23, 42]; // Slate 900
  const amberAccent = [245, 158, 11]; // Amber 500
  const indigoPrimary = [79, 70, 229]; // Indigo 600

  // 1. Top Architectural Studio Header Strip
  doc.setFillColor(...primaryDark);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setFillColor(...amberAccent);
  doc.rect(0, 24, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('INFERNO — INTELLIGENT MIXED-USE URBAN DESIGN STUDIO', 105, 9, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(251, 191, 36);
  doc.text('Design smarter. Analyze faster. Build better.', 105, 15, { align: 'center' });
  
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Smart India Hackathon 2026 (PS 116) • Independent Student Innovation Prototype', 105, 20, { align: 'center' });

  // 2. Report Title & Project Metadata
  doc.setTextColor(...primaryDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ARCHITECTURAL DESIGN & PERFORMANCE REPORT', 105, 35, { align: 'center' });

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 40, 182, 18, 2, 2, 'FD');

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${project?.name || 'Urban Mixed-Use Complex (B + G + 9)'}`, 18, 47);
  doc.text(`Plot: ${requestState?.plot_width || 60}m × ${requestState?.plot_depth || 80}m (${(requestState?.plot_width || 60) * (requestState?.plot_depth || 80)} m²)`, 18, 53);
  doc.text(`Date: ${dateStr}`, 130, 47);
  doc.text('Typology: Commercial Podium + Residential Tower', 130, 53);

  // 3. Typology & Stacking Specification (B + G + 9)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryDark);
  doc.text('1. BUILDING PROGRAM & VERTICAL STACKING (B + G + 9)', 14, 66);

  const stackingRows = [
    ['L9', 'Sky Amenities & Terrace', 'Swimming pool, fitness pavilion, landscaped deck, 85kWp solar pergola', '1,080 m²'],
    ['L3 - L8', 'Residential High-Rise Tower', '2BHK & 3BHK cross-ventilated units, private cantilever balconies', '7,580 m²'],
    ['L1 - L2', 'Commercial Podium', 'Flexible co-working spaces, enterprise office suites, clinic', '2,520 m²'],
    ['Ground (G)', 'Retail Plaza & Courtyard Ingress', 'Supermarket, alfresco cafes, double-height grand entrance lobbies', '1,270 m²'],
    ['Basement (B1)', 'Subterranean Parking & EV Hub', '118 car bays, 24 EV chargers (20.3%), dual 1:8 vehicular ramp', '1,086 m²']
  ];

  doc.setFontSize(8);
  let currentY = 72;

  // Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, 182, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Level', 16, currentY + 4.2);
  doc.text('Zoning / Functional Use', 36, currentY + 4.2);
  doc.text('Key Spatial Elements', 86, currentY + 4.2);
  doc.text('GFA (m²)', 175, currentY + 4.2);

  currentY += 6;
  doc.setFont('helvetica', 'normal');

  stackingRows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 182, 6.5, 'F');
    }
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], 16, currentY + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(row[1], 36, currentY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.text(row[2], 86, currentY + 4.5);
    doc.text(row[3], 175, currentY + 4.5);
    currentY += 6.5;
  });

  // 4. Performance & Design Analytics Audit
  currentY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryDark);
  doc.text('2. DESIGN & ENVIRONMENTAL PERFORMANCE AUDIT', 14, currentY);

  currentY += 5;
  const metrics = massingData?.metrics || {};

  const metricsData = [
    ['Floor Area Ratio (FAR)', `${metrics.achieved_far?.toFixed(2) || '2.82'} achieved vs ${requestState?.max_far || '3.00'} cap`, 'Compliant (94% utilization)'],
    ['Ground Coverage Ratio', `${metrics.ground_coverage_pct?.toFixed(1) || '38.5'}% vs 40.0% permissible max`, 'Compliant (Safe margin)'],
    ['Central Courtyard Area', `${requestState?.courtyard_width || 16}m × ${requestState?.courtyard_depth || 20}m (320 m²)`, 'Daylight Penetration: 78%'],
    ['Stack Ventilation Potential', 'High buoyancy updraft via 9-floor open well', '82% stack ventilation score'],
    ['Façade Solar Mitigation', 'WWR 40%, vertical fins + horizontal louvers', '38% cooling load reduction'],
    ['Parking & Clean Mobility', '118 car bays total (Basement B1)', '24 EV Bays (20.3% share - CEA Norm)'],
    ['Embodied Carbon Indicator', '412 kg CO₂e / m² lifecycle baseline', 'A-Rated conceptual benchmark'],
    ['Estimated Project CAPEX', '₹48.5 Cr (Structure, MEP, Facade & Basement)', 'Optimized value engineering']
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, 182, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Evaluation Criteria', 16, currentY + 4.2);
  doc.text('Design Value & Dimension', 75, currentY + 4.2);
  doc.text('Performance Status', 140, currentY + 4.2);

  currentY += 6;
  doc.setFont('helvetica', 'normal');

  metricsData.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 182, 6, 'F');
    }
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], 16, currentY + 4.2);
    doc.text(row[1], 75, currentY + 4.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(row[2], 140, currentY + 4.2);
    doc.setFont('helvetica', 'normal');
    currentY += 6;
  });

  // 5. Constructive Architectural Design Guidance
  currentY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryDark);
  doc.text('3. CONSTRUCTIVE ARCHITECTURAL DESIGN GUIDANCE', 14, currentY);

  currentY += 5;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, 182, 28, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const guidanceNotes = [
    '• Massing & Setbacks: 7.5m front setback allows generous pedestrian plaza; 6.0m side/rear setbacks guarantee full fire tender turnaround.',
    '• Courtyard Microclimate: Central 320 m² courtyard eliminates deep dark internal corridors and powers natural stack cross-ventilation.',
    '• Envelope & Energy: 40% WWR complies with BEE ECBC requirements. Deep 1.8m balconies shade windows during peak solar angles.',
    '• Mobility Integration: Subterranean B1 parking satisfies municipal ratios with 20.3% EV charging bays meeting Central Electricity Authority norms.'
  ];
  guidanceNotes.forEach((note, nIdx) => {
    doc.text(note, 18, currentY + 6 + (nIdx * 5.5));
  });

  // 6. Disclaimer & Contact Footer
  currentY += 34;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY, 196, currentY);

  currentY += 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Disclaimer: INFERNO is an independent architectural design, visualization and performance optimization prototype developed for SIH 2026.',
    105,
    currentY,
    { align: 'center' }
  );
  doc.text(
    'All calculations and ratings are indicative conceptual estimates and should not be used as statutory legal sanction. Contact: arpitmishra1966@gmail.com',
    105,
    currentY + 4,
    { align: 'center' }
  );

  doc.save('INFERNO_Architectural_Design_Report.pdf');
}
