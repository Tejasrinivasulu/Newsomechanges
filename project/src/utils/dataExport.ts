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
  const headers = [
    'Year',
    ...options.metrics.map(formatMetricName)
  ];
  
  const rows = data.map(row => [
    row.year,
    ...options.metrics.map(m => row[m as keyof typeof row].toFixed(2))
  ]);
  
  const metadata = [
    `Region: ${options.region}`,
    `Time Range: ${options.yearRange.start} - ${options.yearRange.end}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'Climate Metrics Analysis',
    ''
  ];
  
  return [
    ...metadata,
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

function generatePDF(data: ClimateData[], options: DownloadOptions): Blob {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Climate Data Analysis Report', 20, 20);
  
  // Add metadata
  doc.setFontSize(12);
  doc.text(`Region: ${options.region}`, 20, 35);
  doc.text(`Time Range: ${options.yearRange.start} - ${options.yearRange.end}`, 20, 42);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 49);
  
  // Add current metrics summary
  const latestData = data[data.length - 1];
  doc.setFontSize(14);
  doc.text('Current Climate Metrics', 20, 65);
  
  doc.setFontSize(11);
  let yPos = 75;
  options.metrics.forEach((metric, index) => {
    const value = latestData[metric as keyof typeof latestData];
    doc.text(`${formatMetricName(metric)}: ${value.toFixed(2)}`, 25, yPos + (index * 7));
  });
  
  // Add historical data table
  doc.setFontSize(14);
  doc.text('Historical Data', 20, yPos + 40);
  
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
    startY: yPos + 45,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  return doc.output('blob');
}

function generateExcel(data: ClimateData[], options: DownloadOptions): string {
  const metadata = [
    `Climate Data Analysis`,
    `Region: ${options.region}`,
    `Analysis Period: ${options.yearRange.start} - ${options.yearRange.end}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'Current Climate Metrics:',
  ];

  // Add current metrics
  const latestData = data[data.length - 1];
  options.metrics.forEach(metric => {
    const value = latestData[metric as keyof typeof latestData];
    metadata.push(`${formatMetricName(metric)}: ${value.toFixed(2)}`);
  });

  metadata.push('', 'Historical Data:', '');

  const headers = [
    'Year',
    ...options.metrics.map(formatMetricName)
  ];
  
  const rows = data.map(row => [
    row.year,
    ...options.metrics.map(m => row[m as keyof typeof row].toFixed(2))
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

  const filename = `climate_data_${options.region.toLowerCase().replace(/\s+/g, '_')}_${options.yearRange.start}-${options.yearRange.end}.${extension}`;
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