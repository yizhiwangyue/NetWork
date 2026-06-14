'use client'
import { useStore } from '@/lib/store'
import { HOT_TAGS } from '@/lib/seed'
import { timeAgo } from '@/lib/seed'

export default function RightPanel() {
  const ideas = useStore((s) => s.ideas)
  const setTag = useStore((s) => s.setTag)
  const setCategory = useStore((s) => s.setCategory)

  // 热门脑洞
  const hotIdeas = [...ideas].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments)).slice(0, 5)

  return (
    <aside className="space-y-4">
      {/* 脑洞日报 - 仿设计图卡片 */}
      <div className="card p-5 overflow-hidden relative">
        {/* 装饰背景 */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full opacity-50" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-indigo-50 to-indigo-100 rounded-full opacity-40" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">嘿洞日报</h3>
              <p className="text-[11px] text-gray-400">今日精选洞核</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {hotIdeas.slice(0, 3).map((idea, i) => (
              <a
                key={idea.id}
                href={`/idea?id=${idea.id}`}
                className="block px-3 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-all no-underline"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xs font-bold text-indigo-400 mt-0.5 shrink-0">#{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-relaxed">{idea.title}</p>
                    <p className="text-[11px] text-gray-400 mt-1">❤️ {idea.likes} · {timeAgo(idea.createdAt)}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <button className="w-full mt-3 py-2 text-xs text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all font-medium">
            查看更多 →
          </button>
        </div>
      </div>

      {/* 热门标签 */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">🏷️ 热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {HOT_TAGS.slice(0, 10).map(tag => (
            <button
              key={tag}
              onClick={() => setTag(tag)}
              className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 本周精选 */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">🌟 编辑精选</h3>
        <div className="space-y-3">
          {ideas.filter(i => i.isBounty).slice(0, 2).map(idea => (
            <a key={idea.id} href={`/idea?id=${idea.id}`} className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <span className="text-lg">🏆</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 transition-colors line-clamp-1">{idea.title}</p>
                <span className="text-[11px] text-orange-500">悬赏中</span>
              </div>
            </a>
          ))}
          <a href="/discover" className="block text-center text-xs text-indigo-500 hover:text-indigo-700 pt-1 font-medium no-underline">
            浏览全部精选 →
          </a>
        </div>
      </div>

      {/* 公告 */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">📢</span>
          <span className="text-xs font-medium text-gray-500">公告</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          嘿洞星球 v2.0 即将上线！新增图片上传、二级评论等功能，敬请期待。
        </p>
      </div>
    </aside>
  )
}
