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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 返回作業學習中心 (P4)
        </Link>
        <span className="text-xs text-cyan-400 font-mono bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
          Lesson Card ID: {record.id}
        </span>
      </div>

      {/* Main Premium AI Summary Card */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 border border-cyan-500/40 shadow-2xl space-y-8 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-purple-950/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              AI 課堂情緒過濾 & 淨化學習卡片 (P5)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {record.song_title || '巴哈：E大調小提琴協奏曲 第一樂章'}
            </h1>
            <p className="text-xs text-slate-400">
              指導老師：張老師 · 上課日期：{new Date(record.created_at).toLocaleDateString('zh-TW')}
            </p>
          </div>

          {/* BPM Target Pill Badge */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">建議練習速度</span>
              <span className="text-xl font-black text-cyan-300 font-mono">
                BPM {summary.bpm_recommendation || 72}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Recording Player Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4 bg-slate-950/60">
          <button className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all shrink-0">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>課堂現場音訊紀錄 (Classroom Audio)</span>
              <span className="text-slate-500 font-mono">03:45 / 12:30</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-gradient-to-r from-purple-500 to-cyan-400" />
            </div>
          </div>
          <Volume2 className="w-5 h-5 text-slate-400 shrink-0" />
        </div>

        {/* Section 1: Technical Tips & Hand Postures */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-purple-400" />
            一、本週技術與手型重點 (Technical Tips)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.technical_tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-1"
              >
                <span className="text-[10px] font-mono text-purple-400 font-bold">TIP #{idx + 1}</span>
                <p className="text-xs text-slate-200 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Music Theory & Score Details */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            二、樂理與節拍重點 (Music Theory & Timing)
          </h2>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
            <div className="flex items-start gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>十六分音符過渡區間需注意手腕連貫度，避免第 16 小節搶拍。</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>升 C (C#) 按弦位置精準度維持，注意第二指拉回力度。</span>
            </div>
          </div>
        </div>

        {/* Section 3: Homework & Practice Guide */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            三、回家作業與練習指引 (Homework)
          </h2>
          <div className="space-y-2">
            {summary.homework.map((hw, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{hw}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">未完成</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Encouragement Quote */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 text-center space-y-2 shadow-inner">
          <Heart className="w-5 h-5 text-rose-400 mx-auto animate-pulse" />
          <p className="text-xs sm:text-sm text-purple-100 font-medium italic leading-relaxed">
            「{summary.encouragement}」
          </p>
          <span className="text-[10px] text-purple-300/70 block">— 張老師課後小結</span>
        </div>
      </div>
    </div>
  );
}
