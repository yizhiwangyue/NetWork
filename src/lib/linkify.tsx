import type { ReactNode } from 'react'

/** 清理 URL 尾部不可能属于 URL 的字符 (CJK、中文标点) */
function cleanUrl(url: string): string {
  // 从末尾开始删除 CJK 字符和中文标点
  return url.replace(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef，。！？、；：（）【】《》「」『』［］｛｝…—～]+$/g, '')
}

export function linkify(text: string): ReactNode {
  // 先匹配所有非空白字符
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const raw = match[0]
    const cleaned = cleanUrl(raw)
    if (cleaned) {
      parts.push(
        <a key={match.index} href={cleaned} target="_blank" rel="noopener noreferrer"
          className="text-indigo-500 underline hover:text-indigo-700 break-all">
          {cleaned}
        </a>
      )
    }
    // 未清理的部分（尾部中文）保留为普通文本
    if (cleaned.length < raw.length) {
      parts.push(raw.slice(cleaned.length))
    }
    lastIndex = match.index + raw.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
