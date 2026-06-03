import { Category, User, Idea, Comment, SortMode } from './types'

export const CATEGORIES: Category[] = [
  { key: 'tech', label: '科技与未来', icon: '🤖', subCategories: ['AI', '航天', '生物', '新能源', '量子计算'] },
  { key: 'life', label: '生活与消费', icon: '🏠', subCategories: ['家居', '美食', '旅行', '宠物', '穿搭'] },
  { key: 'work', label: '工作与效率', icon: '💼', subCategories: ['办公工具', '管理方法', '职场创意', '远程协作'] },
  { key: 'society', label: '社会与人文', icon: '🌍', subCategories: ['教育', '公益', '城市设计', '文化', '心理学'] },
  { key: 'entertain', label: '娱乐与艺术', icon: '🎨', subCategories: ['游戏', '影视', '音乐', '插画', '写作'] },
  { key: 'fantasy', label: '奇妙异想', icon: '✨', subCategories: ['天马行空', '荒诞', '有趣', '平行宇宙'] },
  { key: 'bounty', label: '悬赏专区', icon: '🏆', subCategories: ['悬赏任务', '创意挑战'] },
]

const USERS: User[] = [
  { id: 'u1', nickname: '创意达人小A', avatar: '🧑‍💻', bio: '每天都在想一些奇怪的东西' },
  { id: 'u2', nickname: '未来观察家', avatar: '🔭', bio: '关注科技前沿的一切可能' },
  { id: 'u3', nickname: '生活魔法师', avatar: '🪄', bio: '把平凡变成不平凡' },
  { id: 'u4', nickname: '脑洞工程师', avatar: '⚡', bio: '构建不可能的世界' },
  { id: 'u5', nickname: '幻想旅行者', avatar: '🚀', bio: '在想象力的宇宙里漫游' },
]

