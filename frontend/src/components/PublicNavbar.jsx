import React, { useState } from 'react';
import {
  Compass,
  Building2,
  FolderKanban,
  Sparkles,
  Plus,
  ArrowRight,
  Globe2,
  Menu,
  X
} from 'lucide-react';
import { translations } from '../utils/translations';

export function PublicNavbar({
  activePublicPage,
  setActivePublicPage,
  onOpenStudio,
  onOpenNewProjectWizard,
  onOpenMyProjects,
  savedProjectsCount = 0,
  lang = 'en',
  setLang,
  fontScale = 'md',
  setFontScale
}) {
  const t = translations[lang] || translations.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: lang === 'hi' ? 'होम' : 'Home' },
    { id: 'studio_preview', label: lang === 'hi' ? 'डिजाइन स्टूडियो' : 'Design Studio', action: onOpenStudio },
    { id: 'features', label: lang === 'hi' ? 'विशेषताएं' : 'Features' },
    { id: 'workflow', label: lang === 'hi' ? 'कार्यप्रणाली' : 'How It Works' },
    { id: 'projects', label: lang === 'hi' ? 'प्रोजेक्ट्स गैलरी' : 'Projects / Gallery' },
    { id: 'about', label: lang === 'hi' ? 'हमारे बारे में' : 'About' }
  ];

  const handleNavClick = (link) => {
    if (link.action) {
      link.action();
    } else {
      setActivePublicPage(link.id);
      // Smooth scroll if matching element exists on page
      const el = document.getElementById(link.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: INFERNO Brand Logo */}
        <div
          onClick={() => setActivePublicPage('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 flex items-center justify-center text-white shadow-sm shadow-orange-900/10 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-slate-900">
                INFERNO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-amber-800 border border-slate-200 font-semibold">
                SIH 2026 PS 116
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {lang === 'hi' ? 'इंटेलिजेंट मिक्स्ड-यूज़ अर्बन डिज़ाइन स्टूडियो' : 'Intelligent Mixed-Use Urban Design Studio'}
            </p>
          </div>
        </div>

        {/* Center: Clean Public Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePublicPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'text-orange-700 bg-orange-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Language & Accessibility, CTAs */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs">
            <Globe2 className="w-3.5 h-3.5 text-orange-700 mr-1.5" />
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded font-semibold transition cursor-pointer ${
                lang === 'en' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <span className="text-slate-300 mx-1">|</span>
            <button
              onClick={() => setLang('hi')}
              className={`px-1.5 py-0.5 rounded font-semibold transition cursor-pointer ${
                lang === 'hi' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Font Scaler (A-, A, A+) */}
          <div className="hidden md:flex items-center bg-slate-100 px-1.5 py-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => setFontScale('sm')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                fontScale === 'sm' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="A- font scale"
            >
              A−
            </button>
            <button
              onClick={() => setFontScale('md')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                fontScale === 'md' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="A standard font scale"
            >
              A
            </button>
            <button
              onClick={() => setFontScale('lg')}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                fontScale === 'lg' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="A+ font scale"
            >
              A+
            </button>
          </div>

          {/* My Projects Library Button */}
          <button
            onClick={onOpenMyProjects}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer"
            title="Browse saved projects"
          >
            <FolderKanban className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'hi' ? 'मेरे प्रोजेक्ट्स' : 'My Projects'}</span>
            {savedProjectsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-orange-100 text-orange-800 rounded-full text-[10px] font-bold">
                {savedProjectsCount}
              </span>
            )}
          </button>

          {/* Primary Action CTA: "+ Start a New Project" */}
          <button
            onClick={onOpenNewProjectWizard}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-700 hover:bg-orange-800 active:scale-98 text-white text-xs font-bold rounded-lg shadow-sm shadow-orange-900/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              {lang === 'hi' ? 'नया प्रोजेक्ट शुरू करें' : 'Start a New Project'}
            </span>
            <span className="sm:hidden">New Project</span>
            <ArrowRight className="w-3.5 h-3.5 hidden md:inline ml-0.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenMyProjects();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            >
              <FolderKanban className="w-4 h-4 text-orange-700" />
              <span>My Projects ({savedProjectsCount})</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="text-xs px-2 py-1 bg-slate-100 rounded font-semibold text-orange-700"
              >
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
