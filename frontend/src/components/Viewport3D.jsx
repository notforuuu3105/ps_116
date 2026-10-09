import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Center } from '@react-three/drei';
import { BuildingMesh } from './BuildingMesh';
import { SunLighting } from './SunControl';
import { Sun, Play, Pause, RotateCcw, Eye, Compass, Layers } from 'lucide-react';

export function Viewport3D({
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

  // Animate sun timeline if play is active
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
    } else if (type === 'side') {
      controls.object.position.set(maxDim * 1.8, maxDim * 0.6, 0);
      controls.target.set(0, (massingData?.metrics?.total_building_height || 30) * 0.4, 0);
    }
    controls.update();
  };

  // Convert decimal hours (e.g. 14.5) to formatted 12-hour string (e.g. "02:30 PM")
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
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{
          position: [plotW * 1.3, (massingData?.metrics?.total_building_height || 40) * 1.2, plotD * 1.4],
          fov: 42,
          near: 0.5,
          far: 2000
        }}
        gl={{ antialias: true, alpha: false }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedFloor(null);
          }
        }}
      >
        <color attach="background" args={['#090d16']} />
        <fog attach="fog" args={['#090d16', Math.max(plotW, plotD) * 2, Math.max(plotW, plotD) * 6]} />

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.02} // Do not dip below ground
          minDistance={10}
          maxDistance={Math.max(plotW, plotD) * 4}
          target={[0, (massingData?.metrics?.total_building_height || 35) * 0.4, 0]}
        />

        {/* Dynamic Sun Lighting & Shadows */}
        <SunLighting sunTime={sunTime} plotWidth={plotW} plotDepth={plotD} />

        {/* Subtle Site Grid */}
        <Grid
          position={[0, -0.16, 0]}
          args={[plotW * 3, plotD * 3]}
          cellSize={5}
          cellThickness={0.7}
          cellColor="#1e293b"
          sectionSize={20}
          sectionThickness={1.2}
          sectionColor="#334155"
          fadeDistance={Math.max(plotW, plotD) * 2.5}
        />

        {/* Generative Building Mesh */}
        <BuildingMesh
          massingData={massingData}
          hoveredFloor={hoveredFloor}
          setHoveredFloor={setHoveredFloor}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
        />
      </Canvas>

      {/* FLOATING TOP-LEFT: View Controls HUD */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl p-1.5 shadow-xl text-xs text-slate-300">
        <span className="px-2 py-1 font-semibold text-slate-400 flex items-center gap-1 border-r border-slate-700/50">
          <Eye className="w-3.5 h-3.5 text-blue-400" /> Views
        </span>
        <button
          onClick={() => setCameraView('perspective')}
          className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 transition"
          title="3D Isometric / Perspective View"
        >
          Perspective
        </button>
        <button
          onClick={() => setCameraView('top')}
          className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 transition"
          title="Top Down Bird's Eye View"
        >
          Top
        </button>
        <button
          onClick={() => setCameraView('front')}
          className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 transition"
          title="Front Street Elevation View"
        >
          Front
        </button>
        <button
          onClick={() => setCameraView('side')}
          className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 transition"
          title="Side Profile View"
        >
          Side
        </button>
      </div>

      {/* FLOATING TOP-RIGHT: Architectural Zoning Legend */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 shadow-xl text-xs space-y-1.5">
        <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> Zoning Typology
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[#1E40AF] border border-blue-400/40 shadow-sm" />
          <span className="text-slate-300">Commercial / Retail Podium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[#059669] border border-emerald-400/40 shadow-sm" />
          <span className="text-slate-300">Sky Amenities & Green Terrace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[#EA580C] border border-orange-400/40 shadow-sm" />
          <span className="text-slate-300">Residential Tower Slabs</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="w-3.5 h-0.5 bg-[#38bdf8]" />
          <span className="text-slate-400 text-[11px]">Site Boundary Line</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-0.5 bg-[#eab308] border-b border-dashed" />
          <span className="text-slate-400 text-[11px]">Mandatory Setbacks</span>
        </div>
      </div>

      {/* FLOATING BOTTOM: Interactive Solar & Shadow Study Controller */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl px-5 py-3 shadow-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <Sun className="w-4 h-4 animate-spin-slow" />
            <span>Solar Study & Shadow Simulation</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlayingSun(!isPlayingSun)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg text-amber-300 transition"
            >
              {isPlayingSun ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlayingSun ? 'Pause' : 'Simulate Day'}</span>
            </button>
            <span className="font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-amber-300 text-xs font-semibold shadow-inner">
              {formatTime(sunTime)}
            </span>
          </div>
        </div>

        {/* Time Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-mono">06:00 AM</span>
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
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-[10px] text-slate-400 font-mono">06:00 PM</span>
        </div>
      </div>
    </div>
  );
}
