import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Building2,
  Trash2,
  Copy,
  Plus,
  ArrowRight,
  X,
  Calendar,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import {
  getStoredProjects,
  deleteProject,
  duplicateProject,
  setActiveProjectId
} from '../utils/projectStore';

export function MyProjectsModal({
  isOpen,
  onClose,
  onSelectProject,
  onStartNewProject,
  lang = 'en'
}) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setProjects(getStoredProjects());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpen = (proj) => {
    setActiveProjectId(proj.id);
    onSelectProject(proj);
    onClose();
  };

  const handleDuplicate = (id) => {
    const cloned = duplicateProject(id);
    if (cloned) {
      setProjects(getStoredProjects());
    }
  };

  const handleDelete = (id) => {
    if (projects.length <= 1) {
      alert('Cannot delete the last remaining project.');
      return;
    }
    const updated = deleteProject(id);
    setProjects(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'hi' ? 'मेरे प्रोजेक्ट्स लाइब्रेरी' : 'My Projects Library'}
              </h2>
              <span className="text-xs text-slate-500">
                {projects.length} {lang === 'hi' ? 'सहेजे गए प्रोजेक्ट्स' : 'saved projects in workspace'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onStartNewProject();
              }}
              className="px-3 py-1.5 bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'नया प्रोजेक्ट' : 'New Project'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 text-xs">
          {projects.map((proj) => {
            const dateStr = new Date(proj.last_modified).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={proj.id}
                className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                      {proj.program.configuration}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {proj.city}, {proj.state}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {proj.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Site: <strong>{proj.site.plot_width}×{proj.site.plot_depth}m</strong></span>
                    <span>•</span>
                    <span>FAR: <strong>{proj.constraints.max_far}</strong></span>
                    <span>•</span>
                    <span>Parking: <strong>{proj.program.parking_capacity} bays</strong> ({proj.program.ev_charging_pct}% EV)</span>
                    <span>•</span>
                    <span className="text-slate-400">Updated: {dateStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDuplicate(proj.id)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                    title="Duplicate project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpen(proj)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
