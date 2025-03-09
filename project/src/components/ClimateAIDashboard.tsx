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
  Plus,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import ClimateGlobe from './ClimateGlobe';
import NotificationsPanel from './NotificationsPanel';
import { Alert } from './AlertSystem/types';

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&w=1920&q=80",
    title: "Rising Global Temperatures",
    description: "Advanced AI analysis helps track and predict temperature changes across different regions, enabling better preparation for climate challenges."
  },
  {
    url: "https://images.unsplash.com/photo-1581075323697-13b4d3f25c7f?auto=format&fit=crop&w=1920&q=80",
    title: "Melting Ice Caps",
    description: "Monitor the impact of global warming on polar ice caps and understand the implications for sea level rise worldwide."
  },
  {
    url: "https://images.unsplash.com/photo-1523867574998-1a336b6ded04?auto=format&fit=crop&w=1920&q=80",
    title: "Extreme Weather Events",
    description: "Track and predict the increasing frequency and intensity of extreme weather events using our advanced climate models."
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80",
    title: "Deforestation Impact",
    description: "Analyze the effects of deforestation on local and global climate patterns, and predict future environmental changes."
  },
  {
    url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1920&q=80",
    title: "Ocean Level Rise",
    description: "Monitor sea level changes and their impact on coastal regions using satellite data and predictive analytics."
  },
  {
    url: "https://images.unsplash.com/photo-1561040557-4acb9de1bc26?auto=format&fit=crop&w=1920&q=80",
    title: "Drought Patterns",
    description: "Predict and analyze drought patterns to help communities prepare for and adapt to changing climate conditions."
  }
];

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}

