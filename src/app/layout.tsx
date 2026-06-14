import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '嘿洞星球 - 等你来开洞',
  description: '分享你的洞核，发现有趣的想法',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
