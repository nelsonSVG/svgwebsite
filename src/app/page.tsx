'use client';

import React, { useState, useEffect } from 'react';
import { ProjectCategory, Project, Service, Testimonial } from '@/lib/types';
import { PROJECTS, SERVICES, TESTIMONIALS } from '@/lib/constants';
import ProjectDetail from '@/components/ProjectDetail';
import Assistant from '@/components/Assistant';

// --- CONFIGURATION ---
const INSTAGRAM_TOKEN = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN || "";

interface NavLinkProps {
  href: string;
  children?: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile = false, onClick }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (onClick) onClick();

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleScroll}
      className={`
        ${mobile ? 'text-4xl font-syne font-bold' : 'text-sm font-medium tracking-wide uppercase hover-underline-animation'}
        transition-colors cursor-pointer
      `}
    >
      {children}
    </a>
  );
};

// --- CMS CONFIGURATION ---
const ICON_MAP: Record<string, React.ReactNode> = {
  'layout': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2"></rect>
      <path d="M8 21h8M12 17v4"></path>
    </svg>
  ),
  'pen-tool': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    </svg>
  ),
  'smartphone': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2"></rect>
      <path d="M12 18h.01"></path>
    </svg>
  ),
  'git-merge': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  ),
  'layers': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
    </svg>
  ),
  'cpu': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
      <path d="M12 12L2.5 7"></path>
      <path d="M12 12l9.5-5"></path>
    </svg>
  ),
  'default': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  )
};

interface InstagramPost {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(ProjectCategory.ALL);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // --- DATA STATE ---
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
  const [instagramFeed, setInstagramFeed] = useState<InstagramPost[]>([]);

  useEffect(() => {
    // Load CMS Data
    setProjectsData(PROJECTS);
    setServicesData(SERVICES);
    setTestimonialsData(TESTIMONIALS);

    // Fetch Instagram Data via our own API Proxy (which handles auto-refresh)
    const fetchInstagram = async () => {
      try {
        const response = await fetch('/api/instagram');
        const data = await response.json();
        
        if (data && data.data && data.data.length > 0) {
          setInstagramFeed(data.data);
        } else {
          // Fallback to placeholder images if API fails or no token
          console.warn("Instagram API returned no data, using placeholders");
          const placeholders = Array.from({ length: 8 }, (_, i) => ({
            id: `demo-${i}`,
            media_url: `https://picsum.photos/seed/insta${i + 10}/600/600`,
            permalink: 'https://www.instagram.com/svg.visual/',
            media_type: 'IMAGE' as const
          }));
          setInstagramFeed(placeholders);
        }
      } catch (error) {
        console.error("Failed to fetch Instagram feed", error);
      }
    };

    fetchInstagram();
  }, []);

  const filteredProjects = activeCategory === ProjectCategory.ALL 
    ? projectsData 
    : projectsData.filter(p => p.category === activeCategory);

  const selectedProject = projectsData.find(p => p.id === selectedProjectId);

  const handlePrevProject = () => {
    if (!selectedProjectId) return;
    const currentIndex = projectsData.findIndex(p => p.id === selectedProjectId);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : projectsData.length - 1;
    setSelectedProjectId(projectsData[prevIndex].id);
  };

  const handleNextProject = () => {
    if (!selectedProjectId) return;
    const currentIndex = projectsData.findIndex(p => p.id === selectedProjectId);
    const nextIndex = currentIndex < projectsData.length - 1 ? currentIndex + 1 : 0;
    setSelectedProjectId(projectsData[nextIndex].id);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setTimeout(() => setIsFormSubmitted(false), 5000);
  };

  // Avatar Image URL
  const avatarUrl = "https://picsum.photos/seed/nelsonface/200/200";

