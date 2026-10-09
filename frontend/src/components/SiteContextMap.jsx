import React, { useState } from 'react';
import { Compass, MapPin, Navigation, Layers, ShieldCheck, Sun, Wind, CheckCircle2, Info } from 'lucide-react';
import { translations } from '../utils/translations';

export function SiteContextMap({ project, onUpdateProject, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [plotWidth, setPlotWidth] = useState(project?.site?.plot_width || 60.0);
  const [plotDepth, setPlotDepth] = useState(project?.site?.plot_depth || 80.0);
  const [roadWidth, setRoadWidth] = useState(project?.site?.abutting_road_width || 18.0);
  const [setbackFront, setSetbackFront] = useState(project?.site?.setback_front || 7.5);
  const [setbackSides, setSetbackSides] = useState(project?.site?.setback_sides || 6.0);
  const [setbackRear, setSetbackRear] = useState(project?.site?.setback_rear || 6.0);
  
  const [showFireTurnaround, setShowFireTurnaround] = useState(true);
  const [showSunPath, setShowSunPath] = useState(true);
  const [showTransitRadius, setShowTransitRadius] = useState(true);

  // Computed dimensions
  const plotArea = Math.round(plotWidth * plotDepth);
  const buildableWidth = Math.max(10, plotWidth - (2 * setbackSides));
  const buildableDepth = Math.max(10, plotDepth - setbackFront - setbackRear);
  const buildableFootprint = Math.round(buildableWidth * buildableDepth);
  const maxCoveragePct = ((buildableFootprint / plotArea) * 100).toFixed(1);

  const handleUpdate = () => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        site: {
          ...project.site,
          plot_width: plotWidth,
          plot_depth: plotDepth,
          abutting_road_width: roadWidth,
          setback_front: setbackFront,
          setback_sides: setbackSides,
          setback_rear: setbackRear
        }
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800 overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'शहरी संदर्भ और जीआईएस' : 'Urban Site Context'}
            </span>
            <span className="text-xs text-slate-500 font-mono">Plot: {plotWidth}m × {plotDepth}m ({plotArea} m²)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'hi' ? 'साइट और शहरी संदर्भ मैपर' : 'Site & Urban Context Map'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'प्लॉट सीमाएं, अनिवार्य सेटबैक बफर, 18 मीटर सड़क संपर्क और ट्रांजिट कनेक्टिविटी'
              : 'Boundary perimeter, statutory setbacks, 18m arterial road access, and transit catchment'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600" />
            North Orientation: 0° Axis
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Interactive GIS & Cadastral SVG Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Cadastral Plot Boundary & Setback Envelope
              </span>
              <span className="text-xs font-mono text-slate-500">
                Buildable Footprint: {buildableWidth.toFixed(1)}m × {buildableDepth.toFixed(1)}m ({buildableFootprint} m²)
              </span>
            </div>

            {/* SVG Cadastral Map */}
            <div className="w-full h-96 bg-slate-900 rounded-lg border border-slate-800 relative flex items-center justify-center p-4 overflow-hidden">
              <svg viewBox="0 0 500 400" className="w-full h-full">
                <defs>
                  <pattern id="siteGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  </pattern>
                  <linearGradient id="roadAsphalt" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>

                {/* Background Grid */}
                <rect width="500" height="400" fill="#090d16" />
                <rect width="500" height="400" fill="url(#siteGrid)" />

                {/* Abutting Primary Road (South) */}
                <rect x="0" y="340" width="500" height="60" fill="url(#roadAsphalt)" stroke="#475569" />
                <line x1="0" y1="370" x2="500" y2="370" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 6" />
                <text x="250" y="385" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  PRIMARY ARTERIAL ROAD ({roadWidth}m WIDE) — DUAL CARRIAGEWAY
                </text>

                {/* Sidewalk & Tree line */}
                <rect x="0" y="330" width="500" height="10" fill="#334155" />
                <circle cx="50" cy="335" r="4" fill="#22c55e" />
                <circle cx="150" cy="335" r="4" fill="#22c55e" />
                <circle cx="250" cy="335" r="4" fill="#22c55e" />
                <circle cx="350" cy="335" r="4" fill="#22c55e" />
                <circle cx="450" cy="335" r="4" fill="#22c55e" />

                {/* Plot Boundary (Red Outline) */}
                {/* Scale: 60m x 80m -> 300px x 240px */}
                <rect x="100" y="70" width="300" height="260" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" rx="4" />
                <text x="110" y="90" fill="#ef4444" fontSize="10" fontWeight="bold">
                  PLOT BOUNDARY: {plotWidth}m × {plotDepth}m ({plotArea} m²)
                </text>

                {/* Setback Envelope (Cyan Dashed Box) */}
                {(() => {
                  const scaleX = 300 / plotWidth;
                  const scaleY = 260 / plotDepth;
                  const leftOffset = 100 + setbackSides * scaleX;
                  const rightWidth = (plotWidth - 2 * setbackSides) * scaleX;
                  const topOffset = 70 + setbackRear * scaleY;
                  const depthHeight = (plotDepth - setbackFront - setbackRear) * scaleY;

                  return (
                    <g>
                      {/* Non-buildable setback zone fill */}
                      <rect
                        x={leftOffset}
                        y={topOffset}
                        width={rightWidth}
                        height={depthHeight}
                        fill="#1e1b4b"
                        stroke="#818cf8"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        rx="4"
                      />

                      {/* Building Footprint (INFERNO B+G+9 Mass) */}
                      <rect
                        x={leftOffset + 10}
                        y={topOffset + 10}
                        width={rightWidth - 20}
                        height={depthHeight - 20}
                        fill="#312e81"
                        stroke="#6366f1"
                        strokeWidth="2"
                        rx="3"
                      />

                      {/* Central Courtyard Cutout in site map */}
                      <rect
                        x={leftOffset + rightWidth / 2 - 25}
                        y={topOffset + depthHeight / 2 - 25}
                        width="50"
                        height="50"
                        fill="#10b981"
                        stroke="#34d399"
                        strokeWidth="1.5"
                        rx="2"
                      />
                      <text
                        x={leftOffset + rightWidth / 2}
                        y={topOffset + depthHeight / 2 + 3}
                        fill="#ffffff"
                        fontSize="7"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        COURT
                      </text>

                      {/* Setback Annotations */}
                      {/* Front Setback */}
                      <text x={leftOffset + rightWidth / 2} y="324" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                        FRONT SETBACK: {setbackFront}m
                      </text>
                      {/* Rear Setback */}
                      <text x={leftOffset + rightWidth / 2} y={topOffset - 6} fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                        REAR SETBACK: {setbackRear}m
                      </text>
                      {/* Side Setbacks */}
                      <text x="75" y={topOffset + depthHeight / 2} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 75 ${topOffset + depthHeight / 2})`}>
                        SIDE {setbackSides}m
                      </text>
                      <text x="425" y={topOffset + depthHeight / 2} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" transform={`rotate(90 425 ${topOffset + depthHeight / 2})`}>
                        SIDE {setbackSides}m
                      </text>

                      {/* Fire Tender Turning Circle */}
                      {showFireTurnaround && (
                        <g>
                          <circle cx="100" cy="330" r="24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                          <text x="100" y="333" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">R9m FIRE</text>
                        </g>
                      )}
                    </g>
                  );
                })()}

                {/* Sun Path Arc */}
                {showSunPath && (
                  <g>
                    <path d="M 40 200 Q 250 10 460 200" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 4" />
                    <circle cx="250" cy="105" r="8" fill="#f59e0b" />
                    <text x="250" y="90" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">SOLAR NOON AZIMUTH</text>
                  </g>
                )}

                {/* Transit Radius Badge */}
                {showTransitRadius && (
                  <g transform="translate(30, 30)">
                    <rect width="130" height="28" fill="#1e293b" stroke="#334155" rx="4" />
                    <circle cx="14" cy="14" r="5" fill="#3b82f6" />
                    <text x="26" y="14" fill="#ffffff" fontSize="8" fontWeight="bold">METRO STATION: 350m</text>
                    <text x="26" y="23" fill="#94a3b8" fontSize="7">Transit-Oriented Corridor</text>
                  </g>
                )}

                {/* Compass Rose */}
                <g transform="translate(460, 45)">
                  <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="0,-14 4,0 -4,0" fill="#ef4444" />
                  <polygon points="0,14 4,0 -4,0" fill="#94a3b8" />
                  <text x="0" y="-16" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
                </g>
              </svg>
            </div>

            {/* Layer Toggles */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowFireTurnaround(!showFireTurnaround)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                  showFireTurnaround ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                Fire Tender Radius (9m)
              </button>
              <button
                onClick={() => setShowSunPath(!showSunPath)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                  showSunPath ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                Sun Path Arc (Equinox)
              </button>
              <button
                onClick={() => setShowTransitRadius(!showTransitRadius)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                  showTransitRadius ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                Transit Catchment (TOD)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Site Parameter Inputs & Dimensional Audit (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-600" />
              Plot Dimensions & Setback Controls
            </h2>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Plot Width (m)</label>
                  <input
                    type="number"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Plot Depth (m)</label>
                  <input
                    type="number"
                    value={plotDepth}
                    onChange={(e) => setPlotDepth(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Abutting Road Width (m)</label>
                <input
                  type="number"
                  value={roadWidth}
                  onChange={(e) => setRoadWidth(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">18m minimum required for FAR 3.00 & commercial transit</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block mb-2">Mandatory Setbacks</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Front (m)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={setbackFront}
                      onChange={(e) => setSetbackFront(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Sides (m)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={setbackSides}
                      onChange={(e) => setSetbackSides(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Rear (m)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={setbackRear}
                      onChange={(e) => setSetbackRear(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdate}
                className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Update Site Boundaries
              </button>
            </div>
          </div>

          {/* Footprint Audit Box */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Info className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">Buildable Footprint Audit</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-800">
              <span className="text-slate-400">Total Plot Area:</span>
              <span className="font-mono font-bold">{plotArea.toLocaleString()} m²</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-800">
              <span className="text-slate-400">Net Buildable Footprint:</span>
              <span className="font-mono font-bold text-indigo-300">{buildableFootprint.toLocaleString()} m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Permissible Ground Coverage:</span>
              <span className="font-mono font-bold text-emerald-400">{maxCoveragePct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
