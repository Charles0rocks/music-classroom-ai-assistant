import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '@/context/DemoContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Harmonix AI Studio - 音樂教室 AI 小幫手',
  description: '全方位 AI 音樂教學輔助系統，提供智慧調課、課堂情緒過濾摘要與 AI 雙影片比對診斷。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased text-slate-100 bg-[#090a10] min-h-screen flex flex-col">
        <DemoProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel mt-12">
            Harmonix AI Studio &copy; {new Date().getFullYear()} - 音樂教室 AI 小幫手 (MVP Version)
          </footer>
        </DemoProvider>
      </body>
    </html>
  );
}
