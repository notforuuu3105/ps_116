import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import { BuildingMesh } from './BuildingMesh';
import { SunLighting } from './SunControl';
import {
  Sun,
  Play,
  Pause,
  Eye,
  Layers,
  Sparkles,
  Scissors,
  Building,
  Home,
  ShoppingBag,
  Palmtree
} from 'lucide-react';

// ==========================================
// 3D INTERIOR CUT-SECTION ROOM COMPONENT
// ==========================================

function InteriorFloorCutSection({ floor, plotWidth, plotDepth }) {
  if (!floor) return null;

  const w = floor.width;
  const d = floor.depth;
  const h = 2.4; // Interior cut-away wall height (so you can look inside easily)
  const wallThick = 0.25;

  const zone = floor.zone_type; // COMMERCIAL, RESIDENTIAL, AMENITY

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Floor Slab Base Plinth */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[w, 0.2, d]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* Floor Tile Grid Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>

      {/* 2. Central Elevator & Fire Staircase Core (Concrete) */}
      <group position={[0, h / 2, 0]}>
        {/* Core Outer Enclosure */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[w * 0.22, h, d * 0.26]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>

        {/* Dual Elevator Doors (Stainless steel finish) */}
        <mesh position={[0, -0.2, (d * 0.26) / 2 + 0.05]}>
          <boxGeometry args={[w * 0.1, 1.8, 0.08]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* 3D Label for Core */}
        <Html position={[0, h * 0.8, 0]} center distanceFactor={45}>
          <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap pointer-events-none">
            🛗 Lift & Fire Core
          </div>
        </Html>
      </group>

      {/* 3. Central Access Corridor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.9, d * 0.12]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[d * 0.9, w * 0.1]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>

      {/* 4. Zone Specific Partitions */}

      {/* CASE A: RESIDENTIAL (2BHK / 3BHK Units) */}
      {zone === 'RESIDENTIAL' && (
        <group>
          {/* Unit 1: Top-Left (3BHK Flat, 110 m²) */}
          <group position={[-w * 0.26, h / 2, -d * 0.26]}>
            {/* Dividing Walls */}
            <mesh castShadow position={[0, 0, (d * 0.24) / 2]}>
              <boxGeometry args={[w * 0.44, h, wallThick]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} opacity={0.85} transparent />
            </mesh>
            <mesh castShadow position={[(w * 0.44) / 2, 0, 0]}>
              <boxGeometry args={[wallThick, h, d * 0.48]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} opacity={0.85} transparent />
            </mesh>
            {/* Balcony Railing */}
            <mesh position={[-w * 0.18, -h * 0.2, -d * 0.22]}>
              <boxGeometry args={[w * 0.12, 0.8, 0.05]} />
              <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
            </mesh>
            {/* 3D Unit Label */}
            <Html position={[0, 0.3, 0]} center distanceFactor={40}>
              <div className="bg-orange-950/90 text-orange-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-orange-700 whitespace-nowrap pointer-events-none">
                🏠 Unit A: 3BHK (110m²)
              </div>
            </Html>
          </group>

          {/* Unit 2: Top-Right (2BHK Flat, 85 m²) */}
          <group position={[w * 0.26, h / 2, -d * 0.26]}>
            <mesh castShadow position={[0, 0, (d * 0.24) / 2]}>
              <boxGeometry args={[w * 0.44, h, wallThick]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} opacity={0.85} transparent />
            </mesh>
            <Html position={[0, 0.3, 0]} center distanceFactor={40}>
              <div className="bg-orange-950/90 text-orange-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-orange-700 whitespace-nowrap pointer-events-none">
                🏠 Unit B: 2BHK (85m²)
              </div>
            </Html>
          </group>

          {/* Unit 3: Bottom-Left (2BHK Flat, 85 m²) */}
          <group position={[-w * 0.26, h / 2, d * 0.26]}>
            <mesh castShadow position={[0, 0, -(d * 0.24) / 2]}>
              <boxGeometry args={[w * 0.44, h, wallThick]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} opacity={0.85} transparent />
            </mesh>
            <Html position={[0, 0.3, 0]} center distanceFactor={40}>
              <div className="bg-orange-950/90 text-orange-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-orange-700 whitespace-nowrap pointer-events-none">
                🏠 Unit C: 2BHK (85m²)
              </div>
            </Html>
          </group>

          {/* Unit 4: Bottom-Right (3BHK Flat, 110 m²) */}
          <group position={[w * 0.26, h / 2, d * 0.26]}>
            <mesh castShadow position={[0, 0, -(d * 0.24) / 2]}>
              <boxGeometry args={[w * 0.44, h, wallThick]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} opacity={0.85} transparent />
            </mesh>
            <Html position={[0, 0.3, 0]} center distanceFactor={40}>
              <div className="bg-orange-950/90 text-orange-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-orange-700 whitespace-nowrap pointer-events-none">
                🏠 Unit D: 3BHK (110m²)
              </div>
            </Html>
          </group>
        </group>
      )}

      {/* CASE B: COMMERCIAL PODIUM (Anchor Retail & Supermarket Units) */}
      {zone === 'COMMERCIAL' && (
        <group>
          {/* Retail Anchor Left */}
          <group position={[-w * 0.25, h / 2, 0]}>
            <mesh castShadow position={[(w * 0.45) / 2, 0, 0]}>
              <boxGeometry args={[wallThick, h, d * 0.85]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} opacity={0.9} transparent />
            </mesh>
            {/* Checkout Counters */}
            <mesh position={[0, -h * 0.3, d * 0.2]}>
              <boxGeometry args={[w * 0.2, 0.9, 0.6]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.4} />
            </mesh>
            <Html position={[0, 0.4, 0]} center distanceFactor={40}>
              <div className="bg-blue-950/90 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-blue-700 whitespace-nowrap pointer-events-none">
                🛍️ Retail Anchor Store (420m²)
              </div>
            </Html>
          </group>

          {/* Retail Stores Right */}
          <group position={[w * 0.25, h / 2, 0]}>
            <mesh castShadow position={[-(w * 0.45) / 2, 0, 0]}>
              <boxGeometry args={[wallThick, h, d * 0.85]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} opacity={0.9} transparent />
            </mesh>
            {/* Shop Divider */}
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[w * 0.45, h, wallThick]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} opacity={0.9} transparent />
            </mesh>
            <Html position={[0, 0.4, -d * 0.2]} center distanceFactor={40}>
              <div className="bg-blue-950/90 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-blue-700 whitespace-nowrap pointer-events-none">
                ☕ Commercial Cafe & Food Court
              </div>
            </Html>
            <Html position={[0, 0.4, d * 0.2]} center distanceFactor={40}>
              <div className="bg-blue-950/90 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-blue-700 whitespace-nowrap pointer-events-none">
                🏦 Banking / Financial Branch
              </div>
            </Html>
          </group>
        </group>
      )}

      {/* CASE C: SKY AMENITY (Clubhouse, Gym, Swimming Pool) */}
      {zone === 'AMENITY' && (
        <group>
          {/* Swimming Pool Basin */}
          <group position={[-w * 0.22, 0.05, 0]}>
            <mesh receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[w * 0.35, 0.1, d * 0.55]} />
              <meshStandardMaterial color="#06b6d4" roughness={0.1} metalness={0.3} />
            </mesh>
            <Html position={[0, 0.3, 0]} center distanceFactor={40}>
              <div className="bg-cyan-950/90 text-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-cyan-700 whitespace-nowrap pointer-events-none">
                🏊 Infinite Sky Pool (18m × 8m)
              </div>
            </Html>
          </group>

          {/* Indoor Gymnasium & Clubhouse */}
          <group position={[w * 0.22, h / 2, 0]}>
            <mesh castShadow position={[-(w * 0.4) / 2, 0, 0]}>
              <boxGeometry args={[wallThick, h, d * 0.7]} />
              <meshStandardMaterial color="#059669" roughness={0.4} opacity={0.85} transparent />
            </mesh>
            <Html position={[0, 0.3, 0]} center distanceFactor={40}>
              <div className="bg-emerald-950/90 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-emerald-700 whitespace-nowrap pointer-events-none">
                🏋️ Fitness Gym & Wellness Spa
              </div>
            </Html>
          </group>
        </group>
      )}
    </group>
  );
}

