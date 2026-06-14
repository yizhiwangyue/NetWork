'use client'
import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import IdeaCard from '@/components/IdeaCard'
import { useStore } from '@/lib/store'
import { filterIdeas } from '@/lib/seed'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const ideas = useStore((s) => s.ideas)
  const sortMode = useStore((s) => s.sortMode)
  const searchQuery = useStore((s) => s.searchQuery)
  const setSearch = useStore((s) => s.setSearch)
  const currentCategory = useStore((s) => s.currentCategory)
  const currentTag = useStore((s) => s.currentTag)
  const filtered = useMemo(() => filterIdeas(ideas, sortMode, currentCategory, currentTag, searchQuery), [ideas, sortMode, currentCategory, currentTag, searchQuery])

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 搜索框 */}
        <div className="card p-5 mb-6 animate-in">
          <h1 className="text-lg font-bold text-gray-800 mb-4">🔍 搜索洞核</h1>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="搜索洞核的标题或内容..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') setSearch(query) }} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 focus:bg-white transition-all" />
            </div>
            <button onClick={() => setSearch(query)} className="btn-primary px-6 py-3 text-sm">搜索</button>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium">时间范围：</span>
            {['近24小时', '近一周', '近一月', '全部'].map(label => (
              <button key={label} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${label === '全部' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>{label}</button>
            ))}
          </div>
        </div>

        {/* 结果 */}
        {searchQuery && <div className="mb-4 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-600 animate-in">搜索「<strong>{searchQuery}</strong>」找到 {filtered.length} 条结果</div>}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 animate-in">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-medium mb-1">没有找到相关洞核</p>
            <p className="text-sm text-gray-400">试试其他关键词或调整筛选条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((idea, i) => <IdeaCard key={idea.id} idea={idea} index={i} />)}
          </div>
        )}
      </main>
    </div>
  )
}
