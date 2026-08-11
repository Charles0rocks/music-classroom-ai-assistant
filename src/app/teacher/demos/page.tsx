'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import {
  Video,
  Plus,
  Sliders,
  Tag,
  Check,
  Music,
  Trash2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export default function TeacherDemosPage() {
  const router = useRouter();
  const { currentRole, demoVideos, updateDemoVideo } = useDemoContext();

  useEffect(() => {
    if (currentRole === 'student') {
      router.replace('/student/schedule');
    }
  }, [currentRole, router]);

  const [selectedVideoId, setSelectedVideoId] = useState<string>(demoVideos[0]?.id || '');

  const activeVideo = demoVideos.find((v) => v.id === selectedVideoId) || demoVideos[0];

  const [pitchTol, setPitchTol] = useState(activeVideo?.pitch_tolerance || 5);
  const [tempoTol, setTempoTol] = useState(activeVideo?.tempo_tolerance || 8);
  const [tagInput, setTagInput] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  if (currentRole === 'student') {
    return null;
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVideo) return;
    updateDemoVideo(activeVideo.id, {
      pitch_tolerance: pitchTol,
      tempo_tolerance: tempoTol,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleAddTag = () => {
    if (!tagInput || !activeVideo) return;
    if (!activeVideo.tags.includes(tagInput)) {
      updateDemoVideo(activeVideo.id, {
        tags: [...activeVideo.tags, tagInput],
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeVideo) return;
    updateDemoVideo(activeVideo.id, {
      tags: activeVideo.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm bg-gradient-to-r from-white to-[#FAF2EC]">
        <div className="flex items-center gap-2 text-[#8C6D53] text-xs font-bold uppercase tracking-wider mb-1">
          <Video className="w-4 h-4" />
          Teacher Portal (P7)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">範例影片庫與 AI 標籤微調</h1>
        <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
          上傳教學示範影片 · 自訂 AI 音高/節奏容錯率門檻 · 設定演練標籤
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Video List (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#332C27] flex items-center gap-2">
              <span>示範影片庫 (`teacher_demo_videos`)</span>
            </h2>
            <span className="text-xs text-[#8C6D53] bg-[#FAF2EC] px-3 py-1 rounded-full border border-[#E8D4C5] font-bold">
              {demoVideos.length} 部影片
            </span>
          </div>

          <div className="space-y-3">
            {demoVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideoId(video.id);
                  setPitchTol(video.pitch_tolerance);
                  setTempoTol(video.tempo_tolerance);
                }}
                className={`p-4.5 rounded-2xl cursor-pointer transition-all border ${
                  activeVideo?.id === video.id
                    ? 'bg-white border-[#8C6D53] shadow-warm-hover ring-2 ring-[#8C6D53]/20'
                    : 'warm-card-interactive border-[#EFECE6]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF2EC] border border-[#E8D4C5] flex items-center justify-center shrink-0 text-[#8C6D53]">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="font-bold text-xs text-[#332C27] truncate">{video.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {video.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-[#E3E8E1] text-[#3D5240] px-2 py-0.5 rounded-full font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Video AI Tolerance & Tag Configuration (2 cols) */}
        {activeVideo && (
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview Box */}
            <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] shadow-warm space-y-4">
              <h3 className="font-bold text-sm text-[#332C27] flex items-center justify-between">
                <span>影片預覽與 AI 診斷參數設定</span>
                <span className="text-xs text-[#8C6D53] font-bold bg-[#FAF2EC] px-3 py-1 rounded-full border border-[#E8D4C5]">
                  BPM: {activeVideo.midi_data?.bpm || 96}
                </span>
              </h3>

              <div className="aspect-video bg-[#332C27] rounded-2xl overflow-hidden relative border border-[#EFECE6] shadow-inner">
                <video
                  src={activeVideo.video_url}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm font-bold text-[#332C27]">{activeVideo.title}</div>
            </div>

            {/* AI Tolerances Settings Form */}
            <form onSubmit={handleSaveSettings} className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
                <h3 className="font-bold text-sm text-[#332C27] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#8C6D53]" />
                  AI 音聲比對門檻微調 (Pitch & Tempo Tolerance)
                </h3>
                {savedMessage && (
                  <span className="text-xs text-[#3D5240] bg-[#E3E8E1] px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-[#C5D2C2]">
                    <Check className="w-3.5 h-3.5" /> 已更新 AI 設定
                  </span>
                )}
              </div>

              {/* Pitch Tolerance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-[#332C27]">
                    音高容錯率 (Pitch Tolerance): <span className="text-[#8C6D53] font-extrabold">{pitchTol} cents</span>
                  </label>
                  <span className="text-[11px] text-[#7A736E]">（數值越低越嚴格）</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={pitchTol}
                  onChange={(e) => setPitchTol(parseInt(e.target.value, 10))}
                  className="w-full accent-[#8C6D53] bg-[#FAF7F2]"
                />
                <div className="flex justify-between text-[10px] text-[#7A736E] font-medium">
                  <span>1 cent (專業金獎標準)</span>
                  <span>5 cents (建議標準)</span>
                  <span>15 cents (寬鬆入門)</span>
                </div>
              </div>

              {/* Tempo Tolerance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-[#332C27]">
                    節奏/搶拍容錯率 (Tempo Tolerance): <span className="text-[#E88D67] font-extrabold">{tempoTol}%</span>
                  </label>
                  <span className="text-[11px] text-[#7A736E]">（超過此比例判定為搶拍/拖拍）</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={tempoTol}
                  onChange={(e) => setTempoTol(parseInt(e.target.value, 10))}
                  className="w-full accent-[#E88D67] bg-[#FAF7F2]"
                />
                <div className="flex justify-between text-[10px] text-[#7A736E] font-medium">
                  <span>2% (強烈推薦嚴格對拍)</span>
                  <span>8% (建議標準)</span>
                  <span>20% (寬鬆樂感優先)</span>
                </div>
              </div>

              {/* Tag Management */}
              <div className="space-y-3 pt-2 border-t border-[#EFECE6]">
                <label className="block text-xs font-bold text-[#332C27]">訓練標籤 (Tags)</label>
                <div className="flex flex-wrap gap-2">
                  {activeVideo.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 text-xs bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2] px-3.5 py-1 rounded-full font-bold"
                    >
                      <Tag className="w-3 h-3" />
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-[#3D5240] hover:text-[#B85536] ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="輸入新標籤 (例如：弓法練習)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#8C6D53] hover:bg-[#765942] text-white text-xs font-bold rounded-full shadow-sm"
                  >
                    新增標籤
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white font-bold text-xs shadow-md shadow-[#8C6D53]/20 transition-all"
                >
                  儲存微調設定 (Save Parameters)
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
