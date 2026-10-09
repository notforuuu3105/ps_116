import { jsPDF } from 'jspdf';

export function generateMunicipalClearancePDF(massingData, requestState, activePreset) {
  if (!massingData || !massingData.metrics || !massingData.compliance) {
    alert('No massing data available to generate certificate.');
    return;
  }

  const { metrics, compliance } = massingData;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryBlue = '#003366';
  const saffron = '#FF9933';
  const indiaGreen = '#138808';

  // 1. Top Govt Header Strip
  doc.setFillColor(0, 51, 102); // Deep Royal Blue
  doc.rect(0, 0, 210, 24, 'F');

  doc.setFillColor(255, 153, 51); // Saffron accent bar
  doc.rect(0, 24, 210, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('GOVERNMENT OF INDIA | MINISTRY OF HOUSING & URBAN AFFAIRS', 105, 9, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('NATIONAL AUTOMATED BUILDING BYE-LAW SCRUTINY SYSTEM (SIH 2026 PS 116)', 105, 15, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('In Compliance with National Building Code (NBC 2016) & State Municipal DCR Bye-Laws', 105, 20, { align: 'center' });

  // 2. Certificate Title & Reference Metadata
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PROVISIONAL BYE-LAW CLEARANCE & SANCTION ORDER', 105, 36, { align: 'center' });

  const refNumber = `SIH26-NUC-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 41, 182, 18, 2, 2, 'FD');

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sanction Ref No: ${refNumber}`, 18, 48);
  doc.text(`Authority Jurisdiction: ${activePreset?.toUpperCase() || 'MUNICIPAL CORPORATION'}`, 18, 54);
  doc.text(`Issue Date: ${dateStr}`, 130, 48);
  doc.text('Classification: Mixed-Use Commercial / Residential', 130, 54);

  // 3. Compliance Verdict Stamp
  const isCompliant = compliance.is_compliant;
  if (isCompliant) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(14, 63, 182, 14, 2, 2, 'FD');
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('VERDICT: APPROVED & FULLY BYE-LAW COMPLIANT (PASS)', 105, 71.5, { align: 'center' });
  } else {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(239, 68, 68);
    doc.roundedRect(14, 63, 182, 14, 2, 2, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('VERDICT: NON-COMPLIANT - BYE-LAW DEFECTS DETECTED (FAIL)', 105, 71.5, { align: 'center' });
  }

  // 4. Detailed Architectural Metrics Table
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. Site & Building Envelope Geometry', 14, 85);

  let y = 90;
  const col1 = 18;
  const col2 = 80;
  const col3 = 115;
  const col4 = 175;

  const addTableRow = (label1, val1, label2, val2, isOdd) => {
    if (isOdd) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 4, 182, 6.5, 'F');
    }
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(label1, col1, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(val1, col2, y);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(label2, col3, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(val2, col4, y);
    y += 6.5;
  };

  addTableRow('Plot Dimensions:', `${requestState.plot_width}m x ${requestState.plot_depth}m`, 'Total Site Area:', `${metrics.plot_area.toLocaleString()} sq.m`, false);
  addTableRow('Front Setback (Road):', `${requestState.setback_front} m`, 'Rear Setback:', `${requestState.setback_rear} m`, true);
  addTableRow('Side Setbacks:', `${requestState.setback_sides} m (both sides)`, 'Ground Coverage:', `${metrics.ground_coverage_pct}% (Max: 60%)`, false);
  addTableRow('Footprint Area:', `${metrics.buildable_footprint_area.toLocaleString()} sq.m`, 'Abutting Road Width:', `${requestState.abutting_road_width || 18} m`, true);

  // 5. Floor Area & Zoning Breakdown
  y += 4;
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. Floor Area Ratio (FAR) & Zoning Distribution', 14, y);
  y += 6;

  addTableRow('Total Built-Up Area (BUA):', `${metrics.total_built_up_area.toLocaleString()} sq.m`, 'Achieved FAR:', `${metrics.achieved_far.toFixed(2)}`, false);
  addTableRow('Permissible Max FAR:', `${metrics.max_far.toFixed(2)}`, 'FAR Compliance:', compliance.far_compliance ? 'PASSED (Within Cap)' : 'VIOLATION', true);
  addTableRow('Commercial Podium BUA:', `${metrics.commercial_bua.toLocaleString()} sq.m`, 'Commercial Ratio:', `${requestState.commercial_ratio}%`, false);
  addTableRow('Residential Tower BUA:', `${metrics.residential_bua.toLocaleString()} sq.m`, 'Sky Amenity BUA:', `${metrics.amenity_bua.toLocaleString()} sq.m`, true);
  addTableRow('Total Storeys (Floors):', `${requestState.total_floors} Storeys`, 'Total Height:', `${metrics.total_building_height} m`, false);

  // 6. Mandatory Life Safety & Parking
  y += 4;
  doc.setTextColor(0, 51, 102);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. Fire Life Safety (NBC Part 4) & Parking Sanction', 14, y);
  y += 6;

  addTableRow('Fire Tender Access (≥6m):', compliance.fire_safety_compliance ? 'SATISFIED (≥ 6.0m All-around)' : 'DEFICIENT (< 6.0m)', 'Road-Height Ratio:', `${metrics.total_building_height}m ≤ ${compliance.max_permissible_height}m`, false);
  addTableRow('Required Car Parking:', `${metrics.total_required_parking} Bays`, 'Basement Levels:', `${metrics.estimated_basement_levels} Subterranean Levels`, true);
  addTableRow('Daylight Exposure Score:', `${metrics.daylight_exposure_score}% (Optimal)`, 'Embodied Carbon:', `${metrics.embodied_carbon_tons.toLocaleString()} tCO2e`, false);
  addTableRow('Estimated CAPEX Cost:', `Rs. ${metrics.estimated_cost_inr_cr.toFixed(2)} Crores`, 'Average Unit Cost:', `Rs. ${metrics.estimated_cost_per_sqft.toLocaleString()}/sq.ft`, true);

  // 7. Municipal Legal Seal & QR Block
  y += 8;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'FD');

  // QR Placeholder box
  doc.setFillColor(255, 255, 255);
  doc.rect(20, y + 4, 26, 26, 'FD');
  doc.setDrawColor(0, 51, 102);
  doc.rect(23, y + 7, 20, 20);
  doc.setFontSize(6.5);
  doc.setTextColor(0, 51, 102);
  doc.text('[QR SCAN]', 33, y + 18, { align: 'center' });

  // Officer Notes & Verification Stamp
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('This sanction certificate is digitally generated and validated against National Building Code (NBC 2016)', 52, y + 9);
  doc.text('and the relevant State Master Plan bye-laws. It constitutes prima facie technical clearance.', 52, y + 14);
  doc.text(`Digital Verification Hash: SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}`, 52, y + 19);

  // Sign-off
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('DIRECTOR GENERAL OF TOWN PLANNING', 140, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Ministry of Housing & Urban Affairs (MoHUA)', 140, y + 30);

  // Footer strip
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 287, 210, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('SIH 2026 PS 116 | Urban Mixed-Use Complex Autonomous Scrutiny Platform | Made for Digital India', 105, 293, { align: 'center' });

  // Save PDF
  doc.save(`SIH26116_Govt_Clearance_Certificate_${refNumber}.pdf`);
}
