import type { Metadata } from 'next';

import MockProvider from '@/mocks/MockProvider';
import QueryProvider from '@/shared/providers/QueryProvider';

import './globals.css';

export const metadata: Metadata = {
  title: '마케팅 캠페인 성과 대시보드',
  description: '모비데이즈 프론트엔드 과제 — 마케팅 캠페인 성과 대시보드',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <MockProvider>
          <QueryProvider>{children}</QueryProvider>
        </MockProvider>
      </body>
    </html>
  );
}
