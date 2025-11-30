
import React, { useState } from 'react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name, description);
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md p-8 shadow-2xl relative z-10 border border-stone-200 animate-fade-in">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Project Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Editorial 2024"
              className="w-full p-3 border border-stone-300 focus:border-stone-900 outline-none transition-colors bg-stone-50"
              autoFocus
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief notes about this shoot..."
              className="w-full p-3 border border-stone-300 focus:border-stone-900 outline-none transition-colors bg-stone-50 h-24 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 text-stone-500 hover:text-stone-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-stone-900 text-white font-serif hover:bg-stone-800 shadow-md"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
