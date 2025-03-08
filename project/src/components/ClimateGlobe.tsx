import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  temperature: number;
  precipitation: number;
  seaLevel: number;
  region: string;
  metric: 'temperature' | 'precipitation' | 'seaLevel';
}

// Enhanced color scales for better visibility
const getTemperatureColor = (temp: number): string => {
  if (temp <= 0.5) return '#3b82f6';  // Cool blue
  if (temp <= 1.0) return '#22c55e';  // Moderate green
  if (temp <= 1.5) return '#eab308';  // Warning yellow
  if (temp <= 2.0) return '#f97316';  // Alert orange
  return '#ef4444';                   // Critical red
};

const getPrecipitationColor = (precip: number): string => {
  if (precip <= 0) return '#fef3c7';   // Very dry - pale yellow
  if (precip <= 5) return '#86efac';   // Light green
  if (precip <= 10) return '#22c55e';  // Medium green
  if (precip <= 15) return '#15803d';  // Dark green
  return '#064e3b';                    // Very wet - forest green
};

const getSeaLevelColor = (level: number): string => {
  if (level <= 5) return '#bfdbfe';    // Light blue
  if (level <= 10) return '#60a5fa';   // Medium blue
  if (level <= 15) return '#2563eb';   // Strong blue
  if (level <= 20) return '#1e40af';   // Dark blue
  return '#1e3a8a';                    // Very dark blue
};

const getColorForMetric = (value: number, metric: string): string => {
  switch (metric) {
    case 'temperature':
      return getTemperatureColor(value);
    case 'precipitation':
      return getPrecipitationColor(value);
    case 'seaLevel':
      return getSeaLevelColor(value);
    default:
      return '#cccccc';
  }
};

// Improved region definitions with more precise coordinates
const regions: Record<string, {
  coordinates: [number, number, number, number], // [startLat, startLon, endLat, endLon]
  tempOffset: number,
  precipOffset: number,
  seaLevelOffset: number,
  name: string
}> = {
  'Global': { 
    coordinates: [-90, -180, 90, 180],
    tempOffset: 0,
    precipOffset: 0,
    seaLevelOffset: 0,
    name: 'Global'
  },
  'North America': {
    coordinates: [15, -170, 75, -50],
    tempOffset: -0.2,
    precipOffset: 2,
    seaLevelOffset: -1,
    name: 'North America'
  },
  'South America': {
    coordinates: [-60, -80, 15, -30],
    tempOffset: 0.3,
    precipOffset: 5,
    seaLevelOffset: 2,
    name: 'South America'
  },
  'Europe': {
    coordinates: [35, -10, 70, 40],
    tempOffset: 0.1,
    precipOffset: 1,
    seaLevelOffset: 1,
    name: 'Europe'
  },
  'Africa': {
    coordinates: [-40, -20, 35, 50],
    tempOffset: 0.5,
    precipOffset: -2,
    seaLevelOffset: 2,
    name: 'Africa'
  },
  'Asia': {
    coordinates: [0, 60, 75, 180],
    tempOffset: 0.4,
    precipOffset: 3,
    seaLevelOffset: 3,
    name: 'Asia'
  },
  'Oceania': {
    coordinates: [-50, 110, 0, 180],
    tempOffset: 0.2,
    precipOffset: 4,
    seaLevelOffset: 4,
    name: 'Oceania'
  },
  'India': {
    coordinates: [8, 68, 37, 97],
    tempOffset: 0.6,
    precipOffset: 6,
    seaLevelOffset: 3,
    name: 'India'
  }
};

