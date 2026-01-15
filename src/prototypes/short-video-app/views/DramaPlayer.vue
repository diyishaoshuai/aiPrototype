<template>
  <div
    ref="playerEl"
    class="player-page"
    :style="{ background: currentEpisode?.gradient || '#000' }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
  >
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="back-btn" @click="goBack">←</button>
      <div class="drama-info-top">
        <div class="drama-name">{{ dramaInfo.name }}</div>
        <div class="play-count">{{ dramaInfo.totalPlayCount }}</div>
      </div>
    </div>

    <!-- 视频区域：抖音式 3 屏轨道（prev/current/next）。轨道始终覆盖视口，滑动无缝衔接 -->
    <div class="video-stage">
      <div
        class="video-track"
        :class="{ transitioning: isAnimating && !noTransition }"
        :style="{
          transform: `translate3d(0, ${trackTranslateY}px, 0)`,
          transition: isAnimating && !noTransition
            ? 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'none'
        }"
        @transitionend="onTrackTransitionEnd"
      >
        <!-- prev -->
        <div class="video-slide">
          <div class="video-placeholder" :style="{ background: slidePrev.gradient }">
            {{ slidePrev.emoji }}
          </div>
        </div>

        <!-- current -->
        <div class="video-slide">
          <div class="video-placeholder" :style="{ background: slideCurrent.gradient }">
            {{ slideCurrent.emoji }}
          </div>
        </div>

        <!-- next -->
        <div class="video-slide">
          <div class="video-placeholder" :style="{ background: slideNext.gradient }">
            {{ slideNext.emoji }}
          </div>
        </div>
      </div>
    </div>

    <!-- 左下角信息区域 -->
    <div class="left-info">
      <div class="author-name">@{{ dramaInfo.author }}</div>
      <div class="episode-title">第{{ currentEpisode.episode }}集</div>
      <div class="episode-desc">{{ currentEpisode.description }}</div>
    </div>

    <!-- 右下角功能按钮 -->
    <div class="right-actions">
      <!-- 发布人头像 + 关注按钮 -->
      <div class="action-item avatar-wrapper">
        <div class="avatar">{{ dramaInfo.authorAvatar }}</div>
        <div class="follow-btn" :class="{ followed: isFollowed }" @click="toggleFollow">
          {{ isFollowed ? '✓' : '+' }}
        </div>
      </div>

      <!-- 喜欢 -->
      <div class="action-item" @click="toggleLike">
        <div class="action-icon" :class="{ active: currentEpisode.isLiked }">❤️</div>
        <div class="action-text">{{ formatCount(currentEpisode.likes) }}</div>
      </div>

      <!-- 评论 -->
      <div class="action-item" @click="showComments">
        <div class="action-icon">💬</div>
        <div class="action-text">{{ formatCount(currentEpisode.comments) }}</div>
      </div>

      <!-- 分享 -->
      <div class="action-item" @click="share">
        <div class="action-icon">📤</div>
        <div class="action-text">分享</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar-container" @click="handleProgressClick" @touchstart="handleProgressTouchStart" @touchmove="handleProgressTouchMove" @touchend="handleProgressTouchEnd">
      <div class="progress-bar">
        <div class="progress-played" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 底部短剧信息栏 -->
    <div class="bottom-bar" @click="showEpisodeSheet = true">
      <div class="bottom-bar-content">
        <div class="drama-title">{{ dramaInfo.name }}</div>
        <div class="total-episodes">共{{ dramaInfo.totalEpisodes }}集</div>
        <div class="arrow-icon">▲</div>
      </div>
    </div>

    <!-- 分享半屏弹窗 -->
    <div v-if="showShareSheet" class="share-sheet" @click.self="showShareSheet = false">
      <div class="share-content" @click.stop>
        <!-- 顶部标题 -->
        <div class="share-header">
          <div class="share-title">分享到</div>
          <div class="close-btn" @click="showShareSheet = false">✕</div>
        </div>

        <!-- 分享选项 -->
        <div class="share-options">
          <div class="share-option" @click="shareToWechat">
            <div class="share-icon wechat">💬</div>
            <div class="share-label">微信好友</div>
          </div>
          <div class="share-option" @click="shareToMoments">
            <div class="share-icon moments">🌐</div>
            <div class="share-label">朋友圈</div>
          </div>
          <div class="share-option" @click="copyLink">
            <div class="share-icon link">🔗</div>
            <div class="share-label">复制链接</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论半屏弹窗 -->
    <div v-if="showCommentSheet" class="comment-sheet" @click.self="showCommentSheet = false">
      <div class="comment-content" @click.stop>
        <!-- 顶部标题栏 -->
        <div class="comment-header">
          <div class="comment-title">{{ commentsList.length }} 条评论</div>
          <div class="close-btn" @click="showCommentSheet = false">✕</div>
        </div>

        <!-- 评论列表 -->
        <div class="comment-list">
          <div
            v-for="comment in commentsList"
            :key="comment.id"
            class="comment-item"
            :class="{ 'heartbroken': comment.isHeartbroken }"
          >
            <div class="comment-avatar">{{ comment.avatar }}</div>
            <div class="comment-main">
              <div class="comment-user-info">
                <span class="comment-username">{{ comment.userName }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <div class="comment-text" @click="replyComment(comment)">{{ comment.content }}</div>

              <!-- 评论操作按钮 -->
              <div class="comment-actions">
                <div class="action-btn" @click="toggleCommentLike(comment)">
                  <span :class="{ 'active': comment.isLiked }">❤️</span>
                  <span class="action-count">{{ comment.likes }}</span>
                </div>
                <div class="action-btn" @click="heartbreakComment(comment)">
                  <span :class="{ 'active': comment.isHeartbroken }">💔</span>
                </div>
              </div>

              <!-- 回复列表 -->
              <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                <div
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="reply-item"
                  :class="{ 'heartbroken': reply.isHeartbroken }"
                >
                  <div class="reply-avatar">{{ reply.avatar }}</div>
                  <div class="reply-main">
                    <div class="reply-user-info">
                      <span class="reply-username">{{ reply.userName }}</span>
                      <span class="reply-time">{{ reply.time }}</span>
                    </div>
                    <div class="reply-text" @click="replyComment(reply)">
                      <span class="reply-to">回复 @{{ reply.replyTo }}:</span>
                      {{ reply.content }}
                    </div>

                    <!-- 回复操作按钮 -->
                    <div class="comment-actions">
                      <div class="action-btn" @click="toggleCommentLike(reply)">
                        <span :class="{ 'active': reply.isLiked }">❤️</span>
                        <span class="action-count">{{ reply.likes }}</span>
                      </div>
                      <div class="action-btn" @click="heartbreakComment(reply, comment)">
                        <span :class="{ 'active': reply.isHeartbroken }">💔</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部输入框 -->
        <div class="comment-input-wrapper">
          <input
            v-model="commentInput"
            type="text"
            class="comment-input"
            :placeholder="replyToComment ? `回复 ${replyToComment.userName}:` : '说点什么...'"
            @keyup.enter="sendComment"
          />
          <button class="send-btn" @click="sendComment" :disabled="!commentInput.trim()">
            发送
          </button>
        </div>
      </div>
    </div>

    <!-- 选集半屏弹窗 -->
    <div v-if="showEpisodeSheet" class="episode-sheet" @click.self="showEpisodeSheet = false">
      <div class="sheet-content" @click.stop>
        <!-- 顶部短剧信息 -->
        <div class="sheet-header">
          <div class="sheet-drama-info">
            <div class="sheet-drama-title">{{ dramaInfo.name }}</div>
            <div class="sheet-total-episodes">共{{ dramaInfo.totalEpisodes }}集</div>
          </div>
          <div class="close-btn" @click="showEpisodeSheet = false">✕</div>
        </div>

        <!-- 短剧标签 -->
        <div class="drama-tags">
          <span v-for="tag in dramaInfo.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <!-- 短剧简介 -->
        <div class="drama-description">
          <div class="desc-text" :class="{ expanded: descExpanded }">
            {{ dramaInfo.description }}
          </div>
          <div class="expand-btn" @click="descExpanded = !descExpanded">
            {{ descExpanded ? '收起' : '展开' }}
          </div>
        </div>

        <!-- 分级分类 -->
        <div class="episode-categories">
          <div
            v-for="category in episodeCategories"
            :key="category.id"
            class="category-tab"
            :class="{ active: category.id === activeCategory }"
            @click="activeCategory = category.id"
          >
            {{ category.label }}
          </div>
        </div>

        <!-- 选集列表 -->
        <div class="episode-list">
          <div
            v-for="episode in filteredEpisodes"
            :key="episode.episode"
            class="episode-item"
            :class="{ playing: episode.episode === currentEpisode.episode }"
            @click="selectEpisode(episode)"
          >
            <div class="episode-cover" :style="{ background: episode.gradient }">
              {{ episode.emoji }}
            </div>
            <div class="episode-info">
              <div class="episode-title-row">
                <span class="episode-number">第{{ episode.episode }}集</span>
                <span class="separator">|</span>
                <span class="episode-brief">{{ episode.description }}</span>
              </div>
              <div class="episode-stats">
                <span class="duration">{{ episode.duration }}</span>
                <span class="play-count">{{ episode.playCount }}</span>
                <span class="like-count">{{ episode.likes }}赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 用真实容器高度做位移/阈值，避免 window.innerHeight 与实际可视高度不一致导致“中间露空白/黑屏”
const playerEl = ref(null)
const playerHeight = ref(window.innerHeight)
const measureHeight = () => {
  const h = playerEl.value?.clientHeight
  if (h && Number.isFinite(h) && h > 0) playerHeight.value = h
}

onMounted(() => {
  measureHeight()
  window.addEventListener('resize', measureHeight, { passive: true })
  // 移动端地址栏收起/展开会触发 visualViewport 变化
  window.visualViewport?.addEventListener('resize', measureHeight, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureHeight)
  window.visualViewport?.removeEventListener('resize', measureHeight)
})

// 短剧信息
const dramaInfo = ref({
  id: 1,
  name: '霸总的替身新娘',
  author: '短剧工作室',
  authorAvatar: '👤',
  totalEpisodes: 80,
  totalPlayCount: '1.2亿次播放',
  tags: ['都市', '霸总', '甜宠', '逆袭'],
  description: '她本是豪门千金，却因一场阴谋成为霸总的替身新娘。婚后，她以为只是一场交易，却不料霸总对她日渐沉沦。当真相揭开，她选择离开，他却红了眼眶："你是我的唯一，不是任何人的替身。"一场追妻火葬场就此展开...'
})

// 当前播放集数索引
const currentEpisodeIndex = ref(0)

// 是否关注
const isFollowed = ref(false)

// 是否显示选集半屏
const showEpisodeSheet = ref(false)

// 简介是否展开
const descExpanded = ref(false)

// 当前选中的分级
const activeCategory = ref(1)

// 视频进度（0-100）
const progress = ref(30)

// 生成80集的数据
const allEpisodes = ref(
  Array.from({ length: 80 }, (_, i) => ({
    episode: i + 1,
    description: `第${i + 1}集精彩剧情简介`,
    duration: '02:30',
    playCount: `${(80 - i) * 10}万`,
    likes: (80 - i) * 1000,
    comments: (80 - i) * 500,
    isLiked: false,
    emoji: ['💼', '👑', '🏯', '⚡', '💕', '💊', '💰', '🔥'][i % 8],
    gradient: [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ][i % 8]
  }))
)

// 当前播放的集数
const currentEpisode = computed(() => allEpisodes.value[currentEpisodeIndex.value])
const hasPrev = computed(() => currentEpisodeIndex.value > 0)
const hasNext = computed(() => currentEpisodeIndex.value < allEpisodes.value.length - 1)
const prevEpisode = computed(() => (hasPrev.value ? allEpisodes.value[currentEpisodeIndex.value - 1] : null))
const nextEpisode = computed(() => (hasNext.value ? allEpisodes.value[currentEpisodeIndex.value + 1] : null))

// 分级分类（每30集一个分级）
const episodeCategories = computed(() => {
  const categories = []
  const total = dramaInfo.value.totalEpisodes
  for (let i = 0; i < Math.ceil(total / 30); i++) {
    const start = i * 30 + 1
    const end = Math.min((i + 1) * 30, total)
    categories.push({
      id: i + 1,
      label: `${start}-${end}集`
    })
  }
  return categories
})

// 根据分级筛选的集数
const filteredEpisodes = computed(() => {
  const start = (activeCategory.value - 1) * 30
  const end = activeCategory.value * 30
  return allEpisodes.value.slice(start, end)
})

// ===== 抖音式滑动：3 屏轨道（prev/current/next）=====
const CENTER_Y = computed(() => -playerHeight.value) // 显示中间屏
const trackTranslateY = ref(CENTER_Y.value)
const isAnimating = ref(false)
const noTransition = ref(false)
const pendingDirection = ref('') // next | prev | ''

const fallbackSlide = computed(() => currentEpisode.value || allEpisodes.value[0])
const slidePrev = computed(() => prevEpisode.value || fallbackSlide.value)
const slideCurrent = computed(() => currentEpisode.value || fallbackSlide.value)
const slideNext = computed(() => nextEpisode.value || fallbackSlide.value)

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const resetToCenterNoTransition = async () => {
  noTransition.value = true
  await nextTick()
  trackTranslateY.value = CENTER_Y.value
  await nextTick()
  requestAnimationFrame(() => {
    noTransition.value = false
  })
}

// Pointer 手势状态
const isPointerDown = ref(false)
let startY = 0
let startX = 0
let startTranslateY = 0
let lastY = 0
let lastT = 0
let moved = false

const onPointerDown = (e) => {
  if (showEpisodeSheet.value || showCommentSheet.value || showShareSheet.value) return
  if (isAnimating.value) return
  if (e.isPrimary === false) return

  e.currentTarget?.setPointerCapture?.(e.pointerId)

  isPointerDown.value = true
  moved = false
  startY = e.clientY
  startX = e.clientX
  startTranslateY = trackTranslateY.value
  lastY = startY
  lastT = performance.now()
}

const onPointerMove = (e) => {
  if (!isPointerDown.value) return
  if (showEpisodeSheet.value || showCommentSheet.value || showShareSheet.value) return

  const dy = e.clientY - startY
  const dx = Math.abs(e.clientX - startX)
  const ady = Math.abs(dy)
  if (ady > 8 && ady > dx) {
    e.preventDefault()
    moved = true
  } else if (!moved) {
    return
  }

  // 边界阻尼
  let appliedDy = dy
  if (dy > 0 && !hasPrev.value) appliedDy = dy * 0.25
  if (dy < 0 && !hasNext.value) appliedDy = dy * 0.25

  const minY = -2 * playerHeight.value // 显示 next
  const maxY = 0 // 显示 prev
  trackTranslateY.value = clamp(startTranslateY + appliedDy, minY, maxY)

  lastY = e.clientY
  lastT = performance.now()
}

const settleAfterRelease = (dy, velocity) => {
  const threshold = playerHeight.value * 0.12
  const velocityThreshold = 0.6 // px/ms

  const shouldNext = (dy < -threshold) || (velocity < -velocityThreshold && Math.abs(dy) > 10)
  const shouldPrev = (dy > threshold) || (velocity > velocityThreshold && Math.abs(dy) > 10)

  if (shouldNext && hasNext.value) return 'next'
  if (shouldPrev && hasPrev.value) return 'prev'
  return 'back'
}

const onPointerUp = async (e) => {
  if (!isPointerDown.value) return
  isPointerDown.value = false

  if (showEpisodeSheet.value || showCommentSheet.value || showShareSheet.value) {
    await resetToCenterNoTransition()
    return
  }

  if (!moved) {
    // 点击不允许切集
    await resetToCenterNoTransition()
    return
  }

  const dy = e.clientY - startY
  const dt = Math.max(performance.now() - lastT, 1)
  const velocity = (e.clientY - lastY) / dt

  const action = settleAfterRelease(dy, velocity)
  // 关键：先让 transition class 生效，再改 transform，否则 Chrome 可能直接跳变而不触发 transitionend
  isAnimating.value = true
  await nextTick()

  if (action === 'back') {
    pendingDirection.value = ''
    trackTranslateY.value = CENTER_Y.value
    return
  }

  pendingDirection.value = action
  if (action === 'next') {
    trackTranslateY.value = -2 * playerHeight.value
  } else {
    trackTranslateY.value = 0
  }
}

const onPointerCancel = async () => {
  isPointerDown.value = false
  await resetToCenterNoTransition()
}

const onTrackTransitionEnd = async (e) => {
  if (e?.propertyName !== 'transform') return
  if (!isAnimating.value) return

  const dir = pendingDirection.value
  if (dir === 'next') currentEpisodeIndex.value++
  else if (dir === 'prev') currentEpisodeIndex.value--

  pendingDirection.value = ''
  isAnimating.value = false
  await resetToCenterNoTransition()
}

// 切换关注
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
}

