"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============================================
// PROJECT DATA WITH IMAGES
// ============================================
const projectsData: Record<string, {
  title: string;
  category: string;
  client: string;
  description: string;
  year: string;
  fullDescription: string;
  technologies: string[];
  features: string[];
  results: string[];
  challenge: string;
  solution: string;
  images: string[];
}> = {
  "techflow-dashboard": {
    title: "TechFlow Dashboard",
    category: "Web Design",
    client: "TechFlow Inc.",
    description: "SaaS dashboard with real-time analytics and minimalist design",
    year: "2024",
    fullDescription: "A comprehensive SaaS dashboard designed for TechFlow Inc., featuring real-time analytics, user management, and intuitive data visualization. The design focuses on clarity and efficiency, allowing users to access critical information at a glance.",
    technologies: ["React", "Next.js", "Tailwind CSS", "Chart.js", "PostgreSQL", "Redis"],
    features: [
      "Real-time data visualization with live updates",
      "Custom chart components for different metrics",
      "Role-based user management system",
      "Automated reporting and email notifications",
      "Mobile-responsive design with native app feel",
      "Dark/Light theme with system preference detection"
    ],
    results: [
      "45% increase in user engagement",
      "30% reduction in task completion time",
      "98% client satisfaction score"
    ],
    challenge: "TechFlow needed a unified dashboard that could serve multiple user types with different needs—from executives wanting quick overviews to analysts needing deep data exploration.",
    solution: "We designed a modular dashboard system with customizable widgets, role-specific views, and real-time data synchronization. The interface adapts to each user's needs while maintaining consistency.",
    images: ["/projects/techflow/1.png", "/projects/techflow/2.png", "/projects/techflow/3.png", "/projects/techflow/4.png"]
  },
  "nova-brand-identity": {
    title: "Nova Brand Identity",
    category: "Branding",
    client: "Nova Startups",
    description: "Complete visual identity for startup incubator",
    year: "2024",
    fullDescription: "Complete brand identity development for Nova Startups, a startup incubator focused on tech innovation. The project included logo design, color palette, typography selection, and comprehensive brand guidelines.",
    technologies: ["Figma", "Illustrator", "Brand Strategy", "Motion Design"],
    features: [
      "Logo design with multiple variations",
      "Comprehensive color palette",
      "Custom typography pairing system",
      "Brand guidelines document",
      "Marketing collateral templates",
      "Social media kit with templates"
    ],
    results: [
      "60% increase in brand recognition",
      "Winner of Design Excellence Award 2024",
      "40% improvement in investor presentations"
    ],
    challenge: "Nova Startups needed a brand identity that would appeal to both innovative tech startups and traditional investors, balancing cutting-edge modernity with established trustworthiness.",
    solution: "We created a dynamic brand system with a flexible logo that works across contexts, a bold yet sophisticated color palette, and typography that bridges contemporary and classic design.",
    images: ["/projects/nova/1.png", "/projects/nova/2.png", "/projects/nova/3.png", "/projects/nova/4.png"]
  },
  "fitlife-app": {
    title: "FitLife App",
    category: "Apps",
    client: "FitLife Health",
    description: "Fitness tracking application for iOS and Android",
    year: "2024",
    fullDescription: "A comprehensive fitness application designed for FitLife Health, featuring workout tracking, nutrition planning, and progress monitoring. Available on both iOS and Android platforms with seamless cloud synchronization.",
    technologies: ["React Native", "Node.js", "MongoDB", "Firebase", "HealthKit"],
    features: [
      "Intelligent workout routine builder with AI",
      "Comprehensive nutrition tracking",
      "Progress photos and measurements",
      "Social challenges and leaderboards",
      "Apple Watch and Wear OS integration",
      "Offline mode for workouts"
    ],
    results: [
      "3x increase in downloads",
      "4.8 star rating on App Store",
      "500K+ active monthly users"
    ],
    challenge: "FitLife needed to stand out in a crowded fitness app market while providing genuine value that keeps users engaged long-term.",
    solution: "We designed an intuitive interface that progressively reveals features as users need them, combined with gamification elements and social features that drive engagement.",
    images: ["/projects/fitlife/1.png", "/projects/fitlife/2.png", "/projects/fitlife/3.png", "/projects/fitlife/4.png"]
  },
  "ecommerce-redesign": {
    title: "E-commerce Redesign",
    category: "UI/UX",
    client: "ModaStyle",
    description: "UX redesign that increased conversions by 45%",
    year: "2023",
    fullDescription: "A comprehensive UX redesign for ModaStyle's e-commerce platform. The project involved extensive user research, journey mapping, and iterative prototyping to create a seamless shopping experience.",
    technologies: ["Figma", "User Research", "A/B Testing", "Hotjar", "Analytics"],
    features: [
      "Complete user journey optimization",
      "Streamlined checkout flow",
      "Enhanced product discovery",
      "Mobile-first responsive design",
      "WCAG accessibility compliance",
      "Personalized recommendations"
    ],
    results: [
      "45% increase in conversions",
      "25% reduction in cart abandonment",
      "60% improvement in mobile conversions"
    ],
    challenge: "ModaStyle's existing platform had a high cart abandonment rate and low mobile conversion. Users struggled to find products and the checkout process was cumbersome.",
    solution: "We redesigned the entire shopping experience with a mobile-first approach, simplified navigation, and a streamlined checkout process that reduces friction at every step.",
    images: ["/projects/ecommerce/1.png", "/projects/ecommerce/2.png", "/projects/ecommerce/3.png", "/projects/ecommerce/4.png"]
  },
  "realestate-platform": {
    title: "Real Estate Platform",
    category: "Web Design",
    client: "PropTech Solutions",
    description: "Property listing and management system",
    year: "2024",
    fullDescription: "A modern real estate platform designed for PropTech Solutions, featuring property listings, agent profiles, and virtual tour integration. The platform serves both buyers and sellers with a seamless experience.",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "MapBox", "Cloudinary"],
    features: [
      "Advanced property search with filters",
      "Interactive map integration",
      "Virtual tour support",
      "Agent dashboard and analytics",
      "Lead management system",
      "Mobile-responsive design"
    ],
    results: [
      "200% increase in qualified leads",
      "35% faster property sales cycle",
      "4.9 star user satisfaction rating"
    ],
    challenge: "PropTech Solutions needed a platform that could compete with major real estate sites while offering unique value to local markets.",
    solution: "We created a hyper-local platform with advanced search capabilities, beautiful property showcases, and integrated tools for both agents and buyers.",
    images: ["/projects/realestate/1.png", "/projects/realestate/2.png", "/projects/realestate/3.png", "/projects/realestate/4.png"]
  },
  "coffee-brand": {
    title: "Artisan Coffee Brand",
    category: "Branding",
    client: "Café Origen",
    description: "Luxury coffee brand identity",
    year: "2024",
    fullDescription: "Complete brand identity development for Café Origen, an artisan coffee roaster. The project captured the essence of craft coffee culture with a sophisticated, earthy aesthetic.",
    technologies: ["Illustrator", "Photoshop", "Photography", "Packaging Design"],
    features: [
      "Distinctive logo design",
      "Custom packaging system",
      "Retail collateral suite",
      "Barista training materials",
      "Social media templates",
      "Website design"
    ],
    results: [
      "80% increase in retail placements",
      "Featured in Design Week magazine",
      "45% growth in wholesale accounts"
    ],
    challenge: "Café Origen needed a brand that could transition from local favorite to premium national competitor while maintaining authenticity.",
    solution: "We developed a rich visual identity that tells the story of craft coffee through earthy colors, hand-drawn elements, and premium materials.",
    images: ["/projects/coffee/1.png", "/projects/coffee/2.png", "/projects/coffee/1.png", "/projects/coffee/2.png"]
  },
  "fintech-app": {
    title: "Fintech Banking App",
    category: "Apps",
    client: "NeoBank",
    description: "Mobile banking experience",
    year: "2024",
    fullDescription: "A modern mobile banking app designed for NeoBank, a digital-first financial institution. The app combines powerful financial tools with an intuitive, delightful user experience.",
    technologies: ["React Native", "TypeScript", "Node.js", "Plaid API", "AWS"],
    features: [
      "Instant account opening",
      "Real-time spending insights",
      "Automated savings goals",
      "Peer-to-peer payments",
      "Investment tracking",
      "Biometric security"
    ],
    results: [
      "500K+ downloads in first quarter",
      "4.7 star App Store rating",
      "30% higher engagement than competitors"
    ],
    challenge: "NeoBank needed to stand out in the crowded fintech space with an app that makes personal finance approachable and even enjoyable.",
    solution: "We designed a dark-themed interface with clear visual hierarchy, playful micro-interactions, and intelligent features that help users make better financial decisions.",
    images: ["/projects/fintech/1.png", "/projects/fintech/2.png", "/projects/fintech/1.png", "/projects/fintech/2.png"]
  },
  "travel-app": {
    title: "Travel Booking App",
    category: "UI/UX",
    client: "Wanderlust",
    description: "Seamless travel planning experience",
    year: "2024",
    fullDescription: "A comprehensive travel booking app for Wanderlust, featuring flights, hotels, and experiences in one seamless platform. The design prioritizes discovery and booking simplicity.",
    technologies: ["Figma", "React Native", "Node.js", "Skyscanner API", "Stripe"],
    features: [
      "Smart itinerary planning",
      "Price tracking alerts",
      "Offline trip access",
      "Local experience booking",
      "Group trip coordination",
      "Travel document storage"
    ],
    results: [
      "150% increase in booking completion",
      "Featured as App of the Day",
      "2M+ active monthly users"
    ],
    challenge: "Wanderlust users were overwhelmed by options and abandoned bookings halfway through. The experience needed to be streamlined.",
    solution: "We created a guided booking flow with smart defaults, saved preferences, and a visual-first approach that makes trip planning feel like an adventure itself.",
    images: ["/projects/travel/1.png", "/projects/travel/2.png", "/projects/travel/1.png", "/projects/travel/2.png"]
  }
};

