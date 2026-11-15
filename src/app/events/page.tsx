'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { campusEvents } from '@/lib/data';
import { CampusEvent } from '@/lib/types';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<CampusEvent[]>(campusEvents);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setEvents(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleRegister = (eventId: string) => {
    if (registeredEvents.includes(eventId)) return;
    setRegisteredEvents([...registeredEvents, eventId]);
    sounds.playSuccess();
    triggerConfetti();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-10 glass-panel-glow border border-[#ffc16b]/30">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc16b]/10 border border-[#ffc16b]/30 text-[#ffc16b] text-xs font-mono font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              CAMPUS EVENTS & FESTS • DEV BHOOMI UTTARAKHAND UNIVERSITY
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              College Events <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc16b] to-[#f59e0b]">
                & Student Battles
              </span>
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              Explore university flagships including <strong>DBUU Dance Ikon 2026</strong>, tech hackathons, and sports leagues. Every student has the freedom to host and publish new events!
            </p>
          </div>

          {/* "+ Add College Event" CTA */}
          <Link
            href="/events/new"
            onClick={() => sounds.playClick()}
            className="btn-cyber-primary px-6 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Host / Add College Event</span>
          </Link>
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-8">
        {events.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);
          return (
            <div
              key={evt.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-[#ffc16b]/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group"
            >
              {/* Event Image Banner */}
              <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[260px] overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0710] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0d0813]" />
                
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#ffc16b] text-black">
                    {evt.category}
                  </span>
                  {evt.prizePool && (
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500 text-black">
                      🏆 {evt.prizePool}
                    </span>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#ffc16b] transition-colors">
                      {evt.title}
                    </h2>
                    <p className="text-xs font-mono text-[#ffc16b] mt-0.5">
                      {evt.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-400 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#ffc16b]" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {evt.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRegister(evt.id)}
                      disabled={isRegistered}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                        isRegistered
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'btn-cyber-primary'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isRegistered ? 'Registration Confirmed ✓' : 'Register for Pass'}</span>
                    </button>

                    {evt.id === 'dance-ikon-2026' && (
                      <Link
                        href="/recruitment/apply/dance-ikon-2026-volunteers"
                        onClick={() => sounds.playClick()}
                        className="btn-cyber-purple px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5"
                      >
                        <Users className="w-4 h-4" />
                        <span>Join Volunteer Crew</span>
                      </Link>
                    )}
                  </div>

                  <a
                    href="https://www.dbuu.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <span>DBUU Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
