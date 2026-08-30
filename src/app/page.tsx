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
  Lock,
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
  Music,
  Heart,
  Globe,
  MessageCircle,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, login, logout, currentUser } = useDemoContext();

  const [email, setEmail] = useState('chang.teacher@harmony.edu');
  const [password, setPassword] = useState('teacher123');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState('');

  // 申請老師帳號表單 State
  const [regForm, setRegForm] = useState({
    name: '',
    nickname: '',
    gender: 'female',
    phone: '',
    email: '',
    password: '',
    socialAccount: 'line',
    subjects: '古典鋼琴, 小提琴',
    bio: '',
  });

  // 動態當日時間：例如 2026/08/30 (UTC+8)
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
      setSuccessMsg('登入成功！即將前往教師歡迎頁面與工作台...');
      setTimeout(() => {
        router.push('/teacher/schedule');
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickFillAndLogin = () => {
    setEmail('chang.teacher@harmony.edu');
    setPassword('teacher123');
    const res = login('chang.teacher@harmony.edu', 'teacher123', 'teacher');
    if (res.success) {
      setSuccessMsg('Demo 帳密填入成功！進入教師工作台...');
      setTimeout(() => {
        router.push('/teacher/schedule');
      }, 500);
    }
  };

  const handleSocialLogin = (provider: 'LINE' | 'Google') => {
    setErrorMsg('');
    setSuccessMsg(`已透過 ${provider} 快速驗證身份！進入教師工作台...`);
    login('chang.teacher@harmony.edu', 'teacher123', 'teacher');
    setTimeout(() => {
      router.push('/teacher/schedule');
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccessMsg('🎉 申請資料已成功送出！系統將發送開通確認信至您的 Email。');
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegisterSuccessMsg('');
      login('chang.teacher@harmony.edu', 'teacher123', 'teacher');
      router.push('/teacher/schedule');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-800 space-y-8 py-4 sm:py-6 px-3 sm:px-6 max-w-7xl mx-auto">
      
      {/* 1. 頁首資訊 (Header) */}
      <header className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D97736]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 via-amber-500 to-[#D97736] flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
            🎵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Musi <span className="text-[#D97736]">Mate</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-[#D97736] border border-amber-200 text-xs font-black">
                v3.2 PRO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-bold mt-0.5">
              音樂教室AI 小幫手
            </p>
          </div>
        </div>

        {/* 動態當日時間 Badge */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] px-4 py-2 rounded-2xl border border-stone-200 text-xs font-mono font-bold text-stone-700 shadow-xs relative z-10">
          <Clock className="w-4 h-4 text-[#D97736]" />
          <span>今日時間：</span>
          <span className="text-[#D97736] font-black">{todayStr}</span>
        </div>
      </header>

      {/* 2. 核心互動區塊（左右雙欄） */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 左側：【老師專區（登入與申請）】 */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-[#D97736] border border-amber-200 text-xs font-black flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  【老師專區】
                </span>
                <span className="text-xs text-stone-400 font-medium">Teacher Portal</span>
              </div>
              
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="text-xs font-black text-[#D97736] hover:text-[#b85a1e] underline flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                老師帳號申請 ➔
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
                      src={currentUser?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt="林詠晴 老師"
                      className="w-10 h-10 rounded-full border-2 border-emerald-300 object-cover"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-stone-900">{currentUser?.name || '林詠晴 老師'} (PRO)</div>
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

                {/* 登入方式 1: Email + 密碼 */}
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

                {/* Demo 老師一鍵填入帳密 */}
                <button
                  type="button"
                  onClick={handleQuickFillAndLogin}
                  className="w-full py-2.5 rounded-2xl bg-[#FAF2EC] hover:bg-[#F6E6DA] text-[#D97736] border border-[#F6D0B8] font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Demo 老師一鍵填入帳密 (chang.teacher@harmony.edu)
                </button>

                {/* 第三方快速登入分隔線 */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-bold text-stone-400">快速登入</span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                {/* 登入方式 2 & 3: LINE 快速登入 / Google 快速登入 */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('LINE')}
                    className="py-2.5 px-3 rounded-2xl bg-[#00B900] hover:bg-[#009900] text-white font-black text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    LINE 快速登入
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="py-2.5 px-3 rounded-2xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-rose-500" />
                    Google 快速登入
                  </button>
                </div>

                {/* 登入框下方：老師帳號申請入口 */}
                <div className="pt-2 text-center border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="text-xs font-black text-[#D97736] hover:underline inline-flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    尚未擁有老師帳號？點此提交「老師帳號申請」➔
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

        {/* 右側：【學生 / 家長專區（免註冊登入，LINE 官方帳號互動）】 */}
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
              學生與家長專區
            </h2>

            {/* 免額外下載 App 或註冊帳號說明 */}
            <p className="text-xs text-stone-600 font-medium leading-relaxed bg-[#FAF7F2] p-3.5 rounded-2xl border border-stone-200">
              免額外下載 App 或註冊帳號！掃描下方 QR Code 加入 MusiMate LINE 官方帳號，即可隨時接收課堂 AI 聯絡簿、練習進度與示範影片。
            </p>

            {/* 清晰的 LINE 官方帳號 QR Code 區塊 */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200 text-center space-y-3">
              <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center relative">
                <div className="w-full h-full border-2 border-dashed border-[#00B900] rounded-xl flex flex-col items-center justify-center p-2 text-center bg-[#F0FDF4]">
                  <QrCode className="w-12 h-12 text-[#00B900]" />
                  <span className="text-[10px] font-black text-[#00B900] mt-1">@MusiMate_AI</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 font-bold">
                LINE 搜尋 ID: <span className="font-mono text-[#00B900]">@MusiMate_AI</span>
              </div>
            </div>

            {/* 體驗學生端手機畫面 (Magic Link) 快捷按鈕 */}
            <div className="space-y-2 pt-1">
              <a
                href="/student-view.html?token=tok-ming-888"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group text-center block"
              >
                <Smartphone className="w-4 h-4 inline group-hover:scale-110 transition-transform" />
                📱 體驗學生端手機畫面 (Magic Link)
              </a>

              <p className="text-[11px] text-stone-400 text-center font-bold">
                點擊直達 /student-view.html?token=tok-ming-888
              </p>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-stone-400 font-bold border-t border-stone-100 text-center">
            無需帳密登入 · LINE Magic Link 專屬連線
          </div>
        </div>

      </section>

      {/* 3. 底部推廣廣告區 (產品真實功能展示) */}
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
          
          {/* 功能 1: 師生排課與工作台 */}
          <Link
            href="/teacher/schedule"
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group space-y-3 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97736] border border-amber-200 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-stone-900 group-hover:text-[#D97736] transition-colors">
                1. 師生排課與工作台
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                2D 週課表矩陣、開放空檔設定與 24h 防放鳥智慧調課審核機制。
              </p>
            </div>
            <div className="text-xs font-black text-[#D97736] flex items-center gap-1 pt-2 border-t border-stone-100">
              <span>體驗週課表 (P1)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 功能 2: 30秒 AI 課堂錄音聯絡簿 */}
          <Link
            href="/teacher/recorder"
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group space-y-3 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-stone-900 group-hover:text-pink-600 transition-colors">
                2. 30秒 AI 課堂錄音聯絡簿
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                下課口述 30 秒，Google Gemini 1.5 Flash 自動結構化解析為聯絡簿並推播至 LINE。
              </p>
            </div>
            <div className="text-xs font-black text-pink-600 flex items-center gap-1 pt-2 border-t border-stone-100">
              <span>體驗 AI 錄音 (P2)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 功能 3: 課後作業雙影片比對與分析 */}
          <Link
            href="/teacher/demos"
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group space-y-3 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-stone-900 group-hover:text-sky-600 transition-colors">
                3. 課後作業雙影片比對與分析
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                學員 15 秒打卡音檔與 AI 音高/節奏評測、師生雙影片姿態影格比對。
              </p>
            </div>
            <div className="text-xs font-black text-sky-600 flex items-center gap-1 pt-2 border-t border-stone-100">
              <span>體驗雙圖比對 (P7)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Modal: 老師帳號申請 Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#D97736]" />
                老師帳號申請 (Teacher Registration)
              </h3>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {registerSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold text-center space-y-2">
                <div className="text-2xl">🎉</div>
                <div>{registerSuccessMsg}</div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs font-bold">
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">中文姓名 *</label>
                    <input
                      type="text"
                      required
                      placeholder="例：陳雅婷"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">稱呼 / 暱稱</label>
                    <input
                      type="text"
                      placeholder="例：雅晴 老師"
                      value={regForm.nickname}
                      onChange={(e) => setRegForm({ ...regForm, nickname: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">性別</label>
                    <select
                      value={regForm.gender}
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold"
                    >
                      <option value="female">女 (Female)</option>
                      <option value="male">男 (Male)</option>
                      <option value="other">其他 / 不透漏</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">聯絡電話 *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0912-345-678"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">Email 帳號 *</label>
                    <input
                      type="email"
                      required
                      placeholder="teacher@harmony.edu"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">密碼設定 *</label>
                    <input
                      type="password"
                      required
                      placeholder="6位數以上密碼"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">綁定帳號 (LINE / Google 二擇一) *</label>
                  <select
                    value={regForm.socialAccount}
                    onChange={(e) => setRegForm({ ...regForm, socialAccount: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold"
                  >
                    <option value="line">💬 優先使用 LINE 綁定驗證</option>
                    <option value="google">🌐 優先使用 Google 帳號綁定</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">教學項目複選 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例：古典鋼琴, 小提琴, 視唱樂理, 流行鋼琴"
                    value={regForm.subjects}
                    onChange={(e) => setRegForm({ ...regForm, subjects: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">專業介紹與工作室經歷</label>
                  <textarea
                    rows={2}
                    placeholder="簡述您的教學年資、畢業學府與音樂工作室理念..."
                    value={regForm.bio}
                    onChange={(e) => setRegForm({ ...regForm, bio: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-3 text-stone-800"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#D97736] hover:bg-[#c4682a] text-white font-black shadow-md"
                  >
                    送出申請並登入
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 5. 頁尾 */}
      <footer className="text-center text-xs font-bold text-stone-400 py-4 border-t border-stone-200/60">
        MusiMate Music Studio OS v3.2 · Gemini 1.5 Flash Connected
      </footer>

    </div>
  );
}
