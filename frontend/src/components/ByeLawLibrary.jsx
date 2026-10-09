import React, { useEffect, useState } from 'react';
import { BookOpen, ShieldCheck, Scale, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export function ByeLawLibrary() {
  const [libraryData, setLibraryData] = useState(null);
  const [selectedLaw, setSelectedLaw] = useState('nbc_2016');

  useEffect(() => {
    fetch('/api/bye-laws/library')
      .then((res) => res.json())
      .then((data) => setLibraryData(data))
      .catch((err) => console.error('Failed to load bye-laws:', err));
  }, []);

  const keys = libraryData ? Object.keys(libraryData) : [];
  const currentLaw = libraryData ? libraryData[selectedLaw] : null;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 p-8 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#003366] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">National & State Building Bye-Law Library</h1>
              <p className="text-xs text-slate-500">Official Standards Scrutinized by the Autonomous Computational Massing Engine</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> NBC 2016 Part 3 & 4
          </span>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Bye-Law Tabs */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Statutory Documents</div>
            {keys.map((k) => {
              const item = libraryData[k];
              const isSelected = selectedLaw === k;
              return (
                <button
                  key={k}
                  onClick={() => setSelectedLaw(k)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#003366] text-white border-[#003366] font-bold shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold leading-tight">{item.title}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                      {item.scope}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Clauses & Rules */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            {currentLaw ? (
              <>
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-[#003366]">{currentLaw.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{currentLaw.scope}</p>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">Enforced Verification Clauses:</div>
                  {currentLaw.key_clauses.map((clause, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-xs font-bold font-mono text-blue-700 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5" />
                        <span>{clause.clause}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{clause.rule}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Algorithmic Enforcement Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    All parameters calculated in the 3D Massing & Room Inspector Studio directly evaluate these legal clauses in real time.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400">Loading statutory library...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
