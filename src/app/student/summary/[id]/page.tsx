'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import {
  Sparkles,
  Music,
  CheckCircle2,
  Bookmark,
  ArrowLeft,
  Volume2,
  Play,
  Heart,
  Gauge,
  BookOpen,
} from 'lucide-react';

export default function StudentSummaryDetailPage() {
  const params = useParams();
  const { lessonRecords } = useDemoContext();

  const recordId = params.id as string;
  const record = lessonRecords.find((r) => r.id === recordId) || lessonRecords[0];

  const summary = record.clean_summary_json;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Navigation Top Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/practice"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A736E] hover:text-[#332C27] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 返回作業學習中心 (P4)
        </Link>
        <span className="text-xs text-[#785338] font-bold bg-[#F2E8D8] px-3.5 py-1 rounded-full border border-[#EADFC9]">
          Lesson Card ID: {record.id}
        </span>
      </div>

      {/* Main Premium Physical Paper Lesson Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FFFDF9] border border-[#EADFC9] border-l-8 border-l-[#8C6D53] shadow-[0_8px_30px_rgba(140,109,83,0.12)] p-8 sm:p-10 space-y-8">
        {/* Background Music Stave / Notes SVG Watermark */}
        <div className="absolute right-4 top-4 opacity-10 pointer-events-none select-none text-[#8C6D53]">
          <svg width="220" height="220" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>

        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EADFC9]/80 pb-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F2E8D8] text-[#785338] border border-[#EADFC9] text-xs font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E88D67]" />
              AI 課堂情緒過濾 & 實體手感學習卡片 (P5)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27] tracking-tight">
              {record.song_title || '巴哈：E大調小提琴協奏曲 第一樂章'}
            </h1>
            <p className="text-xs text-[#7A736E] font-medium">
              授課指導：張老師 · 課堂日期：{new Date(record.created_at).toLocaleDateString('zh-TW')}
            </p>
          </div>

          {/* BPM Target Pill Badge */}
          <div className="flex items-center gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EADFC9] shrink-0 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#F2E8D8] text-[#785338] flex items-center justify-center border border-[#EADFC9]">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#7A736E] font-bold block uppercase">建議練習速度</span>
              <span className="text-xl font-black text-[#8C6D53] font-mono">
                BPM {summary.bpm_recommendation || 72}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Recording Player Bar */}
        <div className="bg-[#FAF7F2] p-4.5 rounded-2xl border border-[#EADFC9] flex items-center gap-4 shadow-sm relative z-10">
          <button className="w-10 h-10 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white flex items-center justify-center shadow-md shadow-[#8C6D53]/20 transition-all shrink-0">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-bold text-[#332C27]">
              <span>課堂現場音訊紀錄 (Classroom Audio)</span>
              <span className="text-[#7A736E] font-mono">03:45 / 12:30</span>
            </div>
            <div className="h-2 bg-[#EADFC9]/50 rounded-full overflow-hidden border border-[#EADFC9]">
              <div className="w-1/3 h-full bg-gradient-to-r from-[#8C6D53] to-[#E88D67]" />
            </div>
          </div>
          <Volume2 className="w-5 h-5 text-[#7A736E] shrink-0" />
        </div>

        {/* Section 1: Technical Tips & Hand Postures */}
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2E8D8] text-[#785338] border border-[#EADFC9] text-xs font-bold shadow-sm">
            <Bookmark className="w-3.5 h-3.5 text-[#785338]" />
            一、本週技術與手型重點 (Technical Tips)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {summary.technical_tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-[#EADFC9] space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8C6D53]">♪ 手感重點 #{idx + 1}</span>
                </div>
                <p className="text-xs text-[#332C27] font-medium leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Music Theory & Score Details */}
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2] text-xs font-bold shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#3D5240]" />
            二、樂理與節拍重點 (Music Theory & Timing)
          </div>

          <div className="p-4.5 rounded-2xl bg-[#E3E8E1]/40 border border-[#C5D2C2] space-y-2.5 shadow-sm pt-3">
            <div className="flex items-start gap-2.5 text-xs text-[#332C27] font-medium">
              <span className="text-sm font-bold text-[#3D5240]">♫</span>
              <span>十六分音符過渡區間需注意手腕連貫度，避免第 16 小節搶拍。</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#332C27] font-medium">
              <span className="text-sm font-bold text-[#3D5240]">♫</span>
              <span>升 C (C#) 按弦位置精準度維持，注意第二指拉回力度。</span>
            </div>
          </div>
        </div>

        {/* Section 3: Homework & Practice Guide */}
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8] text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E88D67]" />
            三、回家作業與練習指引 (Homework)
          </div>

          <div className="space-y-2 pt-1">
            {summary.homework.map((hw, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FCEADE]/40 border border-[#F6D0B8] flex items-center justify-between text-xs text-[#332C27] font-medium shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E88D67] text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span>{hw}</span>
                </div>
                <span className="text-[10px] text-[#B85536] font-bold bg-[#FCEADE] px-3 py-0.5 rounded-full border border-[#F6D0B8]">
                  未完成
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Encouragement Quote Card */}
        <div className="p-6 rounded-3xl bg-[#FAF2EC] border border-[#E8D4C5] text-center space-y-2.5 shadow-sm relative z-10">
          <Heart className="w-5 h-5 text-[#E88D67] mx-auto fill-[#E88D67]" />
          <p className="text-sm sm:text-base text-[#8C6D53] font-bold italic leading-relaxed">
            「{summary.encouragement}」
          </p>
          <span className="text-xs text-[#7A736E] block font-medium">— 張老師課後小結</span>
        </div>
      </div>
    </div>
  );
}
