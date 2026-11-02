/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Mic,
  BarChart3,
  CheckCircle2,
  Share2,
  ChevronRight,
  Play,
  Pause,
  X,
  Zap,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'beranda' | 'analisis' | 'catat' | 'tanya_ai' | 'pengaturan') => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const totalSteps = 6;

  const stepsData = [
    {
      step: 1,
      tab: 'catat' as const,
      title: '1. Catat: Foto Meter Listrik Otomatis',
      desc: 'Pemilik laundry cukup memotret meteran PLN atau struk token. Wattera membaca stand meter 333,0 kWh dengan keyakinan AI 94%.',
      highlight: '333 kWh terdeteksi • Tanpa alat IoT mahal',
      icon: Camera,
    },
    {
      step: 2,
      tab: 'catat' as const,
      title: '2. Catat: Suara Harian Operator',
      desc: 'Operator merekam suara 3 detik: "Setrika uap 6 jam, cucian 40 kg". Gemini AI mengekstrak beban kg & mesin yang aktif ke isian terstruktur.',
      highlight: '40 kg cucian • Setrika uap 6 jam',
      icon: Mic,
    },
    {
      step: 3,
      tab: 'beranda' as const,
      title: '3. Streak & Kebiasaan Terjaga',
      desc: 'Data tersimpan seketika di perangkat. Streak bertambah menjadi 7 hari, memotivasi pemilik laundry tetap disiplin memantau energi.',
      highlight: '🔥 Streak 7 Hari • Progress mingguan 100%',
      icon: Zap,
    },
    {
      step: 4,
      tab: 'analisis' as const,
      title: '4. Analisis: Deteksi Lonjakan September',
      desc: 'Wattera menghitung kWh per kg. September terdeteksi merah (+0,09 kWh/kg dari biasanya 0,31) akibat setrika uap menyala nonstop.',
      highlight: 'Oktober membaik: 0,32 kWh/kg (-0,08)',
      icon: BarChart3,
    },
    {
      step: 5,
      tab: 'beranda' as const,
      title: '5. Misi Hemat AI & Garansi Fee',
      desc: 'Saran AI dijalankan hanya setelah pemilik setuju. Potensi hemat Rp45.000 melampaui commitment fee Wattera Rp20.000 (dilindungi garansi selisih kredit).',
      highlight: 'Hemat Rp45.000 ≥ Fee Rp20.000',
      icon: ShieldCheck,
    },
    {
      step: 6,
      tab: 'beranda' as const,
      title: '6. Rayakan: Bukti & Kartu Berbagi',
      desc: 'Buktikan penghematan nyata! Kartu hasil siap dibagikan ke WhatsApp dan media sosial untuk merayakan efisiensi usaha bersama tim.',
      highlight: '🎉 Rp45.000 Terselamatkan Bulan Ini!',
      icon: Share2,
    },
  ];

  // Auto progression every 10 seconds (total 60 seconds)
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          return totalSteps;
        }
        const next = prev + 1;
        onNavigateTab(stepsData[next - 1].tab);
        if (next === 6) {
          confetti({ particleCount: 70, spread: 60 });
        }
        return next;
      });
    }, 9500);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentStep]);

  if (!isOpen) return null;

  const current = stepsData[currentStep - 1];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onNavigateTab(stepsData[next - 1].tab);
      if (next === 6) {
        confetti({ particleCount: 80, spread: 70 });
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onNavigateTab(stepsData[prev - 1].tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-[400px] shadow-2xl border-2 border-emerald-500 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-[#0a3d36] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
              60s
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1">
                <span>Simulasi Demo Juri & Pitch</span>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-medium">
                  {currentStep}/{totalSteps}
                </span>
              </h3>
              <p className="text-[10px] text-emerald-200">
                Alur lengkap Wattera Laundry Kilat Bu Rini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-amber-300 p-1 rounded-md cursor-pointer"
              title={isPlaying ? 'Jeda otomatis' : 'Jalankan otomatis'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5 flex">
          {stepsData.map((s) => (
            <div
              key={s.step}
              className={`h-full flex-1 transition-all duration-300 ${
                s.step <= currentStep ? 'bg-amber-400' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Body Content */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0a3d36] flex items-center justify-center shrink-0 shadow-xs">
              <StepIcon className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 leading-tight">
                {current.title}
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {current.desc}
              </p>
            </div>
          </div>

          {/* Highlight pill */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 text-center">
            <span className="text-xs font-extrabold text-emerald-950 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {current.highlight}
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-1">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="text-xs text-stone-500 disabled:opacity-30 hover:text-stone-800 font-medium px-2 py-1 cursor-pointer"
            >
              Sebelumnya
            </button>

            <button
              onClick={handleNext}
              className="bg-[#0a3d36] hover:bg-[#0d4c44] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
            >
              <span>{currentStep === totalSteps ? 'Selesai Demo' : 'Langkah Berikutnya'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