const Globe = ({ temperature, precipitation, seaLevel, region, metric }: GlobeProps) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Draw base map with improved gradient
    const baseValue = metric === 'temperature' ? temperature :
                     metric === 'precipitation' ? precipitation :
                     seaLevel;
    const baseColor = getColorForMetric(baseValue, metric);
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, adjustColor(baseColor, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw enhanced grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;

    // Latitude lines with labels
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = (90 - lat) * (canvas.height / 180);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      // Add latitude labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${lat}°`, 5, y);
    }

    // Longitude lines with labels
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = (lon + 180) * (canvas.width / 360);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();

      // Add longitude labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${lon}°`, x, canvas.height - 5);
    }

    // Draw regions with improved blending
    Object.entries(regions).forEach(([regionName, regionData]) => {
      if (region === 'Global' || region === regionName) {
        const [startLat, startLon, endLat, endLon] = regionData.coordinates;
        const value = metric === 'temperature' ? temperature + regionData.tempOffset :
                     metric === 'precipitation' ? precipitation + regionData.precipOffset :
                     seaLevel + regionData.seaLevelOffset;
        const color = getColorForMetric(value, metric);

        // Convert coordinates to canvas positions
        const x1 = ((startLon + 180) / 360) * canvas.width;
        const y1 = ((90 - startLat) / 180) * canvas.height;
        const x2 = ((endLon + 180) / 360) * canvas.width;
        const y2 = ((90 - endLat) / 180) * canvas.height;

        // Create gradient fill for region
        const regionGradient = ctx.createLinearGradient(x1, y1, x1, y2);
        regionGradient.addColorStop(0, color);
        regionGradient.addColorStop(1, adjustColor(color, -15));
        
        // Draw region with gradient and soft edges
        ctx.fillStyle = regionGradient;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // Add region label and value
        if (region === regionName) {
          // Draw highlighted border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 4;
          ctx.strokeRect(x1, y2, x2 - x1, y1 - y2);

          // Add value label with background
          const centerX = (x1 + x2) / 2;
          const centerY = (y1 + y2) / 2;
          const unit = metric === 'temperature' ? '°C' :
                      metric === 'precipitation' ? '%' :
                      'cm';
          const label = `${value.toFixed(1)}${unit}`;
          
          // Draw label background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          const padding = 10;
          const labelWidth = ctx.measureText(label).width + padding * 2;
          ctx.fillRect(
            centerX - labelWidth / 2,
            centerY - 15,
            labelWidth,
            30
          );

          // Draw label text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, centerX, centerY);
        }
      }
    });

    // Add atmospheric effects
    for (let i = 0; i < 50000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const opacity = Math.random() * 0.1;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Update texture
    if (textureRef.current) {
      textureRef.current.dispose();
    }
    textureRef.current = new THREE.CanvasTexture(canvas);
    textureRef.current.needsUpdate = true;

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [temperature, precipitation, seaLevel, region, metric]);

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial
        map={textureRef.current}
        bumpMap={textureRef.current}
        bumpScale={0.1}
        specularMap={textureRef.current}
        specular={new THREE.Color(0x444444)}
        shininess={10}
      />
    </mesh>
  );
};

interface ClimateGlobeProps {
  temperature: number;
  precipitation?: number;
  seaLevel?: number;
  region: string;
}

const ClimateGlobe = ({
  temperature = 1.1,
  precipitation = 5,
  seaLevel = 10,
  region = 'Global'
}: ClimateGlobeProps) => {
  const [activeMetric, setActiveMetric] = useState<'temperature' | 'precipitation' | 'seaLevel'>('temperature');

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setActiveMetric('temperature')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeMetric === 'temperature'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent hover:bg-accent/80'
          }`}
        >
          Temperature
        </button>
        <button
          onClick={() => setActiveMetric('precipitation')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeMetric === 'precipitation'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent hover:bg-accent/80'
          }`}
        >
          Precipitation
        </button>
        <button
          onClick={() => setActiveMetric('seaLevel')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeMetric === 'seaLevel'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent hover:bg-accent/80'
          }`}
        >
          Sea Level
        </button>
      </div>

      <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Globe
            temperature={temperature}
            precipitation={precipitation}
            seaLevel={seaLevel}
            region={region}
            metric={activeMetric}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={4}
            maxDistance={8}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg border">
          <div className="text-sm font-medium mb-2">Temperature Scale</div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>≤0.5°C</span>
            <span>1.0°C</span>
            <span>1.5°C</span>
            <span>2.0°C</span>
            <span>≥2.5°C</span>
          </div>
          <div className="h-2 mt-1 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500" />
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <div className="text-sm font-medium mb-2">Precipitation Scale</div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>≤0%</span>
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
            <span>≥20%</span>
          </div>
          <div className="h-2 mt-1 rounded-full bg-gradient-to-r from-yellow-100 via-green-300 via-green-500 via-green-700 to-green-900" />
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <div className="text-sm font-medium mb-2">Sea Level Scale</div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>≤5cm</span>
            <span>10cm</span>
            <span>15cm</span>
            <span>20cm</span>
            <span>≥25cm</span>
          </div>
          <div className="h-2 mt-1 rounded-full bg-gradient-to-r from-blue-200 via-blue-400 via-blue-600 via-blue-700 to-blue-900" />
        </div>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default ClimateGlobe;