// ==========================================
// MAIN STUDIO 3D INSPECTOR COMPONENT
// ==========================================

export function Studio3DInspector({
  massingData,
  sunTime,
  setSunTime,
  hoveredFloor,
  setHoveredFloor,
  selectedFloor,
  setSelectedFloor
}) {
  const controlsRef = useRef();
  const [isPlayingSun, setIsPlayingSun] = useState(false);
  const [viewportMode, setViewportMode] = useState('massing'); // 'massing' | 'room_inspector'
  const [inspectedFloorIndex, setInspectedFloorIndex] = useState(0);

  const floors = massingData?.floors || [];
  const currentFloor = floors[inspectedFloorIndex] || floors[0];

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
      }, 80);
    }
    return () => clearInterval(animId);
  }, [isPlayingSun, setSunTime]);

  const setCameraView = (type) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const maxDim = Math.max(
      massingData?.plot_width || 60,
      massingData?.plot_depth || 80,
      massingData?.metrics?.total_building_height || 45
    );

    if (type === 'perspective') {
      controls.object.position.set(maxDim * 1.3, maxDim * 1.1, maxDim * 1.3);
      controls.target.set(0, (massingData?.metrics?.total_building_height || 30) * 0.4, 0);
    } else if (type === 'top') {
      controls.object.position.set(0, maxDim * 2.2, 0.01);
      controls.target.set(0, 0, 0);
    } else if (type === 'front') {
      controls.object.position.set(0, maxDim * 0.6, maxDim * 1.8);
      controls.target.set(0, (massingData?.metrics?.total_building_height || 30) * 0.4, 0);
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

  const plotW = massingData?.plot_width || 60;
  const plotD = massingData?.plot_depth || 80;

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [plotW * 1.2, (massingData?.metrics?.total_building_height || 35) * 1.2, plotD * 1.3],
          fov: 40,
          near: 0.5,
          far: 2000
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', Math.max(plotW, plotD) * 2, Math.max(plotW, plotD) * 5]} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.02}
          minDistance={10}
          maxDistance={Math.max(plotW, plotD) * 4}
          target={[0, viewportMode === 'room_inspector' ? 1.0 : (massingData?.metrics?.total_building_height || 35) * 0.35, 0]}
        />

        <SunLighting sunTime={sunTime} plotWidth={plotW} plotDepth={plotD} />

        <Grid
          position={[0, -0.16, 0]}
          args={[plotW * 3, plotD * 3]}
          cellSize={5}
          cellThickness={0.7}
          cellColor="#334155"
          sectionSize={20}
          sectionThickness={1.2}
          sectionColor="#475569"
        />

        {/* Viewport Mode 1: 3D Exterior Massing */}
        {viewportMode === 'massing' && (
          <BuildingMesh
            massingData={massingData}
            hoveredFloor={hoveredFloor}
            setHoveredFloor={setHoveredFloor}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
          />
        )}

        {/* Viewport Mode 2: Cut-Section Room Inspector */}
        {viewportMode === 'room_inspector' && currentFloor && (
          <InteriorFloorCutSection
            floor={currentFloor}
            plotWidth={plotW}
            plotDepth={plotD}
          />
        )}
      </Canvas>

      {/* TOP-LEFT: Dual-Mode Viewport Switcher & Floor Level Selector */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        {/* Mode Toggle Button */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1 shadow-md flex items-center text-xs">
          <button
            onClick={() => setViewportMode('massing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              viewportMode === 'massing'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>3D Massing View</span>
          </button>
          <button
            onClick={() => {
              setViewportMode('room_inspector');
              if (controlsRef.current) {
                controlsRef.current.object.position.set(0, plotD * 0.9, plotD * 0.9);
                controlsRef.current.target.set(0, 1, 0);
                controlsRef.current.update();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              viewportMode === 'room_inspector'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Room-Wise Inspector (Cut-Section)</span>
          </button>
        </div>

        {/* Floor Level Selector (Active in Room Inspector Mode) */}
        {viewportMode === 'room_inspector' && floors.length > 0 && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Inspect Level:</span>
            <select
              value={inspectedFloorIndex}
              onChange={(e) => setInspectedFloorIndex(parseInt(e.target.value, 10))}
              className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none"
            >
              {floors.map((f) => (
                <option key={f.floor_index} value={f.floor_index}>
                  {f.floor_label} ({f.zone_type})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TOP-RIGHT: Architectural Zoning Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-md text-xs space-y-1.5">
        <div className="font-bold text-[#003366] pb-1 border-b border-slate-200 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" /> Zoning Typology
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[#1E40AF]" />
          <span className="text-slate-800 font-medium">Commercial Retail Podium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[#059669]" />
          <span className="text-slate-800 font-medium">Sky Amenities Deck</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[#EA580C]" />
          <span className="text-slate-800 font-medium">Residential Tower Units</span>
        </div>
      </div>

      {/* FLOATING BOTTOM: Solar Study Controller (In Massing Mode) */}
      {viewportMode === 'massing' && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-xl bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-5 py-3 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <Sun className="w-4 h-4 animate-spin-slow text-amber-500" />
              <span>Solar Study & Shadow Simulation (NBC 2016 Daylighting)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingSun(!isPlayingSun)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-amber-800 transition font-semibold cursor-pointer"
              >
                {isPlayingSun ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlayingSun ? 'Pause' : 'Simulate Day'}</span>
              </button>
              <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-slate-900 text-xs font-bold">
                {formatTime(sunTime)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono">06:00 AM</span>
            <input
              type="range"
              min="6.0"
              max="18.0"
              step="0.1"
              value={sunTime}
              onChange={(e) => {
                setSunTime(parseFloat(e.target.value));
                if (isPlayingSun) setIsPlayingSun(false);
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#003366]"
            />
            <span className="text-[10px] text-slate-500 font-mono">06:00 PM</span>
          </div>
        </div>
      )}
    </div>
  );
}
