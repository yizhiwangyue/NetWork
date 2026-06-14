'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

const FLOATING_EMOJIS = [
  { emoji: '💡', class: 'float1', size: 'text-5xl', x: '15%', y: '20%', delay: '0s' },
  { emoji: '🚀', class: 'float2', size: 'text-4xl', x: '80%', y: '15%', delay: '0.3s' },
  { emoji: '✨', class: 'float3', size: 'text-3xl', x: '70%', y: '75%', delay: '0.6s' },
  { emoji: '🌌', class: 'float4', size: 'text-5xl', x: '20%', y: '70%', delay: '0.9s' },
  { emoji: '🎨', class: 'float1', size: 'text-3xl', x: '50%', y: '10%', delay: '1.2s' },
  { emoji: '🌟', class: 'float2', size: 'text-2xl', x: '10%', y: '50%', delay: '1.5s' },
  { emoji: '🔮', class: 'float3', size: 'text-3xl', x: '88%', y: '45%', delay: '1.8s' },
  { emoji: '🪐', class: 'float4', size: 'text-4xl', x: '45%', y: '85%', delay: '2.1s' },
  { emoji: '🤖', class: 'float1', size: 'text-2xl', x: '60%', y: '88%', delay: '2.4s' },
  { emoji: '💫', class: 'float2', size: 'text-xl',  x: '35%', y: '5%',  delay: '2.7s' },
]

export default function CoverPage() {
  const router = useRouter()
  const ideas = useStore((s) => s.ideas)
  const [clicked, setClicked] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  const handleEnter = () => {
    setClicked(true)
    setTimeout(() => {
      router.push('/discover')
    }, 600)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* === 动态渐变背景 === */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e, #1a1a2e)',
          backgroundSize: '400% 400%',
          animation: 'gradientBg 12s ease infinite',
        }}
      />

      {/* 背景装饰光晕 */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-fuchsia-500/8 blur-[140px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-indigo-500/5 blur-[160px]" />

      {/* === 浮动 emoji === */}
      {showContent && (
        <div className="cover-floats absolute inset-0 pointer-events-none">
          {FLOATING_EMOJIS.map((item, i) => (
            <span
              key={i}
              className={`absolute ${item.size}`}
              style={{
                left: item.x,
                top: item.y,
                animation: `${item.class} ${5 + (i % 3) * 1.5}s ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      )}

      {/* === 内容 === */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
        {/* Logo 光环 */}
        <div className="relative mb-10">
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{ animation: 'ringExpand 3s ease-out infinite' }}
          >
            <div className="w-full h-full rounded-full border border-purple-400/20" />
          </div>
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30"
            style={{ animation: 'breathe 3s ease-in-out infinite' }}
          >
            <span className="text-4xl">💡</span>
          </div>
        </div>

        {/* 标题 */}
        {showContent && (
          <h1 className="cover-title text-center">
            <span className="text-6xl md:text-7xl font-extrabold block leading-tight">
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                嘿洞星球
              </span>
            </span>
            <span className="text-base md:text-lg font-light text-purple-300/60 mt-4 block tracking-[0.2em] uppercase">
              Idea Planet
            </span>
          </h1>
        )}

        {/* 副标题 */}
        {showContent && (
          <p className="cover-sub text-sm md:text-base text-purple-200/50 mt-6 text-center max-w-md leading-relaxed tracking-wider">
            等你来开洞
          </p>
        )}

        {/* 进入按钮 */}
        {showContent && (
          <div className="cover-btn mt-12">
            <button
              onClick={handleEnter}
              disabled={clicked}
              className={`
                relative px-10 py-4 rounded-2xl text-base font-bold tracking-widest
                bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white
                transition-all duration-500 cursor-pointer
                ${clicked ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
              `}
              style={{ animation: 'glowPulse 2.5s ease-in-out infinite' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                进入星球
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </button>
          </div>
        )}

        {/* 星星计数 */}
        {showContent && (
          <p className="cover-sub text-xs text-purple-300/30 mt-8 tracking-wider">
            ✦ 已有 {ideas.length} 个洞核等待探索 ✦
          </p>
        )}
      </div>
    </div>
  )
}
