import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DBUU HUB | Dev Bhoomi Uttarakhand University',
  description: 'Connection Hub - Dev Bhoomi Uttarakhand University Unified Student Nexus',
  keywords: ['DBUU', 'Dev Bhoomi Uttarakhand University', 'Dance Ikon 2026', 'Connection Hub', 'Chess', 'Ludo', 'Sudoku', 'Confessions'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0710] text-[#fff8e9] flex flex-col selection:bg-[#ffc16b] selection:text-black relative">
        {/* Global Fixed Celestial Realm Background - High Res Smooth Scene */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <img 
            src="/assets/d3d3a.png" 
            alt="DBUU Celestial Realm" 
            className="w-full h-full object-cover scale-[1.03] animate-pulse-subtle"
          />
          {/* Subtle atmospheric vignette so cards and text remain readable without turning the page black */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
        </div>

        {/* Top Navbar */}
        <div className="relative z-40">
          <Navbar />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 relative z-10 bg-transparent">
          {children}
        </main>
        
        {/* Footer */}
        <div className="relative z-20">
          <Footer />
        </div>
      </body>
    </html>
  );
}
