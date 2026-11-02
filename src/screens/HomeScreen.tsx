/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Info,
  Share2,
} from 'lucide-react';
import { UserProfile } from '../data/sampleData';
import { MissionItem } from '../utils/calculations';

interface HomeScreenProps {
  profile: UserProfile;
  missions: MissionItem[];
  onUpdateMissionStatus: (id: string, status: MissionItem['status'], reason?: string) => void;
  onNavigateToCatat: () => void;
  onNavigateToAnalysis: () => void;
  onNavigateToCelebrate: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  missions,
  onUpdateMissionStatus,
  onNavigateToCatat,
  onNavigateToAnalysis,
  onNavigateToCelebrate,
}) => {
  const [rejectModalMissionId, setRejectModalMissionId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const activeMissions = missions.slice(0, 3);
  const progressPercent = Math.min(
    100,
    Math.round((profile.daysCompletedThisWeek / profile.weeklyTargetDays) * 100)
  );

  const handleOpenReject = (id: string) => {
    setRejectModalMissionId(id);
    setRejectionReasonInput('');
  };

  const handleConfirmReject = () => {
    if (rejectModalMissionId) {
      onUpdateMissionStatus(
        rejectModalMissionId,
        'rejected',
        rejectionReasonInput || 'Kurang pas dengan operasional toko saat ini'
      );
      setRejectModalMissionId(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-20 text-stone-800">
      {/* 1. Sapaan & Status Singkat */}
      <div className="flex items-center justify-between pt-0.5">
        <div>
          <h2 className="text-sm font-bold text-[#0a3d36] tracking-tight">
            Halo, {profile.name}! 👋
          </h2>
          <p className="text-[11px] text-stone-600">
            Usaha hemat listrik kiloan makin terukur.
          </p>
        </div>
        <button
          onClick={onNavigateToCelebrate}
          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border border-emerald-300"
          title="Lihat kartu perayaan hemat"
        >
          <Share2 className="w-3 h-3 text-emerald-700" />
          <span>Bagikan</span>
        </button>
      </div>

      {/* 2. Hero Card: Rupiah Terselamatkan & Streak (Compact 1-view design) */}
      <div className="bg-gradient-to-br from-[#0a3d36] via-[#0d4c44] to-[#12584e] text-white rounded-xl p-3 shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[10px] font-semibold text-emerald-200 uppercase tracking-wide">
                Rupiah Terselamatkan
              </span>
              <span className="text-[9px] bg-emerald-500/30 text-emerald-100 px-1.5 py-0.2 rounded font-semibold border border-emerald-400/20">
                Oktober
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Rp{profile.savedMoneyMonthRp.toLocaleString('id-ID')}
              </span>
              <span className="text-emerald-300 text-[11px] font-bold flex items-center">
                <TrendingDown className="w-3 h-3 inline mr-0.5" />
                Terbukti
              </span>
            </div>
            <p className="text-[9px] text-emerald-200/80 mt-0.5">
              vs baseline Juli-Agustus (0,31 kWh/kg)
            </p>
          </div>

          {/* Streak Counter Badge */}
          <div className="bg-amber-400/20 border border-amber-300/40 rounded-lg px-2 py-1 text-center flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
              <span className="text-xs font-black text-amber-200">
                {profile.dailyStreak} Hari
              </span>
            </div>
            <span className="text-[8px] text-amber-100/90 font-medium">Streak Catat</span>
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="mt-2 pt-1.5 border-t border-emerald-700/50 flex flex-col gap-0.5 relative z-10">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-emerald-200 font-medium">
              Target Catat ({profile.daysCompletedThisWeek}/{profile.weeklyTargetDays} hari)
            </span>
            <span className="text-white font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-emerald-950/60 rounded-full h-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Section Misi Minggu Ini (Max 3 Misi, Fits in Viewport) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <h3 className="text-xs font-bold text-[#0a3d36]">Misi Minggu Ini</h3>
            <span className="text-[9px] text-stone-500 font-medium">(3 Misi Aktif)</span>
          </div>
          <button
            onClick={onNavigateToAnalysis}
            className="text-[10px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center cursor-pointer"
          >
            Lihat Analisis <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {activeMissions.map((mission) => {
            const isAgreed = mission.status === 'agreed';
            const isRejected = mission.status === 'rejected';
            const isPostponed = mission.status === 'postponed';

            return (
              <div
                key={mission.id}
                className={`rounded-xl px-2.5 py-2 border transition-all ${
                  isAgreed
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : isRejected
                    ? 'bg-stone-50 border-stone-300 opacity-60'
                    : 'bg-white border-stone-200 shadow-2xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[11px] font-bold text-stone-900 truncate">
                        {mission.title}
                      </span>
                      {isAgreed && (
                        <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" /> Disetujui
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-[9px] bg-stone-500 text-white font-semibold px-1 py-0.2 rounded-full">
                          Ditolak
                        </span>
                      )}
                      {isPostponed && (
                        <span className="text-[9px] bg-amber-600 text-white font-semibold px-1 py-0.2 rounded-full">
                          Ditunda
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-stone-600 mt-0.5 leading-snug line-clamp-1">
                      {mission.description}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-[9px]">
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                        Hemat: ~Rp{mission.potentialSavingsRp.toLocaleString('id-ID')}/bln
                      </span>
                      <span className="text-stone-500 italic truncate max-w-[150px]">
                        💡 {mission.reason}
                      </span>
                    </div>

                    {isRejected && mission.rejectionReason && (
                      <p className="text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded mt-0.5 border border-rose-200">
                        Alasan: {mission.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tombol Keputusan (Hanya jalan setelah pemilik setuju) */}
                {mission.status === 'pending' && (
                  <div className="mt-1 pt-1 border-t border-stone-100 flex items-center justify-end gap-1">
                    <button
                      onClick={() => onUpdateMissionStatus(mission.id, 'postponed')}
                      className="text-[10px] text-stone-500 hover:bg-stone-100 px-1.5 py-0.5 rounded font-medium cursor-pointer"
                    >
                      Tunda
                    </button>
                    <button
                      onClick={() => handleOpenReject(mission.id)}
                      className="text-[10px] text-rose-700 hover:bg-rose-50 px-1.5 py-0.5 rounded font-medium cursor-pointer"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => onUpdateMissionStatus(mission.id, 'agreed')}
                      className="text-[10px] bg-[#0a3d36] hover:bg-[#0d4c44] text-white px-2.5 py-0.5 rounded-md font-bold shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-300" />
                      Setuju
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Action Shortcut to Catat & Cek Garansi Fee */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onNavigateToCatat}
          className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100/90 border border-amber-300 p-2.5 rounded-xl transition cursor-pointer text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 leading-tight">
              Catat Hari Ini
            </div>
            <div className="text-[10px] text-stone-600">Foto meter atau suara</div>
          </div>
        </button>

        <button
          onClick={onNavigateToAnalysis}
          className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-300 p-2.5 rounded-xl transition cursor-pointer text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0a3d36] leading-tight">
              Cek Garansi Fee
            </div>
            <div className="text-[10px] text-emerald-700">Fee Rp20rb terlindungi</div>
          </div>
        </button>
      </div>

      {/* Modal Penolakan Misi Singkat */}
      {rejectModalMissionId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-xl border border-stone-200">
            <h4 className="text-sm font-bold text-stone-900">
              Alasan Menolak Misi Ini?
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Bantu Wattera AI menyesuaikan saran agar tidak mengganggu operasional Bu Rini.
            </p>
            <textarea
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="Contoh: Mesin cuci butuh selesai cepat saat jam ramai mahasiswa..."
              rows={3}
              className="w-full mt-2 text-xs p-2 rounded-lg border border-stone-300 focus:outline-emerald-600"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setRejectModalMissionId(null)}
                className="text-xs text-stone-600 px-3 py-1.5 rounded-lg hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 px-3 py-1.5 rounded-lg"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
