'use client'
import Link from 'next/link'
import { useStore } from '@/lib/store'

export default function Header() {
  const searchQuery = useStore((s) => s.searchQuery)
  const setSearch = useStore((s) => s.setSearch)

  return (
    <header className="sticky top-0 z-50 glass header-shadow">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/discover" className="flex items-center gap-2.5 shrink-0 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
            <span className="text-lg">💡</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">脑洞</span>
            <span className="text-gray-800">星球</span>
          </span>
        </Link>

        {/* 搜索框 */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="搜索脑洞..."
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => window.location.href = '/search'}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100/70 border border-transparent rounded-xl text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:bg-white focus:border-purple-300/50 transition-all hover:bg-gray-100"
            />
          </div>
        </div>

        {/* 右半区 */}
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/publish" className="btn-primary px-5 py-2.5 text-sm flex items-center gap-1.5 no-underline whitespace-nowrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            发布脑洞
          </Link>

          {/* 通知 */}
          <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100/80 hover:text-gray-600 transition-all relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="badge-dot absolute -top-0.5 -right-0.5">3</span>
          </button>

          {/* 用户头像 */}
          <Link href="/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-lg hover:shadow-md transition-all no-underline">
            😎
          </Link>
        </div>
      </div>
    </header>
  )
}
