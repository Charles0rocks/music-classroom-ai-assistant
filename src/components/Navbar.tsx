'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import { LoginModal } from '@/components/LoginModal';
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  const pathname = usePathname();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const isTeacher = currentRole === 'teacher';

  const teacherNavs = [
    { href: '/teacher/schedule', label: '週課表設定 (P1)', icon: Calendar },
    { href: '/teacher/recorder', label: '課堂錄音 AI (P2)', icon: Mic },
    { href: '/teacher/demos', label: '範例影片庫 (P7)', icon: Video },
  ];

  const studentNavs = [
    { href: '/student/schedule', label: '個人課表與調課 (P3)', icon: Calendar },
    { href: '/student/practice', label: '作業學習中心 (P4)', icon: BookOpen },
    { href: '/student/summary/lesson-1', label: 'P5 AI筆記', icon: FileText },
    { href: '/student/compare/practice-1', label: 'P6 雙圖比對', icon: Sliders },
  ];

  const currentNavs = isTeacher ? teacherNavs : studentNavs;

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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EFECE6] px-4 lg:px-8 py-3.5 shadow-[0_2px_15px_rgba(140,109,83,0.04)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Logo, Today Date Badge & Role Identity Controls */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8C6D53] to-[#E88D67] flex items-center justify-center shadow-md shadow-[#8C6D53]/20 group-hover:scale-105 transition-transform shrink-0">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-[#332C27] tracking-tight whitespace-nowrap block">
                  Harmonix AI Studio
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7A736E] -mt-0.5 font-medium whitespace-nowrap">
                  <span>音樂教室 AI 小幫手</span>
                  <span className="text-[#E8D4C5]">·</span>
                  <span className="font-mono text-[11px] font-bold text-[#8C6D53]">{todayStr}</span>
                </div>
              </div>
            </Link>

            {/* Authenticated Role Badge & Logout / Switch Account Control */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-[#FAF7F2] p-1 rounded-full border border-[#EFECE6]">
                {isTeacher ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-[#8C6D53] text-white shadow-sm">
                    <UserCheck className="w-3.5 h-3.5" />
                    張老師 (Teacher)
                  </span>
                ) : (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-[#E88D67] text-white shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    小明 (Student)
                  </span>
                )}

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full text-[11px] font-bold text-[#7A736E] hover:text-[#332C27] hover:bg-[#EFECE6] transition-all flex items-center gap-1"
                  title="登出並重定向至首頁"
                >
                  <LogOut className="w-3 h-3 text-[#8C6D53]" />
                  登出 / 切換帳號
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-1.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                帳號密碼登入
              </button>
            )}
          </div>

          {/* Navigation Menu - Role Isolated Links */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/'
                  ? 'bg-[#FAF2EC] text-[#8C6D53] border border-[#E8D4C5]'
                  : 'text-[#7A736E] hover:text-[#332C27] hover:bg-[#FAF7F2]'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              角色首頁 (P0)
            </Link>
            <div className="w-px h-4 bg-[#EFECE6] mx-1 hidden sm:block" />
            {currentNavs.map((nav) => {
              const Icon = nav.icon;
              const active = pathname.startsWith(nav.href);
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    active
                      ? isTeacher
                        ? 'bg-[#FAF2EC] text-[#8C6D53] border border-[#E8D4C5] shadow-sm'
                        : 'bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8] shadow-sm'
                      : 'text-[#7A736E] hover:text-[#332C27] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? (isTeacher ? 'text-[#8C6D53]' : 'text-[#E88D67]') : 'text-[#7A736E]'}`} />
                  {nav.label}
                </Link>
              );
            })}
          </nav>

          {/* User Identity Info */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-3">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border-2 border-[#EFECE6] object-cover"
              />
              <div className="text-right">
                <div className="text-xs font-bold text-[#332C27]">{currentUser.name}</div>
                <div className="text-[10px] text-[#7A736E] font-medium">{currentUser.email}</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal Popup */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};
