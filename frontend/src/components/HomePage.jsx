import React, { useState } from 'react';
import {
  Compass,
  Building2,
  Layers,
  Trees,
  Sun,
  Wind,
  Car,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  SlidersHorizontal,
  FileDown,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { SAMPLE_PROJECTS } from '../utils/projectStore';
import { translations } from '../utils/translations';

export function HomePage({
  onStartNewProject,
  onOpenStudio,
  onSelectProject,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const [activePreviewTab, setActivePreviewTab] = useState('stacking'); // 'stacking' | 'metrics' | 'courtyard'

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 cad-grid-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text & Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-800">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                <span>Smart India Hackathon 2026 • Problem Statement 116</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Design Better Buildings.{' '}
                <span className="text-orange-700 block mt-1 font-serif italic">
                  Plan Smarter Cities.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                Transform your plot requirements into thoughtfully planned mixed-use buildings with
                interactive floor planning, 3D visualization, climate-responsive design insights, and
                intelligent multi-criteria optimization.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onStartNewProject}
                  className="px-6 py-3.5 bg-orange-700 hover:bg-orange-800 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-900/10 transition flex items-center gap-2.5 cursor-pointer"
                >
                  <span>Start a New Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenStudio()}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 active:scale-98 border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-orange-700" />
                  <span>Explore Design Studio</span>
                </button>
              </div>

              {/* Prototype Key Highlights Ribbon */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono text-[11px]">TYPOLOGY</span>
                  <span className="font-bold text-slate-900 text-sm">B + G + 9</span>
                  <span className="text-slate-500 block text-[11px]">Commercial & Residential</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[11px]">LIGHT WELL</span>
                  <span className="font-bold text-emerald-700 text-sm">16m × 20m</span>
                  <span className="text-slate-500 block text-[11px]">Central Stack Courtyard</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[11px]">CLEAN MOBILITY</span>
                  <span className="font-bold text-slate-900 text-sm">118 Bays / 20% EV</span>
                  <span className="text-slate-500 block text-[11px]">Subterranean Hub</span>
                </div>
              </div>
            </div>

            {/* Right Architectural Preview Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-300 shadow-xl p-5 space-y-4 relative">
                {/* Preview Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-orange-700 font-bold block">
                      ARCHITECTURAL PROTOTYPE
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Mixed-Use Complex B+G+9
                    </h3>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px]">
                    <button
                      onClick={() => setActivePreviewTab('stacking')}
                      className={`px-2.5 py-1 rounded font-semibold transition ${
                        activePreviewTab === 'stacking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Stack
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('metrics')}
                      className={`px-2.5 py-1 rounded font-semibold transition ${
                        activePreviewTab === 'metrics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Metrics
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('courtyard')}
                      className={`px-2.5 py-1 rounded font-semibold transition ${
                        activePreviewTab === 'courtyard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Court
                    </button>
                  </div>
                </div>

                {/* Interactive Preview Body */}
                {activePreviewTab === 'stacking' && (
                  <div className="space-y-2 text-xs">
                    {/* Level 9 */}
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                        <div>
                          <span className="font-bold text-emerald-950">Level 9: Sky Amenities & Terrace</span>
                          <span className="text-[10px] text-emerald-700 block">Pool, Fitness Pavilion, Solar Pergola</span>
                        </div>
                      </div>
                      <span className="font-mono text-emerald-900 font-semibold text-[11px]">1,080 m²</span>
                    </div>

                    {/* Levels 3 to 8 */}
                    <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-orange-600" />
                        <div>
                          <span className="font-bold text-orange-950">Levels 3 to 8: Residential Tower</span>
                          <span className="text-[10px] text-orange-700 block">2BHK & 3BHK Cross-Ventilated Units</span>
                        </div>
                      </div>
                      <span className="font-mono text-orange-900 font-semibold text-[11px]">7,580 m²</span>
                    </div>

                    {/* Levels 1 to 2 */}
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-blue-600" />
                        <div>
                          <span className="font-bold text-blue-950">Levels 1 to 2: Commercial Podium</span>
                          <span className="text-[10px] text-blue-700 block">Co-Working Studios, Medical Suites</span>
                        </div>
                      </div>
                      <span className="font-mono text-blue-900 font-semibold text-[11px]">2,520 m²</span>
                    </div>

                    {/* Ground Level G */}
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                        <div>
                          <span className="font-bold text-amber-950">Ground Level: Retail Plaza & Ingress</span>
                          <span className="text-[10px] text-amber-700 block">Anchor Supermarket, Dining, Courtyard</span>
                        </div>
                      </div>
                      <span className="font-mono text-amber-900 font-semibold text-[11px]">1,270 m²</span>
                    </div>

                    {/* Basement B1 */}
                    <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded bg-slate-500" />
                        <div>
                          <span className="font-bold text-slate-800">Basement B1: EV Mobility & Core</span>
                          <span className="text-[10px] text-slate-500 block">118 Bays, 24 Fast Chargers, 1:8 Ramp</span>
                        </div>
                      </div>
                      <span className="font-mono text-slate-700 font-semibold text-[11px]">1,086 m²</span>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'metrics' && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Plot Dimensions</span>
                      <span className="font-bold text-slate-900 text-sm">60m × 80m</span>
                      <span className="text-slate-500 text-[11px] block">4,800 m² Area</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Achieved FAR</span>
                      <span className="font-bold text-orange-700 text-sm">2.82</span>
                      <span className="text-slate-500 text-[11px] block">Target Cap: 3.00</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Ground Coverage</span>
                      <span className="font-bold text-slate-900 text-sm">38.5%</span>
                      <span className="text-slate-500 text-[11px] block">Cap: 40.0% Max</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Daylight Score</span>
                      <span className="font-bold text-emerald-700 text-sm">84 / 100</span>
                      <span className="text-slate-500 text-[11px] block">High Spatial Comfort</span>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'courtyard' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                        <Trees className="w-4 h-4 text-emerald-700" />
                        <span>Central 320 m² Biophilic Courtyard</span>
                      </div>
                      <p className="text-emerald-800 text-[11px] leading-relaxed">
                        Eliminates deep interior dark corridors. Provides direct daylight, stack effect ventilation, and evaporative cooling buffer of up to -2.4°C.
                      </p>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">Daylight Penetration:</span>
                      <span className="font-bold text-slate-900 font-mono">78% of floorplate</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">Stack Effect Draft:</span>
                      <span className="font-bold text-slate-900 font-mono">↑ 1.8 m/s buoyancy</span>
                    </div>
                  </div>
                )}

                {/* Open in Studio Action */}
                <button
                  onClick={() => onOpenStudio()}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in 3D Building Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE-STEP WORKFLOW SECTION */}
      <section id="workflow" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-orange-700 font-bold block">
              SEAMLESS ARCHITECTURAL PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              From Plot Parameters to Evaluated Architecture
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              INFERNO replaces fragmented spreadsheets and ad-hoc massing with a continuous,
              parameter-driven workflow designed for urban mixed-use complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Define Site & Constraints
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Input plot dimensions, abutting road width, setbacks, and local planning guidelines
                (NBC 2016, Mumbai DCPR, Delhi MPD, BBMP). The system generates a compliant buildable footprint.
              </p>
              <div className="pt-2 text-xs text-orange-800 font-semibold flex items-center gap-1">
                <span>Guided 6-step project wizard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Generative Massing & Layouts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algorithmic B+G+9 configuration automatically allocates subterranean EV parking,
                commercial podium retail, and residential 2BHK/3BHK towers wrapped around a central light well.
              </p>
              <div className="pt-2 text-xs text-blue-800 font-semibold flex items-center gap-1">
                <span>Interactive 2D & 3D viewports</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Analyze, Optimize & Export
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluate daylight potential, stack effect ventilation, and embodied carbon.
                Compare alternative massing configurations and export architectural PDF reports and CAD DXF drawings.
              </p>
              <div className="pt-2 text-xs text-emerald-800 font-semibold flex items-center gap-1">
                <span>Multi-criteria optimization</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE DESIGN CAPABILITIES GRID */}
      <section id="features" className="py-20 border-b border-slate-200 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-orange-700 font-bold block">
              INTELLIGENT DESIGN SUITE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Purpose-Built for Mixed-Use Architecture
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Each module addresses real-world architectural design, planning regulations, and microclimate considerations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                B + G + 9 Vertical Stacking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear vertical segregation between subterranean EV parking, ground-level retail plaza,
                commercial co-working podium, residential tower, and sky amenities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Central Biophilic Courtyard
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated 16m × 20m light well satisfying NBC Part 8 light court proportions.
                Simulates passive buoyancy stack updraft and microclimate evaporative cooling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Climate-Responsive Façade
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calibrated to BEE ECBC envelope standards with 40% window-to-wall ratio, vertical shading fins,
                horizontal overhangs, and deep cantilever balconies.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Subterranean Mobility & EV Hub
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated basement layout with 118 bays including 20% EV fast charging capacity compliant
                with Central Electricity Authority (CEA) guidelines.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Multi-Criteria Design Optimizer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare Balanced, Daylight-Priority, and Low-Carbon massing alternatives in a side-by-side
                matrix and apply selected options to your workspace with one click.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileDown className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                CAD (.DXF) & PDF Export
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate real AutoCAD-compatible .DXF vector contour drawings and comprehensive
                architectural performance audit reports for client and jury reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SAMPLE PROJECTS GALLERY */}
      <section id="projects" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-orange-700 font-bold block mb-1">
                PROJECT PORTFOLIO
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Featured Mixed-Use Prototypes
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Explore pre-configured mixed-use typologies modeled for varied urban densities,
                plot geometries, and regional development control guidelines.
              </p>
            </div>

            <button
              onClick={onStartNewProject}
              className="px-5 py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-end"
            >
              <span>+ Create Custom Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-orange-800 px-2 py-0.5 rounded bg-orange-100">
                      {proj.program.configuration}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {proj.city}, {proj.state}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {proj.description}
                  </p>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">SITE</span>
                      <span className="font-bold text-slate-800">{proj.site.plot_width}×{proj.site.plot_depth}m</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">FAR CAP</span>
                      <span className="font-bold text-orange-700 font-mono">{proj.constraints.max_far}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">EV MOBILITY</span>
                      <span className="font-bold text-emerald-700 font-mono">{proj.program.ev_charging_pct}% EV</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {proj.type.split(' ')[0]} Focus
                  </span>
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TARGET SECTORS SECTION */}
      <section id="about" className="py-20 border-b border-slate-200 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-orange-700 font-bold block">
              WHO INFERNO SUPPORTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Built for Architecture, Urbanism & Education
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Bridging the gap between initial parcel feasibility, building bye-law compliance,
              and microclimate passive design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Architectural Practices</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accelerate early massing studies, evaluate mixed-use FAR feasibility, and present validated schemes to clients.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Urban Planning Studios</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assess transit corridor impacts, pedestrian setback buffers, and road right-of-way height limits.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Architecture Students</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Understand NBC 2016 stack ventilation, solar envelope physics, and mixed-use zoning with interactive 3D tools.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Sustainable Developers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Model embodied carbon benchmarks, clean EV mobility readiness, and commercial viability upfront.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
            <Sparkles className="w-3.5 h-3.5 text-orange-700" />
            <span>Ready to Plan Your Next Mixed-Use Complex?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Experience Intelligent Architectural Design with INFERNO
          </h2>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Configure plot boundaries, explore B+G+9 massing options, and generate CAD and PDF reports in minutes.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={onStartNewProject}
              className="px-6 py-3.5 bg-orange-700 hover:bg-orange-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Start a New Project Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenStudio()}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Open Default Prototype</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. ARCHITECTURAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-wider">
                  INFERNO
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                  SIH 2026 PS 116
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Intelligent Mixed-Use Urban Design Studio • Design smarter. Analyze faster. Build better.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">Team INFERNO</span>
              <span className="text-slate-600">•</span>
              <a
                href="mailto:arpitmishra1966@gmail.com"
                className="text-orange-400 hover:underline"
              >
                arpitmishra1966@gmail.com
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
            <p>
              <strong>Academic & Prototype Notice:</strong> INFERNO is an independent architectural design, visualization,
              and performance analysis prototype developed for Smart India Hackathon 2026 (Problem Statement 116: Urban Mixed-Use Design Challenge).
            </p>
            <p>
              All calculations, building bye-law metrics (NBC 2016, DCPR, MPD, BBMP), daylight scores, and environmental indicators are preliminary
              conceptual estimates intended for academic evaluation and design exploration. They do not constitute statutory sanction,
              legal approval, or verified structural engineering certification.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
