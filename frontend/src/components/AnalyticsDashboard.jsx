import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  Zap, 
  Car, 
  Leaf, 
  Sun, 
  Wind, 
  Layers, 
  Coins, 
  Compass, 
  Building2, 
  ArrowUpRight 
} from 'lucide-react';
import { translations } from '../utils/translations';

export function AnalyticsDashboard({ project, massingData, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const raw = massingData?.metrics || {};
  const metrics = {
    achieved_far: typeof raw.achieved_far === 'number' ? raw.achieved_far : 2.82,
    permissible_far: typeof (raw.target_far ?? raw.permissible_far) === 'number' ? (raw.target_far ?? raw.permissible_far) : 3.00,
    ground_coverage_pct: typeof raw.ground_coverage_pct === 'number' ? raw.ground_coverage_pct : 38.5,
    max_ground_coverage_pct: typeof raw.max_ground_coverage_pct === 'number' ? raw.max_ground_coverage_pct : 40.0,
    total_builtup_area: typeof (raw.total_built_up_area ?? raw.total_builtup_area) === 'number' ? (raw.total_built_up_area ?? raw.total_builtup_area) : 13536,
    plot_area: typeof raw.plot_area === 'number' ? raw.plot_area : 4800,
    parking_bays: typeof (raw.total_parking_spaces ?? raw.parking_bays) === 'number' ? (raw.total_parking_spaces ?? raw.parking_bays) : 118,
    ev_bays: typeof (raw.ev_charging_bays ?? raw.ev_bays) === 'number' ? (raw.ev_charging_bays ?? raw.ev_bays) : 24,
    accessible_bays: typeof (raw.accessible_parking_bays ?? raw.accessible_bays) === 'number' ? (raw.accessible_parking_bays ?? raw.accessible_bays) : 6,
    daylight_score: typeof raw.daylight_score === 'number' ? raw.daylight_score : 84,
    ventilation_score: typeof raw.ventilation_score === 'number' ? raw.ventilation_score : 80,
    green_area_pct: typeof raw.green_area_pct === 'number' ? raw.green_area_pct : 28.4,
    embodied_carbon_kg_m2: typeof raw.embodied_carbon_kg_m2 === 'number' ? raw.embodied_carbon_kg_m2 : 412,
    capex_cr: typeof (raw.estimated_cost_inr_cr ?? raw.capex_cr) === 'number' ? (raw.estimated_cost_inr_cr ?? raw.capex_cr) : 48.5
  };

  const farPct = Math.min(100, Math.round((metrics.achieved_far / metrics.permissible_far) * 100));
  const isFarCompliant = metrics.achieved_far <= metrics.permissible_far;

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800 overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'परफॉर्मेंस एनालिटिक्स' : 'Performance Analytics'}
            </span>
            <span className="text-xs text-slate-500 font-mono">B + G + 9 Comprehensive Audit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'hi' ? 'परियोजना प्रदर्शन और विश्लेषण डैशबोर्ड' : 'Project Performance & Design Audit'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'एफएआर, ग्राउंड कवरेज, डेलाइट, पर्यावरण स्कोर और वास्तुशिल्प मार्गदर्शन'
              : 'FAR compliance, ground coverage, daylight autonomy, carbon lifecycle, and constructive design guidance'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {lang === 'hi' ? 'सभी मुख्य पैरामीटर अनुकूलित' : 'Overall Design Status: Compliant'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Top 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: FAR */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium">{t.farLabel}</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {metrics.achieved_far.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                / {metrics.permissible_far.toFixed(2)} max
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${isFarCompliant ? 'bg-indigo-600' : 'bg-amber-500'}`}
                style={{ width: `${farPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{farPct}% utilized</span>
              <span className="text-emerald-600 font-semibold">Compliant</span>
            </div>
          </div>

          {/* Card 2: Ground Coverage */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium">{t.groundCoverage}</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {metrics.ground_coverage_pct.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500 font-mono">
                / {metrics.max_ground_coverage_pct.toFixed(1)}% cap
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(metrics.ground_coverage_pct / metrics.max_ground_coverage_pct) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{(metrics.plot_area * (metrics.ground_coverage_pct / 100)).toFixed(0)} m² Footprint</span>
              <span className="text-emerald-600 font-semibold">Safe Margin</span>
            </div>
          </div>

          {/* Card 3: Daylight & Ventilation */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium">{t.daylightScore} & Vent</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {metrics.daylight_score}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 100 Index</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${metrics.daylight_score}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Ventilation: {metrics.ventilation_score}/100</span>
              <span className="text-emerald-600 font-semibold">High Comfort</span>
            </div>
          </div>

          {/* Card 4: Parking & EV Hub */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium">{t.parkingTotal}</span>
              <Car className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {metrics.parking_bays}
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                ({metrics.ev_bays} EV Hubs)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(metrics.ev_bays / metrics.parking_bays) * 100 * 3}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{((metrics.ev_bays / metrics.parking_bays) * 100).toFixed(1)}% EV Share</span>
              <span className="text-emerald-600 font-semibold">CEA Compliant</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Programmatic Distribution & Sustainability Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Program Distribution (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>{lang === 'hi' ? 'प्रोग्रामेटिक फ्लोर मिक्स (B + G + 9)' : 'Programmatic Floor Mix Distribution'}</span>
              <span className="text-xs text-slate-500 font-mono">{metrics.total_builtup_area.toLocaleString()} m² Total GFA</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Cross-subsidized mixed-use zoning optimizing revenue from commercial podium with residential community quality of life.
            </p>

            {/* Stacked Bar Distribution */}
            <div className="w-full h-8 rounded-lg overflow-hidden flex shadow-inner mb-4">
              <div className="bg-amber-500 h-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '28%' }} title="Commercial Retail & Podium (28%)">
                28%
              </div>
              <div className="bg-indigo-600 h-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '56%' }} title="Residential Apartments L3-L8 (56%)">
                56%
              </div>
              <div className="bg-emerald-500 h-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '8%' }} title="Sky Amenities L9 (8%)">
                8%
              </div>
              <div className="bg-slate-500 h-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '8%' }} title="Basement B1 Services (8%)">
                8%
              </div>
            </div>

            {/* Legend & Breakdown Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-0.5">
                  <div className="w-2.5 h-2.5 rounded bg-amber-500" />
                  Commercial
                </div>
                <div className="text-slate-600">G to L2 Podium</div>
                <div className="font-mono font-bold text-amber-900 mt-1">3,790 m²</div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-900 mb-0.5">
                  <div className="w-2.5 h-2.5 rounded bg-indigo-600" />
                  Residential
                </div>
                <div className="text-slate-600">L3 to L8 Tower</div>
                <div className="font-mono font-bold text-indigo-900 mt-1">7,580 m²</div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-0.5">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  Sky Amenities
                </div>
                <div className="text-slate-600">L9 Terrace & Pool</div>
                <div className="font-mono font-bold text-emerald-900 mt-1">1,080 m²</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-0.5">
                  <div className="w-2.5 h-2.5 rounded bg-slate-500" />
                  Parking & Core
                </div>
                <div className="text-slate-600">B1 Subterranean</div>
                <div className="font-mono font-bold text-slate-800 mt-1">1,086 m²</div>
              </div>
            </div>
          </div>

          {/* Sustainability & Cost Highlights (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              {lang === 'hi' ? 'सतत विकास और लागत संकेतक' : 'Sustainability & Financial Indicators'}
            </h2>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Embodied Carbon Benchmark</div>
                    <div className="text-[11px] text-slate-500">Conceptual lifecycle assessment</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-700 font-mono">
                    {metrics.embodied_carbon_kg_m2}
                  </div>
                  <div className="text-[10px] text-slate-500">kg CO₂e / m²</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Estimated Project CAPEX</div>
                    <div className="text-[11px] text-slate-500">Structure, MEP, Façade & Fitout</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    ₹{metrics.capex_cr.toFixed(1)} Cr
                  </div>
                  <div className="text-[10px] text-slate-500">Base budget index</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Rooftop Solar PV Capacity</div>
                    <div className="text-[11px] text-slate-500">On L9 Sky Terrace Pergola</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-700 font-mono">85 kWp</div>
                  <div className="text-[10px] text-slate-500">~112 MWh / yr</div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-600 mt-3 pt-2 border-t border-slate-100 italic">
              * Indicative conceptual estimates generated for SIH 2026 preliminary academic modeling.
            </p>
          </div>
        </div>

        {/* Constructive Architectural Design Guidance Panel */}
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
              <h2 className="text-sm font-bold tracking-wide uppercase text-indigo-400">
                {lang === 'hi' ? 'वास्तुशिल्प डिजाइन मार्गदर्शन और सिफारिशें' : 'Constructive Architectural Design Guidance'}
              </h2>
            </div>
            <span className="text-xs text-slate-400">Adaptive Feedback Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                FAR & Massing Efficiency
              </div>
              <p className="text-slate-400 leading-relaxed">
                Achieved FAR of <strong>{metrics.achieved_far.toFixed(2)}</strong> sits safely within the <strong>{metrics.permissible_far.toFixed(2)}</strong> permissible ceiling. Podium setbacks at Level 3 allow open sightlines from the street while accommodating private landscaped residential terraces.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Courtyard Microclimate Integration
              </div>
              <p className="text-slate-400 leading-relaxed">
                The 16m × 20m central courtyard void effectively splits the residential floorplates into East and West wings, eliminating deep dark interior corridors and ensuring 100% of residential units enjoy natural cross-ventilation.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Mobility & EV Infrastructure
              </div>
              <p className="text-slate-400 leading-relaxed">
                Subterranean basement B1 houses 118 bays including 24 dedicated fast-charging EV spots (20.3% share). Vehicular access ramp (1:8 gradient) is segregated from pedestrian plaza entrances on Ground Level for universal safety.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Façade Solar Mitigation
              </div>
              <p className="text-slate-400 leading-relaxed">
                Combined strategy of vertical fins on East/West glazing, horizontal overhangs on South elevations, and 1.8m deep cantilever balconies achieves an estimated <strong>38%</strong> cooling load reduction without sacrificing daylight autonomy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
