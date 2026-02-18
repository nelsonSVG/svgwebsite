
import React from 'react';

export enum ProjectCategory {
  ALL = 'all',
  WEB = 'web',
  BRANDING = 'branding',
  APPS = 'apps',
  UIUX = 'uiux'
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  description: string;
  client: string;
  year: string;
  services: string[];
  images: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed from React.ReactNode to string for CMS compatibility
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
}
