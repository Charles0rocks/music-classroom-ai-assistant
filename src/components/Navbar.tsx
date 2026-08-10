'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import {
  Music,
  Calendar,
  Mic,
  Video,
  BookOpen,
  UserCheck,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRole, switchRole, currentUser } = useDemoContext();
  const pathname = usePathname();

  const isTeacher = currentRole === 'teacher';

  const teacherNavs = [
    { href: '/teacher/schedule', label: '週課表設定 (P1)', icon: Calendar },
    { href: '/teacher/recorder', label: '課堂錄音 AI (P2)', icon: Mic },
    { href: '/teacher/demos', label: '範例影片庫 (P7)', icon: Video },
  ];

  const studentNavs = [
    { href: '/student/schedule', label: '個人課表 (P3)', icon: Calendar },
    { href: '/student/practice', label: '作業學習中心 (P4)', icon: BookOpen },
  ];

  const currentNavs = isTeacher ? teacherNavs : studentNavs;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Role Selector Quick Action */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
                Harmonix AI Studio
              </span>
              <span className="text-xs text-slate-400 block -mt-1 font-medium">
                音樂教室 AI 小幫手
              </span>
            </div>
          </Link>

          {/* Quick Role Switcher Button */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button
              onClick={() => switchRole('teacher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isTeacher
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              張老師 (Teacher)
            </button>
            <button
              onClick={() => switchRole('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !isTeacher
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              小明 (Student)
            </button>
          </div>
        </div>

        {/* Dynamic Route Nav Navigation */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              pathname === '/'
                ? 'bg-slate-800 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            角色首頁 (P0)
          </Link>
          <div className="w-px h-4 bg-slate-800 mx-1 hidden sm:block" />
          {currentNavs.map((nav) => {
            const Icon = nav.icon;
            const active = pathname.startsWith(nav.href);
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  active
                    ? isTeacher
                      ? 'bg-purple-950/80 text-purple-200 border border-purple-500/40 shadow-sm'
                      : 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? (isTeacher ? 'text-purple-400' : 'text-cyan-400') : 'text-slate-400'}`} />
                {nav.label}
              </Link>
            );
          })}
        </nav>

        {/* User Identity Info */}
        <div className="hidden lg:flex items-center gap-3">
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border-2 border-slate-700 object-cover"
          />
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{currentUser.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
