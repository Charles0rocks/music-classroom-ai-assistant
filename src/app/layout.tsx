import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '@/context/DemoContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Harmonix AI Studio - 溫暖音樂教室 AI 小幫手',
  description: '溫暖柔和的 AI 音樂教學輔助系統，提供智慧調課、課堂情緒過濾摘要與 AI 雙影片比對診斷。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased text-[#332C27] bg-[#FAF7F2] min-h-screen flex flex-col font-sans">
        <DemoProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-[#EFECE6] py-6 text-center text-xs text-[#7A736E] bg-white/80 backdrop-blur-md mt-12">
            Harmonix AI Studio &copy; {new Date().getFullYear()} - 溫暖音樂教室 AI 小幫手 (MVP Version)
          </footer>
        </DemoProvider>
      </body>
    </html>
  );
}
