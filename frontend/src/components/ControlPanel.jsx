import React from 'react';
import {
  Sliders,
  Building2,
  Sparkles,
  MapPin,
  RefreshCw,
  Download,
  Zap,
  CheckCircle2,
  FileDown
} from 'lucide-react';

export function ControlPanel({
  requestState,
  setRequestState,
  onGenerate,
  onAutoFit,
  onExportDXF,
  isLoading,
  isAutoFitting,
  isExporting,
  activePreset,
  applyPreset
}) {
  const handleChange = (field, value) => {
    setRequestState((prev) => ({
      ...prev,
      [field]: typeof value === 'number' ? value : parseFloat(value) || 0
    }));
  };

  return (
    <aside className="w-80 xl:w-88 h-full bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto z-20 shadow-xs text-slate-800">
      <div className="p-4 space-y-4">
        {/* Prominent Auto-Fit Solver Button at Top */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>NBC 2016 Auto-Fit Solver</span>
            </span>
            <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded font-mono">
              Auto-Clamp
            </span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            Instantly solves maximum permissible floors and setbacks to ensure <strong>Achieved FAR ≤ Max Permissible FAR</strong>.
          </p>
          <button
            onClick={onAutoFit}
            disabled={isAutoFitting}
            className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isAutoFitting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 fill-current" />
            )}
            <span>⚡ AUTO-FIT COMPLIANCE SOLVER</span>
          </button>
        </div>

        {/* Municipal Bye-Law Presets */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-700" /> State Presets
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => applyPreset('mumbai_dcr')}
              className={`p-2 rounded-lg text-xs font-semibold border text-center transition flex flex-col items-center cursor-pointer ${
                activePreset === 'mumbai_dcr'
                  ? 'bg-blue-50 border-blue-600 text-[#003366] shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Mumbai</span>
              <span className="text-[10px] text-slate-500">3.0 FAR</span>
            </button>
            <button
              onClick={() => applyPreset('delhi_dda')}
              className={`p-2 rounded-lg text-xs font-semibold border text-center transition flex flex-col items-center cursor-pointer ${
                activePreset === 'delhi_dda'
                  ? 'bg-blue-50 border-blue-600 text-[#003366] shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Delhi</span>
              <span className="text-[10px] text-slate-500">2.5 FAR</span>
            </button>
            <button
              onClick={() => applyPreset('bengaluru_bbmp')}
              className={`p-2 rounded-lg text-xs font-semibold border text-center transition flex flex-col items-center cursor-pointer ${
                activePreset === 'bengaluru_bbmp'
                  ? 'bg-blue-50 border-blue-600 text-[#003366] shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Bengaluru</span>
              <span className="text-[10px] text-slate-500">2.75 FAR</span>
            </button>
          </div>
        </div>

        {/* Section 1: Plot Dimensions */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-700" /> Cadastral Plot Boundary
            </span>
            <span className="text-[11px] text-slate-500 font-mono font-bold">
              {(requestState.plot_width * requestState.plot_depth).toLocaleString()} m²
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Plot Width</span>
              <span className="font-mono font-bold text-blue-900">{requestState.plot_width} m</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              step="1"
              value={requestState.plot_width}
              onChange={(e) => handleChange('plot_width', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Plot Depth</span>
              <span className="font-mono font-bold text-blue-900">{requestState.plot_depth} m</span>
            </div>
            <input
              type="range"
              min="30"
              max="160"
              step="1"
              value={requestState.plot_depth}
              onChange={(e) => handleChange('plot_depth', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Section 2: Setbacks */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-600" /> Mandatory Setbacks
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              ≥6m for Fire Tender
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Front Setback (Road buffer)</span>
              <span className="font-mono font-bold text-amber-700">{requestState.setback_front} m</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="0.5"
              value={requestState.setback_front}
              onChange={(e) => handleChange('setback_front', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Rear Setback</span>
              <span className="font-mono font-bold text-amber-700">{requestState.setback_rear} m</span>
            </div>
            <input
              type="range"
              min="3"
              max="18"
              step="0.5"
              value={requestState.setback_rear}
              onChange={(e) => handleChange('setback_rear', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Side Setbacks</span>
              <span className="font-mono font-bold text-amber-700">{requestState.setback_sides} m</span>
            </div>
            <input
              type="range"
              min="3"
              max="16"
              step="0.5"
              value={requestState.setback_sides}
              onChange={(e) => handleChange('setback_sides', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Section 3: Massing & Density */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Massing & Density
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Max Permissible FAR Cap</span>
              <span className="font-mono font-bold text-emerald-700">{requestState.max_far.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.5"
              step="0.1"
              value={requestState.max_far}
              onChange={(e) => handleChange('max_far', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Total Storeys (Floors)</span>
              <span className="font-mono font-bold text-emerald-700">{requestState.total_floors} Floors</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={requestState.total_floors}
              onChange={(e) => handleChange('total_floors', parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Commercial / Retail Share</span>
              <span className="font-mono font-bold text-blue-700">{requestState.commercial_ratio}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={requestState.commercial_ratio}
              onChange={(e) => handleChange('commercial_ratio', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-[#003366] hover:bg-blue-900 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400" />
          )}
          <span>Recalculate 3D Massing</span>
        </button>
      </div>
    </aside>
  );
}
