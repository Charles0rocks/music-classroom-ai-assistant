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

  const teacherNavs = [
    { href: '/teacher/schedule', label: '週課表與工作台 (P1)', icon: Calendar },
    { href: '/teacher/recorder', label: '課堂錄音 AI (P2)', icon: Mic },
    { href: '/teacher/demos', label: '範例影片庫 (P7)', icon: Video },
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
          {/* Brand Logo, Today Date Badge & Role Identity Controls */}
          <div className="flex items-center justify-between md:justify-start gap-2.5 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#8C6D53] to-[#E88D67] flex items-center justify-center shadow-md shadow-[#8C6D53]/20 group-hover:scale-105 transition-transform shrink-0">
                <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg text-[#332C27] tracking-tight whitespace-nowrap block">
                  Studio OS 教師課表
                </span>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#7A736E] -mt-0.5 font-medium whitespace-nowrap">
                  <span className="hidden xs:inline">音樂教室 AI 工作台</span>
                  <span className="hidden xs:inline text-[#E8D4C5]">·</span>
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#8C6D53]">{todayStr}</span>
                </div>
              </div>
            </Link>

            {/* Authenticated Role Badge & Logout Control */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-[#FAF7F2] p-1 rounded-full border border-[#EFECE6] shrink-0">
                <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 bg-[#8C6D53] text-white shadow-xs">
                  <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  林詠晴 老師 <span className="hidden sm:inline">(PRO)</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#7A736E] hover:text-[#332C27] hover:bg-[#EFECE6] transition-all flex items-center gap-1"
                  title="登出並重定向至首頁"
                >
                  <LogOut className="w-3 h-3 text-[#8C6D53]" />
                  <span className="hidden xs:inline">登出 / </span>切換
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                帳號密碼登入
              </button>
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
              角色首頁 (P0)
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
