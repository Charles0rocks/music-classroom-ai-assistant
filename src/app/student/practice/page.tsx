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
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm bg-gradient-to-r from-white to-[#FCEADE]">
        <div className="flex items-center gap-2 text-[#E88D67] text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          Student Portal (P4)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">課後學習與作業中心</h1>
        <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
          歷次 AI 淨化課堂筆記 · 回家作業與 BPM 練習進度 · 上傳練習影片 AI 診斷
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lesson Records & Homework Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
              <span>歷次 AI 淨化筆記 (`lesson_records`)</span>
            </h2>
          </div>

          <div className="space-y-4">
            {lessonRecords.map((record) => (
              <div
                key={record.id}
                className="warm-card p-6 rounded-3xl border border-[#EFECE6] shadow-warm hover:border-[#8C6D53]/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFECE6] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] text-[#8C6D53] flex items-center justify-center font-bold">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#332C27]">
                        {record.song_title || '巴哈E大調小提琴協奏曲'}
                      </h3>
                      <span className="text-[11px] text-[#7A736E] font-medium">
                        {new Date(record.created_at).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/student/summary/${record.id}`}
                    className="px-4 py-2 rounded-full bg-[#FAF2EC] hover:bg-[#8C6D53] text-[#8C6D53] hover:text-white font-bold text-xs border border-[#E8D4C5] flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    查看全尺寸 AI 筆記卡片 (P5)
                  </Link>
                </div>

                {/* Card Brief Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFECE6] space-y-1">
                    <span className="text-[#8C6D53] font-bold text-[11px] block">技術修正關鍵</span>
                    <p className="text-[#332C27] font-medium">
                      {record.clean_summary_json.technical_tips[0] || '右手持弓姿勢注意放鬆'}
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFECE6] space-y-1">
                    <span className="text-[#E88D67] font-bold text-[11px] block">回家作業與目標 BPM</span>
                    <p className="text-[#332C27] font-medium">
                      {record.clean_summary_json.homework[0] || '分段練習 10 次'} (目標 BPM: {record.clean_summary_json.bpm_recommendation || 72})
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[#8C6D53] font-bold italic bg-[#FAF2EC] p-3.5 rounded-2xl border border-[#E8D4C5]">
                  💬 「{record.clean_summary_json.encouragement}」
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upload Practice & AI Video Analysis (1 col) */}
        <div className="space-y-6">
          <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] shadow-warm space-y-4">
            <h2 className="font-bold text-base text-[#332C27] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#E88D67]" />
              上傳練習影片 (Upload Practice)
            </h2>
            <p className="text-xs text-[#7A736E] font-medium leading-relaxed">
              選擇老師範例影片作為基準，上傳您的練習影片即可生成 AI 比對分與時間軸標記。
            </p>

            <form onSubmit={handleUploadPractice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#332C27] mb-1">對照老師 Demo 影片</label>
                <select
                  value={selectedDemoId}
                  onChange={(e) => setSelectedDemoId(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#E88D67]"
                >
                  {demoVideos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#332C27] mb-1">練習影片 URL</label>
                <input
                  type="url"
                  required
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#E88D67]"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-full bg-[#E88D67] hover:bg-[#D67A53] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#E88D67]/20 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                {isUploading ? 'AI 分析中...' : '提交並進行 AI 比對診斷'}
              </button>
            </form>
          </div>

          {/* AI Practice Analysis History */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#332C27] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#8C6D53]" />
              已分析練習紀錄 (`student_practice_videos`)
            </h3>

            {practiceVideos.map((pv) => (
              <div
                key={pv.id}
                className="warm-card p-4.5 rounded-2xl border border-[#EFECE6] hover:border-[#8C6D53]/40 transition-all space-y-3 shadow-warm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#332C27]">
                    綜合評分：<span className="text-[#3D5240] font-black text-sm">{pv.ai_feedback_json.overall_score} 分</span>
                  </span>
                  <span className="text-[10px] text-[#7A736E] font-medium">
                    {new Date(pv.created_at).toLocaleDateString('zh-TW')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#E3E8E1]/60 p-2 rounded-xl text-center font-bold text-[#3D5240]">
                    音高準確率：<span className="font-extrabold">{pv.ai_feedback_json.pitch_accuracy}%</span>
                  </div>
                  <div className="bg-[#FAF2EC] p-2 rounded-xl text-center font-bold text-[#8C6D53]">
                    節奏穩定度：<span className="font-extrabold">{pv.ai_feedback_json.rhythm_accuracy}%</span>
                  </div>
                </div>

                <Link
                  href={`/student/compare/${pv.id}`}
                  className="w-full py-2.5 rounded-full bg-[#E88D67] hover:bg-[#D67A53] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
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
