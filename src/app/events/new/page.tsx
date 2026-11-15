'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Calendar, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Trophy, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function AddEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Cultural & Performing Arts');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [image, setImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['DBUU', 'CampusFest']);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      sounds.playClick();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
    sounds.playClick();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !venue.trim()) {
      setErrorMsg('Please provide Title, Date, and Venue.');
      sounds.playError();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          category,
          date,
          time,
          venue,
          description,
          prizePool,
          image: image.trim() || undefined,
          tags
        })
      });

      const json = await res.json();
      if (json.success) {
        sounds.playSuccess();
        triggerConfetti();
        router.push('/events');
      } else {
        setErrorMsg(json.error || 'Failed to publish event');
        sounds.playError();
      }
    } catch {
      setErrorMsg('Submission error. Please retry.');
      sounds.playError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/events"
        onClick={() => sounds.playClick()}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ffc16b] hover:text-[#ffd9a4] mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        BACK TO COLLEGE EVENTS
      </Link>

      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-[#ffc16b]/30 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc16b]/10 border border-[#ffc16b]/30 text-[#ffc16b] text-xs font-mono font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            STUDENT EVENT CREATION PORTAL
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Host & Publish a College Event
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Every DBUU student has access to organize and broadcast campus tournaments, club workshops, hackathons, dance faceoffs, and cultural evenings.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. DBUU Intra-Department Coding Battle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
              />
            </div>

            {/* Tagline / Subtitle */}
            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Subtitle / Catchphrase</label>
              <input
                type="text"
                placeholder="e.g. 24 Hours of Algorithms, Logic & Prizes"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#140b17] rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
              >
                <option value="Cultural & Performing Arts">Cultural & Performing Arts</option>
                <option value="Technical & Hackathons">Technical & Hackathons</option>
                <option value="Athletics & Sports">Athletics & Sports</option>
                <option value="Literary & Debating">Literary & Debating</option>
                <option value="Gaming & Esports">Gaming & Esports</option>
                <option value="Workshops & Conclaves">Workshops & Conclaves</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b] font-mono"
              />
            </div>

            {/* Time */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Time / Schedule</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM - 4:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b] font-mono"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Campus Venue *</label>
              <input
                type="text"
                required
                placeholder="e.g. Main Auditorium / Seminar Hall Block B"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
              />
            </div>

            {/* Prize Pool */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Prize Pool / Perks</label>
              <input
                type="text"
                placeholder="e.g. ₹25,000 + Trophies & Certificates"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
              />
            </div>

            {/* Poster URL */}
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">Poster Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b] font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Event Description & Rules *</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the format, rounds, eligibility, and rules..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b] leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Hashtags / Keywords:</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type tag and press enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#ffc16b]"
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
              {tags.map((t, idx) => (
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

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-full border border-white/15 text-xs font-bold text-gray-300 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-cyber-primary px-7 py-2.5 text-xs font-bold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Publishing Event...' : 'Publish College Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
