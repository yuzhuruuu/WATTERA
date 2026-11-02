/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Building,
  Zap,
  Sliders,
  Bell,
  Trash2,
  Shield,
  RotateCcw,
  Plus,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UserProfile, ROADMAP_FEATURES } from '../data/sampleData';
import { ApplianceItem } from '../utils/calculations';

interface SettingsScreenProps {
  profile: UserProfile;
  appliances: ApplianceItem[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onUpdateAppliances: (updated: ApplianceItem[]) => void;
  onResetToSampleData: () => void;
  onClearAllData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  appliances,
  onUpdateProfile,
  onUpdateAppliances,
  onResetToSampleData,
  onClearAllData,
}) => {
  const [editingRate, setEditingRate] = useState(profile.ratePerKwh);
  const [reminderEnabled, setReminderEnabled] = useState(profile.dailyReminderEnabled);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleApplianceChange = (
    index: number,
    field: keyof ApplianceItem,
    value: any
  ) => {
    const updated = [...appliances];
    updated[index] = { ...updated[index], [field]: Number(value) };
    onUpdateAppliances(updated);
  };

  const handleAddAppliance = () => {
    const newApp: ApplianceItem = {
      id: `app-${Date.now()}`,
      name: 'Alat Tambahan',
      count: 1,
      powerWatts: 800,
      dailyHours: 4,
    };
    onUpdateAppliances([...appliances, newApp]);
  };

  const handleRemoveAppliance = (id: string) => {
    onUpdateAppliances(appliances.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 pb-24 text-stone-800">
      {/* 1. Header */}
      <div>
        <h2 className="text-base font-bold text-[#0a3d36]">Pengaturan Profil & Alat</h2>
        <p className="text-xs text-stone-600">
          Kelola profil usaha Laundry Kilat Bu Rini dan inventaris mesin.
        </p>
      </div>

      {/* 2. Profil Usaha */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
          <Building className="w-4 h-4 text-[#0a3d36]" />
          <h3 className="text-xs font-bold text-stone-900">Profil Usaha</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-stone-500 text-[11px] block">Nama Usaha:</span>
            <span className="font-bold text-stone-900">{profile.businessName}</span>
          </div>
          <div>
            <span className="text-stone-500 text-[11px] block">Pemilik:</span>
            <span className="font-bold text-stone-900">{profile.name} (BR)</span>
          </div>
          <div className="col-span-2">
            <span className="text-stone-500 text-[11px] block">Lokasi:</span>
            <span className="font-semibold text-stone-800">{profile.location}</span>
          </div>
        </div>

        {/* Tarif Listrik Per kWh */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-800 block">
              Tarif Listrik Per kWh
            </span>
            <span className="text-[10px] text-stone-500">
              Contoh acuan kalkulasi (bukan data PLN resmi)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-600">Rp</span>
            <input
              type="number"
              value={editingRate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setEditingRate(val);
                onUpdateProfile({ ratePerKwh: val });
              }}
              className="w-20 text-right bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-bold text-[#0a3d36]"
            />
          </div>
        </div>
      </div>

      {/* 3. Inventaris Alat (Daya & Jam Pakai) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0a3d36]" />
            <h3 className="text-xs font-bold text-stone-900">
              Inventaris Alat & Daya Listrik
            </h3>
          </div>
          <button
            onClick={handleAddAppliance}
            className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Tambah Alat
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {appliances.map((app, index) => (
            <div
              key={app.id}
              className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 flex flex-col gap-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">{app.name}</span>
                {appliances.length > 1 && (
                  <button
                    onClick={() => handleRemoveAppliance(app.id)}
                    className="text-stone-400 hover:text-rose-600 cursor-pointer p-0.5"
                    title="Hapus alat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Jumlah</label>
                  <input
                    type="number"
                    value={app.count}
                    onChange={(e) => handleApplianceChange(index, 'count', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded px-1.5 py-1 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Daya (Watt)</label>
                  <input
                    type="number"
                    value={app.powerWatts}
                    onChange={(e) =>
                      handleApplianceChange(index, 'powerWatts', e.target.value)
                    }
                    className="w-full bg-white border border-stone-300 rounded px-1.5 py-1 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Jam / Hari</label>
                  <input
                    type="number"
                    value={app.dailyHours}
                    onChange={(e) =>
                      handleApplianceChange(index, 'dailyHours', e.target.value)
                    }
                    className="w-full bg-white border border-stone-300 rounded px-1.5 py-1 text-center font-bold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Pengingat Harian & Privasi */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0a3d36]" />
            <div>
              <span className="text-xs font-bold text-stone-800 block">
                Pengingat Catat Harian
              </span>
              <span className="text-[10px] text-stone-500">
                Pukul {profile.reminderTime} (sebelum toko tutup)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !reminderEnabled;
              setReminderEnabled(next);
              onUpdateProfile({ dailyReminderEnabled: next });
            }}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              reminderEnabled ? 'bg-emerald-600' : 'bg-stone-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                reminderEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Ringkasan Privasi Singkat */}
        <div className="pt-2 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-600">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            <strong>Privasi & Keamanan Data:</strong> Seluruh catatan operasional disimpan di perangkat lokal Bu Rini. Wattera tidak menyimpan data sensitif di cloud publik dan tidak terhubung langsung ke rekening perbankan atau sistem PLN.
          </p>
        </div>
      </div>

      {/* 5. Kartu "Rencana Lanjutan" (Segera Hadir) */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-stone-900">Rencana Lanjutan</h3>
          </div>
          <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
            Segera Hadir
          </span>
        </div>
        <p className="text-[11px] text-stone-500">
          Fitur tambahan yang akan dikembangkan setelah tahap validasi awal energi listrik selesai.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-1">
          {ROADMAP_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-2.5 rounded-xl border border-stone-200/80 flex flex-col gap-1 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  {feat.tag}
                </span>
                <span className="text-[9px] text-stone-400">Segera</span>
              </div>
              <h4 className="text-xs font-bold text-stone-800 mt-0.5">{feat.title}</h4>
              <p className="text-[10px] text-stone-500 leading-tight">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Tombol Reset / Hapus Data */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onResetToSampleData}
          className="w-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan ke Data Contoh Awal (Bu Rini)</span>
        </button>

        {showClearConfirm ? (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-center flex flex-col gap-2">
            <span className="text-xs font-bold text-rose-900">
              Yakin ingin menghapus seluruh data lokal?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 text-xs py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 text-xs py-1.5 bg-rose-700 text-white rounded-lg font-bold"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full text-rose-700 hover:bg-rose-50 border border-rose-200 py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua Data Saya</span>
          </button>
        )}
      </div>
    </div>
  );
};
