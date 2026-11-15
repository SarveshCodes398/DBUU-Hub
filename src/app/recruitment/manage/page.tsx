'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  FileSpreadsheet, 
  Search, 
  Filter,
  UserCheck
} from 'lucide-react';
import { Application } from '@/lib/types';
import { store } from '@/lib/storage';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function RecruitmentManagePage() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app-dance-1',
      recruitmentId: 'dance-ikon-2026-volunteers',
      studentId: 'dbuu-std-101',
      studentName: 'Student Applicant #1',
      studentRoll: '23BCSE102',
      studentDept: 'School of Engineering (CSE)',
      studentPhone: '+91 98765 43210',
      studentEmail: 'student1@dbuu.ac.in',
      roleApplied: 'Sound, Lighting & Console Crew',
      experience: 'Managed console during school annual fest and fresher welcome.',
      whyJoin: 'Passionate about live acoustics, want to coordinate for DBUU Dance Ikon 2026.',
      status: 'shortlisted',
      submittedAt: '2026-02-11T14:20:00Z'
    },
    {
      id: 'app-dance-2',
      recruitmentId: 'dance-ikon-2026-volunteers',
      studentId: 'dbuu-std-102',
      studentName: 'Student Applicant #2',
      studentRoll: '24BBA014',
      studentDept: 'School of Management',
      studentPhone: '+91 98111 22334',
      studentEmail: 'student2@dbuu.ac.in',
      roleApplied: 'VIP Guest & Celebrity Escort',
      experience: 'Experienced in student coordination and event hospitality.',
      whyJoin: 'Eager to represent DBUU hospitality to celebrity dance choreographers.',
      status: 'pending',
      submittedAt: '2026-02-12T09:10:00Z'
    },
    {
      id: 'app-dance-3',
      recruitmentId: 'dance-ikon-2026-volunteers',
      studentId: 'dbuu-std-103',
      studentName: 'Student Applicant #3',
      studentRoll: '22BCA099',
      studentDept: 'School of Engineering & Computing',
      studentPhone: '+91 97654 32109',
      studentEmail: 'student3@dbuu.ac.in',
      roleApplied: 'Official Media, Reel Creator & Photographer',
      experience: 'Campus photography and video editing experience.',
      whyJoin: 'Want to produce the official cinematic aftermovie for Dance Ikon.',
      status: 'accepted',
      submittedAt: '2026-02-10T16:45:00Z'
    }
  ]);

  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const updateStatus = (appId: string, newStatus: Application['status']) => {
    setApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    if (newStatus === 'accepted') {
      sounds.playSuccess();
      triggerConfetti();
    } else {
      sounds.playClick();
    }
  };

  const filteredApps = applications.filter(app => {
    const matchRole = filterRole === 'all' || app.roleApplied === filterRole;
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchRole && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/recruitment"
        onClick={() => sounds.playClick()}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        BACK TO RECRUITMENT PORTAL
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-cyan-400" />
            Organizer Candidate Review Desk
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review incoming volunteer applications, shortlist candidates, grant duty leave recommendations, and export rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
            Active Event: DBUU Dance Ikon 2026
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 text-xs font-mono">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-gray-400 block mb-1">TOTAL APPLICANTS</span>
          <span className="text-2xl font-bold text-white">{applications.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20">
          <span className="text-gray-400 block mb-1">SELECTED & CONFIRMED</span>
          <span className="text-2xl font-bold text-emerald-400">
            {applications.filter(a => a.status === 'accepted').length}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-amber-500/20">
          <span className="text-gray-400 block mb-1">SHORTLISTED</span>
          <span className="text-2xl font-bold text-amber-400">
            {applications.filter(a => a.status === 'shortlisted').length}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">
          <span className="text-gray-400 block mb-1">DUTY LEAVE CREDITS</span>
          <span className="text-2xl font-bold text-cyan-300">Auto-Synced</span>
        </div>
      </div>

      {/* Applicant table cards */}
      <div className="space-y-4">
        {filteredApps.map(app => (
          <div
            key={app.id}
            className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{app.studentName}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10">
                    {app.studentRoll}
                  </span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {app.studentDept} • {app.studentEmail} • {app.studentPhone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono uppercase font-bold px-3 py-1 rounded-full border ${
                  app.status === 'accepted' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
                  app.status === 'shortlisted' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                  app.status === 'rejected' ? 'bg-rose-950 text-rose-300 border-rose-500/40' :
                  'bg-surface-100 text-gray-300 border-white/10'
                }`}>
                  Status: {app.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-surface-100/50 border border-white/5 space-y-1">
                <span className="text-gray-400 font-mono block">Applied Role:</span>
                <span className="text-white font-bold text-sm text-cyan-300">{app.roleApplied}</span>
                <div className="pt-2 text-gray-300">
                  <span className="text-gray-400 font-mono block">Past Experience:</span>
                  {app.experience}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-100/50 border border-white/5 space-y-1">
                <span className="text-gray-400 font-mono block">Statement of Motivation:</span>
                <p className="text-gray-300 leading-relaxed italic">
                  "{app.whyJoin}"
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => updateStatus(app.id, 'shortlisted')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
              >
                Mark Shortlisted
              </button>

              <button
                onClick={() => updateStatus(app.id, 'accepted')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Select & Approve Duty Leave</span>
              </button>

              <button
                onClick={() => updateStatus(app.id, 'rejected')}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
