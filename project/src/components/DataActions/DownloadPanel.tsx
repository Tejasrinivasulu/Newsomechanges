import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Database, X, Loader2, Check } from 'lucide-react';
import { downloadData, generateClimateData } from '../../utils/dataExport';
import type { ExportFormat } from './types';

interface DownloadPanelProps {
  onClose: () => void;
  selectedRegion: string;
  selectedYear: number;
  format: ExportFormat;
}

export default function DownloadPanel({ onClose, selectedRegion, selectedYear, format }: DownloadPanelProps) {
  const [downloading, setDownloading] = useState(false);
  const [yearRange, setYearRange] = useState({
    start: 2023,
    end: selectedYear
  });
  const [selectedMetrics, setSelectedMetrics] = useState({
    temperature: true,
    precipitation: true,
    seaLevel: true,
    extremeEvents: false
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const metrics = Object.entries(selectedMetrics)
        .filter(([_, selected]) => selected)
        .map(([metric]) => metric);

      const data = generateClimateData(yearRange.start, yearRange.end, selectedRegion);
      downloadData(data, {
        format,
        region: selectedRegion,
        yearRange,
        metrics
      });
    } finally {
      setDownloading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-xl border p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Download Dataset</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <div className="p-3 bg-accent rounded-lg text-foreground">
              {selectedRegion}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">From</label>
                <input
                  type="number"
                  min="2023"
                  max={yearRange.end}
                  value={yearRange.start}
                  onChange={(e) => setYearRange(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                  className="w-full p-2 rounded-lg border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">To</label>
                <input
                  type="number"
                  min={yearRange.start}
                  max="2050"
                  value={yearRange.end}
                  onChange={(e) => setYearRange(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                  className="w-full p-2 rounded-lg border bg-background"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Climate Parameters</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMetrics.temperature}
                  onChange={(e) => setSelectedMetrics(prev => ({ ...prev, temperature: e.target.checked }))}
                  className="rounded border-primary text-primary focus:ring-primary"
                />
                <span>🌡️ Temperature Change (°C)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMetrics.precipitation}
                  onChange={(e) => setSelectedMetrics(prev => ({ ...prev, precipitation: e.target.checked }))}
                  className="rounded border-primary text-primary focus:ring-primary"
                />
                <span>🌧️ Precipitation Change (%)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMetrics.seaLevel}
                  onChange={(e) => setSelectedMetrics(prev => ({ ...prev, seaLevel: e.target.checked }))}
                  className="rounded border-primary text-primary focus:ring-primary"
                />
                <span>🌊 Sea Level Rise (cm)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMetrics.extremeEvents}
                  onChange={(e) => setSelectedMetrics(prev => ({ ...prev, extremeEvents: e.target.checked }))}
                  className="rounded border-primary text-primary focus:ring-primary"
                />
                <span>🌪️ Extreme Weather Events (%)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading || !Object.values(selectedMetrics).some(v => v)}
            className="w-full p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Dataset</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}