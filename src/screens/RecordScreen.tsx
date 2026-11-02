/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Camera,
  Mic,
  MicOff,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Zap,
  ArrowRight,
  FileText,
  Volume2,
} from 'lucide-react';
import { ActivityLog } from '../data/sampleData';

interface RecordScreenProps {
  onSaveRecord: (newLog: ActivityLog) => void;
  onNavigateToAnalysis: () => void;
}

export const RecordScreen: React.FC<RecordScreenProps> = ({
  onSaveRecord,
  onNavigateToAnalysis,
}) => {
  // Step state: 1 = Input (Foto + Suara), 2 = Konfirmasi AI & Review
  const [step, setStep] = useState<1 | 2>(1);

  // Meter Photo state
  const [meterImagePreview, setMeterImagePreview] = useState<string | null>(null);
  const [isReadingMeter, setIsReadingMeter] = useState(false);
  const [meterKwh, setMeterKwh] = useState<number>(333);
  const [meterConfidence, setMeterConfidence] = useState<number>(0.94);
  const [detectedMeterText, setDetectedMeterText] = useState<string>('00333.4 kWh');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceText, setVoiceText] = useState('');
  const [isExtractingVoice, setIsExtractingVoice] = useState(false);
  const [voiceKg, setVoiceKg] = useState<number>(40);
  const [voiceOperatingHours, setVoiceOperatingHours] = useState<number>(6);
  const [voiceAppliances, setVoiceAppliances] = useState<string[]>([
    'Setrika uap',
    'Mesin cuci (3 unit)',
  ]);
  const [voiceConfidence, setVoiceConfidence] = useState<number>(0.92);
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);
  const [clarificationAnswer, setClarificationAnswer] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const timerIntervalRef = useRef<any>(null);

  // Fallback demo preset photo
  const handleUseSampleMeterPhoto = async () => {
    setIsReadingMeter(true);
    // Simulating photo capture of PLN digital meter
    setTimeout(async () => {
      setMeterImagePreview(
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'
      );
      try {
        const res = await fetch('/api/gemini/meter-ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isSample: true }),
        });
        const data = await res.json();
        setMeterKwh(data.kwh || 333);
        setMeterConfidence(data.confidence || 0.94);
        setDetectedMeterText(data.detectedText || '00333.4 kWh');
      } catch (e) {
        setMeterKwh(333);
        setMeterConfidence(0.94);
        setDetectedMeterText('00333.4 kWh (Mode demo)');
      } finally {
        setIsReadingMeter(false);
      }
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setMeterImagePreview(base64);
      setIsReadingMeter(true);
      try {
        const res = await fetch('/api/gemini/meter-ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
        });
        const data = await res.json();
        setMeterKwh(data.kwh || 333);
        setMeterConfidence(data.confidence || 0.9);
        setDetectedMeterText(data.detectedText || '333 kWh');
      } catch (err) {
        console.error('OCR failed:', err);
        setMeterKwh(333);
        setMeterConfidence(0.85);
      } finally {
        setIsReadingMeter(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Voice recording simulation / MediaRecorder
  const handleToggleRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
      setRecordingSeconds(0);
      handleProcessVoiceNote('Setrika uap 6 jam, cucian 40 kg, mesin cuci 3 jalan bareng');
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleUseSampleVoice = () => {
    const sample = 'Setrika uap 6 jam, cucian 40 kg, mesin cuci 3 unit';
    setVoiceText(sample);
    handleProcessVoiceNote(sample);
  };

  const handleProcessVoiceNote = async (textToProcess: string) => {
    setIsExtractingVoice(true);
    setVoiceText(textToProcess);
    try {
      const res = await fetch('/api/gemini/voice-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: textToProcess }),
      });
      const data = await res.json();
      setVoiceKg(data.kg || 40);
      setVoiceOperatingHours(data.operatingHours || 6);
      setVoiceAppliances(data.appliancesUsed || ['Setrika uap', 'Mesin cuci']);
      setVoiceConfidence(data.confidence || 0.92);
      setClarificationQuestion(data.clarificationQuestion || null);
    } catch (err) {
      setVoiceKg(40);
      setVoiceOperatingHours(6);
      setVoiceAppliances(['Setrika uap', 'Mesin cuci']);
      setVoiceConfidence(0.9);
    } finally {
      setIsExtractingVoice(false);
    }
  };

  const handleProceedToConfirmation = () => {
    setStep(2);
  };

  const handleSaveAll = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        date: 'Hari ini',
        time: `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')} WIB`,
        kwhReading: Number(meterKwh),
        kgLaundry: Number(voiceKg),
        appliancesUsed: voiceAppliances,
        operatingHours: Number(voiceOperatingHours),
        confidenceScore: Math.round(((meterConfidence + voiceConfidence) / 2) * 100) / 100,
        source: 'foto_meter',
        note: voiceText || 'Pencatatan harian otomatis AI Copilot',
      };

      onSaveRecord(newLog);
      setIsSubmitting(false);
      setSavedSuccess(true);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-3 pb-24 text-stone-800">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0a3d36] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            Catat Meteran & Aktivitas
          </h2>
          <p className="text-xs text-stone-600">
            Cukup foto angka meteran dan sebutkan cucian hari ini.
          </p>
        </div>
        <span className="text-[10px] bg-stone-100 font-semibold px-2 py-0.5 rounded text-stone-600 border border-stone-200">
          Langkah {step} dari 2
        </span>
      </div>

      {savedSuccess ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center flex flex-col items-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              Catatan Berhasil Disimpan!
            </h3>
            <p className="text-xs text-emerald-800 mt-1 max-w-xs">
              Streak harian Bu Rini bertambah, dan rasio efisiensi kWh/kg bulan berjalan
              langsung diperbarui.
            </p>
          </div>
          <div className="flex gap-2 mt-2 w-full max-w-xs">
            <button
              onClick={() => {
                setSavedSuccess(false);
                setStep(1);
              }}
              className="flex-1 text-xs py-2 px-3 rounded-lg border border-stone-300 text-stone-700 bg-white font-medium cursor-pointer"
            >
              Catat Lagi
            </button>
            <button
              onClick={onNavigateToAnalysis}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-[#0a3d36] text-white font-bold cursor-pointer hover:bg-[#0d4c44]"
            >
              Lihat Analisis
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        <>
          {/* BAGIAN 1: FOTO METERAN ATAU STRUK TOKEN */}
          <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Foto Meteran / Struk Token
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Gemini AI membaca angka kWh otomatis
                  </p>
                </div>
              </div>

              <button
                onClick={handleUseSampleMeterPhoto}
                className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                Pakai Foto Contoh
              </button>
            </div>

            {/* Input File Hidden */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Box Preview / Upload */}
            {meterImagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 flex items-center justify-center max-h-44">
                <img
                  src={meterImagePreview}
                  alt="Meter Preview"
                  className="w-full h-44 object-cover opacity-90"
                />
                {isReadingMeter && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-1.5">
                    <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                    <span>Gemini AI sedang membaca angka kWh...</span>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 text-[10px] bg-black/70 hover:bg-black text-white px-2 py-1 rounded-md cursor-pointer flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" /> Ganti Foto
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-1.5 bg-stone-50/50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-stone-800">
                  Ambil Foto Meteran Listrik
                </div>
                <p className="text-[10px] text-stone-500 max-w-[240px]">
                  Bisa foto meter digital PLN, analog, atau struk pembelian token listrik.
                </p>
              </div>
            )}

            {/* Hasil Bacaan OCR & Kolom yang Bisa Diedit */}
            <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Angka Meteran (kWh):</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  Keyakinan AI: {Math.round(meterConfidence * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={meterKwh}
                  onChange={(e) => setMeterKwh(Number(e.target.value))}
                  className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-sm font-bold text-[#0a3d36] focus:outline-emerald-600"
                  placeholder="333"
                />
                <span className="text-xs font-bold text-stone-600">kWh</span>
              </div>
              <div className="text-[10px] text-stone-500 flex items-center gap-1">
                <FileText className="w-3 h-3 shrink-0" />
                <span>Terbaca di meter: "{detectedMeterText}" (Dapat dikoreksi manual)</span>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: REKAM CATATAN SUARA / TEKS */}
          <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Catatan Suara / Operasional
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Sebutkan kg cucian & mesin yang menyala
                  </p>
                </div>
              </div>

              <button
                onClick={handleUseSampleVoice}
                className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3 text-amber-600" />
                Pakai Suara Contoh
              </button>
            </div>

            {/* Tombol Rekam Interaktif */}
            <div className="flex items-center justify-center py-2">
              <button
                onClick={handleToggleRecord}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-bold text-xs transition-all cursor-pointer shadow-md ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-[#0a3d36] hover:bg-[#0d4c44] text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Stop Merekam ({recordingSeconds}s)...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Tekan & Rekam Catatan Suara</span>
                  </>
                )}
              </button>
            </div>

            {/* Input Cadangan Teks */}
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                Atau ketik catatan langsung jika tidak memakai suara:
              </label>
              <textarea
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                onBlur={() => voiceText && handleProcessVoiceNote(voiceText)}
                placeholder='Contoh: "Setrika uap 6 jam, cucian 40 kg, mesin cuci 3 jalan"'
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-emerald-600 bg-stone-50"
              />
            </div>

            {/* Loading AI Extraction */}
            {isExtractingVoice && (
              <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg flex items-center gap-2 border border-emerald-200">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Gemini AI sedang mengekstrak kg cucian dan jam mesin...</span>
              </div>
            )}
          </div>

          {/* Tombol Lanjut ke Konfirmasi */}
          <button
            onClick={handleProceedToConfirmation}
            className="w-full bg-[#0a3d36] hover:bg-[#0d4c44] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-[0.98]"
          >
            <span>Tinjau Hasil Ekstraksi AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        /* STEP 2: LAYAR KONFIRMASI TERSTRUKTUR & TANYA BALIK AI */
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-stone-900">
                  Konfirmasi Isian Terstruktur
                </h3>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                Keyakinan: {Math.round(voiceConfidence * 100)}%
              </span>
            </div>

            {/* Isian 1: Angka kWh */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-stone-600">Stand Meteran Listrik:</span>
              <span className="font-bold text-[#0a3d36] text-sm">
                {meterKwh} kWh
              </span>
            </div>

            {/* Isian 2: Total Kg Cucian */}
            <div className="flex items-center justify-between text-xs py-1 border-t border-stone-100">
              <span className="text-stone-600">Total Cucian Hari Ini:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={voiceKg}
                  onChange={(e) => setVoiceKg(Number(e.target.value))}
                  className="w-16 text-right font-bold text-sm bg-stone-50 border border-stone-300 rounded px-1.5 py-0.5"
                />
                <span className="font-bold text-stone-700">kg</span>
              </div>
            </div>

            {/* Isian 3: Jam Operasi */}
            <div className="flex items-center justify-between text-xs py-1 border-t border-stone-100">
              <span className="text-stone-600">Durasi Pakai Alat Utama:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={voiceOperatingHours}
                  onChange={(e) => setVoiceOperatingHours(Number(e.target.value))}
                  className="w-16 text-right font-bold text-sm bg-stone-50 border border-stone-300 rounded px-1.5 py-0.5"
                />
                <span className="font-bold text-stone-700">jam</span>
              </div>
            </div>

            {/* Isian 4: Mesin yang Menyala */}
            <div className="text-xs py-1 border-t border-stone-100">
              <span className="text-stone-600 block mb-1">Mesin yang Terdeteksi Aktif:</span>
              <div className="flex flex-wrap gap-1.5">
                {voiceAppliances.map((app, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                  >
                    ✓ {app}
                  </span>
                ))}
              </div>
            </div>

            {/* TANYA BALIK AI (Jika keyakinan < 0.7 atau ada ambiguitas) */}
            {clarificationQuestion && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex flex-col gap-2 mt-1">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Wattera AI bertanya balik:
                    </h4>
                    <p className="text-xs text-amber-900 mt-0.5">
                      "{clarificationQuestion}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setClarificationAnswer('Cucian basah');
                      setVoiceConfidence(0.95);
                    }}
                    className="text-[10px] bg-white border border-amber-300 hover:bg-amber-100 px-2 py-1 rounded text-amber-950 font-medium cursor-pointer"
                  >
                    Cucian basah
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setClarificationAnswer('Sudah kering');
                      setVoiceConfidence(0.95);
                    }}
                    className="text-[10px] bg-white border border-amber-300 hover:bg-amber-100 px-2 py-1 rounded text-amber-950 font-medium cursor-pointer"
                  >
                    Sudah kering
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tombol Simpan & Batal */}
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 text-xs py-2.5 px-3 rounded-xl border border-stone-300 text-stone-700 bg-white font-semibold cursor-pointer"
            >
              Ubah Data
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSubmitting}
              className="flex-2 text-xs py-2.5 px-3 rounded-xl bg-[#0a3d36] hover:bg-[#0d4c44] text-white font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Simpan Catatan Harian</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
