'use client'
import { create } from 'zustand'
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

  setSortMode: (mode: SortMode) => void
  setCategory: (cat: string | null) => void
  setTag: (tag: string | null) => void
  setSearch: (q: string) => void
  toggleLike: (ideaId: string) => void
  toggleFavorite: (ideaId: string) => void
  addIdea: (idea: Idea) => void
  deleteIdea: (ideaId: string) => void
  addComment: (comment: Comment) => void

  // 收藏分组
  addFolder: (name: string) => void
  renameFolder: (folderId: string, name: string) => void
  deleteFolder: (folderId: string) => void
  addIdeaToFolder: (folderId: string, ideaId: string) => void
  removeIdeaFromFolder: (folderId: string, ideaId: string) => void
  getFolderIdeas: (folderId: string) => Idea[]
  getAllFavorites: () => Idea[]
}

const DEFAULT_FOLDERS: CollectionFolder[] = [
  { id: 'fav_default', name: '默认收藏', ideaIds: [], icon: '⭐', createdAt: '2026-01-01T00:00:00Z', isDefault: true },
  { id: 'fav_watch', name: '待实现', ideaIds: [], icon: '👀', createdAt: '2026-01-01T00:00:00Z' },
]

export const useStore = create<AppState>((set, get) => ({
  ideas: SEED_IDEAS,
  comments: SEED_COMMENTS,
  sortMode: 'latest',
  currentCategory: null,
  currentTag: null,
  searchQuery: '',
  currentUser: { id: 'u_me', nickname: '我', avatar: '😎' },
  collectionFolders: DEFAULT_FOLDERS,

  setSortMode: (mode) => set({ sortMode: mode }),
  setCategory: (cat) => set({ currentCategory: cat }),
  setTag: (tag) => set({ currentTag: tag }),
  setSearch: (q) => set({ searchQuery: q }),
  toggleLike: (ideaId) => set((state) => ({ ideas: state.ideas.map((i) => i.id === ideaId ? { ...i, likes: i.likedByMe ? i.likes - 1 : i.likes + 1, likedByMe: !i.likedByMe } : i) })),
  toggleFavorite: (ideaId) => set((state) => ({ ideas: state.ideas.map((i) => i.id === ideaId ? { ...i, favorites: i.favoritedByMe ? i.favorites - 1 : i.favorites + 1, favoritedByMe: !i.favoritedByMe } : i) })),
  addIdea: (idea) => set((state) => ({ ideas: [idea, ...state.ideas] })),
  deleteIdea: (ideaId) => set((state) => ({ ideas: state.ideas.filter((i) => i.id !== ideaId) })),
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment], ideas: state.ideas.map((i) => i.id === comment.ideaId ? { ...i, comments: i.comments + 1 } : i) })),

  // === 收藏分组 ===
  addFolder: (name) => set((state) => ({
    collectionFolders: [...state.collectionFolders, {
      id: `folder_${Date.now()}`,
      name,
      ideaIds: [],
      icon: '📁',
      createdAt: new Date().toISOString(),
    }],
  })),

  renameFolder: (folderId, name) => set((state) => ({
    collectionFolders: state.collectionFolders.map(f => f.id === folderId ? { ...f, name } : f),
  })),

  deleteFolder: (folderId) => set((state) => {
    // 删除文件夹时，将其中的脑洞移回默认收藏
    const folder = state.collectionFolders.find(f => f.id === folderId)
    if (!folder) return state
    return {
      collectionFolders: state.collectionFolders
        .filter(f => f.id !== folderId)
        .map(f => f.id === 'fav_default' ? { ...f, ideaIds: [...f.ideaIds, ...folder.ideaIds.filter(id => !f.ideaIds.includes(id))] } : f),
    }
  }),

  addIdeaToFolder: (folderId, ideaId) => set((state) => {
    // 同时标记为已收藏
    return {
      ideas: state.ideas.map(i => i.id === ideaId ? { ...i, favoritedByMe: true } : i),
      collectionFolders: state.collectionFolders.map(f =>
        f.id === folderId && !f.ideaIds.includes(ideaId)
          ? { ...f, ideaIds: [...f.ideaIds, ideaId] }
          : f
      ),
    }
  }),

  removeIdeaFromFolder: (folderId, ideaId) => set((state) => {
    const newFolders = state.collectionFolders.map(f =>
      f.id === folderId ? { ...f, ideaIds: f.ideaIds.filter(id => id !== ideaId) } : f
    )
    // 检查是否还在任何文件夹中
    const stillInAny = newFolders.some(f => f.ideaIds.includes(ideaId))
    return {
      ideas: state.ideas.map(i => i.id === ideaId ? { ...i, favoritedByMe: stillInAny } : i),
      collectionFolders: newFolders,
    }
  }),

  getFolderIdeas: (folderId) => {
    const state = get()
    const folder = state.collectionFolders.find(f => f.id === folderId)
    if (!folder) return []
    return state.ideas.filter(i => folder.ideaIds.includes(i.id))
  },

  getAllFavorites: () => {
    const state = get()
    const allIds = new Set(state.collectionFolders.flatMap(f => f.ideaIds))
    return state.ideas.filter(i => allIds.has(i.id))
  },
}))
