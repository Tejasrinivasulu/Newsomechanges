import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Thermometer, 
  Droplets, 
  Waves, 
  AlertTriangle, 
  Bell, 
  Download, 
  FileSpreadsheet, 
  File as FilePdf, 
  Table, 
  Loader2,
  Search,
  RefreshCw 
} from 'lucide-react';
import ClimateGlobe from './ClimateGlobe';
import NotificationsPanel from './NotificationsPanel';
import ActionPanel from './DataActions/ActionPanel';
import { Alert } from './AlertSystem/types';
import { downloadData, generateClimateData } from '../utils/dataExport';
import type { ExportFormat } from './DataActions/types';

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  onChange?: (value: number) => void;
}

function MetricCard({ icon: Icon, title, value, description, onChange }: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-primary" />
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="text-xl font-bold text-foreground mb-2">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// Default values
const DEFAULT_YEAR = 2023;
const DEFAULT_REGION = 'India';

// Regional factors with India as default
const regionalFactors = {
  'India': {
    temperature: 1.3,
    precipitation: 1.4,
    seaLevel: 1.2,
    extremeEvents: 1.3
  }
};

const TEMPERATURE_THRESHOLDS = {
  critical: 2.0,  // °C increase
  high: 1.5,      // °C increase
  medium: 1.0,    // °C increase
  low: 0.5        // °C increase
};

function calculateMetrics(year: number, region: string, customRegions: Record<string, any>) {
  const baseYear = 2023;
  const yearDiff = year - baseYear;
  const factors = customRegions[region];
  
  const baseTempIncrease = 1.1 + (yearDiff * (1.6 - 1.1) / (2050 - 2023));
  const basePrecipChange = (yearDiff * 5.3 / (2050 - 2023));
  const baseSeaLevelRise = (yearDiff * 26.3 / (2050 - 2023));
  const baseExtremeEvents = (yearDiff * 32 / (2050 - 2023));

  return {
    temperature: (baseTempIncrease * factors.temperature).toFixed(1),
    precipitation: (basePrecipChange * factors.precipitation).toFixed(1),
    seaLevel: (baseSeaLevelRise * factors.seaLevel).toFixed(1),
    extremeEvents: (baseExtremeEvents * factors.extremeEvents).toFixed(1)
  };
}

function getRegionalHistoricalData(region: string, selectedYear: number, customRegions: Record<string, any>) {
  const factor = customRegions[region];
  const years = [];
  
  for (let year = 2023; year <= selectedYear; year += 5) {
    years.push(year);
  }
  if (!years.includes(selectedYear)) {
    years.push(selectedYear);
  }

  return years.map(year => {
    const yearProgress = (year - 2023) / (2050 - 2023);
    return {
      year,
      temperature: (1.1 + (0.5 * yearProgress)) * factor.temperature,
      precipitation: (15 * yearProgress) * factor.precipitation,
      seaLevel: (26 * yearProgress) * factor.seaLevel
    };
  });
}

function ClimateAIDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
  const [customRegions, setCustomRegions] = useState(regionalFactors);
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [prevMetrics, setPrevMetrics] = useState<ReturnType<typeof calculateMetrics> | null>(null);
  const [lastNotificationTime, setLastNotificationTime] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = () => {
    if (!searchTerm) return;

    const newRegion = {
      temperature: 1 + Math.random() * 0.5,
      precipitation: 1 + Math.random() * 0.5,
      seaLevel: 1 + Math.random() * 0.5,
      extremeEvents: 1 + Math.random() * 0.5
    };

    setCustomRegions(prev => ({
      ...prev,
      [searchTerm]: newRegion
    }));
    setSelectedRegion(searchTerm);
    setSearchTerm('');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Reset to default values
      setSelectedRegion(DEFAULT_REGION);
      setSelectedYear(DEFAULT_YEAR);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh delay
    } finally {
      setIsRefreshing(false);
    }
  };

  const metrics = useMemo(
    () => calculateMetrics(selectedYear, selectedRegion, customRegions),
    [selectedYear, selectedRegion, customRegions]
  );

  const historicalData = useMemo(
    () => getRegionalHistoricalData(selectedRegion, selectedYear, customRegions),
    [selectedRegion, selectedYear, customRegions]
  );

  const checkTemperatureThreshold = (temperature: number): Alert['severity'] => {
    if (temperature >= TEMPERATURE_THRESHOLDS.critical) return 'critical';
    if (temperature >= TEMPERATURE_THRESHOLDS.high) return 'high';
    if (temperature >= TEMPERATURE_THRESHOLDS.medium) return 'medium';
    if (temperature >= TEMPERATURE_THRESHOLDS.low) return 'low';
    return 'low';
  };

  const createTemperatureAlert = (temperature: number, prevTemperature: number) => {
    const severity = checkTemperatureThreshold(temperature);
    const now = Date.now();
    
    if (lastNotificationTime[severity] && now - lastNotificationTime[severity] < 300000) {
      return;
    }

    const change = temperature - prevTemperature;
    const changeType = change > 0 ? 'increase' : 'decrease';
    
    const alert: Alert = {
      id: `temp-${now}`,
      title: `Temperature ${changeType} detected`,
      message: `Temperature has ${changeType}d by ${Math.abs(change).toFixed(1)}°C in ${selectedRegion}. Current temperature: ${temperature.toFixed(1)}°C`,
      severity,
      timestamp: new Date(),
      status: 'active',
      kpi: 'temperature',
      value: temperature,
      threshold: prevTemperature,
      region: selectedRegion
    };

    setAlerts(prev => [alert, ...prev].slice(0, 10));
    setLastNotificationTime(prev => ({ ...prev, [severity]: now }));
  };

  useEffect(() => {
    if (prevMetrics) {
      const currentTemp = parseFloat(metrics.temperature);
      const prevTemp = parseFloat(prevMetrics.temperature);
      const tempDiff = Math.abs(currentTemp - prevTemp);

      if (tempDiff >= 0.1) {
        createTemperatureAlert(currentTemp, prevTemp);
      }
    }
    setPrevMetrics(metrics);
  }, [metrics, selectedRegion]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Region Search</h2>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search any region..."
                className="w-full p-2 pr-10 border rounded-lg bg-background text-foreground"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-md transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-4 p-3 bg-accent rounded-lg text-foreground">
            Current Region: {selectedRegion}
          </div>
        </div>
        <div className="flex-1 bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Prediction Timeframe</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
              title="Reset to defaults"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <input
            type="range"
            min="2023"
            max="2050"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-center mt-2">Year: {selectedYear}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Thermometer}
          title="Temperature"
          value={`+${metrics.temperature}°C`}
          description={`${selectedRegion} increase by ${selectedYear}`}
        />
        <MetricCard
          icon={Droplets}
          title="Precipitation"
          value={`${metrics.precipitation}%`}
          description={`${selectedRegion} change by ${selectedYear}`}
        />
        <MetricCard
          icon={Waves}
          title="Sea Level Rise"
          value={`+${metrics.seaLevel}cm`}
          description={`${selectedRegion} rise by ${selectedYear}`}
        />
        <MetricCard
          icon={AlertTriangle}
          title="Extreme Events"
          value={`+${metrics.extremeEvents}%`}
          description={`${selectedRegion} increase by ${selectedYear}`}
        />
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Combined Climate Metrics</h2>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                domain={[2023, 2050]}
                ticks={[2023, 2030, 2035, 2040, 2045, 2050]}
              />
              <YAxis
                yAxisId="temp"
                label={{
                  value: 'Temperature (°C)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: 'hsl(var(--muted-foreground))' }
                }}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                stroke="#ef4444"
              />
              <YAxis
                yAxisId="precip"
                orientation="right"
                label={{
                  value: 'Precipitation Change (%)',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: 'hsl(var(--muted-foreground))' }
                }}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                stroke="#3b82f6"
              />
              <YAxis
                yAxisId="sea"
                orientation="right"
                label={{
                  value: 'Sea Level Rise (cm)',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: 'hsl(var(--muted-foreground))' }
                }}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                stroke="#22c55e"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                wrapperStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Temperature"
              />
              <Line
                yAxisId="precip"
                type="monotone"
                dataKey="precipitation"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Precipitation"
              />
              <Line
                yAxisId="sea"
                type="monotone"
                dataKey="seaLevel"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Sea Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Global Climate Impact Zones</h2>
        <ClimateGlobe 
          temperature={parseFloat(metrics.temperature)} 
          region={selectedRegion}
        />
      </div>

      <ActionPanel onRefresh={handleRefresh} selectedRegion={selectedRegion} selectedYear={selectedYear} />
    </div>
  );
}

export default ClimateAIDashboard;