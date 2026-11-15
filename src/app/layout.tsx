import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DBUU HUB | Official Student Nexus & Games',
  description: 'Dev Bhoomi Uttarakhand University (DBUU) Unified Student Hub - Interactive Multiplayer Games, Volunteering & Event Recruitment, Dance Ikon 2026, Anonymous Confession Wall, and Academic Resources.',
  keywords: ['DBUU', 'Dev Bhoomi Uttarakhand University', 'Dance Ikon 2026', 'DBUU Hub', 'Chess', 'Ludo', 'Sudoku', 'Confessions'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06080F] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
        {/* Subtle grid pattern background */}
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />
        
        {/* Ambient Top Glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none z-0" />

        <Navbar />
        
        <main className="flex-1 relative z-10">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
