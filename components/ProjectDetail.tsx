
import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose, onPrev, onNext }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Prevent background scrolling when modal or lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  }, [project.images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  }, [project.images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) {
        if (e.key === 'Escape') onClose();
        return;
      }
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, onClose, nextImage, prevImage]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[100] overflow-y-auto animate-in slide-in-from-bottom duration-500">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-[110] bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="w-full px-6 md:px-12 lg:px-20 py-6 flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="flex items-center gap-3 text-[#888] hover:text-white transition-colors group"
          >
            <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
            </div>
            <span className="font-medium uppercase tracking-widest text-xs">Back to Projects</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onPrev} 
              className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
            <button 
              onClick={onNext} 
              className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20 min-h-screen">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Left Column: Project Info (Sticky) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32 h-fit">
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  <span className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 hover:bg-white hover:text-black transition-colors cursor-default">
                    {project.categoryLabel}
                  </span>
                  <h1 className="font-syne text-5xl md:text-7xl font-bold leading-none mb-8">{project.title}</h1>
                  <p className="text-[#888] text-lg leading-relaxed">{project.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-10 border-t border-white/10 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  <div>
                    <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-2">Client</p>
                    <p className="font-syne font-bold text-xl">{project.client}</p>
                  </div>
                  <div>
                    <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-2">Year</p>
                    <p className="font-syne font-bold text-xl">{project.year}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-3">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((s, idx) => (
                        <span 
                          key={idx}
                          className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-[#ccc] text-xs font-medium border border-white/5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Image Grid (Clickable) */}
            <div className="lg:col-span-7 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => openLightbox(idx)}
                      className={`
                        relative overflow-hidden rounded-[1.5rem] bg-[#161616] cursor-zoom-in group border border-white/5
                        ${idx === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/5]'}
                        animate-in fade-in slide-in-from-bottom-8 duration-700
                      `}
                      style={{ animationDelay: `${300 + (idx * 100)}ms` }}
                    >
                      <img 
                        src={img} 
                        alt={`${project.title} shot ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                             <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                           </svg>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-[160]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-6 w-12 h-12 hidden md:flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-[160]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>

          <div className="w-full h-full p-4 md:p-10 flex items-center justify-center">
            <img 
              src={project.images[currentImageIndex]} 
              alt={`${project.title} fullscreen`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-6 w-12 h-12 hidden md:flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-[160]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-syne font-bold tracking-widest">
            {currentImageIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
