'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  Folder, 
  Sparkles, 
  ChevronRight, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function StudyVaultPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedList, setDownloadedList] = useState<string[]>([]);

  const resources = [
    {
      id: 'res-1',
      title: 'Data Structures & Algorithms — End-Term Previous 5 Years PYQs',
      dept: 'engineering',
      deptName: 'School of Engineering & Computing',
      sem: 'Semester 3 / 4',
      type: 'PYQ Question Bank',
      size: '4.8 MB',
      downloads: 412,
      rating: 4.9,
      tags: ['B.Tech CSE', 'Algorithms', 'PYQ']
    },
    {
      id: 'res-2',
      title: 'Operating Systems & Linux Kernel Lab Manual 2026',
      dept: 'engineering',
      deptName: 'School of Engineering & Computing',
      sem: 'Semester 4',
      type: 'Lab Manual',
      size: '6.2 MB',
      downloads: 320,
      rating: 4.8,
      tags: ['OS', 'Linux', 'Lab']
    },
    {
      id: 'res-3',
      title: 'Corporate Financial Management & Business Analytics Notes',
      dept: 'management',
      deptName: 'School of Management & Commerce',
      sem: 'MBA / BBA Sem 2',
      type: 'Lecture Notes',
      size: '3.4 MB',
      downloads: 215,
      rating: 4.7,
      tags: ['Finance', 'MBA', 'Analytics']
    },
    {
      id: 'res-4',
      title: 'Pharmacology & Medicinal Chemistry Comprehensive Guide',
      dept: 'pharmacy',
      deptName: 'School of Pharmacy',
      sem: 'B.Pharm Sem 5',
      type: 'Study Guide',
      size: '8.1 MB',
      downloads: 188,
      rating: 4.9,
      tags: ['Pharmacy', 'Medicinal', 'B.Pharm']
    },
    {
      id: 'res-5',
      title: 'Architectural Drafting & CAD Principles Blueprint Pack',
      dept: 'architecture',
      deptName: 'School of Architecture & Design',
      sem: 'B.Arch Sem 3',
      type: 'Design Portfolio & Notes',
      size: '12.5 MB',
      downloads: 142,
      rating: 4.8,
      tags: ['Architecture', 'AutoCAD', 'Design']
    }
  ];

  const handleDownload = (id: string) => {
    if (!downloadedList.includes(id)) {
      setDownloadedList([...downloadedList, id]);
    }
    sounds.playSuccess();
    triggerConfetti();
  };

  const filtered = resources.filter(r => {
    const matchDept = selectedDept === 'all' || r.dept === selectedDept;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchDept && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-10 glass-panel-glow border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <BookOpen className="w-4 h-4" />
            DBUU ACADEMIC VAULT • OPEN STUDENT REPOSITORY
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            STUDY VAULT & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              EXAM PREPARATION ARCHIVE
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Free open-source academic repository curated by seniors & student leads: previous year question papers (PYQs), solved lab manuals, syllabus handouts, and master revision notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'All Departments' },
            { id: 'engineering', label: 'Engineering (SOEC)' },
            { id: 'management', label: 'Management (SoM)' },
            { id: 'pharmacy', label: 'Pharmacy Block' },
            { id: 'architecture', label: 'Architecture & Design' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDept(d.id);
                sounds.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === d.id
                  ? 'bg-cyan-500 text-black shadow-neon-cyan font-bold'
                  : 'glass-panel text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search PYQs, subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-100 rounded-xl border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(res => {
          const isDownloaded = downloadedList.includes(res.id);
          return (
            <div
              key={res.id}
              className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold uppercase">
                    {res.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{res.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    {res.deptName} • {res.sem}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {res.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs font-mono text-gray-400">
                  <span>{res.size}</span> • <span>{res.downloads} downloads</span>
                </div>

                <button
                  onClick={() => handleDownload(res.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isDownloaded
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'btn-cyber-primary'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloaded ? 'Downloaded ✓' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
