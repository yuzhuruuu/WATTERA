/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { UserProfile } from '../data/sampleData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isSafetyWarning?: boolean;
}

interface ChatScreenProps {
  profile: UserProfile;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Halo Bu Rini! Saya Wattera Copilot. Ada yang ingin ditanyakan tentang pemakaian listrik di Laundry Kilat Bu Rini? Kita bisa bahas tagihan September yang sempat naik, atau tips jadwal setrika uap hari ini.`,
      timestamp: '16:00 WIB',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Kenapa September kemarin naik?',
    'Alat mana yang paling boros?',
    'Boleh saya utak-atik MCB agar hemat?',
    'Berapa target efisiensi kWh bulan ini?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();

      const isWarning =
        data.reply?.toLowerCase().includes('teknisi listrik') ||
        text.toLowerCase().includes('mcb') ||
        text.toLowerCase().includes('kabel') ||
        text.toLowerCase().includes('instalasi');

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Wattera siap membantu operasional Bu Rini!',
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB',
        isSafetyWarning: isWarning,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: 'Berdasarkan data laundry Bu Rini, setrika uap menyerap estimasi Rp225.000/bln dan pengering Rp180.000/bln. Menyetrika dalam 1 sesi panjang dan memastikan pengering selalu penuh muatan adalah kunci utama menghemat energi.',
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] pb-24 text-stone-800">
      {/* Title */}
      <div className="pb-2 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Bot className="w-5 h-5 text-[#0a3d36]" />
            <h2 className="text-base font-bold text-[#0a3d36]">Tanya AI Copilot</h2>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full">
            Konteks: Laundry Kilat Bu Rini
          </span>
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">
          Tanyakan apa saja seputar kebiasaan mesin & data pemakaian listrik laundry.
        </p>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-[#0a3d36] text-white'
              }`}
            >
              {msg.sender === 'user' ? 'BR' : <Sparkles className="w-4 h-4 text-emerald-300" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#0a3d36] text-white rounded-tr-xs'
                  : msg.isSafetyWarning
                  ? 'bg-rose-50 text-rose-950 border border-rose-300 rounded-tl-xs'
                  : 'bg-white text-stone-800 border border-stone-200 shadow-xs rounded-tl-xs'
              }`}
            >
              {msg.isSafetyWarning && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Aturan Keselamatan Kelistrikan
                </div>
              )}
              <p className="whitespace-pre-line">{msg.text}</p>
              <span
                className={`text-[9px] mt-1.5 block text-right ${
                  msg.sender === 'user' ? 'text-emerald-200/70' : 'text-stone-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs italic">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Wattera sedang memikirkan jawaban ramah untuk Bu Rini...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pertanyaan Cepat (Chips) */}
      <div className="py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-[11px] bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 px-2.5 py-1.5 rounded-full font-medium shrink-0 cursor-pointer shadow-2xs transition active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tanya saran hemat atau kebiasaan mesin..."
          className="flex-1 text-xs bg-white border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-emerald-600 text-stone-800 placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-[#0a3d36] hover:bg-[#0d4c44] disabled:opacity-50 text-white p-2.5 rounded-xl cursor-pointer shadow-xs transition"
          aria-label="Kirim pertanyaan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
