'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  PlusCircle, 
  Crown, 
  Dice6, 
  Grid3X3, 
  Calculator 
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

function ArrowDown() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M12 4v15m0 0 6-6m-6 6-6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);

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
      { threshold: 0.18 }
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

  const goToStory = () => {
    sounds.playClick();
    document.querySelector("#story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative bg-[#0b0710] text-[#fff8e9] overflow-hidden">
      
      {/* Top Scroll Indicator Progress Line */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/10" aria-hidden="true">
        <div
          className="h-full origin-left bg-[#ffc16b] shadow-[0_0_18px_#ffc16b]"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <section className="scene" aria-label="DBUU University Hub">
        {/* Sticky Visual Background Scene using uploaded high-res image */}
        <div className="scene__visual" aria-hidden="true">
          <img src="/assets/bg-castle.jpg" alt="DBUU Celestial Realm" />
          <div className="scene__veil" />
          <div className="scene__glow" />
        </div>

        {/* Hero Section */}
        <div
          id="top"
          className="hero relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
        >
          <div className="hero__content">
            <p className="hero__eyebrow">
              Dev Bhoomi Uttarakhand University
            </p>
            
            {/* Connection Hub heading where Hub is strictly in black text */}
            <h1 className="tracking-tight">
              Connection
              <span className="inline-block ml-3 px-4 py-0.5 rounded-2xl bg-[#ffc16b] text-black font-extrabold not-italic shadow-[0_4px_25px_rgba(255,193,107,0.7)] text-[0.82em] align-middle">
                Hub
              </span>
            </h1>

            {/* Subtitle updated per instruction */}
            <p className="hero__copy">
              Connect and Explore Hub
            </p>

            <button className="explore-button group" type="button" onClick={goToStory}>
              <span>Enter the Hub</span>
              <span className="transition-transform duration-300 group-hover:translate-y-1">
                <ArrowDown />
              </span>
            </button>
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll to explore</span>
            <i />
          </div>
        </div>

        {/* Chapters Story Section with alternating smooth card entrances */}
        <div id="story" className="relative z-10">
          {chapters.map((chapter, index) => {
            // First card pops in from left, second from right, third from left, fourth from right
            const isLeftEntrance = index % 2 === 0;
            return (
              <section
                className={`chapter chapter--${chapter.align}`}
                id={index === 1 ? "dance-ikon" : index === 2 ? "confessions" : undefined}
                key={chapter.number}
              >
                <article 
                  className="chapter__card" 
                  {...(isLeftEntrance ? { 'data-reveal-left': '' } : { 'data-reveal-right': '' })}
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
                    <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-mono">
                      {chapter.sublinks.map((sub, i) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={i}
                            href={sub.href}
                            onClick={() => sounds.playClick()}
                            className="flex items-center gap-2 p-2 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[#ffc16b] hover:text-white transition-all backdrop-blur-sm"
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
                      className="btn-cyber-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
                    >
                      <span>{chapter.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {'secondaryLink' in chapter && chapter.secondaryLink && (
                      <Link
                        href={chapter.secondaryLink}
                        onClick={() => sounds.playClick()}
                        className="px-4 py-2.5 rounded-full border border-white/20 hover:border-[#ffc16b] text-xs font-bold text-gray-300 hover:text-white transition-all bg-black/25 backdrop-blur-sm"
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
      </section>

      {/* Epilogue Section */}
      <section className="epilogue relative z-20 flex min-h-[75svh] items-center justify-center overflow-hidden px-6 text-center">
        <div className="epilogue__orb" aria-hidden="true" />
        <div className="relative max-w-3xl" data-reveal>
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e9af67]">
            Dev Bhoomi Uttarakhand University
          </p>
          <h2 className="text-4xl leading-[1] font-light md:text-6xl lg:text-7xl">
            Created for Every Student.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            Play mind sports, recruit your event dream team, publish college events, and share confessions with complete peace of mind.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/events/new"
              onClick={() => sounds.playClick()}
              className="btn-cyber-primary px-6 py-3 text-xs font-bold flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Host College Event</span>
            </Link>
            <Link
              href="/games"
              onClick={() => sounds.playClick()}
              className="px-6 py-3 rounded-full border border-white/20 hover:border-[#ffc16b] text-xs font-bold text-gray-200 bg-black/30 backdrop-blur-sm"
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
