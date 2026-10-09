import React, { useState } from 'react';
import { Sun, Wind, Trees, Droplets, Compass, Maximize2, Sparkles, Layers, Info, CheckCircle2 } from 'lucide-react';
import { translations } from '../utils/translations';

export function CourtyardStudio({ project, onUpdateProject, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [courtWidth, setCourtWidth] = useState(project?.program?.courtyard_width || 16.0);
  const [courtDepth, setCourtDepth] = useState(project?.program?.courtyard_depth || 20.0);
  const [greenCoverage, setGreenCoverage] = useState(38);
  const [hasWaterFeature, setHasWaterFeature] = useState(true);
  const [hasShadeTrees, setHasShadeTrees] = useState(true);
  const [sunHour, setSunHour] = useState(12); // 8 to 17
  const [viewMode, setViewMode] = useState('plan'); // 'plan' | 'section'

  // Computed metrics
  const area = Math.round(courtWidth * courtDepth);
  const daylightScore = Math.min(95, Math.max(60, Math.round(65 + (courtWidth * courtDepth) / 30 - (sunHour > 15 || sunHour < 10 ? 15 : 0))));
  const ventilationScore = Math.min(94, Math.max(65, Math.round(72 + (courtWidth / 2) + (hasWaterFeature ? 5 : 0))));
  const coolingDelta = (hasWaterFeature ? 1.8 : 0.6) + (greenCoverage > 35 ? 1.2 : 0.5);

  const handleUpdateDimensions = (w, d) => {
    setCourtWidth(w);
    setCourtDepth(d);
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        program: {
          ...project.program,
          courtyard_width: w,
          courtyard_depth: d
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
              <Trees className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'माइक्रोक्लाइमेट आर्किटेक्चर' : 'Microclimate Architecture'}
            </span>
            <span className="text-xs text-slate-500 font-mono">B + G + 9 Central Atrium</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'hi' ? 'केंद्रीय भूदृश्य प्रांगण स्टूडियो' : 'Central Landscaped Courtyard Studio'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi' 
              ? 'प्राकृतिक प्रकाश, स्टैक वेंटिलेशन और बायोफिलिक सूक्ष्म-जलवायु का सिमुलेशन'
              : 'Daylight penetration, stack-assisted natural ventilation, and biophilic microclimate simulation'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('plan')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                viewMode === 'plan' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? 'प्लान दृश्य (2D)' : 'Plan View (2D)'}
            </button>
            <button
              onClick={() => setViewMode('section')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                viewMode === 'section' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? 'क्रॉस-सेक्शन (स्टैक ड्राफ्ट)' : 'Cross-Section (Stack Draft)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Interactive Simulation Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
            {/* Viewport Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-indigo-600" />
                  {viewMode === 'plan' 
                    ? `${courtWidth}m × ${courtDepth}m (${area} m² Area)`
                    : 'B1 to L9 Stack Ventilation Section'}
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">
                  Aspect: 1 : {(courtDepth / courtWidth).toFixed(2)}
                </span>
              </div>

              {/* Sun Hour Slider */}
              <div className="flex items-center gap-2 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200">
                <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                <span className="text-xs font-medium text-amber-900 font-mono">
                  {sunHour.toString().padStart(2, '0')}:00 hrs
                </span>
                <input
                  type="range"
                  min="8"
                  max="17"
                  step="1"
                  value={sunHour}
                  onChange={(e) => setSunHour(parseInt(e.target.value))}
                  className="w-20 h-1.5 bg-amber-200 rounded-lg cursor-pointer accent-amber-600"
                />
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full h-80 bg-gradient-to-b from-sky-50 to-slate-100 rounded-lg border border-slate-200 relative flex items-center justify-center p-4">
              {viewMode === 'plan' ? (
                /* Plan View Diagram */
                <svg viewBox="0 0 400 320" className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                    </pattern>
                    <linearGradient id="sunShade" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.4" />
                    </linearGradient>
                    <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </radialGradient>
                  </defs>

                  {/* Surrounding Tower Building Footprint */}
                  <rect x="20" y="20" width="360" height="280" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" rx="6" />
                  <text x="30" y="40" fill="#64748b" fontSize="10" fontWeight="bold">NORTH RESIDENTIAL WING (L3–L8)</text>
                  <text x="30" y="290" fill="#64748b" fontSize="10" fontWeight="bold">SOUTH COMMERCIAL PODIUM (G–L2)</text>
                  <text x="32" y="165" fill="#64748b" fontSize="9" fontWeight="bold" transform="rotate(-90 32 165)">WEST WING</text>
                  <text x="372" y="165" fill="#64748b" fontSize="9" fontWeight="bold" transform="rotate(90 372 165)">EAST WING</text>

                  {/* Courtyard Cavity Cut-Out */}
                  {(() => {
                    const boxW = Math.min(260, Math.max(120, courtWidth * 8));
                    const boxH = Math.min(200, Math.max(100, courtDepth * 7));
                    const boxX = 200 - boxW / 2;
                    const boxY = 160 - boxH / 2;

                    // Calculate shadow offset based on sunHour
                    const shadowOffsetX = (sunHour - 12) * 5;
                    const shadowOffsetY = Math.abs(sunHour - 12) * 4;

                    return (
                      <g>
                        {/* Sun shadow casting on ground */}
                        <rect
                          x={boxX + (shadowOffsetX > 0 ? 0 : shadowOffsetX)}
                          y={boxY + shadowOffsetY}
                          width={boxW}
                          height={boxH}
                          fill="rgba(15, 23, 42, 0.08)"
                          rx="4"
                        />

                        {/* Courtyard Floor boundary */}
                        <rect
                          x={boxX}
                          y={boxY}
                          width={boxW}
                          height={boxH}
                          fill="url(#sunShade)"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          rx="4"
                        />

                        {/* Courtyard Grid */}
                        <rect x={boxX} y={boxY} width={boxW} height={boxH} fill="url(#grid)" />

                        {/* Water Feature if active */}
                        {hasWaterFeature && (
                          <g>
                            <rect
                              x={boxX + boxW * 0.35}
                              y={boxY + boxH * 0.35}
                              width={boxW * 0.3}
                              height={boxH * 0.3}
                              fill="url(#waterGrad)"
                              rx="6"
                              opacity="0.85"
                            />
                            <text
                              x={boxX + boxW * 0.5}
                              y={boxY + boxH * 0.52}
                              fill="#ffffff"
                              fontSize="8"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              ECO POND
                            </text>
                          </g>
                        )}

                        {/* Landscaped Green Zones & Trees */}
                        {hasShadeTrees && (
                          <g>
                            <circle cx={boxX + 24} cy={boxY + 24} r="14" fill="#22c55e" opacity="0.8" />
                            <circle cx={boxX + 24} cy={boxY + 24} r="6" fill="#15803d" />
                            <circle cx={boxX + boxW - 24} cy={boxY + 24} r="14" fill="#22c55e" opacity="0.8" />
                            <circle cx={boxX + boxW - 24} cy={boxY + 24} r="6" fill="#15803d" />
                            <circle cx={boxX + 24} cy={boxY + boxH - 24} r="14" fill="#22c55e" opacity="0.8" />
                            <circle cx={boxX + 24} cy={boxY + boxH - 24} r="6" fill="#15803d" />
                            <circle cx={boxX + boxW - 24} cy={boxY + boxH - 24} r="14" fill="#22c55e" opacity="0.8" />
                            <circle cx={boxX + boxW - 24} cy={boxY + boxH - 24} r="6" fill="#15803d" />
                          </g>
                        )}

                        {/* Dimension Annotations */}
                        <line x1={boxX} y1={boxY - 8} x2={boxX + boxW} y2={boxY - 8} stroke="#0f172a" strokeWidth="1.5" />
                        <text x={boxX + boxW / 2} y={boxY - 12} fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
                          {courtWidth}m WIDTH
                        </text>

                        <line x1={boxX - 8} y1={boxY} x2={boxX - 8} y2={boxY + boxH} stroke="#0f172a" strokeWidth="1.5" />
                        <text x={boxX - 12} y={boxY + boxH / 2} fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${boxX - 12} ${boxY + boxH / 2})`}>
                          {courtDepth}m DEPTH
                        </text>

                        {/* Air circulation arrows */}
                        <path d={`M ${boxX + 10} 160 Q ${boxX + boxW / 2} 150 ${boxX + boxW - 10} 160`} fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                        <polygon points={`${boxX + boxW - 6},160 ${boxX + boxW - 14},156 ${boxX + boxW - 14},164`} fill="#0284c7" />
                      </g>
                    );
                  })()}

                  {/* Compass */}
                  <g transform="translate(360, 45)">
                    <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                    <polygon points="0,-12 4,0 -4,0" fill="#dc2626" />
                    <polygon points="0,12 4,0 -4,0" fill="#64748b" />
                    <text x="0" y="-14" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
                  </g>
                </svg>
              ) : (
                /* Cross-Section Stack Ventilation Diagram */
                <svg viewBox="0 0 400 320" className="w-full h-full">
                  <defs>
                    <linearGradient id="warmAir" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.7" />
                    </linearGradient>
                  </defs>

                  {/* Ground Level Baseline */}
                  <line x1="10" y1="270" x2="390" y2="270" stroke="#475569" strokeWidth="2" />
                  <text x="20" y="285" fill="#64748b" fontSize="9" fontWeight="bold">GROUND LEVEL (±0.00)</text>

                  {/* Basement Level B1 */}
                  <rect x="30" y="270" width="340" height="40" fill="#cbd5e1" opacity="0.6" stroke="#64748b" />
                  <text x="40" y="295" fill="#334155" fontSize="9" fontWeight="bold">B1: SUBTERRANEAN PARKING & EV HUB (-3.50m)</text>

                  {/* Left Tower Stack (B+G+9) */}
                  <rect x="30" y="50" width="110" height="220" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                  <text x="40" y="70" fill="#1e293b" fontSize="9" fontWeight="bold">WEST TOWER (L3–L8)</text>
                  <text x="40" y="230" fill="#1e293b" fontSize="8">COMMERCIAL PODIUM</text>

                  {/* Right Tower Stack (B+G+9) */}
                  <rect x="260" y="50" width="110" height="220" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                  <text x="270" y="70" fill="#1e293b" fontSize="9" fontWeight="bold">EAST TOWER (L3–L8)</text>
                  <text x="270" y="230" fill="#1e293b" fontSize="8">COMMERCIAL PODIUM</text>

                  {/* Central Courtyard Void */}
                  <rect x="140" y="50" width="120" height="220" fill="url(#warmAir)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="200" y="90" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">OPEN COURTYARD VOID</text>

                  {/* Stack Ventilation Updraft Arrows */}
                  <g stroke="#f97316" strokeWidth="2.5" fill="none">
                    <path d="M 180 260 C 180 200, 190 140, 195 40" />
                    <path d="M 220 260 C 220 200, 210 140, 205 40" />
                  </g>
                  <polygon points="195,34 190,44 200,44" fill="#f97316" />
                  <polygon points="205,34 200,44 210,44" fill="#f97316" />

                  {/* Cool air intake arrows at base */}
                  <g stroke="#0284c7" strokeWidth="2" fill="none">
                    <path d="M 10 250 L 140 250" />
                    <path d="M 390 250 L 260 250" />
                  </g>
                  <polygon points="144,250 136,246 136,254" fill="#0284c7" />
                  <polygon points="256,250 264,246 264,254" fill="#0284c7" />
                  <text x="60" y="244" fill="#0284c7" fontSize="8" fontWeight="bold">COOL AIR INGRESS</text>
                  <text x="280" y="244" fill="#0284c7" fontSize="8" fontWeight="bold">COOL AIR INGRESS</text>

                  {/* Rooftop Exhaust Callout */}
                  <rect x="150" y="15" width="100" height="22" fill="#fff7ed" stroke="#fdba74" rx="4" />
                  <text x="200" y="30" fill="#c2410c" fontSize="8" fontWeight="bold" textAnchor="middle">
                    BUOYANCY EXHAUST (↑1.8 m/s)
                  </text>
                </svg>
              )}
            </div>

            {/* Microclimate Quick Indicators */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 flex items-center gap-2.5">
                <Sun className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-800 font-medium">{t.courtDaylight}</div>
                  <div className="text-lg font-bold text-emerald-950 font-mono">{daylightScore}%</div>
                  <div className="text-[10px] text-emerald-700">~4.5 hrs ground sun/day</div>
                </div>
              </div>

              <div className="bg-sky-50 rounded-lg p-3 border border-sky-100 flex items-center gap-2.5">
                <Wind className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <div className="text-xs text-sky-800 font-medium">{t.courtVent}</div>
                  <div className="text-lg font-bold text-sky-950 font-mono">{ventilationScore}%</div>
                  <div className="text-[10px] text-sky-700">Passive stack draft index</div>
                </div>
              </div>

              <div className="bg-teal-50 rounded-lg p-3 border border-teal-100 flex items-center gap-2.5">
                <Droplets className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <div className="text-xs text-teal-800 font-medium">
                    {lang === 'hi' ? 'तापमान कमी' : 'Local Cooling Effect'}
                  </div>
                  <div className="text-lg font-bold text-teal-950 font-mono">-{coolingDelta.toFixed(1)}°C</div>
                  <div className="text-[10px] text-teal-700">Evaporative microclimate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Parametric Controls & Architectural Notes (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Dimension Controls */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {lang === 'hi' ? 'प्रांगण आयाम और ज्यामिति' : 'Courtyard Geometry & Sizing'}
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    {lang === 'hi' ? 'प्रांगण चौड़ाई (पूर्व-पश्चिम)' : 'Courtyard Width (East-West)'}
                  </span>
                  <span className="font-bold text-indigo-600 font-mono">{courtWidth} m</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={courtWidth}
                  onChange={(e) => handleUpdateDimensions(parseFloat(e.target.value), courtDepth)}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>12m Min (Fire Turnaround)</span>
                  <span>24m Max (Open Quad)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    {lang === 'hi' ? 'प्रांगण गहराई (उत्तर-दक्षिण)' : 'Courtyard Depth (North-South)'}
                  </span>
                  <span className="font-bold text-indigo-600 font-mono">{courtDepth} m</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="28"
                  step="1"
                  value={courtDepth}
                  onChange={(e) => handleUpdateDimensions(courtWidth, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>14m Compact</span>
                  <span>28m Deep Plaza</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    {lang === 'hi' ? 'हरियाली और पारगम्य पेविंग' : 'Vegetation & Permeable Pavers'}
                  </span>
                  <span className="font-bold text-emerald-600 font-mono">{greenCoverage}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="2"
                  value={greenCoverage}
                  onChange={(e) => setGreenCoverage(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-medium text-slate-700">
                      {lang === 'hi' ? 'वाष्पीकरणीय वाटर फीचर / वर्षा जल बेसिन' : 'Evaporative Water Feature / Rain Garden'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasWaterFeature}
                    onChange={(e) => setHasWaterFeature(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Trees className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-slate-700">
                      {lang === 'hi' ? 'देशी छायादार वृक्ष (अमलतास / गुलमोहर)' : 'Native Canopy Shade Trees'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasShadeTrees}
                    onChange={(e) => setHasShadeTrees(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Architectural Design Guidance Box */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Info className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {lang === 'hi' ? 'वास्तुशिल्प मार्गदर्शन' : 'Architectural Design Guidance'}
              </span>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>NBC 2016 Part 8:</strong> Courtyard width ({courtWidth}m) satisfies the open light well requirement for B+G+9 mid-rise residential stacking.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Thermal Stack Effect:</strong> High aspect ratio creates a chimney effect, drawing cool breezes from ground-level arcade corridors through residential units.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Ground Ingress:</strong> Commercial retail on Level G wraps around the courtyard, providing pedestrian walkability and dining spill-over space.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
