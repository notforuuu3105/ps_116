import React, { useState } from 'react';
import {
  Compass,
  Car,
  Zap,
  Home,
  ShoppingBag,
  Palmtree,
  Maximize2,
  TreePine,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bed,
  Bath,
  Utensils,
  Sun
} from 'lucide-react';
import { translations } from '../utils/translations';

export function FloorPlanStudio({
  lang,
  massingData,
  activeFloorCode,
  setActiveFloorCode
}) {
  const t = translations[lang] || translations.en;

  const floorCodes = ['B1', 'G', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'];
  const [selectedUnit, setSelectedUnit] = useState('unit_a');

  const plotW = massingData?.plot_width || 60;
  const plotD = massingData?.plot_depth || 80;
  const courtW = massingData?.courtyard?.width || 16;
  const courtD = massingData?.courtyard?.depth || 20;

  // Determine active floor type
  const isB1 = activeFloorCode === 'B1';
  const isG = activeFloorCode === 'G';
  const isPodium = activeFloorCode === 'L1' || activeFloorCode === 'L2';
  const isResidential = ['L3', 'L4', 'L5', 'L6', 'L7', 'L8'].includes(activeFloorCode);
  const isAmenity = activeFloorCode === 'L9';

  return (
    <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-slate-100 text-slate-800 select-none">
      {/* 1. Left Controls: Floor Selector & Layer Toggles */}
      <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto shrink-0 shadow-xs z-10">
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Interactive Floor Plan Studio</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Select building level to inspect architectural layout, zoning, and unit spaces.
            </p>
          </div>

          {/* Level Switcher Grid */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Level</span>
            <div className="grid grid-cols-4 gap-1.5">
              {floorCodes.map((fc) => (
                <button
                  key={fc}
                  onClick={() => setActiveFloorCode(fc)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center cursor-pointer ${
                    activeFloorCode === fc
                      ? 'bg-orange-700 text-white shadow-xs font-black'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {fc}
                </button>
              ))}
            </div>
          </div>

          {/* Active Level Summary Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="text-orange-800 font-bold flex items-center justify-between">
              <span>Level {activeFloorCode}</span>
              <span className="text-[10px] font-mono bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                {isB1 ? 'Subterranean' : isResidential ? 'Tower' : isAmenity ? 'Rooftop' : 'Podium'}
              </span>
            </div>
            <div className="text-slate-700 font-medium text-[11px]">
              {isB1 && 'Basement B1 — Parking & EV Hub'}
              {isG && 'Ground Floor (G) — Commercial Plaza & Courtyard'}
              {isPodium && 'Commercial / Co-Working Shared Podium'}
              {isResidential && 'Residential 2BHK & 3BHK Living Units'}
              {isAmenity && 'Sky Amenities Deck & Terrace Garden'}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
            <div className="font-semibold text-slate-800">Space Legend:</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-blue-600" />
              <span>Commercial / Retail Area</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-orange-600" />
              <span>Residential Apartments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-emerald-600" />
              <span>Central Courtyard / Landscape</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-slate-400" />
              <span>Concrete Elevator & Fire Core</span>
            </div>
            {isB1 && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-teal-500" />
                <span>Dedicated EV Charging Bays</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400">
          Scale 1:100 • Metric Units • Centralized Courtyard Design
        </div>
      </aside>

      {/* 2. Center: 2D Blueprint SVG Canvas (Light CAD Blueprint Theme) */}
      <main className="flex-1 h-full relative flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden cad-grid-light">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-w-3xl max-h-[85vh] drop-shadow-md font-mono text-[2.2px] select-none bg-white border border-slate-300 rounded-xl"
        >
          <defs>
            <pattern id="cadGrid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
            </pattern>
            <pattern id="evPattern" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#ccfbf1" />
              <line x1="0" y1="0" x2="4" y2="4" stroke="#0d9488" strokeWidth="0.4" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect x="0" y="0" width="100" height="100" fill="url(#cadGrid)" />

          {/* Plot Boundary Border */}
          <rect x="5" y="5" width="90" height="90" fill="#ffffff" stroke="#c2410c" strokeWidth="0.6" strokeDasharray="2 1" />

          {/* Road Strip at Bottom */}
          <rect x="5" y="87" width="90" height="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.3" />
          <text x="50" y="92" textAnchor="middle" fill="#475569" fontSize="2.5" fontWeight="bold">
            PRIMARY ARTERIAL ACCESS ROAD (18.0M ROW)
          </text>

          {/* Setback Lines */}
          <rect x="12" y="12" width="76" height="68" fill="none" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1 1" />

          {/* Central Core Elevators & Fire Staircases */}
          <g>
            <rect x="44" y="24" width="12" height="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.5" />
            <text x="50" y="29" textAnchor="middle" fill="#1e293b" fontSize="2" fontWeight="bold">CORE / LIFT</text>
          </g>

          {/* =================================================== */}
          {/* CASE 1: BASEMENT (B1) PARKING & EV LAYOUT          */}
          {/* =================================================== */}
          {isB1 && (
            <g>
              <rect x="15" y="15" width="70" height="68" fill="#f8fafc" stroke="#475569" strokeWidth="0.7" />

              {/* Parking Bay Lanes */}
              {/* Top Row: Standard Parking */}
              {[18, 26, 34, 58, 66, 74].map((px, idx) => (
                <g key={idx}>
                  <rect x={px} y="18" width="6" height="12" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.3" />
                  <text x={px + 3} y="25" textAnchor="middle" fill="#64748b" fontSize="1.8">P-{idx + 1}</text>
                </g>
              ))}

              {/* Bottom Row: EV Charging Stations */}
              {[18, 26, 34, 58, 66, 74].map((px, idx) => (
                <g key={idx}>
                  <rect x={px} y="68" width="6" height="12" fill="url(#evPattern)" stroke="#0d9488" strokeWidth="0.4" />
                  <text x={px + 3} y="74" textAnchor="middle" fill="#0f766e" fontSize="1.8" fontWeight="bold">⚡ EV</text>
                </g>
              ))}

              {/* Central Driveway */}
              <line x1="16" y1="48" x2="84" y2="48" stroke="#f59e0b" strokeWidth="0.6" strokeDasharray="2 1" />
              <text x="50" y="47" textAnchor="middle" fill="#b45309" fontSize="2.2" fontWeight="bold">6.0M TWO-WAY DRIVEWAY</text>

              {/* Vehicular Ramp */}
              <rect x="75" y="32" width="8" height="24" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.5" />
              <text x="79" y="45" textAnchor="middle" fill="#c2410c" fontSize="2" fontWeight="bold" transform="rotate(90 79 45)">RAMP 1:8 ↓</text>
            </g>
          )}

          {/* =================================================== */}
          {/* CASE 2: GROUND FLOOR (G) & COMMERCIAL PODIUM (L1-L2)*/}
          {/* =================================================== */}
          {(isG || isPodium) && (
            <g>
              {/* Outer Building Footprint */}
              <rect x="18" y="18" width="64" height="64" fill="#eff6ff" stroke="#2563eb" strokeWidth="0.8" rx="1" />

              {/* Central Open Courtyard Cutout */}
              <rect x="36" y="34" width="28" height="32" fill="#dcfce7" stroke="#16a34a" strokeWidth="0.8" rx="1" />
              <text x="50" y="50" textAnchor="middle" fill="#15803d" fontSize="2.6" fontWeight="bold">CENTRAL COURTYARD</text>
              <text x="50" y="54" textAnchor="middle" fill="#166534" fontSize="1.8">(Open-to-Sky Light Well)</text>

              {/* West Retail / Commercial Anchor */}
              <rect x="20" y="20" width="14" height="60" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
              <text x="27" y="52" textAnchor="middle" fill="#1e40af" fontSize="2.2" fontWeight="bold" transform="rotate(-90 27 52)">COMMERCIAL RETAIL ANCHOR</text>

              {/* East Retail Shops */}
              <rect x="66" y="20" width="14" height="28" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
              <text x="73" y="35" textAnchor="middle" fill="#1e40af" fontSize="2" fontWeight="bold">RETAIL B</text>

              <rect x="66" y="50" width="14" height="30" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
              <text x="73" y="66" textAnchor="middle" fill="#1e40af" fontSize="2" fontWeight="bold">CAFE & DINING</text>

              {/* Entrance Plaza */}
              {isG && (
                <g>
                  <polygon points="46,84 54,84 50,78" fill="#16a34a" />
                  <text x="50" y="82" textAnchor="middle" fill="#15803d" fontSize="2" fontWeight="bold">COMMERCIAL PLAZA INGRESS</text>
                </g>
              )}
            </g>
          )}

          {/* =================================================== */}
          {/* CASE 3: RESIDENTIAL FLOORS (L3 TO L8)              */}
          {/* =================================================== */}
          {isResidential && (
            <g>
              {/* Stepped Residential Tower Footprint */}
              <rect x="20" y="20" width="60" height="60" fill="#fff7ed" stroke="#ea580c" strokeWidth="0.8" rx="1" />

              {/* Central Courtyard Light Well */}
              <rect x="36" y="34" width="28" height="32" fill="#dcfce7" stroke="#16a34a" strokeWidth="0.8" rx="1" />
              <text x="50" y="50" textAnchor="middle" fill="#15803d" fontSize="2.6" fontWeight="bold">CENTRAL COURTYARD</text>

              {/* Unit A: 3BHK Corner Flat (Top-Left) */}
              <rect
                x="22" y="22" width="20" height="26"
                fill={selectedUnit === 'unit_a' ? '#fed7aa' : '#ffedd5'}
                stroke="#ea580c" strokeWidth={selectedUnit === 'unit_a' ? 0.8 : 0.4}
                className="cursor-pointer"
                onClick={() => setSelectedUnit('unit_a')}
              />
              <text x="32" y="36" textAnchor="middle" fill="#9a3412" fontSize="2.2" fontWeight="bold">UNIT A-401 (3BHK)</text>

              {/* Unit B: 2BHK Standard Flat (Top-Right) */}
              <rect
                x="58" y="22" width="20" height="26"
                fill={selectedUnit === 'unit_b' ? '#fed7aa' : '#ffedd5'}
                stroke="#ea580c" strokeWidth={selectedUnit === 'unit_b' ? 0.8 : 0.4}
                className="cursor-pointer"
                onClick={() => setSelectedUnit('unit_b')}
              />
              <text x="68" y="36" textAnchor="middle" fill="#9a3412" fontSize="2.2" fontWeight="bold">UNIT B-402 (2BHK)</text>

              {/* Unit C: 2BHK Courtyard Flat (Bottom-Left) */}
              <rect
                x="22" y="50" width="20" height="28"
                fill={selectedUnit === 'unit_c' ? '#fed7aa' : '#ffedd5'}
                stroke="#ea580c" strokeWidth={selectedUnit === 'unit_c' ? 0.8 : 0.4}
                className="cursor-pointer"
                onClick={() => setSelectedUnit('unit_c')}
              />
              <text x="32" y="65" textAnchor="middle" fill="#9a3412" fontSize="2.2" fontWeight="bold">UNIT C-403 (2BHK)</text>

              {/* Unit D: 3BHK Corner Flat (Bottom-Right) */}
              <rect
                x="58" y="50" width="20" height="28"
                fill={selectedUnit === 'unit_d' ? '#fed7aa' : '#ffedd5'}
                stroke="#ea580c" strokeWidth={selectedUnit === 'unit_d' ? 0.8 : 0.4}
                className="cursor-pointer"
                onClick={() => setSelectedUnit('unit_d')}
              />
              <text x="68" y="65" textAnchor="middle" fill="#9a3412" fontSize="2.2" fontWeight="bold">UNIT D-404 (3BHK)</text>

              {/* Balconies */}
              <rect x="24" y="74" width="12" height="3" fill="#e0f2fe" stroke="#0284c7" strokeWidth="0.3" />
              <rect x="64" y="74" width="12" height="3" fill="#e0f2fe" stroke="#0284c7" strokeWidth="0.3" />
            </g>
          )}

          {/* =================================================== */}
          {/* CASE 4: SKY AMENITY ROOFTOP (L9)                   */}
          {/* =================================================== */}
          {isAmenity && (
            <g>
              <rect x="22" y="22" width="56" height="54" fill="#f0fdf4" stroke="#16a34a" strokeWidth="0.8" rx="1" />

              {/* Swimming Pool */}
              <rect x="26" y="26" width="22" height="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.6" rx="1" />
              <text x="37" y="34" textAnchor="middle" fill="#0369a1" fontSize="2.4" fontWeight="bold">SKY POOL (14m × 8m)</text>

              {/* Fitness Gym Pavilion */}
              <rect x="52" y="26" width="22" height="18" fill="#bbf7d0" stroke="#15803d" strokeWidth="0.6" rx="1" />
              <text x="63" y="36" textAnchor="middle" fill="#14532d" fontSize="2.2" fontWeight="bold">FITNESS & CLUB</text>

              {/* Landscaped Roof Terrace */}
              <rect x="26" y="46" width="48" height="26" fill="#dcfce7" stroke="#16a34a" strokeWidth="0.6" rx="1" />
              <text x="50" y="60" textAnchor="middle" fill="#166534" fontSize="2.6" fontWeight="bold">LANDSCAPED GREEN DECK & PERGOLA</text>
            </g>
          )}

          {/* North Indicator */}
          <g transform="translate(10, 10)">
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.4" />
            <polygon points="0,-3 1.5,2 0,1 -1.5,2" fill="#ef4444" />
            <text x="0" y="-4" textAnchor="middle" fill="#ef4444" fontSize="2.5" fontWeight="bold">N</text>
          </g>
        </svg>
      </main>

      {/* 3. Right: Detailed Apartment Unit Inspector (Active on Residential Levels) */}
      <aside className="w-full lg:w-80 bg-white border-l border-slate-200 p-4 flex flex-col justify-between overflow-y-auto shrink-0 shadow-xs z-10 text-xs">
        {isResidential ? (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2.5">
              <div className="text-xs font-bold text-orange-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Home className="w-4 h-4" />
                <span>{t.unitInspectorTitle}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Click any apartment in the 2D layout to inspect detailed room breakdowns.
              </p>
            </div>

            {/* Selected Unit Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {selectedUnit === 'unit_a' && 'Unit A-401 (3BHK Corner)'}
                  {selectedUnit === 'unit_b' && 'Unit B-402 (2BHK Standard)'}
                  {selectedUnit === 'unit_c' && 'Unit C-403 (2BHK Courtyard)'}
                  {selectedUnit === 'unit_d' && 'Unit D-404 (3BHK Corner)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                  {selectedUnit.includes('a') || selectedUnit.includes('d') ? '3 BHK' : '2 BHK'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-sans">{t.carpetArea}</div>
                  <div className="text-orange-700 font-bold">
                    {selectedUnit.includes('a') || selectedUnit.includes('d') ? '115 m²' : '85 m²'}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-sans">{t.orientation}</div>
                  <div className="text-slate-800 font-bold">
                    {selectedUnit.includes('a') ? 'North-West' : selectedUnit.includes('b') ? 'North-East' : selectedUnit.includes('c') ? 'South-West' : 'South-East'}
                  </div>
                </div>
              </div>

              {/* Room Breakdown Table */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs text-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Schedules</div>
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-100">
                  <span className="flex items-center gap-1.5"><Sun className="w-3 h-3 text-amber-500" /> {t.roomLiving}</span>
                  <span className="font-mono font-semibold">24.5 m²</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-100">
                  <span className="flex items-center gap-1.5"><Bed className="w-3 h-3 text-indigo-500" /> {t.roomMaster}</span>
                  <span className="font-mono font-semibold">16.0 m²</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-100">
                  <span className="flex items-center gap-1.5"><Bed className="w-3 h-3 text-indigo-500" /> {t.roomBed2}</span>
                  <span className="font-mono font-semibold">13.5 m²</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-100">
                  <span className="flex items-center gap-1.5"><Utensils className="w-3 h-3 text-emerald-600" /> {t.roomKitchen}</span>
                  <span className="font-mono font-semibold">10.0 m²</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-100">
                  <span className="flex items-center gap-1.5"><Bath className="w-3 h-3 text-cyan-600" /> {t.roomToilet}</span>
                  <span className="font-mono font-semibold">5.5 m²</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-100 text-sky-700">
                  <span>{t.roomBalcony}</span>
                  <span className="font-mono font-semibold">8.0 m²</span>
                </div>
              </div>
            </div>
          </div>
        ) : isB1 ? (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2.5">
              <div className="text-xs font-bold text-teal-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Car className="w-4 h-4" />
                <span>Basement B1 Parking Analysis</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Subterranean parking layout with integrated rapid EV charging network.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-sans">Total Parking Capacity:</span>
                <strong className="text-slate-900">118 Spaces</strong>
              </div>
              <div className="flex items-center justify-between text-teal-800">
                <span className="font-sans flex items-center gap-1"><Zap className="w-3 h-3" /> Dedicated EV Bays:</span>
                <strong>24 Bays (20%)</strong>
              </div>
              <div className="flex items-center justify-between text-blue-800">
                <span className="font-sans">Accessible Parking:</span>
                <strong>6 Bays (5%)</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-sans">Circulation Ramp Slope:</span>
                <strong>1:8 Gradient</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2.5">
              <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5 uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>Level {activeFloorCode} Program Schedule</span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Floor Plate:</span>
                <strong className="text-slate-900 font-mono">2,480 m²</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Courtyard Cutout:</span>
                <strong className="text-emerald-700 font-mono">320 m²</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Usable Area:</span>
                <strong className="text-slate-900 font-mono">2,160 m²</strong>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-orange-900">
          Tip: Courtyard opening guarantees cross-ventilation across internal units.
        </div>
      </aside>
    </div>
  );
}
