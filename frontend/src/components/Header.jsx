import React from 'react';
import {
  Boxes,
  Compass,
  FileSpreadsheet,
  Download,
  Building,
  Sparkles,
  Layers,
  FileDown
} from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  onExportDXF,
  isExporting,
  metrics,
  compliance
}) {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between z-30 shrink-0 select-none shadow-md">
      {/* Left: Brand & Problem Statement ID */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Building className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">
              Urban Mixed-Use Complex Generator
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SIH 2026 PS 116
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Autonomous Computational Massing, Environmental Analytics & Bye-Law Compliance
          </p>
        </div>
      </div>

      {/* Center: View Mode Switcher Tabs */}
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('3d')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeTab === '3d'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>3D Massing & Shadows</span>
        </button>
        <button
          onClick={() => setActiveTab('2d')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeTab === '2d'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>2D Architectural Site Plan</span>
        </button>
      </div>

      {/* Right: Quick Status & Export DXF Action */}
      <div className="flex items-center gap-3">
        {metrics && compliance && (
          <div className="hidden lg:flex items-center gap-3 text-xs border-r border-slate-800 pr-3">
            <div className="text-slate-400">
              FAR: <span className={compliance.far_compliance ? 'text-emerald-400 font-mono font-bold' : 'text-rose-400 font-mono font-bold'}>{metrics.achieved_far.toFixed(2)}</span>
            </div>
            <div className="text-slate-400">
              BUA: <span className="text-white font-mono">{metrics.total_built_up_area.toLocaleString()} m²</span>
            </div>
            <div className="text-slate-400">
              Coverage: <span className="text-white font-mono">{metrics.ground_coverage_pct}%</span>
            </div>
          </div>
        )}

        <button
          onClick={onExportDXF}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
          title="Download AutoCAD DXF Floor & Site Plan"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export CAD (.DXF)</span>
        </button>
      </div>
    </header>
  );
}
