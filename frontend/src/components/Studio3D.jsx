import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SunLighting } from './SunControl';
import {
  Sun,
  Play,
  Pause,
  Eye,
  Layers,
  Sparkles,
  TreePine,
  Car,
  Compass,
  Building,
  Maximize2
} from 'lucide-react';
import { translations } from '../utils/translations';

// ==========================================
// 3D BUILDING WITH COURTYARD & B+G+9 ARCHITECTURE
// (Light Architectural Studio Theme)
// ==========================================

function BuildingMassing3D({
  massingData,
  activeFloorCode,
  setActiveFloorCode,
  viewMode, // 'massing' | 'section'
  hoveredFloor,
  setHoveredFloor
}) {
  if (!massingData || !massingData.floors) return null;

  const { floors, metrics, courtyard } = massingData;
  const plotW = massingData.plot_width || 60;
  const plotD = massingData.plot_depth || 80;
  const offsetX = plotW / 2.0;
  const offsetZ = plotD / 2.0;

  const courtW = courtyard?.width || 16;
  const courtD = courtyard?.depth || 20;

  return (
    <group>
      {/* 1. Surrounding Site Terrain & Urban Context (Light Drafting Grey) */}
      <mesh receiveShadow position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotW * 2.8, plotD * 2.8]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Plot Boundary Plane (Crisp Drafting White Surface) */}
      <mesh receiveShadow position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotW, plotD]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Plot Perimeter Outline (Terracotta Border) */}
      <lineSegments position={[0, -0.05, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(plotW, plotD)]} />
        <lineBasicMaterial color="#c2410c" linewidth={2} />
      </lineSegments>

      {/* Front Access Road */}
      <mesh receiveShadow position={[0, -0.1, -offsetZ - 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotW * 2.4, 14]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Road Center Stripe */}
      <mesh position={[0, -0.02, -offsetZ - 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[plotW * 2.2, 0.35]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* 2. Central Courtyard Landscaping (Grass + Paving + Eco-Pond) */}
      <group position={[0, 0.02, 0]}>
        {/* Grass Lawn */}
        <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[courtW, courtD]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
        {/* Pedestrian Stone Pathway */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[courtW * 0.35, courtD * 0.9]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Central Water Basin / Eco-Pond */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[courtW * 0.38, courtD * 0.35]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.6} opacity={0.85} transparent />
        </mesh>

        {/* 4 Biophilic Native Canopy Shade Trees */}
        {[
          [-courtW * 0.32, -courtD * 0.32],
          [courtW * 0.32, -courtD * 0.32],
          [-courtW * 0.32, courtD * 0.32],
          [courtW * 0.32, courtD * 0.32]
        ].map(([tx, tz], tidx) => (
          <group key={tidx} position={[tx, 0, tz]}>
            {/* Trunk */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.28, 2.4, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 2.8, 0]} castShadow>
              <sphereGeometry args={[1.5, 12, 12]} />
              <meshStandardMaterial color="#15803d" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. Section Cut Indicator (If in Section Mode) */}
      {viewMode === 'section' && (
        <group position={[0, 18, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(plotW * 1.1, 40)]} />
            <lineBasicMaterial color="#0284c7" linewidth={2} />
          </lineSegments>
        </group>
      )}

      {/* 4. Extruded Building Floors */}
      {floors.map((floor) => {
        const isSelected = activeFloorCode === floor.floor_code;
        const isHovered = hoveredFloor === floor.floor_code;
        const isBasement = floor.floor_code === 'B1';

        // Floor Color coding:
        // Commercial: Crisp Architectural Blue
        // Residential: Warm Terracotta Orange
        // Sky Amenity: Muted Forest Green
        // Subterranean: Engineering Slate
        let baseColor = '#ea580c'; // Terracotta default
        if (floor.zone_type === 'COMMERCIAL') baseColor = '#2563eb';
        else if (floor.zone_type === 'AMENITY') baseColor = '#16a34a';
        else if (isBasement) baseColor = '#64748b';

        // Opacity & Highlight states
        let opacity = 0.95;
        let transparent = false;
        if (isSelected) {
          opacity = 1.0;
        } else if (activeFloorCode && !isSelected) {
          opacity = viewMode === 'section' ? 0.3 : 0.85;
          transparent = true;
        }
        if (isHovered && !isSelected) {
          opacity = 0.98;
        }

        const posY = floor.elevation_y + floor.floor_height / 2.0;
        const halfW = floor.width / 2.0;
        const halfD = floor.depth / 2.0;
        const wingW = (floor.width - courtW) / 2.0;
        const wingD = floor.depth;

        return (
          <group key={floor.floor_code}>
            {/* Clickable floor level */}
            <group
              onClick={(e) => {
                e.stopPropagation();
                setActiveFloorCode(floor.floor_code);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredFloor(floor.floor_code);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredFloor(null);
              }}
            >
              {/* If Basement (B1), solid slab */}
              {isBasement ? (
                <group position={[0, posY, 0]}>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[floor.width, floor.floor_height, floor.depth]} />
                    <meshStandardMaterial color={baseColor} roughness={0.7} opacity={0.7} transparent />
                  </mesh>
                  {/* Vehicular Access Ramp indicator */}
                  <mesh position={[halfW - 4, -floor.floor_height * 0.2, halfD - 6]} rotation={[0.2, 0, 0]}>
                    <boxGeometry args={[6, 0.4, 12]} />
                    <meshStandardMaterial color="#334155" />
                  </mesh>
                </group>
              ) : (
                /* Above-ground floors with Central Courtyard Cutout */
                <group position={[0, posY, 0]}>
                  {/* West Wing (Left) */}
                  <mesh castShadow receiveShadow position={[-halfW + wingW / 2, 0, 0]}>
                    <boxGeometry args={[wingW, floor.floor_height, wingD]} />
                    <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.15} opacity={opacity} transparent={transparent} />
                  </mesh>

                  {/* East Wing (Right) */}
                  <mesh castShadow receiveShadow position={[halfW - wingW / 2, 0, 0]}>
                    <boxGeometry args={[wingW, floor.floor_height, wingD]} />
                    <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.15} opacity={opacity} transparent={transparent} />
                  </mesh>

                  {/* North Wing (Rear Connector) */}
                  <mesh castShadow receiveShadow position={[0, 0, halfD - (wingW * 0.8) / 2]}>
                    <boxGeometry args={[courtW, floor.floor_height, wingW * 0.8]} />
                    <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.15} opacity={opacity} transparent={transparent} />
                  </mesh>

                  {/* Architectural Floor Slab Edge Trim */}
                  <mesh position={[0, floor.floor_height / 2 - 0.08, 0]}>
                    <boxGeometry args={[floor.width + 0.3, 0.16, floor.depth + 0.3]} />
                    <meshStandardMaterial color="#475569" roughness={0.6} />
                  </mesh>

                  {/* Balcony Projections for Residential Floors (L3-L8) */}
                  {floor.zone_type === 'RESIDENTIAL' && (
                    <group position={[0, -floor.floor_height * 0.15, -halfD - 0.6]}>
                      <mesh castShadow position={[-halfW * 0.6, 0, 0]}>
                        <boxGeometry args={[floor.width * 0.35, 0.9, 1.2]} />
                        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
                      </mesh>
                      <mesh castShadow position={[halfW * 0.6, 0, 0]}>
                        <boxGeometry args={[floor.width * 0.35, 0.9, 1.2]} />
                        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
                      </mesh>
                    </group>
                  )}
                </group>
              )}

              {/* Rooftop Pergola & Pool on Top Floor (L9) */}
              {floor.floor_code === 'L9' && (
                <group position={[0, floor.elevation_y + floor.floor_height, 0]}>
                  {/* Parapet Wall */}
                  <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[floor.width + 0.2, 1.0, floor.depth + 0.2]} />
                    <meshStandardMaterial color="#94a3b8" roughness={0.6} />
                  </mesh>
                  {/* Sky Pool Basin */}
                  <mesh position={[-halfW * 0.5, 0.1, 0]}>
                    <boxGeometry args={[14, 0.2, 8]} />
                    <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.4} />
                  </mesh>
                  {/* Solar Panel Pergola Array */}
                  <mesh position={[halfW * 0.5, 2.4, 0]} rotation={[0.08, 0, 0]}>
                    <boxGeometry args={[16, 0.15, 12]} />
                    <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        );
      })}
    </group>
  );
}

