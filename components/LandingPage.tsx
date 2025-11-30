
import React, { useState } from 'react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#FDFCF8] text-stone-900 min-h-screen font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-stone-200 px-6 py-4 fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-stone-900 flex items-center justify-center text-stone-50 font-serif font-bold text-lg mr-3">Ai</div>
            <span className="text-xl font-serif font-bold tracking-tight">aiphotos.pro</span>
          </div>
          
          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-stone-600 hover:text-stone-900 font-medium">Features</a>
            <a href="#showcase" className="text-stone-600 hover:text-stone-900 font-medium">Showcase</a>
            <button 
              onClick={onLoginClick}
              className="px-6 py-2 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors shadow-sm"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-stone-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-fade-in">
           <div className="flex flex-col space-y-6 text-center text-xl font-serif font-bold">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#showcase" onClick={() => setIsMobileMenuOpen(false)}>Showcase</a>
              <hr className="border-stone-100" />
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="py-3 bg-stone-900 text-white"
              >
                Sign In
              </button>
           </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 leading-tight">
          The Professional <br/> <span className="italic text-stone-500">AI Photo Studio</span>
        </h1>
        <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Create editorial-quality headshots, fashion lookbooks, and artistic portraits instantly. No camera required.
        </p>
        <button 
          onClick={onLoginClick}
          className="px-10 py-4 bg-stone-900 text-white text-lg font-serif hover:scale-105 transition-transform shadow-xl"
        >
          Start Your Photoshoot
        </button>

        {/* Hero Image Grid */}
        <div id="showcase" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto opacity-90">
           <img src="https://picsum.photos/id/1027/300/400" className="w-full h-64 object-cover rounded-none mt-12 shadow-lg" alt="Portrait" />
           <img src="https://picsum.photos/id/338/300/400" className="w-full h-64 object-cover rounded-none shadow-lg" alt="Fashion" />
           <img src="https://picsum.photos/id/64/300/400" className="w-full h-64 object-cover rounded-none mt-8 shadow-lg" alt="Editorial" />
           <img src="https://picsum.photos/id/177/300/400" className="w-full h-64 object-cover rounded-none mt-20 shadow-lg" alt="Travel" />
        </div>
      </section>

      {/* Features Section - "Start your sessions" */}
      <section id="features" className="py-24 bg-stone-100 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 bg-white shadow-sm border border-stone-100 hover:-translate-y-2 transition-transform duration-300">
             <div className="w-14 h-14 bg-stone-900 text-white flex items-center justify-center mb-6 shadow-md">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
             </div>
             <h3 className="text-2xl font-serif font-bold mb-3 text-stone-900">AI Headshots</h3>
             <p className="text-stone-600 font-light leading-relaxed">Turn casual selfies into polished LinkedIn or portfolio photos in seconds. Professional lighting and composition controls.</p>
          </div>
          <div className="p-8 bg-white shadow-sm border border-stone-100 hover:-translate-y-2 transition-transform duration-300">
             <div className="w-14 h-14 bg-stone-900 text-white flex items-center justify-center mb-6 shadow-md">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
             </div>
             <h3 className="text-2xl font-serif font-bold mb-3 text-stone-900">Virtual Try-On</h3>
             <p className="text-stone-600 font-light leading-relaxed">Upload a garment and see it on your model instantly with realistic physics. Perfect for fashion design and styling.</p>
          </div>
          <div className="p-8 bg-white shadow-sm border border-stone-100 hover:-translate-y-2 transition-transform duration-300">
             <div className="w-14 h-14 bg-stone-900 text-white flex items-center justify-center mb-6 shadow-md">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
             </div>
             <h3 className="text-2xl font-serif font-bold mb-3 text-stone-900">Global Locations</h3>
             <p className="text-stone-600 font-light leading-relaxed">Transport your subject to Paris, NYC, or a luxury studio without leaving your home. Unlimited background possibilities.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-6 text-center text-sm">
        <p>&copy; 2024 aiphotos.pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
