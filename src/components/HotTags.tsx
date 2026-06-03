'use client'
import { useStore } from '@/lib/store'
import { HOT_TAGS } from '@/lib/seed'

export default function HotTags() {
  const currentTag = useStore((s) => s.currentTag)
  const setTag = useStore((s) => s.setTag)
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-medium text-slate-400 mr-1">🔥 热门标签</span>
      {currentTag && <button onClick={() => setTag(null)} className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500 hover:bg-slate-200">清除 ✕</button>}
      {HOT_TAGS.map((tag) => (
        <button key={tag} onClick={() => setTag(currentTag === tag ? null : tag)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${currentTag === tag ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>#{tag}</button>
      ))}
    </div>
  )
}
