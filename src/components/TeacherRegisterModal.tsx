'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import { supabase } from '@/lib/supabaseClient';
import { getAvatarByGender } from '@/lib/avatarHelper';
import { UserPlus, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface TeacherRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherRegisterModal: React.FC<TeacherRegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { login } = useDemoContext();

  const [formData, setFormData] = useState({
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // 1. 表單驗證：必填項目 (姓名, 電話, Email, 密碼)
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('請填寫所有必填欄位（姓名、電話、Email、密碼）。');
      return;
    }

    // 1. 密碼長度驗證 (至少 6 碼)
    if (formData.password.length < 6) {
      setErrorMsg('密碼長度至少需要 6 個字元。');
      return;
    }

    setIsSubmitting(true);

    try {
      let createdUserId = `u-reg-${Date.now()}`;

      // 2. Supabase 串接：建立驗證帳號與寫入 teachers 資料表
      if (supabase) {
        // 第一步：呼叫 supabase.auth.signUp
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (authError) {
          setErrorMsg(`帳號建立失敗：${authError.message}`);
          setIsSubmitting(false);
          return;
        }

        if (authData?.user) {
          createdUserId = authData.user.id;

          // 第三步：向 teachers 資料表執行 insert
          const genderText = formData.gender === 'female' ? '女' : formData.gender === 'male' ? '男' : '其他';
          
          const { error: dbError } = await supabase.from('teachers').insert([
            {
              user_id: createdUserId,
              name: formData.name.trim(),
              nickname: formData.nickname.trim() || formData.name.trim(),
              gender: genderText,
              instrument: formData.subjects.trim(), // 對應教學項目
              phone: formData.phone.trim(),
              email: formData.email.trim(),
              bio: formData.bio.trim() || '',
            },
          ]);

          if (dbError) {
            console.warn('teachers 資料表寫入提示：', dbError.message);
          }
        }
      }

      // 3. 儲存教師資料至 LocalStorage 並登入系統
      const teacherObj = {
        id: `t-${Date.now()}`,
        user_id: createdUserId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        instrument: formData.subjects.trim(),
        bio: formData.bio.trim() || '新申請認證教師',
        avatar_url: getAvatarByGender(formData.gender, createdUserId),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_teacher', JSON.stringify(teacherObj));
      }

      login(formData.email, formData.password, 'teacher');

      setSuccessMsg('🎉 申請成功！已為您完成帳號建置並自動登入，正在跳轉至工作台...');

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg('');
        onClose();
        router.push('/teacher/schedule');
      }, 1000);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMsg(err?.message || '註冊過程發生未知錯誤，請稍後再試。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#D97736]" />
            申請老師帳號 (Teacher Registration)
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-stone-400 hover:text-stone-600 font-bold text-lg disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
            <div>{successMsg}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  required
                  placeholder="例：陳雅婷"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-stone-700 mb-1">稱呼 / 暱稱</label>
                <input
                  type="text"
                  placeholder="例：雅晴 老師"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 mb-1">性別</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-stone-700 mb-1">密碼 (至少 6 碼) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="6位數以上密碼"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 mb-1">綁定帳號 (LINE / Google 二擇一) *</label>
              <select
                value={formData.socialAccount}
                onChange={(e) => setFormData({ ...formData, socialAccount: e.target.value })}
                disabled={isSubmitting}
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
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
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                disabled={isSubmitting}
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-stone-700 mb-1">專業介紹與工作室經歷</label>
              <textarea
                rows={2}
                placeholder="簡述您的教學年資、畢業學府與音樂工作室理念..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={isSubmitting}
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#D97736] hover:bg-[#c4682a] text-white font-black shadow-md transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    處理中...
                  </>
                ) : (
                  '送出申請並登入'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
