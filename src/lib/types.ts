export interface User {
  id: string
  nickname: string
  avatar: string
  bio: string
}

export interface Idea {
  id: string
  title: string
  content: string
  highlight: string
  author: User | null
  isAnonymous: boolean
  category: string
  tags: string[]
  likes: number
  comments: number
  favorites: number
  createdAt: string
  likedByMe: boolean
  favoritedByMe: boolean
  isBounty: boolean
}

export interface Comment {
  id: string
  ideaId: string
  author: User
  content: string
  createdAt: string
  likes: number
}

export type SortMode = 'latest' | 'hot' | 'favorites' | 'bounty'
export type CategoryKey = 'tech' | 'life' | 'work' | 'society' | 'entertain' | 'fantasy' | 'bounty'

export interface Category {
  key: CategoryKey
  label: string
  icon: string
  subCategories: string[]
}

export interface CollectionFolder {
  id: string
  name: string
  ideaIds: string[]
  icon: string
  createdAt: string
  isDefault?: boolean
}
