import type { Metadata } from 'next'
import { Syne, Poppins } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'SVG Visual - Digital Design Agency',
  description: 'A high-end digital design agency portfolio featuring web design, branding, and mobile app development services with a sleek dark aesthetic.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${syne.variable} ${poppins.variable}`}>
      <body className="h-full bg-[#0a0a0a]">
        {children}
      </body>
    </html>
  )
}
