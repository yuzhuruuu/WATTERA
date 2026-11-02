/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BillingRecord, ApplianceItem, MissionItem } from '../utils/calculations';

export interface UserProfile {
  name: string;
  initials: string;
  businessName: string;
  location: string;
  ratePerKwh: number;
  commitmentFeeRp: number;
  dailyStreak: number;
  weeklyTargetDays: number;
  daysCompletedThisWeek: number;
  savedMoneyMonthRp: number;
  dailyReminderEnabled: boolean;
  reminderTime: string;
}

export interface ActivityLog {
  id: string;
  date: string;
  time: string;
  kwhReading: number;
  kgLaundry: number;
  appliancesUsed: string[];
  operatingHours: number;
  confidenceScore: number;
  source: 'foto_meter' | 'catatan_suara' | 'manual' | 'demo';
  note?: string;
}

export const INITIAL_PROFILE: UserProfile = {
  name: 'Bu Rini',
  initials: 'BR',
  businessName: 'Laundry Kilat Bu Rini',
  location: 'Tembalang, Semarang',
  ratePerKwh: 1500,
  commitmentFeeRp: 20000,
  dailyStreak: 7,
  weeklyTargetDays: 7,
  daysCompletedThisWeek: 5,
  savedMoneyMonthRp: 45000,
  dailyReminderEnabled: true,
  reminderTime: '17:00 WIB',
};

export const INITIAL_BILLING_RECORDS: BillingRecord[] = [
  {
    month: 'Juli',
    year: 2026,
    kwh: 322,
    kg: 1030,
    costRp: 483000,
    isCurrent: false,
    isSpike: false,
  },
  {
    month: 'Agustus',
    year: 2026,
    kwh: 316,
    kg: 1010,
    costRp: 474000,
    isCurrent: false,
    isSpike: false,
  },
  {
    month: 'September',
    year: 2026,
    kwh: 421,
    kg: 1040,
    costRp: 631500,
    isCurrent: false,
    isSpike: true,
    spikeDifference: 0.09,
  },
  {
    month: 'Oktober',
    year: 2026,
    kwh: 333,
    kg: 1040,
    costRp: 499500,
    isCurrent: true,
    isSpike: false,
  },
];

export const INITIAL_APPLIANCES: ApplianceItem[] = [
  {
    id: 'app-1',
    name: 'Setrika uap',
    count: 1,
    powerWatts: 2000,
    dailyHours: 6,
    estimatedMonthlyCostRp: 225000,
  },
  {
    id: 'app-2',
    name: 'Pengering',
    count: 2,
    powerWatts: 1500,
    dailyHours: 5,
    estimatedMonthlyCostRp: 180000,
  },
  {
    id: 'app-3',
    name: 'Mesin cuci',
    count: 3,
    powerWatts: 450,
    dailyHours: 7,
    estimatedMonthlyCostRp: 94500,
  },
];

