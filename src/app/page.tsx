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

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, login, logout, currentUser } = useDemoContext();

  const [email, setEmail] = useState('chl@gmail.com');
  const [password, setPassword] = useState('12345678');
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
      setTimeout(() => {
        router.push('/teacher/schedule');
      }, 500);
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
      setTimeout(() => {
        router.push('/teacher/schedule');
      }, 500);
    }
  };

  const handleSocialLogin = (provider: 'LINE' | 'Google') => {
    setErrorMsg('');
    setSuccessMsg(`已透過 ${provider} 快速驗證身份！進入教師工作台...`);
    login('chang.teacher@harmony.edu', 'Teacher#2026', 'teacher');
    setTimeout(() => {
      router.push('/teacher/schedule');
    }, 600);
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

            {/* 已登入狀態提示 */}
            {isAuthenticated ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser?.avatar_url || getAvatarByGender(teacherProfile?.gender || 'female', currentUser?.id)}
                      alt={currentUser?.name || '認證老師'}
                      className="w-10 h-10 rounded-full border-2 border-emerald-300 object-cover"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-stone-900">{currentUser?.name || '認證老師'} (PRO)</div>
                      <div className="text-xs text-emerald-700 font-bold">已成功驗證登入中</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-stone-600 hover:bg-stone-50"
                  >
                    <LogOut className="w-3.5 h-3.5 inline mr-1" /> 登出
                  </button>
                </div>
                
                <Link
                  href="/teacher/schedule"
                  className="w-full py-3 rounded-2xl bg-[#D97736] hover:bg-[#c4682a] text-white font-black text-xs text-center block shadow-md transition-all"
                >
                  🚀 直達教師週課表與工作台 (/teacher/schedule)
                </Link>
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
            <span>Studio OS PRO Engine</span>
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
