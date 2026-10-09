import React from 'react';
import {
  Flame,
  LayoutDashboard,
  PlusCircle,
  Boxes,
  Compass,
  TreePine,
  SunMedium,
  BarChart3,
  SlidersHorizontal,
  BookOpen,
  Presentation,
  FileDown,
  Globe2,
  MapPin
} from 'lucide-react';
import { translations } from '../utils/translations';

export function AppHeader({
  activeView,
  setActiveView,
  lang,
  setLang,
  fontScale,
  setFontScale,
  onExportPDF,
  onExportDXF,
  isExporting
}) {
  const t = translations[lang] || translations.en;

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'new_project', label: t.navNewProject, icon: PlusCircle },
    { id: 'studio', label: t.navStudio, icon: Boxes },
    { id: 'floor_plan', label: t.navFloorPlans, icon: Compass },
    { id: 'courtyard', label: t.navCourtyard, icon: TreePine },
    { id: 'facade', label: t.navFacade, icon: SunMedium },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
    { id: 'optimizer', label: t.navOptimizer, icon: SlidersHorizontal },
    { id: 'library', label: t.navLibrary, icon: BookOpen },
    { id: 'presentation', label: t.navPresentation, icon: Presentation },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-5 py-2.5 flex items-center justify-between shrink-0 select-none shadow-md z-30">
      {/* 1. Left: INFERNO Brand */}
      <div
        onClick={() => setActiveView('dashboard')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-950/40 group-hover:scale-105 transition">
          <Flame className="w-4 h-4 fill-amber-200 text-amber-100" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-wider text-white">
              INFERNO
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
              SIH 2026 PS 116
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {t.brandTagline}
          </p>
        </div>
      </div>

      {/* 2. Center: Primary Architectural Navigation */}
      <nav className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400/80'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Right: Language & Text Size Accessibility + Export Actions */}
      <div className="flex items-center gap-3 text-xs">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
          <Globe2 className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
          <button
            onClick={() => setLang('en')}
            className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
              lang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <span className="text-slate-600 mx-1">|</span>
          <button
            onClick={() => setLang('hi')}
            className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
              lang === 'hi' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Global Font Scaler (A-, A, A+) */}
        <div className="flex items-center bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
          <button
            onClick={() => setFontScale('sm')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              fontScale === 'sm' ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
            title="A- (0.9x font scale)"
          >
            A−
          </button>
          <button
            onClick={() => setFontScale('md')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              fontScale === 'md' ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
            title="A (Standard scale)"
          >
            A
          </button>
          <button
            onClick={() => setFontScale('lg')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              fontScale === 'lg' ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
            title="A+ (1.15x font scale)"
          >
            A+
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer"
            title="Export Architectural Design Report PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report (PDF)</span>
          </button>
          <button
            onClick={onExportDXF}
            disabled={isExporting}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition cursor-pointer disabled:opacity-50"
            title="Export AutoCAD DXF Drawing"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">CAD (.DXF)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
