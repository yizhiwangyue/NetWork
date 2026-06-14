'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Idea, SortMode, Comment, CollectionFolder } from './types'
import { SEED_IDEAS, SEED_COMMENTS } from './seed'

interface AppState {
  ideas: Idea[]
  comments: Comment[]
  sortMode: SortMode
  currentCategory: string | null
  currentTag: string | null
  searchQuery: string
  currentUser: { id: string; nickname: string; avatar: string } | null
  collectionFolders: CollectionFolder[]
  ideaFolders: CollectionFolder[]

  setSortMode: (mode: SortMode) => void
  setCategory: (cat: string | null) => void
  setTag: (tag: string | null) => void
  setSearch: (q: string) => void
  toggleLike: (ideaId: string) => void
  toggleFavorite: (ideaId: string) => void
  addIdea: (idea: Idea) => void
  deleteIdea: (ideaId: string) => void
  addComment: (comment: Comment) => void
  toggleIdeaVisibility: (ideaId: string) => void

  // 收藏分组
  addFolder: (name: string) => void
  renameFolder: (folderId: string, name: string) => void
  deleteFolder: (folderId: string) => void
  addIdeaToFolder: (folderId: string, ideaId: string) => void
  removeIdeaFromFolder: (folderId: string, ideaId: string) => void
  getFolderIdeas: (folderId: string) => Idea[]
  getAllFavorites: () => Idea[]

  // 脑洞分组
  addIdeaFolder: (name: string) => void
  renameIdeaFolder: (folderId: string, name: string) => void
  deleteIdeaFolder: (folderId: string) => void
  addIdeaToIdeaFolder: (folderId: string, ideaId: string) => void
  removeIdeaFromIdeaFolder: (folderId: string, ideaId: string) => void
  getIdeaFolderIdeas: (folderId: string) => Idea[]
  updateCurrentUser: (user: { nickname: string; avatar: string; bio: string }) => void
}

const DEFAULT_FOLDERS: CollectionFolder[] = [
  { id: 'fav_default', name: '默认收藏', ideaIds: [], icon: '⭐', createdAt: '2026-01-01T00:00:00Z', isDefault: true },
  { id: 'fav_watch', name: '待实现', ideaIds: [], icon: '👀', createdAt: '2026-01-01T00:00:00Z' },
]

const DEFAULT_IDEA_FOLDERS: CollectionFolder[] = [
  { id: 'idea_default', name: '默认创作', ideaIds: [], icon: '📝', createdAt: '2026-01-01T00:00:00Z', isDefault: true },
  { id: 'idea_private', name: '私密', ideaIds: [], icon: '🔒', createdAt: '2026-01-01T00:00:00Z' },
]

