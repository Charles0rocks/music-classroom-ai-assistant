'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoContext, PRESET_TEACHERS } from '@/context/DemoContext';
import { Role } from '@/types';
import {
  UserCheck,
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
            教師端登入 (Teacher Portal)
          </h2>
          <p className="text-xs text-[#7A736E] font-medium">
            請選擇或輸入預設教師帳號與密碼 (Teacher#2026) 進行登入
          </p>
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

        {/* 5 Preset Teachers Selection Pills */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#332C27]">一鍵點選預設 5 位教師帳號：</span>
          <div className="grid grid-cols-5 gap-1.5">
            {PRESET_TEACHERS.map((t) => {
              const isSelected = email.toLowerCase() === t.user.email.toLowerCase();
              return (
                <button
                  key={t.user.id}
                  type="button"
                  onClick={() => {
                    setEmail(t.user.email);
                    setPassword('Teacher#2026');
                  }}
                  className={`py-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                    isSelected
                      ? 'bg-[#8C6D53] text-white border-[#8C6D53] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#7A736E] border-[#EFECE6] hover:bg-[#F2E8D8]'
                  }`}
                >
                  {t.user.name}
                </button>
              );
            })}
          </div>
        </div>

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
                placeholder="輸入您的 Teacher Email"
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