const projectOrder = ["techflow-dashboard", "nova-brand-identity", "fitlife-app", "ecommerce-redesign", "realestate-platform", "coffee-brand", "fintech-app", "travel-app"];

// ============================================
// HEADER COMPONENT
// ============================================
function ProjectHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 py-4">
      <div className="container mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-sm group-hover:scale-110 transition-transform duration-300">
              S
            </div>
            <span className="font-bold text-lg tracking-tight">
              SVG<span className="text-muted-foreground">Visual</span>
            </span>
          </Link>

          <Link href="/#projects">
            <Button variant="ghost" className="rounded-full hover:bg-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Projects
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

// ============================================
// IMAGE CAROUSEL
// ============================================
function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative">
      <div className="aspect-[16/10] relative overflow-hidden bg-secondary">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImage]}
              alt={`${title} - Image ${currentImage + 1}`}
              fill
              className="object-cover"
              priority={currentImage === 0}
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`relative w-24 h-16 flex-shrink-0 overflow-hidden transition-opacity ${
              index === currentImage ? 'opacity-100 ring-2 ring-foreground' : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Image src={img} alt={`${title} thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PROJECT NAVIGATION
// ============================================
function ProjectNavigation({ currentSlug }: { currentSlug: string }) {
  const currentIndex = projectOrder.indexOf(currentSlug);
  const prevSlug = currentIndex > 0 ? projectOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < projectOrder.length - 1 ? projectOrder[currentIndex + 1] : null;

  const prevProject = prevSlug ? projectsData[prevSlug] : null;
  const nextProject = nextSlug ? projectsData[nextSlug] : null;

  return (
    <div className="border-t border-border py-12">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {prevProject ? (
            <Link href={`/projects/${prevSlug}`} className="group block">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wide">Previous Project</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-muted-foreground transition-colors">
                    {prevProject.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{prevProject.category}</p>
                </div>
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <div className="opacity-30">
              <span className="text-sm text-muted-foreground uppercase tracking-wide">No Previous Project</span>
            </div>
          )}
        </div>

        <div className={prevProject ? 'md:text-right' : ''}>
          {nextProject ? (
            <Link href={`/projects/${nextSlug}`} className="group block">
              <div className={`flex items-center gap-2 text-muted-foreground mb-4 ${prevProject ? 'md:justify-end' : ''}`}>
                <span className="text-sm uppercase tracking-wide">Next Project</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </div>
              <div className={`flex items-center justify-between ${prevProject ? 'md:flex-row-reverse' : ''}`}>
                <div className={prevProject ? 'md:text-right' : ''}>
                  <h3 className="text-xl font-bold group-hover:text-muted-foreground transition-colors">
                    {nextProject.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{nextProject.category}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <div className="opacity-30">
              <span className="text-sm text-muted-foreground uppercase tracking-wide">No Next Project</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PROJECT DETAIL PAGE
// ============================================
export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projectsData[slug];

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/#projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <ProjectHeader />

      <section className="pt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageCarousel images={project.images} title={project.title} />
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16 lg:mb-24"
          >
            <div>
              <Badge variant="outline" className="mb-4 border-border text-muted-foreground">
                {project.category}
              </Badge>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
              >
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground">{project.description}</p>
            </div>

            <div className="lg:pt-16">
              <div className="flex flex-wrap gap-8 lg:gap-12">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Client</div>
                  <div className="font-semibold">{project.client}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Year</div>
                  <div className="font-semibold">{project.year}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Role</div>
                  <div className="font-semibold">Design & Development</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16 lg:mb-24"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{project.fullDescription}</p>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm text-muted-foreground mb-3 uppercase tracking-wide">The Challenge</h3>
                <p className="text-muted-foreground">{project.challenge}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground mb-3 uppercase tracking-wide">Our Solution</h3>
                <p className="text-muted-foreground">{project.solution}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/30 p-8 lg:p-12 mb-16 lg:mb-24"
          >
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>Results</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {project.results.map((result, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-lg">{result}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16 lg:mb-24"
          >
            <div>
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>Key Features</h2>
              <ul className="space-y-4">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground font-mono">0{index + 1}</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>Technologies</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-sm py-2 px-4 border-border rounded-full">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          <ProjectNavigation currentSlug={slug} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-16 border-t border-border"
          >
            <p className="text-muted-foreground mb-4">Want similar results?</p>
            <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full h-14 px-8 text-base">
              <Link href="/#contact">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">S</div>
              <span className="font-bold">SVG<span className="text-muted-foreground">Visual</span></span>
            </Link>
            <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} SVG Visual. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
