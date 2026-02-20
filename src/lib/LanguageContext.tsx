'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.talk': "Let's Talk",
    'hero.agency': 'Digital Design Agency',
    'hero.title': 'We craft digital experiences that matter.',
    'hero.subtitle': 'SVG Visual is a boutique studio specializing in web design, branding, and user experiences that propel your brand into the future.',
    'hero.explore': 'Explore Work',
    'hero.start': 'Start Project',
    'services.title': 'What We Do',
    'services.subtitle': 'Our Expertise',
    'services.description': 'Comprehensive design solutions tailored for ambitious brands.',
    'projects.title': 'Selected Works',
    'projects.subtitle': 'Portfolio',
    'projects.all': 'All Work',
    'insta.subtitle': 'Social Feed',
    'insta.follow': 'Follow Us',
    'about.subtitle': 'Meet the Founder',
    'about.title': 'Building digital excellence since 2016.',
    'about.p1': 'I am Nelson SVG, and SVG Visual is my creative boutique studio. I believe that high-end design isn\'t just about aesthetics—it\'s about creating deep connections between brands and their audience.',
    'about.p2': 'Our collaborative approach ensures that every project is unique and performance-driven, transforming vision into high-impact digital reality.',
    'about.projects': 'Projects',
    'about.years': 'Years',
    'about.clients': 'Clients',
    'about.whatsapp': 'Chat on WhatsApp',
    'contact.subtitle': 'Let\'s Connect',
    'contact.title': 'Start your next chapter.',
    'contact.description': 'Have a project in mind? We\'d love to hear your vision. Let\'s make it a digital reality.',
    'contact.direct': 'Direct Line',
    'contact.whatsapp': 'WhatsApp',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Full name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'email@address.com',
    'contact.form.interest': 'Interest',
    'contact.form.interest.placeholder': 'Web Design, Branding, App...',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Tell us about your goals...',
    'contact.form.send': 'Send Inquiry',
    'contact.form.success.title': 'Inquiry Received.',
    'contact.form.success.message': 'We\'ll review your project and get back to you within 24 hours.',
    'footer.agency': 'Digital Design Agency',
    'footer.rights': '© 2024 SVG Visual. Curated by Nelson SVG.',
    'assistant.invite': 'Start your project'
  },
  es: {
    'nav.services': 'Servicios',
    'nav.projects': 'Proyectos',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.talk': 'Hablemos',
    'hero.agency': 'Agencia de Diseño Digital',
    'hero.title': 'Creamos experiencias digitales que importan.',
    'hero.subtitle': 'SVG Visual es un estudio boutique especializado en diseño web, branding y experiencias de usuario que impulsan tu marca hacia el futuro.',
    'hero.explore': 'Ver Trabajos',
    'hero.start': 'Empezar Proyecto',
    'services.title': 'Qué Hacemos',
    'services.subtitle': 'Nuestra Experiencia',
    'services.description': 'Soluciones de diseño integrales adaptadas a marcas ambiciosas.',
    'projects.title': 'Trabajos Seleccionados',
    'projects.subtitle': 'Portafolio',
    'projects.all': 'Todo',
    'insta.subtitle': 'Redes Sociales',
    'insta.follow': 'Síguenos',
    'about.subtitle': 'Conoce al Fundador',
    'about.title': 'Construyendo excelencia digital desde 2016.',
    'about.p1': 'Soy Nelson SVG, y SVG Visual es mi estudio boutique creativo. Creo que el diseño de alta gama no se trata solo de estética, sino de crear conexiones profundas entre las marcas y su audiencia.',
    'about.p2': 'Nuestro enfoque colaborativo garantiza que cada proyecto sea único y esté impulsado por el rendimiento, transformando la visión en una realidad digital de alto impacto.',
    'about.projects': 'Proyectos',
    'about.years': 'Años',
    'about.clients': 'Clientes',
    'about.whatsapp': 'Chat por WhatsApp',
    'contact.subtitle': 'Conectemos',
    'contact.title': 'Comienza tu próximo capítulo.',
    'contact.description': '¿Tienes un proyecto en mente? Nos encantaría escuchar tu visión. Hagámoslo una realidad digital.',
    'contact.direct': 'Línea Directa',
    'contact.whatsapp': 'WhatsApp',
    'contact.form.name': 'Nombre',
    'contact.form.name.placeholder': 'Nombre completo',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'correo@direccion.com',
    'contact.form.interest': 'Interés',
    'contact.form.interest.placeholder': 'Diseño Web, Branding, App...',
    'contact.form.message': 'Mensaje',
    'contact.form.message.placeholder': 'Cuéntanos sobre tus objetivos...',
    'contact.form.send': 'Enviar Consulta',
    'contact.form.success.title': 'Consulta Recibida.',
    'contact.form.success.message': 'Revisaremos tu proyecto y te responderemos en menos de 24 horas.',
    'footer.agency': 'Agencia de Diseño Digital',
    'footer.rights': '© 2024 SVG Visual. Curado por Nelson SVG.',
    'assistant.invite': 'Empieza tu proyecto'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Cargar preferencia del usuario
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
