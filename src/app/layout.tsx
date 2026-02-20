import type { Metadata, Viewport } from 'next'
import { Syne, Poppins } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from "@/lib/LanguageContext";

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'SVG Visual | High-End Digital Design Agency',
    template: '%s | SVG Visual'
  },
  description: 'SVG Visual is a boutique digital studio specializing in premium web design, strategic branding, and high-impact user experiences. We craft digital excellence that propels brands into the future through innovation and AI-driven solutions.',
  keywords: [
    'Digital Design Agency', 
    'Boutique Studio', 
    'Web Design', 
    'Branding Strategy', 
    'UI/UX Design', 
    'Premium Digital Experiences', 
    'AI Automation for Brands', 
    'Nelson SVG',
    'High-End Web Development'
  ],
  authors: [{ name: 'Nelson SVG' }],
  creator: 'Nelson SVG',
  publisher: 'SVG Visual',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://svgvisual.com',
    siteName: 'SVG Visual',
    title: 'SVG Visual | High-End Digital Design Agency',
    description: 'Boutique studio crafting premium digital experiences, web design, and strategic branding.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SVG Visual | Digital Design Excellence',
    description: 'We craft digital experiences that matter. Web design, branding, and UX for ambitious brands.',
    creator: '@svgvisual',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${syne.variable} ${poppins.variable}`}>
      <body className="h-full bg-[#0a0a0a] text-white selection:bg-white selection:text-black antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
