'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { RecruitmentPost } from '@/lib/types';
import { initialRecruitmentPosts } from '@/lib/data';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function RecruitmentApplyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<RecruitmentPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Form states
  const [studentName, setStudentName] = useState('Aryan Vashistha');
  const [studentRoll, setStudentRoll] = useState('23BCSE042');
  const [studentDept, setStudentDept] = useState('School of Engineering & Computing');
  const [studentPhone, setStudentPhone] = useState('+91 98765 43210');
  const [studentEmail, setStudentEmail] = useState('demo@dbuu.ac.in');
  const [selectedRole, setSelectedRole] = useState('');
  const [experience, setExperience] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [agreeDutyLeave, setAgreeDutyLeave] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Look up in initial or fetch
    const found = initialRecruitmentPosts.find(p => p.id === id);
    if (found) {
      setPost(found);
      setSelectedRole(found.rolesNeeded[0] || '');
      setLoading(false);
    } else {
      fetch('/api/recruitment')
        .then(res => res.json())
        .then(data => {
          const matched = data.data?.find((p: RecruitmentPost) => p.id === id);
          if (matched) {
            setPost(matched);
            setSelectedRole(matched.rolesNeeded[0] || '');
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    if (!studentName || !studentRoll || !studentEmail || !selectedRole || !whyJoin) {
      setErrorMsg('Please complete all mandatory fields.');
      sounds.playError();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/recruitment/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentRoll,
          studentDept,
          studentPhone,
          studentEmail,
          roleApplied: selectedRole,
          experience,
          whyJoin,
          portfolioUrl
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmittedAppId(json.data.id);
        sounds.playSuccess();
        triggerConfetti();
      } else {
        setErrorMsg(json.error || 'Failed to submit application');
        sounds.playError();
      }
    } catch (err) {
      setErrorMsg('Submission error. Please retry.');
      sounds.playError();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-cyan-400">
        Loading recruitment data...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Recruitment listing not found</h2>
        <Link href="/recruitment" className="btn-cyber-primary px-4 py-2 text-xs font-bold inline-block">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/recruitment"
        onClick={() => sounds.playClick()}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        BACK TO RECRUITMENT BOARD
      </Link>

      {/* Confirmation State */}
      {submittedAppId ? (
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-emerald-500/50">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white">APPLICATION RECEIVED!</h1>
            <p className="text-sm text-gray-300 max-w-lg mx-auto">
              Your application for <strong>{post.title}</strong> as <strong>{selectedRole}</strong> has been officially logged in the DBUU Event Management Database.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-white/10 max-w-md mx-auto text-xs font-mono text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-400">Application ID:</span>
              <span className="text-cyan-300 font-bold">{submittedAppId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Candidate:</span>
              <span className="text-white">{studentName} ({studentRoll})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-amber-400 font-bold">Under Review by Organizers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duty Leave:</span>
              <span className="text-emerald-400">Eligible on Selection</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/recruitment/manage"
              onClick={() => sounds.playClick()}
              className="btn-cyber-primary px-5 py-2.5 text-xs font-bold"
            >
              View Application in Dashboard
            </Link>
            <Link
              href="/recruitment"
              onClick={() => sounds.playClick()}
              className="px-5 py-2.5 text-xs font-bold rounded-lg glass-panel hover:bg-white/10 text-gray-300"
            >
              Browse More Listings
            </Link>
          </div>
        </div>
      ) : (
        /* Application Form */
        <div className="space-y-8">
          {/* Header Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase">
                {post.category}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Deadline: {post.deadline}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {post.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {post.description}
            </p>

            <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-mono block mb-1">Key Perks:</span>
                <ul className="space-y-1 text-emerald-400 font-mono">
                  {post.perks.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-gray-400 font-mono block mb-1">Requirements:</span>
                <ul className="space-y-1 text-gray-300">
                  {post.requirements.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Student Volunteer Application Form
            </h2>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">University Roll Number *</label>
                <input
                  type="text"
                  required
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">Department / School *</label>
                <input
                  type="text"
                  required
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">Student Email Address *</label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">WhatsApp / Contact Number *</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">Desired Volunteer Role *</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  {post.rolesNeeded.map((r, i) => (
                    <option key={i} value={r} className="bg-slate-900 text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Past Experience / Relevant Clubs / Skills
              </label>
              <textarea
                rows={3}
                placeholder="E.g., Coordinated sound setup for school fests, managed social media handles, dance crew member, etc."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Why Join */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Why do you want to join this event organizing team? *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain what drives you and how you can add value to the event team..."
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Portfolio / LinkedIn / Drive Link */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Portfolio / LinkedIn / Instagram Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Duty Leave check */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="duty-leave"
                checked={agreeDutyLeave}
                onChange={(e) => setAgreeDutyLeave(e.target.checked)}
                className="rounded border-white/20 bg-surface-100 text-cyan-400 focus:ring-0"
              />
              <label htmlFor="duty-leave" className="text-xs text-gray-300">
                I request Official Duty Leave (OD) attendance credit for all rehearsal and event execution hours.
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/recruitment"
                className="px-4 py-2.5 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-cyber-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting Application...' : 'Submit Official Application'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
