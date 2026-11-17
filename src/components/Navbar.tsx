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
  UserCheck,
  LogIn,
  LogOut,
  User,
  Search,
  Bell,
  Menu,
  Sparkles,
  Rocket,
  Crown,
  Dice6,
  Grid3X3,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundActive, setSoundActive] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; erpId?: string } | null>(null);

  useEffect(() => {
    // Check logged in user
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dbuu_auth_user');
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch (e) {}
      }
    }

    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn && data.user) {
          setCurrentUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('dbuu_auth_user', JSON.stringify(data.user));
          }
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setSearchOpen(false);
      }
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

  // Comprehensive search directory covering games, academics, events, community & opportunities
  const searchableItems = [
    { name: 'Grandmaster Chess', category: 'Games', desc: 'Online multiplayer & AI bot chess engine', href: '/games/chess', icon: Crown },
    { name: 'Campus Ludo Royale', category: 'Games', desc: '2, 3 or 4 players online & local goti arena', href: '/games/ludo', icon: Dice6 },
    { name: 'Quantum Sudoku', category: 'Games', desc: 'Interactive number placement grid with hints', href: '/games/sudoku', icon: Grid3X3 },
    { name: 'Speed Math Blitz', category: 'Games', desc: 'Fast paced arithmetic sprint against timer', href: '/games/maths', icon: Calculator },
    { name: 'Games Arcade Hub', category: 'Games', desc: 'Central campus multiplayer games lounge', href: '/games', icon: Gamepad2 },
    { name: 'Engineering Notes & Syllabus', category: 'Academics', desc: 'B.Tech CSE, Mechanical & Civil modules', href: '/vault', icon: BookOpen },
    { name: 'Previous Year Papers (PYQ)', category: 'Academics', desc: 'End-term exam papers, question banks & solutions', href: '/vault', icon: BookOpen },
    { name: 'Pharmacy & Sciences Vault', category: 'Academics', desc: 'Lab manuals, pharmaceutical chemistry study notes', href: '/vault', icon: BookOpen },
    { name: 'Pinaka Tech Fest 2026', category: 'Events', desc: '36-hour hackathon, robotics duel & codestorm', href: '/events', icon: Calendar },
    { name: 'DBUU Cultural Conclave', category: 'Events', desc: 'Annual battle of bands, fashion showcase & fest', href: '/events', icon: Calendar },
    { name: 'Publish College Event', category: 'Events', desc: 'Host your club tourney or conference', href: '/events/new', icon: PlusCircle },
    { name: 'Anonymous Whispers Wall', category: 'Community', desc: 'Unfiltered campus thoughts & hostel confessions', href: '/confessions', icon: EyeOff },
    { name: 'Post Anonymous Secret', category: 'Community', desc: 'Cryptographically untracked campus whisper', href: '/confessions/new', icon: EyeOff },
    { name: 'DBUU Dance Ikon 2026 Crew', category: 'Volunteering', desc: 'Stage operations, VIP escort & media console recruitment', href: '/recruitment/apply/dance-ikon-2026-volunteers', icon: Rocket },
    { name: 'All Volunteer Listings', category: 'Volunteering', desc: 'Campus conclaves, duties & leadership openings', href: '/recruitment', icon: Rocket },
    { name: 'Student Profile & Stats', category: 'Passport', desc: 'XP points, campus level, badges & game records', href: '/profile', icon: UserCheck },
  ];

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery 
    ? searchableItems.filter(item => 
        item.name.toLowerCase().includes(trimmedQuery) ||
        item.category.toLowerCase().includes(trimmedQuery) ||
        item.desc.toLowerCase().includes(trimmedQuery)
      )
    : [];
  const primaryLinks = [
    { name: 'Home', href: '/', active: pathname === '/' },
    { name: 'Hub', href: '/games', active: pathname.startsWith('/games') },
    { name: 'Events', href: '/events', active: pathname.startsWith('/events') },
    { name: 'Resources', href: '/vault', active: pathname.startsWith('/vault') },
    { name: 'Community', href: '/confessions', active: pathname.startsWith('/confessions') || pathname.startsWith('/recruitment') },
  ];

  // Full drawer links for complete site navigation
  const allNavLinks = [
    { name: 'Home Landing', href: '/', icon: Home, desc: 'Central University Scene' },
    { name: 'Games Arcade (Hub)', href: '/games', icon: Gamepad2, desc: 'Chess, Ludo, Sudoku, Speed Math', badge: 'Play AI & PvP' },
    { name: 'Events & Conclaves', href: '/events', icon: Calendar, desc: 'Fests, Conclaves & Campus Meets' },
    { name: 'Add College Event', href: '/events/new', icon: PlusCircle, desc: 'Open for every student to host', highlight: true },
    { name: 'Academic Vault (Resources)', href: '/vault', icon: BookOpen, desc: 'Notes, Syllabus & PYQ Papers' },
    { name: 'Community & Confessions', href: '/confessions', icon: EyeOff, desc: '100% Cryptographic Anonymity' },
    { name: 'Volunteering & Opportunities', href: '/recruitment', icon: Rocket, desc: 'DBUU Dance Ikon 2026 & Crews', badge: 'Dance Ikon' },
    { name: 'Student Profile & Stats', href: '/profile', icon: UserCheck, desc: 'Student Passport & Game Stats' },
  ];

  const handleLinkClick = () => {
    sounds.playClick();
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dbuu_auth_user');
    }
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <>
      {/* Navbar — Styled exactly per the golden heraldic design */}
      <header className="sticky top-0 z-40 w-full bg-[#0d0714]/75 backdrop-blur-md border-b border-[#f7cb73]/20 py-2.5 sm:py-3.5 transition-all shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo with Winged Crest and Golden Serif Wordmark */}
          <Link 
            href="/" 
            onClick={() => sounds.playClick()}
            className="flex items-center gap-2.5 group focus:outline-none select-none"
          >
            {/* Golden Winged Emblem */}
            <div className="relative flex items-center justify-center">
              <svg 
                viewBox="0 0 54 36" 
                className="w-8 h-6 sm:w-9 sm:h-7 drop-shadow-[0_2px_10px_rgba(247,203,115,0.65)] transition-transform duration-300 group-hover:scale-105" 
                fill="none"
              >
                <defs>
                  <linearGradient id="gold-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff8db" />
                    <stop offset="40%" stopColor="#f7cb73" />
                    <stop offset="100%" stopColor="#b47818" />
                  </linearGradient>
                  <linearGradient id="gold-grad-right" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fff8db" />
                    <stop offset="40%" stopColor="#f7cb73" />
                    <stop offset="100%" stopColor="#b47818" />
                  </linearGradient>
                </defs>
                {/* Central Star Crown */}
                <path d="M27 6 L29 11 L34 11 L30 14 L31.5 19 L27 16 L22.5 19 L24 14 L20 11 L25 11 Z" fill="#fff5cc" />
                {/* Left Feather Wings */}
                <path d="M25 11 C18 5 9 4 3 8 C8 12 13 16 18 20 C20 16 23 13 25 11 Z" fill="url(#gold-grad-left)" />
                <path d="M23 15 C17 10 9 10 5 14 C10 17 14 20 18 24 C20 20 22 17 23 15 Z" fill="url(#gold-grad-left)" opacity="0.85" />
                <path d="M21 20 C16 16 10 16 7 20 C11 22 15 25 18 28 C20 24 21 22 21 20 Z" fill="url(#gold-grad-left)" opacity="0.7" />
                {/* Right Feather Wings */}
                <path d="M29 11 C36 5 45 4 51 8 C46 12 41 16 36 20 C34 16 31 13 29 11 Z" fill="url(#gold-grad-right)" />
                <path d="M31 15 C37 10 45 10 49 14 C44 17 40 20 36 24 C34 20 32 17 31 15 Z" fill="url(#gold-grad-right)" opacity="0.85" />
                <path d="M33 20 C38 16 44 16 47 20 C43 22 39 25 36 28 C34 24 33 22 33 20 Z" fill="url(#gold-grad-right)" opacity="0.7" />
              </svg>
            </div>

            {/* Typography */}
            <span className="font-serif font-black text-lg sm:text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#fff7dd] via-[#f7cb73] to-[#d6962f] drop-shadow-[0_2px_8px_rgba(247,203,115,0.35)]">
              DBUU HUB
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => sounds.playClick()}
                className={`transition-all duration-200 relative py-1 ${
                  link.active
                    ? 'text-[#fce3a4] font-semibold drop-shadow-[0_0_8px_rgba(247,203,115,0.5)] after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#f7cb73] after:to-transparent'
                    : 'text-gray-300 hover:text-[#f7cb73]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Search Button */}
            <button
              onClick={() => {
                setSearchOpen(true);
                sounds.playClick();
              }}
              title="Search DBUU Hub"
              className="p-2 sm:p-2.5 rounded-full text-gray-300 hover:text-[#f7cb73] hover:bg-[#f7cb73]/10 transition-all border border-transparent hover:border-[#f7cb73]/30"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Notification Bell */}
            <Link
              href="/events"
              onClick={() => sounds.playClick()}
              title="Campus Notifications"
              className="p-2 sm:p-2.5 rounded-full text-gray-300 hover:text-[#f7cb73] hover:bg-[#f7cb73]/10 transition-all relative border border-transparent hover:border-[#f7cb73]/30"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {/* Notification Pip */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316] animate-pulse" />
            </Link>

            {/* Profile Avatar inside Golden Ring */}
            <Link
              href={currentUser ? "/profile" : "/auth/login"}
              onClick={() => sounds.playClick()}
              className={`p-1.5 sm:p-2 rounded-full border transition-all flex items-center gap-1.5 shadow-sm ${
                currentUser 
                  ? 'border-[#f7cb73] bg-[#f7cb73]/20 text-[#f7cb73] shadow-[0_0_12px_rgba(247,203,115,0.4)]' 
                  : 'border-[#f7cb73]/60 bg-black/40 hover:border-[#f7cb73] text-[#f7cb73] hover:shadow-[0_0_10px_rgba(247,203,115,0.3)]'
              }`}
              title={currentUser ? `Signed in as ${currentUser.name}` : "Login / Sign in"}
              aria-label="Profile"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#f7cb73]" />
              {currentUser && (
                <span className="hidden xl:inline text-xs font-mono font-bold text-white max-w-[90px] truncate pr-1">
                  {currentUser.name}
                </span>
              )}
            </Link>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundActive ? "Mute Sound Effects" : "Enable Sound Effects"}
              className="p-2 sm:p-2.5 rounded-full border border-white/10 bg-black/30 hover:border-[#f7cb73]/50 text-gray-400 hover:text-white transition-all hidden sm:flex"
            >
              {soundActive ? <Volume2 className="w-4 h-4 text-[#f7cb73]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Mobile / Full Menu Drawer Trigger */}
            <button
              onClick={() => {
                setSidebarOpen(true);
                sounds.playClick();
              }}
              className="p-2 rounded-xl border border-[#f7cb73]/40 bg-[#f7cb73]/10 hover:bg-[#f7cb73]/20 text-[#f7cb73] transition-all flex items-center gap-1.5 md:hidden"
              type="button"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Search Dialog Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#140b1e] border border-[#f7cb73]/40 rounded-2xl p-5 shadow-[0_0_40px_rgba(247,203,115,0.25)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#f7cb73] font-serif font-bold text-base">
                <Search className="w-4 h-4" />
                <span>Search DBUU Nexus</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search notes, events, clubs, games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#f7cb73]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dynamic Search Results */}
            {trimmedQuery ? (
              <div className="space-y-1.5 pt-1 max-h-72 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between pb-1.5 px-1 text-[11px] font-mono text-gray-400">
                  <span>Search Results ({searchResults.length}):</span>
                  <span className="text-[#f7cb73]">Press any to navigate</span>
                </div>

                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          sounds.playClick();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-[#f7cb73]/15 border border-white/5 hover:border-[#f7cb73]/40 text-gray-200 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#f7cb73]/10 border border-[#f7cb73]/30 flex items-center justify-center text-[#f7cb73] shrink-0 group-hover:scale-105 transition-transform">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-white group-hover:text-[#f7cb73] transition-colors truncate">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-gray-400 truncate">
                              {item.desc}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-amber-300">
                            {item.category}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#f7cb73] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-gray-400 font-mono space-y-1 bg-white/5 rounded-xl border border-white/5">
                    <div>No results found for &quot;{searchQuery}&quot;</div>
                    <div className="text-[10px] text-gray-500">Try searching for &quot;chess&quot;, &quot;ludo&quot;, &quot;notes&quot;, &quot;dance&quot;, or &quot;events&quot;</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
                  Quick Shortcuts:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/games"
                    onClick={() => { setSearchOpen(false); sounds.playClick(); }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-[#f7cb73]/15 border border-white/5 hover:border-[#f7cb73]/40 text-gray-200 transition-all flex items-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4 text-amber-400" />
                    <span>Games Arcade</span>
                  </Link>
                  <Link
                    href="/vault"
                    onClick={() => { setSearchOpen(false); sounds.playClick(); }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-[#f7cb73]/15 border border-white/5 hover:border-[#f7cb73]/40 text-gray-200 transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Academic Vault</span>
                  </Link>
                  <Link
                    href="/events"
                    onClick={() => { setSearchOpen(false); sounds.playClick(); }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-[#f7cb73]/15 border border-white/5 hover:border-[#f7cb73]/40 text-gray-200 transition-all flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>College Events</span>
                  </Link>
                  <Link
                    href="/recruitment"
                    onClick={() => { setSearchOpen(false); sounds.playClick(); }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-[#f7cb73]/15 border border-white/5 hover:border-[#f7cb73]/40 text-gray-200 transition-all flex items-center gap-2"
                  >
                    <Rocket className="w-4 h-4 text-amber-400" />
                    <span>Volunteering</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cyberpunk & Fantasy Sidebar Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-[92vw] sm:max-w-md h-full bg-[#0d0714] border-l border-[#f7cb73]/30 p-5 sm:p-7 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto no-scrollbar">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-xl text-[#f7cb73]">
                    DBUU HUB
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f7cb73]/20 text-[#f7cb73] border border-[#f7cb73]/30 font-mono">
                    NEXUS
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-full border border-white/20 hover:border-[#f7cb73] text-gray-400 hover:text-white transition-all"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links Grid */}
              <nav className="mt-5 space-y-2">
                {allNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`group flex items-center justify-between p-3 rounded-xl transition-all border ${
                        link.highlight
                          ? 'border-[#f7cb73]/60 bg-[#f7cb73]/15 text-[#f7cb73] shadow-[0_0_15px_rgba(247,203,115,0.2)]'
                          : isActive 
                            ? 'border-[#f7cb73]/50 bg-white/10 text-white' 
                            : 'border-white/5 hover:border-[#f7cb73]/30 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${
                          link.highlight 
                            ? 'bg-[#f7cb73] text-black font-bold' 
                            : isActive 
                              ? 'bg-[#f7cb73]/20 text-[#f7cb73]' 
                              : 'bg-black/50 text-gray-400 group-hover:text-[#f7cb73]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                            <span>{link.name}</span>
                            {link.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 block truncate">
                            {link.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#f7cb73] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-[#f7cb73]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-full bg-[#f7cb73]/20 border border-[#f7cb73]/50 flex items-center justify-center text-[#f7cb73] font-bold text-xs">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate text-xs">
                        <div className="font-bold text-white truncate">{currentUser.name}</div>
                        {currentUser.erpId && (
                          <div className="text-[10px] font-mono text-cyan-400">ERP: {currentUser.erpId}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={handleLinkClick}
                  className="w-full py-2.5 rounded-xl border border-[#f7cb73] bg-gradient-to-r from-amber-600/40 via-amber-500/50 to-amber-600/40 hover:bg-amber-500/60 text-[#fff4d1] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(247,203,115,0.25)] transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with ERP ID</span>
                </Link>
              )}

              <p className="text-[10px] text-center text-gray-500 font-mono">
                Dev Bhoomi Uttarakhand University • DBUU HUB
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
