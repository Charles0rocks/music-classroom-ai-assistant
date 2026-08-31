# MusiMate - 溫暖音樂教室 AI 小幫手 🎵

> 專為音樂教師、學生與家長打造的溫暖智慧音樂教學與排課助手。

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://music-classroom-ai-assistant-r9qc.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-blue?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🔗 線上 Demo 連結

👉 **[MusiMate 線上正式版入口](https://music-classroom-ai-assistant-r9qc.vercel.app/)**

---

## ✨ 專案簡介與特色亮點

`MusiMate` 是一款融合現代前端體驗與後端雲端資料庫的音樂教學管理系統。提供極致流暢的莫蘭迪奶油風 UI 介面，並深入解決音樂老師在每日教學、課表排程、錄音整理與作業批改上的痛點。

### 🌟 核心功能亮點

1. **📅 課表安排工作台 (Schedule Workbench)**
   - **當日動態統計**：智慧過濾當日排課數量（例如：1 堂）與動態估算預估收益（例如：$1,200）。
   - **莫蘭迪雙維度矩陣**：支援拖曳排課、常態時段設定與刪除，並能一鍵開放彈性時段。
   - **全自動日期同步**：精確連動台灣時間與當週各星期（如 `2026/08/31 (週一)`）。

2. **🎙️ 課堂紀錄與 AI 錄音筆記 (Lesson Recorder)**
   - **樂句重點標記**：支援音樂老師在課堂錄音時新增時間軸標籤與重點整理。
   - **AI 課堂摘要修復**：自動修復與優化課堂學習重點與回家練習建議。

3. **📹 影音作業批改與比對 (Demo & Practice Comparator)**
   - **老師示範影音管理**：支援分類標籤（如 `古典` / `爵士` / `基礎`）與學生導向示範片庫。
   - **雙畫面影音比對**：提供學生練習影片與老師示範影片的同屏比對與音高/拍子相似度分析。

4. **🎵 樂理諮詢與溫暖語氣互動**
   - **親切耐心語氣**：為學生與家長提供溫暖、有鼓勵效果的樂理解答與課後陪伴。

5. **👤 動態性別頭像與教師身分連動**
   - **性別動態頭像匹配**：依據教師與學生性別 (Male / Female / 男 / 女)，經由 Deterministic Hash 算法精確分配高畫質真實男/女性音樂教師 Portrait 照片。
   - **Supabase 完整連動**：教師註冊與登入時完整將姓名、暱稱、性別、教授樂器寫入 `public.teachers` 資料庫與 Metadata。

6. **🛡️ 未登入訪客 Demo 預覽與權限隔離**
   - **未登入訪客模式**：訪客可直接體驗靜態 Mock 數據與介紹，不發起真實 Supabase 查詢。
   - **完全無自動跳轉**：登入成功後永久停留在【首頁歡迎儀表板】，由老師自主點擊功能卡片進入對應工作台。

---

## 🛠️ 技術棧與工具鏈

- **Core Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Backend & Auth**: [Supabase Auth & Database](https://supabase.com/)
- **Deployment**: [Vercel App Platform](https://vercel.com/)

---

## 🚀 本地開發與啟動說明

### 1. 克隆專案並安裝依賴

```bash
git clone https://github.com/Charles0rocks/music-classroom-ai-assistant.git
cd music-classroom-ai-assistant
npm install
```

### 2. 環境變數配置

複製 `.env.example` 並建立 `.env.local` 檔案：

```bash
cp .env.example .env.local
```

在 `.env.local` 中填入您的 Supabase 認證資訊：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 啟動開發者伺服器

```bash
npm run dev
```

瀏覽器開啟 `http://localhost:3000` 即可預覽應用程式。

### 4. 正式打包與建置測試

```bash
npm run build
npm run start
```

---

## 📂 專案結構說明

```text
├── src/
│   ├── app/                    # Next.js App Router 頁面與 API 路由
│   │   ├── page.tsx            # 首頁與 Teacher Portal 歡迎儀表板
│   │   ├── teacher/
│   │   │   ├── schedule/       # 教師週課表安排工作台
│   │   │   ├── recorder/       # AI 課堂錄音紀錄頁面
│   │   │   └── demos/          # 作業批改與示範影音頁面
│   │   └── student/            # 學生端預約與影音比對頁面
│   ├── components/             # 可重用 UI 元件 (Navbar, LoginModal, TeacherRegisterModal 等)
│   ├── context/                # DemoContext 全域登入與 Demo 狀態庫
│   ├── lib/                    # Helper 函式 (avatarHelper, authHelper, supabaseClient 等)
│   └── types/                  # TypeScript 型態定義 (User, Teacher, Appointment 等)
├── public/                     # 靜態資源與圖檔
├── .env.example                # 環境變數範本
├── .gitignore                  # Git 忽略設定
└── README.md                   # 專案說明文件
```

---

## 📄 授權條款 (License)

MIT License © 2026 MusiMate Team
