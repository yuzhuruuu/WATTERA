/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BillingRecord, ApplianceItem, calculateProvenSavings, calculateGuaranteeFeeStatus } from '../utils/calculations';
import { UserProfile } from '../data/sampleData';

interface AnalysisScreenProps {
  profile: UserProfile;
  records: BillingRecord[];
  appliances: ApplianceItem[];
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  profile,
  records,
  appliances,
}) => {
  // Baseline calculation from Juli & Agustus
  const baseline = 0.31; // kWh/kg
  const currentRecord = records.find((r) => r.isCurrent) || records[records.length - 1];
  const septRecord = records.find((r) => r.month === 'September') || records[2];

  const currentKwhPerKg = Math.round((currentRecord.kwh / currentRecord.kg) * 100) / 100; // 0.32
  const septKwhPerKg = Math.round((septRecord.kwh / septRecord.kg) * 100) / 100; // 0.40
  const diffFromSept = Math.round((currentKwhPerKg - septKwhPerKg) * 100) / 100; // -0.08

  // Proven savings computation
  // Menggunakan baseline lonjakan sebelumnya vs bulan ini
  const savingsCalc = calculateProvenSavings(0.35, currentKwhPerKg, currentRecord.kg, profile.ratePerKwh);
  // Default guaranteed sample: Rp45.000
  const provenSavingsRp = profile.savedMoneyMonthRp || 45000;
  const guaranteeStatus = calculateGuaranteeFeeStatus(provenSavingsRp, profile.commitmentFeeRp);

  return (
    <div className="flex flex-col gap-3 pb-24 text-stone-800">
      {/* 1. Header Ringkas */}
      <div>
        <h2 className="text-base font-bold text-[#0a3d36] flex items-center gap-1.5">
          <span>Analisis Efisiensi & Bukti Hemat</span>
          <span className="text-[10px] bg-stone-100 font-semibold text-stone-500 px-2 py-0.5 rounded border border-stone-200">
            Data contoh
          </span>
        </h2>
        <p className="text-xs text-stone-600">
          Ubah satu angka tagihan menjadi keputusan berbasis kg cucian.
        </p>
      </div>

      {/* 2. Kartu Angka Besar: kWh per kg Bulan Berjalan */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-semibold text-stone-700">Rasio Efisiensi Bulan Berjalan (Oktober)</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
            Membaik
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#0a3d36]">
                {currentKwhPerKg.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs font-bold text-stone-500">kWh / kg cucian</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-emerald-700 font-bold flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                -0,08 dari September
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600 text-[11px]">
                Biasanya: <strong>0,31</strong> (Juli-Agustus)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-stone-500 block">Total Tagihan</span>
            <span className="text-base font-bold text-stone-900">
              Rp{currentRecord.costRp.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-stone-400 block">
              {currentRecord.kwh} kWh • {currentRecord.kg} kg
            </span>
          </div>
        </div>
      </div>

      {/* 3. Grafik Batang 4 Bulan (Lonjakan Merah) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#0a3d36]" />
            <h3 className="text-xs font-bold text-stone-900">
              Tren Efisiensi 4 Bulan Terakhir
            </h3>
          </div>
          <span className="text-[10px] text-stone-400">Target: ≤0,31 kWh/kg</span>
        </div>

        {/* Visual Bar Chart */}
        <div className="flex items-end justify-between gap-2 pt-6 pb-2 h-44 px-2 border-b border-stone-100">
          {records.map((rec) => {
            const ratio = Math.round((rec.kwh / rec.kg) * 100) / 100;
            // Scale max: 0.45 = 100%
            const heightPercent = Math.min(100, Math.round((ratio / 0.45) * 100));
            const isSpikeMonth = rec.isSpike;

            return (
              <div key={rec.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {/* Value tag on top of bar */}
                <div className="text-center">
                  {isSpikeMonth && (
                    <span className="text-[9px] font-black text-rose-700 bg-rose-100 px-1 py-0.2 rounded border border-rose-300 block mb-0.5 whitespace-nowrap">
                      +0,09 lonjakan!
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-bold ${
                      isSpikeMonth ? 'text-rose-600 font-black' : 'text-stone-700'
                    }`}
                  >
                    {ratio.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* The Bar */}
                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                    isSpikeMonth
                      ? 'bg-rose-500 shadow-sm border border-rose-600'
                      : rec.isCurrent
                      ? 'bg-[#0a3d36] shadow-sm'
                      : 'bg-emerald-700/80'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Label Month */}
                <div className="text-center mt-1">
                  <span className="text-xs font-bold text-stone-800 block leading-tight">
                    {rec.month}
                  </span>
                  <span className="text-[9px] text-stone-400 block">
                    {rec.kwh} kWh
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Catatan Kaki Lonjakan & Data Contoh */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-2.5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-rose-900 leading-relaxed">
            <strong>September terdeteksi lonjakan (+29% dari biasanya):</strong>{' '}
            Mencapai 0,40 kWh/kg akibat setrika uap menyala nonstop & pengering setengah muatan saat lemburan.
          </p>
        </div>
      </div>

      {/* 4. Tabel Riwayat Tagihan Detail */}
      <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex flex-col gap-2">
        <h3 className="text-xs font-bold text-stone-900 flex items-center justify-between">
          <span>Riwayat Tagihan & Beban Cucian</span>
          <span className="text-[10px] text-stone-500 font-normal">Tarif Rp1.500/kWh</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-[11px]">
                <th className="py-1.5 font-semibold">Bulan</th>
                <th className="py-1.5 font-semibold">kWh</th>
                <th className="py-1.5 font-semibold">Cucian</th>
                <th className="py-1.5 font-semibold">Rasio</th>
                <th className="py-1.5 font-semibold text-right">Rupiah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {records.map((r) => (
                <tr key={r.month} className={r.isCurrent ? 'bg-emerald-50/50 font-semibold' : ''}>
                  <td className="py-2 flex items-center gap-1">
                    <span>{r.month}</span>
                    {r.isCurrent && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded">
                        Berjalan
                      </span>
                    )}
                    {r.isSpike && (
                      <span className="text-[9px] bg-rose-100 text-rose-800 px-1 rounded font-bold">
                        Lonjakan
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-stone-700">{r.kwh}</td>
                  <td className="py-2 text-stone-700">{r.kg} kg</td>
                  <td className="py-2">
                    <span
                      className={`text-xs font-bold ${
                        r.isSpike ? 'text-rose-600' : 'text-stone-800'
                      }`}
                    >
                      {calculateProvenSavings(0, 0, 0, 0) && (r.kwh / r.kg).toFixed(2).replace('.', ',')}
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold text-[#0a3d36]">
                    Rp{r.costRp.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Rincian Per Alat (Estimasi Dikalibrasi) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0a3d36]" />
            <h3 className="text-xs font-bold text-stone-900">
              Estimasi Konsumsi Per Alat (Oktober)
            </h3>
          </div>
          <span className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
            Estimasi
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {appliances.map((app) => {
            const cost = app.estimatedMonthlyCostRp || 0;
            const percent = Math.round((cost / currentRecord.costRp) * 100);

            return (
              <div key={app.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-800">{app.name}</span>
                    <span className="text-[10px] text-stone-500">
                      ({app.count} unit • {app.powerWatts}W • {app.dailyHours} jam/hari)
                    </span>
                  </div>
                  <span className="font-bold text-[#0a3d36]">
                    Rp{cost.toLocaleString('id-ID')} ({percent}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      app.name.toLowerCase().includes('setrika')
                        ? 'bg-rose-500'
                        : app.name.toLowerCase().includes('pengering')
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Wajib Label Sensor IoT */}
        <div className="text-[10px] text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>
            Estimasi daya × jam pakai dikalibrasikan ke total meter. Sensor IoT menyusul untuk mengukur langsung per alat.
          </span>
        </div>
      </div>

      {/* 6. Cek Hemat Terbukti & Garansi Fee Rp20.000 */}
      <div className="bg-gradient-to-br from-emerald-900 to-[#0a3d36] text-white rounded-2xl p-4 shadow-md border border-emerald-700/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Bukti Hemat & Garansi Fee
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
            {guaranteeStatus.badgeLabel}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-emerald-700/60 pb-3">
          <div>
            <span className="text-[11px] text-emerald-200 block">
              Hemat Terbukti Bulan Ini
            </span>
            <span className="text-2xl font-black text-white">
              Rp{provenSavingsRp.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-emerald-200 block">
              Commitment Fee Wattera
            </span>
            <span className="text-base font-bold text-emerald-300">
              Rp{profile.commitmentFeeRp.toLocaleString('id-ID')} / bln
            </span>
          </div>
        </div>

        {/* Metode Hitung Transparan */}
        <div className="text-xs text-emerald-100 flex flex-col gap-1">
          <div className="font-semibold text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Metode Perhitungan Penghematan:
          </div>
          <p className="text-[11px] text-emerald-200/90 font-mono bg-emerald-950/60 p-2 rounded-lg border border-emerald-700/40">
            Hemat = (kWh/kg baseline − kWh/kg aktual) × kg aktual × tarif
            <br />
            = (0,35 baseline lonjakan − 0,32) × 1.040 kg × Rp1.500
            <br />
            = <strong>Rp46.800</strong> (Dibulatkan Rp45.000)
          </p>
        </div>

        {/* Garansi Wattera */}
        <div className="bg-emerald-800/40 p-2.5 rounded-xl border border-emerald-600/30 text-[11px] text-emerald-100 flex flex-col gap-1">
          <span className="font-bold text-emerald-200">
            🛡️ Kebijakan Garansi Wattera:
          </span>
          <p>
            {guaranteeStatus.statusMessage} Penghematan Bu Rini (Rp45.000) sudah lebih dari 2x lipat biaya komitmen fee bulanan.
          </p>
          <p className="text-[10px] text-emerald-300/80 italic mt-0.5">
            Syarat garansi: Saran hemat AI yang disetujui dijalankan secara konsisten dan data meteran rutin dicatat.
          </p>
        </div>
      </div>
    </div>
  );
};
