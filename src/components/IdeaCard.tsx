'use client'
import Link from 'next/link'
import { Idea } from '@/lib/types'
import { timeAgo, getCategoryLabel } from '@/lib/seed'

const CARD_BANNERS = [
  'from-violet-100 via-purple-100 to-fuchsia-200',
  'from-sky-100 via-blue-100 to-indigo-200',
  'from-emerald-100 via-teal-100 to-cyan-200',
  'from-amber-100 via-orange-100 to-rose-200',
  'from-rose-100 via-pink-100 to-purple-200',
  'from-lime-100 via-green-100 to-emerald-200',
]

export default function IdeaCard({ idea, index = 0 }: { idea: Idea; index?: number }) {
  const colorClass = CARD_BANNERS[index % CARD_BANNERS.length]
  const views = idea.likes * 8 + idea.comments * 3 + 120

  return (
    <Link href={`/idea?id=${idea.id}`} className="no-underline block card overflow-hidden animate-in group cursor-pointer flex flex-col" style={{ animationDelay: `${index * 0.05}s` }}>
      {/* 配图区 */}
      {idea.images && idea.images[0] ? (
        <div className="h-36 shrink-0 relative overflow-hidden bg-gray-100">
          <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.classList.add('hidden') }} />
          {idea.isBounty && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-sm transition-all group-hover:scale-110 group-hover:shadow-lg z-10">悬赏</div>
          )}
        </div>
      ) : (
      <div className={`card-banner h-36 shrink-0 bg-gradient-to-br ${colorClass} flex items-center justify-center relative overflow-hidden`}>
        <div className="card-banner-dot card-banner-dot-1 absolute -top-6 -right-6 w-28 h-28 bg-white/20 rounded-full" />
        <div className="card-banner-dot card-banner-dot-2 absolute -bottom-6 -left-6 w-20 h-20 bg-white/15 rounded-full" />
        <div className="text-center">
          <span className="card-emoji text-4xl opacity-60 block mb-1">
            {idea.category === 'tech' ? '🤖' : idea.category === 'life' ? '🏠' : idea.category === 'work' ? '💼' : idea.category === 'society' ? '🌍' : idea.category === 'entertain' ? '🎨' : idea.category === 'fantasy' ? '✨' : '🏆'}
          </span>
          <span className="card-category-tag text-xs text-white/60 font-medium px-2.5 py-0.5 bg-white/20 rounded-full backdrop-blur-sm">{getCategoryLabel(idea.category)}</span>
        </div>
        {idea.isBounty && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-sm transition-all group-hover:scale-110 group-hover:shadow-lg">悬赏</div>
        )}
      </div>
      )}

      {/* 内容区 */}
      <div className="card-content p-4 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-800 mb-1.5 group-hover:text-purple-600 transition-colors line-clamp-2 leading-relaxed">{idea.title}</h3>

        {idea.highlight && (
          <p className="text-xs text-purple-400/60 italic mb-2 leading-relaxed">「{idea.highlight}」</p>
        )}

        <div className="card-tags flex flex-wrap gap-1.5 mb-3 min-h-[22px]">
          {idea.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[11px] transition-colors">#{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100/80 mt-auto">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs">{idea.isAnonymous ? '👤' : idea.author?.avatar}</span>
            <span className="text-xs text-gray-400">{idea.isAnonymous ? '匿名用户' : idea.author?.nickname}</span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-300">{timeAgo(idea.createdAt)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="mr-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {views.toLocaleString()} 浏览
          </div>
        </div>
      </div>
    </Link>
  )
}
