import React from 'react';
import { HistoryItem, HeadshotStyleId } from '../types';
import { HEADSHOT_STYLES } from '../constants';

interface GalleryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  const getStyleName = (id: HeadshotStyleId) => {
    return HEADSHOT_STYLES.find(s => s.id === id)?.name || id;
  };

  return (
    <div className="w-full mt-12 pt-10 border-t border-stone-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-serif font-bold text-stone-900">Archive</h3>
        <button 
          onClick={onClear}
          className="text-xs font-bold uppercase tracking-wider text-red-800 hover:text-red-600 transition-colors"
        >
          Clear History
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group relative aspect-[3/4] overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all border border-stone-200 bg-white"
            onClick={() => onSelect(item)}
          >
            <img 
              src={item.generatedImage} 
              alt="Generated Headshot" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/95 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="block text-stone-900 text-xs font-bold uppercase tracking-wider">{getStyleName(item.styleId)}</span>
              <span className="block text-stone-500 text-[10px] mt-1">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;