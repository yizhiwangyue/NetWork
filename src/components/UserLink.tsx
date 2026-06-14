'use client'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types'

interface Props {
  user: User | null
  isAnonymous: boolean
  children: React.ReactNode
}

export default function UserLink({ user, isAnonymous, children }: Props) {
  const router = useRouter()

  if (isAnonymous || !user) {
    return <span className="cursor-default">{children}</span>
  }

  return (
    <span
      className="hover:text-indigo-600 transition-colors cursor-pointer"
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
        router.push(`/user?id=${user.id}`)
      }}>
      {children}
    </span>
  )
}
