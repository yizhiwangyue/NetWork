'use client'
import { useState } from 'react'
import type { User } from '@/lib/types'

interface Props {
  user: User | null
  isAnonymous: boolean
  children: React.ReactNode
}

export default function UserPopover({ user, isAnonymous, children }: Props) {
  const [open, setOpen] = useState(false)

  if (isAnonymous || !user) {
    return <span className="cursor-default">{children}</span>
  }

  return (
    <span className="relative inline-flex">
      <button onClick={() => setOpen(!open)} className="hover:text-indigo-600 transition-colors text-left">
        {children}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full left-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 p-4 animate-in">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-xl">{user.avatar}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{user.nickname}</p>
              </div>
            </div>
            {user.bio && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{user.bio}</p>}
            <div className="flex gap-4 text-xs text-gray-400 border-t border-gray-100 pt-3">
              <div><span className="font-semibold text-gray-700">{user.id === 'u_me' ? '-' : '-'}</span><span className="ml-1">洞核</span></div>
              <div><span className="font-semibold text-gray-700">{user.id === 'u_me' ? '-' : '-'}</span><span className="ml-1">评论</span></div>
            </div>
          </div>
        </>
      )}
    </span>
  )
}
