/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Award,
  Flame,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, BADGES_DATA } from '../data/sampleData';

interface CelebrateScreenProps {
  profile: UserProfile;
}

export const CelebrateScreen: React.FC<CelebrateScreenProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0a3d36', '#10b981', '#fbbf24', '#f59e0b'],
    });
  };

  useEffect(() => {
    triggerConfetti();
  }, []);

  const shareText = `🎉 Kabar gembira dari Laundry Kilat Bu Rini (Tembalang, Semarang)!
Bulan ini kami berhasil menghemat Rp${profile.savedMoneyMonthRp.toLocaleString(
    'id-ID'
  )} tagihan listrik bersama Wattera AI Energy Copilot!
⚡ Efisiensi: 0,32 kWh / kg cucian (membaik dari lonjakan 0,40 di September)
🔥 Streak harian: ${profile.dailyStreak} hari konsisten mencatat
🛡️ Hemat melampaui commitment fee!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hemat Listrik Laundry Kilat Bu Rini',
          text: shareText,
        });
      } catch (err) {
        // Fallback to copy
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 pb-24 text-stone-800">
      {/* 1. Header */}
      <div className="text-center pt-2">
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Pencapaian Nyata Terbukti
        </span>
        <h2 className="text-lg font-black text-[#0a3d36] mt-1.5">
          Selamat, {profile.name}!
        </h2>
        <p className="text-xs text-stone-600 max-w-xs mx-auto">
          Keputusan operasional hemat listrik Bu Rini di Tembalang membuahkan hasil nyata.
        </p>
      </div>

      {/* 2. Kartu Hasil Cantik (Shareable Card) */}
      <div
        id="share-card"
        className="bg-gradient-to-br from-[#0a3d36] via-[#0d4c44] to-[#135d52] text-white rounded-3xl p-5 shadow-xl border-2 border-emerald-500/40 relative overflow-hidden flex flex-col gap-4"
      >
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header of Card */}
        <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
              Wattera Energy Report
            </span>
            <h3 className="text-sm font-bold text-white">
              {profile.businessName}
            </h3>
            <span className="text-[11px] text-emerald-200/80">
              {profile.location}
            </span>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
            BR
          </div>
        </div>

        {/* Main Big Number */}
        <div className="text-center py-2">
          <span className="text-xs text-emerald-200 font-medium">
            Rupiah Terselamatkan Bulan Ini
          </span>
          <div className="text-3xl font-black tracking-tight text-amber-300 mt-1">
            Rp{profile.savedMoneyMonthRp.toLocaleString('id-ID')}
          </div>
          <span className="inline-block mt-1 text-[11px] bg-emerald-800/80 text-emerald-100 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40">
            ✓ Hemat Terbukti vs Baseline
          </span>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 bg-emerald-950/50 p-2.5 rounded-2xl border border-emerald-700/40 text-center">
          <div>
            <span className="text-[9px] text-emerald-300 block">Efisiensi</span>
            <span className="text-xs font-bold text-white">0,32 kWh/kg</span>
          </div>
          <div className="border-x border-emerald-800/80">
            <span className="text-[9px] text-emerald-300 block">Streak</span>
            <span className="text-xs font-bold text-amber-300">
              {profile.dailyStreak} Hari 🔥
            </span>
          </div>
          <div>
            <span className="text-[9px] text-emerald-300 block">Status Fee</span>
            <span className="text-[11px] font-bold text-emerald-200">Melampaui</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-[10px] text-emerald-300/80 text-center border-t border-emerald-700/50 pt-2 flex items-center justify-between">
          <span>Data contoh • Oktober 2026</span>
          <span className="font-semibold text-white">Wattera AI Copilot</span>
        </div>
      </div>

      {/* 3. Action Buttons: Share & Confetti */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 bg-[#0a3d36] hover:bg-[#0d4c44] text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
        >
          <Share2 className="w-4 h-4 text-emerald-300" />
          <span>Bagikan Hasil</span>
        </button>

        <button
          onClick={handleCopyText}
          className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Teks</span>
            </>
          )}
        </button>

        <button
          onClick={triggerConfetti}
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
          title="Tembakkan Konfeti Lagi"
        >
          🎉
        </button>
      </div>

      {/* 4. Daftar Lencana Prestasi (Hanya untuk hasil terbukti) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#0a3d36]" />
            <h3 className="text-xs font-bold text-stone-900">
              Lencana Pencapaian Bu Rini
            </h3>
          </div>
          <span className="text-[10px] text-stone-500 font-medium">
            3 dari 4 Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {BADGES_DATA.map((badge) => (
            <div
              key={badge.id}
              className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
                badge.unlocked
                  ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 opacity-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">
                  {badge.icon === 'flame'
                    ? '🔥'
                    : badge.icon === 'check-circle-2'
                    ? '✅'
                    : badge.icon === 'sparkles'
                    ? '✨'
                    : '🏆'}
                </span>
                <span className="text-xs font-bold text-stone-900 leading-tight">
                  {badge.title}
                </span>
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">
                {badge.subtitle}
              </p>
              <span className="text-[9px] text-emerald-800 font-semibold mt-0.5">
                {badge.unlocked ? '✓ Terbuka' : '🔒 Masih proses'}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-stone-400 italic text-center">
          *Lencana hanya diberikan atas hasil nyata rupiah terselamatkan, bukan karena sering membuka aplikasi.
        </p>
      </div>
    </div>
  );
};
