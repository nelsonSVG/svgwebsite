import { Project, ProjectCategory, Service, Testimonial } from './types';

// THIS FILE SIMULATES YOUR CMS DATABASE (e.g., Keystatic Content)
// In the future, you will fetch this data from the Keystatic Reader API.

export const PROJECTS: Project[] = [
  {
    id: 'techflow',
    title: 'TechFlow Dashboard',
    category: ProjectCategory.WEB,
    categoryLabel: 'Web Design',
    description: 'A high-performance analytics dashboard designed for real-time data visualization. We focused on clean lines and dark mode aesthetics to reduce eye strain for power users.',
    client: 'TechFlow Inc.',
    year: '2024',
    services: ['Web Design', 'Development', 'Design System'],
    images: [
      'https://picsum.photos/seed/techflow1/800/1000',
      'https://picsum.photos/seed/techflow2/800/1000',
      'https://picsum.photos/seed/techflow3/800/1000'
    ]
  },
  {
    id: 'realestate',
    title: 'Real Estate Platform',
    category: ProjectCategory.WEB,
    categoryLabel: 'Web Design',
    description: 'A luxury real estate platform featuring immersive virtual tours and a seamless property management interface for high-net-worth individuals.',
    client: 'Prime Properties',
    year: '2023',
    services: ['Web Design', '3D Integration', 'CMS Development'],
    images: [
      'https://picsum.photos/seed/estate1/800/1000',
      'https://picsum.photos/seed/estate2/800/1000',
      'https://picsum.photos/seed/estate3/800/1000'
    ]
  },
  {
    id: 'nova',
    title: 'Nova Brand Identity',
    category: ProjectCategory.BRANDING,
    categoryLabel: 'Branding',
    description: 'A futuristic brand identity for a tech startup. The project included logo design, typography selection, and a comprehensive brand book.',
    client: 'Nova Tech',
    year: '2024',
    services: ['Branding', 'Strategy', 'Visual Identity'],
    images: [
      'https://picsum.photos/seed/nova1/800/1000',
      'https://picsum.photos/seed/nova2/800/1000',
      'https://picsum.photos/seed/nova3/800/1000'
    ]
  },
  {
    id: 'artisan',
    title: 'Artisan Coffee Brand',
    category: ProjectCategory.BRANDING,
    categoryLabel: 'Branding',
    description: 'Warm, tactile, and organic. We created a brand identity that reflects the craftsmanship of specialty coffee roasting through texture and typography.',
    client: 'Artisan Coffee Co.',
    year: '2023',
    services: ['Branding', 'Packaging', 'Art Direction'],
    images: [
      'https://picsum.photos/seed/coffee1/800/1000',
      'https://picsum.photos/seed/coffee2/800/1000',
      'https://picsum.photos/seed/coffee3/800/1000'
    ]
  },
  {
    id: 'fitlife',
    title: 'FitLife App',
    category: ProjectCategory.APPS,
    categoryLabel: 'Applications',
    description: 'A social fitness application that combines workout tracking with community challenges. Designed for high engagement and retention.',
    client: 'FitLife Co.',
    year: '2023',
    services: ['App Design', 'Prototyping', 'User Testing'],
    images: [
      'https://picsum.photos/seed/fit1/800/1000',
      'https://picsum.photos/seed/fit2/800/1000',
      'https://picsum.photos/seed/fit3/800/1000'
    ]
  },
  {
    id: 'fintech',
    title: 'Fintech Banking App',
    category: ProjectCategory.APPS,
    categoryLabel: 'Applications',
    description: 'A neo-banking application focused on simplifying complex financial data. Security meets usability in a sleek, modern interface.',
    client: 'Vault Finance',
    year: '2024',
    services: ['App Design', 'UX Research', 'Interaction Design'],
    images: [
      'https://picsum.photos/seed/fintech1/800/1000',
      'https://picsum.photos/seed/fintech2/800/1000',
      'https://picsum.photos/seed/fintech3/800/1000'
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Redesign',
    category: ProjectCategory.UIUX,
    categoryLabel: 'UI/UX',
    description: 'A complete UX overhaul for a fashion retailer. We optimized the checkout flow and enhanced product discovery, resulting in a 40% conversion uplift.',
    client: 'StyleHub',
    year: '2023',
    services: ['UI/UX', 'Audit', 'Wireframing'],
    images: [
      'https://picsum.photos/seed/shop1/800/1000',
      'https://picsum.photos/seed/shop2/800/1000',
      'https://picsum.photos/seed/shop3/800/1000'
    ]
  },
  {
    id: 'travel',
    title: 'Travel Booking App',
    category: ProjectCategory.UIUX,
    categoryLabel: 'UI/UX',
    description: 'Simplifying the travel booking experience. We focused on reducing friction in the search and booking process while inspiring wanderlust through imagery.',
    client: 'Wanderlust',
    year: '2024',
    services: ['UI/UX', 'Mobile Design', 'Design System'],
    images: [
      'https://picsum.photos/seed/travel1/800/1000',
      'https://picsum.photos/seed/travel2/800/1000',
      'https://picsum.photos/seed/travel3/800/1000'
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 'web',
    title: 'Web Design',
    description: 'Immersive, high-performance websites that blend stunning aesthetics with seamless functionality to tell your brand story.',
    iconName: 'layout'
  },
  {
    id: 'branding',
    title: 'Branding',
    description: 'Strategic brand identities including logos, typography, and visual systems that differentiate you in the market.',
    iconName: 'pen-tool'
  },
  {
    id: 'apps',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications designed for intuition, engagement, and lasting user retention.',
    iconName: 'smartphone'
  },
  {
    id: 'userflow',
    title: 'User Flow',
    description: 'Mapping out logical, efficient pathways to ensure your users achieve their goals without friction or confusion.',
    iconName: 'git-merge'
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    description: 'Designing interfaces that delight and experiences that convert. We bridge the gap between human needs and business goals.',
    iconName: 'layers'
  },
  {
    id: 'ai',
    title: 'AI Automation',
    description: 'Integrating intelligent automation into your digital products to enhance efficiency and personalize user experiences.',
    iconName: 'cpu'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "SVG Visual completely transformed our online presence. The attention to detail and creative approach exceeded all our expectations.",
    author: "Maria Chen",
    role: "CEO, TechFlow",
    initials: "MC"
  },
  {
    id: '2',
    quote: "The branding they created for our coffee shop captures our essence perfectly. Professional, creative and incredibly easy to work with.",
    author: "James Miller",
    role: "Owner, Artisan Coffee",
    initials: "JM"
  },
  {
    id: '3',
    quote: "Our fitness app went from concept to launch seamlessly. The UX is intuitive and our users love it. Highly recommended!",
    author: "Lisa Park",
    role: "Product Manager, FitLife",
    initials: "LP"
  }
];
