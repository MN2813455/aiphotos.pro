
import React, { useState, useEffect } from 'react';
import { PhotoConfiguration, EnvironmentType, LightingType, Composition, Preset, PhotoAsset, AssetType, LightDirection } from '../types';
import { ENVIRONMENTS, LIGHTING_OPTIONS, COMPOSITION_OPTIONS, PRESETS } from '../constants';
import ImageUpload from './ImageUpload';

interface WizardProps {
  onGenerate: (config: PhotoConfiguration) => void;
  isGenerating: boolean;
  initialConfig?: PhotoConfiguration;
}

const Wizard: React.FC<WizardProps> = ({ onGenerate, isGenerating, initialConfig }) => {
  const [step, setStep] = useState(initialConfig ? 1 : 0); // Skip preset if editing
  const [config, setConfig] = useState<PhotoConfiguration>(initialConfig || {
    assets: [],
    environment: 'studio_grey',
    lighting: 'softbox',
    lightingSettings: {
        direction: 'front',
        intensity: 'natural',
        color: 'neutral'
    },
    composition: 'center',
    promptModifiers: [],
    customPrompt: '',
    batchSize: 1,
    assetContext: '',
    environmentContext: '',
    lightingContext: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const applyPreset = (preset: Preset) => {
    setConfig(prev => ({
      ...prev,
      ...preset.config
    }));
    setStep(1); 
  };

  const addAsset = (asset: PhotoAsset) => {
    setConfig(prev => ({
      ...prev,
      assets: [...prev.assets, asset]
    }));
  };

  const removeAsset = (id: string) => {
    setConfig(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== id)
    }));
  };

  const updateAssetDescription = (id: string, desc: string) => {
    setConfig(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === id ? { ...a, description: desc } : a)
    }));
  };

  const hasSubject = config.assets.some(a => a.type === 'subject');

  // Helper component for adding a new asset
  const AssetAdder = () => {
    const [type, setType] = useState<AssetType>('subject');
    const [mode, setMode] = useState<'upload' | 'text'>('upload');
    const [tempImage, setTempImage] = useState<any>(null);
    const [tempDesc, setTempDesc] = useState('');

    const handleAdd = () => {
        if (mode === 'upload' && tempImage) {
            addAsset({
                id: Date.now().toString(),
                image: tempImage,
                type: type,
                description: tempDesc
            });
            setTempImage(null);
            setTempDesc('');
        } else if (mode === 'text' && tempDesc.trim()) {
            addAsset({
                id: Date.now().toString(),
                type: type,
                description: tempDesc
            });
            setTempDesc('');
        }
        
        // Auto-advance logic for convenience
        if(type === 'subject') setType('garment');
    }

    return (
        <div className="border border-dashed border-stone-300 bg-stone-50 p-6 flex flex-col items-center justify-center text-center">
            
            {/* Input Mode Toggle */}
            <div className="flex space-x-4 mb-4 border-b border-stone-200 w-full justify-center pb-2">
                 <button 
                    onClick={() => setMode('upload')}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 ${mode === 'upload' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400'}`}
                 >
                    Upload Image
                 </button>
                 <button 
                    onClick={() => setMode('text')}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 ${mode === 'text' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400'}`}
                 >
                    Text Description
                 </button>
            </div>

            {/* Content Area */}
            <div className="w-full">
                {mode === 'upload' ? (
                     !tempImage ? (
                        <div className="w-full h-48 mb-4">
                           <ImageUpload 
                               selectedImage={null}
                               onImageSelected={setTempImage}
                               label="Upload Asset"
                               subLabel="Subject, Garment, Prop, etc"
                               compact={true}
                           />
                        </div>
                     ) : (
                       <div className="w-24 h-24 mx-auto mb-4 overflow-hidden shadow-sm border border-white relative group">
                           <img src={tempImage.previewUrl} className="w-full h-full object-cover" />
                           <button onClick={() => setTempImage(null)} className="absolute inset-0 bg-stone-900/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold">Change</button>
                       </div>
                     )
                ) : (
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto mb-3 flex items-center justify-center text-stone-500">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                        </div>
                        <p className="text-stone-500 text-xs italic mb-2">Describe the asset without an image.</p>
                    </div>
                )}

                {/* Type Selection */}
                <div className="mb-4 text-left">
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1">Asset Type</label>
                    <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value as AssetType)}
                        className="w-full p-2 bg-white border border-stone-300 text-stone-900 text-sm outline-none focus:border-stone-900"
                    >
                        <option value="subject">Main Subject (Person)</option>
                        <option value="garment">Garment (Try-On)</option>
                        <option value="background">Background Ref</option>
                        <option value="prop">Prop / Object</option>
                        <option value="reference">Style Reference</option>
                    </select>
                </div>

                {/* Description Input */}
                <div className="mb-4 text-left">
                     <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1">
                        {mode === 'text' ? 'Description (Required)' : 'Description (Optional)'}
                     </label>
                     <input 
                        type="text" 
                        placeholder={type === 'subject' ? "E.g. A young woman with red hair" : "E.g. Red silk dress"}
                        value={tempDesc}
                        onChange={(e) => setTempDesc(e.target.value)}
                        className="w-full p-2 border border-stone-300 focus:border-stone-900 outline-none bg-white text-sm"
                     />
                </div>

                <div className="flex space-x-2">
                    <button 
                        onClick={() => { setTempImage(null); setTempDesc(''); }} 
                        className="flex-1 py-2 text-stone-500 hover:text-stone-900 text-sm"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={handleAdd} 
                        disabled={(mode === 'upload' && !tempImage) || (mode === 'text' && !tempDesc.trim())}
                        className="flex-1 py-2 bg-stone-900 text-white hover:bg-stone-800 text-sm font-bold disabled:bg-stone-300 disabled:cursor-not-allowed"
                    >
                        Add to Scene
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // Visual Light Position Control
  const LightPositioner = () => {
    const directions: {id: LightDirection, label: string, col: string}[] = [
        { id: 'top-left', label: '↖', col: 'col-start-1 row-start-1' },
        { id: 'overhead', label: '↑', col: 'col-start-2 row-start-1' },
        { id: 'top-right', label: '↗', col: 'col-start-3 row-start-1' },
        { id: 'left', label: '←', col: 'col-start-1 row-start-2' },
        { id: 'front', label: '⊙', col: 'col-start-2 row-start-2' },
        { id: 'right', label: '→', col: 'col-start-3 row-start-2' },
        { id: 'bottom', label: '↓', col: 'col-start-2 row-start-3' },
        { id: 'back', label: 'Backlight', col: 'col-start-1 col-end-4 row-start-4' },
    ];

    return (
        <div className="bg-stone-100 p-4 rounded-lg inline-block">
            <div className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-2 text-center">Light Source Position</div>
            <div className="grid grid-cols-3 grid-rows-[50px_50px_50px_30px] gap-2 w-48 mx-auto">
                {directions.map(dir => (
                    <button
                        key={dir.id}
                        onClick={() => setConfig({
                            ...config,
                            lightingSettings: { ...config.lightingSettings, direction: dir.id }
                        })}
                        className={`
                            ${dir.col} flex items-center justify-center rounded-md border text-lg transition-all
                            ${config.lightingSettings.direction === dir.id 
                                ? 'bg-amber-400 border-amber-500 text-stone-900 shadow-md font-bold' 
                                : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-600'
                            }
                        `}
                        title={dir.id.replace('-', ' ')}
                    >
                        {dir.label}
                    </button>
                ))}
            </div>
            <div className="text-center mt-2 text-[10px] uppercase font-bold text-stone-400">
                Subject
            </div>
        </div>
    )
  }

  // Step 0: Presets
  if (step === 0) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Start Your Session</h2>
          <p className="text-stone-500 max-w-lg mx-auto font-light">Would you like to start with a curated template or build your scene from scratch?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRESETS.map(preset => (
            <div 
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="group cursor-pointer bg-white border border-stone-200 p-6 hover:border-stone-900 hover:shadow-lg transition-all duration-300"
            >
              <div className="h-40 bg-stone-100 mb-6 overflow-hidden relative">
                 {/* Preset Preview Image Placeholder or Actual Image if available */}
                 <div className="absolute inset-0 flex items-center justify-center text-stone-300 bg-stone-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /></svg>
                 </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-stone-600 transition-colors">{preset.name}</h3>
              <p className="text-stone-500 text-sm mt-3 leading-relaxed">{preset.description}</p>
              
              {/* Config Preview */}
              <div className="mt-4 pt-4 border-t border-stone-100 text-[10px] text-stone-400 uppercase tracking-wide flex justify-between">
                <span>{preset.config.environment?.replace('_', ' ')}</span>
                <span>{preset.config.lighting?.replace('_', ' ')}</span>
              </div>
            </div>
          ))}

          {/* Custom Option */}
          <div 
            onClick={() => setStep(1)}
            className="group cursor-pointer bg-stone-900 text-white p-6 hover:bg-stone-800 transition-all duration-300 flex flex-col justify-center items-center text-center"
          >
            <div className="w-16 h-16 rounded-full border border-stone-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </div>
            <h3 className="font-serif text-xl font-bold">Custom Setup</h3>
            <p className="text-stone-400 text-sm mt-3">Answer a few questions to design your shot.</p>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Cast & Assets
  if (step === 1) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="mb-8 text-center">
           <button onClick={() => setStep(0)} className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-2 hover:text-stone-900">
            &larr; Back to Start
           </button>
          <h2 className="text-3xl font-serif font-bold text-stone-900">Cast & Assets</h2>
          <p className="text-stone-500 mt-2 font-light">Describe or upload the subject and any other assets (garments, props).</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List of active assets */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">Active Scene Assets</h3>
                
                {config.assets.length === 0 ? (
                    <div className="p-8 text-center bg-white border border-stone-200 text-stone-400 font-light italic">
                        No assets added yet. Please add at least a main subject (Image or Description).
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {config.assets.map(asset => (
                            <div key={asset.id} className="flex bg-white border border-stone-200 p-3 shadow-sm hover:border-stone-400 transition-colors">
                                <div className="w-20 h-20 flex-shrink-0 bg-stone-100 mr-4 flex items-center justify-center">
                                    {asset.image ? (
                                        <img src={asset.image.previewUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-stone-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                asset.type === 'subject' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
                                            }`}>
                                                {asset.type}
                                            </span>
                                            <button onClick={() => removeAsset(asset.id)} className="text-stone-400 hover:text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                                            </button>
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder={asset.image ? "Description (e.g. Red silk dress)" : "Description of prompt..."}
                                            value={asset.description || ''}
                                            onChange={(e) => updateAssetDescription(asset.id, e.target.value)}
                                            className="w-full mt-2 text-sm border-b border-stone-200 focus:border-stone-900 outline-none pb-1 bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Step Context */}
                 <div className="mt-6">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Additional Context for Assets</label>
                    <textarea 
                        value={config.assetContext || ''}
                        onChange={(e) => setConfig({ ...config, assetContext: e.target.value })}
                        placeholder="E.g. The subject has blue eyes. The dress should fit loosely."
                        className="w-full h-20 p-3 mt-2 border border-stone-200 bg-stone-50 text-sm focus:border-stone-900 outline-none resize-none"
                    />
                </div>
            </div>

            {/* Uploader */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2 mb-4">Add Asset</h3>
                <AssetAdder />
            </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!hasSubject}
            className={`px-10 py-3 rounded-none font-serif font-medium transition-all ${
              hasSubject ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Next Question &rarr;
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Environment
  if (step === 2) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Where should the shoot take place?</h2>
          <p className="text-stone-500 mt-2 font-light">Select the atmosphere and setting for the background.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ENVIRONMENTS.map(env => (
            <div
              key={env.id}
              onClick={() => setConfig({ ...config, environment: env.id })}
              className={`cursor-pointer border p-5 transition-all duration-300 hover:shadow-md ${
                config.environment === env.id ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white hover:border-stone-400'
              }`}
            >
              <div className={`h-1 w-8 mb-4 ${config.environment === env.id ? 'bg-stone-900' : 'bg-stone-200'}`}></div>
              <h4 className="font-serif font-bold text-stone-900">{env.name}</h4>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">{env.description}</p>
            </div>
          ))}
        </div>

        {/* Environment Context */}
        <div className="mt-8">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Environment Details</label>
            <textarea 
                value={config.environmentContext || ''}
                onChange={(e) => setConfig({ ...config, environmentContext: e.target.value })}
                placeholder="E.g. It should look like a rainy day in London. Add some fog."
                className="w-full h-24 p-3 mt-2 border border-stone-200 bg-stone-50 text-sm focus:border-stone-900 outline-none resize-none"
            />
        </div>

        <div className="mt-10 flex justify-between">
          <button onClick={handleBack} className="text-stone-500 hover:text-stone-900 font-medium px-4">Back</button>
          <button onClick={handleNext} className="bg-stone-900 text-white px-8 py-3 rounded-none font-serif font-medium hover:bg-stone-800">
            Next Question &rarr;
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Lighting & Composition & Prompt
  if (step === 3) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Final Touches</h2>
          <p className="text-stone-500 mt-2 font-light">Define the mood, tech specs, and any specific details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Lighting Editor */}
            <div className="space-y-8">
                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-5 border-b border-stone-200 pb-2">Base Lighting Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {LIGHTING_OPTIONS.map(opt => (
                            <button
                            key={opt.id}
                            onClick={() => setConfig({ ...config, lighting: opt.id })}
                            className={`text-left p-3 border transition-all duration-300 ${
                                config.lighting === opt.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                            >
                            <div className="font-serif font-semibold text-sm">{opt.name}</div>
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="bg-white border border-stone-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-6">Real-time Lighting Editor</h3>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                         {/* Visual Positioner */}
                         <LightPositioner />

                         {/* Sliders */}
                         <div className="flex-1 space-y-6 w-full">
                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-2">
                                    <span>Intensity</span>
                                    <span>{config.lightingSettings.intensity}</span>
                                </div>
                                <input 
                                    type="range" min="0" max="4" step="1"
                                    value={['dim', 'soft', 'natural', 'hard', 'intense'].indexOf(config.lightingSettings.intensity)}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        lightingSettings: { 
                                            ...config.lightingSettings, 
                                            intensity: ['dim', 'soft', 'natural', 'hard', 'intense'][Number(e.target.value)] as any
                                        }
                                    })}
                                    className="w-full h-1 bg-stone-200 appearance-none rounded-lg cursor-pointer accent-stone-900"
                                />
                                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                                    <span>Dim</span>
                                    <span>Intense</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-2">
                                    <span>Temperature</span>
                                    <span>{config.lightingSettings.color.replace('_', ' ')}</span>
                                </div>
                                <select 
                                    value={config.lightingSettings.color}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        lightingSettings: {
                                            ...config.lightingSettings,
                                            color: e.target.value as any
                                        }
                                    })}
                                    className="w-full p-2 border border-stone-300 text-sm bg-white focus:border-stone-900 outline-none"
                                >
                                    <option value="warm">Warm (Golden)</option>
                                    <option value="neutral">Neutral (Daylight)</option>
                                    <option value="cool">Cool (Blueish)</option>
                                    <option value="neon_blue">Neon Blue</option>
                                    <option value="neon_pink">Neon Pink</option>
                                </select>
                            </div>
                         </div>
                    </div>
                 </div>
            </div>

            {/* Right Column: Composition & Prompt */}
            <div className="space-y-8">
                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-5 border-b border-stone-200 pb-2">Camera Composition</h3>
                    <div className="grid grid-cols-2 gap-3">
                    {COMPOSITION_OPTIONS.map(opt => (
                        <button
                        key={opt.id}
                        onClick={() => setConfig({ ...config, composition: opt.id })}
                        className={`text-left p-3 border transition-all duration-300 ${
                            config.composition === opt.id ? 'bg-stone-100 border-stone-400' : 'bg-white border-stone-200 hover:border-stone-400'
                        }`}
                        >
                        <div className="font-serif font-semibold text-stone-900 text-sm">{opt.name}</div>
                        <div className={`text-[10px] mt-1 text-stone-500 leading-tight`}>{opt.description}</div>
                        </button>
                    ))}
                    </div>
                </div>

                {/* Batch Size */}
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 border-b border-stone-200 pb-2">Batch Size</h3>
                   <div className="flex space-x-2">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => setConfig({ ...config, batchSize: num })}
                          className={`w-12 h-10 flex items-center justify-center font-bold text-sm border transition-all ${
                            (config.batchSize || 1) === num 
                            ? 'bg-stone-900 text-white border-stone-900' 
                            : 'bg-white text-stone-500 border-stone-200 hover:border-stone-900'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <span className="text-xs text-stone-400 flex items-center ml-2">images per generation</span>
                   </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-5 border-b border-stone-200 pb-2">Final Instructions</h3>
                    <textarea
                        value={config.customPrompt}
                        onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
                        placeholder="Any final details? (e.g. Ensure the tie is straight, cinematic film grain)"
                        className="w-full h-32 p-4 border border-stone-300 bg-stone-50 focus:border-stone-900 outline-none transition-colors font-light text-sm"
                    />
                </div>
            </div>
        </div>

        {/* Prompt Preview */}
        <div className="mt-8 pt-6 border-t border-stone-100">
             <div className="bg-stone-50 p-4 text-xs font-mono text-stone-500 border border-stone-200">
                 <strong className="block text-stone-900 mb-1 uppercase tracking-wider">Prompt Preview (System):</strong>
                 Environment: {config.environment} | Lighting: {config.lighting} ({config.lightingSettings.intensity}, {config.lightingSettings.color}) | Composition: {config.composition}
                 {config.customPrompt && ` | User Note: ${config.customPrompt}`}
             </div>
        </div>

        <div className="mt-12 flex justify-between items-center pb-20 pt-8">
          <button onClick={handleBack} className="text-stone-500 hover:text-stone-900 font-medium px-4">Back</button>
          
          <button
            onClick={() => onGenerate(config)}
            disabled={isGenerating}
            className={`
               px-12 py-4 rounded-none font-serif font-bold text-lg shadow-lg flex items-center space-x-3 transition-all
               ${isGenerating ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-stone-900 text-white hover:bg-stone-800 hover:shadow-xl'}
            `}
          >
            {isGenerating ? (
              <>
                 <svg className="animate-spin -ml-1 h-5 w-5 text-stone-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 <span>Processing Request...</span>
              </>
            ) : (
              <>
                <span>Start Photoshoot</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Wizard;
