import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DBUU HUB | Dev Bhoomi Uttarakhand University Hub',
  description: 'Dev Bhoomi Uttarakhand University (DBUU) Unified Student Hub - Interactive Multiplayer Mind Games, Volunteering & Event Recruitment, DBUU Dance Ikon 2026, Anonymous Confession Wall, and Student College Events.',
  keywords: ['DBUU', 'Dev Bhoomi Uttarakhand University', 'Dance Ikon 2026', 'DBUU Hub', 'Chess', 'Ludo', 'Sudoku', 'Confessions'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0710] text-[#fff8e9] flex flex-col selection:bg-[#ffc16b] selection:text-black">
        <Navbar />
        
        <main className="flex-1 relative z-10">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
