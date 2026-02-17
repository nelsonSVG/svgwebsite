import { config, fields, collection, singleton } from '@keystatic/core';

// Detectar si estamos en producción o desarrollo
const isProd = process.env.NODE_ENV === 'production';

export default config({
  storage: isProd
    ? {
        // En producción: GitHub (necesitas configurar las variables de entorno)
        kind: 'github',
        repo: {
          owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'tu-usuario',
          name: process.env.NEXT_PUBLIC_GITHUB_REPO || 'svg-visual',
        },
      }
    : {
        // En desarrollo: almacenamiento local
        kind: 'local',
      },

  ui: {
    brand: {
      name: 'SVG Visual CMS',
    },
  },

  collections: {
    // Proyectos del portafolio
    projects: collection({
      label: 'Proyectos',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Diseño Web', value: 'web' },
            { label: 'Branding', value: 'branding' },
            { label: 'Apps', value: 'apps' },
            { label: 'User Flow', value: 'userflow' },
            { label: 'UI/UX', value: 'uiux' },
            { label: 'Automatización IA', value: 'ai' },
          ],
          defaultValue: 'web',
        }),
        client: fields.text({ label: 'Cliente' }),
        thumbnail: fields.image({
          label: 'Imagen principal',
          directory: 'public/projects',
          publicPath: '/projects/',
        }),
        images: fields.array(
          fields.image({
            label: 'Imagen',
            directory: 'public/projects',
            publicPath: '/projects/',
          }),
          { label: 'Galería de imágenes' }
        ),
        description: fields.text({ label: 'Descripción corta', multiline: true }),
        year: fields.text({ label: 'Año' }),
        featured: fields.checkbox({ label: 'Destacado en home' }),
        content: fields.document({
          label: 'Contenido detallado',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/projects',
            publicPath: '/projects/',
          },
        }),
      },
    }),

    // Servicios
    services: collection({
      label: 'Servicios',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        icon: fields.text({ label: 'Icono (nombre de Lucide)', defaultValue: 'code' }),
        shortDescription: fields.text({ label: 'Descripción corta' }),
        image: fields.image({
          label: 'Imagen del servicio',
          directory: 'public/services',
          publicPath: '/services/',
        }),
        features: fields.array(
          fields.object({
            title: fields.text({ label: 'Característica' }),
            description: fields.text({ label: 'Descripción' }),
          }),
          { label: 'Características del servicio' }
        ),
        price: fields.text({ label: 'Precio desde', defaultValue: 'Consultar' }),
        content: fields.document({
          label: 'Contenido detallado',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),

    // Testimonios
    testimonials: collection({
      label: 'Testimonios',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      schema: {
        name: fields.slug({ name: { label: 'Nombre del cliente' } }),
        role: fields.text({ label: 'Cargo/Empresa' }),
        avatar: fields.image({
          label: 'Foto',
          directory: 'public/testimonials',
          publicPath: '/testimonials/',
        }),
        text: fields.text({ label: 'Testimonio', multiline: true }),
        rating: fields.integer({ label: 'Valoración (1-5)', defaultValue: 5 }),
      },
    }),

    // Blog/Artículos
    posts: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        excerpt: fields.text({ label: 'Resumen', multiline: true }),
        coverImage: fields.image({
          label: 'Imagen de portada',
          directory: 'public/blog',
          publicPath: '/blog/',
        }),
        author: fields.text({ label: 'Autor', defaultValue: 'Nelson SVG' }),
        publishedAt: fields.date({ label: 'Fecha de publicación' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Etiquetas' }),
        content: fields.document({
          label: 'Contenido',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/blog',
            publicPath: '/blog/',
          },
        }),
      },
    }),
  },

  singletons: {
    // Información de la agencia
    agency: singleton({
      label: 'Agencia',
      path: 'src/content/agency',
      schema: {
        name: fields.text({ label: 'Nombre', defaultValue: 'SVG Visual' }),
        tagline: fields.text({ label: 'Eslogan' }),
        description: fields.text({ label: 'Descripción', multiline: true }),
        logo: fields.image({
          label: 'Logo',
          directory: 'public',
          publicPath: '/',
        }),
        favicon: fields.image({
          label: 'Favicon',
          directory: 'public',
          publicPath: '/',
        }),
        email: fields.text({ label: 'Email' }),
        phone: fields.text({ label: 'Teléfono' }),
        whatsapp: fields.text({ label: 'WhatsApp (con código país)' }),
        address: fields.text({ label: 'Dirección' }),
        socialLinks: fields.object({
          instagram: fields.url({ label: 'Instagram' }),
          linkedin: fields.url({ label: 'LinkedIn' }),
          twitter: fields.url({ label: 'Twitter/X' }),
          behance: fields.url({ label: 'Behance' }),
          dribbble: fields.url({ label: 'Dribbble' }),
        }),
        heroTitle: fields.text({ label: 'Título del Hero' }),
        heroSubtitle: fields.text({ label: 'Subtítulo del Hero' }),
        ctaText: fields.text({ label: 'Texto del botón CTA', defaultValue: 'Empezar proyecto' }),
      },
    }),

    // Perfil de Nelson SVG
    founder: singleton({
      label: 'Fundador (Nelson SVG)',
      path: 'src/content/founder',
      schema: {
        name: fields.text({ label: 'Nombre completo' }),
        role: fields.text({ label: 'Cargo', defaultValue: 'Fundador & Director Creativo' }),
        photo: fields.image({
          label: 'Foto de perfil',
          directory: 'public/team',
          publicPath: '/team/',
        }),
        bio: fields.text({ label: 'Biografía corta' }),
        fullBio: fields.document({
          label: 'Biografía completa',
          formatting: true,
          dividers: true,
        }),
        skills: fields.array(fields.text({ label: 'Habilidad' }), { label: 'Habilidades' }),
        experience: fields.integer({ label: 'Años de experiencia' }),
      },
    }),

    // Página de inicio
    homePage: singleton({
      label: 'Página de Inicio',
      path: 'src/content/home',
      schema: {
        heroTitle: fields.text({ label: 'Título principal' }),
        heroSubtitle: fields.text({ label: 'Subtítulo', multiline: true }),
        showVideo: fields.checkbox({ label: 'Mostrar video en hero' }),
        videoUrl: fields.url({ label: 'URL del video (YouTube/Vimeo)' }),
        sectionServicesTitle: fields.text({ label: 'Título sección servicios' }),
        sectionProjectsTitle: fields.text({ label: 'Título sección proyectos' }),
        sectionTestimonialsTitle: fields.text({ label: 'Título sección testimonios' }),
        sectionCTATitle: fields.text({ label: 'Título CTA final' }),
        sectionCTASubtitle: fields.text({ label: 'Subtítulo CTA' }),
      },
    }),
  },
});
