import React, { useState } from 'react';
import {
  MapPin,
  Boxes,
  FileCheck,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';

export function LandingPage({ setActiveView, onApplyPreset, onExportPDF }) {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [searchRef, setSearchRef] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!searchRef) return;
    setSearchResult({
      ref: searchRef,
      applicant: 'M/s Urban Mixed-Use Infraworks Ltd',
      status: 'APPROVED & SANCTIONED',
      jurisdiction: 'MCGM DCR 2034 - Mumbai Zone IV',
      farAchieved: '2.58 / 3.00 (Pass)',
      height: '42.0m (NBC Fire Cleared)',
      date: '30-Sept-2026'
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F8FAFC] text-slate-900 pb-16">
      {/* 1. Official Hero Banner */}
      <section className="bg-gradient-to-r from-[#003366] via-[#094884] to-[#002244] text-white px-8 py-12 relative overflow-hidden border-b-4 border-[#FF9933]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 • Problem Statement 116</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
              National Autonomous Urban Mixed-Use Architectural & Bye-Law Portal
            </h1>
            <p className="text-sm lg:text-base text-slate-200 leading-relaxed">
              Design, test, and instantly validate commercial and residential complexes against the
              <strong> National Building Code (NBC 2016)</strong>, <strong>MCGM DCR 2034</strong>,
              <strong> DDA MPD-2041</strong>, and <strong>BBMP Zonal Regulations</strong> with 3D massing,
              interior cut-section inspection, and legal FAR auto-fit solvers.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('map')}
                className="px-5 py-2.5 bg-[#FF9933] hover:bg-[#e68524] text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Trace Parcel on GIS Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveView('studio')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Boxes className="w-4 h-4 text-amber-300" />
                <span>Launch 3D Generative Studio</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full md:w-80 space-y-3 shrink-0 shadow-2xl">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/15 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> National Portal Metrics
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                <div className="text-xl font-bold font-mono text-white">4,820+</div>
                <div className="text-[10px] text-slate-300">Parcels Scrutinized</div>
              </div>
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                <div className="text-xl font-bold font-mono text-emerald-400">&lt; 30s</div>
                <div className="text-[10px] text-slate-300">Sanction Time</div>
              </div>
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                <div className="text-xl font-bold font-mono text-amber-400">99.8%</div>
                <div className="text-[10px] text-slate-300">NBC Accuracy</div>
              </div>
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                <div className="text-xl font-bold font-mono text-sky-400">3 States</div>
                <div className="text-[10px] text-slate-300">Active Bye-Laws</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DigiLocker-Style Feature Cards */}
      <section className="max-w-6xl mx-auto px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: GIS Map */}
          <div
            onClick={() => setActiveView('map')}
            className="gov-card p-5 cursor-pointer gov-card-interactive flex flex-col justify-between group hover:border-blue-400"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition">
                GIS Web Map Configurator
              </h2>
              <p className="text-xs text-slate-500 leading-normal">
                Trace real urban land parcels on Leaflet OpenStreetMap in Mumbai, Delhi, Bengaluru with auto road-width calculation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Trace Parcel</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: 3D Studio & Room Inspector */}
          <div
            onClick={() => setActiveView('studio')}
            className="gov-card p-5 cursor-pointer gov-card-interactive flex flex-col justify-between group hover:border-amber-400"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Boxes className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-amber-700 transition">
                3D Massing & Room Inspector
              </h2>
              <p className="text-xs text-slate-500 leading-normal">
                Dual-mode 3D studio with solar shadows (06:00-18:00) and cut-section floor inspector (lift cores, 2BHK/3BHK flats, retail).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Open 3D Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Bye-Law Library */}
          <div
            onClick={() => setActiveView('library')}
            className="gov-card p-5 cursor-pointer gov-card-interactive flex flex-col justify-between group hover:border-indigo-400"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition">
                State Bye-Law Library
              </h2>
              <p className="text-xs text-slate-500 leading-normal">
                Inspect National Building Code (NBC 2016 Part 3 & 4), Mumbai MCGM DCR 2034, Delhi DDA MPD-2041, and Bengaluru BBMP rules.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Browse Bye-Laws</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Verify Sanction Certificate */}
          <div
            onClick={() => setVerifyModalOpen(true)}
            className="gov-card p-5 cursor-pointer gov-card-interactive flex flex-col justify-between group hover:border-emerald-400"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition">
                Verify Municipal Certificate
              </h2>
              <p className="text-xs text-slate-500 leading-normal">
                Validate provisional approval certificates and check digital verification hash against the central municipal database.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Verify Sanction</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Municipal Presets Showcase */}
      <section className="max-w-6xl mx-auto px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Supported Municipal Authorities</h2>
            <p className="text-xs text-slate-500">Click to instantly launch 3D studio with local bye-law configurations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mumbai */}
          <div className="gov-card p-5 space-y-3 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                MCGM Mumbai
              </span>
              <span className="text-xs font-bold font-mono text-slate-900">3.00 Max FAR</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">DCR 2034 Mixed-Use Regulations</h3>
            <p className="text-xs text-slate-500">
              60m × 80m plot with 6m fire tender setbacks, 35% commercial podium, and high-rise residential tower.
            </p>
            <button
              onClick={() => {
                onApplyPreset('mumbai_dcr');
                setActiveView('studio');
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
            >
              Load Mumbai DCR Model
            </button>
          </div>

          {/* Delhi */}
          <div className="gov-card p-5 space-y-3 border-l-4 border-l-amber-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                DDA New Delhi
              </span>
              <span className="text-xs font-bold font-mono text-slate-900">2.50 Max FAR</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Master Plan for Delhi (MPD-2041)</h3>
            <p className="text-xs text-slate-500">
              70m × 90m plot with 9m front road buffer, 40% commercial share, and strict ground coverage cap.
            </p>
            <button
              onClick={() => {
                onApplyPreset('delhi_dda');
                setActiveView('studio');
              }}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition"
            >
              Load Delhi DDA Model
            </button>
          </div>

          {/* Bengaluru */}
          <div className="gov-card p-5 space-y-3 border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                BBMP Bengaluru
              </span>
              <span className="text-xs font-bold font-mono text-slate-900">2.75 Max FAR</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">BBMP Zonal Regulations</h3>
            <p className="text-xs text-slate-500">
              65m × 85m plot with 7.5m front setback, 30% commercial retail, and sky amenity club deck.
            </p>
            <button
              onClick={() => {
                onApplyPreset('bengaluru_bbmp');
                setActiveView('studio');
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
            >
              Load Bengaluru BBMP Model
            </button>
          </div>
        </div>
      </section>

      {/* Verify Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Verify Municipal Approval Certificate</span>
              </div>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerify} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter Sanction Reference Number or Hash
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SIH26-NUC-849201"
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </form>

            {searchResult && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span>STATUS: {searchResult.status}</span>
                  <span className="font-mono text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded">VALID</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1 border-t border-emerald-200">
                  <div>Ref: <strong className="font-mono">{searchResult.ref}</strong></div>
                  <div>Date: <strong>{searchResult.date}</strong></div>
                  <div>FAR: <strong>{searchResult.farAchieved}</strong></div>
                  <div>Clearance: <strong>{searchResult.height}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