// 切换点赞
const toggleLike = () => {
  currentEpisode.value.isLiked = !currentEpisode.value.isLiked
  if (currentEpisode.value.isLiked) {
    currentEpisode.value.likes++
  } else {
    currentEpisode.value.likes--
  }
}

// 评论相关状态
const showCommentSheet = ref(false)
const commentInput = ref('')
const replyToComment = ref(null)

// 分享相关状态
const showShareSheet = ref(false)

// 集数切换提示
const switchTip = ref({
  show: false,
  text: '',
  type: '' // 'next' or 'prev'
})

// 动画相关状态（旧实现遗留，已由轨道滑动 isAnimating/noTransition 接管）

// 模拟评论数据
const commentsList = ref([
  {
    id: 1,
    userId: 'user1',
    userName: '甜甜圈少女',
    avatar: '👧',
    content: '这部剧太好看了！女主好美！',
    likes: 1234,
    heartbreaks: 0,
    isLiked: false,
    isHeartbroken: false,
    time: '2小时前',
    replies: [
      {
        id: 11,
        userId: 'user2',
        userName: '追剧达人',
        avatar: '👨',
        content: '同意！剧情也很精彩',
        likes: 89,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '1小时前',
        replyTo: '甜甜圈少女'
      }
    ]
  },
  {
    id: 2,
    userId: 'user3',
    userName: '霸总收割机',
    avatar: '👩',
    content: '男主太帅了！这个霸总我可以！',
    likes: 2345,
    heartbreaks: 0,
    isLiked: false,
    isHeartbroken: false,
    time: '3小时前',
    replies: []
  },
  {
    id: 3,
    userId: 'user4',
    userName: '剧情分析师',
    avatar: '🧑',
    content: '这个反转我真的没想到，编剧太厉害了',
    likes: 567,
    heartbreaks: 0,
    isLiked: false,
    isHeartbroken: false,
    time: '5小时前',
    replies: [
      {
        id: 31,
        userId: 'user5',
        userName: '吃瓜群众',
        avatar: '👤',
        content: '确实，这个反转太精彩了',
        likes: 45,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '4小时前',
        replyTo: '剧情分析师'
      },
      {
        id: 32,
        userId: 'user6',
        userName: '短剧爱好者',
        avatar: '👥',
        content: '我也是！完全没猜到',
        likes: 23,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '3小时前',
        replyTo: '剧情分析师'
      }
    ]
  }
])

