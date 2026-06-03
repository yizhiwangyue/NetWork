'use client'
import { useStore } from '@/lib/store'
import { CATEGORIES, getCategoryIcon } from '@/lib/seed'

export default function TopicNav() {
  const currentCategory = useStore((s) => s.currentCategory)
  const setCategory = useStore((s) => s.setCategory)
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => setCategory(null)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${!currentCategory ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>🌟 全部</button>
      {CATEGORIES.map((cat) => (
        <button key={cat.key} onClick={() => setCategory(cat.key)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${currentCategory === cat.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>{cat.icon} {cat.label}</button>
      ))}
    </div>
  )
}
