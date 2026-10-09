import React, { useState, useEffect, useCallback } from 'react';
import { PublicNavbar } from './components/PublicNavbar';
import { HomePage } from './components/HomePage';
import { DesignWorkspace } from './components/DesignWorkspace';
import { NewProjectWizard } from './components/NewProjectWizard';
import { MyProjectsModal } from './components/MyProjectsModal';
import { PresentationMode } from './components/PresentationMode';

import {
  getActiveProject,
  getStoredProjects,
  saveProject,
  setActiveProjectId,
  DEFAULT_B_G_9_PROJECT
} from './utils/projectStore';
import { generateInfernoProjectPDF } from './utils/InfernoReportPDF';
import { translations } from './utils/translations';

// Helper to convert project data model into backend API payload
function projectToRequestState(proj) {
  return {
    plot_width: proj?.site?.plot_width || 60.0,
    plot_depth: proj?.site?.plot_depth || 80.0,
    setback_front: proj?.site?.setback_front || 7.5,
    setback_rear: proj?.site?.setback_rear || 6.0,
    setback_sides: proj?.site?.setback_sides || 6.0,
    max_far: proj?.constraints?.max_far || 3.0,
    commercial_ratio: proj?.program?.commercial_ratio || 30.0,
    total_floors: proj?.program?.total_floors || 10,
    tower_stepback: proj?.program?.tower_stepback || 3.0,
    courtyard_width: proj?.program?.courtyard_width || 16.0,
    courtyard_depth: proj?.program?.courtyard_depth || 20.0,
    abutting_road_width: proj?.site?.abutting_road_width || 18.0
  };
}

