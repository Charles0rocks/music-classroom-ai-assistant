-- ========================================================
-- 音樂教室 AI 小幫手 - Supabase PostgreSQL Schema DDL
-- ========================================================

-- 啟用 UUID 擴充套件
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用戶主表 (users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 老師詳細資料表 (teachers)
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    instrument VARCHAR(100) NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_teacher_user UNIQUE (user_id)
);

-- 3. 學生詳細資料表 (students)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_user UNIQUE (user_id)
);

-- 4. 老師開放時間段 (schedule_slots)
CREATE TABLE IF NOT EXISTS public.schedule_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_slot_time CHECK (end_time > start_time)
);

-- 5. 課程預約紀錄 (appointments)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'rescheduled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_appointment_time CHECK (end_time > start_time)
);

-- 6. 調課申請紀錄 (reschedule_requests)
CREATE TABLE IF NOT EXISTS public.reschedule_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    requested_slot_id UUID NOT NULL REFERENCES public.schedule_slots(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 課堂錄音與 AI 摘要紀錄 (lesson_records)
CREATE TABLE IF NOT EXISTS public.lesson_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    audio_url TEXT,
    raw_transcript TEXT NOT NULL,
    clean_summary_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 老師範例影片庫 (teacher_demo_videos)
CREATE TABLE IF NOT EXISTS public.teacher_demo_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    midi_data JSONB,
    tags TEXT[] DEFAULT '{}',
    pitch_tolerance INT DEFAULT 5, -- 容錯率
    tempo_tolerance INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 學生練習影片與 AI 反饋 (student_practice_videos)
CREATE TABLE IF NOT EXISTS public.student_practice_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    demo_video_id UUID REFERENCES public.teacher_demo_videos(id) ON DELETE SET NULL,
    video_url TEXT NOT NULL,
    ai_feedback_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- 建立資料庫索引 (Indexes for Optimization)
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_slots_teacher_time ON public.schedule_slots(teacher_id, start_time, is_available);
CREATE INDEX IF NOT EXISTS idx_appointments_teacher_time ON public.appointments(teacher_id, start_time, end_time, status);
CREATE INDEX IF NOT EXISTS idx_appointments_student ON public.appointments(student_id);

-- ========================================================
-- Row Level Security (RLS) 安全存取策略
-- ========================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reschedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_demo_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_practice_videos ENABLE ROW LEVEL SECURITY;

-- 策略：通用公開讀取用戶與老師資料
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Teacher bios are viewable by everyone" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Students can view student records" ON public.students FOR SELECT USING (true);

-- 策略： schedule_slots 僅允許顯示開放之空檔給所有人，隱藏已被私下預約的隱私
CREATE POLICY "Available slots are viewable by logged in users" 
ON public.schedule_slots FOR SELECT 
USING (is_available = true);

CREATE POLICY "Teachers can manage their own slots" 
ON public.schedule_slots FOR ALL 
USING (auth.uid() IN (SELECT user_id FROM public.teachers WHERE id = teacher_id));

-- 策略： appointments 僅限本人 (學生或老師) 檢視與變更，嚴格隱藏其他學生隱私
CREATE POLICY "Users can view their own appointments" 
ON public.appointments FOR SELECT 
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
    teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
);

-- 策略： reschedule_requests 僅限申請人與授課老師管理
CREATE POLICY "Users can view related reschedule requests" 
ON public.reschedule_requests FOR SELECT 
USING (
    appointment_id IN (
        SELECT id FROM public.appointments 
        WHERE student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
           OR teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
    )
);

-- 策略： lesson_records 僅限課程參與者讀取
CREATE POLICY "Lesson records viewable by participants" 
ON public.lesson_records FOR SELECT 
USING (
    appointment_id IN (
        SELECT id FROM public.appointments 
        WHERE student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
           OR teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
    )
);

-- 策略： Demo 影片庫讀取
CREATE POLICY "Demo videos viewable by student and teacher" 
ON public.teacher_demo_videos FOR SELECT USING (true);

-- 策略： 練習影片讀取與寫入
CREATE POLICY "Practice videos viewable by student and teacher" 
ON public.student_practice_videos FOR SELECT 
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
    student_id IN (SELECT s.id FROM public.students s JOIN public.teachers t ON s.teacher_id = t.id WHERE t.user_id = auth.uid())
);

-- ========================================================
-- 預設 Seed Data (展示專用數據)
-- ========================================================

-- 1. Users
INSERT INTO public.users (id, role, name, email, avatar_url) VALUES
('u0000000-0000-0000-0000-000000000001', 'teacher', '張老師 (Teacher Chang)', 'chang.teacher@harmony.edu', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('u0000000-0000-0000-0000-000000000002', 'student', '小明 (Ming)', 'ming.student@harmony.edu', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80');

-- 2. Teacher & Student Relationships
INSERT INTO public.teachers (id, user_id, instrument, bio) VALUES
('t0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', '小提琴 (Violin) & 鋼琴 (Piano)', '國立音樂學院碩士，10年專業小提琴與古典鋼琴教學經驗。');

INSERT INTO public.students (id, user_id, teacher_id) VALUES
('s0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000001');

-- 3. Initial Demo Video
INSERT INTO public.teacher_demo_videos (id, teacher_id, title, video_url, midi_data, tags, pitch_tolerance, tempo_tolerance) VALUES
('v0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', '巴哈：E大調小提琴協奏曲 第一樂章範例', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '{"bpm": 96, "key": "E Major"}', ARRAY['小提琴', '巴哈', '弓法練習'], 5, 8);
