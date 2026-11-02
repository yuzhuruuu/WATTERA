/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Zap, Play, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../data/sampleData';

interface HeaderProps {
  profile: UserProfile;
  onStartDemo: () => void;
  isDemoRunning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onStartDemo,
  isDemoRunning = false,
}) => {
  return (
    <header className="bg-[#0a3d36] text-white px-4 pt-3 pb-3 sticky top-0 z-30 shadow-md">
      <div className="flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center text-[#0a3d36] shadow-sm font-bold">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-white leading-none">
                Wattera
              </h1>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">
                Copilot
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-medium leading-tight">
              AI Energy Copilot • Semarang
            </p>
          </div>
        </div>

        {/* 60s Demo CTA Button */}
        <button
          onClick={onStartDemo}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-semibold px-2.5 py-1.5 rounded-full shadow transition-all active:scale-95 border border-amber-300 cursor-pointer"
          title="Jalankan simulasi demo 60 detik"
        >
          {isDemoRunning ? (
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-900" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-slate-900" />
          )}
          <span>Demo 60s</span>
        </button>
      </div>

      {/* User profile & Data Contoh pill */}
      <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-100">
        <div className="flex items-center gap-1.5 truncate">
          <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-emerald-100 shrink-0">
            {profile.initials}
          </div>
          <span className="font-medium text-white truncate">{profile.businessName}</span>
          <span className="text-emerald-300/70 text-[11px]">({profile.location.split(',')[0]})</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="bg-emerald-900/90 text-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Data contoh
          </span>
        </div>
      </div>
    </header>
  );
};
