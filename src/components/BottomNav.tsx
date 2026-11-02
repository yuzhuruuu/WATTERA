/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, BarChart3, Mic, MessageSquareText, Settings } from 'lucide-react';

export type TabType = 'beranda' | 'analisis' | 'catat' | 'tanya_ai' | 'pengaturan';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigasi Utama"
    >
      <div className="max-w-[420px] mx-auto px-3 py-1 flex items-center justify-between relative">
        {/* Tab 1: Beranda */}
        <button
          onClick={() => onSelectTab('beranda')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[50px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'beranda'
              ? 'text-[#0a3d36] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Buka Beranda"
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'beranda' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1">Beranda</span>
        </button>

        {/* Tab 2: Analisis */}
        <button
          onClick={() => onSelectTab('analisis')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[50px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'analisis'
              ? 'text-[#0a3d36] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Buka Analisis"
        >
          <BarChart3 className={`w-5 h-5 transition-transform ${activeTab === 'analisis' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1">Analisis</span>
        </button>

        {/* Tab 3: CATAT (Center Microphone Button, Most Prominent!) */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            onClick={() => onSelectTab('catat')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer border-3 border-[#faf7f2] ${
              activeTab === 'catat'
                ? 'bg-amber-400 text-slate-900 shadow-amber-400/40 ring-2 ring-amber-500'
                : 'bg-[#0a3d36] text-white hover:bg-[#0d4c44] shadow-[#0a3d36]/30'
            }`}
            aria-label="Catat meteran dan suara baru"
          >
            <Mic className="w-6 h-6 animate-pulse" />
          </button>
          <span
            className={`text-[10px] font-bold mt-0.5 ${
              activeTab === 'catat' ? 'text-amber-600 font-extrabold' : 'text-[#0a3d36]'
            }`}
          >
            Catat
          </span>
        </div>

        {/* Tab 4: Tanya AI */}
        <button
          onClick={() => onSelectTab('tanya_ai')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[50px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'tanya_ai'
              ? 'text-[#0a3d36] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Buka Tanya AI"
        >
          <MessageSquareText className={`w-5 h-5 transition-transform ${activeTab === 'tanya_ai' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1">Tanya AI</span>
        </button>

        {/* Tab 5: Pengaturan */}
        <button
          onClick={() => onSelectTab('pengaturan')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[50px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pengaturan'
              ? 'text-[#0a3d36] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Buka Pengaturan"
        >
          <Settings className={`w-5 h-5 transition-transform ${activeTab === 'pengaturan' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1">Pengaturan</span>
        </button>
      </div>
    </nav>
  );
};
