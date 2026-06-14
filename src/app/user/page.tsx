'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import IdeaCard from '@/components/IdeaCard'
import { useStore } from '@/lib/store'
import { useMemo } from 'react'

function UserContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  const ideas = useStore((s) => s.ideas)
  const comments = useStore((s) => s.comments)
  const currentUser = useStore((s) => s.currentUser)
  const followedUserIds = useStore((s) => s.followedUserIds)
  const toggleFollow = useStore((s) => s.toggleFollow)

  // 从所有 seed user 中查找目标用户
  const user = useMemo(() => {
    if (userId === currentUser?.id) return currentUser
    // 遍历所有脑洞的作者
    for (const idea of ideas) {
      if (idea.author?.id === userId) return idea.author
    }
    return null
  }, [ideas, currentUser, userId])

  const userIdeas = useMemo(() => ideas.filter(i => !i.isAnonymous && i.author?.id === userId), [ideas, userId])
  const userComments = useMemo(() => comments.filter(c => c.author.id === userId), [comments, userId])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f7]">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 font-medium">用户不存在</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 mb-6 animate-in">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-3xl shadow-sm">{user.avatar}</span>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800">{user.nickname}</h1>
              {user.bio && <p className="text-sm text-gray-400 mt-1 break-words">{user.bio}</p>}
            </div>
            {user.id !== currentUser?.id && (
              <button onClick={() => toggleFollow(user.id)}
                className={`shrink-0 px-5 py-2 rounded-xl text-sm font-medium transition-all ${followedUserIds.includes(user.id) ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                {followedUserIds.includes(user.id) ? '已关注' : '＋ 关注'}
              </button>
            )}
          </div>
          <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xl font-bold text-indigo-600">{userIdeas.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">洞核</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-yellow-600">{userComments.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">评论</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{followedUserIds.filter(id => id !== currentUser?.id).length}</p>
              <p className="text-xs text-gray-400 mt-0.5">关注</p>
            </div>
          </div>
        </div>

        {/* 洞核列表 */}
        <h2 className="text-base font-bold text-gray-800 mb-4">📝 发布的洞核</h2>
        {userIdeas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/80">
            <p className="text-gray-400 text-sm">还没有发布过洞核</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {userIdeas.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} />
            ))}
          </div>
        )}

        {/* 评论列表 */}
        <h2 className="text-base font-bold text-gray-800 mb-4">💬 评论</h2>
        {userComments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/80">
            <p className="text-gray-400 text-sm">还没有发表过评论</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {userComments.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200/80 p-4 animate-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function UserPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center"><div className="text-4xl mb-4">🔍</div><p className="text-gray-500">加载中...</p></div>
      </div>
    }>
      <UserContent />
    </Suspense>
  )
}
