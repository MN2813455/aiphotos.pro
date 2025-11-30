import React from 'react';
import { HEADSHOT_STYLES } from '../constants';
import { HeadshotStyle, HeadshotStyleId } from '../types';

interface StyleSelectorProps {
  selectedStyleId: HeadshotStyleId | null;
  onSelectStyle: (style: HeadshotStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onSelectStyle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {HEADSHOT_STYLES.map((style) => (
        <div
          key={style.id}
          className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300
            ${selectedStyleId === style.id 
              ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50 transform scale-105 shadow-xl' 
              : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg'
            }`}
          onClick={() => onSelectStyle(style)}
        >
          {/* Image Container */}
          <div className="h-48 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
            <img 
              src={style.imageSrc} 
              alt={style.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {selectedStyleId === style.id && (
              <div className="absolute top-3 right-3 z-20 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-5 bg-white">
            <h3 className={`font-bold text-lg mb-2 ${selectedStyleId === style.id ? 'text-indigo-700' : 'text-gray-900'}`}>
              {style.name}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {style.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StyleSelector;