// 显示评论
const showComments = () => {
  showCommentSheet.value = true
  replyToComment.value = null
  commentInput.value = ''
}

// 点击评论准备回复
const replyComment = (comment, isReply = false) => {
  replyToComment.value = comment
  commentInput.value = ''
}

// 发送评论
const sendComment = () => {
  if (!commentInput.value.trim()) return

  const newComment = {
    id: Date.now(),
    userId: 'currentUser',
    userName: '我',
    avatar: '😊',
    content: commentInput.value,
    likes: 0,
    heartbreaks: 0,
    isLiked: false,
    isHeartbroken: false,
    time: '刚刚',
    replies: []
  }

  if (replyToComment.value) {
    // 回复评论
    const parentComment = commentsList.value.find(c => c.id === replyToComment.value.id)
    if (parentComment) {
      newComment.replyTo = replyToComment.value.userName
      parentComment.replies.push(newComment)
    }
  } else {
    // 评论视频
    commentsList.value.unshift(newComment)
  }

  commentInput.value = ''
  replyToComment.value = null
}

// 切换评论点赞
const toggleCommentLike = (comment) => {
  comment.isLiked = !comment.isLiked
  if (comment.isLiked) {
    comment.likes++
    if (comment.isHeartbroken) {
      comment.isHeartbroken = false
      comment.heartbreaks--
    }
  } else {
    comment.likes--
  }
}

