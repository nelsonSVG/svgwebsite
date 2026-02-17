import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SVG Visual | Digital Design Agency",
  description: "Creative agency specializing in web design, branding, app development, and AI automation. We transform your vision into memorable digital experiences.",
  keywords: ["web design", "branding", "apps", "UI/UX", "AI automation", "digital design", "creative agency"],
  authors: [{ name: "Nelson SVG" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SVG Visual | Digital Design Agency",
    description: "We transform your vision into memorable digital experiences",
    url: "https://svgvisual.com",
    siteName: "SVG Visual",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SVG Visual | Digital Design Agency",
    description: "We transform your vision into memorable digital experiences",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${syne.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
