-- ========================================================
-- 音樂教室 AI 小幫手 - 教師帳號與 Seed 資料
-- 預設登入：Email: chl@gmail.com / 密碼: 12345678 (Charles Lin, Piano)
-- ========================================================

-- 1. 預設 教師 User 帳號
INSERT INTO public.users (id, role, name, email, avatar_url) VALUES
('u-charles-lin', 'teacher', 'Charles Lin', 'chl@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('u-chang-001', 'teacher', '張老師', 'chang.teacher@harmony.edu', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('u-lee-002', 'teacher', '李老師', 'lee.teacher@harmony.edu', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('u-wang-003', 'teacher', '王老師', 'wang.teacher@harmony.edu', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
('u-chen-004', 'teacher', '陳老師', 'chen.teacher@harmony.edu', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'),
('u-lin-005', 'teacher', '林老師', 'lin.teacher@harmony.edu', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url;

-- 2. 預設 教師詳細資料
INSERT INTO public.teachers (id, user_id, instrument, bio) VALUES
('t-charles-lin', 'u-charles-lin', 'Piano', '專業鋼琴演奏與 AI 音樂教學。'),
('t-chang', 'u-chang-001', '鋼琴 (Piano)', '國立音樂學院鋼琴演奏碩士，10年古典與流行鋼琴教學經驗。'),
('t-lee', 'u-lee-002', '小提琴 (Violin)', '知名交響樂團小提琴副首席，專精於古典小提琴與檢定輔導。'),
('t-wang', 'u-wang-003', '長笛 (Flute)', '巴黎法蘭西音樂院長笛高階文憑，長笛演奏與長笛合奏專家。'),
('t-chen', 'u-chen-004', '爵士鼓 (Drums)', '20年爵士鼓與打擊樂教學經驗，擅長 Funk、Rock 與 Jazz 節奏。'),
('t-lin', 'u-lin-005', '聲樂 (Vocal)', '義大利音樂學院聲樂碩士，專精於美聲唱法與流行發聲指導。')
ON CONFLICT (user_id) DO UPDATE SET
  instrument = EXCLUDED.instrument,
  bio = EXCLUDED.bio;

-- 3. 確保 schedules 資料表存在且欄位齊全
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id VARCHAR(100) NOT NULL DEFAULT 't-charles-lin',
    student_name VARCHAR(100) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    room VARCHAR(100) DEFAULT '大安琴房 A 室',
    fee INT DEFAULT 1200,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_schedule_time CHECK (end_time > start_time)
);

-- 建立多租戶隔離查詢索引
CREATE INDEX IF NOT EXISTS idx_schedules_teacher ON public.schedules(teacher_id, start_time);
