export default function BackgroundWaves() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 三层波浪 */}
      <div className="bg-wave-box" />
      <div className="bg-wave-box" />
      <div className="bg-wave-box" />
      {/* 底部渐变 */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-50/60 via-transparent to-transparent" />
    </div>
  )
}
