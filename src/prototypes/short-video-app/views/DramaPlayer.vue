<template>
  <div
    ref="playerEl"
    class="player-page"
    :class="{ 'landscape-mode': isLandscape }"
    :style="{ background: currentEpisode?.gradient || '#000' }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
  >
    <!-- 顶部导航栏 -->
    <div v-show="!isFullscreen && !isLandscape" class="top-nav">
      <button class="back-btn" @click="goBack">←</button>
      <div class="drama-info-top">
        <div class="drama-name">{{ dramaInfo.name }}</div>
        <div class="play-count">{{ dramaInfo.totalPlayCount }}</div>
      </div>
    </div>

    <!-- 横屏模式顶部导航 -->
    <transition name="fade">
      <div v-if="isLandscape && showLandscapeControls" class="landscape-top-nav" @click.stop>
        <div class="landscape-left">
          <button class="landscape-back-btn" @click.stop="exitLandscape">←</button>
          <div class="landscape-drama-info">
            <span class="landscape-drama-name">{{ dramaInfo.name }}</span>
            <span class="landscape-episode">第{{ currentEpisode.episode }}集</span>
          </div>
        </div>
        <button class="landscape-more-btn" @click.stop="showLandscapeMoreMenu">⋯</button>
      </div>
    </transition>

    <!-- 横屏模式底部控制栏 -->
    <transition name="fade">
      <div v-if="isLandscape && showLandscapeControls" class="landscape-bottom-controls" @click.stop>
        <!-- 进度条 -->
        <div class="landscape-progress-wrapper">
          <div class="landscape-time-display">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="separator">/</span>
            <span class="total-time">{{ formatTime(totalTime) }}</span>
          </div>
          <div class="landscape-progress-bar" @click="handleLandscapeProgressClick">
            <div class="landscape-progress-track">
              <div class="landscape-progress-played" :style="{ width: progress + '%' }"></div>
              <div class="landscape-progress-dot" :style="{ left: progress + '%' }"></div>
            </div>
          </div>
        </div>
        
        <!-- 控制按钮 -->
        <div class="landscape-controls-row">
          <button class="landscape-control-btn" @click="togglePlayPause">
            <span class="control-icon">{{ isPlaying ? '⏸' : '▶' }}</span>
          </button>
          <button class="landscape-control-btn" @click="showLandscapeSpeedMenu">
            <span class="control-text">{{ playbackSpeed }}x</span>
          </button>
          <button class="landscape-control-btn" @click="showLandscapeQualityMenu">
            <span class="control-text">{{ currentQuality }}</span>
          </button>
          <button class="landscape-control-btn" @click="toggleDanmaku">
            <span class="control-icon" :class="{ active: danmakuEnabled }">💬</span>
          </button>
          <button class="landscape-control-btn" @click="toggleFullscreenFromLandscape">
            <span class="control-icon">⛶</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- 视频区域：抖音式 3 屏轨道（prev/current/next）。轨道始终覆盖视口，滑动无缝衔接 -->
    <div
      class="video-stage"
      :class="{ 'landscape-video': isLandscape, 'fullscreen-video': isFullscreen }"
    >
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
        @click.stop="handleVideoClick"
        @touchstart.stop="handleVideoClick"
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
    <div v-show="!isFullscreen && !isLandscape" class="left-info">
      <div class="author-name">@{{ dramaInfo.author }}</div>
      <div class="episode-title">第{{ currentEpisode.episode }}集</div>
      <div class="episode-desc">{{ currentEpisode.description }}</div>
    </div>

    <!-- 右下角功能按钮 -->
    <div v-show="!isFullscreen && !isLandscape" class="right-actions">
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

      <!-- 更多 -->
      <div class="action-item" @click="showMoreMenu">
        <div class="action-icon">⋯</div>
        <div class="action-text">更多</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div
      v-show="!isLandscape"
      class="progress-bar-container"
      @click="handleProgressClick"
      @touchstart="handleProgressTouchStart"
      @touchmove="handleProgressTouchMove"
      @touchend="handleProgressTouchEnd"
    >
      <div class="progress-bar">
        <div class="progress-played" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 左侧倍速播放检测区域 -->
    <div 
      class="speed-play-zone"
      @pointerdown="onSpeedPlayDown"
      @pointermove="onSpeedPlayMove"
      @pointerup="onSpeedPlayUp"
      @pointercancel="onSpeedPlayUp"
    ></div>

    <!-- 底部短剧信息栏 / 全屏退出按钮 / 加速提示 -->
    <div
      v-show="!isLandscape"
      class="bottom-bar"
      :class="{ 'fullscreen-mode': isFullscreen }"
      @click.stop="handleBottomBarClick"
    >
      <!-- 加速模式 -->
      <div v-if="isSpeedPlaying" class="bottom-bar-content speed-content">
        <div class="speed-text">{{ isFullscreen ? '2x·全屏模式播放中' : '2x速播放中' }}</div>
      </div>
      <!-- 全屏模式 -->
      <div v-else-if="isFullscreen" class="bottom-bar-content fullscreen-content">
        <div class="fullscreen-exit-text">退出全屏</div>
      </div>
      <!-- 正常模式 -->
      <div v-else class="bottom-bar-content">
        <div class="drama-title">{{ dramaInfo.name }}</div>
        <div class="total-episodes">共{{ dramaInfo.totalEpisodes }}集</div>
        <div class="arrow-icon">▲</div>
      </div>
    </div>

    <!-- 更多菜单弹窗 -->
    <div v-if="showMoreMenuSheet && !isFullscreen" class="more-menu-sheet" @click.self="showMoreMenuSheet = false">
      <div class="more-menu-content" @click.stop>
        <!-- 顶部标题 -->
        <div class="more-menu-header">
          <div class="more-menu-title">更多</div>
          <div class="close-btn" @click="showMoreMenuSheet = false">✕</div>
        </div>

        <!-- 分享给好友区域 -->
        <div class="share-to-friends-section">
          <div class="share-to-friends-title">分享给好友</div>
          <div class="friends-scroll-container">
            <div class="friends-scroll-list">
              <div
                v-for="friend in displayedFriends"
                :key="friend.id"
                class="friend-item-horizontal"
                @click="selectFriendForShare(friend)"
              >
                <div class="friend-avatar-horizontal">{{ friend.avatar }}</div>
                <div class="friend-name-horizontal">{{ friend.name }}</div>
              </div>
              <div v-if="mutualFriends.length > 10" class="more-friends-item" @click="showMoreFriendsList = true">
                <div class="more-friends-icon">+</div>
                <div class="more-friends-text">更多好友</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 倍速选择 -->
        <div class="speed-section">
          <div class="speed-title">倍速</div>
          <div class="speed-options">
            <div
              v-for="speed in speedOptions"
              :key="speed"
              class="speed-option"
              :class="{ active: playbackSpeed === speed }"
              @click="selectSpeed(speed)"
            >
              {{ speed }}x
            </div>
          </div>
        </div>

        <!-- 全屏和横屏按钮 -->
        <div class="screen-controls">
          <div class="screen-control-btn" @click="toggleFullscreenFromMenu">
            <div class="screen-control-icon">⛶</div>
            <div class="screen-control-label">{{ isFullscreen ? '退出全屏' : '全屏' }}</div>
          </div>
          <div class="screen-control-btn" @click="toggleLandscape">
            <div class="screen-control-icon">🔄</div>
            <div class="screen-control-label">{{ isLandscape ? '退出横屏' : '横屏' }}</div>
          </div>
        </div>

        <!-- 功能键 -->
        <div class="function-keys">
          <div class="function-key" @click="toggleDanmaku">
            <div class="function-key-icon" :class="{ active: danmakuEnabled }">💬</div>
            <div class="function-key-label">{{ danmakuEnabled ? '关闭弹幕' : '开启弹幕' }}</div>
          </div>
          <div class="function-key" @click="openShareDialog">
            <div class="function-key-icon">📤</div>
            <div class="function-key-label">分享</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 更多好友列表半窗 -->
    <div v-if="showMoreFriendsList && !isFullscreen" class="more-friends-sheet" @click.self="showMoreFriendsList = false">
      <div class="more-friends-content" @click.stop>
        <div class="more-friends-header">
          <div class="more-friends-title">选择好友</div>
          <div class="close-btn" @click="showMoreFriendsList = false">✕</div>
        </div>
        <div class="more-friends-list">
          <div
            v-for="friend in mutualFriends"
            :key="friend.id"
            class="more-friend-item"
            @click="selectFriendForShare(friend)"
          >
            <div class="more-friend-avatar">{{ friend.avatar }}</div>
            <div class="more-friend-name">{{ friend.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享给好友弹窗（带视频封面和简介） -->
    <div v-if="showShareToFriendDialog && !isFullscreen" class="share-to-friend-dialog" @click.self="showShareToFriendDialog = false">
      <div class="share-to-friend-content" @click.stop>
        <!-- 视频封面和简介 -->
        <div class="share-video-preview">
          <div class="share-video-cover" :style="{ background: currentEpisode.gradient }">
            {{ currentEpisode.emoji }}
          </div>
          <div class="share-video-info">
            <div class="share-video-title">{{ dramaInfo.name }}</div>
            <div class="share-video-desc">第{{ currentEpisode.episode }}集 · {{ currentEpisode.description }}</div>
          </div>
        </div>

        <!-- 捎一句话输入框 -->
        <div class="share-message-wrapper">
          <textarea
            v-model="shareToFriendMessage"
            class="share-message-input"
            placeholder="捎一句话..."
            maxlength="100"
            rows="3"
          ></textarea>
          <div class="share-message-char-count">{{ shareToFriendMessage.length }}/100</div>
        </div>

        <!-- 分享和取消按钮 -->
        <div class="share-to-friend-footer">
          <button class="share-cancel-btn" @click="showShareToFriendDialog = false">取消</button>
          <button class="share-confirm-btn" @click="confirmShareToFriend">分享</button>
        </div>
      </div>
    </div>

    <!-- 分享弹窗（带输入框） -->
    <div v-if="showShareDialog && !isFullscreen" class="share-dialog" @click.self="showShareDialog = false">
      <div class="share-dialog-content" @click.stop>
        <!-- 顶部标题 -->
        <div class="share-dialog-header">
          <div class="share-dialog-title">分享到</div>
          <div class="close-btn" @click="showShareDialog = false">✕</div>
        </div>

        <!-- 输入框 -->
        <div class="share-dialog-input-wrapper">
          <textarea
            v-model="shareMessage"
            class="share-dialog-input"
            placeholder="说点什么..."
            maxlength="100"
            rows="3"
          ></textarea>
          <div class="share-dialog-char-count">{{ shareMessage.length }}/100</div>
        </div>

        <!-- 分享选项 -->
        <div class="share-dialog-options">
          <div class="share-dialog-option" @click="shareToWechat">
            <div class="share-dialog-icon wechat">💬</div>
            <div class="share-dialog-label">微信好友</div>
          </div>
          <div class="share-dialog-option" @click="shareToMoments">
            <div class="share-dialog-icon moments">🌐</div>
            <div class="share-dialog-label">朋友圈</div>
          </div>
          <div class="share-dialog-option" @click="copyLink">
            <div class="share-dialog-icon link">🔗</div>
            <div class="share-dialog-label">复制链接</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享给好友弹窗 -->
    <div v-if="showShareToFriendsDialog && !isFullscreen" class="share-friends-dialog" @click.self="showShareToFriendsDialog = false">
      <div class="share-friends-content" @click.stop>
        <!-- 顶部标题 -->
        <div class="share-friends-header">
          <div class="share-friends-title">分享给好友</div>
          <div class="close-btn" @click="showShareToFriendsDialog = false">✕</div>
        </div>

        <!-- 输入框 -->
        <div class="share-friends-input-wrapper">
          <textarea
            v-model="shareToFriendsMessage"
            class="share-friends-input"
            placeholder="说点什么..."
            maxlength="100"
            rows="3"
          ></textarea>
          <div class="share-friends-char-count">{{ shareToFriendsMessage.length }}/100</div>
        </div>

        <!-- 好友列表 -->
        <div class="friends-list">
          <div
            v-for="friend in mutualFriends"
            :key="friend.id"
            class="friend-item"
            :class="{ selected: selectedFriends.has(friend.id) }"
            @click="toggleFriendSelection(friend.id)"
          >
            <div class="friend-avatar">{{ friend.avatar }}</div>
            <div class="friend-name">{{ friend.name }}</div>
            <div class="friend-check" v-if="selectedFriends.has(friend.id)">✓</div>
          </div>
        </div>

        <!-- 发送按钮 -->
        <div class="share-friends-footer">
          <button class="share-friends-send-btn" @click="sendToFriends" :disabled="selectedFriends.size === 0">
            发送 ({{ selectedFriends.size }})
          </button>
        </div>
      </div>
    </div>

    <!-- 双击点赞爱心动画 -->
    <div v-if="showHeart" class="heart-animation" :style="heartStyle">
      ❤️
    </div>

    <!-- 评论半屏弹窗 -->
    <div v-if="showCommentSheet && !isFullscreen" class="comment-sheet" @click.self="showCommentSheet = false">
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
                  v-for="reply in getDisplayedReplies(comment)"
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
                
                <!-- 展开/收起更多回复按钮 -->
                <div 
                  v-if="getSortedReplies(comment).length > 2" 
                  class="expand-replies-btn"
                  @click="toggleRepliesExpanded(comment.id)"
                >
                  {{ isRepliesExpanded(comment.id) ? '收起' : `展开更多 ${getSortedReplies(comment).length - 2} 条回复` }}
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
    <div v-if="showEpisodeSheet && !isFullscreen" class="episode-sheet" @click.self="showEpisodeSheet = false">
      <div 
        class="sheet-content" 
        :class="{ 'sheet-fullscreen': isSheetFullscreen }"
        :style="{ maxHeight: episodeSheetHeight }"
        @click.stop
      >
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
            @click="switchCategory(category.id)"
          >
            {{ category.label }}
          </div>
        </div>

        <!-- 选集列表 -->
        <div 
          ref="episodeListRef"
          class="episode-list-grid"
          @scroll="handleEpisodeListScroll"
        >
          <div
            v-for="episode in filteredEpisodes"
            :key="episode.episode"
            class="episode-item-grid"
            :class="{ playing: episode.episode === currentEpisode.episode }"
            @click="selectEpisode(episode)"
          >
            <div class="episode-number-box">
              {{ episode.episode }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 横屏模式右侧更多菜单 -->
    <div v-if="showLandscapeMoreMenuSheet && isLandscape" class="landscape-more-menu-sheet" @click.self="showLandscapeMoreMenuSheet = false">
      <div class="landscape-more-menu-content" @click.stop>
        <div class="landscape-more-menu-header">
          <div class="landscape-more-menu-title">更多</div>
          <div class="close-btn" @click="showLandscapeMoreMenuSheet = false">✕</div>
        </div>

        <!-- 倍速选择 -->
        <div class="landscape-menu-section">
          <div class="landscape-section-title">倍速</div>
          <div class="landscape-speed-options">
            <div
              v-for="speed in speedOptions"
              :key="speed"
              class="landscape-speed-option"
              :class="{ active: playbackSpeed === speed }"
              @click="selectSpeed(speed)"
            >
              {{ speed }}x
            </div>
          </div>
        </div>

        <!-- 画质选择 -->
        <div class="landscape-menu-section">
          <div class="landscape-section-title">画质</div>
          <div class="landscape-quality-options">
            <div
              v-for="quality in qualityOptions"
              :key="quality"
              class="landscape-quality-option"
              :class="{ active: currentQuality === quality }"
              @click="selectQuality(quality)"
            >
              {{ quality }}
            </div>
          </div>
        </div>

        <!-- 功能键 -->
        <div class="landscape-menu-section">
          <div class="landscape-function-keys">
            <div class="landscape-function-key" @click="toggleDanmaku">
              <div class="landscape-function-key-icon" :class="{ active: danmakuEnabled }">💬</div>
              <div class="landscape-function-key-label">{{ danmakuEnabled ? '关闭弹幕' : '开启弹幕' }}</div>
            </div>
            <div class="landscape-function-key" @click="openShareDialog">
              <div class="landscape-function-key-icon">📤</div>
              <div class="landscape-function-key-label">分享</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast 提示 -->
  <transition name="toast-fade">
    <div v-if="toast.show" class="toast-message">
      {{ toast.message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
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

// 倍速播放相关状态
const isSpeedPlaying = ref(false)
const speedPlayZoneActive = ref(false)

// 全屏模式相关状态
const isFullscreen = ref(false)

// 是否显示选集半屏
const showEpisodeSheet = ref(false)

// 选集弹窗高度（动态调整）
const episodeSheetHeight = ref('70vh')
const episodeListRef = ref(null)
const initialScrollTop = ref(0)

// 判断弹窗是否全屏
const isSheetFullscreen = computed(() => {
  if (episodeSheetHeight.value.includes('px')) {
    const height = parseFloat(episodeSheetHeight.value)
    return height >= window.innerHeight * 0.95
  }
  return false
})

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

// 双击检测状态
let lastClickTime = 0
let lastClickX = 0
let lastClickY = 0
const DOUBLE_CLICK_DELAY = 300 // 双击间隔时间（ms）
const DOUBLE_CLICK_DISTANCE = 50 // 双击位置允许的最大距离（px）

const onPointerDown = (e) => {
  if (showEpisodeSheet.value || showCommentSheet.value || showShareSheet.value || showMoreMenuSheet.value || showShareDialog.value || showShareToFriendsDialog.value || showMoreFriendsList.value || showShareToFriendDialog.value) return
  if (isAnimating.value) return
  if (e.isPrimary === false) return

  // 在横屏或全屏模式下，检查是否点击在控制栏上
  if (isLandscape.value || isFullscreen.value) {
    const target = e.target
    const isControlElement = target.closest('.landscape-top-nav, .landscape-bottom-controls, .fullscreen-top-nav, .fullscreen-bottom-controls, .landscape-control-btn, .fullscreen-control-btn, .landscape-progress-bar, .fullscreen-progress-bar, .bottom-bar')
    if (isControlElement) {
      // 如果点击在控制栏上，不处理滑动逻辑
      return
    }
    // 在横屏/全屏模式下，允许点击视频区域来显示控件
    e.currentTarget?.setPointerCapture?.(e.pointerId)
    isPointerDown.value = true
    moved = false
    startY = e.clientY
    startX = e.clientX
    startTranslateY = trackTranslateY.value
    lastY = startY
    lastT = performance.now()
    return
  }

  // 检查点击目标是否为可交互元素（按钮、进度条、底部栏等）
  const target = e.target
  const isInteractiveElement = target.closest('.bottom-bar, .progress-bar-container, .right-actions, .top-nav, .left-info, .speed-play-zone')
  if (isInteractiveElement) {
    // 如果是可交互元素，不处理滑动逻辑，让点击事件正常触发
    return
  }

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
  if (showEpisodeSheet.value || showCommentSheet.value || showShareSheet.value || showMoreMenuSheet.value || showShareDialog.value || showShareToFriendsDialog.value || showMoreFriendsList.value || showShareToFriendDialog.value) return

  // 在横屏或全屏模式下，允许小幅移动（可能是手抖），但不触发滑动
  if (isLandscape.value || isFullscreen.value) {
    const dy = Math.abs(e.clientY - startY)
    const dx = Math.abs(e.clientX - startX)
    // 如果移动距离很小，不标记为移动，允许单击
    if (dy < 10 && dx < 10) {
      return
    }
    // 如果移动距离较大，标记为移动，但不触发滑动（横屏/全屏模式下不允许滑动切换集数）
    if (dy > 10 || dx > 10) {
      moved = true
    }
    return
  }

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
  
  const currentTime = performance.now()
  const currentX = e.clientX
  const currentY = e.clientY

  // 在横屏模式下，单击屏幕显示控件（不处理双击点赞）
  if (isLandscape.value) {
    if (!moved) {
      // 检查是否在可交互元素上
      const target = e.target
      const isInteractiveElement = target.closest('.landscape-top-nav, .landscape-bottom-controls, .landscape-control-btn, .landscape-progress-bar')

      if (!isInteractiveElement) {
        // 单击屏幕，显示控件
        handleLandscapeVideoClick()
      }
    }
    isPointerDown.value = false
    await resetToCenterNoTransition()
    return
  }

  // 全屏模式下，支持双击点赞
  if (isFullscreen.value) {
    if (!moved) {
      const target = e.target
      const isInteractiveElement = target.closest('.bottom-bar')

      if (!isInteractiveElement) {
        // 检测双击点赞
        const timeSinceLastClick = currentTime - lastClickTime
        const distanceFromLastClick = Math.sqrt(
          Math.pow(currentX - lastClickX, 2) + Math.pow(currentY - lastClickY, 2)
        )

        if (timeSinceLastClick < DOUBLE_CLICK_DELAY &&
            distanceFromLastClick < DOUBLE_CLICK_DISTANCE) {
          // 检测到双击，触发点赞动画
          triggerDoubleClickLike(e)
          lastClickTime = 0
          isPointerDown.value = false
          await resetToCenterNoTransition()
          return
        } else {
          // 记录点击信息
          lastClickTime = currentTime
          lastClickX = currentX
          lastClickY = currentY
        }
      }
    } else {
      // 有移动，重置双击检测
      lastClickTime = 0
    }
    isPointerDown.value = false
    await resetToCenterNoTransition()
    return
  }
  
    // 检测双击点赞（仅在非横屏/全屏模式下）
    if (!moved) {
      const timeSinceLastClick = currentTime - lastClickTime
      const distanceFromLastClick = Math.sqrt(
        Math.pow(currentX - lastClickX, 2) + Math.pow(currentY - lastClickY, 2)
      )
      
      // 检查是否在可交互元素上
      const target = e.target
      const isInteractiveElement = target.closest('.bottom-bar, .progress-bar-container, .right-actions, .top-nav, .left-info, .speed-play-zone')
      
      if (!isInteractiveElement && 
          timeSinceLastClick < DOUBLE_CLICK_DELAY && 
          distanceFromLastClick < DOUBLE_CLICK_DISTANCE) {
        // 检测到双击，触发点赞动画
        triggerDoubleClickLike(e)
        lastClickTime = 0 // 重置，避免连续触发
        isPointerDown.value = false
        await resetToCenterNoTransition()
        return
      } else {
        // 记录点击信息，等待可能的第二次点击
        lastClickTime = currentTime
        lastClickX = currentX
        lastClickY = currentY
      }
    } else {
      // 有移动，重置双击检测
      lastClickTime = 0
    }
  
  isPointerDown.value = false

  if (showEpisodeSheet.value || showCommentSheet.value || showShareSheet.value || showMoreMenuSheet.value || showShareDialog.value || showShareToFriendsDialog.value || showMoreFriendsList.value || showShareToFriendDialog.value) {
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

// 回复展开状态：记录每个评论的回复是否展开
const expandedReplies = ref(new Set())

// 更多菜单相关状态
const showMoreMenuSheet = ref(false)
const showShareDialog = ref(false)
const showShareToFriendsDialog = ref(false)
const showMoreFriendsList = ref(false)
const showShareToFriendDialog = ref(false)
const shareMessage = ref('')
const shareToFriendsMessage = ref('')
const shareToFriendMessage = ref('')
const selectedFriend = ref(null)
const playbackSpeed = ref(1.0)
const danmakuEnabled = ref(false)
const isLandscape = ref(false)

// 倍速选项
const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0, 3.0]

// 画质选项
const qualityOptions = ['流畅', '标清', '高清', '超清', '蓝光']
const currentQuality = ref('高清')

// 播放状态
const isPlaying = ref(true)

// 横屏模式菜单状态
const showLandscapeMoreMenuSheet = ref(false)
const showLandscapeControls = ref(true)
let landscapeControlsTimer = null

// 视频点击处理（显示/隐藏控制栏）
const handleVideoClick = (e) => {
  // 如果更多菜单已打开，不处理视频点击
  if (showLandscapeMoreMenuSheet.value || showMoreMenuSheet.value) {
    return
  }

  // 如果点击的是控制栏或其他交互元素，不处理
  const target = e.target
  const isControlElement = target.closest('.landscape-top-nav, .landscape-bottom-controls, .fullscreen-bottom-bar, .landscape-control-btn, .landscape-progress-bar, .landscape-progress-wrapper, .right-actions, .left-info, .top-nav, .bottom-bar, .landscape-more-btn, .landscape-back-btn, .landscape-more-menu-sheet, .landscape-more-menu-content, .more-menu-sheet')

  if (isControlElement) {
    return
  }

  // 在横屏模式下，单击屏幕显示控件
  if (isLandscape.value) {
    e.preventDefault()
    e.stopPropagation()
    handleLandscapeVideoClick()
  }
  // 全屏模式下不需要特殊处理，保持简洁
}

// 横屏模式视频点击处理（显示/隐藏控制栏）
const handleLandscapeVideoClick = () => {
  if (!isLandscape.value) return
  // 单击屏幕总是显示所有控件
  showLandscapeControls.value = true
  
  // 清除之前的定时器
  clearTimeout(landscapeControlsTimer)
  // 3秒后自动隐藏
  landscapeControlsTimer = setTimeout(() => {
    showLandscapeControls.value = false
  }, 3000)
}

// 格式化时间
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// 当前播放时间和总时长（模拟数据）
const currentTime = ref(0)
const totalTime = ref(180) // 3分钟

// 监听进度变化，更新当前时间
watch(progress, (newProgress) => {
  currentTime.value = (newProgress / 100) * totalTime.value
})

// 互相关注的好友列表（模拟数据，至少15个用于测试）
const mutualFriends = ref([
  { id: 1, name: '好友A', avatar: '👤' },
  { id: 2, name: '好友B', avatar: '👥' },
  { id: 3, name: '好友C', avatar: '👨' },
  { id: 4, name: '好友D', avatar: '👩' },
  { id: 5, name: '好友E', avatar: '😊' },
  { id: 6, name: '好友F', avatar: '🎭' },
  { id: 7, name: '好友G', avatar: '🎨' },
  { id: 8, name: '好友H', avatar: '🎪' },
  { id: 9, name: '好友I', avatar: '🎬' },
  { id: 10, name: '好友J', avatar: '🎯' },
  { id: 11, name: '好友K', avatar: '🎲' },
  { id: 12, name: '好友L', avatar: '🎸' },
  { id: 13, name: '好友M', avatar: '🎹' },
  { id: 14, name: '好友N', avatar: '🎺' },
  { id: 15, name: '好友O', avatar: '🎻' }
])

// 显示的好友（最多10个）
const displayedFriends = computed(() => {
  return mutualFriends.value.slice(0, 10)
})

// 双击点赞相关状态
const showHeart = ref(false)
const heartStyle = ref({})
let heartAnimationTimer = null

// 分享相关状态（保留用于兼容）
const showShareSheet = ref(false)

// 集数切换提示
const switchTip = ref({
  show: false,
  text: '',
  type: '' // 'next' or 'prev'
})

// Toast 提示
const toast = ref({
  show: false,
  message: ''
})
let toastTimer = null

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
      },
      {
        id: 12,
        userId: 'user7',
        userName: '剧迷小王',
        avatar: '🎬',
        content: '女主颜值真的绝了！',
        likes: 156,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '50分钟前',
        replyTo: '甜甜圈少女'
      },
      {
        id: 13,
        userId: 'user8',
        userName: '追剧小能手',
        avatar: '📺',
        content: '我已经三刷了！',
        likes: 78,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '30分钟前',
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
        likes: 245,
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
        likes: 123,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '3小时前',
        replyTo: '剧情分析师'
      },
      {
        id: 33,
        userId: 'user9',
        userName: '编剧观察员',
        avatar: '✍️',
        content: '编剧的功力确实深厚，这个反转设计得很巧妙',
        likes: 89,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '2小时前',
        replyTo: '剧情分析师'
      },
      {
        id: 34,
        userId: 'user10',
        userName: '剧情控',
        avatar: '🎭',
        content: '看到这里我都惊呆了！',
        likes: 67,
        heartbreaks: 0,
        isLiked: false,
        isHeartbroken: false,
        time: '1小时前',
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
  // 重置所有回复展开状态
  expandedReplies.value.clear()
}

// 获取排序后的回复列表（按点赞数降序）
const getSortedReplies = (comment) => {
  if (!comment.replies || comment.replies.length === 0) return []
  // 按点赞数降序排序
  return [...comment.replies].sort((a, b) => b.likes - a.likes)
}

// 获取要显示的回复列表
const getDisplayedReplies = (comment) => {
  const sortedReplies = getSortedReplies(comment)
  if (sortedReplies.length <= 2) {
    // 如果回复数少于等于2条，全部显示
    return sortedReplies
  }
  
  // 如果已展开，显示全部；否则只显示前2条（赞最多的）
  if (isRepliesExpanded(comment.id)) {
    return sortedReplies
  } else {
    return sortedReplies.slice(0, 2)
  }
}

// 检查回复是否已展开
const isRepliesExpanded = (commentId) => {
  return expandedReplies.value.has(commentId)
}

// 切换回复展开状态
const toggleRepliesExpanded = (commentId) => {
  if (expandedReplies.value.has(commentId)) {
    expandedReplies.value.delete(commentId)
  } else {
    expandedReplies.value.add(commentId)
  }
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
    // 回复评论或回复
    // 先尝试在主评论列表中找到（说明是回复主评论）
    let parentComment = commentsList.value.find(c => c.id === replyToComment.value.id)
    
    // 如果没找到，说明是回复某个回复，需要在所有评论的replies中查找
    if (!parentComment) {
      for (const comment of commentsList.value) {
        if (comment.replies && comment.replies.length > 0) {
          const foundReply = comment.replies.find(r => r.id === replyToComment.value.id)
          if (foundReply) {
            parentComment = comment
            break
          }
        }
      }
    }
    
    if (parentComment) {
      newComment.replyTo = replyToComment.value.userName
      // 确保replies数组存在
      if (!parentComment.replies) {
        parentComment.replies = []
      }
      parentComment.replies.push(newComment)
      // 新回复添加后，如果之前是展开状态，保持展开；否则不展开
      // 这样用户可以看到自己刚发的回复
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

// 显示更多菜单
const showMoreMenu = () => {
  showMoreMenuSheet.value = true
}

// 打开分享弹窗
const openShareDialog = () => {
  showMoreMenuSheet.value = false
  shareMessage.value = ''
  showShareDialog.value = true
}

// 选择好友进行分享
const selectFriendForShare = (friend) => {
  selectedFriend.value = friend
  shareToFriendMessage.value = ''
  showMoreFriendsList.value = false
  showShareToFriendDialog.value = true
}

// 确认分享给好友
const confirmShareToFriend = () => {
  if (!selectedFriend.value) return
  const message = shareToFriendMessage.value ? `\n留言：${shareToFriendMessage.value}` : ''
  showToast(`已分享给 ${selectedFriend.value.name}${message}`)
  showShareToFriendDialog.value = false
  shareToFriendMessage.value = ''
  selectedFriend.value = null
}

// 选择倍速
const selectSpeed = (speed) => {
  playbackSpeed.value = speed
}

// 切换横屏模式 - 跳转到独立的横屏播放页面
const toggleLandscape = () => {
  showMoreMenuSheet.value = false
  // 跳转到横屏播放页面，传递当前剧集信息
  router.push({
    path: `/drama/${route.params.id}/landscape`,
    query: { episode: currentEpisode.value.episode }
  })
}

// 退出横屏模式
const exitLandscape = () => {
  isLandscape.value = false
  showLandscapeMoreMenuSheet.value = false
  showLandscapeControls.value = true
  clearTimeout(landscapeControlsTimer)
}

// 显示横屏更多菜单
const showLandscapeMoreMenu = (e) => {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  showLandscapeMoreMenuSheet.value = true
  // 显示更多菜单时，保持控制栏显示
  showLandscapeControls.value = true
  clearTimeout(landscapeControlsTimer)
}

// 显示横屏倍速菜单
const showLandscapeSpeedMenu = () => {
  showLandscapeMoreMenuSheet.value = true
}

// 显示横屏画质菜单
const showLandscapeQualityMenu = () => {
  showLandscapeMoreMenuSheet.value = true
}

// 选择画质
const selectQuality = (quality) => {
  currentQuality.value = quality
  showLandscapeMoreMenuSheet.value = false
}

// 切换播放/暂停
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
}

// 退出全屏模式
const exitFullscreen = () => {
  isFullscreen.value = false
}

// 处理底部栏点击
const handleBottomBarClick = () => {
  if (isFullscreen.value) {
    // 全屏模式下，点击退出全屏
    isFullscreen.value = false
    return
  }
  if (isSpeedPlaying.value) {
    // 倍速模式下，不做任何操作
    return
  }
  // 正常模式，显示选集
  showEpisodeSheet.value = true
}

// 从菜单切换全屏
const toggleFullscreenFromMenu = () => {
  isFullscreen.value = !isFullscreen.value
  showMoreMenuSheet.value = false
}

// 切换弹幕
const toggleDanmaku = () => {
  danmakuEnabled.value = !danmakuEnabled.value
  showMoreMenuSheet.value = false
  // 这里可以添加实际的弹幕开关逻辑
}

// 双击点赞动画
const triggerDoubleClickLike = async (e) => {
  console.log('🎉 双击点赞触发！', { x: e.clientX, y: e.clientY })

  // 如果还没点赞，先点赞
  if (!currentEpisode.value.isLiked) {
    toggleLike()
  } else {
    // 如果已点赞，增加点赞数
    currentEpisode.value.likes++
  }

  // 清除之前的定时器和动画
  if (heartAnimationTimer) {
    clearTimeout(heartAnimationTimer)
    heartAnimationTimer = null
  }

  // 先隐藏之前的爱心（如果有）
  showHeart.value = false

  // 等待 DOM 更新
  await nextTick()

  // 计算点击位置
  const rect = playerEl.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  console.log('❤️ 爱心位置:', { x, y, rect })

  // 设置爱心位置（不设置 transform，让动画完全控制）
  heartStyle.value = {
    left: `${x}px`,
    top: `${y}px`
  }

  // 显示爱心并触发动画
  showHeart.value = true
  console.log('✅ 爱心显示状态:', showHeart.value)

  // 动画结束后隐藏（确保在动画完成后才隐藏）
  heartAnimationTimer = setTimeout(async () => {
    showHeart.value = false
    // 清空样式，确保下次显示时重新计算
    heartStyle.value = {}
    // 强制触发重排，确保元素被移除
    await nextTick()
  }, 1300) // 稍微长一点，确保动画完全结束
}

// 分享（保留用于兼容）
const share = () => {
  openShareDialog()
}

// 显示 Toast 提示
const showToast = (message) => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toast.value.message = message
  toast.value.show = true

  toastTimer = setTimeout(() => {
    toast.value.show = false
    toast.value.message = ''
  }, 2000)
}

// 分享给好友（批量）
const sendToFriends = () => {
  if (selectedFriends.value.size === 0) return

  const friendNames = Array.from(selectedFriends.value).map(id => {
    const friend = displayedFriends.value.find(f => f.id === id)
    return friend ? friend.name : ''
  }).filter(Boolean).join('、')

  const message = shareToFriendsMessage.value ? `\n留言：${shareToFriendsMessage.value}` : ''

  // 显示成功提示
  showToast(`已分享给 ${friendNames}${message}`)

  // 关闭弹窗并重置状态
  showShareToFriendsDialog.value = false
  shareToFriendsMessage.value = ''
  selectedFriends.value.clear()
}

// 分享到微信
const shareToWechat = () => {
  const message = shareMessage.value ? `\n留言：${shareMessage.value}` : ''
  showToast(`已分享到微信好友${message}`)
  showShareDialog.value = false
  shareMessage.value = ''
}

// 分享到朋友圈
const shareToMoments = () => {
  const message = shareMessage.value ? `\n留言：${shareMessage.value}` : ''
  showToast(`已分享到朋友圈${message}`)
  showShareDialog.value = false
  shareMessage.value = ''
}

// 复制链接
const copyLink = () => {
  const link = `https://example.com/drama/${dramaInfo.value.id}/episode/${currentEpisode.value.episode}`
  const message = shareMessage.value ? `\n${shareMessage.value}` : ''

  // 模拟复制成功
  showToast('链接已复制到剪贴板')
  showShareDialog.value = false
  shareMessage.value = ''
}

// 切换分集分类
const switchCategory = (categoryId) => {
  if (activeCategory.value === categoryId) return // 如果点击的是当前分类，不处理
  
  activeCategory.value = categoryId
  
  // 立即重置弹窗高度为半屏
  episodeSheetHeight.value = '70vh'
  
  // 等待 DOM 更新后滚动到列表顶部
  nextTick(() => {
    if (episodeListRef.value) {
      // 使用平滑滚动
      episodeListRef.value.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  })
}

// 选择集数
const selectEpisode = (episode) => {
  currentEpisodeIndex.value = episode.episode - 1
  showEpisodeSheet.value = false
  // 关闭时重置弹窗高度
  episodeSheetHeight.value = '70vh'
}

// 处理选集列表滚动
const handleEpisodeListScroll = (e) => {
  if (!episodeListRef.value) return
  
  const scrollTop = e.target.scrollTop
  const windowHeight = window.innerHeight
  const minHeight = windowHeight * 0.7 // 70vh
  const maxHeight = windowHeight // 100vh
  
  // 如果滚动到顶部，立即恢复半屏大小
  if (scrollTop <= 0) {
    episodeSheetHeight.value = '70vh'
    return
  }
  
  // 根据滚动距离计算弹窗高度
  // 向下滚动时，弹窗逐渐拉高
  // 设置一个阈值，滚动超过 30px 开始拉高
  const scrollThreshold = 30
  if (scrollTop > scrollThreshold) {
    // 计算拉高的比例（0-1），最大滚动距离设为 150px
    const maxScroll = 150
    const scrollProgress = Math.min((scrollTop - scrollThreshold) / maxScroll, 1)
    
    // 计算目标高度（从 70vh 到 100vh）
    const targetHeight = minHeight + (maxHeight - minHeight) * scrollProgress
    episodeSheetHeight.value = `${targetHeight}px`
  } else {
    // 滚动距离小于阈值，保持半屏
    episodeSheetHeight.value = '70vh'
  }
}

// 监听弹窗显示，重置状态
watch(showEpisodeSheet, (newVal) => {
  if (newVal) {
    // 打开弹窗时重置高度
    episodeSheetHeight.value = '70vh'
    // 等待 DOM 更新后记录初始滚动位置
    nextTick(() => {
      if (episodeListRef.value) {
        initialScrollTop.value = episodeListRef.value.scrollTop
      }
    })
  } else {
    // 关闭弹窗时重置高度
    episodeSheetHeight.value = '70vh'
  }
})

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

// 横屏模式进度条点击处理
const handleLandscapeProgressClick = (e) => {
  e.stopPropagation() // 阻止事件冒泡到视频区域
  const rect = e.currentTarget.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const newProgress = (clickX / rect.width) * 100
  progress.value = Math.max(0, Math.min(100, newProgress))
  // 更新当前时间
  currentTime.value = (progress.value / 100) * totalTime.value
  // 显示控制栏并重置隐藏定时器
  showLandscapeControls.value = true
  clearTimeout(landscapeControlsTimer)
  landscapeControlsTimer = setTimeout(() => {
    showLandscapeControls.value = false
  }, 3000)
}

// 从横屏模式切换全屏
const toggleFullscreenFromLandscape = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    // 进入全屏时，退出横屏模式
    exitLandscape()
  }
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

// ===== 倍速播放功能 =====
let speedPlayStartY = 0
let speedPlayStartX = 0
let speedPlayActivated = false // 是否已激活倍速播放
let speedPlayTimer = null // 倍速激活定时器

const onSpeedPlayDown = (e) => {
  if (showEpisodeSheet.value || showCommentSheet.value || showShareSheet.value || showMoreMenuSheet.value || showShareDialog.value || showShareToFriendsDialog.value || showMoreFriendsList.value || showShareToFriendDialog.value) return
  if (isAnimating.value) return
  if (e.isPrimary === false) return
  
  // 检查是否在左侧区域（屏幕左侧1/3）
  const screenWidth = window.innerWidth
  const leftZoneWidth = screenWidth / 3
  
  if (e.clientX <= leftZoneWidth) {
    // 检查是否点击在可交互元素上（进度条除外，因为进度条需要保留）
    const target = e.target
    const isInteractiveElement = target.closest('.right-actions, .top-nav, .left-info, .bottom-bar')
    if (isInteractiveElement) {
      return
    }
    
    // 如果弹窗打开，先关闭
    if (showEpisodeSheet.value) showEpisodeSheet.value = false
    if (showCommentSheet.value) showCommentSheet.value = false
    if (showShareSheet.value) showShareSheet.value = false
    if (showMoreMenuSheet.value) showMoreMenuSheet.value = false
    if (showShareDialog.value) showShareDialog.value = false
    if (showShareToFriendsDialog.value) showShareToFriendsDialog.value = false
    if (showMoreFriendsList.value) showMoreFriendsList.value = false
    if (showShareToFriendDialog.value) showShareToFriendDialog.value = false
    
    speedPlayZoneActive.value = true
    speedPlayActivated = false // 重置激活状态
    speedPlayStartY = e.clientY
    speedPlayStartX = e.clientX
    
    // 清除之前的定时器
    if (speedPlayTimer) {
      clearTimeout(speedPlayTimer)
      speedPlayTimer = null
    }
    
    // 长按200ms后自动激活倍速（如果手不动）
    speedPlayTimer = setTimeout(() => {
      if (speedPlayZoneActive.value && !speedPlayActivated) {
        speedPlayActivated = true
        isSpeedPlaying.value = true
      }
    }, 200)
    
    e.preventDefault()
    e.stopPropagation()
  }
}

// 监听全屏模式变化，自动关闭弹窗
watch(isFullscreen, (newVal) => {
  if (newVal) {
    // 进入全屏模式时关闭所有弹窗
    if (showEpisodeSheet.value) showEpisodeSheet.value = false
    if (showCommentSheet.value) showCommentSheet.value = false
    if (showShareSheet.value) showShareSheet.value = false
    if (showMoreMenuSheet.value) showMoreMenuSheet.value = false
    if (showShareDialog.value) showShareDialog.value = false
    if (showShareToFriendsDialog.value) showShareToFriendsDialog.value = false
    if (showMoreFriendsList.value) showMoreFriendsList.value = false
    if (showShareToFriendDialog.value) showShareToFriendDialog.value = false
  }
})

// 监听横屏模式变化
watch(isLandscape, (newVal) => {
  if (newVal) {
    showLandscapeControls.value = true
    clearTimeout(landscapeControlsTimer)
    landscapeControlsTimer = setTimeout(() => {
      showLandscapeControls.value = false
    }, 3000)
  } else {
    clearTimeout(landscapeControlsTimer)
  }
})

const onSpeedPlayMove = (e) => {
  if (!speedPlayZoneActive.value) return
  
  const dy = Math.abs(e.clientY - speedPlayStartY)
  const dx = Math.abs(e.clientX - speedPlayStartX)
  
  // 如果垂直移动距离大于水平移动距离，且超过阈值，说明用户在滑动，取消倍速播放
  if (dy > 15 && dy > dx * 1.5) {
    // 检测到明显的垂直滑动，取消倍速播放
    if (speedPlayTimer) {
      clearTimeout(speedPlayTimer)
      speedPlayTimer = null
    }
    isSpeedPlaying.value = false
    speedPlayZoneActive.value = false
    speedPlayActivated = false
    return
  }
  
  // 如果移动距离很小（可能是手抖），不影响倍速播放
  // 如果已经激活倍速，保持激活状态
  if (dy < 10 && dx < 10) {
    // 移动很小，不影响倍速播放
    // 如果定时器还在，说明还没激活，继续等待
    // 如果已经激活，保持激活状态
  } else {
    // 有移动但不够明显，如果还没激活则取消定时器
    if (!speedPlayActivated && speedPlayTimer) {
      clearTimeout(speedPlayTimer)
      speedPlayTimer = null
    }
    // 如果已经激活，保持激活状态（允许小幅移动）
    if (speedPlayActivated && (dy > 20 || dx > 20)) {
      // 移动太大，取消倍速
      isSpeedPlaying.value = false
      speedPlayActivated = false
    }
  }
  
  // 检查是否还在左侧区域
  const screenWidth = window.innerWidth
  const leftZoneWidth = screenWidth / 3
  
  if (e.clientX > leftZoneWidth) {
    // 移出左侧区域，取消倍速播放
    if (speedPlayTimer) {
      clearTimeout(speedPlayTimer)
      speedPlayTimer = null
    }
    isSpeedPlaying.value = false
    speedPlayZoneActive.value = false
    speedPlayActivated = false
  }
}

const onSpeedPlayUp = (e) => {
  if (speedPlayZoneActive.value) {
    // 清除定时器
    if (speedPlayTimer) {
      clearTimeout(speedPlayTimer)
      speedPlayTimer = null
    }
    
    // 松手时立即恢复原倍速（无论是否已激活）
    isSpeedPlaying.value = false
    speedPlayZoneActive.value = false
    speedPlayActivated = false
  }
}

// ===== 全屏模式功能 =====
const toggleFullscreen = (e) => {
  // 检查是否点击在可交互元素上
  const target = e.target
  const isInteractiveElement = target.closest('.bottom-bar, .progress-bar-container, .right-actions, .top-nav, .left-info, .speed-play-zone')
  if (isInteractiveElement) {
    return
  }
  
  // 如果弹窗打开，先关闭
  if (showEpisodeSheet.value) showEpisodeSheet.value = false
  if (showCommentSheet.value) showCommentSheet.value = false
  if (showShareSheet.value) showShareSheet.value = false
  if (showMoreMenuSheet.value) showMoreMenuSheet.value = false
  if (showShareDialog.value) showShareDialog.value = false
  if (showShareToFriendsDialog.value) showShareToFriendsDialog.value = false
  if (showMoreFriendsList.value) showMoreFriendsList.value = false
  if (showShareToFriendDialog.value) showShareToFriendDialog.value = false
  
  // 切换全屏模式
  isFullscreen.value = !isFullscreen.value
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
  transition: transform 0.3s ease;
}

/* 横屏模式 - 不使用旋转，直接全屏显示 */
.player-page.landscape-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: auto;
  touch-action: none;
  z-index: 9999;
  background: #000;
}

.player-page.landscape-mode .top-nav,
.player-page.landscape-mode .left-info,
.player-page.landscape-mode .right-actions,
.player-page.landscape-mode .bottom-bar,
.player-page.landscape-mode .progress-bar-container {
  display: none;
}

.video-stage.landscape-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: none;
  cursor: pointer;
  /* 确保可以接收点击事件 */
  pointer-events: auto;
  /* 设置较低的 z-index，确保更多菜单(z-index: 2000)在其上方 */
  z-index: 1;
}

.video-stage.fullscreen-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  /* 确保可以接收点击事件 */
  pointer-events: auto;
}

/* 全屏模式样式 */
.player-page:has(.fullscreen-video) {
  background: #000;
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

/* 横屏模式顶部导航 */
.landscape-top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 25;
  pointer-events: none;
}

.landscape-top-nav > * {
  pointer-events: auto;
  /* 确保所有子元素都可以点击 */
  position: relative;
  z-index: 26;
}

.landscape-top-nav .landscape-more-btn {
  z-index: 27;
}

.landscape-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.landscape-back-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 8px;
}

.landscape-drama-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.landscape-drama-name {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.landscape-episode {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.landscape-more-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 8px;
  z-index: 27;
  position: relative;
  /* 确保按钮可以点击 */
  pointer-events: auto;
  /* 添加点击反馈 */
  transition: opacity 0.2s;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landscape-more-btn:hover {
  opacity: 0.8;
}

.landscape-more-btn:active {
  opacity: 0.6;
  transform: scale(0.95);
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
  pointer-events: none; /* 不拦截点击事件 */
  z-index: 1; /* 确保爱心元素能显示在视频上方 */
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
  pointer-events: none; /* 不拦截点击事件 */
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
  pointer-events: none; /* 不拦截点击事件 */
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  pointer-events: none; /* 不拦截点击事件 */
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

/* 横屏模式底部控制栏 */
.landscape-controls {
  display: none;
}

/* 横屏模式底部控制栏 */
.landscape-bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0) 100%);
  z-index: 25;
  padding: 16px 20px 20px;
  pointer-events: none;
  /* 确保控制栏可见 */
  will-change: opacity;
}

.landscape-bottom-controls > * {
  pointer-events: auto;
}

/* 横屏模式进度条区域 */
.landscape-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.landscape-time-display {
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  font-size: 14px;
  white-space: nowrap;
  min-width: 100px;
}

.landscape-time-display .current-time {
  color: white;
}

.landscape-time-display .separator {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 2px;
}

.landscape-time-display .total-time {
  color: rgba(255, 255, 255, 0.8);
}

.landscape-progress-bar {
  flex: 1;
  height: 4px;
  cursor: pointer;
  position: relative;
}

.landscape-progress-track {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  position: relative;
  overflow: visible;
}

.landscape-progress-played {
  height: 100%;
  background: #ff4757;
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.1s ease;
}

.landscape-progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #ff4757;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  transition: left 0.1s ease;
}

