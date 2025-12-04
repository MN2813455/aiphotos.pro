
import React, { useState, useEffect } from 'react';
import { GenerationResult, UploadedImage, PhotoConfiguration, EditorSettings } from '../types';

interface GeneratedResultProps {
  originalImage?: UploadedImage; // Make optional
  result: GenerationResult;
  config: PhotoConfiguration;
  onReset: () => void;
  onSave: () => void;
}

const GeneratedResult: React.FC<GeneratedResultProps> = ({ originalImage, result, config, onReset, onSave }) => {
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0
  });

  const [showOriginal, setShowOriginal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Reset saved state if result changes
  useEffect(() => {
    setIsSaved(false);
  }, [result]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `aiphotos-pro-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveClick = () => {
    onSave();
    setIsSaved(true);
  };

  const updateSetting = (key: keyof EditorSettings, value: number) => {
    setEditorSettings(prev => ({ ...prev, [key]: value }));
  };

  const filterStyle = {
    filter: `brightness(${editorSettings.brightness}%) contrast(${editorSettings.contrast}%) saturate(${editorSettings.saturation}%) grayscale(${editorSettings.grayscale}%) sepia(${editorSettings.sepia}%)`
  };

  // EXIF Simulation
  const getExifData = () => {
      // Simulate lens based on composition
      let lens = '50mm';
      let aperture = 'f/2.8';
      if(config.composition === 'close_up') { lens = '105mm'; aperture = 'f/2.8'; }
      if(config.composition === 'wide_shot') { lens = '35mm'; aperture = 'f/5.6'; }
      if(config.composition === 'center') { lens = '85mm'; aperture = 'f/1.8'; }
      if(config.composition === 'rule_of_thirds') { lens = '50mm'; aperture = 'f/2.0'; }

      return {
          camera: 'Canon EOS R5',
          lens: lens,
          aperture: aperture,
          iso: 'ISO 100',
          shutter: '1/200s'
      }
  }

  const exif = getExifData();

  return (
    <div className="animate-fade-in w-full">
      <div className="bg-white shadow-xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-6 md:p-8 bg-stone-50 border-b border-stone-100 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">Shoot Result</h2>
            <p className="text-stone-500 text-sm mt-1 font-light">
              {config.environment.replace(/_/g, ' ')} • {config.lighting.replace(/_/g, ' ')}
            </p>
          </div>
          <div className="flex space-x-3">
             <button
              onClick={onReset}
              className="px-6 py-2 bg-white text-stone-600 border border-stone-300 hover:bg-stone-50 hover:text-stone-900 font-medium transition-colors text-sm shadow-sm"
            >
              Edit Settings
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaved}
              className={`px-6 py-2 font-medium transition-all text-sm shadow-md flex items-center
                ${isSaved 
                  ? 'bg-green-700 text-white cursor-default' 
                  : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
            >
              {isSaved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Save to Project
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-stone-100 text-stone-900 border border-stone-200 hover:bg-stone-200 transition-colors rounded-none"
              title="Download Original"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l4.5-4.5m0 0l-4.5-4.5M12 3v13.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          
          {/* Main Viewer */}
          <div className="flex-1 bg-stone-100 relative flex items-center justify-center p-8 overflow-hidden">
             {/* Comparison Toggle - Only if original image exists */}
            {originalImage && (
                <div 
                className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer select-none border border-stone-200 hover:bg-white transition-colors"
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                >
                Hold to Compare
                </div>
            )}

            <div className="relative w-full max-w-lg shadow-2xl bg-white p-2">
               {showOriginal && originalImage ? (
                 <div className="relative aspect-[3/4]">
                   <img src={originalImage.previewUrl} className="w-full h-full object-cover" alt="Original" />
                   <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Original</div>
                 </div>
               ) : (
                 <div className="relative aspect-[3/4]" style={filterStyle}>
                   <img src={result.imageUrl} className="w-full h-full object-cover" alt="Generated" />
                 </div>
               )}
            </div>
            
            {/* EXIF Overlay on Image */}
            <div className="absolute bottom-6 left-8 text-[10px] uppercase tracking-widest text-stone-500 font-bold hidden md:block">
                 {exif.camera} <span className="mx-2">•</span> {exif.lens} <span className="mx-2">•</span> {exif.aperture} <span className="mx-2">•</span> {exif.iso}
            </div>
          </div>

          {/* Editor Panel */}
          <div className="w-full lg:w-80 bg-white border-l border-stone-200 p-6 flex flex-col z-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">Post-Process</h3>
            
            <div className="space-y-6 flex-1">
              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-600 font-medium">
                  <span>Brightness</span>
                  <span>{editorSettings.brightness}%</span>
                </div>
                <input 
                  type="range" min="50" max="150" value={editorSettings.brightness} 
                  onChange={(e) => updateSetting('brightness', Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-600 font-medium">
                  <span>Contrast</span>
                  <span>{editorSettings.contrast}%</span>
                </div>
                <input 
                  type="range" min="50" max="150" value={editorSettings.contrast} 
                  onChange={(e) => updateSetting('contrast', Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-600 font-medium">
                  <span>Saturation</span>
                  <span>{editorSettings.saturation}%</span>
                </div>
                <input 
                  type="range" min="0" max="200" value={editorSettings.saturation} 
                  onChange={(e) => updateSetting('saturation', Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <div className="flex justify-between text-xs text-stone-600 font-medium">
                  <span>B&W</span>
                  <span>{editorSettings.grayscale}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={editorSettings.grayscale} 
                  onChange={(e) => updateSetting('grayscale', Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

               {/* Sepia */}
               <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-600 font-medium">
                  <span>Sepia</span>
                  <span>{editorSettings.sepia}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={editorSettings.sepia} 
                  onChange={(e) => updateSetting('sepia', Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>
            </div>
            
            {/* Metadata Panel */}
            <div className="mt-8 pt-6 border-t border-stone-100">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Shot Metadata</h3>
               <div className="grid grid-cols-2 gap-y-2 text-xs text-stone-600">
                   <div className="text-stone-400">Lens</div>
                   <div>{exif.lens}</div>
                   <div className="text-stone-400">Aperture</div>
                   <div>{exif.aperture}</div>
                   <div className="text-stone-400">Lighting</div>
                   <div>{config.lighting.replace('_', ' ')}</div>
               </div>
            </div>

            <div className="pt-6">
               <button 
                onClick={() => setEditorSettings({ brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0 })}
                className="w-full py-2 text-xs text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-all uppercase tracking-widest font-bold"
               >
                 Reset Filters
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GeneratedResult;
