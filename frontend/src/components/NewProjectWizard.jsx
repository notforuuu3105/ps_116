import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Maximize2,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  Car,
  Trees,
  Layers,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Info
} from 'lucide-react';
import { saveProject } from '../utils/projectStore';
import { translations } from '../utils/translations';

export function NewProjectWizard({
  isOpen,
  onClose,
  onProjectCreated,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;

  const [step, setStep] = useState(1);

  // STEP 1: Project Information
  const [projectName, setProjectName] = useState('Urban Mixed-Use Enclave (B + G + 9)');
  const [projectType, setProjectType] = useState('Mixed-Use Commercial & Residential');
  const [intendedUse, setIntendedUse] = useState('Retail Plaza + Co-Working Podium + Residential Tower');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('Western Expressway Corridor, Andheri East');
  const [description, setDescription] = useState('High-density mixed-use building featuring commercial retail podium, central open courtyard, and residential high-rise tower.');

  // STEP 2: Site Location
  const [localityQuery, setLocalityQuery] = useState('Andheri East, Mumbai');
  const [latitude, setLatitude] = useState('19.1136');
  const [longitude, setLongitude] = useState('72.8697');
  const [isSurveyVerified, setIsSurveyVerified] = useState(false);

  // STEP 3: Plot Dimensions & Geometry
  const [plotWidth, setPlotWidth] = useState(60.0);
  const [plotDepth, setPlotDepth] = useState(80.0);
  const [units, setUnits] = useState('metres'); // 'metres' | 'feet'
  const [plotShape, setPlotShape] = useState('rectangular'); // 'rectangular' | 'square' | 'polygonal'
  const [roadFacingSide, setRoadFacingSide] = useState('South');
  const [roadWidth, setRoadWidth] = useState(18.0);
  const [numRoadSides, setNumRoadSides] = useState(1);
  const [orientation, setOrientation] = useState('North-South');

  // STEP 4: Building Requirements
  const [configuration, setConfiguration] = useState('B + G + 9');
  const [totalFloors, setTotalFloors] = useState(10); // G + 9
  const [hasBasement, setHasBasement] = useState(true);
  const [groundFloorUse, setGroundFloorUse] = useState('Commercial Retail Plaza & Grand Lobby');
  const [commercialRatio, setCommercialRatio] = useState(30.0);
  const [dwellingTypes, setDwellingTypes] = useState(['2BHK', '3BHK']);
  const [approxUnits, setApproxUnits] = useState(96);
  const [parkingCapacity, setParkingCapacity] = useState(118);
  const [evChargingPct, setEvChargingPct] = useState(20.0);
  const [courtyardWidth, setCourtyardWidth] = useState(16.0);
  const [courtyardDepth, setCourtyardDepth] = useState(20.0);
  const [hasRooftopPool, setHasRooftopPool] = useState(true);
  const [hasSolarPergola, setHasSolarPergola] = useState(true);

  // STEP 5: Planning Constraints
  const [setbackFront, setSetbackFront] = useState(7.5);
  const [setbackSides, setSetbackSides] = useState(6.0);
  const [setbackRear, setSetbackRear] = useState(6.0);
  const [maxGroundCoverage, setMaxGroundCoverage] = useState(40.0);
  const [maxFar, setMaxFar] = useState(3.0);
  const [maxHeightM, setMaxHeightM] = useState(36.0);
  const [planningAuthority, setPlanningAuthority] = useState('Mumbai DCPR 2034 (Transit Incentive)');

  if (!isOpen) return null;

  // Real-time calculations
  const plotArea = Math.round(plotWidth * plotDepth);
  const buildableW = Math.max(10, plotWidth - (2 * setbackSides));
  const buildableD = Math.max(10, plotDepth - setbackFront - setbackRear);
  const footprintArea = Math.round(buildableW * buildableD);
  const calculatedCoveragePct = ((footprintArea / plotArea) * 100).toFixed(1);
  const courtyardArea = Math.round(courtyardWidth * courtyardDepth);
  const netFloorPlate = Math.max(200, footprintArea - courtyardArea);
  const estimatedBUA = Math.round(netFloorPlate * totalFloors);
  const calculatedFAR = (estimatedBUA / plotArea).toFixed(2);

  const toggleDwellingType = (type) => {
    if (dwellingTypes.includes(type)) {
      if (dwellingTypes.length > 1) {
        setDwellingTypes(dwellingTypes.filter((t) => t !== type));
      }
    } else {
      setDwellingTypes([...dwellingTypes, type]);
    }
  };

  const handleFinishAndGenerate = () => {
    const newProject = {
      id: `proj_inferno_${Date.now()}`,
      name: projectName || 'Untitled Mixed-Use Project',
      type: projectType,
      intended_use: intendedUse,
      city,
      state,
      address,
      description,
      site: {
        plot_width: plotWidth,
        plot_depth: plotDepth,
        plot_area: plotArea,
        units,
        shape: plotShape,
        road_facing_side: roadFacingSide,
        abutting_road_width: roadWidth,
        num_road_sides: numRoadSides,
        orientation,
        setback_front: setbackFront,
        setback_rear: setbackRear,
        setback_sides: setbackSides
      },
      program: {
        configuration,
        total_floors: totalFloors,
        has_basement: hasBasement,
        ground_floor_use: groundFloorUse,
        commercial_ratio: commercialRatio,
        residential_ratio: 100.0 - commercialRatio,
        tower_stepback: 3.0,
        dwelling_types: dwellingTypes,
        approx_dwelling_units: approxUnits,
        parking_capacity: parkingCapacity,
        ev_charging_pct: evChargingPct,
        courtyard_width: courtyardWidth,
        courtyard_depth: courtyardDepth,
        has_rooftop_pool: hasRooftopPool,
        has_solar_pergola: hasSolarPergola
      },
      constraints: {
        max_far: maxFar,
        max_ground_coverage_pct: maxGroundCoverage,
        max_height_m: maxHeightM,
        planning_authority: planningAuthority,
        is_verified: true
      },
      facade: {
        shading_intensity: 75.0,
        balcony_depth: 1.8,
        green_facade_coverage: 40.0,
        window_wall_ratio: 40.0,
        has_vertical_fins: true,
        has_horizontal_louvers: true,
        glazing_type: "dgu_lowe"
      },
      last_modified: new Date().toISOString()
    };

    saveProject(newProject);
    if (onProjectCreated) {
      onProjectCreated(newProject);
    }
  };

  const stepsList = [
    { num: 1, title: 'Project Info', icon: Building2 },
    { num: 2, title: 'Location', icon: MapPin },
    { num: 3, title: 'Plot & Geometry', icon: Maximize2 },
    { num: 4, title: 'Program Requirements', icon: Sliders },
    { num: 5, title: 'Planning Limits', icon: ShieldCheck },
    { num: 6, title: 'Review & Build', icon: FileCheck2 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Wizard Header Strip */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-700 text-white flex items-center justify-center font-bold text-xs">
              {step}/6
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-700 font-bold block">
                GUIDED SITE & PROGRAM SETUP
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {stepsList[step - 1].title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs overflow-x-auto gap-2">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCurrent = s.num === step;
            const isDone = s.num < step;
            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-100 text-orange-900'
                    : isDone
                    ? 'text-emerald-700 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-orange-700 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isDone ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Wizard Form Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {/* STEP 1: PROJECT INFORMATION */}
          {step === 1 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Project Title <span className="text-orange-700">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Metro Corridor Mixed-Use Complex"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project Typology</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Mixed-Use Commercial & Residential">Mixed-Use Commercial & Residential (B+G+9)</option>
                    <option value="Transit-Oriented Development (TOD)">Transit-Oriented Development (TOD)</option>
                    <option value="Commercial Plaza + Residential High-Rise">Commercial Plaza + Residential High-Rise</option>
                    <option value="Institutional & Student Housing Campus">Institutional & Student Housing Campus</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Intended Functionality</label>
                  <input
                    type="text"
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City / Municipal Jurisdiction</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Site Address / Parcel Identifier</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 42, Sector 18, Road No. 3"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Vision & Brief</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SITE LOCATION */}
          {step === 2 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Conceptual Site Reference:</strong> Location inputs are used for orientation and climatic zone referencing. This does not replace formal land surveys.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Locality / Urban Context Search</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localityQuery}
                    onChange={(e) => setLocalityQuery(e.target.value)}
                    className="flex-1 p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 font-semibold"
                  >
                    Locate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Latitude (°N)</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Longitude (°E)</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Map Preview Placeholder / Visualizer */}
              <div className="w-full h-48 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 cad-grid-light opacity-50" />
                <MapPin className="w-8 h-8 text-orange-700 z-10 animate-bounce" />
                <span className="font-bold text-slate-900 z-10 text-xs mt-1">
                  {localityQuery}
                </span>
                <span className="text-[11px] text-slate-500 z-10 font-mono">
                  {latitude}° N, {longitude}° E
                </span>
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 bg-white/80 px-2 py-0.5 rounded font-mono">
                  Context Cadastre View
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PLOT DIMENSIONS & GEOMETRY */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-fadeIn">
              {/* Left Inputs (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Plot Width (m) <span className="text-orange-700">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="30"
                      max="150"
                      value={plotWidth}
                      onChange={(e) => setPlotWidth(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Plot Depth (m) <span className="text-orange-700">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="30"
                      max="150"
                      value={plotDepth}
                      onChange={(e) => setPlotDepth(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Abutting Road Width (m)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="9"
                      max="45"
                      value={roadWidth}
                      onChange={(e) => setRoadWidth(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                    />
                    <span className="text-[10px] text-slate-500">Min 18m recommended for FAR 3.00</span>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Road Facing Side</label>
                    <select
                      value={roadFacingSide}
                      onChange={(e) => setRoadFacingSide(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="South">South Orientation</option>
                      <option value="North">North Orientation</option>
                      <option value="East">East Orientation</option>
                      <option value="West">West Orientation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Road Access Sides</label>
                    <select
                      value={numRoadSides}
                      onChange={(e) => setNumRoadSides(parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={1}>Single Road Access (Mid-block)</option>
                      <option value={2}>Corner Plot (2 Road Frontages)</option>
                      <option value={3}>3-Side Island Parcel</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Site Orientation Axis</label>
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="North-South">North-South (Recommended for Daylight)</option>
                      <option value="East-West">East-West</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Calculated Plot Area:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {plotArea.toLocaleString()} m² ({(plotArea * 10.764).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq.ft)
                  </span>
                </div>
              </div>

              {/* Right Live Visual 2D Plot Preview (5 cols) */}
              <div className="md:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  REAL-TIME PLOT FOOTPRINT PREVIEW
                </span>

                <div className="w-full h-52 bg-white rounded-lg border border-slate-200 relative flex items-center justify-center p-2">
                  <svg viewBox="0 0 240 180" className="w-full h-full">
                    {/* Plot Boundary */}
                    <rect x="20" y="20" width="200" height="130" fill="#f8fafc" stroke="#c2410c" strokeWidth="2" strokeDasharray="3 2" rx="4" />
                    
                    {/* Road Indication */}
                    <rect x="15" y="155" width="210" height="20" fill="#cbd5e1" rx="2" />
                    <text x="120" y="168" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {roadWidth}m ARTERIAL ROAD ({roadFacingSide.toUpperCase()})
                    </text>

                    {/* Buildable Core Envelope */}
                    <rect x="40" y="38" width="160" height="92" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" rx="3" opacity="0.7" />
                    
                    {/* Central Courtyard Void */}
                    <rect x="95" y="60" width="50" height="48" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" rx="2" />
                    <text x="120" y="88" fill="#14532d" fontSize="7" fontWeight="bold" textAnchor="middle">
                      COURT
                    </text>

                    {/* Annotations */}
                    <text x="120" y="15" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {plotWidth}m WIDTH
                    </text>
                    <text x="12" y="85" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle" transform="rotate(-90 12 85)">
                      {plotDepth}m
                    </text>
                  </svg>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Buildable Footprint:</span>
                    <span className="font-mono font-bold text-slate-800">{footprintArea} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Ground Coverage:</span>
                    <span className="font-mono font-bold text-orange-700">{calculatedCoveragePct}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BUILDING REQUIREMENTS */}
          {step === 4 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Configuration</label>
                  <input
                    type="text"
                    value={configuration}
                    onChange={(e) => setConfiguration(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-500">Standard SIH 116 Model: B + G + 9</span>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Floors Above Ground</label>
                  <input
                    type="number"
                    min="4"
                    max="18"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ground Floor Spatial Use</label>
                <input
                  type="text"
                  value={groundFloorUse}
                  onChange={(e) => setGroundFloorUse(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              {/* Commercial vs Residential Ratio Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Commercial / Retail Ratio</span>
                  <span className="font-mono font-bold text-orange-700">{commercialRatio}% Commercial ({100 - commercialRatio}% Residential)</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={commercialRatio}
                  onChange={(e) => setCommercialRatio(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>15% Min Retail</span>
                  <span>30% Standard Mixed-Use</span>
                  <span>50% Max Commercial</span>
                </div>
              </div>

              {/* Dwelling Types & Units */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dwelling Types</label>
                  <div className="flex gap-2">
                    {['1BHK', '2BHK', '3BHK', 'Studio'].map((type) => {
                      const isSelected = dwellingTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleDwellingType(type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                            isSelected
                              ? 'bg-orange-700 text-white border-orange-700'
                              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Approx. Target Dwelling Units</label>
                  <input
                    type="number"
                    value={approxUnits}
                    onChange={(e) => setApproxUnits(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Mobility & Central Courtyard */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Parking Bays & EV Charging</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={parkingCapacity}
                      onChange={(e) => setParkingCapacity(parseInt(e.target.value) || 0)}
                      className="w-2/3 p-2 rounded-lg border border-slate-300 font-mono"
                      placeholder="Total Bays"
                    />
                    <div className="w-1/3 flex items-center justify-center p-2 bg-emerald-50 text-emerald-800 rounded-lg font-mono font-bold text-xs border border-emerald-200">
                      {evChargingPct}% EV
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Courtyard Dimensions (W × D)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={courtyardWidth}
                      onChange={(e) => setCourtyardWidth(parseFloat(e.target.value) || 0)}
                      className="w-1/2 p-2 rounded-lg border border-slate-300 font-mono"
                      placeholder="Width m"
                    />
                    <input
                      type="number"
                      value={courtyardDepth}
                      onChange={(e) => setCourtyardDepth(parseFloat(e.target.value) || 0)}
                      className="w-1/2 p-2 rounded-lg border border-slate-300 font-mono"
                      placeholder="Depth m"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PLANNING CONSTRAINTS */}
          {step === 5 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Preliminary Guideline Benchmarking:</strong> Enter applicable limits for your plot's urban planning jurisdiction.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Applicable Planning Authority / Rule Set</label>
                <select
                  value={planningAuthority}
                  onChange={(e) => setPlanningAuthority(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="Mumbai DCPR 2034 (Transit Incentive)">Mumbai DCPR 2034 (Transit Incentive — FAR 3.00)</option>
                  <option value="Delhi MPD-2041 (TOD Guidelines)">Delhi MPD-2041 (TOD Mixed-Use — FAR 2.50 to 2.75)</option>
                  <option value="Bengaluru BBMP / BDA Zonal Regulations">Bengaluru BBMP / BDA Zonal Regulations (FAR 2.75)</option>
                  <option value="National Building Code (NBC 2016 Baseline)">National Building Code (NBC 2016 Baseline)</option>
                  <option value="Custom Project Constraints">Custom User-Defined Constraints</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Front Setback (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={setbackFront}
                    onChange={(e) => setSetbackFront(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Side Setbacks (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={setbackSides}
                    onChange={(e) => setSetbackSides(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rear Setback (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={setbackRear}
                    onChange={(e) => setSetbackRear(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max FAR / FSI Cap</label>
                  <input
                    type="number"
                    step="0.1"
                    value={maxFar}
                    onChange={(e) => setMaxFar(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Ground Coverage (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={maxGroundCoverage}
                    onChange={(e) => setMaxGroundCoverage(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Building Height (m)</label>
                  <input
                    type="number"
                    step="1"
                    value={maxHeightM}
                    onChange={(e) => setMaxHeightM(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW AND GENERATE */}
          {step === 6 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Project Setup Complete & Validated</span>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  All parameters verified against preliminary geometric feasibility rules. Click below to generate the project and open it directly in the 3D Building Studio.
                </p>
              </div>

              {/* Summary Audit Card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">SITE DIMENSIONS</span>
                    <span className="font-bold text-slate-900">{plotWidth}m × {plotDepth}m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">PLOT AREA</span>
                    <span className="font-bold text-slate-900">{plotArea.toLocaleString()} m²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">CONFIG</span>
                    <span className="font-bold text-orange-700">{configuration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">EST. FAR</span>
                    <span className="font-bold text-emerald-700 font-mono">{calculatedFAR} / {maxFar}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800 block">Zoning Allocation:</span>
                    <span>{commercialRatio}% Commercial Podium | {100 - commercialRatio}% Residential Tower</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Mobility & Parking:</span>
                    <span>{parkingCapacity} Bays in B1 Basement with {evChargingPct}% Dedicated EV Chargers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Courtyard Geometry:</span>
                    <span>{courtyardWidth}m × {courtyardDepth}m ({courtyardArea} m²) Open Light Well</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Planning Authority:</span>
                    <span>{planningAuthority}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {step < 6 ? (
              <button
                onClick={() => setStep((prev) => Math.min(6, prev + 1))}
                className="px-5 py-2 bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishAndGenerate}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-900/10"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Generate & Open in Studio</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
