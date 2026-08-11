'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { currentRole, addLessonRecord } = useDemoContext();

  useEffect(() => {
    if (currentRole === 'student') {
      router.replace('/student/schedule');
    }
  }, [currentRole, router]);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const [songTitle, setSongTitle] = useState('巴哈：E大調小提琴協奏曲 第一樂章');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cleanSummary, setCleanSummary] = useState<CleanSummaryJSON | null>(null);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);

  if (currentRole === 'student') {
    return null;
  }

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
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm bg-gradient-to-r from-white to-[#FAF2EC]">
        <div className="flex items-center gap-2 text-[#8C6D53] text-xs font-bold uppercase tracking-wider mb-1">
          <Mic className="w-4 h-4" />
          Teacher Portal (P2)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">課堂錄音與 AI 淨化摘要生成</h1>
        <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
          即時錄製課堂對話或上傳音檔 ➔ Whisper STT 逐字稿 ➔ LLM 過濾雜談並提取精華
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Audio Recorder & Raw Transcript Input */}
        <div className="space-y-6">
          {/* Recorder Controls Box */}
          <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] shadow-warm space-y-4">
            <h2 className="font-bold text-[#332C27] flex items-center justify-between text-base">
              <span>課堂現場錄音 (Recorder Interface)</span>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-xs text-[#B85536] font-bold animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E88D67]" />
                  錄音中 00:04:12
                </span>
              )}
            </h2>

            {/* Audio Wave Visualizer Simulation */}
            <div className="h-20 bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] flex items-center justify-center gap-1.5 px-4 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isRecording
                      ? 'bg-[#8C6D53] animate-wave'
                      : 'bg-[#D5C8BA] h-3'
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
              <label className="block text-xs font-bold text-[#332C27] mb-1">當前指導曲目</label>
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="px-5 py-2.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#8C6D53]/20 transition-all"
                >
                  <Mic className="w-4 h-4" />
                  開始課堂錄音 (Start Record)
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="px-5 py-2.5 rounded-full bg-[#B85536] hover:bg-[#A3472A] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#B85536]/20 transition-all"
                >
                  <Square className="w-4 h-4 fill-current" />
                  停止錄音 (Stop)
                </button>
              )}

              <label className="cursor-pointer px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFECE6] text-[#332C27] text-xs font-bold flex items-center gap-2 border border-[#EFECE6]">
                <Upload className="w-4 h-4 text-[#8C6D53]" />
                上傳語音檔
                <input type="file" accept="audio/*" className="hidden" />
              </label>
            </div>
          </div>

          {/* Raw Transcript Area */}
          <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] shadow-warm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#332C27] text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8C6D53]" />
                Whisper STT 原始逐字稿 (`raw_transcript`)
              </h2>
              <span className="text-[10px] text-[#B85536] bg-[#FCEADE] px-2.5 py-0.5 rounded-full font-bold border border-[#F6D0B8]">
                包含私生活雜談與情緒對話
              </span>
            </div>

            <textarea
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl p-4 text-xs text-[#332C27] font-sans leading-relaxed focus:outline-none focus:border-[#8C6D53]"
              placeholder="錄音結束後將在此處產生 Whisper 語音轉譯逐字稿..."
            />

            <button
              onClick={handleAnalyzeSTT}
              disabled={isAnalyzing || !transcript}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#8C6D53] to-[#E88D67] hover:from-[#765942] hover:to-[#D67A53] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#8C6D53]/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? 'LLM 正在過濾情緒與生成淨化摘要中...' : '執行 AI 情緒過濾與摘要淨化 (Generate Clean Card)'}
            </button>
          </div>
        </div>

        {/* Right Panel: AI Cleaned Summary Card Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#332C27] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E88D67]" />
              AI 淨化課後筆記預覽 (`clean_summary_json`)
            </h2>
            {savedRecordId && (
              <Link
                href={`/student/summary/${savedRecordId}`}
                className="text-xs text-[#8C6D53] hover:text-[#765942] font-bold flex items-center gap-1"
              >
                前往學生視角卡片 (P5) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {!cleanSummary ? (
            <div className="warm-card p-12 rounded-3xl border border-[#EFECE6] text-center space-y-3 shadow-warm">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] text-[#8C6D53] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#332C27] text-sm">尚未產生淨化摘要</h3>
              <p className="text-xs text-[#7A736E] max-w-xs mx-auto font-medium">
                請在左側輸入或錄製對話後，點擊「執行 AI 情緒過濾與摘要淨化」按鈕。
              </p>
            </div>
          ) : (
            <div className="paper-card p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] space-y-5 shadow-warm">
              <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
                <div className="flex items-center gap-2.5">
                  <Music className="w-5 h-5 text-[#8C6D53]" />
                  <span className="font-bold text-sm text-[#332C27]">{songTitle}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2] text-[10px] font-bold">
                  BPM 建議：{cleanSummary.bpm_recommendation || 72}
                </span>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#3D5240] uppercase tracking-wider">
                  本週優點亮點 (Highlights)
                </h4>
                <div className="space-y-1.5">
                  {cleanSummary.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-[#332C27] flex items-start gap-2 bg-[#E3E8E1]/40 p-2.5 rounded-xl border border-[#C5D2C2]/40 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#3D5240] shrink-0 mt-0.5" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Tips */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#8C6D53] uppercase tracking-wider">
                  技術與手型修正 (Technical Tips)
                </h4>
                <div className="space-y-1.5">
                  {cleanSummary.technical_tips.map((t, i) => (
                    <div key={i} className="text-xs text-[#332C27] flex items-start gap-2 bg-[#FAF2EC] p-2.5 rounded-xl border border-[#E8D4C5] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#8C6D53] shrink-0 mt-1.5" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#B85536] uppercase tracking-wider">
                  回家作業與練習計劃 (Homework)
                </h4>
                <div className="space-y-1.5">
                  {cleanSummary.homework.map((hw, i) => (
                    <div key={i} className="text-xs text-[#332C27] flex items-start gap-2 bg-[#FCEADE]/50 p-2.5 rounded-xl border border-[#F6D0B8] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#E88D67] shrink-0 mt-1.5" />
                      {hw}
                    </div>
                  ))}
                </div>
              </div>

              {/* Encouragement */}
              <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] text-xs text-[#8C6D53] font-bold italic leading-relaxed">
                💬 「{cleanSummary.encouragement}」
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