/* 横屏模式控制按钮行 */
.landscape-controls-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.landscape-control-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  min-width: 44px;
}

.landscape-control-btn:active {
  opacity: 0.7;
}

.landscape-control-btn .control-icon {
  font-size: 24px;
  color: white;
}

.landscape-control-btn .control-icon.active {
  color: #ff4757;
}

.landscape-control-btn .control-text {
  font-size: 14px;
  color: white;
  white-space: nowrap;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 左侧倍速播放检测区域 */
.speed-play-zone {
  position: absolute;
  top: 0;
  left: 0;
  width: 33.333%;
  height: 100%;
  z-index: 5;
  /* 透明区域，不阻挡其他交互 */
  pointer-events: auto;
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
  z-index: 100;
  pointer-events: auto; /* 确保可以接收点击事件 */
}

/* 全屏模式下的底部栏 */
.bottom-bar.fullscreen-mode {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 25;
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

/* 全屏模式下的内容样式 */
.bottom-bar-content.fullscreen-content {
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.fullscreen-exit-text {
  font-size: 14px;
  font-weight: 500;
}

/* 加速模式下的内容样式 */
.bottom-bar-content.speed-content {
  justify-content: center;
  background: rgba(255, 165, 0, 0.3);
}

.speed-text {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.bottom-bar.speed-mode .bottom-bar-content {
  justify-content: center;
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

.speed-text-bottom {
  font-size: 16px;
  font-weight: bold;
  color: white;
  white-space: nowrap;
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
  transition: max-height 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.sheet-content.sheet-fullscreen {
  border-radius: 0;
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

/* 展开更多回复按钮 */
.expand-replies-btn {
  margin-top: 8px;
  padding: 4px 0;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
  display: inline-block;
}

.expand-replies-btn:hover {
  color: #667eea;
}

.expand-replies-btn:active {
  opacity: 0.7;
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

/* 更多菜单弹窗 */
.more-menu-sheet {
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

.more-menu-content {
  width: 100%;
  background: white;
  border-radius: 16px 16px 0 0;
  padding-bottom: 20px;
  animation: slideUp 0.3s ease;
}

.more-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.more-menu-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.more-menu-options {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;
}

.more-menu-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.more-menu-option:active {
  background: #f5f5f5;
}

.more-menu-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #f0f0f0;
}

.more-menu-icon.share-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.more-menu-icon.speed-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.more-menu-icon.fullscreen-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.more-menu-icon.danmaku-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.more-menu-icon.danmaku-icon.active {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.more-menu-icon.friends-icon {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.more-menu-label {
  font-size: 16px;
  color: #333;
  flex: 1;
}

/* 分享弹窗（带输入框） */
.share-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-dialog-content {
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.share-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.share-dialog-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.share-dialog-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.share-dialog-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
}

.share-dialog-input:focus {
  border-color: #667eea;
}

.share-dialog-char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999;
}

.share-dialog-options {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.share-dialog-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.share-dialog-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.share-dialog-icon.wechat {
  background: linear-gradient(135deg, #07c160 0%, #00d976 100%);
}

.share-dialog-icon.moments {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
}

.share-dialog-icon.link {
  background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
}

.share-dialog-label {
  font-size: 14px;
  color: #666;
}

/* 分享给好友弹窗 */
.share-friends-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-friends-content {
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.3s ease;
}

.share-friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.share-friends-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.share-friends-input-wrapper {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.share-friends-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
}

.share-friends-input:focus {
  border-color: #667eea;
}

.share-friends-char-count {
  position: absolute;
  bottom: 24px;
  right: 32px;
  font-size: 12px;
  color: #999;
}

.friends-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
  max-height: 300px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.friend-item:active {
  background: #f5f5f5;
}

.friend-item.selected {
  background: #e8edff;
}

.friend-avatar {
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

.friend-name {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.friend-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.share-friends-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.share-friends-send-btn {
  width: 100%;
  height: 44px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.share-friends-send-btn:hover {
  background: #5568d3;
}

.share-friends-send-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

/* 双击点赞爱心动画 - 仿抖音效果 */
.heart-animation {
  position: absolute;
  font-size: 80px;
  pointer-events: none;
  z-index: 9999;
  will-change: transform, opacity;
  animation: heartFloat 1.2s ease-out forwards;
  transform-origin: center center;
  animation-fill-mode: forwards;
  color: #ff2d55;
  text-shadow: 0 0 20px rgba(255, 45, 85, 0.8);
  filter: drop-shadow(0 0 10px rgba(255, 45, 85, 0.6));
}

@keyframes heartFloat {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0.8;
  }
  15% {
    transform: translate(-50%, -60px) scale(1.1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -100px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -180px) scale(0.6);
    opacity: 0;
    visibility: hidden;
  }
}


/* 选集列表网格样式 */
.episode-list-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 12px 16px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.episode-list-grid::-webkit-scrollbar {
  display: none;
}

.episode-item-grid {
  aspect-ratio: 1;
  cursor: pointer;
  transition: transform 0.2s;
}

.episode-item-grid:active {
  transform: scale(0.95);
}

.episode-item-grid.playing .episode-number-box {
  border: 2px solid #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.episode-number-box {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.episode-item-grid.playing .episode-number-box {
  background: #667eea;
  color: white;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* 更多菜单新样式 */
.share-to-friends-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.share-to-friends-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.friends-scroll-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
}

.friends-scroll-container::-webkit-scrollbar {
  display: none;
}

.friends-scroll-list {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.friend-item-horizontal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 60px;
  cursor: pointer;
  transition: transform 0.2s;
}

.friend-item-horizontal:active {
  transform: scale(0.95);
}

.friend-avatar-horizontal {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.friend-name-horizontal {
  font-size: 12px;
  color: #666;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-friends-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 60px;
  cursor: pointer;
  transition: transform 0.2s;
}

.more-friends-item:active {
  transform: scale(0.95);
}

.more-friends-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
  border: 2px dashed #ccc;
}

.more-friends-text {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 倍速选择 */
.speed-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.speed-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.speed-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.speed-option {
  padding: 8px 16px;
  border-radius: 20px;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  white-space: nowrap;
  flex-shrink: 0;
}

.speed-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.speed-option:active {
  transform: scale(0.95);
}

/* 全屏和横屏控制 */
.screen-controls {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.screen-control-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.screen-control-btn:active {
  transform: scale(0.95);
  background: #e8e8e8;
}

.screen-control-icon {
  font-size: 24px;
}

.screen-control-label {
  font-size: 14px;
  color: #333;
}

/* 功能键 */
.function-keys {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
}

.function-key {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.function-key:active {
  transform: scale(0.95);
  background: #e8e8e8;
}

.function-key-icon {
  font-size: 24px;
  transition: filter 0.2s;
}

.function-key-icon.active {
  filter: brightness(1.2);
}

.function-key-label {
  font-size: 14px;
  color: #333;
}

/* 更多好友列表半窗 */
.more-friends-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
}

.more-friends-content {
  width: 100%;
  max-height: 60vh;
  background: white;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.more-friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.more-friends-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.more-friends-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}

.more-friend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.more-friend-item:active {
  background: #f5f5f5;
}

.more-friend-avatar {
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

.more-friend-name {
  font-size: 16px;
  color: #333;
}

/* 分享给好友弹窗（带视频封面） */
.share-to-friend-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-to-friend-content {
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  animation: scaleIn 0.3s ease;
}

.share-video-preview {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.share-video-cover {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.share-video-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.share-video-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-video-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.share-message-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.share-message-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
}

.share-message-input:focus {
  border-color: #667eea;
}

.share-message-char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999;
}

.share-to-friend-footer {
  display: flex;
  gap: 12px;
}

.share-cancel-btn,
.share-confirm-btn {
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.share-cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.share-cancel-btn:active {
  background: #e8e8e8;
}

.share-confirm-btn {
  background: #667eea;
  color: white;
}

.share-confirm-btn:active {
  background: #5568d3;
}

/* 横屏模式右侧更多菜单 */
.landscape-more-menu-sheet {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
  pointer-events: auto;
}

.landscape-more-menu-content {
  width: 320px;
  background: white;
  height: 100%;
  animation: slideInRight 0.3s ease;
  overflow-y: auto;
  pointer-events: auto;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.landscape-more-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.landscape-more-menu-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.landscape-menu-section {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.landscape-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.landscape-speed-options,
.landscape-quality-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.landscape-speed-option,
.landscape-quality-option {
  padding: 8px 16px;
  border-radius: 20px;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  pointer-events: auto;
}

.landscape-speed-option:hover,
.landscape-quality-option:hover {
  background: #e8e8e8;
}

.landscape-speed-option:active,
.landscape-quality-option:active {
  background: #ddd;
}

.landscape-speed-option.active,
.landscape-quality-option.active {
  background: #667eea;
  color: white;
}

.landscape-function-keys {
  display: flex;
  gap: 12px;
}

.landscape-function-key {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.landscape-function-key:active {
  background: #e8e8e8;
}

.landscape-function-key-icon {
  font-size: 24px;
}

.landscape-function-key-icon.active {
  color: #667eea;
}

.landscape-function-key-label {
  font-size: 12px;
  color: #666;
}

/* Toast 提示样式 */
.toast-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 10000;
  max-width: 80%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

/* Toast 淡入淡出动画 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