export const SEED_IDEAS: Idea[] = [
  { id: 'i1', title: 'AI 穿搭镜：每天不用想穿什么', content: '一个带 AI 摄像头和屏幕的智能穿衣镜，每天早上扫一下你的脸+今天的天气日程，自动推荐搭配方案。还能虚拟试穿新衣服，不买也能看看效果。', highlight: '再也不会有「衣柜满满但没衣服穿」的焦虑了', author: USERS[0], isAnonymous: false, category: 'life', tags: ['AI', '智能家居', '懒人神器'], likes: 142, comments: 28, favorites: 67, createdAt: '2026-05-30T09:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i2', title: '用脑电波控制PPT翻页', content: '戴一个简易的脑电波头环，专注的时候PPT自动翻下一页，走神的时候暂停并闪烁提醒。适合演讲训练和开会时控制演讲节奏。', highlight: '再也不用偷偷在桌子底下找翻页笔了', author: USERS[1], isAnonymous: false, category: 'tech', tags: ['脑机接口', '办公工具', 'AI'], likes: 89, comments: 15, favorites: 43, createdAt: '2026-05-29T14:30:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i3', title: '流浪猫狗身份扫码喂食器', content: '在城市的流浪猫狗聚集点放置智能喂食器，每只动物脖子上挂一个防水二维码。扫码后投喂，同时记录投喂时间和健康数据。市民可以认领「赞助」某只动物的伙食费。', highlight: '用科技让流浪动物不再挨饿', author: USERS[2], isAnonymous: false, category: 'society', tags: ['公益', '宠物', '智能硬件'], likes: 256, comments: 42, favorites: 130, createdAt: '2026-05-28T10:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i4', title: '如果时间是一种货币你会怎么花？', content: '假设每个人每天有24小时的时间币，可以存储、借贷甚至交易。你可以用时间币买别人的时间（让人替你干活），也可以卖自己的时间。但时间币不能继承，人走币清。这会怎样改变社会？', highlight: '最公平也最残酷的经济体系', author: null, isAnonymous: true, category: 'fantasy', tags: ['社会实验', '哲学', '经济学'], likes: 320, comments: 89, favorites: 178, createdAt: '2026-05-27T16:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i5', title: 'AI自动生成游戏关卡，每天玩不完', content: '基于你之前的游戏风格，AI 实时生成完全新的关卡和敌人。每次进游戏都是独一无二的地图，没有重复感。BOSS 也会学习你的打法，越来越难。', highlight: '一款永远通关不了的游戏', author: USERS[3], isAnonymous: false, category: 'entertain', tags: ['AI', '游戏设计', '无限内容'], likes: 198, comments: 51, favorites: 95, createdAt: '2026-05-26T20:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i6', title: '共享阳台种菜计划', content: '小区里每家贡献一点阳台空间，连成一片智能菜园。有水肥一体化系统统一管理，住户用 app 认领自己的小区域，种什么邻里投票决定。收获的蔬菜按贡献分配。', highlight: '把阳台连起来，城市也能种菜', author: USERS[4], isAnonymous: false, category: 'life', tags: ['社区', '环保', '智能家居'], likes: 167, comments: 34, favorites: 82, createdAt: '2026-05-25T11:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i7', title: '用 AR 给现实世界贴「注释」', content: '戴 AR 眼镜走在街上，可以看到其他用户贴在真实物体上的虚拟注释。比如路过一棵树，看到「这棵银杏有120年了」；经过一家店，看到「这家的咖啡偏酸」。像给世界加了一层维基百科。', highlight: '现实世界的信息密度提升100倍', author: USERS[1], isAnonymous: false, category: 'tech', tags: ['AR', '社交', '信息'], likes: 234, comments: 63, favorites: 112, createdAt: '2026-05-24T08:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i8', title: '把微信步数换成电费折扣', content: '跟电力公司合作，每天走够8000步，当天的家庭用电打9折。走越多折扣越大。运动数据加密传输，只告诉电力公司「步数是否达标」而不暴露具体路径。', highlight: '迈开腿就是在省钱', author: null, isAnonymous: true, category: 'work', tags: ['健康', '激励', '数据隐私'], likes: 145, comments: 27, favorites: 59, createdAt: '2026-05-23T15:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
  { id: 'i9', title: '宠物情绪翻译项圈（悬赏5000元）', content: '一个智能项圈，通过分析狗叫的频率、音调、以及心率变化，用AI判断狗狗当前的情绪状态（开心、焦虑、生气、饿了）。翻译结果推送到手机，还会给出建议动作。', highlight: '终于知道你家狗子在想什么了', author: USERS[0], isAnonymous: false, category: 'life', tags: ['宠物', 'AI', '硬件'], likes: 312, comments: 76, favorites: 145, createdAt: '2026-05-22T12:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: true },
  { id: 'i10', title: '如果地球突然变成甜甜圈形状', content: '地理课要重写了。赤道变成甜甜圈的内圈，两极在甜甜圈的顶部和底部。引力场会怎么分布？海洋会流到哪里？文明会沿着内圈发展还是外圈？也许甜甜圈中心的空间站是最佳观景位。', highlight: '地理老师看了会沉默', author: USERS[4], isAnonymous: false, category: 'fantasy', tags: ['科学幻想', '物理', '荒诞'], likes: 278, comments: 93, favorites: 156, createdAt: '2026-05-21T19:00:00Z', likedByMe: false, favoritedByMe: false, isBounty: false },
]

export const SEED_COMMENTS: Comment[] = [
  { id: 'c1', ideaId: 'i1', author: USERS[1], content: '这个太有用了！每天早上选衣服确实是个大难题', createdAt: '2026-05-30T10:00:00Z', likes: 12 },
  { id: 'c2', ideaId: 'i1', author: USERS[3], content: '如果能结合衣柜里已有的衣服推荐搭配就更好了', createdAt: '2026-05-30T11:30:00Z', likes: 8 },
  { id: 'c3', ideaId: 'i3', author: USERS[4], content: '这个真的可以考虑落地，很多小区都有流浪猫问题', createdAt: '2026-05-28T14:00:00Z', likes: 23 },
  { id: 'c4', ideaId: 'i4', author: USERS[2], content: '让我想起了《时间规划局》那部电影，确实很有意思的设定', createdAt: '2026-05-27T18:00:00Z', likes: 45 },
  { id: 'c5', ideaId: 'i7', author: USERS[0], content: 'AR + 众包信息，这个组合太棒了', createdAt: '2026-05-24T10:00:00Z', likes: 15 },
  { id: 'c6', ideaId: 'i9', author: USERS[3], content: '我愿意出5000！我家狗天天对我叫我都不知道它要什么', createdAt: '2026-05-22T14:00:00Z', likes: 31 },
]

export const HOT_TAGS = ['AI', '智能家居', '环保', '懒人神器', '宠物', 'AR', '脑机接口', '公益', '科幻', '游戏设计', '健康', '社交', '教育', '社区']

export function getCategoryLabel(key: string): string {
  return CATEGORIES.find(c => c.key === key)?.label ?? key
}

export function getCategoryIcon(key: string): string {
  return CATEGORIES.find(c => c.key === key)?.icon ?? '💡'
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m}分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}小时前`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

export function filterIdeas(ideas: Idea[], sortMode: SortMode, category: string | null, tag: string | null, query: string): Idea[] {
  let filtered = [...ideas]
  if (category) filtered = filtered.filter(i => i.category === category)
  if (tag) filtered = filtered.filter(i => i.tags.includes(tag))
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q))
  }
  switch (sortMode) {
    case 'latest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
    case 'hot': filtered.sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2)); break
    case 'favorites': filtered.sort((a, b) => b.favorites - a.favorites); break
    case 'bounty': filtered = filtered.filter(i => i.isBounty); break
  }
  return filtered
}
