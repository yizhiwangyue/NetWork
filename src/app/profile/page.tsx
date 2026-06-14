'use client'
import { useState, useMemo, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import IdeaCard from '@/components/IdeaCard'
import FolderPickerModal from '@/components/FolderPickerModal'
import { useStore } from '@/lib/store'
import { linkify } from '@/lib/linkify'
import UserLink from '@/components/UserLink'

function ProfileContent() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'ideas' | 'favorites' | 'follows' | 'comments'>('ideas')

  // 监听 URL 参数 tab，自动切换
  useEffect(() => {
    const t = searchParams.get('tab')
    if (t === 'ideas' || t === 'favorites' || t === 'follows' || t === 'comments') setTab(t)
  }, [searchParams])

  // === 收藏状态 ===
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [manageIdeaId, setManageIdeaId] = useState<string | null>(null)
  const [batchMode, setBatchMode] = useState(false)
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<Set<string>>(new Set())
  const [showBatchMove, setShowBatchMove] = useState(false)
  const [showBatchUnfav, setShowBatchUnfav] = useState(false)
  const [menuIdeaId, setMenuIdeaId] = useState<string | null>(null)
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [favSearch, setFavSearch] = useState('')
  // === 关注状态 ===
  const [followFolderId, setFollowFolderId] = useState<string>('follow_default')
  const [followSearch, setFollowSearch] = useState('')
  const [followMenuUserId, setFollowMenuUserId] = useState<string | null>(null)
  const [showCreateFollowFolder, setShowCreateFollowFolder] = useState(false)
  const [newFollowFolderName, setNewFollowFolderName] = useState('')
  const [renamingFollowFolder, setRenamingFollowFolder] = useState<string | null>(null)
  const [followRenameValue, setFollowRenameValue] = useState('')
  const [showFollowDeleteConfirm, setShowFollowDeleteConfirm] = useState<string | null>(null)
  const [showSetFollowGroup, setShowSetFollowGroup] = useState<string | null>(null)
  const [followBatchMode, setFollowBatchMode] = useState(false)
  const [followSelectedIds, setFollowSelectedIds] = useState<Set<string>>(new Set())
  const followTimer = useRef<ReturnType<typeof setTimeout>>()

  // === 洞核状态 ===
  const [ideaFolderId, setIdeaFolderId] = useState<string | null>('idea_default')
  const [ideaBatchMode, setIdeaBatchMode] = useState(false)
  const [selectedIdeaIds2, setSelectedIdeaIds2] = useState<Set<string>>(new Set())
  const [ideaRenameFolder, setIdeaRenameFolder] = useState<string | null>(null)
  const [ideaRenameValue, setIdeaRenameValue] = useState('')
  const [showCreateIdeaFolder, setShowCreateIdeaFolder] = useState(false)
  const [newIdeaFolderName, setNewIdeaFolderName] = useState('')
  const [showDeleteIdeaFolder, setShowDeleteIdeaFolder] = useState<string | null>(null)
  const [ideaCardMenu, setIdeaCardMenu] = useState<string | null>(null)
  const [ideaSearch, setIdeaSearch] = useState('')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editNickname, setEditNickname] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editAvatar, setEditAvatar] = useState('')

  const currentUser = useStore((s) => s.currentUser)
  const ideas = useStore((s) => s.ideas)
  const comments = useStore((s) => s.comments)
  const collectionFolders = useStore((s) => s.collectionFolders)
  const ideaFolders = useStore((s) => s.ideaFolders)
  const addFolder = useStore((s) => s.addFolder)
  const renameFolder = useStore((s) => s.renameFolder)
  const deleteFolder = useStore((s) => s.deleteFolder)
  const getFolderIdeas = useStore((s) => s.getFolderIdeas)
  const removeIdeaFromFolder = useStore((s) => s.removeIdeaFromFolder)
  const addIdeaToFolder = useStore((s) => s.addIdeaToFolder)
  const toggleIdeaVisibility = useStore((s) => s.toggleIdeaVisibility)
  const updateCurrentUser = useStore((s) => s.updateCurrentUser)

  // 洞核分组方法
  const addIdeaFolder = useStore((s) => s.addIdeaFolder)
  const renameIdeaFolder = useStore((s) => s.renameIdeaFolder)
  const deleteIdeaFolder = useStore((s) => s.deleteIdeaFolder)
  const addIdeaToIdeaFolder = useStore((s) => s.addIdeaToIdeaFolder)
  const removeIdeaFromIdeaFolder = useStore((s) => s.removeIdeaFromIdeaFolder)
  const getIdeaFolderIdeas = useStore((s) => s.getIdeaFolderIdeas)
  const followedUserIds = useStore((s) => s.followedUserIds)
  const toggleFollow = useStore((s) => s.toggleFollow)
  const followFolders = useStore((s) => s.followFolders)
  const addFollowFolder = useStore((s) => s.addFollowFolder)
  const renameFollowFolder = useStore((s) => s.renameFollowFolder)
  const deleteFollowFolder = useStore((s) => s.deleteFollowFolder)
  const addUserToFollowFolder = useStore((s) => s.addUserToFollowFolder)
  const removeUserFromFollowFolder = useStore((s) => s.removeUserFromFollowFolder)
  const getFollowFolderUsers = useStore((s) => s.getFollowFolderUsers)

  const myIdeas = useMemo(() => ideas.filter(i => i.author?.id === 'u_me'), [ideas])
  const myFavorites = useMemo(() => ideas.filter(i => i.favoritedByMe), [ideas])
  const myComments = useMemo(() => comments.filter(c => c.author.id === 'u_me'), [comments])

  // 获取所有关注用户的资料
  const followedUsers = useMemo(() => {
    const userMap = new Map<string, { id: string; nickname: string; avatar: string; bio?: string }>()
    ideas.forEach(i => { if (i.author && followedUserIds.includes(i.author.id)) userMap.set(i.author.id, i.author) })
    // 从 seed 补充缺失的用户信息
    const seedUsers = [
      { id: 'u1', nickname: '创意达人小A', avatar: '🧑‍💻', bio: '每天都在想一些奇怪的东西' },
      { id: 'u2', nickname: '未来观察家', avatar: '🔭', bio: '关注科技前沿的一切可能' },
      { id: 'u3', nickname: '生活魔法师', avatar: '🪄', bio: '把平凡变成不平凡' },
      { id: 'u4', nickname: '脑洞工程师', avatar: '⚡', bio: '构建不可能的世界' },
      { id: 'u5', nickname: '幻想旅行者', avatar: '🚀', bio: '在想象力的宇宙里漫游' },
    ]
    seedUsers.forEach(u => { if (followedUserIds.includes(u.id) && !userMap.has(u.id)) userMap.set(u.id, u) })
    return Array.from(userMap.values())
  }, [ideas, followedUserIds])

  const selectedFolder = selectedFolderId ? collectionFolders.find(f => f.id === selectedFolderId) : null
  const folderIdeas = selectedFolderId ? getFolderIdeas(selectedFolderId) : myFavorites

  const selectedIdeaDir = ideaFolderId ? ideaFolders.find(f => f.id === ideaFolderId) : null
  const ideaDirIdeas = ideaFolderId ? getIdeaFolderIdeas(ideaFolderId) : myIdeas

  // 搜索过滤
  const filteredIdeaDirIdeas = useMemo(() => {
    if (!ideaSearch.trim()) return ideaDirIdeas
    const q = ideaSearch.toLowerCase()
    return ideaDirIdeas.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q)))
  }, [ideaDirIdeas, ideaSearch])

  const filteredFolderIdeas = useMemo(() => {
    if (!favSearch.trim()) return folderIdeas
    const q = favSearch.toLowerCase()
    return folderIdeas.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q)))
  }, [folderIdeas, favSearch])

  // 关注分组
  const selectedFollowFolder = followFolders.find(f => f.id === followFolderId)
  const followFolderUserIds = getFollowFolderUsers(followFolderId)
  const filteredFollowUsers = useMemo(() => {
    let users = followedUsers.filter(u => followFolderUserIds.includes(u.id))
    if (!followSearch.trim()) return users
    const q = followSearch.toLowerCase()
    return users.filter(u => u.nickname.toLowerCase().includes(q) || (u.bio && u.bio.toLowerCase().includes(q)))
  }, [followedUsers, followFolderUserIds, followSearch])

  const tabs = [
    { key: 'ideas' as const, label: '我的洞核', icon: '📝', count: myIdeas.length },
    { key: 'favorites' as const, label: '我的收藏', icon: '⭐', count: myFavorites.length },
    { key: 'follows' as const, label: '我的关注', icon: '👥', count: followedUsers.length },
    { key: 'comments' as const, label: '我的消息', icon: '💬', count: myComments.length },
  ]

  const handleCreateFolder = () => { if (!newFolderName.trim()) return; addFolder(newFolderName.trim()); setNewFolderName(''); setShowCreateFolder(false) }
  const handleRename = (folderId: string) => { if (renameValue.trim()) renameFolder(folderId, renameValue.trim()); setRenamingFolder(null) }
  const enterBatchMode = () => { setBatchMode(true); setSelectedIdeaIds(new Set()) }
  const exitBatchMode = () => { setBatchMode(false); setSelectedIdeaIds(new Set()) }
  const toggleSelect = (id: string) => { const n = new Set(selectedIdeaIds); if (n.has(id)) n.delete(id); else n.add(id); setSelectedIdeaIds(n) }

  const batchUnfavorite = () => { if (!selectedFolderId) return; selectedIdeaIds.forEach(id => removeIdeaFromFolder(selectedFolderId, id)); setBatchMode(false); setSelectedIdeaIds(new Set()); setShowBatchUnfav(false) }
  const singleUnfavorite = (ideaId: string) => { if (selectedFolderId) removeIdeaFromFolder(selectedFolderId, ideaId); setMenuIdeaId(null) }

  // 洞核分组方法
  const handleCreateIdeaFolder = () => { if (!newIdeaFolderName.trim()) return; addIdeaFolder(newIdeaFolderName.trim()); setNewIdeaFolderName(''); setShowCreateIdeaFolder(false) }
  const handleRenameIdeaFolder = (fid: string) => { if (ideaRenameValue.trim()) renameIdeaFolder(fid, ideaRenameValue.trim()); setIdeaRenameFolder(null) }

  // 关注分组方法
  const handleCreateFollowFolder = () => { if (!newFollowFolderName.trim()) return; addFollowFolder(newFollowFolderName.trim()); setNewFollowFolderName(''); setShowCreateFollowFolder(false) }
  const handleRenameFollowFolder = (fid: string) => { if (followRenameValue.trim()) renameFollowFolder(fid, followRenameValue.trim()); setRenamingFollowFolder(null) }
  const handleDeleteFollowFolder = (fid: string) => { deleteFollowFolder(fid); if (followFolderId === fid) setFollowFolderId(null); setShowFollowDeleteConfirm(null) }
  const handleFollowUserAction = (userId: string, action: 'unfollow' | 'remove') => {
    if (action === 'unfollow') toggleFollow(userId)
    if (action === 'remove' && followFolderId) removeUserFromFollowFolder(followFolderId, userId)
    setFollowMenuUserId(null)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 个人信息卡片 */}
        <div className="card p-6 mb-6 animate-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-2xl shadow-sm">{currentUser?.avatar}</div>
            <div><h1 className="text-xl font-bold text-gray-800">{currentUser?.nickname}</h1><p className="text-sm text-gray-400 mt-0.5 break-words">{currentUser?.bio || '一个热爱开洞的人'}</p></div>
            <button onClick={() => { setEditNickname(currentUser?.nickname || ''); setEditBio(''); setEditAvatar(currentUser?.avatar || '😎'); setShowEditProfile(true) }} className="ml-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all">编辑资料</button>
          </div>
          <div className="flex gap-8 mt-5 pt-5 border-t border-gray-100">
            <div className="text-center"><p className="text-xl font-bold text-indigo-600">{myIdeas.length}</p><p className="text-xs text-gray-400 mt-0.5">洞核</p></div>
            <div className="text-center"><p className="text-xl font-bold text-yellow-600">{myFavorites.length}</p><p className="text-xs text-gray-400 mt-0.5">收藏</p></div>
            <div className="text-center"><p className="text-xl font-bold text-purple-600">{followedUsers.length}</p><p className="text-xs text-gray-400 mt-0.5">关注</p></div>
            <div className="text-center"><p className="text-xl font-bold text-green-600">{myComments.length}</p><p className="text-xs text-gray-400 mt-0.5">评论</p></div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); if (t.key === 'favorites') setSelectedFolderId('fav_default'); if (t.key === 'ideas') setIdeaFolderId('idea_default'); exitBatchMode() }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
              {t.icon} {t.label} <span className={`text-xs ${tab === t.key ? 'text-indigo-200' : 'text-gray-400'}`}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* ========== 我的洞核 ========== */}
        {tab === 'ideas' && (
          <div className="flex gap-5">
            {/* 左侧分组列表 */}
            <div className="w-56 shrink-0">
              <div className="card p-3 sticky top-4">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">创作分组</h3>
                  <button onClick={() => setShowCreateIdeaFolder(!showCreateIdeaFolder)} className="text-gray-400 hover:text-indigo-500 transition-all p-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                {showCreateIdeaFolder && (
                  <div className="flex gap-1 mb-2">
                    <input type="text" placeholder="分组名称" value={newIdeaFolderName} onChange={e => setNewIdeaFolderName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateIdeaFolder() }} className="w-0 min-w-0 flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/30" autoFocus />
                    <button onClick={handleCreateIdeaFolder} className="btn-primary px-2.5 py-1.5 text-xs shrink-0">创建</button>
                  </div>
                )}
                <div className="space-y-0.5">
                  {ideaFolders.map(folder => (
                    <div key={folder.id} className={`group rounded-xl transition-all ${ideaFolderId === folder.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                      {ideaRenameFolder === folder.id ? (
                        <div className="flex gap-1 p-2">
                          <input type="text" value={ideaRenameValue} onChange={e => setIdeaRenameValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleRenameIdeaFolder(folder.id); if (e.key === 'Escape') setIdeaRenameFolder(null) }} onBlur={() => handleRenameIdeaFolder(folder.id)} className="flex-1 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs focus:outline-none" autoFocus />
                        </div>
                      ) : (
                        <button onClick={() => { setIdeaFolderId(folder.id); setIdeaCardMenu(null) }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left">
                          <span className="text-base">{folder.icon || '📁'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${ideaFolderId === folder.id ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>{folder.name}</p>
                            <p className="text-[10px] text-gray-400">{folder.ideaIds.length} 个洞核</p>
                          </div>
                          {folder.isDefault ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded-full shrink-0">默认</span>
                          ) : (
                            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                              <button onClick={e => { e.stopPropagation(); setIdeaRenameFolder(folder.id); setIdeaRenameValue(folder.name) }} className="p-1 text-gray-400 hover:text-indigo-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                              <button onClick={e => { e.stopPropagation(); setShowDeleteIdeaFolder(folder.id) }} className="p-1 text-gray-400 hover:text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
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
            <div className="flex-1 min-w-0 pt-3">
              {tab === 'ideas' && (
                <div className="flex items-center justify-between mb-4 gap-3">
                  {/* 搜索框 - 1/4 宽度 */}
                  <div className="w-1/4 min-w-[100px] translate-y-[8px]">
                    <div className="relative">
                      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input type="text" placeholder="搜索..." value={ideaSearch} onChange={e => setIdeaSearch(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:bg-white focus:border-purple-300/50 transition-all" />
                    </div>
                  </div>
                  {/* 右侧按钮 */}
                  <div className="flex items-center gap-2 shrink-0 translate-y-[15px]">
                    {ideaBatchMode && selectedIdeaIds2.size > 0 && (
                      <button onClick={() => { selectedIdeaIds2.forEach(id => toggleIdeaVisibility(id)); setIdeaBatchMode(false); setSelectedIdeaIds2(new Set()) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                        切换可见性 ({selectedIdeaIds2.size})
                      </button>
                    )}
                    <button onClick={() => { setIdeaBatchMode(!ideaBatchMode); setSelectedIdeaIds2(new Set()) }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${ideaBatchMode ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {ideaBatchMode ? '清除' : '批量管理'}
                    </button>
                  </div>
                </div>
              )}
              {filteredIdeaDirIdeas.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 animate-in">
                  <div className="text-4xl mb-3">{ideaFolderId === 'idea_default' ? '📝' : '📂'}</div>
                  <p className="text-gray-500 font-medium">
                    {ideaFolderId === 'idea_default' ? '还没有发布过洞核' : '这个分组还是空的'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {ideaFolderId === 'idea_default' ? '去右上角发布你的第一个洞核吧' : '把洞核移到这里来管理'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIdeaDirIdeas.map((idea, i) => (
                    <div key={idea.id} className="relative group">
                      {ideaBatchMode ? (
                        <div className="absolute top-3 left-3 z-10">
                          <input type="checkbox" checked={selectedIdeaIds2.has(idea.id)}
                            onChange={() => { const n = new Set(selectedIdeaIds2); if (n.has(idea.id)) n.delete(idea.id); else n.add(idea.id); setSelectedIdeaIds2(n) }}
                            className="w-5 h-5 rounded-md border-2 border-gray-300 checked:border-indigo-500 checked:bg-indigo-500 cursor-pointer accent-indigo-600" />
                        </div>
                      ) : (
                        <div className="absolute bottom-3 right-3 z-10">
                          <button onClick={() => setIdeaCardMenu(ideaCardMenu === idea.id ? null : idea.id)}
                            className="w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 shadow-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                          </button>
                          {ideaCardMenu === idea.id && (
                            <div className="absolute bottom-9 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-40 z-20 animate-in">
                              <button onClick={() => { toggleIdeaVisibility(idea.id); setIdeaCardMenu(null) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-all">
                                {idea.isPublic ? (
                                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>设为私密</>
                                ) : (
                                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>设为公开</>
                                )}
                              </button>
                              <button onClick={() => { setManageIdeaId(idea.id); setIdeaCardMenu(null) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>移动至
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

        {/* ========== 我的收藏 ========== */}
        {tab === 'favorites' && (
          <div className="flex gap-5">
            <div className="w-56 shrink-0">
              <div className="card p-3 sticky top-4">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">收藏分组</h3>
                  <button onClick={() => setShowCreateFolder(!showCreateFolder)} className="text-gray-400 hover:text-indigo-500 transition-all p-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                {showCreateFolder && (
                  <div className="flex gap-1 mb-2">
                    <input type="text" placeholder="分组名称" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder() }} className="w-0 min-w-0 flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/30" autoFocus />
                    <button onClick={handleCreateFolder} className="btn-primary px-2.5 py-1.5 text-xs shrink-0">创建</button>
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
                        <button onClick={() => { setSelectedFolderId(folder.id); exitBatchMode() }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left">
                          <span className="text-base">{folder.icon || '📁'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${selectedFolderId === folder.id ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>{folder.name}</p>
                            <p className="text-[10px] text-gray-400">{folder.ideaIds.length} 个洞核</p>
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

            <div className="flex-1 min-w-0 pt-3">
              {tab === 'favorites' && (
                <div className="flex items-center justify-between mb-4 gap-3">
                  {/* 搜索框 - 1/4 宽度 */}
                  <div className="w-1/4 min-w-[100px] translate-y-[8px]">
                    <div className="relative">
                      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input type="text" placeholder="搜索..." value={favSearch} onChange={e => setFavSearch(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:bg-white focus:border-purple-300/50 transition-all" />
                    </div>
                  </div>
                  {/* 右侧按钮 */}
                  <div className="flex items-center gap-2 shrink-0 translate-y-[15px]">
                    {batchMode ? (
                      <>
                        <button onClick={exitBatchMode} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">清除</button>
                        {selectedIdeaIds.size > 0 && (
                          <>
                            <button onClick={() => setShowBatchUnfav(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all">取消收藏 ({selectedIdeaIds.size})</button>
                            <button onClick={() => setShowBatchMove(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all">移动至 ({selectedIdeaIds.size})</button>
                          </>
                        )}
                      </>
                    ) : (
                      <button onClick={enterBatchMode} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">批量管理</button>
                    )}
                  </div>
                </div>
              )}
              {filteredFolderIdeas.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 animate-in">
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-500 font-medium">这个分组还是空的</p>
                  <p className="text-sm text-gray-400 mt-1">去发现有趣的洞核收藏起来吧</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFolderIdeas.map((idea, i) => (
                    <div key={idea.id} className="relative group">
                      {batchMode ? (
                        <div className="absolute top-3 left-3 z-10">
                          <input type="checkbox" checked={selectedIdeaIds.has(idea.id)} onChange={() => toggleSelect(idea.id)} className="w-5 h-5 rounded-md border-2 border-gray-300 checked:border-indigo-500 checked:bg-indigo-500 cursor-pointer accent-indigo-600" />
                        </div>
                      ) : (
                        <div className="absolute bottom-3 right-3 z-10">
                          <button onClick={() => setMenuIdeaId(menuIdeaId === idea.id ? null : idea.id)}
                            className="w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 shadow-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                          </button>
                          {menuIdeaId === idea.id && (
                            <div className="absolute bottom-9 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-36 z-20 animate-in">
                              <button onClick={() => { singleUnfavorite(idea.id) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>取消收藏
                              </button>
                              <button onClick={() => { setManageIdeaId(idea.id); setMenuIdeaId(null) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>移动至
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

        {/* ========== 我的关注 ========== */}
        {tab === 'follows' && (
          <div className="flex gap-5">
            <div className="w-56 shrink-0">
              <div className="card p-3 sticky top-4">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">关注分组</h3>
                  <button onClick={() => setShowCreateFollowFolder(!showCreateFollowFolder)} className="text-gray-400 hover:text-indigo-500 transition-all p-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                {showCreateFollowFolder && (
                  <div className="flex gap-1 mb-2 px-2">
                    <input type="text" placeholder="分组名称" value={newFollowFolderName} onChange={e => setNewFollowFolderName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateFollowFolder() }} className="w-0 min-w-0 flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/30" autoFocus />
                    <button onClick={handleCreateFollowFolder} className="btn-primary px-2.5 py-1.5 text-xs shrink-0">创建</button>
                  </div>
                )}
                <div className="space-y-0.5">
                  {followFolders.map(folder => (
                    <div key={folder.id} className={`group rounded-xl transition-all ${followFolderId === folder.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                      {renamingFollowFolder === folder.id ? (
                        <div className="flex gap-1 p-2">
                          <input type="text" value={followRenameValue} onChange={e => setFollowRenameValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleRenameFollowFolder(folder.id); if (e.key === 'Escape') setRenamingFollowFolder(null) }} onBlur={() => handleRenameFollowFolder(folder.id)} className="flex-1 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs focus:outline-none" autoFocus />
                        </div>
                      ) : (
                        <button onClick={() => setFollowFolderId(folder.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left">
                          <span className="text-base">{folder.icon || '👥'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${followFolderId === folder.id ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>{folder.name}</p>
                            <p className="text-[10px] text-gray-400">{folder.id === 'follow_default' ? followedUserIds.length : folder.ideaIds.length} 人</p>
                          </div>
                          {folder.isDefault ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded-full shrink-0">默认</span>
                          ) : (
                            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                              <button onClick={e => { e.stopPropagation(); setRenamingFollowFolder(folder.id); setFollowRenameValue(folder.name) }} className="p-1 text-gray-400 hover:text-indigo-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                              <button onClick={e => { e.stopPropagation(); setShowFollowDeleteConfirm(folder.id) }} className="p-1 text-gray-400 hover:text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-3">
              {/* 搜索 + 批量管理 */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="w-1/4 min-w-[100px] translate-y-[8px]">
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" placeholder="搜索..." value={followSearch} onChange={e => setFollowSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:bg-white focus:border-purple-300/50 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 translate-y-[15px]">
                  {followBatchMode ? (
                    <>
                      <button onClick={() => { setFollowBatchMode(false); setFollowSelectedIds(new Set()) }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">清除</button>
                      {followSelectedIds.size > 0 && (
                        <button onClick={() => { followSelectedIds.forEach(id => toggleFollow(id)); setFollowSelectedIds(new Set()); setFollowBatchMode(false) }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all">取消关注 ({followSelectedIds.size})</button>
                      )}
                    </>
                  ) : (
                    <button onClick={() => setFollowBatchMode(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">批量管理</button>
                  )}
                </div>
              </div>
              {filteredFollowUsers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 animate-in">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="text-gray-500 font-medium">这个分组还是空的</p>
                  <p className="text-sm text-gray-400 mt-1">去发现有趣的创作者关注起来吧</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredFollowUsers.map(u => (
                    <div key={u.id} className={`card p-3 animate-in flex items-center gap-3 relative group overflow-visible ${followMenuUserId === u.id ? 'z-[999]' : ''}`}>
                      {followBatchMode && (
                        <div className="absolute top-3 left-3 z-10">
                          <input type="checkbox" checked={followSelectedIds.has(u.id)} onChange={() => { const n = new Set(followSelectedIds); if (n.has(u.id)) n.delete(u.id); else n.add(u.id); setFollowSelectedIds(n) }} className="w-5 h-5 rounded-md border-2 border-gray-300 checked:border-indigo-500 checked:bg-indigo-500 cursor-pointer accent-indigo-600" />
                        </div>
                      )}
                      <UserLink user={u} isAnonymous={false}>
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-lg shrink-0 cursor-pointer">{u.avatar}</span>
                      </UserLink>
                      <div className="flex-1 min-w-0">
                        <UserLink user={u} isAnonymous={false}>
                          <p className="text-sm font-bold text-gray-800 truncate cursor-pointer hover:text-indigo-600">{u.nickname}</p>
                        </UserLink>
                        {u.bio && <p className="text-[11px] text-gray-400 truncate">{u.bio}</p>}
                      </div>
                      {!followBatchMode && (
                      <div className="relative shrink-0">
                        <button onMouseEnter={() => { clearTimeout(followTimer.current); setFollowMenuUserId(u.id) }} onMouseLeave={() => { followTimer.current = setTimeout(() => setFollowMenuUserId(null), 300) }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all cursor-default">已关注</button>
                        {followMenuUserId === u.id && (
                          <div onMouseEnter={() => clearTimeout(followTimer.current)} onMouseLeave={() => { followTimer.current = setTimeout(() => setFollowMenuUserId(null), 300) }}
                            className="absolute top-full right-0 mt-0.5 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-36 z-[999] animate-in">
                            <button onClick={() => { setShowSetFollowGroup(u.id); setFollowMenuUserId(null) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-all">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>设置分组
                            </button>
                            <button onClick={() => handleFollowUserAction(u.id, 'unfollow')} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-all">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>取消关注
                            </button>
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== 我的消息 ========== */}
        {tab === 'comments' && (myComments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200"><div className="text-4xl mb-3">💬</div><p className="text-gray-500">还没有消息</p></div>
        ) : (
          <div className="space-y-3">{myComments.map(c => (
            <div key={c.id} className="card p-4 animate-in"><p className="text-sm text-gray-700 mb-2 leading-relaxed break-words">{linkify(c.content)}</p><div className="flex items-center gap-3 text-xs text-gray-400"><span>❤️ {c.likes}</span><span>·</span><span>{new Date(c.createdAt).toLocaleDateString('zh-CN')}</span></div></div>
          ))}</div>
        ))}
      </main>

      {/* 收藏 - 删除确认 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/30" /><div className="relative bg-white rounded-2xl shadow-xl p-5 w-72 animate-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4"><div className="text-3xl mb-2">🗑️</div><h3 className="text-base font-bold text-gray-800">删除分组</h3><p className="text-sm text-gray-500 mt-1">分组内的洞核将会移回「默认收藏」</p></div>
            <div className="flex gap-2"><button onClick={() => { deleteFolder(showDeleteConfirm); setShowDeleteConfirm(null); setSelectedFolderId(null) }} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">确认删除</button><button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">取消</button></div>
          </div>
        </div>
      )}

      {/* 洞核 - 删除确认 */}
      {showDeleteIdeaFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDeleteIdeaFolder(null)}>
          <div className="absolute inset-0 bg-black/30" /><div className="relative bg-white rounded-2xl shadow-xl p-5 w-72 animate-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4"><div className="text-3xl mb-2">🗑️</div><h3 className="text-base font-bold text-gray-800">删除分组</h3><p className="text-sm text-gray-500 mt-1">洞核将会移回「默认创作」</p></div>
            <div className="flex gap-2"><button onClick={() => { deleteIdeaFolder(showDeleteIdeaFolder); setShowDeleteIdeaFolder(null); setIdeaFolderId('idea_default') }} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">确认删除</button><button onClick={() => setShowDeleteIdeaFolder(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">取消</button></div>
          </div>
        </div>
      )}

      {/* 移动至弹窗 - 洞核/收藏共用 */}
      {manageIdeaId && <FolderPickerModal ideaId={manageIdeaId} isOpen={!!manageIdeaId} onClose={() => setManageIdeaId(null)} />}

      {/* 批量取消收藏确认 */}
      {showBatchUnfav && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBatchUnfav(false)}>
          <div className="absolute inset-0 bg-black/30" /><div className="relative bg-white rounded-2xl shadow-xl p-5 w-72 animate-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4"><div className="text-3xl mb-2">🗑️</div><h3 className="text-base font-bold text-gray-800">取消收藏</h3><p className="text-sm text-gray-500 mt-1">将从当前分组移除 {selectedIdeaIds.size} 个洞核</p></div>
            <div className="flex gap-2"><button onClick={batchUnfavorite} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">确认</button><button onClick={() => setShowBatchUnfav(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">取消</button></div>
          </div>
        </div>
      )}

      {/* 批量移动弹窗 */}
      {showBatchMove && selectedFolderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBatchMove(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" /><div className="relative bg-white rounded-2xl shadow-xl w-80 animate-in" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100"><div className="flex items-center justify-between mb-1"><h3 className="text-base font-bold text-gray-800">移动至</h3><button onClick={() => setShowBatchMove(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button></div><p className="text-xs text-gray-400">已选择 {selectedIdeaIds.size} 个洞核</p></div>
            <div className="p-2 max-h-52 overflow-y-auto">
              {collectionFolders.filter(f => f.id !== selectedFolderId).map(folder => (
                <button key={folder.id} onClick={() => { selectedIdeaIds.forEach(id => { if (collectionFolders.find(f => f.id === selectedFolderId)?.ideaIds.includes(id)) removeIdeaFromFolder(selectedFolderId, id); addIdeaToFolder(folder.id, id) }); setShowBatchMove(false); exitBatchMode() }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-left">
                  <span className="text-base">{folder.icon}</span><div><p className="text-sm font-medium text-gray-700">{folder.name}</p><p className="text-[11px] text-gray-400">{folder.ideaIds.length} 个洞核</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 关注分组 - 删除确认 */}
      {showFollowDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowFollowDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-72 animate-in p-5 text-center" onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-base font-bold text-gray-800 mb-2">删除分组</h3>
            <p className="text-sm text-gray-500 mb-4">关注将移回「我的关注」</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowFollowDeleteConfirm(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-all">取消</button>
              <button onClick={() => showFollowDeleteConfirm && handleDeleteFollowFolder(showFollowDeleteConfirm)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-all">删除</button>
            </div>
          </div>
        </div>
      )}

      {/* 设置关注分组 */}
      {showSetFollowGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowSetFollowGroup(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-72 animate-in p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">移动至</h3>
              <button onClick={() => setShowSetFollowGroup(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-1">
              {followFolders.map(folder => (
                <button key={folder.id} onClick={() => { if (showSetFollowGroup) addUserToFollowFolder(folder.id, showSetFollowGroup); setShowSetFollowGroup(null) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-left">
                  <span className="text-base">{folder.icon || '👥'}</span>
                  <div><p className="text-sm font-medium text-gray-700">{folder.name}</p><p className="text-[11px] text-gray-400">{folder.ideaIds.length} 人</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 编辑资料弹窗 */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-80 animate-in p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">编辑资料</h3>
              <button onClick={() => setShowEditProfile(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              {/* 头像选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">头像</label>
                <div className="flex flex-wrap gap-2">
                  {['😎', '🤖', '🐱', '🐶', '🦊', '🐼', '🐸', '🦄', '🌈', '🔥', '💡', '🎨'].map(emoji => (
                    <button key={emoji} onClick={() => setEditAvatar(emoji)}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${editAvatar === emoji ? 'ring-2 ring-indigo-500 bg-indigo-50 scale-110' : 'hover:bg-gray-100'}`}>{emoji}</button>
                  ))}
                </div>
              </div>
              {/* 昵称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
                <input type="text" value={editNickname} onChange={e => setEditNickname(e.target.value.slice(0, 20))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400" placeholder="你的昵称" />
                <div className="text-xs text-gray-400 mt-1 text-right">{editNickname.length}/20</div>
              </div>
              {/* 简介 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">简介</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value.slice(0, 80))} rows={2}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 resize-none" placeholder="一句话介绍自己..." />
                <div className="text-xs text-gray-400 mt-1 text-right">{editBio.length}/80</div>
              </div>
              <button onClick={() => { updateCurrentUser({ nickname: editNickname, avatar: editAvatar, bio: editBio }); setShowEditProfile(false) }}
                disabled={!editNickname.trim()}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center"><div className="text-4xl mb-4">👤</div><p className="text-gray-500">加载中...</p></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
