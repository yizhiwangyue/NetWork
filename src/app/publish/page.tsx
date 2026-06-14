'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useStore } from '@/lib/store'
import { CATEGORIES, HOT_TAGS } from '@/lib/seed'
import Link from 'next/link'

export default function PublishPage() {
  const router = useRouter()
  const addIdea = useStore((s) => s.addIdea)
  const addIdeaToIdeaFolder = useStore((s) => s.addIdeaToIdeaFolder)
  const currentUser = useStore((s) => s.currentUser)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [highlight, setHighlight] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddTag = (tag: string) => { const t = tag.replace(/^#/, '').trim(); if (t && tags.length < 6 && !tags.includes(t)) setTags([...tags, t]); setTagInput('') }
  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) return
    const ideaId = `i_new_${Date.now()}`
    addIdea({ id: ideaId, title: title.trim(), content: content.trim(), highlight: highlight.trim(), images, author: isAnonymous ? null : currentUser, isAnonymous, isPublic, category, tags, likes: 0, comments: 0, favorites: 0, createdAt: new Date().toISOString(), likedByMe: false, favoritedByMe: false, isBounty: false })
    // 加入默认创作分组
    addIdeaToIdeaFolder('idea_default', ideaId)
    setSubmitted(true)
    setTimeout(() => router.push('/discover'), 1500)
  }

  if (submitted) return (
    <div className="min-h-screen bg-slate-50"><Header /><div className="max-w-lg mx-auto px-4 py-20 text-center"><div className="text-6xl mb-4">🎉</div><h2 className="text-xl font-bold text-slate-800 mb-2">脑洞发布成功！</h2><p className="text-slate-500 mb-6">你的奇思妙想已经被宇宙接收了</p><Link href="/discover" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors no-underline font-medium">返回首页</Link></div></div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-1">💡 发布你的洞核</h1>
          <p className="text-sm text-slate-400 mb-6">30 秒就能发布一个奇思妙想</p>
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">标题 <span className="text-red-400">*</span></label><input type="text" placeholder="用一句话抓住所有人的注意力..." value={title} onChange={e => setTitle(e.target.value.slice(0, 60))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" /><div className="text-xs text-slate-400 mt-1 text-right">{title.length}/60</div></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">详细描述 <span className="text-red-400">*</span></label><textarea placeholder="展开说说你的洞核吧..." value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">一句话亮点 <span className="text-slate-400 font-normal">（可选）</span></label><input type="text" placeholder="例：再也不用偷偷在桌子底下找翻页笔了" value={highlight} onChange={e => setHighlight(e.target.value.slice(0, 50))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">主题分类 <span className="text-red-400">*</span></label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"><option value="">选择分类...</option>{CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.icon} {cat.label}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">添加标签 <span className="text-slate-400 font-normal">（最多 6 个）</span></label>
              <div className="flex flex-wrap gap-2 mb-2">{tags.map(tag => <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">#{tag}<button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">✕</button></span>)}</div>
              {tags.length < 6 && <input type="text" placeholder="输入标签，回车添加" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput) } }} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-2" />}
              <div className="flex flex-wrap gap-1.5">{HOT_TAGS.slice(0, 8).map(tag => <button key={tag} type="button" onClick={() => handleAddTag(tag)} disabled={tags.includes(tag) || tags.length >= 6} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed">+ #{tag}</button>)}</div>
            </div>

            {/* 图片 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">配图 <span className="text-slate-400 font-normal">（可选，最多 6 张）</span></label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => {
                  const files = Array.from(e.target.files || [])
                  const remaining = 6 - images.length
                  files.slice(0, remaining).forEach(file => {
                    if (file.size > 5 * 1024 * 1024) return // 5MB 限制
                    const reader = new FileReader()
                    reader.onload = () => {
                      if (reader.result) setImages(prev => [...prev, reader.result as string])
                    }
                    reader.readAsDataURL(file)
                  })
                  e.target.value = ''
                }} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={images.length >= 6}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                点击选择图片
              </button>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {images.map((dataUrl, i) => (
                    <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-gray-50">
                      <img src={dataUrl} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 公开/私密开关 */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div><span className="text-sm font-medium text-slate-700">公开洞核</span><p className="text-xs text-slate-400">关闭后仅你自己可见</p></div>
              <button onClick={() => setIsPublic(!isPublic)} className={`relative w-11 h-6 rounded-full transition-colors ${isPublic ? 'bg-indigo-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isPublic ? 'translate-x-5' : ''}`} /></button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div><span className="text-sm font-medium text-slate-700">匿名发布</span><p className="text-xs text-slate-400">开启后你的昵称将不会显示</p></div>
              <button onClick={() => setIsAnonymous(!isAnonymous)} className={`relative w-11 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isAnonymous ? 'translate-x-5' : ''}`} /></button>
            </div>
            <button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || !category} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">✨ 发布洞核</button>
          </div>
        </div>
      </main>
    </div>
  )
}
