import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '脑洞星球 - 让每一个奇思妙想都有回响',
  description: '分享你的脑洞，发现有趣的想法',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
