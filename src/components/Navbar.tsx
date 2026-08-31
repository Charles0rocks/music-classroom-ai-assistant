'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import { LoginModal } from '@/components/LoginModal';
import { getAvatarByGender } from '@/lib/avatarHelper';
import { supabase } from '@/lib/supabaseClient';
import { handleLogout } from '@/lib/authHelper';
import {
  Music,
  Calendar,
  Mic,
  Video,
  BookOpen,
  UserCheck,
  Sparkles,
  ArrowLeftRight,
  FileText,
  Sliders,
  LogOut,
  LogIn,
  Clock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { currentRole, currentUser, isAuthenticated, logout } = useDemoContext();

  const [savedTeacher, setSavedTeacher] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('auth_teacher');
      if (saved) {
        try {
          setSavedTeacher(JSON.parse(saved));
        } catch (e) {}
      } else {
        setSavedTeacher(null);
      }
    }
  }, [isAuthenticated]);

  const activeAuth = isAuthenticated || !!savedTeacher;
  const teacherName = currentUser?.name || savedTeacher?.name || '認證老師';
  const teacherAvatar = currentUser?.avatar_url || savedTeacher?.avatar_url || getAvatarByGender(savedTeacher?.gender || 'female', currentUser?.id || savedTeacher?.id);
  const teacherEmail = currentUser?.email || savedTeacher?.email || 'teacher@harmony.edu';

  const onSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleLogout();
  };
  const pathname = usePathname();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const teacherNavs = [
    { href: '/teacher/schedule', label: '課表安排頁面', icon: Calendar },
    { href: '/teacher/recorder', label: '課堂紀錄頁面', icon: Mic },
    { href: '/teacher/demos', label: '作業檢視頁面', icon: Video },
  ];

  const currentNavs = teacherNavs;

  const getTodayDateStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const offsetMinutes = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    const timeZoneStr = `UTC${offsetSign}${offsetHours}`;
    return `${year}/${month}/${date} (${timeZoneStr})`;
  };

  const todayStr = getTodayDateStr();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EFECE6] px-2.5 sm:px-4 lg:px-8 py-2 sm:py-3.5 shadow-[0_2px_15px_rgba(140,109,83,0.04)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
          {/* Brand Logo, Title & Role Identity Controls (Moved from Home page header) */}
          <div className="flex items-center justify-between md:justify-start gap-2.5 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-400 via-amber-500 to-[#D97736] flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md shadow-[#D97736]/20 group-hover:scale-105 transition-transform shrink-0">
                🎵
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-base sm:text-lg text-[#332C27] tracking-tight whitespace-nowrap block">
                    Musi <span className="text-[#D97736]">Mate</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[#D97736] border border-amber-200 text-[10px] sm:text-xs font-black">
                    v3.2 PRO
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#7A736E] -mt-0.5 font-bold whitespace-nowrap">
                  <span>音樂教室AI 小幫手</span>
                  <span className="text-[#E8D4C5]">·</span>
                  <span className="font-mono text-[10px] sm:text-[11px] text-[#D97736]">{todayStr}</span>
                </div>
              </div>
            </Link>

            {/* Authenticated Role Badge & Logout Control */}
            {activeAuth && (
              <div className="flex items-center gap-1 sm:gap-2 bg-[#FAF7F2] p-1 rounded-full border border-[#EFECE6] shrink-0">
                <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 bg-[#8C6D53] text-white shadow-xs">
                  <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {teacherName} 老師 <span className="hidden sm:inline">(PRO)</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#7A736E] hover:text-[#332C27] hover:bg-[#EFECE6] transition-all flex items-center gap-1"
                  title="登出並重定向至首頁"
                >
                  <LogOut className="w-3 h-3 text-[#8C6D53]" />
                  登出
                </button>
              </div>
            )}
          </div>

          {/* Navigation Menu - Role Isolated Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none text-xs">
            <Link
              href="/"
              className={`px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
                pathname === '/'
                  ? 'bg-[#FAF2EC] text-[#8C6D53] border border-[#E8D4C5]'
                  : 'text-[#7A736E] hover:text-[#332C27] hover:bg-[#FAF7F2]'
              }`}
            >
              <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              首頁
            </Link>
            <div className="w-px h-4 bg-[#EFECE6] mx-0.5 hidden sm:block" />
            {currentNavs.map((nav) => {
              const Icon = nav.icon;
              const active = pathname.startsWith(nav.href);
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 shrink-0 transition-all ${
                    active
                      ? 'bg-[#8C6D53] text-white shadow-xs'
                      : 'text-[#7A736E] hover:text-[#332C27] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {nav.label}
                </Link>
              );
            })}
          </nav>

          {/* User Identity Info */}
          {activeAuth ? (
            <div className="hidden lg:flex items-center gap-3">
              <img
                src={teacherAvatar}
                alt={teacherName}
                className="w-8 h-8 rounded-full border-2 border-[#EFECE6] object-cover shrink-0"
              />
              <div className="text-right">
                <div className="text-xs font-bold text-[#332C27]">{teacherName} (PRO)</div>
                <div className="text-[10px] text-[#7A736E] font-medium font-mono">{teacherEmail}</div>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="ml-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-200 hover:border-red-200 text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                title="登出系統"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>登出</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D97736] hover:bg-[#c4682a] text-white text-xs font-bold shadow-sm transition-all"
            >
              🔑 登入老師帳號
            </button>
          )}
        </div>
      </header>

      {/* Login Modal Popup */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};
