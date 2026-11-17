'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  PlusCircle, 
  Crown, 
  Dice6, 
  Grid3X3, 
  Calculator,
  Compass,
  Play,
  GraduationCap,
  Calendar,
  Users,
  Rocket,
  X,
  ChevronDown
} from 'lucide-react';
import { sounds } from '@/lib/utils';

const chapters = [
  {
    number: "01",
    eyebrow: "Mind Games & Logic",
    title: "Master the grid, rule the board",
    copy: "Challenge algorithmic AI levels or duel fellow students in Grandmaster Chess, Campus Ludo Royale, Quantum Sudoku, and Speed Math Blitz.",
    align: "left",
    tag: "Multiplayer & Computer AI",
    ctaText: "Launch Games Arcade",
    ctaLink: "/games",
    sublinks: [
      { name: "Chess", href: "/games/chess", icon: Crown },
      { name: "Ludo", href: "/games/ludo", icon: Dice6 },
      { name: "Sudoku", href: "/games/sudoku", icon: Grid3X3 },
      { name: "Speed Math", href: "/games/maths", icon: Calculator },
    ]
  },
  {
    number: "02",
    eyebrow: "Volunteering & Stage Production",
    title: "Lead Uttarakhand's biggest stage",
    copy: "DBUU Dance Ikon 2026 is recruiting student volunteer coordinators for Stage Operations, VIP Escort, Console Crew, and Live Media. Approved duty leave & verified certificates granted.",
    align: "right",
    tag: "DBUU Dance Ikon 2026",
    ctaText: "Join Dance Ikon Crew",
    ctaLink: "/recruitment/apply/dance-ikon-2026-volunteers",
    secondaryText: "All Volunteer Listings",
    secondaryLink: "/recruitment"
  },
  {
    number: "03",
    eyebrow: "Anonymous Whispers Wall",
    title: "Unspoken thoughts, total privacy",
    copy: "Post your campus rants, hostel chronicles, and confessions with 100% cryptographic anonymity. Student names and identities are strictly hidden and never recorded.",
    align: "left",
    tag: "Zero Identity Leaks",
    ctaText: "Read Anonymous Wall",
    ctaLink: "/confessions",
    secondaryText: "Drop a Secret",
    secondaryLink: "/confessions/new"
  },
  {
    number: "04",
    eyebrow: "Student Conclaves & Tournaments",
    title: "Every student can host & shine",
    copy: "Register for upcoming university fests or host your own club tournament. All DBUU students have full access to publish and broadcast college events.",
    align: "right",
    tag: "Open Event Creation",
    ctaText: "Add College Event",
    ctaLink: "/events/new",
    secondaryText: "View Campus Events",
    secondaryLink: "/events"
  },
] as const;

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [introModalOpen, setIntroModalOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.14 }
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-left], [data-reveal-right]")
      .forEach((element) => observer.observe(element));

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Subtle interactive 3D perspective tracking on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const scrollToStory = () => {
    sounds.playClick();
    document.querySelector("#story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative bg-transparent text-[#fff8e9] overflow-x-hidden">
      
      {/* Top Scroll Indicator Progress Line */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/10 pointer-events-none" aria-hidden="true">
        <div
          className="h-full origin-left bg-[#f7cb73] shadow-[0_0_18px_#f7cb73]"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* ========================================================
          HERO LANDING SECTION — CLEAN & SHARP, EXACTLY LIKE GLOBAL SITE BG
          ======================================================== */}
      <section 
        className="relative -mt-[58px] sm:-mt-[65px] pt-[68px] sm:pt-[78px] min-h-[100svh] w-full flex flex-col items-center px-3 sm:px-6 overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hero Background — Crisp single layer matching the site global background architecture */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <picture className="w-full h-full">
            {/* Mobile portrait framing */}
            <source media="(max-width: 640px)" srcSet="/assets/hero-clean.webp" />
            {/* Desktop landscape framing */}
            <source media="(min-width: 641px)" srcSet="/assets/hero-landscape.jpg" />
            <img 
              src="/assets/hero-landscape.jpg" 
              alt="DBUU Hub Students Fantasy Horizon" 
              className="w-full h-full object-cover object-[center_28%] sm:object-center filter brightness-[0.96] contrast-[1.03] select-none"
            />
          </picture>

          {/* Subtle atmospheric gradient overlay: enhances text contrast and smoothly fades into the page */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-50% to-[#0b0710] pointer-events-none" />
        </div>

        {/* 3D Pop-Up Perspective Container for Student Characters & Content */}
        <div 
          ref={heroCardRef}
          style={{
            transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center animate-student-3d-pop"
        >
          <div className="flex min-h-[calc(100svh-6rem)] w-full flex-col items-center justify-center pt-2 sm:pt-4 pb-8 sm:pb-12">
            {/* Eyebrow Header with Star Dividers */}
            <div className="flex items-center justify-center gap-2 mb-1.5 sm:mb-2.5">
              <span className="text-[#f7cb73] text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(247,203,115,0.8)]">✦</span>
              <div className="flex flex-col items-center">
                <span className="font-serif tracking-[0.25em] sm:tracking-[0.3em] text-[10px] sm:text-xs md:text-sm text-[#fce8b8] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Dev Bhoomi Uttarakhand
                </span>
                <span className="font-serif tracking-[0.3em] sm:tracking-[0.38em] text-[8px] sm:text-[10px] md:text-xs text-[#f7cb73] uppercase mt-0.5">
                  → University ←
                </span>
              </div>
              <span className="text-[#f7cb73] text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(247,203,115,0.8)]">✦</span>
            </div>

            {/* Majestic Hero Title with Diagonal Orbital Golden Ring */}
            <div className="relative inline-block my-1.5 sm:my-3">
              {/* Orbital Golden Ring */}
              <svg 
                className="absolute -inset-6 sm:-inset-10 w-[120%] h-[150%] -left-[10%] -top-[25%] pointer-events-none overflow-visible z-20"
                viewBox="0 0 400 200"
              >
                <defs>
                  <linearGradient id="orbital-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff8db" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f7cb73" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#b47818" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <ellipse 
                  cx="200" 
                  cy="100" 
                  rx="180" 
                  ry="45" 
                  fill="none" 
                  stroke="url(#orbital-gold-grad)" 
                  strokeWidth="2.2"
                  transform="rotate(-14 200 100)"
                  className="drop-shadow-[0_0_12px_rgba(247,203,115,0.7)]"
                />
                {/* Glowing Particle orbiting */}
                <circle cx="360" cy="70" r="3.5" fill="#ffffff" className="drop-shadow-[0_0_10px_#fff] animate-ping" />
              </svg>

              {/* Title Text — Fully responsive font sizes */}
              <h1 className="font-cinzel text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fffbe8] via-[#f7cb73] to-[#b37516] drop-shadow-[0_5px_25px_rgba(0,0,0,0.9)] select-none">
                DBUU HUB
              </h1>
            </div>

            {/* Subtitle */}
            <p className="font-serif italic text-xs sm:text-base md:text-lg lg:text-xl text-[#f3eedd] max-w-xl sm:max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-0.5 mb-5 sm:mb-7 font-light px-2">
              Your Central Connection to Campus Life, Resources and Opportunities
            </p>

            {/* Two Hero Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-6 sm:mb-10 z-30 w-full sm:w-auto px-4">
              {/* Button 1: Explore the Hub */}
              <button
                onClick={scrollToStory}
                type="button"
                className="group relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-black flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_25px_rgba(247,203,115,0.45)] hover:shadow-[0_0_35px_rgba(247,203,115,0.75)] hover:scale-105 active:scale-95 bg-gradient-to-r from-[#ffe082] via-[#ffd54f] to-[#ffb300] border border-[#fff4cc] w-full sm:w-auto"
              >
                <div className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="font-black">Explore the Hub</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Button 2: Watch Intro */}
              <button
                onClick={() => {
                  setIntroModalOpen(true);
                  sounds.playClick();
                }}
                type="button"
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-[#fce8b8] flex items-center justify-center gap-2.5 transition-all duration-300 bg-black/50 hover:bg-black/75 border border-[#f7cb73]/50 hover:border-[#f7cb73] hover:shadow-[0_0_20px_rgba(247,203,115,0.3)] hover:scale-105 active:scale-95 backdrop-blur-md w-full sm:w-auto"
              >
                <div className="w-5 h-5 rounded-full border border-[#f7cb73]/60 flex items-center justify-center">
                  <Play className="w-3 h-3 text-[#f7cb73] fill-[#f7cb73] translate-x-0.5" />
                </div>
                <span>Watch Intro</span>
              </button>
            </div>
          </div>

          {/* 4 Feature Cards Grid Matching the Image Design */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-6 pb-8 sm:pb-12 z-30 px-1 sm:px-0">
            {/* Card 1: Academics */}
            <Link
              href="/vault"
              onClick={() => sounds.playClick()}
              className="group relative p-3 sm:p-4 md:p-5 rounded-2xl bg-black/65 hover:bg-black/85 border border-[#f7cb73]/30 hover:border-[#f7cb73] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(247,203,115,0.25)] flex flex-col items-center text-center backdrop-blur-md hover:-translate-y-1"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#f7cb73]/10 border border-[#f7cb73]/40 flex items-center justify-center mb-2 sm:mb-2.5 text-[#f7cb73] group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-white tracking-wide group-hover:text-[#f7cb73] transition-colors">
                Academics
              </h3>
              <p className="text-[9px] sm:text-[11px] md:text-xs text-gray-300 font-light mt-0.5 sm:mt-1 leading-snug">
                Notes, Syllabus, Study Resources
              </p>
            </Link>

            {/* Card 2: Events */}
            <Link
              href="/events"
              onClick={() => sounds.playClick()}
              className="group relative p-3 sm:p-4 md:p-5 rounded-2xl bg-black/65 hover:bg-black/85 border border-[#f7cb73]/30 hover:border-[#f7cb73] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(247,203,115,0.25)] flex flex-col items-center text-center backdrop-blur-md hover:-translate-y-1"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#f7cb73]/10 border border-[#f7cb73]/40 flex items-center justify-center mb-2 sm:mb-2.5 text-[#f7cb73] group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-white tracking-wide group-hover:text-[#f7cb73] transition-colors">
                Events
              </h3>
              <p className="text-[9px] sm:text-[11px] md:text-xs text-gray-300 font-light mt-0.5 sm:mt-1 leading-snug">
                College Events, Hackathons & More
              </p>
            </Link>

            {/* Card 3: Community */}
            <Link
              href="/confessions"
              onClick={() => sounds.playClick()}
              className="group relative p-3 sm:p-4 md:p-5 rounded-2xl bg-black/65 hover:bg-black/85 border border-[#f7cb73]/30 hover:border-[#f7cb73] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(247,203,115,0.25)] flex flex-col items-center text-center backdrop-blur-md hover:-translate-y-1"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#f7cb73]/10 border border-[#f7cb73]/40 flex items-center justify-center mb-2 sm:mb-2.5 text-[#f7cb73] group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-white tracking-wide group-hover:text-[#f7cb73] transition-colors">
                Community
              </h3>
              <p className="text-[9px] sm:text-[11px] md:text-xs text-gray-300 font-light mt-0.5 sm:mt-1 leading-snug">
                Connect, Discuss and Collaborate
              </p>
            </Link>

            {/* Card 4: Opportunities */}
            <Link
              href="/recruitment"
              onClick={() => sounds.playClick()}
              className="group relative p-3 sm:p-4 md:p-5 rounded-2xl bg-black/65 hover:bg-black/85 border border-[#f7cb73]/30 hover:border-[#f7cb73] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(247,203,115,0.25)] flex flex-col items-center text-center backdrop-blur-md hover:-translate-y-1"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#f7cb73]/10 border border-[#f7cb73]/40 flex items-center justify-center mb-2 sm:mb-2.5 text-[#f7cb73] group-hover:scale-110 transition-transform">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-white tracking-wide group-hover:text-[#f7cb73] transition-colors">
                Opportunities
              </h3>
              <p className="text-[9px] sm:text-[11px] md:text-xs text-gray-300 font-light mt-0.5 sm:mt-1 leading-snug">
                Internships, Placements & Projects
              </p>
            </Link>
          </div>

          {/* Golden Laurel Wreath Stats Ribbon — Fully Responsive */}
          <div className="w-full max-w-2xl mx-auto mt-5 sm:mt-7 p-2.5 sm:p-3.5 md:p-4 rounded-2xl bg-black/75 border border-[#f7cb73]/40 shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-between px-4 sm:px-8 md:px-10 z-30">
            {/* Left Laurel Leaves SVG */}
            <div className="w-6 h-8 sm:w-8 sm:h-10 md:w-10 md:h-12 text-[#f7cb73] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 48" className="w-full h-full fill-current drop-shadow-[0_0_6px_rgba(247,203,115,0.6)]">
                <path d="M18 42 C12 36 6 26 8 14 C10 8 16 2 18 0 C18 6 16 12 14 18 C12 24 16 32 18 42 Z" opacity="0.9" />
                <path d="M14 12 C10 10 5 12 2 16 C5 17 9 16 12 13 Z" />
                <path d="M12 20 C7 18 3 21 0 26 C3 27 7 25 10 21 Z" />
                <path d="M11 29 C6 28 2 32 0 37 C4 37 8 34 10 30 Z" />
                <path d="M13 37 C9 37 5 41 4 46 C7 45 11 42 12 38 Z" />
              </svg>
            </div>

            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <span className="font-serif font-black text-lg sm:text-2xl md:text-3xl text-[#fff3cb] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                10K+
              </span>
              <span className="text-[9px] sm:text-xs text-gray-300 font-medium tracking-wider uppercase font-sans">
                Students
              </span>
            </div>

            <div className="w-[1px] h-6 sm:h-8 bg-[#f7cb73]/30" />

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <span className="font-serif font-black text-lg sm:text-2xl md:text-3xl text-[#fff3cb] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                20+
              </span>
              <span className="text-[9px] sm:text-xs text-gray-300 font-medium tracking-wider uppercase font-sans">
                Courses
              </span>
            </div>

            <div className="w-[1px] h-6 sm:h-8 bg-[#f7cb73]/30" />

            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <span className="font-serif font-black text-lg sm:text-2xl md:text-3xl text-[#fff3cb] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                50+
              </span>
              <span className="text-[9px] sm:text-xs text-gray-300 font-medium tracking-wider uppercase font-sans">
                Events
              </span>
            </div>

            {/* Right Laurel Leaves SVG */}
            <div className="w-6 h-8 sm:w-8 sm:h-10 md:w-10 md:h-12 text-[#f7cb73] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 48" className="w-full h-full fill-current drop-shadow-[0_0_6px_rgba(247,203,115,0.6)] scale-x-[-1]">
                <path d="M18 42 C12 36 6 26 8 14 C10 8 16 2 18 0 C18 6 16 12 14 18 C12 24 16 32 18 42 Z" opacity="0.9" />
                <path d="M14 12 C10 10 5 12 2 16 C5 17 9 16 12 13 Z" />
                <path d="M12 20 C7 18 3 21 0 26 C3 27 7 25 10 21 Z" />
                <path d="M11 29 C6 28 2 32 0 37 C4 37 8 34 10 30 Z" />
                <path d="M13 37 C9 37 5 41 4 46 C7 45 11 42 12 38 Z" />
              </svg>
            </div>
          </div>

          {/* Scroll to Explore Mouse Indicator */}
          <div 
            onClick={scrollToStory}
            className="mt-6 sm:mt-10 flex flex-col items-center cursor-pointer group z-30 opacity-90 hover:opacity-100 transition-opacity"
          >
            {/* Mouse Outline SVG */}
            <div className="w-5 h-7 sm:w-5.5 sm:h-8 rounded-full border-2 border-[#f7cb73]/70 flex items-start justify-center p-1 shadow-[0_0_10px_rgba(247,203,115,0.3)]">
              <div className="w-1.5 h-2 rounded-full bg-[#f7cb73] animate-bounce" />
            </div>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-[#f7cb73] uppercase mt-1.5 font-bold">
              Scroll To Explore
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#f7cb73] animate-bounce -mt-0.5" />
          </div>

        </div>
      </section>

      {/* ========================================================
          WATCH INTRO VIDEO / TOUR MODAL
          ======================================================== */}
      {introModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="relative w-full max-w-2xl bg-[#140b1e] border border-[#f7cb73]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(247,203,115,0.3)] text-center space-y-4">
            <button
              onClick={() => setIntroModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#f7cb73]/20 border border-[#f7cb73]/60 flex items-center justify-center mx-auto text-[#f7cb73]">
              <Compass className="w-6 h-6 animate-spin" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7cb73] to-amber-400">
              Welcome to DBUU HUB
            </h3>

            <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
              Dev Bhoomi Uttarakhand University’s central student nexus. Compete in Grandmaster Chess and Campus Ludo, discover upcoming college festivals, access verified exam vault papers, and connect with peer leaders.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="block text-lg font-bold text-amber-400">10K+</span>
                <span className="text-[10px] text-gray-400">Students Active</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="block text-lg font-bold text-amber-400">4 Games</span>
                <span className="text-[10px] text-gray-400">Multiplayer & AI</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="block text-lg font-bold text-amber-400">100%</span>
                <span className="text-[10px] text-gray-400">Anonymous Wall</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="block text-lg font-bold text-amber-400">Dance Ikon</span>
                <span className="text-[10px] text-gray-400">Volunteer Crews</span>
              </div>
            </div>

            <div className="pt-3 flex justify-center gap-3">
              <Link
                href="/games"
                onClick={() => {
                  setIntroModalOpen(false);
                  sounds.playClick();
                }}
                className="btn-cyber-primary px-6 py-2.5 text-xs font-bold"
              >
                Launch Games Arcade
              </Link>
              <button
                onClick={() => setIntroModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-bold text-gray-300 hover:text-white hover:border-[#f7cb73]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CHAPTERS STORY SECTION — PRESERVING ALL EXISTING ROUTES
          ======================================================== */}
      <div id="story" className="relative z-10 w-full pt-8 sm:pt-14">
        {chapters.map((chapter, index) => {
          const isRightSide = chapter.align === "right";

          return (
            <section
              key={chapter.number}
              id={index === 1 ? "dance-ikon" : index === 2 ? "confessions" : undefined}
              className={`chapter-wrapper w-full flex items-center justify-center ${
                isRightSide ? "md:justify-end" : "md:justify-start"
              }`}
            >
              <article 
                className={`chapter__card w-full mx-auto ${
                  isRightSide ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0"
                }`} 
                {...(isRightSide ? { 'data-reveal-right': '' } : { 'data-reveal-left': '' })}
              >
                <div className="chapter__meta">
                  <span>{chapter.number}</span>
                  <i />
                  <span>{chapter.eyebrow}</span>
                </div>
                <h2>{chapter.title}</h2>
                <p>{chapter.copy}</p>

                {/* Sublinks for Games chapter */}
                {'sublinks' in chapter && chapter.sublinks && (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {chapter.sublinks.map((sub, i) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={i}
                          href={sub.href}
                          onClick={() => sounds.playClick()}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-[#f7cb73] hover:text-white transition-all backdrop-blur-md"
                        >
                          <SubIcon className="w-3.5 h-3.5" />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Chapter CTAs */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={chapter.ctaLink}
                    onClick={() => sounds.playClick()}
                    className="btn-cyber-primary px-5 sm:px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span>{chapter.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {'secondaryLink' in chapter && chapter.secondaryLink && (
                    <Link
                      href={chapter.secondaryLink}
                      onClick={() => sounds.playClick()}
                      className="px-4 py-2.5 rounded-full border border-white/20 hover:border-[#f7cb73] text-xs font-bold text-gray-300 hover:text-white transition-all bg-black/30 backdrop-blur-md text-center w-full sm:w-auto"
                    >
                      {chapter.secondaryText}
                    </Link>
                  )}
                </div>
              </article>
            </section>
          );
        })}
      </div>

      {/* Epilogue Section */}
      <section className="epilogue relative z-20 flex min-h-[70svh] items-center justify-center overflow-hidden px-4 sm:px-6 text-center">
        <div className="epilogue__orb" aria-hidden="true" />
        <div className="relative max-w-3xl" data-reveal>
          <p className="mb-4 sm:mb-6 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e9af67]">
            Dev Bhoomi Uttarakhand University
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-light">
            Created for Every Student.
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            Play mind sports, recruit your event dream team, publish college events, and share confessions with complete peace of mind.
          </p>

          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/events/new"
              onClick={() => sounds.playClick()}
              className="btn-cyber-primary px-6 py-3 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Host College Event</span>
            </Link>
            <Link
              href="/games"
              onClick={() => sounds.playClick()}
              className="px-6 py-3 rounded-full border border-white/20 hover:border-[#f7cb73] text-xs font-bold text-gray-200 bg-black/40 backdrop-blur-md w-full sm:w-auto text-center"
            >
              Enter Games Arcade
            </Link>
          </div>

          <div>
            <button
              className="return-button"
              type="button"
              onClick={() => {
                sounds.playClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Return to the beginning
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
