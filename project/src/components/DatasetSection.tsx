import React, { useState } from 'react';
import { FileSpreadsheet, File as FilePdf, Table, Download, ChevronDown, ChevronUp, Check, X, Loader2 } from 'lucide-react';
import { downloadData, generateClimateData } from '../utils/dataExport';
import type { ExportFormat } from './DataActions/types';
import DownloadPanel from './DataActions/DownloadPanel';

interface FormatCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  advantages: string[];
  limitations: string[];
  bestFor: string[];
  fileSize: string;
  updateSpeed: string;
  compatibility: string[];
  onDownload: () => void;
  isDownloading: boolean;
}

function FormatCard({ 
  icon: Icon, 
  title, 
  description, 
  features,
  advantages,
  limitations,
  bestFor,
  fileSize,
  updateSpeed,
  compatibility,
  onDownload,
  isDownloading
}: FormatCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-card rounded-xl p-6 border transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </>
            )}
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      {isExpanded && (
        <div className="space-y-6 mt-6 border-t pt-6">
          <div>
            <h4 className="text-sm font-semibold mb-2">Key Features</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Advantages</h4>
              <ul className="space-y-1">
                {advantages.map((advantage, index) => (
                  <li key={index} className="flex items-center space-x-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Limitations</h4>
              <ul className="space-y-1">
                {limitations.map((limitation, index) => (
                  <li key={index} className="flex items-center space-x-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span className="text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Best For</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {bestFor.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">File Size</h4>
              <p className="text-muted-foreground text-sm">{fileSize}</p>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">Update Speed</h4>
              <p className="text-muted-foreground text-sm">{updateSpeed}</p>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">Compatibility</h4>
              <div className="flex flex-wrap gap-1">
                {compatibility.map((item, index) => (
                  <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DatasetSection() {
  const [downloadingFormat, setDownloadingFormat] = useState<ExportFormat | null>(null);
  const [showDownloadPanel, setShowDownloadPanel] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);

  const handleDownloadClick = (format: ExportFormat) => {
    setSelectedFormat(format);
    setShowDownloadPanel(true);
  };

  const formatTypes = [
    {
      icon: FileSpreadsheet,
      title: "CSV (Comma-Separated Values)",
      description: "Simple, lightweight format for tabular data that can be easily opened in spreadsheet applications.",
      features: [
        "Plain text format with comma-separated fields",
        "Universal compatibility",
        "Easy to read and edit",
        "Efficient storage for tabular data"
      ],
      advantages: [
        "Widely supported",
        "Human-readable",
        "Small file size",
        "Easy to process"
      ],
      limitations: [
        "Limited to tabular data",
        "No formatting options",
        "No support for formulas",
        "Single sheet only"
      ],
      bestFor: [
        "Data analysis in spreadsheet software",
        "Importing into databases",
        "Simple data sharing",
        "Automated data processing"
      ],
      fileSize: "Typically < 1MB",
      updateSpeed: "Instant",
      compatibility: ["Excel", "Google Sheets", "R", "Python", "Database Systems"],
      format: 'csv' as ExportFormat
    },
    {
      icon: FilePdf,
      title: "PDF (Portable Document Format)",
      description: "Professional document format that preserves formatting and is perfect for reports and presentations.",
      features: [
        "Preserves layout and formatting",
        "Supports rich text and graphics",
        "Platform-independent",
        "Print-ready format"
      ],
      advantages: [
        "Professional presentation",
        "Universal readability",
        "Format preservation",
        "Print quality"
      ],
      limitations: [
        "Larger file size",
        "Not easily editable",
        "Data extraction challenges",
        "Limited interactivity"
      ],
      bestFor: [
        "Official reports",
        "Data presentations",
        "Archival purposes",
        "Sharing analysis results"
      ],
      fileSize: "1-10MB typical",
      updateSpeed: "Medium",
      compatibility: ["Adobe Reader", "Web Browsers", "Mobile Devices", "Print Systems"],
      format: 'pdf' as ExportFormat
    },
    {
      icon: Table,
      title: "Excel Spreadsheet",
      description: "Rich spreadsheet format with support for multiple sheets, formulas, and formatting.",
      features: [
        "Multiple worksheet support",
        "Formula calculations",
        "Data formatting options",
        "Visual representations"
      ],
      advantages: [
        "Rich formatting",
        "Formula support",
        "Multiple sheets",
        "Visual analysis"
      ],
      limitations: [
        "Larger file size",
        "Platform dependent",
        "Version compatibility issues",
        "Limited automation"
      ],
      bestFor: [
        "Business analysis",
        "Data visualization",
        "Interactive reports",
        "Financial calculations"
      ],
      fileSize: "2-10MB typical",
      updateSpeed: "Moderate",
      compatibility: ["Microsoft Excel", "Google Sheets", "LibreOffice", "OpenOffice"],
      format: 'excel' as ExportFormat
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Download Format Types</h2>
          <p className="text-muted-foreground mt-2">
            Choose the most suitable format for your climate data analysis needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {formatTypes.map((type, index) => (
            <FormatCard
              key={index}
              {...type}
              onDownload={() => handleDownloadClick(type.format)}
              isDownloading={downloadingFormat === type.format}
            />
          ))}
        </div>
      </div>

      {showDownloadPanel && selectedFormat && (
        <DownloadPanel
          onClose={() => setShowDownloadPanel(false)}
          selectedRegion="Global"
          selectedYear={2050}
          format={selectedFormat}
        />
      )}
    </div>
  );
}