'use client'
import { useMemo } from 'react'
import Header from '@/components/Header'
import BackgroundWaves from '@/components/BackgroundWaves'
import Sidebar from '@/components/Sidebar'
import RightPanel from '@/components/RightPanel'
import SortBar from '@/components/SortBar'
import IdeaCard from '@/components/IdeaCard'
import { useStore } from '@/lib/store'
import { filterIdeas } from '@/lib/seed'

export default function DiscoverPage() {
  const ideas = useStore((s) => s.ideas)
  const sortMode = useStore((s) => s.sortMode)
  const currentCategory = useStore((s) => s.currentCategory)
  const currentTag = useStore((s) => s.currentTag)
  const searchQuery = useStore((s) => s.searchQuery)

  const filteredIdeas = useMemo(
    () => filterIdeas(ideas, sortMode, currentCategory, currentTag, searchQuery),
    [ideas, sortMode, currentCategory, currentTag, searchQuery]
  )

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative">
      <BackgroundWaves />
      <div className="relative z-10">
        <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20"><Sidebar /></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-5 animate-in">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">
                  {currentCategory
                    ? ({ tech: '🤖 科技与未来', life: '🏠 生活与消费', work: '💼 工作与效率', society: '🌍 社会与人文', entertain: '🎨 娱乐与艺术', fantasy: '✨ 奇妙异想', bounty: '🏆 悬赏专区' } as any)[currentCategory] || '🌟 全部洞核'
                    : currentTag ? `#${currentTag}` : '🌟 发现洞核'}
                </h2>
                <span className="text-xs text-gray-400">{filteredIdeas.length} 个洞核</span>
              </div>
              <SortBar />
            </div>

            {(currentCategory || currentTag) && (
              <div className="mb-4 px-4 py-2.5 bg-white border border-purple-100 rounded-xl text-sm text-purple-600 flex items-center gap-2 animate-in">
                <span>当前筛选：</span>
                {currentCategory && <span className="px-2.5 py-0.5 bg-purple-50 rounded-md text-xs font-medium">{currentCategory}</span>}
                {currentTag && <span className="px-2.5 py-0.5 bg-purple-50 rounded-md text-xs font-medium">#{currentTag}</span>}
                <button onClick={() => { const s = useStore.getState(); s.setCategory(null); s.setTag(null) }} className="ml-auto text-xs text-purple-400 hover:text-purple-600 font-medium">清除全部 ✕</button>
              </div>
            )}

            {filteredIdeas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 animate-in">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 font-medium">没有找到匹配的洞核</p>
                <p className="text-sm text-gray-400 mt-2">换个筛选条件试试？</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIdeas.map((idea, i) => <IdeaCard key={idea.id} idea={idea} index={i} />)}
              </div>
            )}

            {filteredIdeas.length > 0 && (
              <div className="text-center mt-6 mb-4 animate-in-d3">
                <button className="px-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-all font-medium">加载更多洞核 →</button>
              </div>
            )}
          </div>

          <div className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-20"><RightPanel /></div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200/60 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            <a href="/discover" className="hover:text-purple-500 no-underline">关于我们</a>
            <span>·</span>
            <a href="/discover" className="hover:text-purple-500 no-underline">用户协议</a>
            <span>·</span>
            <a href="/discover" className="hover:text-purple-500 no-underline">隐私政策</a>
            <span>·</span>
            <a href="/discover" className="hover:text-purple-500 no-underline">帮助中心</a>
            <span>·</span>
            <span>© 2026 嘿洞星球</span>
          </div>
        </div>
      </footer>
      </div>{/* end relative z-10 */}
    </div>
  )
}
