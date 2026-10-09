import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Car,
  SunMedium,
  TrendingUp,
  Leaf,
  Layers,
  IndianRupee,
  Building,
  ShieldCheck,
  Zap
} from 'lucide-react';

export function ComplianceDashboard({
  massingData,
  hoveredFloor,
  setHoveredFloor,
  selectedFloor,
  setSelectedFloor,
  onAutoFit
}) {
  if (!massingData || !massingData.metrics || !massingData.compliance) {
    return (
      <aside className="w-80 xl:w-88 h-full bg-white border-l border-slate-200 p-4 flex items-center justify-center text-slate-400 text-xs">
        No massing data available
      </aside>
    );
  }

  const { metrics, compliance, floors } = massingData;
  const isCompliant = compliance.is_compliant;
  const farRatio = Math.min(200, Math.round((metrics.achieved_far / metrics.max_far) * 100));

  return (
    <aside className="w-80 xl:w-88 h-full bg-white border-l border-slate-200 flex flex-col justify-between overflow-y-auto z-20 shadow-xs text-slate-800">
      <div className="p-4 space-y-4">
        {/* 1. Global Compliance Verdict Banner */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col gap-1.5 shadow-xs ${
            isCompliant
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              {isCompliant ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>MUNICIPAL SANCTION APPROVED</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>BYE-LAW NON-COMPLIANCE</span>
                </>
              )}
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                isCompliant ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
              }`}
            >
              {isCompliant ? 'PASS' : 'FAIL'}
            </span>
          </div>

          <p className="text-[11px] leading-tight text-slate-700">
            {isCompliant
              ? 'All municipal FAR caps, NBC 2016 fire safety clearances, and coverage limits are verified.'
              : `${compliance.violations.length} statutory code violation(s) detected.`}
          </p>

          {/* List of violations if any */}
          {compliance.violations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-rose-200 space-y-1.5">
              {compliance.violations.map((viol, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-rose-800 font-medium">
                  <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{viol}</span>
                </div>
              ))}

              <button
                onClick={onAutoFit}
                className="w-full mt-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Fix Instantly with Auto-Fit Solver</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Primary Bye-Law Metric: Achieved FAR vs Permissible FAR */}
        <div className="gov-card p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" /> Floor Area Ratio (FAR)
            </span>
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                compliance.far_compliance
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}
            >
              {metrics.achieved_far.toFixed(2)} / {metrics.max_far.toFixed(2)}
            </span>
          </div>

          {/* FAR Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                compliance.far_compliance ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
              style={{ width: `${Math.min(100, farRatio)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>FAR Utilization: {farRatio}%</span>
            <span>Total BUA: {metrics.total_built_up_area.toLocaleString()} m²</span>
          </div>
        </div>

        {/* 3. Secondary Environmental & Planning Gauges (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Ground Coverage */}
          <div className="gov-card p-2.5 flex flex-col justify-between">
            <div className="text-[10px] text-slate-500 font-semibold">Ground Coverage</div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-lg font-bold font-mono text-slate-900">
                {metrics.ground_coverage_pct}%
              </span>
              <span className="text-[9px] text-slate-400">/ 60% max</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full ${
                  compliance.coverage_compliance ? 'bg-blue-600' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (metrics.ground_coverage_pct / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Daylight Score */}
          <div className="gov-card p-2.5 flex flex-col justify-between">
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <SunMedium className="w-3 h-3 text-amber-500" /> Daylight Score
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-lg font-bold font-mono text-amber-700">
                {metrics.daylight_exposure_score}%
              </span>
              <span className="text-[9px] text-emerald-600 font-bold">Optimal</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${metrics.daylight_exposure_score}%` }}
              />
            </div>
          </div>

          {/* Parking Required */}
          <div className="gov-card p-2.5 flex flex-col justify-between">
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Car className="w-3 h-3 text-blue-600" /> Parking Bays
            </div>
            <div className="text-lg font-bold font-mono text-slate-900 my-0.5">
              {metrics.total_required_parking} <span className="text-xs font-normal text-slate-500">bays</span>
            </div>
            <div className="text-[9px] text-blue-700 font-medium">
              {metrics.estimated_basement_levels} Basement Levels
            </div>
          </div>

          {/* Building Height */}
          <div className="gov-card p-2.5 flex flex-col justify-between">
            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Building className="w-3 h-3 text-indigo-600" /> Total Height
            </div>
            <div className="text-lg font-bold font-mono text-slate-900 my-0.5">
              {metrics.total_building_height} <span className="text-xs font-normal text-slate-500">m</span>
            </div>
            <div className="text-[9px] text-slate-500">
              {floors.length} Storeys
            </div>
          </div>
        </div>

        {/* 4. Cost & Sustainability Card */}
        <div className="gov-card p-3 space-y-2 bg-gradient-to-br from-slate-50 to-white">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> CAPEX & Embodied Carbon
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div>
              <div className="text-[10px] text-slate-500">Project Cost</div>
              <div className="text-sm font-bold font-mono text-emerald-800">
                ₹{metrics.estimated_cost_inr_cr.toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                ~₹{metrics.estimated_cost_per_sqft.toLocaleString()}/sq.ft
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" /> Carbon Footprint
              </div>
              <div className="text-sm font-bold font-mono text-slate-800">
                {metrics.embodied_carbon_tons.toLocaleString()} <span className="text-[10px] text-slate-400">tCO2e</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-mono">
                ~510 kg/m² BUA
              </div>
            </div>
          </div>
        </div>

        {/* 5. Floor Stacking Breakdown */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" /> Floor Stacking Plan
            </span>
            <span className="text-[10px] text-slate-400">{floors.length} Levels</span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
            {[...floors].reverse().map((floor) => {
              const isHovered = hoveredFloor === floor.floor_index;
              const isSelected = selectedFloor === floor.floor_index;

              return (
                <div
                  key={floor.floor_index}
                  onMouseEnter={() => setHoveredFloor(floor.floor_index)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() =>
                    setSelectedFloor(selectedFloor === floor.floor_index ? null : floor.floor_index)
                  }
                  className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                      : isHovered
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: floor.color_hex }}
                    />
                    <span className="font-sans font-medium text-xs truncate max-w-[120px]">
                      {floor.floor_label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                    <span>+{floor.elevation_y.toFixed(1)}m</span>
                    <span className="font-bold text-slate-700">{floor.area.toFixed(0)} m²</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
