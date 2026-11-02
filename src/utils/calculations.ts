/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BillingRecord {
  month: string; // e.g. "Juli", "Agustus", "September", "Oktober"
  year: number;
  kwh: number;
  kg: number;
  costRp: number;
  isCurrent?: boolean;
  isSpike?: boolean;
  spikeDifference?: number; // e.g. +0.09
}

export interface ApplianceItem {
  id: string;
  name: string;
  count: number;
  powerWatts: number;
  dailyHours: number;
  estimatedMonthlyCostRp?: number;
}

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  potentialSavingsRp: number;
  reason: string;
  category: 'pengering' | 'setrika' | 'mesin_cuci' | 'operasional';
  status: 'pending' | 'agreed' | 'postponed' | 'rejected';
  rejectionReason?: string;
  implementedAt?: string;
}

/**
 * Hitung rasio efisiensi energi: kWh per kg cucian.
 * Dibulatkan ke 2 desimal.
 */
export function calculateKwhPerKg(kwh: number, kg: number): number {
  if (kg <= 0) return 0;
  return Math.round((kwh / kg) * 100) / 100;
}

/**
 * Hitung rata-rata efisiensi (baseline) dari bulan-bulan acuan (Juli & Agustus).
 */
export function calculateBaselineKwhPerKg(records: BillingRecord[]): number {
  const baselineMonths = records.filter(
    (r) => r.month === 'Juli' || r.month === 'Agustus'
  );
  if (baselineMonths.length === 0) {
    // Fallback jika tidak ada data Juli & Agustus
    const nonSpike = records.filter((r) => !r.isSpike && !r.isCurrent);
    if (nonSpike.length === 0) return 0.31;
    const sum = nonSpike.reduce((acc, curr) => acc + calculateKwhPerKg(curr.kwh, curr.kg), 0);
    return Math.round((sum / nonSpike.length) * 100) / 100;
  }
  const sum = baselineMonths.reduce(
    (acc, curr) => acc + calculateKwhPerKg(curr.kwh, curr.kg),
    0
  );
  return Math.round((sum / baselineMonths.length) * 100) / 100;
}

/**
 * Deteksi lonjakan energi:
 * Lonjakan terjadi bila kWh/kg lebih dari threshold (default 20% di atas baseline).
 */
export function isSpike(
  kwhPerKg: number,
  baselineKwhPerKg: number,
  thresholdMultiplier = 1.2
): { isSpike: boolean; diffFromBaseline: number } {
  const diff = Math.round((kwhPerKg - baselineKwhPerKg) * 100) / 100;
  const isAboveThreshold = kwhPerKg >= baselineKwhPerKg * thresholdMultiplier;
  return {
    isSpike: isAboveThreshold,
    diffFromBaseline: diff,
  };
}

/**
 * Hitung hemat terbukti bulan ini:
 * Formula: (kWh/kg baseline − kWh/kg bulan ini) × kg bulan ini × tarif.
 * Jika hasilnya negatif (lebih boros dari baseline), hemat = 0.
 */
export function calculateProvenSavings(
  baselineKwhPerKg: number,
  currentKwhPerKg: number,
  currentKg: number,
  ratePerKwh: number
): {
  savingsKwh: number;
  savingsRp: number;
  isSaving: boolean;
  formulaDescription: string;
} {
  const kwhPerKgDiff = baselineKwhPerKg - currentKwhPerKg;
  const savingsKwh = Math.round(kwhPerKgDiff * currentKg * 100) / 100;
  const rawSavingsRp = Math.round(savingsKwh * ratePerKwh);
  const savingsRp = Math.max(0, rawSavingsRp);

  return {
    savingsKwh: Math.max(0, savingsKwh),
    savingsRp,
    isSaving: rawSavingsRp > 0,
    formulaDescription: `(${baselineKwhPerKg} baseline − ${currentKwhPerKg} aktual) × ${currentKg} kg × Rp${ratePerKwh.toLocaleString('id-ID')}`,
  };
}

/**
 * Hitung status komitmen fee dan garansi Wattera:
 * Commitment fee = Rp20.000 / bulan
 * Jika hemat >= fee: "Hemat melampaui fee"
 * Jika hemat < fee: "Selisih Rp... dikreditkan ke bulan depan"
 */
export function calculateGuaranteeFeeStatus(
  provenSavingsRp: number,
  commitmentFeeRp = 20000
): {
  exceedsFee: boolean;
  creditRp: number;
  statusMessage: string;
  badgeLabel: string;
} {
  if (provenSavingsRp >= commitmentFeeRp) {
    return {
      exceedsFee: true,
      creditRp: 0,
      statusMessage: 'Hemat melampaui fee langganan Wattera!',
      badgeLabel: 'Hemat melampaui fee',
    };
  } else {
    const diff = commitmentFeeRp - provenSavingsRp;
    return {
      exceedsFee: false,
      creditRp: diff,
      statusMessage: `Selisih Rp${diff.toLocaleString('id-ID')} dikreditkan ke bulan depan.`,
      badgeLabel: `Kredit Garansi: Rp${diff.toLocaleString('id-ID')}`,
    };
  }
}

/**
 * Kalibrasi estimasi biaya per alat agar total estimasi sama dengan total tagihan riil.
 * Formula dasar: Wh per hari = count * powerWatts * dailyHours
 * Total Wh per bulan (30 hari) = dailyWh * 30 / 1000 => kWh per bulan
 * Rasio proporsional dikalibrasikan ke total kWh aktual bulan berjalan.
 */
export function calibrateAppliancesToActualCost(
  appliances: ApplianceItem[],
  actualTotalCostRp: number
): ApplianceItem[] {
  const monthlyKwhList = appliances.map((app) => {
    const dailyKwh = (app.count * app.powerWatts * app.dailyHours) / 1000;
    return dailyKwh * 30;
  });

  const rawTotalKwh = monthlyKwhList.reduce((sum, k) => sum + k, 0);

  if (rawTotalKwh === 0) {
    const equalShare = Math.round(actualTotalCostRp / appliances.length);
    return appliances.map((app) => ({
      ...app,
      estimatedMonthlyCostRp: equalShare,
    }));
  }

  // Alokasikan proporsional ke actualTotalCostRp
  let runningSum = 0;
  return appliances.map((app, index) => {
    if (index === appliances.length - 1) {
      // Pastikan genap tepat sama dengan total biaya
      return {
        ...app,
        estimatedMonthlyCostRp: actualTotalCostRp - runningSum,
      };
    }
    const share = Math.round((monthlyKwhList[index] / rawTotalKwh) * actualTotalCostRp);
    runningSum += share;
    return {
      ...app,
      estimatedMonthlyCostRp: share,
    };
  });
}
