import { SEED_IDEAS } from '@/lib/seed'

export async function generateStaticParams() {
  return SEED_IDEAS.map(idea => ({ id: idea.id }))
}

export default function IdeaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
