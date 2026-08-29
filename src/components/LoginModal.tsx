'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import { Role } from '@/types';
import {
  UserCheck,
  Sparkles,
  Lock,
  Mail,
  AlertCircle,
  X,
  CheckCircle2,
  Key,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { login } = useDemoContext();

  const [email, setEmail] = useState('chang.teacher@harmony.edu');
  const [password, setPassword] = useState('teacher123');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = login(email, password, 'teacher');
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        router.push('/teacher/schedule');
      }, 600);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#332C27]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#EADFC9] border-l-8 border-l-[#8C6D53] shadow-[0_8px_30px_rgba(140,109,83,0.15)] space-y-5 animate-in fade-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#7A736E] hover:text-[#332C27]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2E8D8] text-[#785338] text-xs font-bold border border-[#EADFC9]">
            <Lock className="w-3.5 h-3.5" /> 帳號密碼登入驗證
          </div>
          <h2 className="text-2xl font-extrabold text-[#332C27]">
            登入 MusiMate
          </h2>
          <p className="text-xs text-[#7A736E] font-medium">
            請輸入授權帳號與密碼，體驗專屬音樂教學 Portal
          </p>
        </div>

        {/* Teacher Identity Badge Header */}
        <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EFECE6] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8C6D53] text-white flex items-center justify-center font-bold text-xs shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#332C27]">張老師 / 林詠晴 老師 [PRO]</div>
            <div className="text-[10px] text-[#7A736E]">教師端排課與工作台管理</div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-[#FCEADE] border border-[#F6D0B8] text-xs font-bold text-[#B85536] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-[#E3E8E1] border border-[#C5D2C2] text-xs font-bold text-[#3D5240] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#332C27] mb-1">
              帳號 (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A736E] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="輸入您的 Email"
                className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#332C27] focus:outline-none focus:border-[#8C6D53] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#332C27] mb-1">
              密碼 (Password)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#7A736E] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="輸入您的密碼"
                className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#332C27] focus:outline-none focus:border-[#8C6D53] font-mono"
              />
            </div>
          </div>

          {/* Demo Credentials Helper Pill */}
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFECE6] space-y-1.5 text-[11px]">
            <span className="text-[#8C6D53] font-bold block">💡 快速測試 (Quick Fill Demo)</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('chang.teacher@harmony.edu');
                  setPassword('teacher123');
                }}
                className="w-full py-1.5 rounded-full bg-[#8C6D53] text-white font-bold hover:bg-[#765942] transition-all"
              >
                帶入林詠晴 / 張老師帳密 (teacher123)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full text-white font-bold text-xs shadow-md transition-all bg-[#8C6D53] hover:bg-[#765942] shadow-[#8C6D53]/20"
            >
              確認登入 (Log In)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
