'use client'
import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import IdeaCard from '@/components/IdeaCard'
import FolderPickerModal from '@/components/FolderPickerModal'
import { useStore } from '@/lib/store'

export default function ProfilePage() {
  const [tab, setTab] = useState<'ideas' | 'favorites' | 'comments'>('ideas')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [manageIdeaId, setManageIdeaId] = useState<string | null>(null)
  const [batchMode, setBatchMode] = useState(false)
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<Set<string>>(new Set())
  const [showBatchMove, setShowBatchMove] = useState(false)
  const [showBatchUnfav, setShowBatchUnfav] = useState(false)
  const [menuIdeaId, setMenuIdeaId] = useState<string | null>(null) // 单个卡片三点菜单
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const currentUser = useStore((s) => s.currentUser)
  const ideas = useStore((s) => s.ideas)
  const comments = useStore((s) => s.comments)
  const collectionFolders = useStore((s) => s.collectionFolders)
  const addFolder = useStore((s) => s.addFolder)
  const renameFolder = useStore((s) => s.renameFolder)
  const deleteFolder = useStore((s) => s.deleteFolder)
  const getFolderIdeas = useStore((s) => s.getFolderIdeas)
  const removeIdeaFromFolder = useStore((s) => s.removeIdeaFromFolder)
  const addIdeaToFolder = useStore((s) => s.addIdeaToFolder)

  const myIdeas = useMemo(() => ideas.filter(i => i.author?.id === 'u_me'), [ideas])
  const myFavorites = useMemo(() => ideas.filter(i => i.favoritedByMe), [ideas])
  const myComments = useMemo(() => comments.filter(c => c.author.id === 'u_me'), [comments])

  const selectedFolder = selectedFolderId ? collectionFolders.find(f => f.id === selectedFolderId) : null
  const folderIdeas = selectedFolderId ? getFolderIdeas(selectedFolderId) : myFavorites

  const tabs = [
    { key: 'ideas' as const, label: '我的脑洞', icon: '📝', count: myIdeas.length },
    { key: 'favorites' as const, label: '我的收藏', icon: '⭐', count: myFavorites.length },
    { key: 'comments' as const, label: '我的评论', icon: '💬', count: myComments.length },
  ]

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    addFolder(newFolderName.trim())
    setNewFolderName('')
    setShowCreateFolder(false)
  }

  const handleRename = (folderId: string) => {
    if (renameValue.trim()) renameFolder(folderId, renameValue.trim())
    setRenamingFolder(null)
  }

  const enterBatchMode = () => {
    setBatchMode(true)
    setSelectedIdeaIds(new Set())
  }

  const exitBatchMode = () => {
    setBatchMode(false)
    setSelectedIdeaIds(new Set())
  }

  const toggleSelect = (ideaId: string) => {
    const next = new Set(selectedIdeaIds)
    if (next.has(ideaId)) next.delete(ideaId)
    else next.add(ideaId)
    setSelectedIdeaIds(next)
  }

  // 批量取消收藏
  const batchUnfavorite = () => {
    if (!selectedFolderId) return
    selectedIdeaIds.forEach(id => removeIdeaFromFolder(selectedFolderId, id))
    setBatchMode(false)
    setSelectedIdeaIds(new Set())
    setShowBatchUnfav(false)
  }

  // 单卡片取消收藏
  const singleUnfavorite = (ideaId: string) => {
    if (selectedFolderId) removeIdeaFromFolder(selectedFolderId, ideaId)
    setMenuIdeaId(null)
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 个人信息卡片 */}
        <div className="card p-6 mb-6 animate-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-2xl shadow-sm">{currentUser?.avatar}</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{currentUser?.nickname}</h1>
              <p className="text-sm text-gray-400 mt-0.5">一个热爱脑洞的人</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all">编辑资料</button>
          </div>
          <div className="flex gap-8 mt-5 pt-5 border-t border-gray-100">
            <div className="text-center"><p className="text-xl font-bold text-indigo-600">{myIdeas.length}</p><p className="text-xs text-gray-400 mt-0.5">发布的脑洞</p></div>
            <div className="text-center"><p className="text-xl font-bold text-yellow-600">{myFavorites.length}</p><p className="text-xs text-gray-400 mt-0.5">收藏的脑洞</p></div>
            <div className="text-center"><p className="text-xl font-bold text-green-600">{myComments.length}</p><p className="text-xs text-gray-400 mt-0.5">评论数</p></div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSelectedFolderId(t.key === 'favorites' ? 'fav_default' : null); exitBatchMode() }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
              {t.icon} {t.label} <span className={`text-xs ${tab === t.key ? 'text-indigo-200' : 'text-gray-400'}`}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* 收藏分组管理 */}
        {tab === 'favorites' && (
          <div className="flex gap-5">
            {/* 左侧分组列表 */}
            <div className="w-56 shrink-0">
              <div className="card p-3 sticky top-20">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">收藏分组</h3>
                  <button onClick={() => setShowCreateFolder(!showCreateFolder)} className="text-gray-400 hover:text-indigo-500 transition-all p-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                {showCreateFolder && (
                  <div className="flex gap-2 mb-2 px-2">
                    <input type="text" placeholder="分组名称" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder() }} className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/30" autoFocus />
                    <button onClick={handleCreateFolder} className="btn-primary px-2.5 py-1.5 text-xs">创建</button>
                  </div>
                )}
                <div className="space-y-0.5">
                  {collectionFolders.map(folder => (
                    <div key={folder.id} className={`group rounded-xl transition-all ${selectedFolderId === folder.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                      {renamingFolder === folder.id ? (
                        <div className="flex gap-1 p-2">
                          <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleRename(folder.id); if (e.key === 'Escape') setRenamingFolder(null) }} onBlur={() => handleRename(folder.id)} className="flex-1 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs focus:outline-none" autoFocus />
                        </div>
                      ) : (
                        <button onClick={() => { setSelectedFolderId(selectedFolderId === folder.id ? null : folder.id); exitBatchMode() }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left">
                          <span className="text-base">{folder.icon || '📁'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${selectedFolderId === folder.id ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>{folder.name}</p>
                            <p className="text-[10px] text-gray-400">{folder.ideaIds.length} 个脑洞</p>
                          </div>
                          {folder.isDefault ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded-full shrink-0">默认</span>
                          ) : (
                            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                              <button onClick={e => { e.stopPropagation(); setRenamingFolder(folder.id); setRenameValue(folder.name) }} className="p-1 text-gray-400 hover:text-indigo-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                              <button onClick={e => { e.stopPropagation(); setShowDeleteConfirm(folder.id) }} className="p-1 text-gray-400 hover:text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧列表 */}
            <div className="flex-1 min-w-0">
              {selectedFolder && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">{selectedFolder.icon} {selectedFolder.name} <span className="text-sm font-normal text-gray-400">({selectedFolder.ideaIds.length})</span></h2>

                  {/* 批量管理操作栏 */}
                  {batchMode ? (
                    <div className="flex items-center gap-2">
                      <button onClick={exitBatchMode} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                        清除
                      </button>
                      {selectedIdeaIds.size > 0 && (
                        <>
                          <button onClick={() => setShowBatchUnfav(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                            取消收藏 ({selectedIdeaIds.size})
                          </button>
                          <button onClick={() => setShowBatchMove(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                            移动至 ({selectedIdeaIds.size})
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <button onClick={enterBatchMode} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                      批量管理
                    </button>
                  )}
                </div>
              )}

              {folderIdeas.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 animate-in">
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-500 font-medium">这个分组还是空的</p>
                  <p className="text-sm text-gray-400 mt-1">去发现有趣的脑洞收藏起来吧</p>
                  <a href="/" className="inline-block mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium">去发现脑洞 →</a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folderIdeas.map((idea, i) => (
                    <div key={idea.id} className="relative group">
                      {/* 批量模式 - 复选框 */}
                      {batchMode && (
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            checked={selectedIdeaIds.has(idea.id)}
                            onChange={() => toggleSelect(idea.id)}
                            className="w-5 h-5 rounded-md border-2 border-gray-300 checked:border-indigo-500 checked:bg-indigo-500 cursor-pointer accent-indigo-600"
                          />
                        </div>
                      )}

                      {/* 非批量模式 - 卡片右下角三点菜单 */}
                      {!batchMode && (
                        <div className="absolute bottom-3 right-3 z-10">
                          <button
                            onClick={() => setMenuIdeaId(menuIdeaId === idea.id ? null : idea.id)}
                            className="w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 shadow-sm"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                          </button>
                          {/* 下拉菜单 */}
                          {menuIdeaId === idea.id && (
                            <div className="absolute bottom-9 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-36 z-20 animate-in">
                              <button onClick={() => { singleUnfavorite(idea.id) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                取消收藏
                              </button>
                              <button onClick={() => { setManageIdeaId(idea.id); setMenuIdeaId(null) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
                                移动至
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <IdeaCard idea={idea} index={i} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 其他 Tab */}
        {tab === 'ideas' && (myIdeas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200"><div className="text-4xl mb-3">📝</div><p className="text-gray-500">还没有发布过脑洞</p><a href="/publish" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block text-sm font-medium">去发一个 →</a></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{myIdeas.map((idea, i) => <IdeaCard key={idea.id} idea={idea} index={i} />)}</div>
        ))}

        {tab === 'comments' && (myComments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200"><div className="text-4xl mb-3">💬</div><p className="text-gray-500">还没有发表过评论</p></div>
        ) : (
          <div className="space-y-3">{myComments.map(c => (
            <div key={c.id} className="card p-4 animate-in"><p className="text-sm text-gray-700 mb-2 leading-relaxed">{c.content}</p><div className="flex items-center gap-3 text-xs text-gray-400"><span>❤️ {c.likes}</span><span>·</span><span>{new Date(c.createdAt).toLocaleDateString('zh-CN')}</span></div></div>
          ))}</div>
        ))}
      </main>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white rounded-2xl shadow-xl p-5 w-72 animate-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4"><div className="text-3xl mb-2">🗑️</div><h3 className="text-base font-bold text-gray-800">删除分组</h3><p className="text-sm text-gray-500 mt-1">分组内的脑洞将会移回「默认收藏」</p></div>
            <div className="flex gap-2">
              <button onClick={() => { deleteFolder(showDeleteConfirm); setShowDeleteConfirm(null); setSelectedFolderId(null) }} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">确认删除</button>
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 单个脑洞 - 移动至 */}
      {manageIdeaId && (
        <FolderPickerModal ideaId={manageIdeaId} isOpen={!!manageIdeaId} onClose={() => setManageIdeaId(null)} />
      )}

      {/* 批量取消收藏确认 */}
      {showBatchUnfav && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBatchUnfav(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white rounded-2xl shadow-xl p-5 w-72 animate-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4"><div className="text-3xl mb-2">🗑️</div><h3 className="text-base font-bold text-gray-800">取消收藏</h3><p className="text-sm text-gray-500 mt-1">将从当前分组移除 {selectedIdeaIds.size} 个脑洞</p></div>
            <div className="flex gap-2">
              <button onClick={batchUnfavorite} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">确认</button>
              <button onClick={() => setShowBatchUnfav(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 批量移动弹窗 */}
      {showBatchMove && selectedFolderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBatchMove(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-80 animate-in" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-gray-800">移动至</h3>
                <button onClick={() => setShowBatchMove(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
              </div>
              <p className="text-xs text-gray-400">已选择 {selectedIdeaIds.size} 个脑洞</p>
            </div>
            <div className="p-2 max-h-52 overflow-y-auto">
              {collectionFolders.filter(f => f.id !== selectedFolderId).map(folder => (
                <button key={folder.id} onClick={() => {
                  selectedIdeaIds.forEach(id => {
                    if (collectionFolders.find(f => f.id === selectedFolderId)?.ideaIds.includes(id)) {
                      removeIdeaFromFolder(selectedFolderId, id)
                    }
                    addIdeaToFolder(folder.id, id)
                  })
                  setShowBatchMove(false); exitBatchMode()
                }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-left">
                  <span className="text-base">{folder.icon}</span>
                  <div><p className="text-sm font-medium text-gray-700">{folder.name}</p><p className="text-[11px] text-gray-400">{folder.ideaIds.length} 个脑洞</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
