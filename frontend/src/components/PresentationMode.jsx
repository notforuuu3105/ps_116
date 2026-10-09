import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize, 
  Building2, 
  Sun, 
  Wind, 
  ShieldCheck, 
  BarChart3, 
  Car, 
  Leaf, 
  Trees, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { translations } from '../utils/translations';

export function PresentationMode({ project, massingData, onClose, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "slide_overview",
      title: "INFERNO — Intelligent Mixed-Use Urban Design Studio",
      subtitle: "SIH 2026 Problem Statement 116 | Commercial & Residential Complex",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-2">Project Vision & Typology</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              INFERNO delivers an optimized, data-driven architectural proposal for a high-density urban site. Combining subterranean parking and EV mobility, ground-level retail, a co-working commercial podium, a residential apartment tower, and a sky amenities terrace centered around an open landscaped courtyard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-1">Configuration</span>
              <span className="text-2xl font-bold text-white font-mono">B + G + 9</span>
              <span className="text-xs text-slate-400 block mt-1">11 Functional Levels</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">Plot Area</span>
              <span className="text-2xl font-bold text-white font-mono">4,800 m²</span>
              <span className="text-xs text-slate-400 block mt-1">60m × 80m Urban Plot</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block mb-1">Achieved FAR</span>
              <span className="text-2xl font-bold text-white font-mono">2.82</span>
              <span className="text-xs text-slate-400 block mt-1">Target Cap: 3.00 (Compliant)</span>
            </div>
          </div>

          <div className="p-4 bg-indigo-950/60 rounded-xl border border-indigo-800 text-xs text-indigo-200 flex items-center justify-between">
            <span>Team INFERNO | Smart India Hackathon 2026 Student Prototype</span>
            <span className="font-mono">Contact: arpitmishra1966@gmail.com</span>
          </div>
        </div>
      )
    },
    {
      id: "slide_stacking",
      title: "Vertical Program Stacking: B + G + 9",
      subtitle: "Zoning Strategy & Vertical Separation of Mixed Uses",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-700 text-xs">
              <div className="font-bold text-emerald-300">Level 9: Sky Amenities & Green Deck</div>
              <div className="text-slate-300 text-[11px]">Swimming pool, fitness pavilion, landscaped terrace & 85kWp solar pergola</div>
            </div>
            <div className="p-3 rounded-lg bg-indigo-900/40 border border-indigo-700 text-xs">
              <div className="font-bold text-indigo-300">Levels 3 to 8: Residential High-Rise Tower</div>
              <div className="text-slate-300 text-[11px]">2BHK & 3BHK cross-ventilated units with private cantilever balconies</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-900/40 border border-blue-700 text-xs">
              <div className="font-bold text-blue-300">Levels 1 to 2: Commercial Podium</div>
              <div className="text-slate-300 text-[11px]">Flexible co-working studios, enterprise office suites, medical clinic</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-900/40 border border-amber-700 text-xs">
              <div className="font-bold text-amber-300">Ground Level (G): Retail Plaza & Courtyard Ingress</div>
              <div className="text-slate-300 text-[11px]">Supermarket, alfresco cafés, double-height residential & commercial lobbies</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              <div className="font-bold text-slate-300">Basement B1: Subterranean Parking & EV Hub</div>
              <div className="text-slate-400 text-[11px]">118 car bays, 24 fast-charge EV bays (20.3%), dual 1:8 vehicular ramps</div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center text-center">
            <div className="text-4xl font-mono font-bold text-indigo-400 mb-2">13,536 m²</div>
            <div className="text-sm font-semibold text-white">Total Gross Floor Area (GFA)</div>
            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400 space-y-1">
              <div>Residential: <strong>56%</strong> (7,580 m²)</div>
              <div>Commercial & Retail: <strong>28%</strong> (3,790 m²)</div>
              <div>Amenities & Terrace: <strong>8%</strong> (1,080 m²)</div>
              <div>Basement & Services: <strong>8%</strong> (1,086 m²)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide_courtyard",
      title: "Central Landscaped Courtyard & Microclimate",
      subtitle: "Biophilic Light Well & Natural Stack Ventilation",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-xs leading-relaxed text-slate-300">
              <strong className="text-white block mb-1 text-sm">Design Strategy</strong>
              The building mass is excavated centrally with a <strong>16m × 20m (320 m²)</strong> landscaped open-to-sky courtyard. This eliminates deep floor plates and provides daylight and direct garden views to all inward-facing rooms.
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <Sun className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-slate-400 block">Daylight Penetration</span>
                <span className="text-lg font-bold text-white font-mono">78%</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <Wind className="w-4 h-4 text-sky-400 mb-1" />
                <span className="text-slate-400 block">Stack Draft Potential</span>
                <span className="text-lg font-bold text-white font-mono">82%</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/50 rounded-lg border border-emerald-800 text-xs text-emerald-300">
              Integrated evaporative eco-pond and native shade trees provide a local cooling buffer of up to <strong>-2.4°C</strong> during peak summer hours.
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col justify-center">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Courtyard Metrics</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-400">Courtyard Void Area</span>
                <span className="text-white font-mono font-bold">320 m²</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-400">Aspect Ratio</span>
                <span className="text-white font-mono font-bold">1 : 1.25</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-700">
                <span className="text-slate-400">Green Permeable Paving</span>
                <span className="text-emerald-400 font-mono font-bold">38%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NBC Part 8 Compliance</span>
                <span className="text-emerald-400 font-bold">Exceeds 1/5th Height Rule</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide_facade",
      title: "Climate-Responsive Façade & Envelope",
      subtitle: "BEE ECBC Optimization, Passive Shading & Glazing Performance",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1 text-sm">Envelope Engineering</strong>
              Calibrated to composite Indian climate zones with a balanced <strong>40% Window-to-Wall Ratio (WWR)</strong>, external vertical fins on East/West orientations to cut low-angle glare, and horizontal overhangs on South elevations.
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-400 mb-1" />
                <span className="text-slate-400 block">Solar Heat Gain Reduction</span>
                <span className="text-lg font-bold text-white font-mono">-38%</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <Leaf className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-slate-400 block">HVAC Energy Savings</span>
                <span className="text-lg font-bold text-white font-mono">22.0 kWh/m²</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Material Specifications</h4>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
              <div className="font-semibold text-white">Glazing System</div>
              <div className="text-slate-400 text-[11px]">Double Glazed Unit (DGU) with Low-E soft coating (SHGC: 0.28, U: 1.8 W/m²K)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
              <div className="font-semibold text-white">Balcony Projections</div>
              <div className="text-slate-400 text-[11px]">1.8m deep cantilever overhangs with integrated continuous planter boxes</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
              <div className="font-semibold text-white">Vertical Shading Fins</div>
              <div className="text-slate-400 text-[11px]">0.6m terracotta louvers spaced at 1.8m intervals on East & West facades</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide_mobility",
      title: "Subterranean Parking & Clean Mobility Hub",
      subtitle: "Basement B1 Layout with Dedicated EV Charging Infrastructure",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Total Parking Capacity</span>
              <span className="text-2xl font-bold text-white font-mono">118</span>
              <span className="text-xs text-slate-400 block mt-1">Standard Bays</span>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-xs text-emerald-400 block mb-1">EV Charging Bays</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">24</span>
              <span className="text-xs text-slate-400 block mt-1">20.3% Share (CEA Norm)</span>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-xs text-blue-400 block mb-1">Accessible Parking</span>
              <span className="text-2xl font-bold text-blue-400 font-mono">6</span>
              <span className="text-xs text-slate-400 block mt-1">Adjacent to Elevator Core</span>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-xs text-amber-400 block mb-1">Vehicular Ramp Slope</span>
              <span className="text-2xl font-bold text-amber-400 font-mono">1 : 8</span>
              <span className="text-xs text-slate-400 block mt-1">NBC Egress Standard</span>
            </div>
          </div>

          <div className="p-5 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white text-sm">Key Circulation & Safety Highlights:</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full segregation between vehicular basement ramp and pedestrian entrance plaza.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct access from basement elevator lobbies to all residential and commercial levels.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dedicated mechanical ventilation exhaust shafts integrated into building cores.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide_metrics",
      title: "Comprehensive Performance & Compliance Summary",
      subtitle: "Benchmarking Across Municipal Bye-Laws & Sustainability Standards",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Planning & Municipal Parameters</h4>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Site Dimensions & Area</span>
              <span className="text-white font-mono font-bold">60m × 80m (4,800 m²)</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Permissible FAR Cap</span>
              <span className="text-white font-mono font-bold">3.00</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Achieved FAR</span>
              <span className="text-emerald-400 font-mono font-bold">2.82 (Compliant - 94% Utilized)</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Ground Coverage</span>
              <span className="text-white font-mono font-bold">38.5% (Max Cap: 40.0%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Setbacks (Front / Sides / Rear)</span>
              <span className="text-white font-mono font-bold">7.5m / 6.0m / 6.0m</span>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Environmental & Lifecycle Scores</h4>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Daylight Performance Score</span>
              <span className="text-amber-400 font-mono font-bold">84 / 100</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Natural Ventilation Score</span>
              <span className="text-sky-400 font-mono font-bold">80 / 100</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Green & Open Space Area</span>
              <span className="text-emerald-400 font-mono font-bold">28.4% of Plot</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400">Embodied Carbon Benchmark</span>
              <span className="text-white font-mono font-bold">412 kg CO₂e / m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated CAPEX Budget</span>
              <span className="text-white font-mono font-bold">₹48.5 Cr</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide_conclusion",
      title: "Conclusion & Jury Deliverables",
      subtitle: "INFERNO — Ready for Next-Generation Urban Mixed-Use Deployment",
      content: (
        <div className="space-y-6 text-center">
          <div className="p-8 bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">A Cohesive, Resilient Urban Model</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              INFERNO proves that high-density mixed-use developments can achieve high commercial efficiency without sacrificing natural daylight, natural ventilation, green public amenity space, or EV-ready mobility infrastructure.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-white font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Full Prototype Implemented & Verified</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Smart India Hackathon 2026 | Team INFERNO | Contact: arpitmishra1966@gmail.com
          </div>
        </div>
      )
    }
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Presentation Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg text-xs font-mono">
            INFERNO
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Slide {currentSlide + 1} of {slides.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Exit Presentation Mode (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Body */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
            {slide.subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {slide.title}
          </h2>
        </div>

        <div>
          {slide.content}
        </div>
      </div>

      {/* Presentation Bottom Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Slide
        </button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'bg-indigo-500 w-8' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 text-xs font-bold"
        >
          Next Slide
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
