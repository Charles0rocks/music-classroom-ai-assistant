'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoContext } from '@/context/DemoContext';
import {
  Mic,
  Square,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Play,
  Volume2,
  ArrowRight,
  Music,
} from 'lucide-react';
import { CleanSummaryJSON } from '@/types';

const SAMPLE_TRANSCRIPT = `小明今天來練習巴哈 E 大調小提琴協奏曲。整體音高表現不錯，但是到了第 24 小節換弓的地方右手姿勢太緊繃了，導致聲音有點乾硬！昨天我養的貓生病帶去看獸醫搞到半夜超累的... 總之你按弦第一關節要站立起來，不要塌下去！還有樂理部分要特別注意十六分音符的拍子，不要搶拍！回家作業請把第 16 到 32 小節用 BPM 72 慢練 10 遍，把音準跟弓法拉平順。加油！你這周進步很多！`;

export default function TeacherRecorderPage() {
  const { addLessonRecord } = useDemoContext();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const [songTitle, setSongTitle] = useState('巴哈：E大調小提琴協奏曲 第一樂章');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cleanSummary, setCleanSummary] = useState<CleanSummaryJSON | null>(null);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setCleanSummary(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleAnalyzeSTT = async () => {
    if (!transcript) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/clean-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_transcript: transcript }),
      });

      const data = await res.json();
      if (data.clean_summary_json) {
        setCleanSummary(data.clean_summary_json);

        // Save to global demo context
        const saved = addLessonRecord({
          appointment_id: 'app-1',
          raw_transcript: transcript,
          clean_summary_json: data.clean_summary_json,
          song_title: songTitle,
        });
        setSavedRecordId(saved.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Mic className="w-4 h-4" />
          Teacher Portal (P2)
        </div>
        <h1 className="text-2xl font-extrabold text-white">課堂錄音與 AI 淨化摘要生成</h1>
        <p className="text-slate-400 text-xs mt-1">
          即時錄製課堂對話或上傳音檔 ➔ Whisper STT 逐字稿 ➔ LLM 過濾雜談並提取精華
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Audio Recorder & Raw Transcript Input */}
        <div className="space-y-6">
          {/* Recorder Controls Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-bold text-slate-100 flex items-center justify-between text-base">
              <span>課堂現場錄音 (Recorder Interface)</span>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  錄音中 00:04:12
                </span>
              )}
            </h2>

            {/* Audio Wave Visualizer Simulation */}
            <div className="h-20 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center gap-1 px-4 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isRecording
                      ? 'bg-purple-500 animate-wave'
                      : 'bg-slate-700 h-3'
                  }`}
                  style={{
                    animationDelay: `${(i % 5) * 0.15}s`,
                    height: isRecording ? `${Math.floor(Math.random() * 48) + 12}px` : '12px',
                  }}
                />
              ))}
            </div>

            {/* Song Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">當前指導曲目</label>
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                >
                  <Mic className="w-4 h-4" />
                  開始課堂錄音 (Start Record)
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Square className="w-4 h-4 fill-current" />
                  停止錄音 (Stop)
                </button>
              )}

              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700">
                <Upload className="w-4 h-4" />
                上傳語音檔
                <input type="file" accept="audio/*" className="hidden" />
              </label>
            </div>
          </div>

          {/* Raw Transcript Area */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Whisper STT 原始逐字稿 (`raw_transcript`)
              </h2>
              <span className="text-[10px] text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-900">
                包含私生活雜談與情緒對話
              </span>
            </div>

            <textarea
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 font-sans leading-relaxed focus:outline-none focus:border-purple-500/50"
              placeholder="錄音結束後將在此處產生 Whispers 語音轉譯逐字稿..."
            />

            <button
              onClick={handleAnalyzeSTT}
              disabled={isAnalyzing || !transcript}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/25 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? 'LLM 正在過濾情緒與生成淨化摘要中...' : '執行 AI 情緒過濾與摘要淨化 (Generate Clean Card)'}
            </button>
          </div>
        </div>

        {/* Right Panel: AI Cleaned Summary Card Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI 淨化課後筆記預覽 (`clean_summary_json`)
            </h2>
            {savedRecordId && (
              <Link
                href={`/student/summary/${savedRecordId}`}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                前往學生視角卡片 (P5) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {!cleanSummary ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">尚未產生淨化摘要</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                請在左側輸入或錄製對話後，點擊「執行 AI 情緒過濾與摘要淨化」按鈕。
              </p>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 space-y-5 bg-gradient-to-b from-cyan-950/20 to-slate-900/80 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-sm text-white">{songTitle}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  BPM 建議：{cleanSummary.bpm_recommendation || 72}
                </span>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  本週優點亮點 (Highlights)
                </h4>
                <div className="space-y-1">
                  {cleanSummary.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Tips */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  技術與手型修正 (Technical Tips)
                </h4>
                <div className="space-y-1">
                  {cleanSummary.technical_tips.map((t, i) => (
                    <div key={i} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  回家作業與練習計劃 (Homework)
                </h4>
                <div className="space-y-1">
                  {cleanSummary.homework.map((hw, i) => (
                    <div key={i} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                      {hw}
                    </div>
                  ))}
                </div>
              </div>

              {/* Encouragement */}
              <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-xs text-purple-200 italic leading-relaxed">
                💬 「{cleanSummary.encouragement}」
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
