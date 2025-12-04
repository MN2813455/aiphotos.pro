
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Wizard from './components/Wizard';
import GeneratedResult from './components/GeneratedResult';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import CreateProjectModal from './components/CreateProjectModal';
import { Project, GeneratedImage, PhotoConfiguration, User } from './types';
import { getProjects, createProject, addImageToProject } from './services/projectService';
import { getCurrentUser, loginWithGoogle, logout } from './services/authService';
import { generateHeadshot } from './services/geminiService';
import { ENVIRONMENTS, LIGHTING_OPTIONS, COMPOSITION_OPTIONS } from './constants';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard' | 'project_detail' | 'wizard'>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Data State
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Store config for retake functionality
  const [editingConfig, setEditingConfig] = useState<PhotoConfiguration | undefined>(undefined);

  useEffect(() => {
    // Check auth status
    const existingUser = getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
      setProjects(getProjects());
      setCurrentView('dashboard');
    }
  }, []);

  // --- Auth Actions ---

  const handleLogin = async () => {
    try {
      const newUser = await loginWithGoogle();
      setUser(newUser);
      setProjects(getProjects());
      setCurrentView('dashboard');
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentView('landing');
    setActiveProject(null);
  };

  // --- Project Actions ---

  const handleCreateProjectClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateProjectConfirm = (name: string, description: string) => {
    const newProject = createProject(name, description);
    setProjects(getProjects());
    setActiveProject(newProject);
    setCurrentView('project_detail');
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setCurrentView('project_detail');
    setLastResult(null);
  };

  const handleStartShoot = () => {
    if (!activeProject) {
      setIsCreateModalOpen(true);
      return;
    }
    setEditingConfig(undefined); // Clear any previous edit state
    setCurrentView('wizard');
    setLastResult(null);
  };

  const handleEditSettings = () => {
    if (lastResult) {
      setEditingConfig(lastResult.config);
      setCurrentView('wizard');
      setLastResult(null);
    }
  };

  const constructPrompt = (config: PhotoConfiguration): string => {
    const env = ENVIRONMENTS.find(e => e.id === config.environment)?.prompt || '';
    const lightingBase = LIGHTING_OPTIONS.find(l => l.id === config.lighting)?.prompt || '';
    const comp = COMPOSITION_OPTIONS.find(c => c.id === config.composition)?.prompt || '';
    
    // Construct Lighting Detail Prompt
    const { direction, intensity, color } = config.lightingSettings;
    const lightingDetail = `Lighting source positioned from ${direction}, intensity is ${intensity}, color temperature is ${color.replace('_', ' ')}.`;

    let basePrompt = `Professional high-end photo generation. `;
    
    // Asset instructions
    const garments = config.assets.filter(a => a.type === 'garment');
    const backgrounds = config.assets.filter(a => a.type === 'background');
    const props = config.assets.filter(a => a.type === 'prop');
    
    if (garments.length > 0) {
      basePrompt += `CRITICAL: The subject MUST be wearing the garments provided in the asset list. Replace original clothing. `;
      garments.forEach((g, i) => {
          if(g.description) basePrompt += `Garment Note: ${g.description}. `;
      });
    }

    if (backgrounds.length > 0) {
      basePrompt += `Use the provided background asset as the reference for the setting. `;
    }

    if (props.length > 0) {
      basePrompt += `Integrate the provided prop assets into the scene naturally. `;
    }

    if (config.assetContext) basePrompt += `Asset details: ${config.assetContext}. `;
    
    basePrompt += `
    Environment Style: ${env}. ${config.environmentContext || ''}
    Lighting Setup: ${lightingBase}. ${lightingDetail}.
    Composition: ${comp}.
    Technical: High resolution, photorealistic, 8k, highly detailed, editorial quality.
    `;
    
    if (config.customPrompt) {
        basePrompt += `\nUSER INSTRUCTIONS: ${config.customPrompt}`;
    }

    return basePrompt;
  };

  const handleGenerate = async (config: PhotoConfiguration) => {
    if (config.assets.length === 0 || !activeProject) return;

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = constructPrompt(config);
      const batchSize = config.batchSize || 1;
      
      // Since Gemini doesn't natively support batch in one request easily with image assets structure, we loop.
      // In a production backend, this would be parallelized.
      for(let i=0; i<batchSize; i++) {
        const imageUrl = await generateHeadshot(config.assets, prompt);

        const newImage: GeneratedImage = {
          id: Date.now().toString() + Math.random().toString().slice(2,5),
          url: imageUrl,
          timestamp: Date.now(),
          config: config
        };

        // Autosave
        const updatedProject = addImageToProject(activeProject.id, newImage);
        if(updatedProject) {
            setProjects(getProjects());
            setActiveProject(updatedProject);
        }
        
        // Show last result
        setLastResult(newImage);
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Shoot failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResult = () => {
     // Autosave handles logic, this might be just visual confirmation or manual trigger if autosave disabled
  };

  // --- Views ---

  if (currentView === 'landing') {
    return <LandingPage onLoginClick={() => setCurrentView('auth')} />;
  }

  if (currentView === 'auth') {
    return <AuthPage onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
  }

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto py-12 px-6 lg:px-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-900">Studio Dashboard</h2>
          <p className="text-stone-500 mt-2 font-light text-lg">Welcome back, {user?.name}. Manage your active sessions.</p>
        </div>
        <button onClick={handleCreateProjectClick} className="bg-stone-900 text-stone-50 px-6 py-3 font-medium shadow-md hover:bg-stone-800 transition-all font-serif">
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
         <div className="text-center py-24 bg-white border border-stone-200 shadow-sm">
           <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
           </div>
           <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Your Studio is Empty</h3>
           <p className="text-stone-500 mb-8 font-light">Create a project to start your first professional photoshoot.</p>
           <button onClick={handleCreateProjectClick} className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-all uppercase tracking-widest text-sm">Create First Project</button>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} onClick={() => handleSelectProject(project)} className="group bg-white overflow-hidden border border-stone-200 hover:border-stone-900 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg">
              <div className="h-56 bg-stone-100 relative overflow-hidden">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  </div>
                )}
                <div className="absolute top-0 right-0 p-3">
                   <span className="bg-white/90 backdrop-blur text-stone-900 text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif font-bold text-xl text-stone-900 truncate">{project.name}</h3>
                <p className="text-stone-500 text-sm mt-1 truncate font-light">{project.description || "No description"}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{project.images.length} assets</span>
                  <span className="text-stone-900 text-sm font-medium border-b border-transparent group-hover:border-stone-900 transition-all">View Project &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProjectDetail = () => {
    if (!activeProject) return null;
    return (
      <div className="max-w-7xl mx-auto py-10 px-6 lg:px-12 animate-fade-in">
        {/* Breadcrumb / Header */}
        <div className="flex items-center mb-8 text-sm">
           <button onClick={() => setCurrentView('dashboard')} className="text-stone-400 hover:text-stone-900 transition-colors font-medium">Dashboard</button>
           <span className="mx-2 text-stone-300">/</span>
           <span className="text-stone-900 font-bold">{activeProject.name}</span>
        </div>

        <div className="flex justify-between items-end mb-10 border-b border-stone-200 pb-6">
           <div>
              <h2 className="text-4xl font-serif font-bold text-stone-900 mb-2">{activeProject.name}</h2>
              <p className="text-stone-500 font-light max-w-xl">{activeProject.description || "Project Gallery"}</p>
           </div>
           <button onClick={handleStartShoot} className="bg-stone-900 text-white px-8 py-3 font-serif font-medium shadow-lg hover:bg-stone-800 transition-all flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              New Session
           </button>
        </div>

        {activeProject.images.length === 0 ? (
          <div className="text-center py-32 bg-[#FDFCF8] rounded-none border-2 border-dashed border-stone-200">
             <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">Ready for the shoot?</h3>
             <p className="text-stone-500 mb-8 max-w-md mx-auto font-light">This project is empty. Start a new session to begin generating professional photos.</p>
             <button onClick={handleStartShoot} className="bg-stone-900 text-white px-8 py-3 font-medium shadow-md hover:scale-105 transition-transform">
                Start Photoshoot
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProject.images.map((img) => (
              <div key={img.id} className="group relative aspect-[3/4] cursor-pointer bg-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <img src={img.url} alt="Generated" className="w-full h-full object-cover" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4">
                   <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = img.url;
                        link.download = `aiphotos-${img.id}.png`;
                        link.click();
                      }} 
                      className="px-6 py-2 bg-white text-stone-900 font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-colors"
                   >
                     Download
                   </button>
                   <span className="text-white/80 text-[10px] uppercase tracking-widest font-medium">
                     {new Date(img.timestamp).toLocaleDateString()}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWizard = () => {
    if (lastResult) {
      // Find original subject for comparison if available
      const originalSubject = lastResult.config.assets.find(a => a.type === 'subject')?.image;
      
      return (
        <div className="max-w-5xl mx-auto py-8 px-4 lg:px-8">
           <GeneratedResult 
             originalImage={originalSubject} // Can be undefined
             result={{ imageUrl: lastResult.url, timestamp: lastResult.timestamp }}
             config={lastResult.config}
             onReset={handleEditSettings}
             onSave={handleSaveResult}
           />
        </div>
      )
    }

    return (
      <div className="py-10 px-4 lg:px-8">
         <div className="max-w-5xl mx-auto mb-6">
            <button onClick={() => setCurrentView('project_detail')} className="flex items-center text-stone-400 hover:text-stone-900 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
               <span className="text-sm font-medium uppercase tracking-wider">Cancel Shoot</span>
            </button>
         </div>
         <Wizard 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
            initialConfig={editingConfig}
         />
         {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-800 rounded-none text-center max-w-2xl mx-auto">
              <span className="font-bold mr-2">Error:</span> {error}
            </div>
         )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-900 font-sans selection:bg-stone-200">
      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateProjectConfirm} 
      />

      {/* Mobile Header (Only visible if logged in and not on landing/auth) */}
      {currentView !== 'landing' && currentView !== 'auth' && (
        <div className="lg:hidden h-16 flex items-center justify-between px-6 border-b border-stone-200 bg-[#FDFCF8] sticky top-0 z-30">
          <div className="flex items-center" onClick={() => setCurrentView('dashboard')}>
             <div className="w-8 h-8 bg-stone-900 flex items-center justify-center text-stone-50 font-serif font-bold text-lg mr-3">Ai</div>
             <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">aiphotos.pro</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-stone-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      )}

      {currentView !== 'landing' && currentView !== 'auth' ? (
        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            projects={projects} 
            activeProjectId={activeProject?.id || null} 
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProjectClick}
            onGoHome={() => setCurrentView('dashboard')}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 lg:ml-64 bg-[#FDFCF8] min-h-screen">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'project_detail' && renderProjectDetail()}
            {currentView === 'wizard' && renderWizard()}
          </div>
        </div>
      ) : (
        // Render Landing or Auth full screen
        <>
          {currentView === 'landing' && <LandingPage onLoginClick={() => setCurrentView('auth')} />}
          {currentView === 'auth' && <AuthPage onLogin={handleLogin} onBack={() => setCurrentView('landing')} />}
        </>
      )}
    </div>
  );
};

export default App;