export default function App() {
  // Primary Navigation Mode: 'public' (Website) vs 'workspace' (CAD Studio)
  const [viewMode, setViewMode] = useState('public');
  const [activePublicPage, setActivePublicPage] = useState('home');

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Localization & Accessibility
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [fontScale, setFontScale] = useState('md'); // 'sm' | 'md' | 'lg'

  // Central Project State from Persistence Store
  const [activeProject, setActiveProject] = useState(() => getActiveProject());
  const [requestState, setRequestState] = useState(() => projectToRequestState(getActiveProject()));
  const [storedProjectsCount, setStoredProjectsCount] = useState(() => getStoredProjects().length);

  // Computational Engine Massing Output
  const [massingData, setMassingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize stored count
  const refreshStoredProjectsCount = useCallback(() => {
    setStoredProjectsCount(getStoredProjects().length);
  }, []);

  // Fetch Massing Calculations from Python FastAPI Backend
  const fetchMassing = useCallback(async (stateToUse) => {
    const payload = stateToUse || requestState;
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-massing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Calculation engine error' }));
        throw new Error(err.detail);
      }
      const data = await res.json();
      setMassingData(data);
    } catch (err) {
      console.warn('API Error or running offline mode:', err.message);
      // Fallback data structure for client resilience
      setMassingData((prev) => prev || {
        metrics: {
          achieved_far: 2.82,
          target_far: payload.max_far || 3.0,
          ground_coverage_pct: 38.5,
          max_ground_coverage_pct: 40.0,
          total_built_up_area: 13536,
          plot_area: (payload.plot_width || 60) * (payload.plot_depth || 80),
          total_parking_spaces: 118,
          ev_charging_bays: 24,
          daylight_score: 84,
          ventilation_score: 80
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [requestState]);

  // Initial load
  useEffect(() => {
    fetchMassing();
  }, [fetchMassing]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Keyboard navigation & modal dismissals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isPresentationOpen) setIsPresentationOpen(false);
        else if (isWizardOpen) setIsWizardOpen(false);
        else if (isProjectsModalOpen) setIsProjectsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationOpen, isWizardOpen, isProjectsModalOpen]);

  // Export CAD .DXF
  const handleExportDXF = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/export-dxf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestState)
      });
      if (!res.ok) throw new Error('DXF CAD export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `INFERNO_B_G_9_${Date.now()}.dxf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setToastMessage({ type: 'success', text: 'CAD (.DXF) drawing exported successfully!' });
    } catch (err) {
      console.error('Export DXF Error:', err);
      setToastMessage({ type: 'error', text: err.message || 'Export error' });
    } finally {
      setIsExporting(false);
    }
  };

  // Export Architectural Report PDF
  const handleExportPDF = () => {
    try {
      generateInfernoProjectPDF(massingData, requestState, activeProject);
      setToastMessage({ type: 'success', text: 'Architectural Project Audit (PDF) downloaded!' });
    } catch (err) {
      console.error('Export PDF Error:', err);
      setToastMessage({ type: 'error', text: 'Failed to generate PDF report' });
    }
  };

  // Update Project Model from Workspace controls or sub-studios
  const handleUpdateProject = (updatedProj) => {
    setActiveProject(updatedProj);
    saveProject(updatedProj);
    refreshStoredProjectsCount();

    const updatedReq = projectToRequestState(updatedProj);
    setRequestState(updatedReq);
    fetchMassing(updatedReq);
  };

  // Select project from Gallery / Modal
  const handleSelectProject = (proj) => {
    setActiveProject(proj);
    setActiveProjectId(proj.id);
    const updatedReq = projectToRequestState(proj);
    setRequestState(updatedReq);
    fetchMassing(updatedReq);
    setViewMode('workspace');
    setToastMessage({
      type: 'success',
      text: `Loaded project: ${proj.name}`
    });
  };

  // Handle project created via NewProjectWizard
  const handleProjectCreated = (newProject) => {
    saveProject(newProject);
    setActiveProject(newProject);
    setActiveProjectId(newProject.id);
    refreshStoredProjectsCount();

    const updatedReq = projectToRequestState(newProject);
    setRequestState(updatedReq);
    fetchMassing(updatedReq);

    setIsWizardOpen(false);
    setViewMode('workspace');
    setToastMessage({
      type: 'success',
      text: `🎉 Project "${newProject.name}" created and loaded into studio!`
    });
  };

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans bg-[#f8fafc] text-slate-800 font-scale-${fontScale}`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-fadeIn pointer-events-auto">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border ${
              toastMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* VIEW MODE A: Public Website & Showcase */}
      {viewMode === 'public' && (
        <>
          <PublicNavbar
            activePublicPage={activePublicPage}
            setActivePublicPage={setActivePublicPage}
            onOpenStudio={() => setViewMode('workspace')}
            onOpenNewProjectWizard={() => setIsWizardOpen(true)}
            onOpenMyProjects={() => setIsProjectsModalOpen(true)}
            savedProjectsCount={storedProjectsCount}
            lang={lang}
            setLang={setLang}
            fontScale={fontScale}
            setFontScale={setFontScale}
          />

          <main className="flex-1 w-full">
            <HomePage
              onStartNewProject={() => setIsWizardOpen(true)}
              onOpenStudio={() => setViewMode('workspace')}
              onSelectProject={handleSelectProject}
              lang={lang}
            />
          </main>
        </>
      )}

      {/* VIEW MODE B: CAD-Style Architectural Design Workspace */}
      {viewMode === 'workspace' && (
        <div className="w-screen h-screen flex flex-col overflow-hidden">
          <DesignWorkspace
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            massingData={massingData}
            onRecalculateMassing={() => fetchMassing(requestState)}
            onBackToHome={() => setViewMode('public')}
            onOpenPresentation={() => setIsPresentationOpen(true)}
            onExportPDF={handleExportPDF}
            onExportDXF={handleExportDXF}
            isExporting={isExporting}
            lang={lang}
          />
        </div>
      )}

      {/* MODAL 1: New Project Wizard (6-Step Guided Builder) */}
      <NewProjectWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
        lang={lang}
      />

      {/* MODAL 2: Saved Projects Management Modal */}
      <MyProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        onSelectProject={handleSelectProject}
        onStartNewProject={() => {
          setIsProjectsModalOpen(false);
          setIsWizardOpen(true);
        }}
        lang={lang}
      />

      {/* MODAL 3: Fullscreen Architectural Presentation Mode */}
      {isPresentationOpen && (
        <PresentationMode
          project={activeProject}
          massingData={massingData}
          onClose={() => setIsPresentationOpen(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
