'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Music,
  Zap,
  Gauge,
  Sliders,
  Volume2,
} from 'lucide-react';
import { TimelineMarker } from '@/types';

export default function StudentCompareDetailPage() {
  const params = useParams();
  const { practiceVideos, demoVideos } = useDemoContext();

  const practiceId = params.id as string;
  const practice = practiceVideos.find((p) => p.id === practiceId) || practiceVideos[0];
  const demo = demoVideos.find((d) => d.id === practice.demo_video_id) || demoVideos[0];

  const studentVideoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<TimelineMarker | null>(
    practice.ai_feedback_json.timeline_markers[1] || null
  );

  const handleTogglePlay = () => {
    if (!studentVideoRef.current || !teacherVideoRef.current) return;
    if (isPlaying) {
      studentVideoRef.current.pause();
      teacherVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      studentVideoRef.current.play();
      teacherVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    if (studentVideoRef.current && teacherVideoRef.current) {
      studentVideoRef.current.currentTime = seconds;
      teacherVideoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const handleMarkerClick = (marker: TimelineMarker) => {
    setSelectedMarker(marker);
    handleSeek(marker.time);
  };

  const feedback = practice.ai_feedback_json;

  return (
    <div className="space-y-8 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/student/practice"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回作業學習中心 (P4)
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>學生 vs 老師 AI 雙影片比對分析</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              P6 AI Dual Player
            </span>
          </h1>
        </div>

        {/* Global Play / Sync Controls */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={handleTogglePlay}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? '暫停雙同步播放' : '一鍵同步播放 (Sync Play)'}
          </button>
          <button
            onClick={() => handleSeek(0)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            title="重頭播放"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dual Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Player: Student Practice */}
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Video className="w-4 h-4" /> 學生練習影片 (小明)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">BPM 偵測：{feedback.bpm_detected}</span>
          </div>

          <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-800">
            <video
              ref={studentVideoRef}
              src={practice.video_url}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              className="w-full h-full object-cover"
              controls
            />
            {selectedMarker && (
              <div className="absolute top-3 left-3 bg-rose-950/90 border border-rose-500/60 px-3 py-1.5 rounded-lg text-[11px] text-rose-200 font-semibold backdrop-blur-md">
                🎯 當前診斷點: {selectedMarker.title} ({selectedMarker.time}s)
              </div>
            )}
          </div>
        </div>

        {/* Right Player: Teacher Demo */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 老師標準 Demo 影片 (張老師)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">標準 BPM：{demo.midi_data?.bpm || 96}</span>
          </div>

          <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-800">
            <video
              ref={teacherVideoRef}
              src={demo.video_url}
              className="w-full h-full object-cover"
              controls
            />
          </div>
        </div>
      </div>

      {/* AI Score Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">AI 綜合評估分</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{feedback.overall_score} / 100</span>
          </div>
          <Zap className="w-8 h-8 text-emerald-400/40" />
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">音高對比精準度</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">{feedback.pitch_accuracy}%</span>
          </div>
          <Music className="w-8 h-8 text-cyan-400/40" />
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">節奏踏拍穩定度</span>
            <span className="text-2xl font-black text-purple-400 font-mono">{feedback.rhythm_accuracy}%</span>
          </div>
          <Gauge className="w-8 h-8 text-purple-400/40" />
        </div>
      </div>

      {/* Interactive Timeline Markers Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            AI 時間軸標記 (Timeline Markers)
          </h2>
          <span className="text-xs text-slate-400">點擊標記即可同步跳轉雙影片至該播放時間點</span>
        </div>

        {/* Horizontal Visual Timeline Bar */}
        <div className="relative h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center px-4">
          <div className="w-full h-1.5 bg-slate-800 rounded-full relative">
            {feedback.timeline_markers.map((marker) => {
              const leftPercent = Math.min((marker.time / 60) * 100, 95);
              const isSelected = selectedMarker?.time === marker.time;
              return (
                <button
                  key={marker.time}
                  onClick={() => handleMarkerClick(marker)}
                  className={`absolute -top-3 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    marker.severity === 'error'
                      ? 'bg-rose-500 text-white'
                      : marker.severity === 'warning'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  } ${isSelected ? 'ring-4 ring-cyan-400 scale-125 z-20' : 'hover:scale-110'}`}
                  style={{ left: `${leftPercent}%` }}
                  title={`${marker.title} (${marker.time}s)`}
                >
                  <span className="text-[10px] font-black">{marker.time}s</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Marker Detail Box */}
        {selectedMarker && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedMarker.severity === 'error'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : selectedMarker.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {selectedMarker.type === 'pitch' ? '音高誤差' : selectedMarker.type === 'rhythm' ? '節奏搶拍' : '姿態建議'}
                </span>
                <h3 className="font-bold text-sm text-white">
                  {selectedMarker.title} (時間點: {selectedMarker.time} 秒)
                </h3>
              </div>

              <button
                onClick={() => handleSeek(selectedMarker.time)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                重播此 5 秒片段
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedMarker.description}</p>

            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-200">
              💡 <span className="font-bold">AI 改善建議：</span> {selectedMarker.recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