  // Prepare feed for marquee (double it for smooth loop)
  const marqueeFeed = instagramFeed.length > 0 ? [...instagramFeed, ...instagramFeed] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="w-full px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group" onClick={(e) => {
             e.preventDefault();
             window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="font-syne text-black text-xl font-bold">S</span>
            </div>
            <span className="hidden sm:inline font-syne text-xl font-bold tracking-tight">SVG Visual</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-10">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
          
          <div className="hidden md:flex items-center gap-5">
            <a 
              href="https://www.instagram.com/svg.visual/" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="1.5"></circle>
              </svg>
            </a>
            <button 
              onClick={() => setIsAssistantOpen(true)}
              className="bg-white text-black px-7 py-2.5 rounded-full text-sm font-bold hover:bg-[#e0e0e0] transition-colors transform hover:-translate-y-0.5"
            >
              Let&apos;s Talk
            </button>
          </div>
          
          <button 
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[70]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <NavLink mobile href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</NavLink>
        <NavLink mobile href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</NavLink>
        <NavLink mobile href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
        <NavLink mobile href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
        <button 
          onClick={() => { setIsAssistantOpen(true); setIsMobileMenuOpen(false); }}
          className="mt-8 bg-white text-black px-10 py-4 rounded-full font-bold text-xl"
        >
          Let&apos;s Talk
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="min-h-screen flex flex-col justify-center px-6 pt-20 relative overflow-hidden">
        {/* Abstract background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto text-center z-10">
          <span className="inline-block text-[#888] text-xs font-bold tracking-[0.3em] uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">Digital Design Agency</span>
          <h1 className="font-syne text-5xl md:text-7xl lg:text-9xl font-bold leading-[1.05] mb-12 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            We craft digital <br className="hidden md:block"/> experiences that matter.
          </h1>
          <p className="text-[#888] text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            SVG Visual is a boutique studio specializing in web design, branding, and user experiences that propel your brand into the future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <a 
              href="#projects" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300"
            >
              Explore Work
            </a>
            <button 
              onClick={() => setIsAssistantOpen(true)}
              className="w-full sm:w-auto border border-white/20 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-black hover:border-white transition-all duration-300"
            >
              Start Project
            </button>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-32 border-t border-white/5 bg-[#0e0e0e]">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="mb-24 md:flex md:items-end md:justify-between">
            <div>
              <span className="text-[#888] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Our Expertise</span>
              <h2 className="font-syne text-4xl md:text-6xl font-bold">What We Do</h2>
            </div>
            <p className="text-[#666] max-w-sm mt-6 md:mt-0 text-right hidden md:block">
              Comprehensive design solutions tailored for ambitious brands.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {servicesData.map((service, index) => (
              <div 
                key={service.id} 
                className="group bg-[#161616] p-10 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-14 h-14 bg-[#222] group-hover:bg-white group-hover:text-black rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500">
                  {ICON_MAP[service.iconName] || ICON_MAP['default']}
                </div>
                <h3 className="font-syne text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-[#888] text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-32">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="flex flex-col items-center mb-20">
            <span className="text-[#888] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Portfolio</span>
            <h2 className="font-syne text-4xl md:text-6xl font-bold mb-12">Selected Works</h2>
            
            <div className="flex flex-wrap justify-center gap-8">
              {Object.values(ProjectCategory).map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    text-sm font-bold uppercase tracking-widest transition-all duration-300 relative pb-2
                    ${activeCategory === cat ? 'text-white' : 'text-[#444] hover:text-[#888]'}
                  `}
                >
                  {cat === ProjectCategory.ALL ? 'All Work' : cat.replace('uiux', 'UI/UX')}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform duration-300 origin-left ${activeCategory === cat ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedProjectId(project.id)}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#161616] mb-8 border border-white/10 relative">
                  {/* Image 1 (Default) */}
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Image 2 (Hover Reveal) */}
                  <img 
                    src={project.images[1]} 
                    alt={`${project.title} alternate`} 
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17"></path>
                    </svg>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[#888] text-xs font-bold tracking-widest uppercase">{project.categoryLabel}</span>
                    <div className="h-px w-8 bg-[#333]"></div>
                    <span className="text-[#888] text-xs">{project.year}</span>
                  </div>
                  <h3 className="font-syne text-3xl font-bold mb-2 group-hover:underline decoration-1 underline-offset-4">{project.title}</h3>
                  <p className="text-[#666] text-sm line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INSTAGRAM FEED SECTION (REDESIGNED: Infinite Marquee) --- */}
      <section className="py-24 border-t border-white/5 bg-[#0e0e0e] overflow-hidden relative group">
        <div className="w-full px-6 md:px-12 lg:px-20 mb-12 flex justify-between items-end">
           <div>
             <span className="text-[#888] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Social Feed</span>
             <h2 className="font-syne text-4xl font-bold">@svg.visual</h2>
           </div>
           <a href="https://www.instagram.com/svg.visual/" target="_blank" className="hidden sm:inline-block px-6 py-3 border border-white/20 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all">
             Follow Us
           </a>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative w-full flex flex-col gap-6">
          {instagramFeed.length === 0 ? (
             <div className="w-full text-center py-10 text-[#555]">Loading Instagram Feed...</div>
          ) : (
            <>
              {/* Row 1: Left */}
              <div className="flex gap-6 w-max animate-marquee pause-on-hover">
                {marqueeFeed.map((post, i) => (
                  <a href={post.permalink} target="_blank" key={`row1-${post.id}-${i}`} className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group/card bg-[#111]">
                    <img 
                      src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} 
                      alt="Instagram Post" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100" 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <circle cx="17.5" cy="6.5" r="1.5"></circle>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
              
              {/* Row 2: Right (Reverse) */}
              <div className="flex gap-6 w-max animate-marquee-reverse pause-on-hover">
                {[...marqueeFeed].reverse().map((post, i) => (
                  <a href={post.permalink} target="_blank" key={`row2-${post.id}-${i}`} className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group/card bg-[#111]">
                    <img 
                      src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} 
                      alt="Instagram Post" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <circle cx="17.5" cy="6.5" r="1.5"></circle>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Gradients to fade edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0e0e0e] to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0e0e0e] to-transparent pointer-events-none z-10"></div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-32">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((t) => (
              <div key={t.id} className="bg-[#161616] p-10 rounded-[2rem] border border-white/5 relative">
                <div className="text-3xl text-white/20 font-serif absolute top-8 left-8">&ldquo;</div>
                <p className="text-[#ccc] text-lg italic mb-10 mt-6 leading-relaxed relative z-10">{t.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-syne font-bold text-black text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">{t.author}</h4>
                    <p className="text-[#666] text-xs uppercase tracking-wider mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-32 bg-[#0c0c0c] border-t border-white/5">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#161616] group">
               {/* Background mood image */}
               <img src="https://picsum.photos/seed/workspace_mood/1000/1000" className="w-full h-full object-cover opacity-40 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" alt="Workspace Mood" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
                  {/* Avatar inside small box */}
                  <div className="w-24 h-24 mb-6 bg-white rounded-2xl shadow-2xl p-1 overflow-hidden">
                    <img src={avatarUrl} alt="Nelson SVG Avatar" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <h3 className="font-syne text-4xl font-bold text-white mb-2">Nelson SVG</h3>
                  <p className="text-[#ccc] font-medium tracking-[0.2em] uppercase text-xs">Founder & Creative Director</p>
               </div>
            </div>
            
            <div className="lg:pl-10">
              <span className="text-[#888] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Meet the Founder</span>
              <h2 className="font-syne text-5xl md:text-7xl font-bold mb-10 leading-none">Building digital <br/>excellence since 2016.</h2>
              <p className="text-[#888] text-lg mb-8 leading-relaxed">
                I am Nelson SVG, and SVG Visual is my creative boutique studio. I believe that high-end design isn&apos;t just about aesthetics—it&apos;s about creating deep connections between brands and their audience.
              </p>
              <p className="text-[#888] text-lg mb-12 leading-relaxed">
                Our collaborative approach ensures that every project is unique and performance-driven, transforming vision into high-impact digital reality.
              </p>
              
              <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
                <div>
                  <p className="font-syne text-5xl font-bold mb-2 text-white">150+</p>
                  <p className="text-[#555] text-xs font-bold uppercase tracking-widest">Projects</p>
                </div>
                <div>
                  <p className="font-syne text-5xl font-bold mb-2 text-white">8+</p>
                  <p className="text-[#555] text-xs font-bold uppercase tracking-widest">Years</p>
                </div>
                <div>
                  <p className="font-syne text-5xl font-bold mb-2 text-white">50+</p>
                  <p className="text-[#555] text-xs font-bold uppercase tracking-widest">Clients</p>
                </div>
              </div>
              
              <div className="mt-12">
                 <a href="https://wa.me/573208647734" target="_blank" className="inline-flex items-center gap-3 text-white border-b border-white pb-1 hover:text-[#888] hover:border-[#888] transition-colors">
                   Chat on WhatsApp <span className="text-xl">&rarr;</span>
                 </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-32">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[#888] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Let&apos;s Connect</span>
              <h2 className="font-syne text-5xl md:text-7xl font-bold mb-10 leading-[0.9]">Start your next chapter.</h2>
              <p className="text-[#888] text-xl mb-12 max-w-md">
                Have a project in mind? We&apos;d love to hear your vision. Let&apos;s make it a digital reality.
              </p>
              
              <div className="space-y-10">
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#555] text-xs font-bold uppercase mb-1">Direct Line</p>
                    <a href="mailto:hi@svgvisual.com" className="text-2xl font-syne font-bold hover:text-[#888] transition-colors">hi@svgvisual.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white group-hover:border-[#25D366] transition-all duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#555] text-xs font-bold uppercase mb-1">WhatsApp</p>
                    <a href="https://wa.me/573208647734" target="_blank" className="text-2xl font-syne font-bold hover:text-[#888] transition-colors">+57 320 864 7734</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111] p-12 rounded-[2rem] border border-white/5 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              {isFormSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mb-8 shadow-xl">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-syne text-4xl font-bold mb-4">Inquiry Received.</h3>
                  <p className="text-[#888] text-lg">We&apos;ll review your project and get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase text-[#555] tracking-widest">Name</label>
                      <input required type="text" className="w-full bg-transparent border-b border-[#333] py-4 text-lg focus:outline-none focus:border-white transition-colors" placeholder="Full name" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase text-[#555] tracking-widest">Email</label>
                      <input required type="email" className="w-full bg-transparent border-b border-[#333] py-4 text-lg focus:outline-none focus:border-white transition-colors" placeholder="email@address.com" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-[#555] tracking-widest">Interest</label>
                    <input required type="text" className="w-full bg-transparent border-b border-[#333] py-4 text-lg focus:outline-none focus:border-white transition-colors" placeholder="Web Design, Branding, App..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-[#555] tracking-widest">Message</label>
                    <textarea required rows={4} className="w-full bg-transparent border-b border-[#333] py-4 text-lg focus:outline-none focus:border-white transition-colors resize-none" placeholder="Tell us about your goals..."></textarea>
                  </div>
                  <button className="w-full bg-white text-black py-5 rounded-full font-bold text-lg hover:bg-[#e0e0e0] transition-colors shadow-lg mt-4">
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 border-t border-white/5 bg-[#050505]">
        <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="font-syne text-black text-2xl font-bold">S</span>
            </div>
            <div>
               <span className="font-syne text-2xl font-bold block leading-none">SVG Visual</span>
               <span className="text-[#444] text-xs uppercase tracking-widest">Digital Design Agency</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/svg.visual/" target="_blank" className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="1.5"></circle>
              </svg>
            </a>
            <a href="https://wa.me/573208647734" target="_blank" className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:border-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="w-full px-6 md:px-12 lg:px-20 mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[#333] text-[10px] font-bold uppercase tracking-[0.5em]">© 2024 SVG Visual. Curated by Nelson SVG.</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <a 
        href="https://wa.me/573208647734" 
        target="_blank"
        className="fixed bottom-6 left-6 w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50 animate-bounce hover:animate-none"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
        </svg>
      </a>

      {/* Gemini Assistant */}
      <Assistant isOpen={isAssistantOpen} setIsOpen={setIsAssistantOpen} />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail 
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          onPrev={handlePrevProject}
          onNext={handleNextProject}
        />
      )}
    </div>
  );
}
