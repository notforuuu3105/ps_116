import React from 'react';
import { Flame, Mail, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';

export function AppFooter({ lang }) {
  const t = translations[lang] || translations.en;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 px-6 py-6 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-amber-200" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wide">
              INFERNO
            </div>
            <div className="text-[11px] text-slate-300">
              {t.brandTagline} • Design • Analyze • Optimize • Visualize
            </div>
          </div>
        </div>

        {/* Center: Contact & Student Innovation Notice */}
        <div className="text-center md:text-left space-y-0.5">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <a href="mailto:arpitmishra1966@gmail.com" className="hover:text-amber-300 font-mono text-[11px]">
              arpitmishra1966@gmail.com
            </a>
          </div>
          <div className="text-[10px] text-slate-400">
            {t.studentNote}
          </div>
        </div>

        {/* Right: Technical Disclaimer */}
        <div className="max-w-md text-[10px] text-slate-400 text-center md:text-right leading-tight border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
          {t.disclaimer}
        </div>
      </div>
    </footer>
  );
}
