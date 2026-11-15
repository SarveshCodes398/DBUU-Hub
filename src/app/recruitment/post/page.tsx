'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  Send, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function PostRecruitmentPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [eventName, setEventName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [department, setDepartment] = useState('School of Engineering & Computing');
  const [category, setCategory] = useState<'dance' | 'tech' | 'cultural' | 'sports' | 'media'>('dance');
  const [description, setDescription] = useState('');
  const [spots, setSpots] = useState(15);
  const [deadline, setDeadline] = useState('2026-03-01');
  const [eventDate, setEventDate] = useState('2026-03-15');
  const [isUrgent, setIsUrgent] = useState(false);

  // Dynamic tags
  const [roleInput, setRoleInput] = useState('');
  const [rolesNeeded, setRolesNeeded] = useState<string[]>([
    'Backstage Coordinator',
    'Hospitality Liaison',
    'Media & Photography'
  ]);

  const [perkInput, setPerkInput] = useState('');
  const [perks, setPerks] = useState<string[]>([
    'Official DBUU Certificate of Leadership',
    'Approved Duty Leave (Attendance Credit)',
    'Exclusive Core Team Merch'
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const addRole = () => {
    if (roleInput.trim()) {
      setRolesNeeded([...rolesNeeded, roleInput.trim()]);
      setRoleInput('');
      sounds.playClick();
    }
  };

  const removeRole = (index: number) => {
    setRolesNeeded(rolesNeeded.filter((_, i) => i !== index));
    sounds.playClick();
  };

  const addPerk = () => {
    if (perkInput.trim()) {
      setPerks([...perks, perkInput.trim()]);
      setPerkInput('');
      sounds.playClick();
    }
  };

  const removePerk = (index: number) => {
    setPerks(perks.filter((_, i) => i !== index));
    sounds.playClick();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventName || !organizer || rolesNeeded.length === 0) {
      setErrorMsg('Please fill in all mandatory fields.');
      sounds.playError();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          eventName,
          organizer,
          department,
          category,
          description,
          rolesNeeded,
          perks,
          spots: Number(spots),
          deadline,
          eventDate,
          isUrgent
        })
      });

      const json = await res.json();
      if (json.success) {
        sounds.playSuccess();
        triggerConfetti();
        router.push('/recruitment');
      } else {
        setErrorMsg(json.error || 'Failed to publish listing');
        sounds.playError();
      }
    } catch (err) {
      setErrorMsg('Submission error. Please retry.');
      sounds.playError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/recruitment"
        onClick={() => sounds.playClick()}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        BACK TO RECRUITMENT PORTAL
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            ORGANIZER DESK • RECRUIT CREW
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Publish Event Volunteering Requirement
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Need enthusiastic student volunteers, photographers, stage anchors, or tech coordinators for your upcoming DBUU event? Broadcast it to thousands of active students instantly.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Requirement Headline / Post Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DBUU Dance Ikon 2026 — Stage Management & Artist Hospitality Volunteers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Event Name */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Official Event Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dance Ikon 2026 / Pinak Fest"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Organizer Club / Body */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Organizing Club / Student Chapter *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DBUU Cultural Committee / Dance Club"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Event Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="dance">Dance & Stage Arts</option>
                <option value="tech">Tech, Coding & Robotics</option>
                <option value="cultural">Cultural & Music Fest</option>
                <option value="sports">Sports & Athletics</option>
                <option value="media">Media, Photography & TEDx</option>
              </select>
            </div>

            {/* Spots */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Total Volunteer Vacancies (Spots) *
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={spots}
                onChange={(e) => setSpots(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Application Deadline */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Event Execution Date */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">
                Main Event Date *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">
              Event & Volunteering Scope Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Outline what the event is about, what tasks volunteers will handle, and expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>

          {/* Dynamic Roles Needed */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">
              Roles / Sub-teams Needed (e.g. Stage Manager, Anchor, Console Tech):
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type role name and click Add"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRole(); } }}
                className="flex-1 px-3.5 py-2 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={addRole}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold hover:bg-cyan-500/30 transition-colors"
              >
                Add Role
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {rolesNeeded.map((r, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-lg bg-surface-100 border border-white/10 text-gray-200 flex items-center gap-1.5"
                >
                  {r}
                  <button type="button" onClick={() => removeRole(i)} className="text-gray-400 hover:text-rose-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic Perks */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">
              Perks Offered to Volunteers (Certificates, Duty Leave, Merch):
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type perk and click Add"
                value={perkInput}
                onChange={(e) => setPerkInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPerk(); } }}
                className="flex-1 px-3.5 py-2 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={addPerk}
                className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold hover:bg-purple-500/30 transition-colors"
              >
                Add Perk
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {perks.map((p, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-purple-400" />
                  {p}
                  <button type="button" onClick={() => removePerk(i)} className="text-gray-400 hover:text-rose-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Urgent switch */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="urgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="rounded border-white/20 bg-surface-100 text-rose-500 focus:ring-0"
            />
            <label htmlFor="urgent" className="text-xs text-rose-300 font-bold">
              Mark as URGENT RECRUITMENT (Prioritized badge on homepage & banner)
            </label>
          </div>

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
              <span>{submitting ? 'Publishing...' : 'Publish Volunteering Opportunity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
