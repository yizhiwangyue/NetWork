'use client'
import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import FolderPickerModal from '@/components/FolderPickerModal'
import { useStore } from '@/lib/store'
import { timeAgo, getCategoryLabel } from '@/lib/seed'
import Link from 'next/link'

const CARD_COLORS = ['from-indigo-100 to-blue-200','from-purple-100 to-pink-200','from-green-100 to-teal-200','from-orange-100 to-yellow-200','from-cyan-100 to-sky-200']

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ideas = useStore((s) => s.ideas)
  const allComments = useStore((s) => s.comments)
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const toggleLike = useStore((s) => s.toggleLike)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const addComment = useStore((s) => s.addComment)
  const currentUser = useStore((s) => s.currentUser)
  const deleteIdea = useStore((s) => s.deleteIdea)
  const setCategory = useStore((s) => s.setCategory)
  const setTag = useStore((s) => s.setTag)

  const idea = ideas.find((i) => i.id === params.id)
  const comments = useMemo(() => (idea ? allComments.filter(c => c.ideaId === idea.id) : []), [allComments, idea?.id])
  const [commentText, setCommentText] = useState('')
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const related = idea ? ideas.filter(i => i.id !== idea.id && i.tags.some(t => idea.tags.includes(t))).slice(0, 4) : []
  const colorIdx = idea ? idea.tags.length % CARD_COLORS.length : 0

  if (!idea) return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">脑洞不存在</h2>
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 no-underline font-medium">返回首页</Link>
      </div>
    </div>
  )

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleDelete = () => { deleteIdea(idea.id); router.push('/') }
  const handleComment = () => {
    if (!commentText.trim()) return
    addComment({ id: `c_new_${Date.now()}`, ideaId: idea.id, author: currentUser!, content: commentText.trim(), createdAt: new Date().toISOString(), likes: 0 })
    setCommentText('')
  }

  const colorClass = CARD_COLORS[colorIdx]

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧：主体内容 */}
          <div className="flex-1 min-w-0">
            <div className="card overflow-hidden animate-in">
              {/* 配图区 - 仿设计图左右分栏的右侧配图 */}
              <div className={`h-48 bg-gradient-to-br ${colorClass} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/20 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/15 rounded-full" />
                <div className="text-center">
                  <span className="text-5xl opacity-60 block mb-2">
                    {idea.category === 'tech' ? '🚀' : idea.category === 'life' ? '🏠' : idea.category === 'work' ? '💼' : idea.category === 'society' ? '🌍' : idea.category === 'entertain' ? '🎬' : idea.category === 'fantasy' ? '🌌' : '🏆'}
                  </span>
                  <span className="text-xs text-white/60 font-medium px-3 py-1 bg-white/20 rounded-full">
                    {getCategoryLabel(idea.category)} · 脑洞分享
                  </span>
                </div>
                {idea.isBounty && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                    🏆 悬赏中
                  </div>
                )}
              </div>

              {/* 内容区 */}
              <div className="p-6">
                {/* 元信息 */}
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs">
                      {idea.isAnonymous ? '👤' : idea.author?.avatar}
                    </span>
                    {idea.isAnonymous ? '匿名用户' : idea.author?.nickname}
                  </span>
                  <span>·</span>
                  <span>{new Date(idea.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>·</span>
                  <button onClick={() => setCategory(idea.category)} className="text-indigo-500 hover:text-indigo-700 font-medium">
                    {getCategoryLabel(idea.category)}
                  </button>
                </div>

                {/* 标题 */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">{idea.title}</h1>

                {/* 亮点 */}
                {idea.highlight && (
                  <div className="px-4 py-2.5 bg-indigo-50/60 rounded-xl text-sm text-indigo-500 italic mb-5 border-l-3 border-indigo-300">
                    💡 「{idea.highlight}」
                  </div>
                )}

                {/* 正文 */}
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-5 text-[15px]">
                  {idea.content}
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {idea.tags.map(tag => (
                    <button key={tag} onClick={() => setTag(tag)} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* 操作按钮 - 设计图风格 */}
                <div className="flex items-center gap-3 py-4 border-t border-gray-100">
                  <button onClick={() => toggleLike(idea.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${idea.likedByMe ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={idea.likedByMe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    点赞 {idea.likes}
                  </button>
                  <button onClick={() => setShowFolderPicker(true)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${idea.favoritedByMe ? 'bg-yellow-50 text-yellow-500 border border-yellow-200' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-200'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={idea.favoritedByMe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    收藏 {idea.favorites}
                  </button>
                  <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-50 text-gray-500 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    {copied ? '已复制' : '分享'}
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-50 text-gray-400 border border-gray-200 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    举报
                  </button>
                  {(idea.author?.id === 'u_me') && (
                    <div className="relative ml-auto">
                      <button onClick={() => setShowDeleteConfirm(!showDeleteConfirm)} className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-all">删除</button>
                      {showDeleteConfirm && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10 w-44 animate-in">
                          <p className="text-xs text-gray-600 mb-2">确定删除这个脑洞吗？</p>
                          <div className="flex gap-2">
                            <button onClick={handleDelete} className="flex-1 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 font-medium">删除</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">取消</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 评论区 */}
            <div className="card p-6 mt-6 animate-in-d2">
              <h2 className="text-base font-bold text-gray-800 mb-5">
                💬 评论 <span className="text-sm font-normal text-gray-400 ml-1">({comments.length})</span>
              </h2>

              {/* 评论输入 */}
              <div className="flex gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-sm shrink-0">{currentUser?.avatar}</span>
                <div className="flex-1">
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="分享你的想法..." rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 resize-none bg-gray-50" />
                  <div className="flex justify-end mt-2">
                    <button onClick={handleComment} disabled={!commentText.trim()} className="btn-primary px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      发送
                    </button>
                  </div>
                </div>
              </div>

              {/* 评论列表 */}
              {comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm bg-gray-50 rounded-xl">
                  还没有评论，来做第一个吃螃蟹的人吧 🦀
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 animate-in">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm shrink-0">{c.author.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-700">{c.author.nickname}</span>
                          <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            {c.likes}
                          </button>
                          <button className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">回复</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：相关信息 */}
          <div className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* 作者信息 */}
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-xl">
                    {idea.isAnonymous ? '👤' : idea.author?.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{idea.isAnonymous ? '匿名用户' : idea.author?.nickname}</p>
                    {!idea.isAnonymous && idea.author?.bio && <p className="text-xs text-gray-400 mt-0.5">{idea.author.bio}</p>}
                  </div>
                </div>
                <div className="flex gap-3 text-center pt-3 border-t border-gray-100">
                  <div className="flex-1"><p className="text-sm font-bold text-indigo-600">{idea.likes}</p><p className="text-[10px] text-gray-400">获赞</p></div>
                  <div className="flex-1"><p className="text-sm font-bold text-indigo-600">{idea.comments}</p><p className="text-[10px] text-gray-400">评论</p></div>
                  <div className="flex-1"><p className="text-sm font-bold text-indigo-600">{idea.favorites}</p><p className="text-[10px] text-gray-400">收藏</p></div>
                </div>
              </div>

              {/* 相关脑洞 */}
              {related.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">🔗 相关脑洞</h3>
                  <div className="space-y-2.5">
                    {related.map(r => (
                      <a key={r.id} href={`/idea/${r.id}`} className="block px-3 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-all no-underline group">
                        <p className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 line-clamp-2 leading-relaxed">{r.title}</p>
                        <p className="text-[11px] text-gray-400 mt-1">❤️ {r.likes} · 💬 {r.comments}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 返回 */}
              <Link href="/" className="flex items-center justify-center gap-2 card p-3 text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-200 no-underline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 收藏分组弹窗 */}
      {idea && <FolderPickerModal ideaId={idea.id} isOpen={showFolderPicker} onClose={() => setShowFolderPicker(false)} />}
    </div>
  )
}
