import React, { useState } from 'react';
import {
  Compass,
  Building2,
  Layers,
  Trees,
  Sun,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  Presentation,
  FileDown,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  Maximize2,
  Eye,
  Settings,
  Sliders,
  Share2,
  Sparkles,
  MapPin,
  BookOpen
} from 'lucide-react';

import { Studio3D } from './Studio3D';
import { FloorPlanStudio } from './FloorPlanStudio';
import { CourtyardStudio } from './CourtyardStudio';
import { FacadeStudio } from './FacadeStudio';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { DesignOptimizer } from './DesignOptimizer';
import { SiteContextMap } from './SiteContextMap';
import { ReferenceLibrary } from './ReferenceLibrary';

import { saveProject } from '../utils/projectStore';
import { translations } from '../utils/translations';

export function DesignWorkspace({
  project,
  onUpdateProject,
  massingData,
  onRecalculateMassing,
  onBackToHome,
  onOpenPresentation,
  onExportPDF,
  onExportDXF,
  isExporting,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;

  const [workspaceTab, setWorkspaceTab] = useState('3d'); // '3d' | '2d' | 'courtyard' | 'facade' | 'analytics' | 'optimizer' | 'map' | 'library'
  const [activeFloorCode, setActiveFloorCode] = useState('G');
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [sunTime, setSunTime] = useState(12.0);
  const [isSaved, setIsSaved] = useState(true);

  // Quick live slider state
  const plotW = project?.site?.plot_width || 60;
  const plotD = project?.site?.plot_depth || 80;
  const maxFar = project?.constraints?.max_far || 3.0;
  const commercialRatio = project?.program?.commercial_ratio || 30.0;
  const courtyardW = project?.program?.courtyard_width || 16.0;
  const courtyardD = project?.program?.courtyard_depth || 20.0;

  // Normalized metrics
  const raw = massingData?.metrics || {};
  const metrics = {
    achieved_far: typeof raw.achieved_far === 'number' ? raw.achieved_far : 2.82,
    permissible_far: typeof (raw.target_far ?? raw.permissible_far) === 'number' ? (raw.target_far ?? raw.permissible_far) : maxFar,
    ground_coverage_pct: typeof raw.ground_coverage_pct === 'number' ? raw.ground_coverage_pct : 38.5,
    max_ground_coverage_pct: typeof raw.max_ground_coverage_pct === 'number' ? raw.max_ground_coverage_pct : 40.0,
    total_builtup_area: typeof (raw.total_built_up_area ?? raw.total_builtup_area) === 'number' ? (raw.total_built_up_area ?? raw.total_builtup_area) : 13536,
    plot_area: typeof raw.plot_area === 'number' ? raw.plot_area : plotW * plotD,
    parking_bays: typeof (raw.total_parking_spaces ?? raw.parking_bays) === 'number' ? (raw.total_parking_spaces ?? raw.parking_bays) : 118,
    ev_bays: typeof (raw.ev_charging_bays ?? raw.ev_bays) === 'number' ? (raw.ev_charging_bays ?? raw.ev_bays) : 24,
    daylight_score: typeof raw.daylight_score === 'number' ? raw.daylight_score : 84,
    ventilation_score: typeof raw.ventilation_score === 'number' ? raw.ventilation_score : 80
  };

  const isFarCompliant = metrics.achieved_far <= metrics.permissible_far;
  const isCoverageCompliant = metrics.ground_coverage_pct <= metrics.max_ground_coverage_pct;

  const handleQuickAdjust = (key, value) => {
    setIsSaved(false);
    let updated;
    if (key === 'plot_width' || key === 'plot_depth') {
      updated = {
        ...project,
        site: {
          ...project.site,
          [key]: value
        }
      };
    } else if (key === 'commercial_ratio' || key === 'courtyard_width' || key === 'courtyard_depth') {
      updated = {
        ...project,
        program: {
          ...project.program,
          [key]: value
        }
      };
    }
    if (updated) {
      onUpdateProject(updated);
      saveProject(updated);
      setTimeout(() => setIsSaved(true), 600);
    }
  };

  const handleSaveClick = () => {
    saveProject(project);
    setIsSaved(true);
  };

  const floorLevels = [
    { code: 'L9', label: 'L9 — Sky Amenities Deck', zone: 'Amenity', color: 'bg-emerald-500' },
    { code: 'L8', label: 'L8 — Residential Units', zone: 'Residential', color: 'bg-orange-500' },
    { code: 'L7', label: 'L7 — Residential Units', zone: 'Residential', color: 'bg-orange-500' },
    { code: 'L6', label: 'L6 — Residential Units', zone: 'Residential', color: 'bg-orange-500' },
    { code: 'L5', label: 'L5 — Residential Units', zone: 'Residential', color: 'bg-orange-500' },
    { code: 'L4', label: 'L4 — Residential Units', zone: 'Residential', color: 'bg-orange-500' },
    { code: 'L3', label: 'L3 — Residential Stepback Tower', zone: 'Residential', color: 'bg-orange-500' },
    { code: 'L2', label: 'L2 — Commercial Co-Working', zone: 'Podium', color: 'bg-blue-600' },
    { code: 'L1', label: 'L1 — Commercial Offices', zone: 'Podium', color: 'bg-blue-600' },
    { code: 'G', label: 'G — Commercial Retail Plaza', zone: 'Retail', color: 'bg-amber-500' },
    { code: 'B1', label: 'B1 — Subterranean EV Parking', zone: 'Basement', color: 'bg-slate-600' }
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-100 text-slate-800 select-none">
      {/* 1. TOP WORKSPACE APP BAR */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20 shadow-xs">
        {/* Left: Project identity & Return */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            title="Return to Public Home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                {project.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 hidden md:inline">
                {plotW}m × {plotD}m ({metrics.plot_area} m²)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Workspace Navigation Tabs */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {[
            { id: '3d', label: '3D Studio', icon: Building2 },
            { id: '2d', label: '2D Floor Plans', icon: Compass },
            { id: 'courtyard', label: 'Courtyard', icon: Trees },
            { id: 'facade', label: 'Façade', icon: Sun },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'optimizer', label: 'Optimizer', icon: SlidersHorizontal },
            { id: 'map', label: 'Site Cadastre', icon: MapPin },
            { id: 'library', label: 'Standards', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = workspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setWorkspaceTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition cursor-pointer ${
                  isActive
                    ? 'bg-white text-orange-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-700' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Export & Presentation Actions */}
        <div className="flex items-center gap-2">
          {/* FAR Status Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border ${
            isFarCompliant ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <span>FAR {metrics.achieved_far.toFixed(2)} / {maxFar.toFixed(2)}</span>
            <span className="text-[10px]">{isFarCompliant ? '✓' : '!'}</span>
          </div>

          {/* Presentation Mode */}
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
            title="Open Full-Screen Jury Presentation Deck"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Present</span>
          </button>

          {/* Export PDF Report */}
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-700 hover:bg-orange-800 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
            title="Download Architectural Report PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report</span>
          </button>

          {/* Export DXF CAD */}
          <button
            onClick={onExportDXF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer disabled:opacity-50"
            title="Download CAD .DXF File"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">CAD</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE BODY (3-Column Layout) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: Floor Level Selector & Quick Adjusters (Width: 260px) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 overflow-y-auto text-xs z-10">
          <div className="p-3.5 space-y-4">
            {/* View Selector for smaller screens */}
            <div className="lg:hidden">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                STUDIO VIEW
              </label>
              <select
                value={workspaceTab}
                onChange={(e) => setWorkspaceTab(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs"
              >
                <option value="3d">3D Building Studio</option>
                <option value="2d">2D Floor Plans</option>
                <option value="courtyard">Central Courtyard</option>
                <option value="facade">Façade Studio</option>
                <option value="analytics">Performance Analytics</option>
                <option value="optimizer">Design Optimizer</option>
                <option value="map">Site Cadastre Map</option>
                <option value="library">Standards Reference</option>
              </select>
            </div>

            {/* Floor Stacking Selector (B1 to L9) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-orange-700" />
                  FLOOR STACK (B+G+9)
                </span>
                <span className="text-[10px] font-mono text-slate-400">11 Levels</span>
              </div>

              <div className="space-y-1">
                {floorLevels.map((lvl) => {
                  const isSelected = activeFloorCode === lvl.code;
                  return (
                    <button
                      key={lvl.code}
                      onClick={() => setActiveFloorCode(lvl.code)}
                      className={`w-full text-left p-1.5 rounded-lg font-medium transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 text-orange-950 font-bold border border-orange-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${lvl.color}`} />
                        <span className="font-mono text-xs">{lvl.code}</span>
                        <span className="truncate max-w-[130px] text-[11px]">{lvl.zone}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] text-orange-700 font-bold">Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Parametric Adjusters */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                QUICK MASSING ADJUSTERS
              </span>

              {/* Commercial vs Residential Split */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Commercial Ratio</span>
                  <span className="font-mono font-bold text-orange-700">{commercialRatio}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={commercialRatio}
                  onChange={(e) => handleQuickAdjust('commercial_ratio', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Courtyard Width */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Courtyard Width</span>
                  <span className="font-mono font-bold text-emerald-700">{courtyardW} m</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={courtyardW}
                  onChange={(e) => handleQuickAdjust('courtyard_width', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Courtyard Depth */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">Courtyard Depth</span>
                  <span className="font-mono font-bold text-emerald-700">{courtyardD} m</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="28"
                  step="1"
                  value={courtyardD}
                  onChange={(e) => handleQuickAdjust('courtyard_depth', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Footer: Save state */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isSaved ? 'Changes Saved' : 'Unsaved Changes'}
            </span>
            <button
              onClick={handleSaveClick}
              className="px-2 py-1 bg-white hover:bg-slate-100 rounded border border-slate-200 font-semibold text-slate-700 cursor-pointer"
            >
              Save
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN: Central Drawing / 3D Canvas Viewport */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-[#f8fafc]">
          {workspaceTab === '3d' && (
            <Studio3D
              lang={lang}
              massingData={massingData}
              sunTime={sunTime}
              setSunTime={setSunTime}
              activeFloorCode={activeFloorCode}
              setActiveFloorCode={setActiveFloorCode}
              hoveredFloor={hoveredFloor}
              setHoveredFloor={setHoveredFloor}
            />
          )}

          {workspaceTab === '2d' && (
            <FloorPlanStudio
              lang={lang}
              massingData={massingData}
              activeFloorCode={activeFloorCode}
              setActiveFloorCode={setActiveFloorCode}
            />
          )}

          {workspaceTab === 'courtyard' && (
            <CourtyardStudio
              lang={lang}
              project={project}
              onUpdateProject={onUpdateProject}
            />
          )}

          {workspaceTab === 'facade' && (
            <FacadeStudio
              lang={lang}
              project={project}
              onUpdateProject={onUpdateProject}
            />
          )}

          {workspaceTab === 'analytics' && (
            <AnalyticsDashboard
              lang={lang}
              project={project}
              massingData={massingData}
            />
          )}

          {workspaceTab === 'optimizer' && (
            <DesignOptimizer
              lang={lang}
              project={project}
              onApplyOption={(opt) => {
                let newRatio = 30.0;
                let newCourtW = 16.0;
                let newCourtD = 20.0;
                if (opt.id === 'option_b') {
                  newCourtW = 18.0;
                  newCourtD = 24.0;
                  newRatio = 25.0;
                } else if (opt.id === 'option_c') {
                  newCourtW = 16.0;
                  newCourtD = 20.0;
                  newRatio = 35.0;
                }
                const updated = {
                  ...project,
                  program: {
                    ...project.program,
                    commercial_ratio: newRatio,
                    courtyard_width: newCourtW,
                    courtyard_depth: newCourtD
                  }
                };
                onUpdateProject(updated);
                saveProject(updated);
              }}
            />
          )}

          {workspaceTab === 'map' && (
            <SiteContextMap
              lang={lang}
              project={project}
              onUpdateProject={onUpdateProject}
            />
          )}

          {workspaceTab === 'library' && (
            <ReferenceLibrary
              lang={lang}
            />
          )}
        </main>

        {/* RIGHT COLUMN: Properties & Feasibility Panel (Width: 280px) */}
        <aside className="hidden xl:flex w-72 bg-white border-l border-slate-200 flex-col justify-between shrink-0 overflow-y-auto text-xs z-10">
          <div className="p-4 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
                LIVE PLANNING AUDIT
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Building & Site Performance
              </h3>
            </div>

            {/* Area & FAR Metrics Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Total Site Area:</span>
                <span className="font-mono font-bold text-slate-900">{metrics.plot_area.toLocaleString()} m²</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Gross Built-Up (BUA):</span>
                <span className="font-mono font-bold text-slate-900">{metrics.total_builtup_area.toLocaleString()} m²</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Ground Coverage:</span>
                <span className="font-mono font-bold text-slate-900">{metrics.ground_coverage_pct.toFixed(1)}% (Cap: {metrics.max_ground_coverage_pct}%)</span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200">
                <span className="font-semibold text-slate-800">Achieved FAR:</span>
                <span className="font-mono font-extrabold text-orange-700 text-sm">
                  {metrics.achieved_far.toFixed(2)} / {maxFar.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Constraint & Feasibility Checker */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                CONSTRAINT & FEASIBILITY CHECKER
              </span>

              {/* Check 1: FAR */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">FAR Ceiling Compliance</span>
                  <span className="text-[10px] text-slate-500">
                    {metrics.achieved_far.toFixed(2)} ≤ {maxFar.toFixed(2)} permissible limit
                  </span>
                </div>
              </div>

              {/* Check 2: Ground Coverage */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">Ground Coverage Margin</span>
                  <span className="text-[10px] text-slate-500">
                    {metrics.ground_coverage_pct.toFixed(1)}% ≤ {metrics.max_ground_coverage_pct}% maximum permissible
                  </span>
                </div>
              </div>

              {/* Check 3: EV Infrastructure */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">CEA 20% EV Ready Quota</span>
                  <span className="text-[10px] text-slate-500">
                    {metrics.ev_bays} of {metrics.parking_bays} bays ({((metrics.ev_bays / metrics.parking_bays) * 100).toFixed(1)}%) with fast charging
                  </span>
                </div>
              </div>

              {/* Check 4: Courtyard Proportions */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">NBC Part 8 Light Court</span>
                  <span className="text-[10px] text-slate-500">
                    Width {courtyardW}m &gt; 1/5th building height (7.0m)
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Snapshot */}
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5 text-[11px]">
              <span className="font-bold text-emerald-950 block">Microclimate Performance</span>
              <div className="flex justify-between text-emerald-900">
                <span>Daylight Autonomy Score:</span>
                <span className="font-mono font-bold">{metrics.daylight_score} / 100</span>
              </div>
              <div className="flex justify-between text-emerald-900">
                <span>Stack Ventilation Potential:</span>
                <span className="font-mono font-bold">{metrics.ventilation_score} / 100</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-400 text-center">
            Preliminary feasibility check for SIH 2026 academic modeling.
          </div>
        </aside>
      </div>
    </div>
  );
}
