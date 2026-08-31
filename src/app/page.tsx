'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import {
  Calendar,
  Mic,
  Video,
  UserCheck,
  CheckCircle2,
  Mail,
  Key,
  AlertCircle,
  Sparkles,
  Smartphone,
  QrCode,
  UserPlus,
  ArrowRight,
  LogOut,
  Clock,
  Globe,
  MessageCircle,
} from 'lucide-react';
import { TeacherRegisterModal } from '@/components/TeacherRegisterModal';
import { getAvatarByGender } from '@/lib/avatarHelper';
import { supabase } from '@/lib/supabaseClient';
import { handleLogout } from '@/lib/authHelper';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, login, logout, currentUser, teacherProfile } = useDemoContext();

  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await handleLogout();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // 動態時間：2026/08/30 (UTC+8)
  const [todayStr, setTodayStr] = useState('2026/08/30 (UTC+8)');

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    setTodayStr(`${year}/${month}/${date} (UTC+8)`);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = login(email, password, 'teacher');
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickFillAndLogin = (teacherEmail?: string) => {
    const targetEmail = teacherEmail || 'chl@gmail.com';
    const targetPass = '12345678';
    setEmail(targetEmail);
    setPassword(targetPass);
    const res = login(targetEmail, targetPass, 'teacher');
    if (res.success) {
      setSuccessMsg(res.message);
    }
  };

  const handleSocialLogin = (provider: 'LINE' | 'Google') => {
    setErrorMsg('');
    setSuccessMsg(`已透過 ${provider} 快速驗證身份！`);
    login('chang.teacher@harmony.edu', 'Teacher#2026', 'teacher');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-800 space-y-8 py-4 sm:py-6 px-3 sm:px-6 max-w-7xl mx-auto">
      

      {/* 2. 重構首頁結構（雙欄卡片佈局） */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 左側：【老師專區】 */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-[#D97736] border border-amber-200 text-xs font-black flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  【老師專用通道】
                </span>
                <span className="text-xs text-stone-400 font-medium">Teacher Portal</span>
              </div>
              
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="text-xs font-black text-[#D97736] hover:text-[#b85a1e] underline flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                申請老師帳號 ➔
              </button>
            </div>

            <h2 className="text-xl font-black text-stone-900">
              老師登入 (Teacher Portal)
            </h2>

            {/* 已登入狀態提示：歡迎儀表板 (Welcome Dashboard) */}
            {isAuthenticated ? (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF2EC] border border-[#EFECE6] text-stone-800 space-y-5 shadow-sm animate-in fade-in">
                {/* 1. 歡迎狀態標題區 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFECE6]">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={getAvatarByGender(currentUser?.gender || teacherProfile?.gender || 'male', currentUser?.id)}
                      alt={currentUser?.name || '認證老師'}
                      className="w-12 h-12 rounded-full border-2 border-[#D97736] object-cover shadow-md shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-1.5">
                        歡迎回來，{currentUser?.name || '認證老師'} 老師！🎵
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF2EC] text-[#8C6D53] font-bold border border-[#E8D4C5] text-[11px]">
                          {teacherProfile?.instrument || (currentUser as any)?.instrument || '音樂'} 指導
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          已連線至 Supabase 資料庫
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>登出系統</span>
                  </button>
                </div>

                {/* 2. 三大核心功能直達入口 */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-stone-400 uppercase tracking-wider px-1">
                    核心功能工作台入口
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 卡片 1: 課表安排工作台 */}
                    <Link
                      href="/teacher/schedule"
                      className="group p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#D97736] hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">📅</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FAF2EC] text-[#D97736]">
                            工作台
                          </span>
                        </div>
                        <div className="font-black text-sm text-stone-800 group-hover:text-[#D97736] transition-colors">
                          課表安排工作台
                        </div>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">
                          每週常態排課、開放時段預約與學生課程異動管理
                        </p>
                      </div>
                      <div className="text-xs font-bold text-[#D97736] flex items-center gap-1 pt-2 border-t border-stone-100 group-hover:translate-x-1 transition-transform">
                        <span>進入排課系統</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>

                    {/* 卡片 2: 課堂紀錄頁面 */}
                    <Link
                      href="/teacher/recorder"
                      className="group p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🎙️</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            AI 錄音
                          </span>
                        </div>
                        <div className="font-black text-sm text-stone-800 group-hover:text-emerald-700 transition-colors">
                          課堂紀錄頁面
                        </div>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">
                          AI 課堂錄音重點整理、教學進度與學生課堂表現紀錄
                        </p>
                      </div>
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-2 border-t border-stone-100 group-hover:translate-x-1 transition-transform">
                        <span>查看課堂紀錄</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>

                    {/* 卡片 3: 作業檢視頁面 */}
                    <Link
                      href="/teacher/demos"
                      className="group p-4 rounded-2xl bg-white border border-stone-200 hover:border-purple-500 hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">📹</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                            作業批改
                          </span>
                        </div>
                        <div className="font-black text-sm text-stone-800 group-hover:text-purple-700 transition-colors">
                          作業檢視頁面
                        </div>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">
                          學生錄影作業批改、AI 練習評語與每週聯絡簿生成
                        </p>
                      </div>
                      <div className="text-xs font-bold text-purple-700 flex items-center gap-1 pt-2 border-t border-stone-100 group-hover:translate-x-1 transition-transform">
                        <span>進入作業檢視</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* 未登入表單與多元登入 */
              <div className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {successMsg}
                  </div>
                )}

                {/* Email + 密碼 */}
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1">
                      Email 帳號：
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="請輸入老師 Email"
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-2xl pl-10 pr-3 py-2.5 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1">
                      密碼：
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="請輸入密碼"
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-2xl pl-10 pr-3 py-2.5 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#D97736] hover:bg-[#c4682a] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    🔑 帳密登入系統 (Log In)
                  </button>
                </form>

                {/* 一鍵帶入張老師 Demo 帳密 */}
                <button
                  type="button"
                  onClick={() => handleQuickFillAndLogin()}
                  className="w-full py-2.5 rounded-2xl bg-[#FAF2EC] hover:bg-[#F6E6DA] text-[#D97736] border border-[#F6D0B8] font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  ✨ 一鍵帶入張老師 Demo 帳密 (chang.teacher@harmony.edu)
                </button>

                {/* 分隔線 */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-bold text-stone-400">快速登入</span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                {/* LINE 登入 / Google 登入 */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('LINE')}
                    className="py-2.5 px-3 rounded-2xl bg-[#00B900] hover:bg-[#009900] text-white font-black text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    LINE 登入
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="py-2.5 px-3 rounded-2xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-rose-500" />
                    Google 登入
                  </button>
                </div>

                {/* 申請老師帳號入口 */}
                <div className="pt-2 text-center border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="text-xs font-black text-[#D97736] hover:underline inline-flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    尚未擁有老師帳號？點此提交「申請老師帳號」➔
                  </button>
                </div>

              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-stone-400 font-bold border-t border-stone-100 flex items-center justify-between">
            <span>支援 iOS / Android / Web 響應式工作台</span>
            <span>Studio OS Engine</span>
          </div>
        </div>

        {/* 右側：【學生與家長專區】 */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-black flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                【學生與家長專區】
              </span>
              <span className="text-xs text-stone-400 font-medium">LINE Portal</span>
            </div>

            <h2 className="text-xl font-black text-stone-900">
              學生與家長加入（免註冊登入）
            </h2>

            {/* 說明文字 */}
            <p className="text-xs text-stone-600 font-medium leading-relaxed bg-[#FAF7F2] p-3.5 rounded-2xl border border-stone-200">
              掃描下方 QR Code 加入 LINE 官方帳號，即可接收每週 AI 聯絡簿與進度通知。
            </p>

            {/* 清晰的 LINE 官方帳號 QR Code 圖示區塊 */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200 text-center space-y-3">
              <a
                href="https://line.me/R/ti/p/%40536tuoaq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-48 h-48 mx-auto bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center relative hover:scale-105 transition-transform block"
                title="點擊加入 LINE 官方帳號好友"
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQMAAABDsxw2AAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB40lEQVRoge2aO5LCQAxE5SIg5Ag+io9mjsZRfASHBBTaUUsam12CDVasg1ZADTPPUZc+PbbI72LWiLYe9Hax5X1oPw+RMc8WYsXYAjFOKmM7vbUF4mqb492VIlaPndvuelLfaWL1UzxoqhH7HGYJcru0TaTMGvIROyQm52dIqU+UPWIfxHAEsZ4yWXORvvO2DBIrwDTCu4ylzNJUmzOJEMSKsV0gd8QxtJv3QezfMNd0xTzWMmvFZpa1FJdYMYayZoEWHyal/c2mfxXUN2LV2L6+SagWfSfcihA7BmbzmCVUSBleZsaORdocYoXYbKfTq0lBxIQ2+4JYKeYpY82l23mJXo+wlOn1jVgR5lZRd8bQrWI+mJoSOwKm3TbmeKyob93pb/WNWBmWYsE2Tq7RsPWg75oSq8HsVB9br+9W0evbZbvjIlaIDVm4BAmife41C2+Yi0XsANh2qaJwlH0kEI9dfSNWh/VWkheSIV9klqoPZsTqsC1ex+N8EEHsGNic4gGb9l9BbAOzECvGXK+Uxi9VdmJdre8sxKoxdJlTvFXEeKya1/Ve30SIfQzLy/nsOyhrSKmF2BExjMf5AiXjp6bE/hrL+jZqjMf+UcrjxeATq8W6Ini9mJfzcIi5Q+wg2O/iC92mKiYC3BU5AAAAAElFTkSuQmCC"
                  alt="LINE 官方帳號 @536tuoaq"
                  className="w-full h-full object-cover rounded-xl"
                />
              </a>

              <div className="text-xs font-bold text-stone-700">
                LINE 官方帳號：<span className="font-mono text-[#00B900] font-black">@536tuoaq</span>
              </div>
            </div>

            {/* 「📱 體驗學生手機聯絡簿 (Magic Link)」按鈕 */}
            <div className="space-y-2 pt-1">
              <a
                href="/student-view.html?token=tok-ming-888"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group text-center block"
              >
                <Smartphone className="w-4 h-4 inline group-hover:scale-110 transition-transform" />
                📱 體驗學生手機聯絡簿 (Magic Link)
              </a>

              <p className="text-[11px] text-stone-400 text-center font-bold">
                點擊在新分頁開啟 /student-view.html?token=tok-ming-888
              </p>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-stone-400 font-bold border-t border-stone-100 text-center">
            無需帳密登入 · LINE Magic Link 專屬連線
          </div>
        </div>

      </section>

      {/* 3. 【底部】：展示 3 項核心功能介紹 */}
      <section className="space-y-4 pt-2">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-black text-stone-900">
            三大核心 AI 營運功能
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            專為音樂教室量身打造的全方位智慧助手
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 功能 1: 師生排課工作台 */}
          <Link
            href="/teacher/schedule"
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group space-y-3 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97736] border border-amber-200 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-stone-900 group-hover:text-[#D97736] transition-colors">
                1. 師生排課工作台
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                2D 週課表矩陣、開放空檔設定與 24h 防放鳥智慧調課審核機制。
              </p>
            </div>
            <div className="text-xs font-black text-[#D97736] flex items-center gap-1 pt-2 border-t border-stone-100">
              <span>體驗課表安排</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 功能 2: 30秒 AI 錄音聯絡簿 */}
          <Link
            href="/teacher/recorder"
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group space-y-3 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-stone-900 group-hover:text-pink-600 transition-colors">
                2. 30秒 AI 錄音聯絡簿
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                下課口述 30 秒，Google Gemini 1.5 Flash 自動結構化解析為聯絡簿並推播至 LINE。
              </p>
            </div>
            <div className="text-xs font-black text-pink-600 flex items-center gap-1 pt-2 border-t border-stone-100">
              <span>體驗課堂紀錄</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 功能 3: 課後作業雙影片比對 */}
          <Link
            href="/teacher/demos"
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group space-y-3 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-stone-900 group-hover:text-sky-600 transition-colors">
                3. 課後作業雙影片比對
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                學員 15 秒打卡音檔與 AI 音高/節奏評測、師生雙影片姿態影格比對。
              </p>
            </div>
            <div className="text-xs font-black text-sky-600 flex items-center gap-1 pt-2 border-t border-stone-100">
              <span>體驗作業檢視</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Modal: 申請老師帳號 Modal */}
      <TeacherRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />

      {/* 5. 頁尾 */}
      <footer className="text-center text-xs font-bold text-stone-400 py-4 border-t border-stone-200/60">
        MusiMate Music Studio OS v3.2 · Gemini 1.5 Flash Connected
      </footer>

    </div>
  );
}