// ==========================================
// STUDIO 3D WRAPPER COMPONENT
// ==========================================

export function Studio3D({
  lang,
  massingData,
  sunTime,
  setSunTime,
  activeFloorCode,
  setActiveFloorCode,
  hoveredFloor,
  setHoveredFloor
}) {
  const t = translations[lang] || translations.en;
  const controlsRef = useRef();
  const [isPlayingSun, setIsPlayingSun] = useState(false);
  const [viewMode, setViewMode] = useState('massing'); // 'massing' | 'section'

  // Animate sun timeline
  useEffect(() => {
    let animId;
    if (isPlayingSun) {
      animId = setInterval(() => {
        setSunTime((prev) => {
          let next = prev + 0.1;
          if (next > 18.0) next = 6.0;
          return parseFloat(next.toFixed(2));
        });
      }, 75);
    }
    return () => clearInterval(animId);
  }, [isPlayingSun, setSunTime]);

  const setCameraPreset = (preset) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const maxDim = 85;

    if (preset === 'perspective') {
      controls.object.position.set(maxDim * 1.2, maxDim * 1.0, maxDim * 1.2);
      controls.target.set(0, 18, 0);
    } else if (preset === 'top') {
      controls.object.position.set(0, maxDim * 2.0, 0.01);
      controls.target.set(0, 0, 0);
    } else if (preset === 'front') {
      controls.object.position.set(0, 18, maxDim * 1.8);
      controls.target.set(0, 18, 0);
    } else if (preset === 'courtyard') {
      controls.object.position.set(0, 6, 2);
      controls.target.set(0, 8, 0);
    }
    controls.update();
  };

  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* 3D WebGL Canvas (Light Architectural Studio Scene) */}
      <Canvas
        shadows
        camera={{ position: [85, 55, 95], fov: 38, near: 0.5, far: 2000 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 130, 400]} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.01}
          minDistance={10}
          maxDistance={300}
          target={[0, 16, 0]}
        />

        <SunLighting sunTime={sunTime} plotWidth={60} plotDepth={80} />

        {/* Crisp Architectural Grid */}
        <Grid
          position={[0, -0.22, 0]}
          args={[220, 220]}
          cellSize={5}
          cellThickness={0.6}
          cellColor="#cbd5e1"
          sectionSize={20}
          sectionThickness={1.2}
          sectionColor="#94a3b8"
        />

        <BuildingMassing3D
          massingData={massingData}
          activeFloorCode={activeFloorCode}
          setActiveFloorCode={setActiveFloorCode}
          viewMode={viewMode}
          hoveredFloor={hoveredFloor}
          setHoveredFloor={setHoveredFloor}
        />
      </Canvas>

      {/* TOP-LEFT: View Modes & Camera Presets Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-1 flex items-center shadow-md text-xs">
          <button
            onClick={() => setViewMode('massing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              viewMode === 'massing'
                ? 'bg-orange-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3D Massing
          </button>
          <button
            onClick={() => {
              setViewMode('section');
              setCameraPreset('courtyard');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              viewMode === 'section'
                ? 'bg-orange-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Courtyard Section
          </button>
        </div>

        {/* Camera Views */}
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl px-2 py-1 flex items-center gap-1 text-[11px] text-slate-700 shadow-md">
          <Eye className="w-3.5 h-3.5 text-orange-700 mr-1" />
          <button onClick={() => setCameraPreset('perspective')} className="px-2 py-1 rounded hover:bg-slate-100 cursor-pointer font-medium">Perspective</button>
          <button onClick={() => setCameraPreset('top')} className="px-2 py-1 rounded hover:bg-slate-100 cursor-pointer font-medium">Top</button>
          <button onClick={() => setCameraPreset('front')} className="px-2 py-1 rounded hover:bg-slate-100 cursor-pointer font-medium">Front</button>
          <button onClick={() => setCameraPreset('courtyard')} className="px-2 py-1 rounded hover:bg-slate-100 cursor-pointer text-emerald-700 font-bold">Courtyard</button>
        </div>
      </div>

      {/* TOP-RIGHT: Building Typology Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 shadow-md">
        <div className="font-bold text-slate-900 pb-1 border-b border-slate-200 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-orange-700" /> B + G + 9 Program
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-700">
          <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Ground & Commercial Podium
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-700">
          <span className="w-2.5 h-2.5 rounded bg-orange-600" /> Residential 2BHK/3BHK Tower
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-700">
          <span className="w-2.5 h-2.5 rounded bg-emerald-600" /> Sky Amenities & Green Terrace
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-700">
          <span className="w-2.5 h-2.5 rounded bg-green-500" /> Central Landscaped Courtyard
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-700">
          <span className="w-2.5 h-2.5 rounded bg-slate-500" /> B1 Basement Parking & EV
        </div>
      </div>

      {/* BOTTOM-CENTER: Solar Study & Courtyard Shadow Simulation Slider */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-3 shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-800 shrink-0">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold hidden sm:inline">Sun Study</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <input
              type="range"
              min="6"
              max="18"
              step="0.1"
              value={sunTime}
              onChange={(e) => {
                setIsPlayingSun(false);
                setSunTime(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-orange-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>06:00 AM</span>
              <span className="font-bold text-orange-700">{formatTime(sunTime)}</span>
              <span>06:00 PM</span>
            </div>
          </div>

          <button
            onClick={() => setIsPlayingSun(!isPlayingSun)}
            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition shrink-0 cursor-pointer"
            title={isPlayingSun ? 'Pause Solar Study' : 'Play Solar Timeline'}
          >
            {isPlayingSun ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
