'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Gamepad2, 
  Users, 
  EyeOff, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Cpu, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sounds.setEnabled(next);
    if (next) sounds.playClick();
  };

  const navLinks = [
    { name: 'Hub Home', href: '/', icon: Sparkles },
    { name: 'Games Arcade', href: '/games', icon: Gamepad2, highlight: true },
    { name: 'Recruitment & Volunteering', href: '/recruitment', icon: Users, badge: 'Dance Ikon 2026' },
    { name: 'Anonymous Confessions', href: '/confessions', icon: EyeOff },
    { name: 'Campus Events', href: '/events', icon: Calendar },
    { name: 'Study Vault', href: '/vault', icon: BookOpen },
    { name: 'Vercel Benchmark', href: '/benchmark', icon: Cpu, techBadge: 'Stress Test' },
  ];

  const handleLinkClick = () => {
    sounds.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'glass-panel border-b border-cyan-500/20 shadow-lg shadow-cyan-950/20 py-2.5' 
        : 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand with IIT E-Summit style tech badge */}
          <Link 
            href="/" 
            onClick={handleLinkClick}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-neon-cyan">
              <div className="w-full h-full bg-[#070A12] rounded-xl flex items-center justify-center overflow-hidden">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-purple-400 text-lg">
                  DB
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-white text-base sm:text-lg group-hover:text-cyan-300 transition-colors">
                  DBUU<span className="text-cyan-400">.</span>HUB
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  NEXUS
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                Dev Bhoomi Uttarakhand University
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => sounds.playClick()}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 group ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.techBadge && (
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1 rounded">
                      {item.techBadge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundActive ? "Mute Sound Effects" : "Enable Sound Effects"}
              className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 text-gray-400 hover:text-cyan-300 transition-colors"
            >
              {soundActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Quick Profile / Student Passport Link */}
            <Link
              href="/profile"
              onClick={() => sounds.playClick()}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                D
              </div>
              <span>Student ID</span>
            </Link>

            {/* Auth / Demo Entry Button */}
            <Link
              href="/auth/login"
              onClick={() => sounds.playClick()}
              className="btn-cyber-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Portal Entry</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-surface-100 border border-white/10 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-white/10 grid grid-cols-1 gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center px-2">
              <span className="text-xs text-gray-400">Dev Bhoomi Uttarakhand University</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                Vercel Edge Live
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
