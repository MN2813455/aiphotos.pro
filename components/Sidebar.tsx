import React from 'react';
import { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onGoHome: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onCreateProject, 
  onGoHome,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-[#FDFCF8] border-r border-stone-200 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-stone-100 cursor-pointer" onClick={onGoHome}>
          <div className="w-8 h-8 bg-stone-900 rounded-none flex items-center justify-center text-stone-50 font-serif font-bold text-lg mr-3 shadow-sm">
            Ai
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">aiphotos.pro</h1>
        </div>

        {/* Main Actions */}
        <div className="p-6">
          <button 
            onClick={() => { onCreateProject(); onClose(); }}
            className="w-full flex items-center justify-center space-x-2 bg-stone-900 text-stone-50 py-3 rounded-none font-medium hover:bg-stone-800 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="font-serif">New Shoot</span>
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4 px-2 font-sans">Recent Projects</h3>
          <div className="space-y-1">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => { onSelectProject(project); onClose(); }}
                className={`w-full flex items-center px-3 py-3 rounded-none text-sm transition-all border-l-2
                  ${activeProjectId === project.id 
                    ? 'border-stone-900 bg-stone-100 text-stone-900 font-medium' 
                    : 'border-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
              >
                <span className="truncate text-left flex-1 font-sans">{project.name}</span>
                <span className="text-xs text-stone-400 ml-2">{project.images.length}</span>
              </button>
            ))}
            {projects.length === 0 && (
              <p className="px-3 text-sm text-stone-400 italic font-serif">No projects yet.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-100">
          <div className="flex items-center text-sm text-stone-500">
            <div className="w-8 h-8 rounded-full bg-stone-200 mr-3 flex items-center justify-center text-stone-700 font-serif font-bold text-xs">
              P
            </div>
            <div>
              <p className="text-stone-900 font-medium font-serif">Pro Studio</p>
              <p className="text-xs">Unlimited</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;