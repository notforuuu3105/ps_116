import React from 'react';
import {
  PlusCircle,
  Boxes,
  ArrowRight,
  Building,
  TreePine,
  SunMedium,
  Car,
  Leaf,
  Layers,
  Sparkles,
  Calendar,
  Compass,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { translations } from '../utils/translations';
import { sampleProjects } from '../utils/projectModel';

export function DashboardView({
  lang,
  setActiveView,
  onSelectProject,
  onNewProject
}) {
  const t = translations[lang] || translations.en;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 pb-16">
      {/* 1. Architectural Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 px-6 py-12 lg:py-16">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-xs font-semibold text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Smart India Hackathon 2026 • Team INFERNO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              INFERNO
              <span className="block text-xl sm:text-2xl font-bold text-amber-400 mt-1 font-sans">
                {t.brandTagline}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Create, visualize and optimize mixed-use buildings using interactive 3D massing,
              integrated floor planning, courtyard micro-climate analytics, and climate-responsive façade intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onNewProject}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.btnCreateProject}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveView('studio')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
              >
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>{t.btnOpenStudio}</span>
              </button>
            </div>
          </div>

          {/* Hero Concept Visualizer Card */}
          <div className="w-full lg:w-96 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Building className="w-4 h-4 text-amber-400" />
                <span>Prototype Specification</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                B + G + 9
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" /> Basement B1:
                </span>
                <span className="font-semibold text-slate-200">Parking + 20% EV Bays</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Ground & Podium:
                </span>
                <span className="font-semibold text-slate-200">Commercial Retail & Plaza</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Center:
                </span>
                <span className="font-semibold text-slate-200">Landscaped Light Courtyard</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> L3 – L8 Floors:
                </span>
                <span className="font-semibold text-slate-200">Residential 2BHK/3BHK</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-400" /> L9 Terrace:
                </span>
                <span className="font-semibold text-slate-200">Sky Amenities & Pool</span>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Standard Site: <strong>60m × 80m</strong></span>
              <span className="text-amber-400 font-mono font-bold">FAR: 2.82</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Architectural Design Workflow Ribbon */}
      <section className="border-b border-slate-800 bg-slate-900/50 py-4 px-6 select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs overflow-x-auto gap-4">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] shrink-0">
            Design Workflow:
          </span>
          {[
            { id: 'new_project', label: '1. Site & Program' },
            { id: 'studio', label: '2. 3D Massing' },
            { id: 'floor_plan', label: '3. Floor Planning' },
            { id: 'courtyard', label: '4. Central Courtyard' },
            { id: 'facade', label: '5. Façade Studio' },
            { id: 'analytics', label: '6. Environmental Analytics' },
            { id: 'optimizer', label: '7. Design Optimizer' },
            { id: 'presentation', label: '8. Presentation' }
          ].map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveView(step.id)}
              className="text-slate-400 hover:text-amber-400 font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{step.label}</span>
              {idx < 7 && <span className="text-slate-700">→</span>}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Project Management Dashboard */}
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-400" />
              <span>Project Studio Dashboard</span>
            </h2>
            <p className="text-xs text-slate-400">
              Active mixed-use architectural projects and parametric iterations
            </p>
          </div>

          <button
            onClick={onNewProject}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.btnCreateProject}</span>
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: New Project Callout */}
          <div
            onClick={onNewProject}
            className="border-2 border-dashed border-slate-800 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer group transition bg-slate-900/30 hover:bg-slate-900/60 min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-200 group-hover:text-amber-400 transition">
                Create New Design Project
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                Define plot dimensions, road right-of-way, mixed-use program and priorities.
              </p>
            </div>
          </div>

          {/* Existing Project Cards */}
          {sampleProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                if (onSelectProject) onSelectProject(p);
                setActiveView('studio');
              }}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between cursor-pointer group transition shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">
                    {p.configuration}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {p.lastModified}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition">
                    {p.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {p.dimensions}
                  </div>
                </div>

                {/* Performance Metrics Pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">FAR</div>
                    <div className="text-xs font-bold text-slate-200">{p.achieved_far.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Daylight</div>
                    <div className="text-xs font-bold text-amber-400">{p.daylight}/100</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Parking</div>
                    <div className="text-xs font-bold text-slate-200">{p.parking} bays</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                <span>Open in 3D Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