export const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'misi-1',
    title: 'Nyalakan Pengering Hanya Saat Muatan Penuh',
    description: 'Tunggu cucian terkumpul 8-10 kg sebelum menghidupkan tumbler pengering, hindari pengeringan setengah kapasitas.',
    potentialSavingsRp: 25000,
    reason: 'Pengering adalah penyerap listrik terbesar ke-2 (Rp180.000/bln). Mengurangi 1 putaran kosong hemat ~17 kWh per bulan.',
    category: 'pengering',
    status: 'agreed',
    implementedAt: '2026-10-15',
  },
  {
    id: 'misi-2',
    title: 'Jadwalkan Setrika Uap 1 Sesi Panjang',
    description: 'Kumpulkan baju yang siap disetrika dan kerjakan maraton 4 jam sekali jalan daripada bolak-balik menyalakan boiler.',
    potentialSavingsRp: 15000,
    reason: 'Setrika uap 2000W menyedot daya puncak saat pemanasan awal (preheating) air boiler.',
    category: 'setrika',
    status: 'pending',
  },
  {
    id: 'misi-3',
    title: 'Cabut Saklar Standby di Luar Jam Operasional',
    description: 'Matikan stop kontak utama setrika & display digital mesin cuci saat toko tutup pukul 21.00 WIB.',
    potentialSavingsRp: 5000,
    reason: 'Vampire load standby menyedot 10-15 Watt per jam semalaman tanpa menghasilkan uang.',
    category: 'operasional',
    status: 'pending',
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    date: 'Hari ini',
    time: '16:30 WIB',
    kwhReading: 333,
    kgLaundry: 40,
    appliancesUsed: ['Setrika uap', 'Mesin cuci'],
    operatingHours: 6,
    confidenceScore: 0.94,
    source: 'demo',
    note: 'Cucian lancar, setrika uap 6 jam',
  },
  {
    id: 'log-2',
    date: 'Kemarin',
    time: '17:10 WIB',
    kwhReading: 322,
    kgLaundry: 38,
    appliancesUsed: ['Pengering', 'Mesin cuci'],
    operatingHours: 5,
    confidenceScore: 0.91,
    source: 'catatan_suara',
  },
];

export const BADGES_DATA = [
  {
    id: 'streak-7',
    title: 'Streak 7 Hari',
    subtitle: 'Rutin mencatat seminggu penuh',
    icon: 'flame',
    unlocked: true,
    description: 'Terbukti konsisten mengawasi meteran harian.',
  },
  {
    id: 'first-mission',
    title: 'Misi Pertama Selesai',
    subtitle: 'Menjalankan optimasi pengering',
    icon: 'check-circle-2',
    unlocked: true,
    description: 'Misi pengering disetujui dan diterapkan dalam operasional.',
  },
  {
    id: 'proven-savings',
    title: 'Hemat Terbukti',
    subtitle: 'Rp45.000 terselamatkan',
    icon: 'sparkles',
    unlocked: true,
    description: 'Penghematan nyata diverifikasi terhadap baseline.',
  },
  {
    id: 'master-efficiency',
    title: 'Juara 0,30 kWh/kg',
    subtitle: 'Target efisiensi tercapai',
    icon: 'award',
    unlocked: false,
    description: 'Rasio kWh per kg tembus di bawah 0,30 selama 2 bulan berturut-turut.',
  },
];

export const ROADMAP_FEATURES = [
  {
    title: 'Pantau Konsumsi Air',
    tag: 'PDAM & Sumur',
    desc: 'Hitung liter air per kg cucian dan deteksi kebocoran valve mesin otomatis.',
    badge: 'Segera hadir',
  },
  {
    title: 'Agen AI Terhubung Gmail',
    tag: 'Otomasi Faktur',
    desc: 'Otomatis baca e-billing tagihan PLN pascabayar langsung dari inbox email Bu Rini.',
    badge: 'Segera hadir',
  },
  {
    title: 'Pembayaran Token & PPOB',
    tag: 'Beli Token Instan',
    desc: 'Beli token listrik prabayar tanpa keluar aplikasi dengan tarif grosir khusus UMKM.',
    badge: 'Segera hadir',
  },
  {
    title: 'Sensor IoT Arus Real-Time',
    tag: 'Clip-on CT Sensor',
    desc: 'Sensor jepit tanpa bongkar kabel untuk mengukur watt tiap alat detik demi detik.',
    badge: 'Segera hadir',
  },
  {
    title: 'Insentif & Bonus Tim',
    tag: 'Karyawan Hemat',
    desc: 'Bagi hasil penghematan listrik menjadi bonus bulanan kasir & operator setrika.',
    badge: 'Segera hadir',
  },
  {
    title: 'Pembanding Antar Laundry',
    tag: 'Benchmark Tembalang',
    desc: 'Bandingkan efisiensi kWh/kg dengan rata-rata 30+ laundry kiloan se-Semarang.',
    badge: 'Segera hadir',
  },
];
