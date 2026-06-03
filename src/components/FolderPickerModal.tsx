'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'

interface Props {
  ideaId: string
  isOpen: boolean
  onClose: () => void
}

export default function FolderPickerModal({ ideaId, isOpen, onClose }: Props) {
  const collectionFolders = useStore((s) => s.collectionFolders)
  const addFolder = useStore((s) => s.addFolder)
  const addIdeaToFolder = useStore((s) => s.addIdeaToFolder)
  const removeIdeaFromFolder = useStore((s) => s.removeIdeaFromFolder)

  // 本地暂存勾选状态：打开时从 store 读取，点确定才写入
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  // 打开弹窗时，同步当前 store 中的勾选状态到本地
  useEffect(() => {
    if (isOpen) {
      const currentIds = new Set(
        collectionFolders
          .filter(f => f.ideaIds.includes(ideaId))
          .map(f => f.id)
      )
      setSelectedIds(currentIds)
      setShowNewFolder(false)
      setNewFolderName('')
    }
  }, [isOpen, ideaId])

  if (!isOpen) return null

  const handleToggle = (folderId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    addFolder(newFolderName.trim())
    setNewFolderName('')
    setShowNewFolder(false)
  }

  // 确定：对比本地状态与 store 的差异，批量写入
  const handleConfirm = () => {
    collectionFolders.forEach(folder => {
      const currentlyHas = folder.ideaIds.includes(ideaId)
      const wantHas = selectedIds.has(folder.id)
      if (wantHas && !currentlyHas) {
        addIdeaToFolder(folder.id, ideaId)
      } else if (!wantHas && currentlyHas) {
        removeIdeaFromFolder(folder.id, ideaId)
      }
    })
    onClose()
  }

  // 取消：不写任何东西，直接关
  const handleCancel = () => {
    setSelectedIds(new Set())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-xl w-80 max-h-[70vh] overflow-hidden animate-in" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-gray-800">收藏到</h3>
            <button onClick={handleCancel} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">✕</button>
          </div>
          <p className="text-xs text-gray-400">已选择 {selectedIds.size} 个分组</p>
        </div>

        {/* 分组列表 */}
        <div className="p-2 overflow-y-auto max-h-52">
          {collectionFolders.map(folder => (
            <label
              key={folder.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedIds.has(folder.id)}
                  onChange={() => handleToggle(folder.id)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-md border-2 border-gray-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 flex items-center justify-center transition-all">
                  {selectedIds.has(folder.id) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>
              </div>
              <span className="text-base">{folder.icon || '📁'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{folder.name}</p>
                <p className="text-[11px] text-gray-400">{folder.ideaIds.length} 个脑洞</p>
              </div>
              {folder.isDefault && (
                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-full">默认</span>
              )}
            </label>
          ))}
        </div>

        {/* 新建分组 */}
        <div className="p-3 border-t border-gray-100">
          {showNewFolder ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="输入分组名称"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder() }}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400"
                autoFocus
              />
              <button onClick={handleCreateFolder} className="btn-primary px-4 py-2 text-sm">创建</button>
              <button onClick={() => { setShowNewFolder(false); setNewFolderName('') }} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600">取消</button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewFolder(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              新建分组
            </button>
          )}
        </div>

        {/* 底部确定/取消按钮 */}
        <div className="p-3 pt-0 flex gap-2">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
