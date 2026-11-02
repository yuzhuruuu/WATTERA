/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateKwhPerKg,
  calculateBaselineKwhPerKg,
  isSpike,
  calculateProvenSavings,
  calculateGuaranteeFeeStatus,
  calibrateAppliancesToActualCost,
  BillingRecord,
  ApplianceItem,
} from './calculations';

test('calculateKwhPerKg returns rounded 2-decimal ratio', () => {
  assert.equal(calculateKwhPerKg(322, 1030), 0.31);
  assert.equal(calculateKwhPerKg(316, 1010), 0.31);
  assert.equal(calculateKwhPerKg(421, 1040), 0.40);
  assert.equal(calculateKwhPerKg(333, 1040), 0.32);
  assert.equal(calculateKwhPerKg(100, 0), 0);
});

test('calculateBaselineKwhPerKg computes average of Juli and Agustus', () => {
  const records: BillingRecord[] = [
    { month: 'Juli', year: 2026, kwh: 322, kg: 1030, costRp: 483000 },
    { month: 'Agustus', year: 2026, kwh: 316, kg: 1010, costRp: 474000 },
    { month: 'September', year: 2026, kwh: 421, kg: 1040, costRp: 631500, isSpike: true },
    { month: 'Oktober', year: 2026, kwh: 333, kg: 1040, costRp: 499500, isCurrent: true },
  ];

  const baseline = calculateBaselineKwhPerKg(records);
  assert.equal(baseline, 0.31);
});

test('isSpike detects surge when kWh/kg is >20% above baseline', () => {
  const baseline = 0.31;
  // September: 0.40 vs 0.31 -> diff is +0.09, 0.40 >= 0.31 * 1.2 (0.372) -> true
  const septCheck = isSpike(0.40, baseline);
  assert.equal(septCheck.isSpike, true);
  assert.equal(septCheck.diffFromBaseline, 0.09);

  // Oktober: 0.32 vs 0.31 -> diff is +0.01, not a spike
  const octCheck = isSpike(0.32, baseline);
  assert.equal(octCheck.isSpike, false);
});

test('calculateProvenSavings computes formula correctly', () => {
  // Baseline 0.35 to 0.32 for 1000kg at Rp1500
  // (0.35 - 0.32) * 1000 * 1500 = 0.03 * 1000 * 1500 = 30 * 1500 = 45000
  const savings = calculateProvenSavings(0.35, 0.32, 1000, 1500);
  assert.equal(savings.savingsRp, 45000);
  assert.equal(savings.isSaving, true);

  // When current is worse than baseline
  const worse = calculateProvenSavings(0.31, 0.40, 1040, 1500);
  assert.equal(worse.savingsRp, 0);
  assert.equal(worse.isSaving, false);
});

test('calculateGuaranteeFeeStatus evaluates commitment fee vs savings', () => {
  // Case 1: Savings Rp45.000 >= Fee Rp20.000
  const pass = calculateGuaranteeFeeStatus(45000, 20000);
  assert.equal(pass.exceedsFee, true);
  assert.equal(pass.creditRp, 0);
  assert.match(pass.statusMessage, /melampaui/);

  // Case 2: Savings Rp12.000 < Fee Rp20.000
  const credit = calculateGuaranteeFeeStatus(12000, 20000);
  assert.equal(credit.exceedsFee, false);
  assert.equal(credit.creditRp, 8000);
  assert.match(credit.statusMessage, /8\.000/);
});

test('calibrateAppliancesToActualCost sums up exactly to total actual cost', () => {
  const appliances: ApplianceItem[] = [
    { id: '1', name: 'Setrika uap', count: 1, powerWatts: 2000, dailyHours: 6 },
    { id: '2', name: 'Pengering', count: 2, powerWatts: 1500, dailyHours: 5 },
    { id: '3', name: 'Mesin cuci', count: 3, powerWatts: 450, dailyHours: 7 },
  ];

  const totalActual = 499500; // Tagihan Oktober
  const calibrated = calibrateAppliancesToActualCost(appliances, totalActual);
  const sum = calibrated.reduce((acc, curr) => acc + (curr.estimatedMonthlyCostRp || 0), 0);

  assert.equal(sum, totalActual);
  assert.ok(calibrated[0].estimatedMonthlyCostRp! > 0);
});
