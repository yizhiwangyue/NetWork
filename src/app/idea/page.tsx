'use client'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import FolderPickerModal from '@/components/FolderPickerModal'
import { useStore } from '@/lib/store'
import { timeAgo, getCategoryLabel } from '@/lib/seed'
import { linkify } from '@/lib/linkify'
import UserLink from '@/components/UserLink'
import Link from 'next/link'

function FollowButton({ userId }: { userId: string }) {
  const followedUserIds = useStore((s) => s.followedUserIds)
  const toggleFollow = useStore((s) => s.toggleFollow)
  const isFollowed = followedUserIds.includes(userId)
  return (
    <button onClick={e => { e.stopPropagation(); toggleFollow(userId) }}
      className={`ml-auto shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${isFollowed ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
      {isFollowed ? '已关注' : '＋ 关注'}
    </button>
  )
}

const CARD_COLORS = ['from-indigo-100 to-blue-200','from-purple-100 to-pink-200','from-green-100 to-teal-200','from-orange-100 to-yellow-200','from-cyan-100 to-sky-200']

function IdeaDetailContent() {
  const searchParams = useSearchParams()
  const ideaId = searchParams.get('id')
  const router = useRouter()
  const ideas = useStore((s) => s.ideas)
  const allComments = useStore((s) => s.comments)
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const toggleLike = useStore((s) => s.toggleLike)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const currentUser = useStore((s) => s.currentUser)
  const followedUserIds = useStore((s) => s.followedUserIds)
  const toggleFollow = useStore((s) => s.toggleFollow)
  const addComment = useStore((s) => s.addComment)

  const [newComment, setNewComment] = useState('')

  const idea = ideas.find((i) => i.id === ideaId)

  // 切换脑洞时重置轮播索引
  useEffect(() => { setImgIndex(0) }, [ideaId])

  // Escape 键关闭灯箱 + 禁止背景滚动
  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxImg(null) }
    window.addEventListener('keydown', escHandler)
    // 禁止/恢复 body 滚动
    if (lightboxImg) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', escHandler)
      document.body.style.overflow = ''
    }
  }, [lightboxImg])
  const comments = useMemo(() => allComments.filter(c => c.ideaId === ideaId), [allComments, ideaId])

  const related = useMemo(() =>
    ideas.filter(i => i.id !== ideaId && (i.category === idea?.category || i.tags.some(t => idea?.tags.includes(t)))).slice(0, 4),
    [ideas, ideaId, idea]
  )

  const handleComment = () => {
    if (!newComment.trim()) return
    addComment({
      id: `c_${Date.now()}`,
      ideaId: ideaId || '',
      author: currentUser || { id: 'u_me', nickname: '我', avatar: '😎' },
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    })
    setNewComment('')
  }

  if (!idea) return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">洞核不存在</h2>
        <p className="text-slate-500 mb-6">这个洞核可能已经被删除了</p>
        <Link href="/discover" className="btn-primary px-6 py-3 no-underline">返回首页</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧：主要内容 */}
          <div className="flex-1 min-w-0">
            {/* 导航路径 */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 animate-in">
              <Link href="/discover" className="hover:text-indigo-600 no-underline text-gray-400">首页</Link>
              <span>/</span>
              <span className="text-indigo-500">{getCategoryLabel(idea.category)}</span>
            </div>

            {/* 主卡片 */}
            <div className="card p-6 mb-5 animate-in">
              {/* 标签行 */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">{getCategoryLabel(idea.category)}</span>
                {idea.tags.map(tag => <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-[11px]">#{tag}</span>)}
                {!idea.isPublic && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[11px]">🔒 私密</span>}
              </div>

              {/* 标题 */}
              <h1 className="text-2xl font-extrabold text-gray-800 mb-4 leading-snug">{idea.title}</h1>

              {/* 一句话亮点 */}
              {idea.highlight && (
                <div className="px-4 py-3 bg-indigo-50/50 rounded-xl border-l-2 border-indigo-400 mb-5">
                  <p className="text-sm text-indigo-600 italic">「{idea.highlight}」</p>
                </div>
              )}

              {/* 正文 */}
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-5 text-[15px] break-words">
                {linkify(idea.content)}
              </div>

              {/* 图片展示 - 轮播 */}
              {idea.images && idea.images.length > 0 && (
                <div className="mb-5">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200/80 bg-gray-100">
                    {/* 主图 */}
                    <button onClick={() => { setLightboxImg(idea.images[imgIndex]); setZoom(1); setOffset({ x: 0, y: 0 }) }} className="w-full flex items-center justify-center min-h-[200px] max-h-[400px] cursor-pointer focus:outline-none">
                      <img
                        key={imgIndex}
                        src={idea.images[imgIndex]}
                        alt=""
                        className="max-h-[400px] w-full object-contain animate-in"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </button>
                    {/* 左箭头 */}
                    {idea.images.length > 1 && (
                      <>
                        <button onClick={() => setImgIndex(i => (i - 1 + idea.images.length) % idea.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-indigo-600 transition-all">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        {/* 右箭头 */}
                        <button onClick={() => setImgIndex(i => (i + 1) % idea.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-indigo-600 transition-all">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                        {/* 页码 */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          {idea.images.map((_, i) => (
                            <button key={i} onClick={() => setImgIndex(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/70'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {/* 图片计数 */}
                  {idea.images.length > 1 && (
                    <p className="text-xs text-gray-400 text-center mt-2">{imgIndex + 1} / {idea.images.length}</p>
                  )}
                </div>
              )}

              {/* 元信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <UserLink user={idea.author} isAnonymous={idea.isAnonymous}>
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-lg cursor-pointer">{idea.isAnonymous ? '👤' : idea.author?.avatar}</span>
                  </UserLink>
                  <div>
                    <UserLink user={idea.author} isAnonymous={idea.isAnonymous}>
                      <p className="text-sm font-bold text-gray-700 cursor-pointer hover:text-indigo-600">{idea.isAnonymous ? '匿名用户' : idea.author?.nickname}</p>
                    </UserLink>
                    <p className="text-[11px] text-gray-400">{timeAgo(idea.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => toggleLike(idea.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${idea.likedByMe ? 'bg-red-50 text-red-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={idea.likedByMe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {idea.likes}
                  </button>
                  <button onClick={() => setShowFolderPicker(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${idea.favoritedByMe ? 'bg-yellow-50 text-yellow-500' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={idea.favoritedByMe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {idea.favorites}
                  </button>
                </div>
              </div>
            </div>

            {/* 评论区域 */}
            <div className="card p-5 mb-5 animate-in-d3">
              <h3 className="text-base font-bold text-gray-800 mb-4">💬 评论 ({comments.length})</h3>

              {/* 评论输入 */}
              <div className="flex gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-sm shrink-0">{currentUser?.avatar}</span>
                <div className="flex-1">
                  <textarea placeholder="写下你的想法..." value={newComment} onChange={e => setNewComment(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 resize-none" />
                  <div className="flex justify-end mt-2">
                    <button onClick={handleComment} disabled={!newComment.trim()} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">发布评论</button>
                  </div>
                </div>
              </div>

              {/* 评论列表 */}
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">还没有评论，来说点什么吧～</div>
              ) : (
                <div className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <UserLink user={c.author} isAnonymous={false}>
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-sm shrink-0 cursor-pointer">{c.author.avatar}</span>
                      </UserLink>
                      <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <UserLink user={c.author} isAnonymous={false}>
                            <span className="text-sm font-bold text-gray-700 cursor-pointer hover:text-indigo-600">{c.author.nickname}</span>
                          </UserLink>
                          <span className="text-[11px] text-gray-400">{new Date(c.createdAt).toLocaleString('zh-CN')}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed break-words">{linkify(c.content)}</p>
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
                <div className="flex items-start gap-3 mb-3">
                  <UserLink user={idea.author} isAnonymous={idea.isAnonymous}>
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-xl cursor-pointer">
                      {idea.isAnonymous ? '👤' : idea.author?.avatar}
                    </span>
                  </UserLink>
                  <div>
                    <UserLink user={idea.author} isAnonymous={idea.isAnonymous}>
                      <p className="text-sm font-bold text-gray-800 cursor-pointer hover:text-indigo-600">{idea.isAnonymous ? '匿名用户' : idea.author?.nickname}</p>
                    </UserLink>
                  </div>
                  {!idea.isAnonymous && idea.author && idea.author.id !== currentUser?.id && (
                    <FollowButton userId={idea.author.id} />
                  )}
                </div>
                <div className="flex gap-3 text-center pt-3 border-t border-gray-100">
                  <div className="flex-1"><p className="text-sm font-bold text-indigo-600">{idea.likes}</p><p className="text-[10px] text-gray-400">获赞</p></div>
                  <div className="flex-1"><p className="text-sm font-bold text-indigo-600">{idea.comments}</p><p className="text-[10px] text-gray-400">评论</p></div>
                  <div className="flex-1"><p className="text-sm font-bold text-indigo-600">{idea.favorites}</p><p className="text-[10px] text-gray-400">收藏</p></div>
                </div>
              </div>

              {/* 相关洞核 */}
              {related.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">📌 相关推荐</h3>
                  <div className="space-y-2.5">
                    {related.map(r => (
                      <a key={r.id} href={`/idea?id=${r.id}`} className="block px-3 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-all no-underline group">
                        <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-relaxed group-hover:text-indigo-600">{r.title}</p>
                        <p className="text-[11px] text-gray-400 mt-1">❤️ {r.likes} · {timeAgo(r.createdAt)}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <FolderPickerModal ideaId={ideaId || ''} isOpen={showFolderPicker} onClose={() => setShowFolderPicker(false)} />

      {/* 灯箱 */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-in overflow-hidden"
          onWheel={e => { e.preventDefault(); setZoom(z => Math.max(0.8, Math.min(3.2, z + (e.deltaY > 0 ? -0.2 : 0.2)))); setOffset({ x: 0, y: 0 }) }}>
          {/* X 关闭按钮 - 固定位置，不受缩放影响 */}
          <button onClick={() => { setLightboxImg(null); setZoom(1); setOffset({ x: 0, y: 0 }) }}
            className="fixed top-4 right-4 z-[101] w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-800 transition-all text-lg">
            ✕
          </button>
          {/* 缩放提示 */}
          {zoom !== 1 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[101] px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
              {Math.round(zoom * 100)}%
            </div>
          )}
          {/* 可拖拽区域 */}
          <div className="w-full h-full flex items-center justify-center select-none"
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
            onMouseDown={e => {
              if (zoom <= 1) return
              const startX = e.clientX
              const startY = e.clientY
              const startOffset = { ...offset }
              const onMove = (me: MouseEvent) => {
                me.preventDefault()
                setOffset({
                  x: startOffset.x + (me.clientX - startX),
                  y: startOffset.y + (me.clientY - startY),
                })
              }
              document.addEventListener('mousemove', onMove)
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMove)
              }, { once: true })
            }}
            onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} alt="" className="rounded-2xl shadow-2xl duration-75 ease-out select-none pointer-events-none"
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function IdeaDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center"><div className="text-4xl mb-4">💡</div><p className="text-gray-500">加载中...</p></div>
      </div>
    }>
      <IdeaDetailContent />
    </Suspense>
  )
}
