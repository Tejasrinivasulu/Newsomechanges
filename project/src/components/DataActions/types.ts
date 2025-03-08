export type ExportFormat = 'pdf' | 'csv' | 'excel';

export interface ShareFormData {
  type: 'whatsapp' | 'email';
  message: string;
  format: ExportFormat;
}

export interface ActionPanelProps {
  onRefresh: () => Promise<void>;
  selectedRegion: string;
  selectedYear: number;
}

export interface ExportResponse {
  url: string;
  filename: string;
}

export interface ClimateData {
  year: number;
  temperature: number;
  precipitation: number;
  seaLevel: number;
  extremeEvents: number;
}

export interface DownloadOptions {
  format: ExportFormat;
  region: string;
  yearRange: {
    start: number;
    end: number;
  };
  metrics: string[];
}