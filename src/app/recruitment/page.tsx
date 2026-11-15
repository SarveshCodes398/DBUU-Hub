'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  PlusCircle, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { RecruitmentPost } from '@/lib/types';
import { initialRecruitmentPosts } from '@/lib/data';
import { sounds } from '@/lib/utils';

export default function RecruitmentPage() {
  const [posts, setPosts] = useState<RecruitmentPost[]>(initialRecruitmentPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch live posts from API
    fetch('/api/recruitment')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPosts(data.data);
        }
      })
      .catch(() => {
        // Fallback to initial
      });
  }, []);

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'dance', label: 'Dance & Stage Arts' },
    { id: 'tech', label: 'Tech & Hackathons' },
    { id: 'sports', label: 'Sports & Leagues' },
    { id: 'media', label: 'Media & TEDx' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.rolesNeeded.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Section inspired by IIT Bombay E-Summit events page */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-10 glass-panel-glow border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-semibold">
              <Sparkles className="w-4 h-4 text-pink-400" />
              DBUU STUDENT RECRUITMENT & VOLUNTEERING PORTAL
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              LEAD THE CAMPUS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
                JOIN EVENT CREWS.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Recruit enthusiastic teammates or apply to core committees for flagship university events like <strong>DBUU Dance Ikon 2026</strong>, <strong>Pinak Fest</strong>, sports championships, and cultural meets. Gain verified certificates & duty leave.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <Link
              href="/recruitment/post"
              onClick={() => sounds.playClick()}
              className="btn-cyber-primary px-5 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Requirement</span>
            </Link>

            <Link
              href="/recruitment/manage"
              onClick={() => sounds.playClick()}
              className="px-5 py-3 text-xs sm:text-sm font-bold rounded-lg glass-panel hover:bg-white/10 text-gray-200 border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Organizer Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Spotlight: DBUU Dance Ikon 2026 */}
      <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900 border-2 border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                URGENT RECRUITMENT ACTIVE
              </span>
              <span className="text-xs text-pink-300 font-mono">
                Event Date: Feb 28, 2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              DBUU Dance Ikon 2026 — Core Volunteer Squad
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Uttarakhand’s premier collegiate dance battle is seeking coordinators for Stage Management, VIP Celebrity Escorts, Backstage Sound & Visual Console, and Media Coverage.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                ✓ Official Duty Leave
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300">
                ✓ Certificate of Leadership
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-pink-300">
                ✓ Backstage VIP Access
              </span>
            </div>
          </div>

          <Link
            href="/recruitment/apply/dance-ikon-2026-volunteers"
            onClick={() => sounds.playClick()}
            className="btn-cyber-purple px-6 py-3.5 text-sm font-bold flex items-center gap-2 shrink-0 shadow-neon-purple hover:scale-105 transition-all"
          >
            <span>APPLY FOR DANCE IKON</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                sounds.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-black shadow-neon-cyan font-bold'
                  : 'glass-panel text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles, fests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-100 rounded-xl border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Recruitment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-cyan-500/40 hover:shadow-neon-cyan transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header tags */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold uppercase">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  Deadline: {post.deadline}
                </span>
              </div>

              {/* Title & Organizer */}
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  Organized by: <span className="text-gray-200">{post.organizer}</span>
                </p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                {post.description}
              </p>

              {/* Roles Needed Tags */}
              <div>
                <span className="text-[11px] font-mono uppercase text-gray-400 block mb-1.5">
                  Open Positions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {post.rolesNeeded.map((role, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-100 border border-white/5 text-gray-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perks badges */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[10px] font-mono text-cyan-400">
                {post.perks.slice(0, 2).map((perk, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    {perk}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Footer & Action */}
            <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs font-mono text-gray-400">
                <span className="text-white font-bold">{post.applicantsCount}</span> applied • <span className="text-cyan-400">{post.spots} spots</span>
              </div>

              <Link
                href={`/recruitment/apply/${post.id}`}
                onClick={() => sounds.playClick()}
                className="btn-cyber-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 group-hover:shadow-neon-cyan"
              >
                <span>APPLY NOW</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