// 点心碎
const heartbreakComment = (comment, parentComment = null) => {
  if (comment.isHeartbroken) return

  comment.isHeartbroken = true
  comment.heartbreaks++

  if (comment.isLiked) {
    comment.isLiked = false
    comment.likes--
  }

  // 添加淡出动画后删除评论
  setTimeout(() => {
    if (parentComment) {
      // 删除回复
      const index = parentComment.replies.findIndex(r => r.id === comment.id)
      if (index > -1) {
        parentComment.replies.splice(index, 1)
      }
    } else {
      // 删除主评论
      const index = commentsList.value.findIndex(c => c.id === comment.id)
      if (index > -1) {
        commentsList.value.splice(index, 1)
      }
    }
  }, 1000)
}

// 分享
const share = () => {
  showShareSheet.value = true
}

// 分享到微信
const shareToWechat = () => {
  alert('分享到微信好友')
  showShareSheet.value = false
}

// 分享到朋友圈
const shareToMoments = () => {
  alert('分享到朋友圈')
  showShareSheet.value = false
}

// 复制链接
const copyLink = () => {
  const link = `https://example.com/drama/${dramaInfo.value.id}/episode/${currentEpisode.value.episode}`
  navigator.clipboard.writeText(link).then(() => {
    alert('链接已复制到剪贴板')
    showShareSheet.value = false
  }).catch(() => {
    alert('复制失败，请手动复制')
  })
}

