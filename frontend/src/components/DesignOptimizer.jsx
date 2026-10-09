import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Sun, 
  Wind, 
  Leaf, 
  Coins, 
  Zap, 
  Car, 
  Building2, 
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { translations } from '../utils/translations';

const DEFAULT_OPTIONS = [
  {
    id: "option_a",
    name: "Option A — Balanced Design",
    name_hi: "विकल्प A — संतुलित डिज़ाइन",
    tagline: "Commercial viability & residential livability equilibrium",
    tagline_hi: "व्यावसायिक व्यवहार्यता और आवासीय जीवन-सुविधा संतुलन",
    isRecommended: true,
    configuration: "B + G + 9",
    achieved_far: 2.82,
    permissible_far: 3.00,
    ground_coverage: "38.5%",
    courtyard_dim: "16m × 20m (320 m²)",
    daylight_score: 84,
    ventilation_score: 80,
    green_area_pct: "28.4%",
    parking_total: 118,
    ev_bays: 24,
    embodied_carbon: "412 kg CO₂e/m²",
    capex_cr: "₹48.5 Cr",
    key_features: [
      "Optimal balance of retail revenue on Ground & Level 1-2 with quiet residential tower above",
      "Standard 16m × 20m courtyard provides compliant light well to all interior facing units",
      "Basement B1 accommodates 118 bays including 20.3% dedicated EV chargers"
    ]
  },
  {
    id: "option_b",
    name: "Option B — Daylight & Airflow Priority",
    name_hi: "विकल्प B — प्राकृतिक प्रकाश और वायु प्रवाह प्राथमिकता",
    tagline: "Maximized central light well and passive wind capture",
    tagline_hi: "विस्तारित प्रांगण और बेहतर प्राकृतिक वायु संचार",
    isRecommended: false,
    configuration: "B + G + 9",
    achieved_far: 2.65,
    permissible_far: 3.00,
    ground_coverage: "35.2%",
    courtyard_dim: "18m × 24m (432 m²)",
    daylight_score: 92,
    ventilation_score: 88,
    green_area_pct: "34.0%",
    parking_total: 112,
    ev_bays: 28,
    embodied_carbon: "395 kg CO₂e/m²",
    capex_cr: "₹46.8 Cr",
    key_features: [
      "Expanded 432 m² courtyard void maximizes daylight penetration down to ground floor retail",
      "Generates continuous stack updraft (up to 2.1 m/s), reducing annual cooling energy by 22%",
      "Slightly reduced FAR (2.65) yields generous stepped landscaped terraces on Level 3"
    ]
  },
  {
    id: "option_c",
    name: "Option C — Sustainability & Low-Carbon Priority",
    name_hi: "विकल्प C — सतत पर्यावरण और निम्न-कार्बन प्राथमिकता",
    tagline: "Hybrid mass-timber construction and intensive biophilic envelope",
    tagline_hi: "हाइब्रिड टिम्बर संरचना और अधिकतम ईवी बुनियादी ढांचा",
    isRecommended: false,
    configuration: "B + G + 9",
    achieved_far: 2.70,
    permissible_far: 3.00,
    ground_coverage: "36.8%",
    courtyard_dim: "16m × 20m (320 m²)",
    daylight_score: 86,
    ventilation_score: 82,
    green_area_pct: "38.5%",
    parking_total: 120,
    ev_bays: 36,
    embodied_carbon: "320 kg CO₂e/m²",
    capex_cr: "₹52.4 Cr",
    key_features: [
      "Engineered timber secondary framing cuts upfront embodied carbon by 22% (320 kg CO₂e/m²)",
      "High EV deployment: 36 bays (30% share) with smart peak-demand charging integration",
      "Vertical biophilic green facades on residential balconies buffer urban heat island effect"
    ]
  }
];

