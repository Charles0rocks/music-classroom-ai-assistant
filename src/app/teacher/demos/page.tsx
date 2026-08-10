'use client';

import React, { useState } from 'react';
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
  const { demoVideos, updateDemoVideo } = useDemoContext();

  const [selectedVideoId, setSelectedVideoId] = useState<string>(demoVideos[0]?.id || '');

  const activeVideo = demoVideos.find((v) => v.id === selectedVideoId) || demoVideos[0];

  const [pitchTol, setPitchTol] = useState(activeVideo?.pitch_tolerance || 5);
  const [tempoTol, setTempoTol] = useState(activeVideo?.tempo_tolerance || 8);
  const [tagInput, setTagInput] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

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
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Video className="w-4 h-4" />
          Teacher Portal (P7)
        </div>
        <h1 className="text-2xl font-extrabold text-white">範例影片庫與 AI 標籤微調</h1>
        <p className="text-slate-400 text-xs mt-1">
          上傳教學示範影片 · 自訂 AI 音高/節奏容錯率門檻 · 設定演練標籤
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Video List (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>示範影片庫 (`teacher_demo_videos`)</span>
            </h2>
            <span className="text-xs text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900">
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
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  activeVideo?.id === video.id
                    ? 'glass-panel border-purple-500/80 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="font-bold text-xs text-slate-100 truncate">{video.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {video.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded">
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
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between">
                <span>影片預覽與 AI 診斷參數設定</span>
                <span className="text-xs text-slate-400 font-mono">BPM: {activeVideo.midi_data?.bpm || 96}</span>
              </h3>

              <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-slate-800">
                <video
                  src={activeVideo.video_url}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-sm font-bold text-purple-300">{activeVideo.title}</div>
            </div>

            {/* AI Tolerances Settings Form */}
            <form onSubmit={handleSaveSettings} className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  AI 音聲比對門檻微調 (Pitch & Tempo Tolerance)
                </h3>
                {savedMessage && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 已更新 AI 設定
                  </span>
                )}
              </div>

              {/* Pitch Tolerance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-200">
                    音高容錯率 (Pitch Tolerance): <span className="text-purple-400 font-bold">{pitchTol} cents</span>
                  </label>
                  <span className="text-[11px] text-slate-400">（數值越低越嚴格）</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={pitchTol}
                  onChange={(e) => setPitchTol(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 bg-slate-900"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 cent (專業金獎標準)</span>
                  <span>5 cents (建議標準)</span>
                  <span>15 cents (寬鬆入門)</span>
                </div>
              </div>

              {/* Tempo Tolerance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-200">
                    節奏/搶拍容錯率 (Tempo Tolerance): <span className="text-cyan-400 font-bold">{tempoTol}%</span>
                  </label>
                  <span className="text-[11px] text-slate-400">（超過此比例判定為搶拍/拖拍）</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={tempoTol}
                  onChange={(e) => setTempoTol(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500 bg-slate-900"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2% (強烈推薦嚴格對拍)</span>
                  <span>8% (建議標準)</span>
                  <span>20% (寬鬆樂感優先)</span>
                </div>
              </div>

              {/* Tag Management */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-200">訓練標籤 (Tags)</label>
                <div className="flex flex-wrap gap-2">
                  {activeVideo.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 text-xs bg-purple-950/80 border border-purple-500/40 text-purple-200 px-3 py-1 rounded-lg"
                    >
                      <Tag className="w-3 h-3 text-purple-400" />
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-purple-400 hover:text-rose-400 ml-1"
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
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
                  >
                    新增標籤
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all"
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