// 选择集数
const selectEpisode = (episode) => {
  currentEpisodeIndex.value = episode.episode - 1
  showEpisodeSheet.value = false
}

// 格式化数字
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 进度条相关
let progressTouching = false

const handleProgressClick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const newProgress = (clickX / rect.width) * 100
  progress.value = Math.max(0, Math.min(100, newProgress))
}

const handleProgressTouchStart = (e) => {
  progressTouching = true
  e.stopPropagation()
}

const handleProgressTouchMove = (e) => {
  if (!progressTouching) return
  e.preventDefault()
  e.stopPropagation()

  const touch = e.touches[0]
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()
  const touchX = touch.clientX - rect.left
  const newProgress = (touchX / rect.width) * 100
  progress.value = Math.max(0, Math.min(100, newProgress))
}

const handleProgressTouchEnd = (e) => {
  progressTouching = false
  e.stopPropagation()
}
</script>

<style scoped>
.player-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 背景由模板 inline style 跟随当前集渐变，避免切换时露黑 */
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 顶部导航栏 */
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 20;
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 8px;
  margin-right: 12px;
}

.drama-info-top {
  flex: 1;
}

.drama-name {
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 2px;
}

.play-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.video-stage {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.video-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300%;
  display: flex;
  flex-direction: column;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: layout paint;
}

