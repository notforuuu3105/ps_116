import React, { useState } from 'react';
import { ShieldCheck, Sun, Layers, Leaf, Sliders, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';

export function FacadeStudio({ project, onUpdateProject, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [activeOrientation, setActiveOrientation] = useState('south'); // 'south' | 'west' | 'east' | 'north'
  const [wwr, setWwr] = useState(project?.facade?.window_wall_ratio || 40);
  const [finDepth, setFinDepth] = useState(0.6); // meters
  const [balconyDepth, setBalconyDepth] = useState(project?.facade?.balcony_depth || 1.8);
  const [hasVerticalFins, setHasVerticalFins] = useState(project?.facade?.has_vertical_fins ?? true);
  const [hasHorizontalLouvers, setHasHorizontalLouvers] = useState(project?.facade?.has_horizontal_louvers ?? true);
  const [hasGreenPlanters, setHasGreenPlanters] = useState(true);
  const [glassType, setGlassType] = useState('dgu_lowe'); // 'dgu_lowe' | 'triple_lowe' | 'standard_dgu'

  // Calculations
  const shadingFactor = (hasVerticalFins ? 18 : 0) + (hasHorizontalLouvers ? 22 : 0) + (balconyDepth * 6) + (hasGreenPlanters ? 8 : 0);
  const heatReduction = Math.min(52, Math.max(15, Math.round(shadingFactor * (1 - (wwr - 30) / 100))));
  const daylightAutonomy = Math.min(92, Math.max(55, Math.round(50 + (wwr * 0.8) - (shadingFactor * 0.2))));
  const hvacSavings = (heatReduction * 0.58).toFixed(1);

  const handleUpdate = () => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        facade: {
          ...project.facade,
          window_wall_ratio: wwr,
          balcony_depth: balconyDepth,
          has_vertical_fins: hasVerticalFins,
          has_horizontal_louvers: hasHorizontalLouvers,
          shading_intensity: heatReduction
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'जलवायु-अनुकूल मुखौटा' : 'Climate-Responsive Envelope'}
            </span>
            <span className="text-xs text-slate-500 font-mono">ECBC & NBC 2016 Compliant</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'hi' ? 'जलवायु-अनुकूल मुखौटा स्टूडियो' : 'Climate-Responsive Façade Studio'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'सौर ताप नियंत्रण, लूर्वर शेडिंग, बालकनी बफर और डेलाइट अनुकूलन'
              : 'Solar heat gain mitigation, passive shading louvers, thermal balconies, and daylight autonomy'}
          </p>
        </div>

        {/* Orientation Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          {[
            { id: 'south', label: lang === 'hi' ? 'दक्षिण (South)' : 'South' },
            { id: 'west', label: lang === 'hi' ? 'पश्चिम (West)' : 'West' },
            { id: 'east', label: lang === 'hi' ? 'पूर्व (East)' : 'East' },
            { id: 'north', label: lang === 'hi' ? 'उत्तर (North)' : 'North' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveOrientation(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeOrientation === item.id ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Interactive Facade Elevation Visualizer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                {lang === 'hi' 
                  ? `मुखौटा मॉड्यूल उन्नयन (Elevation) — ${activeOrientation.toUpperCase()} विंग`
                  : `Façade Module Elevation — ${activeOrientation.toUpperCase()} Orientation`}
              </span>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded font-mono font-medium">
                WWR: {wwr}% | Fin: {finDepth}m
              </span>
            </div>

            {/* Facade Module Elevation SVG */}
            <div className="w-full h-84 bg-slate-900 rounded-lg border border-slate-800 relative flex items-center justify-center p-4 overflow-hidden">
              <svg viewBox="0 0 460 320" className="w-full h-full">
                <defs>
                  <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id="spandrel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <pattern id="brickPattern" width="16" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 0 8 L 16 8 M 8 0 L 8 8" fill="none" stroke="#64748b" strokeWidth="0.5" />
                  </pattern>
                </defs>

                {/* Concrete Structural Frame (Slab & Columns) */}
                <rect x="30" y="20" width="400" height="280" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="4" />
                
                {/* Upper Floor Slab */}
                <rect x="30" y="20" width="400" height="24" fill="url(#spandrel)" />
                <text x="40" y="36" fill="#94a3b8" fontSize="9" fontWeight="bold">CONCRETE SLAB L6 (+18.5m)</text>

                {/* Middle Floor Slab */}
                <rect x="30" y="160" width="400" height="24" fill="url(#spandrel)" />
                <text x="40" y="176" fill="#94a3b8" fontSize="9" fontWeight="bold">CONCRETE SLAB L5 (+15.0m)</text>

                {/* Structural Vertical Columns */}
                <rect x="30" y="20" width="24" height="280" fill="#334155" />
                <rect x="220" y="20" width="20" height="280" fill="#334155" />
                <rect x="406" y="20" width="24" height="280" fill="#334155" />

                {/* Bay 1: Residential Bedroom Window Unit */}
                {/* Solid Wall background */}
                <rect x="54" y="44" width="166" height="116" fill="#1e293b" />
                <rect x="54" y="44" width="166" height="116" fill="url(#brickPattern)" opacity="0.3" />

                {/* Window cutout sized by WWR */}
                {(() => {
                  const winW = Math.round(166 * (wwr / 70));
                  const winH = Math.round(116 * (wwr / 75));
                  const winX = 54 + (166 - winW) / 2;
                  const winY = 44 + (116 - winH) / 2;

                  return (
                    <g>
                      {/* Window Glazing */}
                      <rect x={winX} y={winY} width={winW} height={winH} fill="url(#glassReflection)" stroke="#38bdf8" strokeWidth="2" rx="2" />
                      <line x1={winX + winW / 2} y1={winY} x2={winX + winW / 2} y2={winY + winH} stroke="#38bdf8" strokeWidth="1.5" />
                      <text x={winX + winW / 2} y={winY + winH / 2} fill="#bae6fd" fontSize="9" textAnchor="middle" fontWeight="bold">
                        DGU LOW-E
                      </text>

                      {/* Vertical Fins if enabled */}
                      {hasVerticalFins && (
                        <g>
                          <rect x={winX - 6} y={winY - 8} width={8} height={winH + 16} fill="#f59e0b" rx="2" />
                          <rect x={winX + winW / 2 - 4} y={winY - 8} width={8} height={winH + 16} fill="#f59e0b" rx="2" />
                          <rect x={winX + winW - 2} y={winY - 8} width={8} height={winH + 16} fill="#f59e0b" rx="2" />
                          <text x={winX + winW - 14} y={winY - 12} fill="#fbbf24" fontSize="8" fontWeight="bold">FIN {finDepth}m</text>
                        </g>
                      )}

                      {/* Horizontal Louver Canopy if enabled */}
                      {hasHorizontalLouvers && (
                        <g>
                          <rect x={winX - 10} y={winY - 14} width={winW + 20} height="5" fill="#38bdf8" rx="2" />
                          <rect x={winX - 8} y={winY - 6} width={winW + 16} height="4" fill="#38bdf8" rx="2" />
                        </g>
                      )}
                    </g>
                  );
                })()}

                {/* Bay 2 (Lower Level): Living Room Deep Balcony */}
                <rect x="54" y="184" width="166" height="116" fill="#0f172a" />
                <rect x="54" y="260" width="166" height="40" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                <line x1="54" y1="260" x2="220" y2="260" stroke="#f1f5f9" strokeWidth="2" />
                <text x="137" y="284" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                  BALCONY RECESS ({balconyDepth}m DEEP)
                </text>

                {/* Planter Box on Balcony */}
                {hasGreenPlanters && (
                  <g>
                    <rect x="58" y="246" width="158" height="14" fill="#15803d" rx="2" />
                    <circle cx="70" cy="242" r="7" fill="#22c55e" />
                    <circle cx="95" cy="240" r="8" fill="#4ade80" />
                    <circle cx="120" cy="242" r="7" fill="#22c55e" />
                    <circle cx="145" cy="240" r="9" fill="#16a34a" />
                    <circle cx="170" cy="241" r="7" fill="#4ade80" />
                    <circle cx="195" cy="242" r="8" fill="#22c55e" />
                    <text x="137" y="256" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                      BIOPHILIC PLANTER
                    </text>
                  </g>
                )}

                {/* Bay 3 & 4 (Right): Commercial Glazed Bay */}
                <rect x="240" y="44" width="166" height="256" fill="url(#glassReflection)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
                <text x="323" y="150" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                  DOUBLE HEIGHT PODIUM GLAZING
                </text>
                <text x="323" y="170" fill="#94a3b8" fontSize="8" textAnchor="middle">
                  SHGC 0.28 | VLT 58%
                </text>

                {/* Sun Ray Angle Vector */}
                <g stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3">
                  <line x1="10" y1="10" x2="110" y2="70" />
                  <polygon points="110,70 100,64 105,74" fill="#f59e0b" />
                </g>
                <text x="18" y="14" fill="#f59e0b" fontSize="8" fontWeight="bold">SOLAR INCIDENCE 48°</text>
              </svg>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-center gap-2.5">
                <Sun className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="text-xs text-amber-800 font-medium">{t.solarHeatReduction}</div>
                  <div className="text-lg font-bold text-amber-950 font-mono">-{heatReduction}%</div>
                  <div className="text-[10px] text-amber-700">Cooling load mitigation</div>
                </div>
              </div>

              <div className="bg-sky-50 rounded-lg p-3 border border-sky-100 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <div className="text-xs text-sky-800 font-medium">Daylight Autonomy (sDA)</div>
                  <div className="text-lg font-bold text-sky-950 font-mono">{daylightAutonomy}%</div>
                  <div className="text-[10px] text-sky-700">&gt;300 lux occupied zone</div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-800 font-medium">HVAC Energy Savings</div>
                  <div className="text-lg font-bold text-emerald-950 font-mono">~{hvacSavings}</div>
                  <div className="text-[10px] text-emerald-700">kWh / m² / year</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Parameter Sliders & Material Spec (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              {lang === 'hi' ? 'मुखौटा पैरामीटर और शेडिंग नियंत्रण' : 'Façade Parameters & Shading'}
            </h2>

            <div className="space-y-4">
              {/* WWR Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{t.windowRatio}</span>
                  <span className="font-bold text-indigo-600 font-mono">{wwr}%</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="60"
                  step="5"
                  value={wwr}
                  onChange={(e) => setWwr(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>25% (High Insulation)</span>
                  <span>40% (ECBC Target)</span>
                  <span>60% (Max)</span>
                </div>
              </div>

              {/* Balcony Recess Depth */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{t.balconyDepth}</span>
                  <span className="font-bold text-indigo-600 font-mono">{balconyDepth} m</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="2.4"
                  step="0.1"
                  value={balconyDepth}
                  onChange={(e) => setBalconyDepth(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>1.2m Standard</span>
                  <span>1.8m Deep Cantilever</span>
                  <span>2.4m Terrace</span>
                </div>
              </div>

              {/* Fin Projection Depth */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Louver / Fin Projection Depth</span>
                  <span className="font-bold text-indigo-600 font-mono">{finDepth} m</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.1"
                  value={finDepth}
                  onChange={(e) => setFinDepth(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <span className="text-xs font-medium text-slate-700">
                    {lang === 'hi' ? 'वर्टिकल शेडिंग फिन्स (East / West)' : 'Vertical Shading Fins (East / West)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={hasVerticalFins}
                    onChange={(e) => setHasVerticalFins(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <span className="text-xs font-medium text-slate-700">
                    {lang === 'hi' ? 'हॉरिजॉन्टल ओवरहैंग लूर्वर्स (South)' : 'Horizontal Louvers (South Orientation)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={hasHorizontalLouvers}
                    onChange={(e) => setHasHorizontalLouvers(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-medium text-slate-700">
                      {lang === 'hi' ? 'बालकनी प्लांटर बॉक्सेस (ग्रीन बफर)' : 'Integrated Balcony Planters (Green Buffer)'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasGreenPlanters}
                    onChange={(e) => setHasGreenPlanters(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                  />
                </label>
              </div>

              {/* Glass Specification Selector */}
              <div className="pt-2">
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Glazing Assembly Specification
                </label>
                <select
                  value={glassType}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="dgu_lowe">Double Glazed Low-E (U: 1.8 W/m²K, SHGC: 0.28) — Recommended</option>
                  <option value="triple_lowe">Triple Glazed Argon (U: 1.1 W/m²K, SHGC: 0.22) — Ultra Green</option>
                  <option value="standard_dgu">Standard Double Glazed (U: 2.8 W/m²K, SHGC: 0.52)</option>
                </select>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleUpdate}
                className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'hi' ? 'मुखौटा सेटिंग्स लागू करें' : 'Apply Façade Specifications'}
              </button>
            </div>
          </div>

          {/* Architectural Envelope Notes */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Info className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                ECBC Envelope Guideline
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under BEE ECBC (Energy Conservation Building Code), WWR should ideally not exceed 40% for composite climates unless offset by deep overhangs (projection factor &ge; 0.4) and low SHGC glazing. The current configuration achieves compliance with a <strong>{heatReduction}%</strong> heat gain reduction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
