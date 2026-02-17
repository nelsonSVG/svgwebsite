"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Globe,
  Palette,
  Smartphone,
  GitBranch,
  Layout,
  Sparkles,
  Menu,
  X,
  Mail,
  MapPin,
  Instagram,
  MessageCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// HEADER COMPONENT
// ============================================
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-border/50 py-4"
          : "bg-transparent py-6"
      }`}
    >
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

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.instagram.com/svg.visual/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
              <Link href="#contact">
                Let&apos;s Talk
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-6 pb-4 border-t border-border pt-6"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-4 mt-2">
                  <Button asChild className="bg-foreground text-background rounded-full">
                    <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                      Let&apos;s Talk
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <a
                    href="https://www.instagram.com/svg.visual/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 dot-pattern opacity-50" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              Digital Design Agency
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
          >
            We craft digital
            <br />
            experiences that
            <br />
            <span className="text-muted-foreground">matter.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed"
          >
            Web design, branding, apps, and AI solutions that transform your vision into memorable digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full h-14 px-8 text-base">
              <Link href="#contact">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-border hover:bg-transparent">
              <Link href="#projects">
                View Our Work
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border border-border flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-muted-foreground" />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// SERVICES SECTION
// ============================================
const services = [
  { icon: Globe, title: "Web Design", description: "Modern, conversion-focused websites.", features: ["Responsive", "SEO Ready", "Fast", "CMS"] },
  { icon: Palette, title: "Branding", description: "Distinctive brand identities.", features: ["Logo", "Identity", "Guidelines"] },
  { icon: Smartphone, title: "Apps", description: "Mobile-first digital products.", features: ["iOS", "Android", "PWA"] },
  { icon: GitBranch, title: "User Flow", description: "Conversion-optimized journeys.", features: ["Research", "Wireframes", "Testing"] },
  { icon: Layout, title: "UI/UX Design", description: "Beautiful, usable interfaces.", features: ["Design Systems", "Accessibility"] },
  { icon: Sparkles, title: "AI Automation", description: "Intelligent business solutions.", features: ["Chatbots", "Workflows", "Analytics"] },
];

function ServicesSection() {
  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4 block"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
          >
            Services built for
            <br />
            <span className="text-muted-foreground">growth.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-background p-8 lg:p-10 group hover:bg-secondary/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-6 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, i) => (
                    <span key={feature} className="text-xs text-muted-foreground">
                      {feature}
                      {i < service.features.length - 1 && <span className="mx-2">·</span>}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROJECTS SECTION WITH TABS
// ============================================
const projectCategories = [
  { id: "all", label: "All Work" },
  { id: "web", label: "Web Design" },
  { id: "branding", label: "Branding" },
  { id: "apps", label: "Apps" },
  { id: "uiux", label: "UI/UX" },
];

const allProjects = [
  // Web Design
  {
    slug: "techflow-dashboard",
    title: "TechFlow Dashboard",
    category: "Web Design",
    categorySlug: "web",
    client: "TechFlow Inc.",
    description: "SaaS dashboard with real-time analytics",
    year: "2024",
    images: ["/projects/techflow/1.png", "/projects/techflow/2.png", "/projects/techflow/3.png", "/projects/techflow/4.png"],
  },
  {
    slug: "realestate-platform",
    title: "Real Estate Platform",
    category: "Web Design",
    categorySlug: "web",
    client: "PropTech Solutions",
    description: "Property listing and management system",
    year: "2024",
    images: ["/projects/realestate/1.png", "/projects/realestate/2.png", "/projects/realestate/3.png", "/projects/realestate/4.png"],
  },
  // Branding
  {
    slug: "nova-brand-identity",
    title: "Nova Brand Identity",
    category: "Branding",
    categorySlug: "branding",
    client: "Nova Startups",
    description: "Complete visual identity system",
    year: "2024",
    images: ["/projects/nova/1.png", "/projects/nova/2.png", "/projects/nova/3.png", "/projects/nova/4.png"],
  },
  {
    slug: "coffee-brand",
    title: "Artisan Coffee Brand",
    category: "Branding",
    categorySlug: "branding",
    client: "Café Origen",
    description: "Luxury coffee brand identity",
    year: "2024",
    images: ["/projects/coffee/1.png", "/projects/coffee/2.png", "/projects/coffee/1.png", "/projects/coffee/2.png"],
  },
  // Apps
  {
    slug: "fitlife-app",
    title: "FitLife App",
    category: "Apps",
    categorySlug: "apps",
    client: "FitLife Health",
    description: "Fitness tracking application",
    year: "2024",
    images: ["/projects/fitlife/1.png", "/projects/fitlife/2.png", "/projects/fitlife/3.png", "/projects/fitlife/4.png"],
  },
  {
    slug: "fintech-app",
    title: "Fintech Banking App",
    category: "Apps",
    categorySlug: "apps",
    client: "NeoBank",
    description: "Mobile banking experience",
    year: "2024",
    images: ["/projects/fintech/1.png", "/projects/fintech/2.png", "/projects/fintech/1.png", "/projects/fintech/2.png"],
  },
  // UI/UX
  {
    slug: "ecommerce-redesign",
    title: "E-commerce Redesign",
    category: "UI/UX",
    categorySlug: "uiux",
    client: "ModaStyle",
    description: "UX optimization that increased conversions",
    year: "2023",
    images: ["/projects/ecommerce/1.png", "/projects/ecommerce/2.png", "/projects/ecommerce/3.png", "/projects/ecommerce/4.png"],
  },
  {
    slug: "travel-app",
    title: "Travel Booking App",
    category: "UI/UX",
    categorySlug: "uiux",
    client: "Wanderlust",
    description: "Seamless travel planning experience",
    year: "2024",
    images: ["/projects/travel/1.png", "/projects/travel/2.png", "/projects/travel/1.png", "/projects/travel/2.png"],
  },
];

function ProjectCard({ project, index }: { project: typeof allProjects[0]; index: number }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="aspect-[4/3] relative overflow-hidden mb-6 bg-secondary">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={project.images[currentImage]}
                alt={`${project.title} - Image ${currentImage + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevImage}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImage(i);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImage ? 'bg-background' : 'bg-background/40'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 left-4">
            <span
              className="text-white/30 text-5xl font-bold drop-shadow-lg"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              0{index + 1}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{project.category}</span>
            <h3 className="text-xl font-bold mt-1 group-hover:text-muted-foreground transition-colors">{project.title}</h3>
            <p className="text-muted-foreground mt-2">{project.description}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = activeCategory === "all"
    ? allProjects
    : allProjects.filter(p => p.categorySlug === activeCategory);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4 block">
              Selected Work
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
            >
              Projects we&apos;re
              <br />
              <span className="text-muted-foreground">proud of.</span>
            </h2>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {projectCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-transparent border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// INSTAGRAM FEED SECTION
// ============================================
const instagramPosts = [
  { id: 1, image: "/instagram/1.png", likes: 234, alt: "Design work showcase" },
  { id: 2, image: "/instagram/2.png", likes: 189, alt: "Web design process" },
  { id: 3, image: "/instagram/3.png", likes: 312, alt: "Branding project" },
  { id: 4, image: "/instagram/4.png", likes: 156, alt: "Mobile app design" },
  { id: 5, image: "/instagram/5.png", likes: 278, alt: "UI components" },
  { id: 6, image: "/instagram/6.png", likes: 198, alt: "Team workspace" },
];

function InstagramSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Instagram className="w-6 h-6" />
            <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              @svg.visual
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
          >
            Follow our creative journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Behind-the-scenes, design tips, and project showcases
          </motion.p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/svg.visual/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden bg-secondary"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-background">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border hover:bg-transparent"
          >
            <a
              href="https://www.instagram.com/svg.visual/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Follow @svg.visual
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
const testimonials = [
  { name: "Maria Lopez", role: "CEO, Nova Startups", text: "SVG Visual transformed our brand completely. Their attention to detail and creative vision exceeded all expectations." },
  { name: "Carlos Ruiz", role: "CTO, TechFlow Inc.", text: "The dashboard they built is not just beautiful—it significantly improved our team's productivity. Outstanding work." },
  { name: "Ana Martinez", role: "Founder, FitLife Health", text: "Our app exceeded all expectations. Downloads tripled within months. The design makes all the difference." },
];

function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4 block">
            Client Stories
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
          >
            Words that
            <br />
            <span className="text-muted-foreground">matter.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="pt-8 border-t border-border"
            >
              <p className="text-lg leading-relaxed mb-8">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// ABOUT SECTION
// ============================================
function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square bg-foreground relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-background">
                  <div
                    className="text-8xl md:text-9xl font-bold mb-4"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    NS
                  </div>
                  <p className="text-sm tracking-wide uppercase opacity-60">Founder</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-border -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4 block">
              About Us
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
            >
              Design with
              <br />
              <span className="text-muted-foreground">purpose.</span>
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                At SVG Visual, we believe design should solve problems, not just look pretty. We&apos;re a team of strategists, designers, and developers who care deeply about the work we create.
              </p>
              <p>
                With over 8 years of experience and 150+ projects delivered, we&apos;ve helped businesses of all sizes transform their digital presence and achieve measurable results.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
              {[
                { value: "150+", label: "Projects" },
                { value: "8+", label: "Years" },
                { value: "50+", label: "Clients" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
          >
            Ready to create
            <br />
            <span className="text-muted-foreground">something great?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl"
          >
            Let&apos;s discuss your project. We respond within 24 hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full h-14 px-8 text-base">
              <Link href="#contact">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-border">
              <a href="https://wa.me/573208647734?text=Hi%20SVG%20Visual%2C%20I%27m%20interested%20in%20your%20services%20%28web%20design%2C%20branding%2C%20apps%2C%20or%20AI%20automation%29.%20I%27d%20love%20to%20learn%20more%21" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 w-4 h-4" />
                WhatsApp Us
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium opacity-60 tracking-wide uppercase mb-4 block">
              Contact
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
            >
              Let&apos;s start a
              <br />
              conversation.
            </h2>
            <p className="text-lg opacity-70 mb-12 max-w-md">
              Have a project in mind? We&apos;d love to hear about it. Drop us a line and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 opacity-60" />
                <a href="mailto:hi@svgvisual.com" className="hover:opacity-70 transition-opacity">
                  hi@svgvisual.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 opacity-60" />
                <span>Worldwide</span>
              </div>
            </div>

            <div className="mt-12">
              <div className="text-sm opacity-60 mb-4">Follow Us</div>
              <div className="flex gap-6">
                <a
                  href="https://www.instagram.com/svg.visual/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium opacity-60 mb-2 block">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-black/5 border border-black/20 rounded-lg focus:border-black/40 focus:outline-none focus:ring-0 transition-colors placeholder:text-black/40"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-60 mb-2 block">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-4 bg-black/5 border border-black/20 rounded-lg focus:border-black/40 focus:outline-none focus:ring-0 transition-colors placeholder:text-black/40"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium opacity-60 mb-2 block">Service</label>
                <select className="w-full px-4 py-4 bg-black/5 border border-black/20 rounded-lg focus:border-black/40 focus:outline-none focus:ring-0 transition-colors text-black/60">
                  <option value="">Select a service</option>
                  <option value="web">Web Design</option>
                  <option value="branding">Branding</option>
                  <option value="app">App Development</option>
                  <option value="ux">UX Design</option>
                  <option value="ai">AI Automation</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium opacity-60 mb-2 block">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-4 bg-black/5 border border-black/20 rounded-lg focus:border-black/40 focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-black/40"
                  placeholder="Tell us about your project..."
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90 rounded-full h-14 px-8 text-base mt-4 border border-black/10">
                Send Message
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER & WHATSAPP
// ============================================
function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold">
              SVG<span className="text-muted-foreground">Visual</span>
            </span>
          </Link>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SVG Visual. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/573208647734?text=Hi%20SVG%20Visual%2C%20I%27m%20interested%20in%20your%20services%20%28web%20design%2C%20branding%2C%20apps%2C%20or%20AI%20automation%29.%20I%27d%20love%20to%20learn%20more%21"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <InstagramSection />
      <TestimonialsSection />
      <AboutSection />
      <CTASection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
