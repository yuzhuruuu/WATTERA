/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { RecordScreen } from './screens/RecordScreen';
import { CelebrateScreen } from './screens/CelebrateScreen';
import { ChatScreen } from './screens/ChatScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { DemoTourModal } from './components/DemoTourModal';

import {
  INITIAL_PROFILE,
  INITIAL_BILLING_RECORDS,
  INITIAL_APPLIANCES,
  INITIAL_MISSIONS,
  INITIAL_LOGS,
  UserProfile,
  ActivityLog,
} from './data/sampleData';

import {
  BillingRecord,
  ApplianceItem,
  MissionItem,
  calibrateAppliancesToActualCost,
} from './utils/calculations';

export default function App() {
  // 1. Persistent State with LocalStorage fallbacks
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('wattera_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [records, setRecords] = useState<BillingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('wattera_records');
      return saved ? JSON.parse(saved) : INITIAL_BILLING_RECORDS;
    } catch {
      return INITIAL_BILLING_RECORDS;
    }
  });

  const [appliances, setAppliances] = useState<ApplianceItem[]>(() => {
    try {
      const saved = localStorage.getItem('wattera_appliances');
      if (saved) return JSON.parse(saved);
      // Calibrate initial appliances to October cost (Rp499.500)
      return calibrateAppliancesToActualCost(INITIAL_APPLIANCES, 499500);
    } catch {
      return calibrateAppliancesToActualCost(INITIAL_APPLIANCES, 499500);
    }
  });

  const [missions, setMissions] = useState<MissionItem[]>(() => {
    try {
      const saved = localStorage.getItem('wattera_missions');
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('wattera_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('beranda');
  // Secondary screen for Celebration
  const [showCelebrateScreen, setShowCelebrateScreen] = useState(false);
  // Demo tour modal
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wattera_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('wattera_records', JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem('wattera_appliances', JSON.stringify(appliances));
    } catch (e) {}
  }, [appliances]);

  useEffect(() => {
    try {
      localStorage.setItem('wattera_missions', JSON.stringify(missions));
    } catch (e) {}
  }, [missions]);

  useEffect(() => {
    try {
      localStorage.setItem('wattera_logs', JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  // Handlers
  const handleUpdateMissionStatus = (
    id: string,
    status: MissionItem['status'],
    reason?: string
  ) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              rejectionReason: reason,
              implementedAt: status === 'agreed' ? new Date().toISOString() : undefined,
            }
          : m
      )
    );
  };

  const handleSaveRecord = (newLog: ActivityLog) => {
    // 1. Add log
    setLogs((prev) => [newLog, ...prev]);

    // 2. Increment streak & weekly progress
    setProfile((prev) => ({
      ...prev,
      dailyStreak: prev.dailyStreak + 1,
      daysCompletedThisWeek: Math.min(prev.weeklyTargetDays, prev.daysCompletedThisWeek + 1),
    }));

    // 3. Update October billing record if new reading
    if (newLog.kwhReading) {
      setRecords((prev) =>
        prev.map((r) =>
          r.isCurrent
            ? {
                ...r,
                kwh: newLog.kwhReading,
                costRp: Math.round(newLog.kwhReading * profile.ratePerKwh),
              }
            : r
        )
      );
    }
  };

  const handleResetToSampleData = () => {
    setProfile(INITIAL_PROFILE);
    setRecords(INITIAL_BILLING_RECORDS);
    setAppliances(calibrateAppliancesToActualCost(INITIAL_APPLIANCES, 499500));
    setMissions(INITIAL_MISSIONS);
    setLogs(INITIAL_LOGS);
    setShowCelebrateScreen(false);
    setActiveTab('beranda');
  };

  const handleClearAllData = () => {
    localStorage.clear();
    handleResetToSampleData();
  };

  const handleSelectTab = (tab: TabType) => {
    setShowCelebrateScreen(false);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 flex justify-center selection:bg-emerald-200">
      {/* Mobile Mockup Container (max-w-[420px] on desktop with subtle frame shadow) */}
      <div className="w-full max-w-[420px] min-h-screen bg-[#faf7f2] flex flex-col shadow-2xl relative border-x border-stone-200/80">
        {/* App Header */}
        <Header
          profile={profile}
          onStartDemo={() => setIsDemoModalOpen(true)}
          isDemoRunning={isDemoModalOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-3 overflow-y-auto">
          {showCelebrateScreen ? (
            <CelebrateScreen profile={profile} />
          ) : activeTab === 'beranda' ? (
            <HomeScreen
              profile={profile}
              missions={missions}
              onUpdateMissionStatus={handleUpdateMissionStatus}
              onNavigateToCatat={() => setActiveTab('catat')}
              onNavigateToAnalysis={() => setActiveTab('analisis')}
              onNavigateToCelebrate={() => setShowCelebrateScreen(true)}
            />
          ) : activeTab === 'analisis' ? (
            <AnalysisScreen
              profile={profile}
              records={records}
              appliances={appliances}
            />
          ) : activeTab === 'catat' ? (
            <RecordScreen
              onSaveRecord={handleSaveRecord}
              onNavigateToAnalysis={() => setActiveTab('analisis')}
            />
          ) : activeTab === 'tanya_ai' ? (
            <ChatScreen profile={profile} />
          ) : activeTab === 'pengaturan' ? (
            <SettingsScreen
              profile={profile}
              appliances={appliances}
              onUpdateProfile={(up) => setProfile((prev) => ({ ...prev, ...up }))}
              onUpdateAppliances={(apps) => setAppliances(apps)}
              onResetToSampleData={handleResetToSampleData}
              onClearAllData={handleClearAllData}
            />
          ) : null}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

        {/* 60s Demo Tour Modal */}
        <DemoTourModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
          onNavigateTab={(tab) => {
            setShowCelebrateScreen(false);
            setActiveTab(tab);
          }}
        />
      </div>
    </div>
  );
}
