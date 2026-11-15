'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  Folder, 
  Sparkles, 
  Star,
  PlusCircle,
  X,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

interface StudyResource {
  id: string;
  title: string;
  dept: string;
  deptName: string;
  sem: string;
  type: string;
  size: string;
  downloads: number;
  rating: number;
  tags: string[];
  link?: string;
}

export default function StudyVaultPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedList, setDownloadedList] = useState<string[]>([]);
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDept, setUploadDept] = useState('engineering');
  const [uploadSem, setUploadSem] = useState('Semester 3 / 4');
  const [uploadType, setUploadType] = useState('PYQ Question Bank');
  const [uploadSize, setUploadSize] = useState('4.2 MB');
  const [uploadLink, setUploadLink] = useState('');
  const [uploadTagInput, setUploadTagInput] = useState('');
  const [uploadTags, setUploadTags] = useState<string[]>(['PYQ', 'ExamPrep']);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const deptMap: Record<string, string> = {
    engineering: 'School of Engineering & Computing',
    management: 'School of Management & Commerce',
    pharmacy: 'School of Pharmacy',
    architecture: 'School of Architecture & Design',
    science: 'School of Allied Sciences'
  };

  useEffect(() => {
    fetch('/api/vault')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setResources(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleDownload = (id: string) => {
    if (!downloadedList.includes(id)) {
      setDownloadedList([...downloadedList, id]);
    }
    sounds.playSuccess();
    triggerConfetti();
  };

  const handleAddTag = () => {
    if (uploadTagInput.trim() && !uploadTags.includes(uploadTagInput.trim())) {
      setUploadTags([...uploadTags, uploadTagInput.trim()]);
      setUploadTagInput('');
      sounds.playClick();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setUploadTags(uploadTags.filter(t => t !== tag));
    sounds.playClick();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setErrorMsg('Please enter a title for the material/PYQ.');
      sounds.playError();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          dept: uploadDept,
          deptName: deptMap[uploadDept] || 'DBUU Department',
          sem: uploadSem,
          type: uploadType,
          size: uploadSize,
          link: uploadLink,
          tags: uploadTags
        })
      });

      const json = await res.json();
      if (json.success) {
        setResources([json.data, ...resources]);
        setUploadModalOpen(false);
        setUploadTitle('');
        setUploadLink('');
        sounds.playSuccess();
        triggerConfetti();
      } else {
        setErrorMsg(json.error || 'Failed to upload material');
        sounds.playError();
      }
    } catch {
      setErrorMsg('Submission error. Please retry.');
      sounds.playError();
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = resources.filter(r => {
    const matchDept = selectedDept === 'all' || r.dept === selectedDept;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchDept && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-10 glass-panel-glow border border-[#ffc16b]/30">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc16b]/10 border border-[#ffc16b]/30 text-[#ffc16b] text-xs font-mono font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              DBUU STUDY VAULT • OPEN STUDENT MATERIAL REPOSITORY
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Study Vault & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc16b] to-amber-300">
                Exam Preparation Archive
              </span>
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              Open-source academic repository with previous year question papers (PYQs), lab manuals, syllabus handouts, and lecture notes. Every student can upload and share study materials!
            </p>
          </div>

          {/* Action button to open Upload Modal */}
          <button
            onClick={() => {
              setUploadModalOpen(true);
              sounds.playClick();
            }}
            className="btn-cyber-primary px-6 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Material / PYQs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'All Departments' },
            { id: 'engineering', label: 'Engineering (SOEC)' },
            { id: 'management', label: 'Management (SoM)' },
            { id: 'pharmacy', label: 'Pharmacy' },
            { id: 'architecture', label: 'Architecture & Design' },
            { id: 'science', label: 'Allied Sciences' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDept(d.id);
                sounds.playClick();
              }}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === d.id
                  ? 'bg-[#ffc16b] text-black font-bold shadow-md'
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
            className="w-full pl-9 pr-4 py-2 bg-black/40 rounded-full border border-white/15 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#ffc16b] transition-colors backdrop-blur-sm"
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
              className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[#ffc16b]/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#ffc16b]/15 border border-[#ffc16b]/30 text-[#ffc16b] font-bold uppercase">
                    {res.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{res.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#ffc16b] transition-colors">
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
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
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

      {/* Upload Material Modal for Students */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setUploadModalOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-[#0e0714] border border-[#ffc16b]/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#ffc16b]" />
                <h3 className="text-xl font-bold text-white">Upload Study Material / PYQs</h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-full border border-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">
                  Material Title / Paper Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compiler Design End-Term Previous 3 Years Solved PYQs"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1.5">Department / School *</label>
                  <select
                    value={uploadDept}
                    onChange={(e) => setUploadDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#170a1a] rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
                  >
                    <option value="engineering">School of Engineering & Computing</option>
                    <option value="management">School of Management & Commerce</option>
                    <option value="pharmacy">School of Pharmacy</option>
                    <option value="architecture">School of Architecture & Design</option>
                    <option value="science">School of Allied Sciences</option>
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1.5">Semester</label>
                  <select
                    value={uploadSem}
                    onChange={(e) => setUploadSem(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#170a1a] rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3 / 4">Semester 3 / 4</option>
                    <option value="Semester 5 / 6">Semester 5 / 6</option>
                    <option value="Semester 7 / 8">Semester 7 / 8</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1.5">Material Category</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#170a1a] rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
                  >
                    <option value="PYQ Question Bank">PYQ Question Bank</option>
                    <option value="End-Term Question Paper">End-Term Question Paper</option>
                    <option value="Mid-Term Question Paper">Mid-Term Question Paper</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Syllabus & Blueprints">Syllabus & Blueprints</option>
                  </select>
                </div>

                {/* File size estimate */}
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1.5">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 4.5 MB"
                    value={uploadSize}
                    onChange={(e) => setUploadSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b] font-mono"
                  />
                </div>
              </div>

              {/* Link / Drive URL */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">
                  PDF / Google Drive / Document Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={uploadLink}
                  onChange={(e) => setUploadLink(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b] font-mono"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">Tags / Subject Keywords:</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type keyword and press Add"
                    value={uploadTagInput}
                    onChange={(e) => setUploadTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl border border-[#ffc16b]/40 bg-[#ffc16b]/10 text-[#ffc16b] text-xs font-bold hover:bg-[#ffc16b]/20 transition-all"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadTags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1.5"
                    >
                      #{t}
                      <button type="button" onClick={() => handleRemoveTag(t)} className="text-gray-500 hover:text-white">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-xs font-bold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-cyber-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Uploading...' : 'Publish to Vault'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
