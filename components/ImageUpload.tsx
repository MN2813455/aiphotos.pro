import React, { useCallback, useState } from 'react';
import { UploadedImage } from '../types';

interface ImageUploadProps {
  onImageSelected: (image: UploadedImage) => void;
  selectedImage: UploadedImage | null;
  label?: string;
  subLabel?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelected, 
  selectedImage, 
  label = "Upload your photo", 
  subLabel = "Drag and drop or click to select",
  icon,
  compact = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    
    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large (Max 5MB).');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected({
        base64: result,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  // Unique ID for the input to support multiple instances
  const inputId = `fileInput-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="w-full h-full font-sans">
      <div
        className={`relative border border-dashed rounded-none transition-all duration-300 ease-in-out text-center cursor-pointer group h-full flex flex-col items-center justify-center
          ${isDragging 
            ? 'border-stone-800 bg-stone-50' 
            : selectedImage 
              ? 'border-green-800 bg-stone-50' 
              : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
          }
          ${compact ? 'p-4' : 'p-8'}
          `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <input
          type="file"
          id={inputId}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
        />

        {selectedImage ? (
          <div className="flex flex-col items-center w-full">
             <div className={`relative ${compact ? 'w-24 h-24' : 'w-48 h-48'} mb-4 rounded-none overflow-hidden shadow-sm border-2 border-white`}>
                <img 
                  src={selectedImage.previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
            </div>
            <p className="text-stone-800 font-medium text-lg font-serif">Ready</p>
            <p className="text-stone-500 text-xs mt-1">Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`${compact ? 'w-10 h-10' : 'w-16 h-16'} bg-stone-100 text-stone-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-stone-200 transition-colors`}>
              {icon || (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={`${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              )}
            </div>
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-serif font-medium text-stone-900`}>{label}</h3>
            {!compact && (
              <p className="text-stone-500 mt-2 max-w-sm text-sm font-light">
                {subLabel}
              </p>
            )}
          </div>
        )}
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-800 text-sm flex items-center border border-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;