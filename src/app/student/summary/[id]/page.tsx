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
  Share2,
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
        <span className="text-xs text-[#8C6D53] font-bold bg-[#FAF2EC] px-3.5 py-1 rounded-full border border-[#E8D4C5]">
          Lesson Card ID: {record.id}
        </span>
      </div>

      {/* Main Premium Physical Paper Lesson Card */}
      <div className="relative overflow-hidden rounded-3xl paper-card p-8 sm:p-10 border border-[#EAE3D9] shadow-warm space-y-8 bg-[#FDFBF7]">
        {/* Soft Background Warm Blurs */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E88D67]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#8C6D53]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFECE6] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF2EC] border border-[#E8D4C5] text-[#8C6D53] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              AI 課堂情緒過濾 & 淨化學習卡片 (P5)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27] tracking-tight">
              {record.song_title || '巴哈：E大調小提琴協奏曲 第一樂章'}
            </h1>
            <p className="text-xs text-[#7A736E] font-medium">
              指導老師：張老師 · 上課日期：{new Date(record.created_at).toLocaleDateString('zh-TW')}
            </p>
          </div>

          {/* BPM Target Pill Badge */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#EFECE6] shrink-0 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FAF2EC] text-[#8C6D53] flex items-center justify-center border border-[#E8D4C5]">
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
        <div className="warm-card p-4 rounded-2xl border border-[#EFECE6] flex items-center gap-4 bg-white shadow-sm">
          <button className="w-10 h-10 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white flex items-center justify-center shadow-md shadow-[#8C6D53]/20 transition-all shrink-0">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-bold text-[#332C27]">
              <span>課堂現場音訊紀錄 (Classroom Audio)</span>
              <span className="text-[#7A736E] font-mono">03:45 / 12:30</span>
            </div>
            <div className="h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EFECE6]">
              <div className="w-1/3 h-full bg-gradient-to-r from-[#8C6D53] to-[#E88D67]" />
            </div>
          </div>
          <Volume2 className="w-5 h-5 text-[#7A736E] shrink-0" />
        </div>

        {/* Section 1: Technical Tips & Hand Postures */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#8C6D53] uppercase tracking-wider flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#8C6D53]" />
            一、本週技術與手型重點 (Technical Tips)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {summary.technical_tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4.5 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] space-y-1 shadow-sm"
              >
                <span className="text-[10px] font-mono text-[#8C6D53] font-bold">TIP #{idx + 1}</span>
                <p className="text-xs text-[#332C27] font-medium leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Music Theory & Score Details */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#3D5240] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3D5240]" />
            二、樂理與節拍重點 (Music Theory & Timing)
          </h2>
          <div className="p-4.5 rounded-2xl bg-[#E3E8E1]/50 border border-[#C5D2C2] space-y-2.5 shadow-sm">
            <div className="flex items-start gap-2.5 text-xs text-[#332C27] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#3D5240] shrink-0 mt-0.5" />
              <span>十六分音符過渡區間需注意手腕連貫度，避免第 16 小節搶拍。</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#332C27] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#3D5240] shrink-0 mt-0.5" />
              <span>升 C (C#) 按弦位置精準度維持，注意第二指拉回力度。</span>
            </div>
          </div>
        </div>

        {/* Section 3: Homework & Practice Guide */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#B85536] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E88D67]" />
            三、回家作業與練習指引 (Homework)
          </h2>
          <div className="space-y-2">
            {summary.homework.map((hw, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FCEADE]/40 border border-[#F6D0B8] flex items-center justify-between text-xs text-[#332C27] font-medium shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E88D67] text-white flex items-center justify-center font-mono font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span>{hw}</span>
                </div>
                <span className="text-[10px] text-[#B85536] font-bold bg-[#FCEADE] px-2.5 py-0.5 rounded-full border border-[#F6D0B8]">
                  未完成
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Encouragement Quote Card */}
        <div className="p-6 rounded-3xl bg-[#FAF2EC] border border-[#E8D4C5] text-center space-y-2.5 shadow-sm">
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
