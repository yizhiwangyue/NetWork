'use client'
import { useStore } from '@/lib/store'
import { CATEGORIES } from '@/lib/seed'
import Link from 'next/link'

export default function Sidebar() {
  const currentCategory = useStore((s) => s.currentCategory)
  const setCategory = useStore((s) => s.setCategory)
  const sortMode = useStore((s) => s.sortMode)
  const setSortMode = useStore((s) => s.setSortMode)

  return (
    <aside className="space-y-4">
      {/* 快捷导航 */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">快捷导航</h3>
        <nav className="space-y-0.5">
          <Link href="/discover" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all no-underline font-medium">
            <span className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-xs">🏠</span>
            首页
          </Link>
          <Link href="/discover" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all no-underline">
            <span className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-xs">🔥</span>
            热门推荐
          </Link>
          <Link href="/publish" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all no-underline">
            <span className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center text-xs">✏️</span>
            发布脑洞
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all no-underline">
            <span className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center text-xs">👤</span>
            个人中心
          </Link>
        </nav>
      </div>

      {/* 主题分类 */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">主题分类</h3>
        <div className="space-y-0.5">
          <button
            onClick={() => setCategory(null)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${!currentCategory ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs">📋</span>
            全部
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${currentCategory === cat.key ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${currentCategory === cat.key ? 'bg-indigo-200' : 'bg-gray-100'}`}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
