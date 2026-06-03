'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useStore } from '@/lib/store'
import { CATEGORIES, HOT_TAGS } from '@/lib/seed'
import Link from 'next/link'

export default function PublishPage() {
  const router = useRouter()
  const addIdea = useStore((s) => s.addIdea)
  const currentUser = useStore((s) => s.currentUser)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [highlight, setHighlight] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleAddTag = (tag: string) => { const t = tag.replace(/^#/, '').trim(); if (t && tags.length < 3 && !tags.includes(t)) setTags([...tags, t]); setTagInput('') }
  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) return
    addIdea({ id: `i_new_${Date.now()}`, title: title.trim(), content: content.trim(), highlight: highlight.trim(), author: isAnonymous ? null : currentUser, isAnonymous, category, tags, likes: 0, comments: 0, favorites: 0, createdAt: new Date().toISOString(), likedByMe: false, favoritedByMe: false, isBounty: false })
    setSubmitted(true)
    setTimeout(() => router.push('/'), 1500)
  }

  if (submitted) return (
    <div className="min-h-screen bg-slate-50"><Header /><div className="max-w-lg mx-auto px-4 py-20 text-center"><div className="text-6xl mb-4">🎉</div><h2 className="text-xl font-bold text-slate-800 mb-2">脑洞发布成功！</h2><p className="text-slate-500 mb-6">你的奇思妙想已经被宇宙接收了</p><Link href="/" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors no-underline font-medium">返回首页</Link></div></div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-1">💡 发布你的脑洞</h1>
          <p className="text-sm text-slate-400 mb-6">30 秒就能发布一个奇思妙想</p>
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">标题 <span className="text-red-400">*</span></label><input type="text" placeholder="用一句话抓住所有人的注意力..." value={title} onChange={e => setTitle(e.target.value.slice(0, 60))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" /><div className="text-xs text-slate-400 mt-1 text-right">{title.length}/60</div></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">详细描述 <span className="text-red-400">*</span></label><textarea placeholder="展开说说你的脑洞吧..." value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">一句话亮点 <span className="text-slate-400 font-normal">（可选）</span></label><input type="text" placeholder="例：再也不用偷偷在桌子底下找翻页笔了" value={highlight} onChange={e => setHighlight(e.target.value.slice(0, 50))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">主题分类 <span className="text-red-400">*</span></label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"><option value="">选择分类...</option>{CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.icon} {cat.label}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">添加标签 <span className="text-slate-400 font-normal">（最多 3 个）</span></label>
              <div className="flex flex-wrap gap-2 mb-2">{tags.map(tag => <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">#{tag}<button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">✕</button></span>)}</div>
              {tags.length < 3 && <input type="text" placeholder="输入标签，回车添加" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput) } }} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-2" />}
              <div className="flex flex-wrap gap-1.5">{HOT_TAGS.slice(0, 8).map(tag => <button key={tag} type="button" onClick={() => handleAddTag(tag)} disabled={tags.includes(tag) || tags.length >= 3} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed">+ #{tag}</button>)}</div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div><span className="text-sm font-medium text-slate-700">匿名发布</span><p className="text-xs text-slate-400">开启后你的昵称将不会显示</p></div>
              <button onClick={() => setIsAnonymous(!isAnonymous)} className={`relative w-11 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isAnonymous ? 'translate-x-5' : ''}`} /></button>
            </div>
            <button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || !category} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">✨ 发布脑洞</button>
          </div>
        </div>
      </main>
    </div>
  )
}
