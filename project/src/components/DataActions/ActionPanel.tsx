import React, { useState } from 'react';
import { Download, Share2, RefreshCw, FileSpreadsheet, Mail, MessageSquare, Loader2 } from 'lucide-react';
import type { ShareFormData, ExportFormat, ActionPanelProps } from './types';
import { downloadData, generateClimateData } from '../../utils/dataExport';
import { shareViaEmail, shareViaWhatsApp } from '../../utils/shareUtils';

interface ExtendedActionPanelProps extends ActionPanelProps {
  selectedRegion: string;
  selectedYear: number;
}

export default function ActionPanel({ onRefresh, selectedRegion, selectedYear }: ExtendedActionPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleDownload = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      const data = generateClimateData(2023, selectedYear, selectedRegion);
      downloadData(data, {
        format,
        region: selectedRegion,
        yearRange: {
          start: 2023,
          end: selectedYear
        },
        metrics: ['temperature', 'precipitation', 'seaLevel', 'extremeEvents']
      });
    } finally {
      setIsExporting(false);
      setShowFormatMenu(false);
    }
  };

  const handleShare = async (type: 'whatsapp' | 'email') => {
    setIsSharing(true);
    try {
      const data = generateClimateData(2023, selectedYear, selectedRegion);
      if (type === 'email') {
        shareViaEmail(data, selectedRegion, selectedYear);
      } else {
        shareViaWhatsApp(data, selectedRegion, selectedYear);
      }
    } finally {
      setIsSharing(false);
      setShowShareMenu(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex justify-end space-x-4">
      <div className="relative">
        <button
          onClick={() => setShowFormatMenu(!showFormatMenu)}
          disabled={isExporting}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isExporting ? 'Downloading...' : 'Download'}</span>
        </button>

        {showFormatMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border p-2 z-50">
            <button
              onClick={() => handleDownload('csv')}
              className="w-full flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV Format</span>
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="w-full flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>PDF Format</span>
            </button>
            <button
              onClick={() => handleDownload('excel')}
              className="w-full flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel Format</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          disabled={isSharing}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          <span>{isSharing ? 'Sharing...' : 'Share'}</span>
        </button>

        {showShareMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border p-2 z-50">
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </button>
            <button
              onClick={() => handleShare('email')}
              className="w-full flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Share via Email</span>
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
      </button>
    </div>
  );
}