function MetricCard({ icon: Icon, title, value, description }: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-foreground mb-2">{value}</div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

const regionalFactors: Record<string, {
  temperature: number;
  precipitation: number;
  seaLevel: number;
  extremeEvents: number;
}> = {
  'India': { temperature: 1.4, precipitation: 1.5, seaLevel: 1.2, extremeEvents: 1.4 },
  'Global': { temperature: 1, precipitation: 1, seaLevel: 1, extremeEvents: 1 },
  'North America': { temperature: 1.2, precipitation: 1.3, seaLevel: 0.8, extremeEvents: 1.1 },
  'Europe': { temperature: 1.1, precipitation: 1.2, seaLevel: 0.9, extremeEvents: 1.2 },
  'Asia': { temperature: 1.3, precipitation: 1.4, seaLevel: 1.2, extremeEvents: 1.3 },
  'Africa': { temperature: 1.4, precipitation: 0.7, seaLevel: 1.1, extremeEvents: 1.4 },
  'South America': { temperature: 1.1, precipitation: 1.5, seaLevel: 1.0, extremeEvents: 1.2 },
  'Oceania': { temperature: 1.2, precipitation: 0.9, seaLevel: 1.3, extremeEvents: 1.1 }
};

export default function ClimateAIDashboard() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('India');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [prevMetrics, setPrevMetrics] = useState<ReturnType<typeof calculateMetrics> | null>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      const results = Object.keys(regionalFactors).filter(region =>
        region.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      if (results.length === 1) {
        setSelectedRegion(results[0]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddRegion = () => {
    if (searchTerm && !regionalFactors[searchTerm]) {
      regionalFactors[searchTerm] = {
        temperature: 1 + Math.random() * 0.5,
        precipitation: 0.8 + Math.random() * 0.7,
        seaLevel: 0.8 + Math.random() * 0.7,
        extremeEvents: 0.8 + Math.random() * 0.7
      };
      setSelectedRegion(searchTerm);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      setIsTransitioning(false);
    }, 500);
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
      setIsTransitioning(false);
    }, 500);
  };

  const metrics = useMemo(
    () => calculateMetrics(selectedYear, selectedRegion),
    [selectedYear, selectedRegion]
  );

  const historicalData = useMemo(
    () => getRegionalHistoricalData(selectedRegion, selectedYear),
    [selectedRegion, selectedYear]
  );

  useEffect(() => {
    if (prevMetrics) {
      const tempDiff = Math.abs(parseFloat(metrics.temperature) - parseFloat(prevMetrics.temperature));
      const precipDiff = Math.abs(parseFloat(metrics.precipitation) - parseFloat(prevMetrics.precipitation));
      const seaLevelDiff = Math.abs(parseFloat(metrics.seaLevel) - parseFloat(prevMetrics.seaLevel));

      const newAlerts: Alert[] = [];

      if (tempDiff >= 0.5) {
        newAlerts.push({
          id: `temp-${Date.now()}`,
          title: 'Significant Temperature Change',
          message: `Temperature ${parseFloat(metrics.temperature) > parseFloat(prevMetrics.temperature) ? 'increase' : 'decrease'} of ${tempDiff.toFixed(1)}°C detected in ${selectedRegion}`,
          severity: tempDiff >= 1 ? 'critical' : 'high',
          timestamp: new Date(),
          status: 'active',
          kpi: 'temperature',
          value: parseFloat(metrics.temperature),
          threshold: parseFloat(prevMetrics.temperature),
          region: selectedRegion
        });
      }

      if (precipDiff >= 5) {
        newAlerts.push({
          id: `precip-${Date.now()}`,
          title: 'Precipitation Pattern Change',
          message: `${precipDiff.toFixed(1)}% change in precipitation patterns detected in ${selectedRegion}`,
          severity: precipDiff >= 10 ? 'high' : 'medium',
          timestamp: new Date(),
          status: 'active',
          kpi: 'precipitation',
          value: parseFloat(metrics.precipitation),
          threshold: parseFloat(prevMetrics.precipitation),
          region: selectedRegion
        });
      }

      if (seaLevelDiff >= 5) {
        newAlerts.push({
          id: `sea-${Date.now()}`,
          title: 'Sea Level Change',
          message: `${seaLevelDiff.toFixed(1)}cm change in sea level detected in ${selectedRegion}`,
          severity: seaLevelDiff >= 10 ? 'high' : 'medium',
          timestamp: new Date(),
          status: 'active',
          kpi: 'seaLevel',
          value: parseFloat(metrics.seaLevel),
          threshold: parseFloat(prevMetrics.seaLevel),
          region: selectedRegion
        });
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
      }
    }

    setPrevMetrics(metrics);
  }, [metrics, selectedRegion, prevMetrics]);

  return (
    <div className="space-y-8">
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <div className={`relative h-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <img
            src={heroImages[currentImageIndex].url}
            alt="Climate Change Impact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {heroImages[currentImageIndex].title}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {heroImages[currentImageIndex].description}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentImageIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Region Selection</h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search region..."
                className="w-full p-2 pr-10 border rounded-lg bg-background text-foreground"
              />
              <button
                onClick={handleAddRegion}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-md transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              {searchResults.length > 0 && searchTerm && (
                <div className="absolute w-full mt-1 bg-card border rounded-lg shadow-lg z-10">
                  {searchResults.map((region) => (
                    <button
                      key={region}
                      onClick={() => handleRegionSelect(region)}
                      className="w-full text-left px-4 py-2 hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 bg-accent rounded-lg text-foreground">
              Selected Region: {selectedRegion}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Prediction Timeframe</h2>
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
        <h2 className="text-xl font-semibold mb-6">Combined Climate Metrics</h2>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
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
    </div>
  );
}

function calculateMetrics(year: number, region: string) {
  const baseYear = 2023;
  const yearDiff = year - baseYear;
  const factors = regionalFactors[region];
  
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

function getRegionalHistoricalData(region: string, selectedYear: number) {
  const factor = regionalFactors[region];
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(1900, currentYear - 50);
  const years = [];
  
  for (let year = startYear; year <= selectedYear; year += 5) {
    years.push(year);
  }
  if (!years.includes(selectedYear)) {
    years.push(selectedYear);
  }

  return years.map(year => {
    const yearProgress = (year - 1900) / (2050 - 1900);
    return {
      year,
      temperature: (-0.2 + (1.8 * yearProgress)) * factor.temperature,
      precipitation: (15 * yearProgress) * factor.precipitation,
      seaLevel: (26 * yearProgress) * factor.seaLevel
    };
  });
}