'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Gamepad2, 
  Users, 
  EyeOff, 
  Calendar, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronRight,
  PlusCircle,
  Home,
  UserCheck
} from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sounds.setEnabled(next);
    if (next) sounds.playClick();
  };

  const navLinks = [
    { name: 'Hub Home', href: '/', icon: Home, desc: 'Central University Scene' },
    { name: 'Games Arcade', href: '/games', icon: Gamepad2, desc: 'Chess, Ludo, Sudoku, Speed Math', badge: 'Play AI & PvP' },
    { name: 'Volunteering & Recruitment', href: '/recruitment', icon: Users, desc: 'DBUU Dance Ikon 2026 & Crews', badge: 'Dance Ikon' },
    { name: 'Anonymous Confessions', href: '/confessions', icon: EyeOff, desc: '100% Identity Protected Whispers' },
    { name: 'College Events', href: '/events', icon: Calendar, desc: 'Fests, Conclaves & Campus Meets' },
    { name: 'Add College Event', href: '/events/new', icon: PlusCircle, desc: 'Open for every student to host', highlight: true },
    { name: 'Academic Vault', href: '/vault', icon: BookOpen, desc: 'Notes, Syllabus & PYQ Papers' },
    { name: 'Student Profile', href: '/profile', icon: UserCheck, desc: 'Student Passport & Game Stats' },
  ];

  const handleLinkClick = () => {
    sounds.playClick();
    setSidebarOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0b0710]/90 backdrop-blur-md border-b border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Minimalist Wordmark Logo */}
          <Link 
            href="/" 
            onClick={() => sounds.playClick()}
            className="wordmark flex items-center gap-2 group focus:outline-none"
          >
            <span>DBUU</span>
            <span className="text-[#ffc16b] font-light">HUB</span>
          </Link>

          {/* Right Action Controls: No text names on top! Just Sound, Add Event, and Sidebar Button */}
          <div className="flex items-center gap-3">
            {/* Direct Add Event quick pill */}
            <Link
              href="/events/new"
              onClick={() => sounds.playClick()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ffc16b]/40 bg-[#ffc16b]/10 hover:bg-[#ffc16b]/20 text-[#ffc16b] text-[11px] font-semibold tracking-wider uppercase transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add College Event</span>
            </Link>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundActive ? "Mute Sound Effects" : "Enable Sound Effects"}
              className="p-2.5 rounded-full border border-white/20 bg-black/30 hover:border-[#ffc16b]/60 text-white/80 hover:text-white transition-all backdrop-blur-sm"
            >
              {soundActive ? <Volume2 className="w-4 h-4 text-[#ffc16b]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Sidebar Drawer Trigger */}
            <button
              onClick={() => {
                setSidebarOpen(true);
                sounds.playClick();
              }}
              className="menu-button"
              type="button"
              aria-label="Open Navigation Sidebar"
            >
              <div className="hamburger-lines">
                <span />
                <span />
              </div>
              <span className="font-semibold text-[11px] tracking-[0.2em]">MENU</span>
            </button>
          </div>
        </div>
      </header>

      {/* Cyberpunk Sidebar Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md h-full bg-[#0d0813] border-l border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="wordmark text-2xl">
                  DBUU<span className="text-[#ffc16b]">.</span>HUB
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-full border border-white/20 hover:border-[#ffc16b] text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="py-6 space-y-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        item.highlight
                          ? 'border-[#ffc16b]/50 bg-[#ffc16b]/10 text-[#ffc16b]'
                          : isActive
                          ? 'border-[#ffc16b]/40 bg-white/10 text-white'
                          : 'border-white/5 bg-white/[0.02] text-gray-300 hover:bg-white/[0.06] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2 rounded-lg ${item.highlight ? 'bg-[#ffc16b]/20 text-[#ffc16b]' : 'bg-white/5 text-[#ffc16b]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 font-normal">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-white/10 text-xs text-gray-500 space-y-2">
              <p>Dev Bhoomi Uttarakhand University</p>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open-Source Campus Hub Live</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