// 给种子数据加 isPublic
const SEED_WITH_VISIBILITY = SEED_IDEAS.map(i => ({ ...i, isPublic: true }))

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
  ideas: SEED_WITH_VISIBILITY,
  comments: SEED_COMMENTS,
  sortMode: 'latest',
  currentCategory: null,
  currentTag: null,
  searchQuery: '',
  currentUser: { id: 'u_me', nickname: '我', avatar: '😎' },
  collectionFolders: DEFAULT_FOLDERS,
  ideaFolders: DEFAULT_IDEA_FOLDERS,

  setSortMode: (mode) => set({ sortMode: mode }),
  setCategory: (cat) => set({ currentCategory: cat }),
  setTag: (tag) => set({ currentTag: tag }),
  setSearch: (q) => set({ searchQuery: q }),
  toggleLike: (ideaId) => set((state) => ({ ideas: state.ideas.map((i) => i.id === ideaId ? { ...i, likes: i.likedByMe ? i.likes - 1 : i.likes + 1, likedByMe: !i.likedByMe } : i) })),
  toggleFavorite: (ideaId) => set((state) => ({ ideas: state.ideas.map((i) => i.id === ideaId ? { ...i, favorites: i.favoritedByMe ? i.favorites - 1 : i.favorites + 1, favoritedByMe: !i.favoritedByMe } : i) })),
  addIdea: (idea) => set((state) => ({ ideas: [idea, ...state.ideas] })),
  deleteIdea: (ideaId) => set((state) => ({ ideas: state.ideas.filter((i) => i.id !== ideaId) })),
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment], ideas: state.ideas.map((i) => i.id === comment.ideaId ? { ...i, comments: i.comments + 1 } : i) })),
  toggleIdeaVisibility: (ideaId) => set((state) => ({ ideas: state.ideas.map(i => i.id === ideaId ? { ...i, isPublic: !i.isPublic } : i) })),

  // === 收藏分组 ===
  addFolder: (name) => set((state) => ({
    collectionFolders: [...state.collectionFolders, { id: `folder_${Date.now()}`, name, ideaIds: [], icon: '📁', createdAt: new Date().toISOString() }],
  })),
  renameFolder: (folderId, name) => set((state) => ({ collectionFolders: state.collectionFolders.map(f => f.id === folderId ? { ...f, name } : f) })),
  deleteFolder: (folderId) => set((state) => {
    const folder = state.collectionFolders.find(f => f.id === folderId)
    if (!folder) return state
    return { collectionFolders: state.collectionFolders.filter(f => f.id !== folderId).map(f => f.id === 'fav_default' ? { ...f, ideaIds: [...f.ideaIds, ...folder.ideaIds.filter(id => !f.ideaIds.includes(id))] } : f) }
  }),
  addIdeaToFolder: (folderId, ideaId) => set((state) => ({
    ideas: state.ideas.map(i => i.id === ideaId ? { ...i, favoritedByMe: true } : i),
    collectionFolders: state.collectionFolders.map(f => f.id === folderId && !f.ideaIds.includes(ideaId) ? { ...f, ideaIds: [...f.ideaIds, ideaId] } : f),
  })),
  removeIdeaFromFolder: (folderId, ideaId) => set((state) => {
    const newFolders = state.collectionFolders.map(f => f.id === folderId ? { ...f, ideaIds: f.ideaIds.filter(id => id !== ideaId) } : f)
    const stillInAny = newFolders.some(f => f.ideaIds.includes(ideaId))
    return { ideas: state.ideas.map(i => i.id === ideaId ? { ...i, favoritedByMe: stillInAny } : i), collectionFolders: newFolders }
  }),
  getFolderIdeas: (folderId) => { const s = get(); const f = s.collectionFolders.find(f => f.id === folderId); return f ? s.ideas.filter(i => f.ideaIds.includes(i.id)) : [] },
  getAllFavorites: () => { const s = get(); const allIds = new Set(s.collectionFolders.flatMap(f => f.ideaIds)); return s.ideas.filter(i => allIds.has(i.id)) },

  // === 脑洞分组 ===
  addIdeaFolder: (name) => set((state) => ({ ideaFolders: [...state.ideaFolders, { id: `ifolder_${Date.now()}`, name, ideaIds: [], icon: '📁', createdAt: new Date().toISOString() }] })),
  renameIdeaFolder: (folderId, name) => set((state) => ({ ideaFolders: state.ideaFolders.map(f => f.id === folderId ? { ...f, name } : f) })),
  deleteIdeaFolder: (folderId) => set((state) => {
    const folder = state.ideaFolders.find(f => f.id === folderId)
    if (!folder) return state
    return { ideaFolders: state.ideaFolders.filter(f => f.id !== folderId).map(f => f.id === 'idea_default' ? { ...f, ideaIds: [...f.ideaIds, ...folder.ideaIds.filter(id => !f.ideaIds.includes(id))] } : f) }
  }),
  addIdeaToIdeaFolder: (folderId, ideaId) => set((state) => ({ ideaFolders: state.ideaFolders.map(f => f.id === folderId && !f.ideaIds.includes(ideaId) ? { ...f, ideaIds: [...f.ideaIds, ideaId] } : f) })),
  removeIdeaFromIdeaFolder: (folderId, ideaId) => set((state) => ({ ideaFolders: state.ideaFolders.map(f => f.id === folderId ? { ...f, ideaIds: f.ideaIds.filter(id => id !== ideaId) } : f) })),
  getIdeaFolderIdeas: (folderId) => { const s = get(); const f = s.ideaFolders.find(f => f.id === folderId); return f ? s.ideas.filter(i => f.ideaIds.includes(i.id)) : [] },
  updateCurrentUser: (user) => set((state) => ({ currentUser: state.currentUser ? { ...state.currentUser, ...user } : state.currentUser })),
    }),
    { name: 'brainhole-storage',
      version: 1,
      migrate: (persisted: any) => {
        if (persisted?.state?.ideas) {
          // 建立种子数据 ID 索引
          const seedMap = new Map(SEED_IDEAS.map(i => [i.id, { ...i, isPublic: true }]))
          persisted.state.ideas = persisted.state.ideas.map((i: any) => {
            // 如果是种子数据 → 用最新的种子数据替换（包含图片等新字段）
            if (seedMap.has(i.id)) {
              return seedMap.get(i.id)
            }
            // 用户自己创建的 → 补充默认字段
            return { ...i, images: i.images || [], isPublic: i.isPublic ?? true }
          })
          // 补充可能缺失的种子数据
          for (const [id, fresh] of seedMap) {
            if (!persisted.state.ideas.find((i: any) => i.id === id)) {
              persisted.state.ideas.push(fresh)
            }
          }
        }
        return persisted
      },
    }
  )
)