.video-track.transitioning {
  /* 抖音式吸附曲线 */
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.video-slide {
  width: 100%;
  height: 33.3333%;
  flex: 0 0 33.3333%;
  background: inherit;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
}

/* 集数切换提示 */
.switch-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 20px 30px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 100;
}

.tip-icon {
  font-size: 32px;
  color: white;
}

.tip-text {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 左下角信息区域 */
.left-info {
  position: absolute;
  left: 16px;
  bottom: 80px;
  color: white;
  max-width: 60%;
  z-index: 10;
}

.author-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.episode-title {
  font-size: 14px;
  margin-bottom: 4px;
}

.episode-desc {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
}

/* 右下角功能按钮 */
.right-actions {
  position: absolute;
  right: 16px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 10;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid white;
}

.follow-btn {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff2d55;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #000;
  transition: all 0.3s;
}

.follow-btn.followed {
  background: #999;
}

.action-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  transition: transform 0.2s;
}

.action-icon.active {
  animation: heartBeat 0.3s;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.action-text {
  color: white;
  font-size: 12px;
  margin-top: 4px;
}

/* 进度条 */
.progress-bar-container {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 15;
  cursor: pointer;
  padding: 0;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.5);
  position: relative;
  overflow: hidden;
}

.progress-played {
  height: 100%;
  background: white;
  transition: width 0.1s ease;
}

