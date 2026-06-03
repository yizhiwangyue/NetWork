'use client'
import { useStore } from '@/lib/store'
import { SortMode } from '@/lib/types'

const SORT_OPTIONS: { key: SortMode; label: string; icon: string }[] = [
  { key: 'latest', label: '最新发布', icon: '🕐' },
  { key: 'hot', label: '最热讨论', icon: '🔥' },
  { key: 'favorites', label: '最多收藏', icon: '⭐' },
  { key: 'bounty', label: '悬赏中', icon: '🏆' },
]

export default function SortBar() {
  const sortMode = useStore((s) => s.sortMode)
  const setSortMode = useStore((s) => s.setSortMode)
  return (
    <div className="flex gap-1.5">
      {SORT_OPTIONS.map((opt) => (
        <button key={opt.key} onClick={() => setSortMode(opt.key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortMode === opt.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>{opt.icon} {opt.label}</button>
      ))}
    </div>
  )
}
