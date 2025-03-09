import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ClimateData, DownloadOptions } from '../components/DataActions/types';

function formatMetricName(metric: string): string {
  switch(metric) {
    case 'temperature': return 'Temperature (°C)';
    case 'precipitation': return 'Precipitation Change (%)';
    case 'seaLevel': return 'Sea Level Rise (cm)';
    case 'extremeEvents': return 'Extreme Events Increase (%)';
    default: return metric;
  }
}

function generateCSV(data: ClimateData[], options: DownloadOptions): string {
  const currentData = data[data.length - 1];
  
  const metadata = [
    'Climate Analysis Report',
    `Region: ${options.region}`,
    `Analysis Period: ${options.yearRange.start} - ${options.yearRange.end}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'Current Climate Metrics:',
    ...options.metrics.map(metric => 
      `${formatMetricName(metric)}: ${currentData[metric as keyof ClimateData].toFixed(2)}`
    ),
    '',
    'Historical Data:',
    ''
  ];

  // Add headers for historical data
  const headers = ['Year', ...options.metrics.map(formatMetricName)];
  
  // Add historical data rows
  const rows = data.map(row => [
    row.year,
    ...options.metrics.map(m => row[m as keyof ClimateData].toFixed(2))
  ]);
  
  return [
    ...metadata,
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

function generatePDF(data: ClimateData[], options: DownloadOptions): Blob {
  const doc = new jsPDF();
  const currentData = data[data.length - 1];
  
  // Title
  doc.setFontSize(24);
  doc.text('Climate Analysis Report', 20, 20);
  
  // Report metadata
  doc.setFontSize(12);
  doc.text(`Region: ${options.region}`, 20, 35);
  doc.text(`Analysis Period: ${options.yearRange.start} - ${options.yearRange.end}`, 20, 45);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 55);
  
  // Current Metrics Section
  doc.setFontSize(16);
  doc.text('Current Climate Metrics', 20, 75);
  
  doc.setFontSize(12);
  let yPos = 85;
  options.metrics.forEach((metric, index) => {
    const value = currentData[metric as keyof typeof currentData];
    doc.text(`${formatMetricName(metric)}: ${value.toFixed(2)}`, 30, yPos + (index * 10));
  });
  
  // Regional Impact Section
  yPos += options.metrics.length * 10 + 20;
  doc.setFontSize(16);
  doc.text('Regional Impact Analysis', 20, yPos);
  
  doc.setFontSize(12);
  yPos += 10;
  doc.text('Key Findings:', 30, yPos);
  yPos += 10;
  
  const findings = [
    `Temperature trends show a ${currentData.temperature > 1.5 ? 'significant' : 'moderate'} increase`,
    `Precipitation patterns indicate ${currentData.precipitation > 10 ? 'major' : 'minor'} changes`,
    `Sea level projections suggest ${currentData.seaLevel > 20 ? 'critical' : 'notable'} coastal impacts`
  ];
  
  findings.forEach((finding, index) => {
    doc.text(`• ${finding}`, 35, yPos + (index * 10));
  });
  
  // Historical Data Table
  yPos += findings.length * 10 + 20;
  doc.setFontSize(16);
  doc.text('Historical Data Trends', 20, yPos);
  
  const headers = [
    'Year',
    ...options.metrics.map(formatMetricName)
  ];
  
  const rows = data.map(row => [
    row.year.toString(),
    ...options.metrics.map(m => row[m as keyof typeof row].toFixed(2))
  ]);
  
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: yPos + 10,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Recommendations Section
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Climate Action Recommendations', 20, 20);
  
  doc.setFontSize(12);
  const recommendations = [
    {
      title: 'Temperature Management:',
      actions: [
        currentData.temperature > 1.5 
          ? 'Implement immediate heat mitigation strategies'
          : 'Monitor temperature trends and prepare contingency plans'
      ]
    },
    {
      title: 'Precipitation Adaptation:',
      actions: [
        currentData.precipitation > 10
          ? 'Develop flood management infrastructure'
          : 'Update water management systems'
      ]
    },
    {
      title: 'Coastal Protection:',
      actions: [
        currentData.seaLevel > 20
          ? 'Prioritize coastal defense infrastructure'
          : 'Develop long-term coastal adaptation plans'
      ]
    }
  ];
  
  let recYPos = 40;
  recommendations.forEach(rec => {
    doc.setFontSize(14);
    doc.text(rec.title, 30, recYPos);
    doc.setFontSize(12);
    rec.actions.forEach((action, index) => {
      doc.text(`• ${action}`, 35, recYPos + 10 + (index * 10));
    });
    recYPos += 30 + (rec.actions.length * 10);
  });
  
  return doc.output('blob');
}

function generateExcel(data: ClimateData[], options: DownloadOptions): string {
  const currentData = data[data.length - 1];
  
  const metadata = [
    'Climate Analysis Report',
    `Region: ${options.region}`,
    `Analysis Period: ${options.yearRange.start} - ${options.yearRange.end}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'Current Climate Metrics:',
    ...options.metrics.map(metric => 
      `${formatMetricName(metric)}: ${currentData[metric as keyof ClimateData].toFixed(2)}`
    ),
    '',
    'Regional Impact Analysis:',
    `• Temperature Impact: ${currentData.temperature > 1.5 ? 'High' : 'Moderate'}`,
    `• Precipitation Change: ${currentData.precipitation > 10 ? 'Significant' : 'Moderate'}`,
    `• Sea Level Risk: ${currentData.seaLevel > 20 ? 'Critical' : 'Moderate'}`,
    '',
    'Historical Data:',
    ''
  ];

  const headers = ['Year', ...options.metrics.map(formatMetricName)];
  
  const rows = data.map(row => [
    row.year,
    ...options.metrics.map(m => row[m as keyof ClimateData].toFixed(2))
  ]);

  return [
    ...metadata,
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

export function downloadData(data: ClimateData[], options: DownloadOptions) {
  let content: string | Blob;
  let mimeType: string;
  let extension: string;

  switch (options.format) {
    case 'csv':
      content = generateCSV(data, options);
      mimeType = 'text/csv';
      extension = 'csv';
      break;
    case 'pdf':
      content = generatePDF(data, options);
      mimeType = 'application/pdf';
      extension = 'pdf';
      break;
    case 'excel':
      content = generateExcel(data, options);
      mimeType = 'application/vnd.ms-excel';
      extension = 'xls';
      break;
    default:
      throw new Error('Unsupported format');
  }

  const filename = `climate_analysis_${options.region.toLowerCase().replace(/\s+/g, '_')}_${options.yearRange.start}-${options.yearRange.end}.${extension}`;
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateClimateData(
  startYear: number,
  endYear: number,
  region: string
): ClimateData[] {
  const data: ClimateData[] = [];
  const baseTemp = 1.1;
  const maxTemp = 1.6;
  const yearRange = endYear - startYear;
  
  // Regional factors to add variation
  const factors = {
    temperature: 1 + Math.random() * 0.3,
    precipitation: 1 + Math.random() * 0.4,
    seaLevel: 1 + Math.random() * 0.2,
    extremeEvents: 1 + Math.random() * 0.5
  };
  
  for (let year = startYear; year <= endYear; year++) {
    const progress = (year - startYear) / yearRange;
    
    // Add some natural variation
    const variation = Math.sin(year * 0.5) * 0.1;
    
    const temperature = (baseTemp + (maxTemp - baseTemp) * progress + variation) * factors.temperature;
    const precipitation = (15 * progress + variation * 5) * factors.precipitation;
    const seaLevel = (26 * progress) * factors.seaLevel;
    const extremeEvents = (32 * progress + variation * 10) * factors.extremeEvents;
    
    data.push({
      year,
      temperature,
      precipitation,
      seaLevel,
      extremeEvents
    });
  }
  
  return data;
}