/* 底部短剧信息栏 */
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  color: white;
  cursor: pointer;
  z-index: 10;
}

.bottom-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 0 16px;
  height: 48px;
}

.drama-title {
  font-size: 15px;
  font-weight: bold;
}

.total-episodes {
  font-size: 13px;
  opacity: 0.8;
}

.arrow-icon {
  font-size: 12px;
  opacity: 0.8;
}

/* 选集半屏弹窗 */
.episode-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sheet-content {
  width: 100%;
  max-height: 70vh;
  background: white;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sheet-drama-info {
  flex: 1;
}

.sheet-drama-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.sheet-total-episodes {
  font-size: 13px;
  color: #999;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.drama-tags {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.drama-description {
  padding: 0 16px 12px;
}

.desc-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.desc-text.expanded {
  display: block;
  -webkit-line-clamp: unset;
}

.expand-btn {
  color: #667eea;
  font-size: 13px;
  margin-top: 4px;
  cursor: pointer;
}

.episode-categories {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: visible;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.category-tab {
  padding: 6px 16px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-tab.active {
  background: #667eea;
  color: white;
}

.episode-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  -webkit-overflow-scrolling: touch;
}

.episode-list::-webkit-scrollbar {
  display: none;
}

.episode-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.episode-item.playing {
  background: #e8edff;
  border: 1px solid #667eea;
}

.episode-item:active {
  transform: scale(0.98);
}

.episode-cover {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.episode-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.episode-title-row {
  font-size: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.episode-number {
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.separator {
  color: #ccc;
}

.episode-brief {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.episode-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.episode-stats span {
  white-space: nowrap;
}

/* 评论半屏弹窗 */
.comment-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.comment-content {
  width: 100%;
  max-height: 70vh;
  background: white;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.comment-header .close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s;
}

.comment-header .close-btn:hover {
  background: #f5f5f5;
}

/* 评论列表 */
.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  transition: opacity 1s ease, transform 1s ease;
}

.comment-item.heartbroken {
  opacity: 0;
  transform: scale(0.8);
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.comment-main {
  flex: 1;
  min-width: 0;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
  cursor: pointer;
}

/* 评论操作按钮 */
.comment-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.action-btn:active {
  transform: scale(0.9);
}

.action-btn .active {
  filter: brightness(1.2);
}

.action-count {
  font-size: 12px;
  color: #999;
}

/* 回复列表 */
.replies-list {
  margin-top: 12px;
  padding-left: 12px;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  transition: opacity 1s ease, transform 1s ease;
}

.reply-item.heartbroken {
  opacity: 0;
  transform: scale(0.8);
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.reply-main {
  flex: 1;
  min-width: 0;
}

.reply-user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.reply-username {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.reply-time {
  font-size: 11px;
  color: #999;
}

.reply-text {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 6px;
  cursor: pointer;
}

.reply-to {
  color: #409eff;
  font-weight: 500;
}

/* 底部输入框 */
.comment-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.comment-input {
  flex: 1;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.comment-input:focus {
  border-color: #409eff;
}

.send-btn {
  height: 40px;
  padding: 0 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn:hover {
  background: #66b1ff;
}

.send-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

/* 分享半屏弹窗 */
.share-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.share-content {
  width: 100%;
  background: white;
  border-radius: 16px 16px 0 0;
  padding-bottom: 20px;
  animation: slideUp 0.3s ease;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.share-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.share-options {
  display: flex;
  justify-content: space-around;
  padding: 30px 20px;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.share-option:active {
  transform: scale(0.95);
}

.share-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  transition: all 0.3s;
}

.share-icon.wechat {
  background: linear-gradient(135deg, #07c160 0%, #00d976 100%);
}

.share-icon.moments {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
}

.share-icon.link {
  background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
}

.share-label {
  font-size: 14px;
  color: #666;
}
</style>
