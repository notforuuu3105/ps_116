import React from 'react';
import {
  Building2,
  MapPin,
  Boxes,
  FileCheck2,
  FileDown,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Globe2,
  ShieldCheck
} from 'lucide-react';

export function GovHeader({
  activeView,
  setActiveView,
  fontScale,
  setFontScale,
  onExportDXF,
  onExportPDF,
  isExporting,
  metrics,
  compliance
}) {
  return (
    <header className="flex flex-col border-b border-slate-200 bg-white select-none z-30 shrink-0 shadow-sm">
      {/* 1. National Apex Header (Tiranga / MoHUA Bar) */}
      <div className="bg-[#003366] text-white px-6 py-1.5 flex items-center justify-between text-xs border-b-2 border-[#FF9933]">
        <div className="flex items-center gap-3">
          {/* Ashoka Chakra / National Seal Icon */}
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300 fill-current">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="12"
                  y1="12"
                  x2={12 + 9 * Math.cos((i * 30 * Math.PI) / 180)}
                  y2={12 + 9 * Math.sin((i * 30 * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
              ))}
            </svg>
          </div>
          <div>
            <div className="font-semibold tracking-wide flex items-center gap-2 text-[11px]">
              <span>भारत सरकार | Government of India</span>
              <span className="text-amber-400 font-mono text-[9px] px-1.5 py-0.2 bg-white/10 rounded">SIH 2026 PS 116</span>
            </div>
            <div className="text-[10px] text-slate-300">
              Ministry of Housing and Urban Affairs (MoHUA) • Smart Cities Mission
            </div>
          </div>
        </div>

        {/* Accessibility & Language Toolbar */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded border border-white/10">
            <span className="text-slate-300 mr-1 text-[10px]">Text Size:</span>
            <button
              onClick={() => setFontScale('sm')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/20 font-bold ${
                fontScale === 'sm' ? 'bg-amber-500 text-slate-950' : 'text-slate-200'
              }`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontScale('md')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/20 font-bold ${
                fontScale === 'md' ? 'bg-amber-500 text-slate-950' : 'text-slate-200'
              }`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontScale('lg')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/20 font-bold ${
                fontScale === 'lg' ? 'bg-amber-500 text-slate-950' : 'text-slate-200'
              }`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-slate-200">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium cursor-pointer hover:text-white">English / हिन्दी</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation & Quick Action Bar */}
      <div className="px-6 py-2.5 flex items-center justify-between bg-white">
        {/* Portal Brand */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003366] to-blue-700 flex items-center justify-center text-white shadow-md">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-900 transition">
                National Urban Mixed-Use Scrutiny Portal
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> NBC 2016 Compliant
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Autonomous Computational Massing, FSI Verification & GIS Parcel Scrutiny
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (DigiLocker Style) */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveView('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeView === 'home'
                ? 'bg-white text-[#003366] shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Portal Home</span>
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeView === 'map'
                ? 'bg-white text-[#003366] shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>GIS Map Parcel</span>
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeView === 'studio'
                ? 'bg-white text-[#003366] shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-amber-600" />
            <span>3D Massing & Room Studio</span>
          </button>
          <button
            onClick={() => setActiveView('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeView === 'library'
                ? 'bg-white text-[#003366] shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bye-Law Library</span>
          </button>
        </nav>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
            title="Download Official Municipal Clearance Certificate (PDF)"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-200" />
            <span>Govt Sanction (PDF)</span>
          </button>
          <button
            onClick={onExportDXF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-slate-100 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
            title="Download AutoCAD DXF CAD drawing"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            <span>CAD (.DXF)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