export function DesignOptimizer({ project, onApplyOption, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [selectedOptionId, setSelectedOptionId] = useState("option_a");
  const [appliedOptionId, setAppliedOptionId] = useState("option_a");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    // Attempt to fetch dynamic options from backend if available
    fetch('/api/design-options')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Fallback to default options');
      })
      .then((data) => {
        if (data && data.options && data.options.length > 0) {
          setOptions(data.options);
        }
      })
      .catch(() => {
        // Silently keep default precomputed options
      });
  }, []);

  const handleApply = (opt) => {
    setIsApplying(true);
    setAppliedOptionId(opt.id);
    if (onApplyOption) {
      onApplyOption(opt);
    }
    setTimeout(() => {
      setIsApplying(false);
    }, 600);
  };

  const selectedOpt = options.find((o) => o.id === selectedOptionId) || options[0];

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800 overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'मल्टी-क्राइटेरिया ऑप्टिमाइज़र' : 'Multi-Criteria Optimizer'}
            </span>
            <span className="text-xs text-slate-500 font-mono">B + G + 9 Design Alternatives</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'hi' ? 'डिज़ाइन अनुकूलन और तुलना मैट्रिक्स' : 'Design Alternatives & Comparison Matrix'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'संतुलित, डेलाइट-उन्मुख और कम-कार्बन रणनीतियों के बीच तुलना करें और प्रोजेक्ट में लागू करें'
              : 'Evaluate and trade off balanced, daylight-prioritized, and low-carbon design variants for the B+G+9 typology'}
          </p>
        </div>

        <div>
          <button
            onClick={() => handleApply(selectedOpt)}
            disabled={isApplying}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isApplying ? (
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {lang === 'hi' ? 'यह विकल्प लागू करें' : 'Apply Selected Option to Workspace'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Option Selection Cards (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {options.map((opt) => {
            const isSelected = opt.id === selectedOptionId;
            const isApplied = opt.id === appliedOptionId;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`rounded-xl border-2 p-5 cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected 
                    ? 'border-indigo-600 bg-white shadow-md' 
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {opt.configuration}
                    </span>
                    {opt.isRecommended && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Recommended
                      </span>
                    )}
                    {isApplied && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-slate-900">
                    {lang === 'hi' ? opt.name_hi || opt.name : opt.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {lang === 'hi' ? opt.tagline_hi || opt.tagline : opt.tagline}
                  </p>

                  {/* Primary Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">FAR</span>
                      <span className="font-bold text-slate-900 font-mono">{opt.achieved_far.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Coverage</span>
                      <span className="font-bold text-slate-900 font-mono">{opt.ground_coverage}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Daylight Score</span>
                      <span className="font-bold text-amber-600 font-mono">{opt.daylight_score}/100</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">EV Bays</span>
                      <span className="font-bold text-emerald-600 font-mono">{opt.ev_bays} bays</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                    {isSelected ? 'Selected' : 'Click to inspect'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {opt.capex_cr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Side-by-Side Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-indigo-600" />
              {lang === 'hi' ? 'मापदंड तुलना तालिका' : 'Comprehensive Multi-Criteria Comparison Table'}
            </h2>
            <span className="text-xs text-slate-500">B + G + 9 Configuration Matrix</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Evaluation Metric</th>
                  {options.map((opt) => (
                    <th 
                      key={opt.id} 
                      className={`py-3 px-4 ${opt.id === selectedOptionId ? 'bg-indigo-50/70 text-indigo-900 font-bold' : ''}`}
                    >
                      {opt.name.split('—')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Typology & Levels</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.configuration}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Achieved FAR (Target: 3.00)</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono font-bold ${opt.id === selectedOptionId ? 'bg-indigo-50/30 text-indigo-700' : ''}`}>
                      {opt.achieved_far.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Ground Coverage Ratio</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.ground_coverage}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Central Courtyard Dimension</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.courtyard_dim}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Daylight Performance Index</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono font-bold text-amber-600 ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.daylight_score} / 100
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Natural Ventilation Score</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono font-bold text-sky-600 ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.ventilation_score} / 100
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Green & Open Space Ratio</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono text-emerald-600 font-semibold ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.green_area_pct}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Parking Capacity & EV Bays</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.parking_total} bays ({opt.ev_bays} EV)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Embodied Carbon Benchmark</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.embodied_carbon}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Projected CAPEX Base</td>
                  {options.map((opt) => (
                    <td key={opt.id} className={`py-3 px-4 font-mono font-bold ${opt.id === selectedOptionId ? 'bg-indigo-50/30' : ''}`}>
                      {opt.capex_cr}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Option Feature Walkthrough */}
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Architectural Rationale: {selectedOpt.name}
            </span>
            <span className="text-xs text-slate-400 font-mono">{selectedOpt.configuration} Typology</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            {selectedOpt.key_features.map((feat, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
