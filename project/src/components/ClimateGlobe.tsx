import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  temperature: number;
  region: string;
}

// Enhanced color scales for better temperature visualization
const getTemperatureColor = (temp: number): string => {
  if (temp <= 0.5) return '#3b82f6';      // Cool blue for low temp
  if (temp <= 1.0) return '#22c55e';      // Moderate green
  if (temp <= 1.5) return '#eab308';      // Warning yellow
  if (temp <= 2.0) return '#f97316';      // Alert orange
  if (temp <= 2.5) return '#ef4444';      // Critical red
  return '#7f1d1d';                       // Dark red for extreme heat
};

// Region definitions with precise coordinates and dot positions
const regions: Record<string, {
  coordinates: [number, number, number, number], // [startLat, startLon, endLat, endLon]
  tempOffset: number,
  name: string,
  dots: Array<[number, number]> // Array of [lat, lon] for dots
}> = {
  'Global': { 
    coordinates: [-90, -180, 90, 180],
    tempOffset: 0,
    name: 'Global',
    dots: Array.from({ length: 200 }, () => [
      Math.random() * 180 - 90,
      Math.random() * 360 - 180
    ])
  },
  'North America': {
    coordinates: [15, -170, 75, -50],
    tempOffset: -0.2,
    name: 'North America',
    dots: Array.from({ length: 50 }, () => [
      15 + Math.random() * 60,
      -170 + Math.random() * 120
    ])
  },
  'South America': {
    coordinates: [-60, -80, 15, -30],
    tempOffset: 0.3,
    name: 'South America',
    dots: Array.from({ length: 40 }, () => [
      -60 + Math.random() * 75,
      -80 + Math.random() * 50
    ])
  },
  'Europe': {
    coordinates: [35, -10, 70, 40],
    tempOffset: 0.1,
    name: 'Europe',
    dots: Array.from({ length: 40 }, () => [
      35 + Math.random() * 35,
      -10 + Math.random() * 50
    ])
  },
  'Africa': {
    coordinates: [-40, -20, 35, 50],
    tempOffset: 0.5,
    name: 'Africa',
    dots: Array.from({ length: 60 }, () => [
      -40 + Math.random() * 75,
      -20 + Math.random() * 70
    ])
  },
  'Asia': {
    coordinates: [0, 60, 75, 180],
    tempOffset: 0.4,
    name: 'Asia',
    dots: Array.from({ length: 80 }, () => [
      0 + Math.random() * 75,
      60 + Math.random() * 120
    ])
  },
  'India': {
    coordinates: [8, 68, 37, 97],
    tempOffset: 0.6,
    name: 'India',
    dots: Array.from({ length: 30 }, () => [
      8 + Math.random() * 29,
      68 + Math.random() * 29
    ])
  },
  'Oceania': {
    coordinates: [-50, 110, 0, 180],
    tempOffset: 0.2,
    name: 'Oceania',
    dots: Array.from({ length: 40 }, () => [
      -50 + Math.random() * 50,
      110 + Math.random() * 70
    ])
  }
};

// Generate random dots for unknown regions
const generateRandomDots = (count: number = 30): Array<[number, number]> => {
  return Array.from({ length: count }, () => [
    Math.random() * 180 - 90, // Random latitude
    Math.random() * 360 - 180 // Random longitude
  ]);
};

// Convert lat/lon to 3D coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

interface DotProps {
  position: THREE.Vector3;
  color: string;
  size?: number;
  pulse?: boolean;
  temperature: number;
}

function Dot({ position, color, size = 0.05, pulse = false, temperature }: DotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current && (pulse || hovered)) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 8, 8]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.5}
        />
      </mesh>
      {hovered && (
        <Text
          position={[position.x, position.y + 0.2, position.z]}
          fontSize={0.1}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {`${temperature.toFixed(1)}°C`}
        </Text>
      )}
    </group>
  );
}

const Globe = ({ temperature, region }: GlobeProps) => {
  const globeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load Earth textures
  const [earthMap, earthNormal, earthSpec, earthClouds] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
      atmosphereRef.current.material.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  // Generate dots for the selected region or all regions
  const dots = React.useMemo(() => {
    const dotsToRender: Array<{ position: THREE.Vector3; color: string; pulse: boolean; temperature: number }> = [];

    if (region === 'Global') {
      // Show all regions for global view
      Object.entries(regions).forEach(([regionName, regionData]) => {
        if (regionName !== 'Global') {
          const regionTemp = temperature + regionData.tempOffset;
          const color = getTemperatureColor(regionTemp);
          regionData.dots.forEach(([lat, lon]) => {
            dotsToRender.push({
              position: latLonToVector3(lat, lon, 2.02),
              color,
              pulse: false,
              temperature: regionTemp
            });
          });
        }
      });
    } else {
      // Handle specific region (including unknown regions)
      const regionData = regions[region];
      const tempOffset = regionData ? regionData.tempOffset : 0.3; // Default offset for unknown regions
      const regionTemp = temperature + tempOffset;
      const color = getTemperatureColor(regionTemp);
      const dots = regionData ? regionData.dots : generateRandomDots();

      dots.forEach(([lat, lon]) => {
        dotsToRender.push({
          position: latLonToVector3(lat, lon, 2.02),
          color,
          pulse: true,
          temperature: regionTemp
        });
      });
    }

    return dotsToRender;
  }, [temperature, region]);

  return (
    <group ref={globeRef}>
      {/* Earth Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={earthMap}
          normalMap={earthNormal}
          specularMap={earthSpec}
          shininess={15}
          bumpMap={earthNormal}
          bumpScale={0.05}
        />
      </mesh>

      {/* Temperature Dots */}
      {dots.map((dot, index) => (
        <Dot
          key={index}
          position={dot.position}
          color={dot.color}
          pulse={dot.pulse}
          temperature={dot.temperature}
          size={dot.pulse ? 0.06 : 0.04}
        />
      ))}

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshPhongMaterial
          map={earthClouds}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshPhongMaterial
          color="#4a90e2"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default function ClimateGlobe({ temperature, region }: GlobeProps) {
  return (
    <div className="space-y-4">
      <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[5, 3, 5]} intensity={0.8} />
          <Globe temperature={temperature} region={region} />
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

      <div className="p-4 bg-card rounded-lg border">
        <div className="text-sm font-medium mb-2">Temperature Scale</div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>≤0.5°C</span>
          <span>1.0°C</span>
          <span>1.5°C</span>
          <span>2.0°C</span>
          <span>2.5°C</span>
          <span>≥3.0°C</span>
        </div>
        <div className="h-2 mt-1 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-900" />
      </div>
    </div>
  );
}