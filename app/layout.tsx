import type {Metadata} from 'next';
import { Playfair_Display, Inter, Great_Vibes } from 'next/font/google';
import './globals.css'; // Global styles

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Walimatul Ursy Fhariz & Aisyah - Undangan Pernikahan',
  description: 'Undangan Pernikahan Digital Fhariz & Aisyah. Sabtu, 4 Juli 2026. Merupakan suatu kehormatan bagi kami atas kehadiran Bapak/Ibu sekalian.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable} ${greatVibes.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="bg-stone-50 text-stone-800 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
