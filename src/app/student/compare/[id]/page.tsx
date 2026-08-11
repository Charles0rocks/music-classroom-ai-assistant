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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A736E] hover:text-[#332C27] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回作業學習中心 (P4)
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27] flex items-center gap-2">
            <span>學生 vs 老師 AI 雙影片比對分析</span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8] font-bold">
              P6 AI Dual Player
            </span>
          </h1>
        </div>

        {/* Global Play / Sync Controls */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-[#EFECE6] shadow-sm self-start sm:self-auto">
          <button
            onClick={handleTogglePlay}
            className="px-5 py-2 rounded-full bg-[#E88D67] hover:bg-[#D67A53] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#E88D67]/20 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? '暫停雙同步播放' : '一鍵同步播放 (Sync Play)'}
          </button>
          <button
            onClick={() => handleSeek(0)}
            className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFECE6] text-[#332C27] text-xs font-bold"
            title="重頭播放"
          >
            <RotateCcw className="w-4 h-4 text-[#8C6D53]" />
          </button>
        </div>
      </div>

      {/* Dual Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Player: Student Practice */}
        <div className="warm-card p-5 rounded-3xl border border-[#EFECE6] space-y-3 shadow-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#E88D67] flex items-center gap-1.5">
              <Video className="w-4 h-4" /> 學生練習影片 (小明)
            </span>
            <span className="text-[11px] text-[#7A736E] font-mono">BPM 偵測：{feedback.bpm_detected}</span>
          </div>

          <div className="aspect-video bg-[#332C27] rounded-2xl overflow-hidden relative border border-[#EFECE6] shadow-inner">
            <video
              ref={studentVideoRef}
              src={practice.video_url}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              className="w-full h-full object-cover"
              controls
            />
            {selectedMarker && (
              <div className="absolute top-3 left-3 bg-white/95 border border-[#EFECE6] px-3.5 py-1.5 rounded-full text-[11px] text-[#332C27] font-bold shadow-md backdrop-blur-md">
                🎯 當前診斷點: {selectedMarker.title} ({selectedMarker.time}s)
              </div>
            )}
          </div>
        </div>

        {/* Right Player: Teacher Demo */}
        <div className="warm-card p-5 rounded-3xl border border-[#EFECE6] space-y-3 shadow-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C6D53] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 老師標準 Demo 影片 (張老師)
            </span>
            <span className="text-[11px] text-[#7A736E] font-mono">標準 BPM：{demo.midi_data?.bpm || 96}</span>
          </div>

          <div className="aspect-video bg-[#332C27] rounded-2xl overflow-hidden relative border border-[#EFECE6] shadow-inner">
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
        <div className="warm-card p-5 rounded-3xl border border-[#EFECE6] flex items-center justify-between shadow-warm">
          <div>
            <span className="text-[11px] text-[#7A736E] font-bold block">AI 綜合評估分</span>
            <span className="text-2xl font-black text-[#3D5240] font-mono">{feedback.overall_score} / 100</span>
          </div>
          <Zap className="w-8 h-8 text-[#3D5240]" />
        </div>

        <div className="warm-card p-5 rounded-3xl border border-[#EFECE6] flex items-center justify-between shadow-warm">
          <div>
            <span className="text-[11px] text-[#7A736E] font-bold block">音高對比精準度</span>
            <span className="text-2xl font-black text-[#8C6D53] font-mono">{feedback.pitch_accuracy}%</span>
          </div>
          <Music className="w-8 h-8 text-[#8C6D53]" />
        </div>

        <div className="warm-card p-5 rounded-3xl border border-[#EFECE6] flex items-center justify-between shadow-warm">
          <div>
            <span className="text-[11px] text-[#7A736E] font-bold block">節奏踏拍穩定度</span>
            <span className="text-2xl font-black text-[#E88D67] font-mono">{feedback.rhythm_accuracy}%</span>
          </div>
          <Gauge className="w-8 h-8 text-[#E88D67]" />
        </div>
      </div>

      {/* Interactive Timeline Markers Panel */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] space-y-6 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
          <h2 className="text-base font-bold text-[#332C27] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8C6D53]" />
            AI 時間軸標記 (Timeline Markers)
          </h2>
          <span className="text-xs text-[#7A736E] font-medium">點擊標記即可同步跳轉雙影片至該播放時間點</span>
        </div>

        {/* Horizontal Visual Timeline Bar */}
        <div className="relative h-14 bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] flex items-center px-4">
          <div className="w-full h-2 bg-[#EFECE6] rounded-full relative">
            {feedback.timeline_markers.map((marker) => {
              const leftPercent = Math.min((marker.time / 60) * 100, 95);
              const isSelected = selectedMarker?.time === marker.time;
              return (
                <button
                  key={marker.time}
                  onClick={() => handleMarkerClick(marker)}
                  className={`absolute -top-3.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                    marker.severity === 'error'
                      ? 'bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8]'
                      : marker.severity === 'warning'
                      ? 'bg-[#FAF2EC] text-[#8C6D53] border border-[#E8D4C5]'
                      : 'bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2]'
                  } ${isSelected ? 'ring-4 ring-[#8C6D53]/30 scale-125 z-20' : 'hover:scale-110'}`}
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
          <div className="p-6 rounded-3xl bg-[#FAF2EC] border border-[#E8D4C5] space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedMarker.severity === 'error'
                      ? 'bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8]'
                      : selectedMarker.severity === 'warning'
                      ? 'bg-white text-[#8C6D53] border border-[#E8D4C5]'
                      : 'bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2]'
                  }`}
                >
                  {selectedMarker.type === 'pitch' ? '音高誤差' : selectedMarker.type === 'rhythm' ? '節奏搶拍' : '姿態建議'}
                </span>
                <h3 className="font-bold text-sm text-[#332C27]">
                  {selectedMarker.title} (時間點: {selectedMarker.time} 秒)
                </h3>
              </div>

              <button
                onClick={() => handleSeek(selectedMarker.time)}
                className="text-xs text-[#8C6D53] hover:text-[#765942] font-bold"
              >
                重播此 5 秒片段
              </button>
            </div>

            <p className="text-xs text-[#7A736E] font-medium leading-relaxed">{selectedMarker.description}</p>

            <div className="p-3.5 rounded-2xl bg-white border border-[#EFECE6] text-xs text-[#332C27] font-medium">
              💡 <span className="font-bold text-[#8C6D53]">AI 改善建議：</span> {selectedMarker.recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
