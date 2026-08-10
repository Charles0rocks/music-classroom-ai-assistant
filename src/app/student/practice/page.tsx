'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoContext } from '@/context/DemoContext';
import {
  BookOpen,
  Sparkles,
  Video,
  Upload,
  Music,
  CheckCircle2,
  ArrowRight,
  Clock,
  PlayCircle,
} from 'lucide-react';

export default function StudentPracticePage() {
  const { lessonRecords, practiceVideos, demoVideos, addPracticeVideo, studentProfile } = useDemoContext();

  const [selectedDemoId, setSelectedDemoId] = useState<string>(demoVideos[0]?.id || 'demo-1');
  const [videoUrlInput, setVideoUrlInput] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPractice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const res = await fetch('/api/ai/compare-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_video_url: videoUrlInput,
          demo_video_id: selectedDemoId,
        }),
      });

      const data = await res.json();
      if (data.ai_feedback_json) {
        addPracticeVideo({
          student_id: studentProfile.id,
          demo_video_id: selectedDemoId,
          video_url: videoUrlInput,
          ai_feedback_json: data.ai_feedback_json,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          Student Portal (P4)
        </div>
        <h1 className="text-2xl font-extrabold text-white">課後學習與作業中心</h1>
        <p className="text-slate-400 text-xs mt-1">
          歷次 AI 淨化課堂筆記 · 回家作業與 BPM 練習進度 · 上傳練習影片 AI 診斷
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lesson Records & Homework Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>歷次 AI 淨化筆記 (`lesson_records`)</span>
            </h2>
          </div>

          <div className="space-y-4">
            {lessonRecords.map((record) => (
              <div
                key={record.id}
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {record.song_title || '巴哈E大調小提琴協奏曲'}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(record.created_at).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/student/summary/${record.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-600 text-cyan-300 hover:text-white font-semibold text-xs border border-cyan-500/40 flex items-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    查看全尺寸 AI 筆記卡片 (P5)
                  </Link>
                </div>

                {/* Card Brief Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-purple-400 font-bold text-[11px] block">技術修正關鍵</span>
                    <p className="text-slate-300">
                      {record.clean_summary_json.technical_tips[0] || '右手持弓姿勢注意放鬆'}
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold text-[11px] block">回家作業與目標 BPM</span>
                    <p className="text-slate-300">
                      {record.clean_summary_json.homework[0] || '分段練習 10 次'} (目標 BPM: {record.clean_summary_json.bpm_recommendation || 72})
                    </p>
                  </div>
                </div>

                <div className="text-xs text-cyan-200/90 italic bg-purple-950/30 p-3 rounded-xl border border-purple-500/20">
                  💬 「{record.clean_summary_json.encouragement}」
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upload Practice & AI Video Analysis (1 col) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
            <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              上傳練習影片 (Upload Practice)
            </h2>
            <p className="text-xs text-slate-400">
              選擇老師範例影片作為基準，上傳您的練習影片即可生成 AI 比對分與時間軸標記。
            </p>

            <form onSubmit={handleUploadPractice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">對照老師 Demo 影片</label>
                <select
                  value={selectedDemoId}
                  onChange={(e) => setSelectedDemoId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {demoVideos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">練習影片 URL</label>
                <input
                  type="url"
                  required
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                {isUploading ? 'AI 分析中...' : '提交並進行 AI 比對診斷'}
              </button>
            </form>
          </div>

          {/* AI Practice Analysis History */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              已分析練習紀錄 (`student_practice_videos`)
            </h3>

            {practiceVideos.map((pv) => (
              <div
                key={pv.id}
                className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    綜合評分：<span className="text-emerald-400 font-extrabold text-sm">{pv.ai_feedback_json.overall_score} 分</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(pv.created_at).toLocaleDateString('zh-TW')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                    音高準確率：<span className="font-bold text-cyan-400">{pv.ai_feedback_json.pitch_accuracy}%</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                    節奏穩定度：<span className="font-bold text-purple-400">{pv.ai_feedback_json.rhythm_accuracy}%</span>
                  </div>
                </div>

                <Link
                  href={`/student/compare/${pv.id}`}
                  className="w-full py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-cyan-500/40 transition-all"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  開啟雙畫面 AI 影音比對頁 (P6)
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
