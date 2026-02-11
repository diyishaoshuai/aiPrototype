<template>
  <div ref="streamingToolRef" class="streaming-tool" :class="{ 'is-full-window': windowSize === 'full', 'is-dragging': isDragging }" :style="windowStyle">
    <div class="app-title-bar" @mousedown="startWindowDrag">
      <div class="title-right">
        <button class="win-btn" @mousedown.stop>─</button>
        <button class="win-btn" @click="toggleWindowSize" @mousedown.stop>{{ windowSize === 'normal' ? '□' : '❐' }}</button>
        <button class="win-btn close" @mousedown.stop>×</button>
      </div>
    </div>

    <div class="main-layout">
      <!-- 左侧面板: 场景与素材 (260px) -->
      <aside class="left-panel">
        <div class="panel-header-v3">
          <div class="brand-logo">
            <div class="logo-icon">✨</div>
            <div class="logo-text">星趣主播端</div>
          </div>
        </div>

        <div class="panel-scroll">
          <!-- 直播场景 -->
          <section class="panel-section scene-section">
            <div class="section-header">
              <span class="header-label">场景</span>
              <button class="icon-add-btn" @click="createScene" title="新建">＋</button>
            </div>
            <div class="scene-grid">
              <div
                v-for="scene in scenes"
                :key="scene.id"
                class="scene-chip"
                :class="{ active: scene.id === activeScene }"
                @click="switchScene(scene.id)"
                @dblclick="startEditSceneName(scene)"
              >
                <div class="chip-number">{{ scene.id }}</div>
                <input
                  v-if="editingSceneId === scene.id"
                  v-model="editingSceneName"
                  class="chip-input"
                  @blur="finishEditSceneName"
                  @keyup.enter="finishEditSceneName"
                  @keyup.esc="cancelEditSceneName"
                  @click.stop
                />
                <div v-else class="chip-name">{{ scene.name }}</div>
                <button
                  v-if="scenes.length > 1"
                  class="chip-delete"
                  @click.stop="deleteScene(scene.id)"
                >×</button>
              </div>
            </div>
          </section>

          <!-- 画面素材 -->
          <section class="panel-section source-section">
            <div class="section-header">
              <span class="header-label">画面素材</span>
              <button class="text-add-btn" @click="showAddSource = true">添加素材</button>
            </div>
            <div class="source-list-v3">
              <div v-if="activeSceneData?.sources.length === 0" class="empty-state">
                <div class="empty-icon">📺</div>
                <p>请添加画面素材</p>
              </div>
              <Draggable 
                v-if="activeSceneData"
                v-model="activeSceneData.sources" 
                item-key="id"
                handle=".source-main"
                ghost-class="ghost-item"
                class="draggable-v3"
              >
                <template #item="{ element: source }">
                  <div class="source-card">
                    <div class="source-main">
                      <span class="type-icon">{{ getSourceIcon(source.type) }}</span>
                      <span class="source-name">{{ source.name }}</span>
                    </div>
                    <div class="source-ops">
                      <button class="op-btn" :class="{ disabled: !source.visible }" @click="toggleSourceVisible(source)">
                        {{ source.visible ? '👁️' : '🕶️' }}
                      </button>
                      <button class="op-btn" :class="{ locked: source.locked }" @click="toggleSourceLock(source)">
                        {{ source.locked ? '🔒' : '🔓' }}
                      </button>
                      <button class="op-btn" @click="deleteSource(source)">
                        🗑️
                      </button>
                    </div>
                  </div>
                </template>
              </Draggable>
            </div>
          </section>

          <!-- 功能网格 -->
          <section class="panel-section tools-section">
            <div class="section-header"><span class="header-label">互动与工具</span></div>
            <div class="tools-grid-v3">
              <div class="tool-item" :class="{ active: pkSession }" @click="openPkPanel">
                <div class="tool-icon">⚔️</div>
                <span class="tool-name">PK互动</span>
              </div>
              <div class="tool-item" :class="{ active: currentLink }" @click="openLinkPanel">
                <div class="tool-icon">🎤</div>
                <span class="tool-name">连麦</span>
              </div>
              <div class="tool-item" @click="showBeautyPanel = true">
                <div class="tool-icon">✨</div>
                <span class="tool-name">美化</span>
              </div>
              <div class="tool-item" @click="toggleMirror">
                <div class="tool-icon">🪞</div>
                <span class="tool-name">镜像</span>
              </div>
              <div class="tool-item" @click="showManagement = true">
                <div class="tool-icon">⚙️</div>
                <span class="tool-name">设置</span>
              </div>
            </div>
          </section>
        </div>
      </aside>

      <!-- 中间面板: 预览与控制 (自适应) -->
      <main class="center-panel">
        <header class="stream-header-v3">
          <div class="header-left">
            <div class="stream-info-v3">
              <div class="stream-cover" :style="streamCoverStyle"></div>
              <div class="stream-text">
                <div class="stream-title-row">
                  <span class="stream-title">{{ streamTitle }}</span>
                  <button class="edit-btn" @click="openStreamEdit">
                    <span class="edit-icon">✎</span>
                  </button>
                </div>
                <div class="stream-meta-v3">
                  <span class="meta-item">#{{ streamTag }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="header-right">
            <div class="window-actions-v3">
              <div class="orientation-toggle">
                <button
                  class="orientation-btn"
                  :class="{ active: orientation === 'landscape', disabled: isStreaming }"
                  :disabled="isStreaming"
                  @click="setOrientation('landscape')"
                >
                  横屏
                </button>
                <button
                  class="orientation-btn"
                  :class="{ active: orientation === 'portrait', disabled: isStreaming }"
                  :disabled="isStreaming"
                  @click="setOrientation('portrait')"
                >
                  竖屏
                </button>
              </div>
            </div>
          </div>
        </header>

        <div class="main-stage-v3">
          <div class="preview-area" :class="[orientation, { 'is-mirror': mirrorEnabled }]" :style="stageBackgroundStyle">
            <div class="stage-random-bg" :style="stageBackgroundStyle"></div>
            <canvas
              v-if="currentStream || activeSceneData?.sources.length > 0"
              ref="canvasRef"
              :width="canvasSize.width"
              :height="canvasSize.height"
            ></canvas>
            <div v-else class="stage-placeholder-v3" @click="handleAddCamera">
              <div class="placeholder-content">
                <div class="big-icon-wrapper">
                  <div class="big-icon">🎥</div>
                  <div class="icon-glow"></div>
                </div>
                <h3>准备就绪</h3>
                <p>添加摄像头或捕获屏幕素材开始直播</p>
                <button class="primary-btn-v3">立即添加素材</button>
              </div>
            </div>

            <div v-if="currentLink" class="link-overlay">
              <div v-if="currentLink.role === 'host'" class="link-split">
                <div class="link-half">
                  <div class="link-title">本地主播</div>
                  <div class="link-badge">{{ currentLink.mode === 'video' ? '视频连麦' : '语音连麦' }}</div>
                </div>
                <div class="link-half">
                  <div class="link-title">{{ currentLink.name }}</div>
                  <div class="link-badge">{{ currentLink.mode === 'video' ? '视频连麦' : '语音连麦' }}</div>
                </div>
              </div>
              <div v-else class="link-window">
                <div class="link-title">{{ currentLink.name }}</div>
                <div class="link-badge">{{ currentLink.mode === 'video' ? '视频连麦' : '语音连麦' }}</div>
              </div>
            </div>

            <div v-if="pkSession" class="pk-banner">
              <span>{{ pkSession.label }}</span>
              <span v-if="pkSession.duration">· {{ pkSession.duration }}分钟</span>
            </div>

            <div v-if="pkSession" class="pk-overlay">
              <div class="pk-bar">
                <span class="pk-score left">{{ pkSession.leftScore }}</span>
                <div class="pk-gauge">
                  <div class="pk-left" :style="{ width: pkLeftRatio + '%' }"></div>
                  <div class="pk-right" :style="{ width: pkRightRatio + '%' }"></div>
                </div>
                <span class="pk-score right">{{ pkSession.rightScore }}</span>
              </div>
              <div class="pk-split">
                <div class="pk-half left"></div>
                <div class="pk-half right"></div>
              </div>
            </div>
          </div>
        </div>

        <footer class="stream-footer-v3">
          <div class="audio-mixer-v3">
            <div class="mixer-item">
              <div class="mixer-row">
                <button class="mixer-toggle" :class="{ muted: micMuted }" @click="toggleMicMute">
                  {{ micMuted ? '🔇' : '🎤' }}
                </button>
                <span class="mixer-label">麦克风</span>
                <div class="mixer-slider-v3">
                  <div class="slider-bg">
                    <div class="slider-bar" :style="{ width: micVolume + '%' }"></div>
                  </div>
                  <input v-model="micVolume" type="range" min="0" max="100" @input="handleMicVolumeChange" />
                </div>
              </div>
            </div>
            <div class="mixer-item">
              <div class="mixer-row">
                <button class="mixer-toggle" :class="{ muted: systemMuted }" @click="toggleSystemMute">
                  {{ systemMuted ? '🔇' : '🔊' }}
                </button>
                <span class="mixer-label">扬声器</span>
                <div class="mixer-slider-v3">
                  <div class="slider-bg">
                    <div class="slider-bar" :style="{ width: systemVolume + '%' }"></div>
                  </div>
                  <input v-model="systemVolume" type="range" min="0" max="100" @input="handleSystemVolumeChange" />
                </div>
              </div>
            </div>
          </div>

          <div class="perf-monitor-v3">
            <div class="perf-item">
              <span class="perf-label">CPU</span>
              <span class="perf-value" :class="{ 'warning': perfData.cpu > 50 }">{{ perfData.cpu }}%</span>
            </div>
            <div class="perf-item">
              <span class="perf-label">网速</span>
              <span class="perf-value">{{ perfData.bitrate }}kbps</span>
            </div>
          </div>

          <div class="live-action-v3">
            <button
              class="main-live-btn"
              :class="{ 'is-live': isStreaming }"
              @click="toggleStream"
            >
              <span v-if="!isStreaming">开始直播</span>
              <span v-else class="live-btn-content">
                <span class="live-btn-label">直播中</span>
                <span class="live-btn-time">{{ liveDurationFormatted }}</span>
              </span>
            </button>
          </div>
        </footer>
      </main>

      <!-- 右侧面板: 聊天与榜单 (320px) -->
      <aside class="right-panel">
        <div class="right-section rank-section">
          <div class="section-header">
            <span>观众榜单</span>
            <span class="rank-count">{{ liveStats.viewers }}</span>
          </div>
          <div class="rank-tabs">
            <button class="rank-tab" :class="{ active: activeRankTab === 'online' }" @click="activeRankTab = 'online'">在线观众</button>
            <button class="rank-tab" :class="{ active: activeRankTab === 'fun' }" @click="activeRankTab = 'fun'">趣味榜</button>
            <button class="rank-tab" :class="{ active: activeRankTab === 'luxury' }" @click="activeRankTab = 'luxury'">奢侈榜</button>
          </div>
          <div class="rank-subtabs" v-if="activeRankTab === 'luxury' || activeRankTab === 'fun'">
            <button
              class="rank-subtab"
              :class="{ active: (activeRankTab === 'luxury' ? luxuryTab : funTab) === 'day' }"
              @click="activeRankTab === 'luxury' ? (luxuryTab = 'day') : (funTab = 'day')"
            >
              日榜
            </button>
            <button
              class="rank-subtab"
              :class="{ active: (activeRankTab === 'luxury' ? luxuryTab : funTab) === 'week' }"
              @click="activeRankTab === 'luxury' ? (luxuryTab = 'week') : (funTab = 'week')"
            >
              周榜
            </button>
          </div>
          <div class="audience-rank-list">
            <div v-for="(aud, index) in currentRankList" :key="aud.id" class="rank-item">
            <button class="user-trigger" @click.stop="openUserCardFromRank(aud, $event)">
              <div class="rank-avatar" :class="'rank-' + (index + 1)">{{ aud.emoji }}</div>
              <div class="rank-info">
                <div class="rank-name">{{ aud.nickname }}</div>
              </div>
            </button>
            <span class="rank-score">{{ aud.contribution }}</span>
            </div>
          </div>
        </div>

        <div class="right-section chat-section">
          <div class="section-header">互动聊天</div>
          <transition-group name="chat-msg" tag="div" class="chat-messages" ref="messageListRef">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-item"
              :class="[msg.type, { 'is-self': msg.user === '我' }]"
            >
              <div class="msg-bubble" v-if="msg.type === 'text'">
                <button class="msg-user-btn" @click.stop="openUserCardByName(msg.user, $event)">{{ msg.user }}</button>
                <span class="msg-content">{{ msg.content }}</span>
              </div>
              <div class="msg-sys" v-else>
                <span class="sys-dot"></span>
                {{ msg.content }}
              </div>
            </div>
          </transition-group>

          <div class="chat-input-v4">
            <div class="input-toolbar">
              <button class="tool-btn">😊</button>
              <button class="tool-btn">🎁</button>
              <span class="input-limit">{{ messageText.length }}/50</span>
            </div>
            <div class="input-container">
              <input
                v-model="messageText"
                placeholder="发送弹幕与观众交流..."
                @keyup.enter="sendMessage"
              />
              <button class="btn-send" :disabled="!messageText.trim()" @click="sendMessage">
                发送
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div v-if="showStreamEdit" class="modal-overlay" @click="closeStreamEdit">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <span>编辑直播信息</span>
          <button class="modal-close" @click="closeStreamEdit">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label>封面</label>
            <div class="cover-uploader">
              <div class="cover-preview" :style="coverPreviewStyle"></div>
              <div class="cover-actions">
                <button class="btn-secondary" @click="triggerCoverUpload">上传图片</button>
                <input ref="coverInputRef" type="file" accept="image/*" @change="handleCoverUpload" />
              </div>
            </div>
          </div>
          <div class="form-row">
            <label>标题</label>
            <input v-model="editStreamTitle" placeholder="输入直播间标题" />
          </div>
          <div class="form-row">
            <label>标签</label>
            <select v-model="editStreamTag" class="tag-select">
              <option value="颜值">颜值</option>
              <option value="舞蹈">舞蹈</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeStreamEdit">取消</button>
          <button class="btn-primary" @click="saveStreamEdit">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showLinkPanel" class="modal-overlay" @click="closeLinkPanel">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <span>连麦列表</span>
          <button class="modal-close" @click="closeLinkPanel">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <div class="section-title">主播</div>
            <div class="link-list">
              <div v-for="host in linkHosts" :key="host.id" class="link-item">
                <div class="link-name">{{ host.name }}</div>
                <div class="link-actions">
                  <button class="btn-ghost" @click="startLink(host, 'video')">视频连麦</button>
                  <button class="btn-ghost" @click="startLink(host, 'voice')">语音连麦</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-section">
            <div class="section-title">观众</div>
            <div class="link-list">
              <div v-for="viewer in linkViewers" :key="viewer.id" class="link-item">
                <div class="link-name">{{ viewer.name }}</div>
                <div class="link-actions">
                  <button class="btn-ghost" @click="startLink(viewer, 'video')">视频连麦</button>
                  <button class="btn-ghost" @click="startLink(viewer, 'voice')">语音连麦</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="currentLink" class="btn-secondary" @click="endLink">结束连麦</button>
          <button class="btn-primary" @click="closeLinkPanel">完成</button>
        </div>
      </div>
    </div>

    <div v-if="showPkPanel" class="modal-overlay" @click="closePkPanel">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <span>PK互动</span>
          <button class="modal-close" @click="closePkPanel">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <div class="section-title">匹配PK</div>
            <button class="btn-primary full-width" @click="startMatchPk">随机匹配主播</button>
          </div>
          <div class="modal-section">
            <div class="section-title">与连麦主播PK</div>
            <div class="pk-duration">
              <button class="btn-ghost" :class="{ active: pkDuration === 3 }" @click="pkDuration = 3">3分钟</button>
              <button class="btn-ghost" :class="{ active: pkDuration === 5 }" @click="pkDuration = 5">5分钟</button>
            </div>
            <button class="btn-primary full-width" :disabled="!canPkWithHost" @click="startHostPk">
              与当前连麦主播PK
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="pkSession" class="btn-secondary" @click="endPk">结束PK</button>
          <button class="btn-primary" @click="closePkPanel">完成</button>
        </div>
      </div>
    </div>

    <!-- 美颜弹窗 -->
    <BeautyPanel
      :visible="showBeautyPanel"
      @close="showBeautyPanel = false"
      @apply="handleBeautyApply"
    />

    <div v-if="showManagement" class="modal-overlay" @click="showManagement = false">
      <div class="modal-card modal-lg" @click.stop>
        <div class="modal-header">
          <span>直播间管理</span>
          <button class="modal-close" @click="showManagement = false">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <div class="section-title">拉黑列表</div>
            <div class="link-list">
              <div v-for="item in blacklist" :key="item.id" class="link-item">
                <div class="link-name">{{ item.name }}</div>
                <button class="link-action" @click="unblockUser(item.id)">取消拉黑</button>
              </div>
            </div>
          </div>
          <div class="modal-section">
            <div class="section-title">禁言列表</div>
            <div class="link-list">
              <div v-for="item in muteList" :key="item.id" class="link-item">
                <div class="link-name">{{ item.name }}</div>
                <button class="link-action" @click="unmuteUser(item.id)">取消禁言</button>
              </div>
            </div>
          </div>
          <div class="modal-section">
            <div class="section-title">添加屏蔽词</div>
            <div class="blocked-words">
              <div class="blocked-tags">
                <span v-for="word in blockedWords" :key="word" class="tag-chip">{{ word }}</span>
              </div>
              <div class="blocked-input">
                <input v-model="blockedWordInput" placeholder="输入屏蔽词" />
                <button class="btn-primary" @click="addBlockedWord">添加</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="showManagement = false">完成</button>
        </div>
      </div>
    </div>

    <div v-if="showAddSource" class="modal-overlay" @click="showAddSource = false">
      <div class="modal-card modal-lg" @click.stop>
        <div class="modal-header">
          <span>添加画面素材</span>
          <button class="modal-close" @click="showAddSource = false">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <div class="section-title">外接设备</div>
            <div class="source-grid">
              <button class="source-tile" @click="addSource('camera', '摄像头')">摄像头</button>
              <button class="source-tile" @click="addSource('ios', 'iOS投屏')">iOS投屏</button>
              <button class="source-tile" @click="addSource('android', '安卓投屏')">安卓投屏</button>
              <button class="source-tile" @click="addSource('mobile', '手机摄像头')">手机摄像头</button>
            </div>
          </div>
          <div class="modal-section">
            <div class="section-title">多媒体</div>
            <div class="source-grid">
              <button class="source-tile" @click="addSource('media', '视频')">视频</button>
              <button class="source-tile" @click="addSource('image', '图片')">图片</button>
              <button class="source-tile" @click="addSource('text', '文字')">文字</button>
            </div>
          </div>
          <div class="modal-section">
            <div class="section-title">画面捕捉</div>
            <div class="source-grid">
              <button class="source-tile" @click="addSource('process', '进程')">进程</button>
              <button class="source-tile" @click="addSource('screen', '全屏')">全屏</button>
              <button class="source-tile" @click="addSource('window', '窗口')">窗口</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="showAddSource = false">完成</button>
        </div>
      </div>
    </div>

    <div v-if="userCard.visible" class="user-card-popover" :style="userCardStyle">
      <div class="user-card-header">
        <div class="user-avatar">{{ userCard.user.avatar }}</div>
        <div class="user-meta">
          <div class="user-name">{{ userCard.user.name }}</div>
          <div class="user-stats">
            <span>粉丝 {{ userCard.user.fans }}</span>
            <span>关注 {{ userCard.user.follows }}</span>
          </div>
        </div>
        <button class="follow-btn" :class="{ active: userCard.followed }" @click="toggleFollow">
          {{ userCard.followed ? '已关注' : '关注' }}
        </button>
      </div>
      <div class="user-card-actions">
        <button class="action-btn" @click="toggleActionMenu">⋯</button>
        <div class="action-menu" v-if="userCard.showMenu">
          <button class="menu-item">私信</button>
          <button class="menu-item">举报</button>
          <div class="menu-group">
            <div class="menu-label">踢出</div>
            <div class="menu-actions">
              <button class="menu-chip">5分钟</button>
              <button class="menu-chip">30分钟</button>
              <button class="menu-chip">本场直播</button>
            </div>
          </div>
          <button class="menu-item">禁言</button>
          <button class="menu-item">拉黑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Draggable from 'vuedraggable'
import BeautyPanel from '../components/BeautyPanel.vue'

// 场景与素材管理
const scenes = ref([
  { 
    id: 1, 
    name: '常规直播', 
    sources: [
      { id: 101, name: '摄像头', type: 'camera', visible: true, locked: false },
      { id: 102, name: '视频素材', type: 'media', visible: true, locked: true }
    ] 
  },
  { id: 2, name: '中场休息', sources: [] }
])
const activeScene = ref(1)
const showAddSource = ref(false)
const streamingToolRef = ref(null)

const activeSceneData = computed(() => {
  return scenes.value.find(s => s.id === activeScene.value)
})

const switchScene = (sceneId) => {
  activeScene.value = sceneId
}

const createScene = () => {
  const newId = Math.max(...scenes.value.map(s => s.id)) + 1
  scenes.value.push({
    id: newId,
    name: `场景${newId}`,
    sources: []
  })
}

const deleteScene = (sceneId) => {
  if (scenes.value.length <= 1) return
  scenes.value = scenes.value.filter(s => s.id !== sceneId)
  if (activeScene.value === sceneId) {
    activeScene.value = scenes.value[0].id
  }
}

// 编辑场景名字
const editingSceneId = ref(null)
const editingSceneName = ref('')
const sceneNameInput = ref(null)

const startEditSceneName = (scene) => {
  editingSceneId.value = scene.id
  editingSceneName.value = scene.name
  nextTick(() => {
    const inputs = document.querySelectorAll('.scene-name-input')
    inputs.forEach(input => input.focus())
  })
}

const finishEditSceneName = () => {
  if (editingSceneId.value !== null && editingSceneName.value.trim()) {
    const scene = scenes.value.find(s => s.id === editingSceneId.value)
    if (scene) {
      scene.name = editingSceneName.value.trim()
    }
  }
  editingSceneId.value = null
  editingSceneName.value = ''
}

const cancelEditSceneName = () => {
  editingSceneId.value = null
  editingSceneName.value = ''
}

const getSourceIcon = (type) => {
  const icons = {
    camera: '📹',
    screen: '🖥️',
    media: '🎞️',
    image: '🖼️',
    text: 'Aa',
    window: '🪟',
    ios: '📱',
    android: '🤖',
    mobile: '📸',
    process: '🧩'
  }
  return icons[type] || '📄'
}

const toggleSourceVisible = (source) => {
  source.visible = !source.visible
}

const toggleSourceLock = (source) => {
  source.locked = !source.locked
}

const deleteSource = (source) => {
  if (!activeSceneData.value) return
  activeSceneData.value.sources = activeSceneData.value.sources.filter(item => item.id !== source.id)
}

const addSource = (type, name) => {
  if (!activeSceneData.value) return
  const newId = Date.now()
  activeSceneData.value.sources.push({
    id: newId,
    name,
    type,
    visible: true,
    locked: false
  })
}

// 互动玩法
const showLinkPanel = ref(false)
const showPkPanel = ref(false)
const currentLink = ref(null)
const pkSession = ref(null)
const pkDuration = ref(3)

const linkHosts = ref([
  { id: 1, name: '主播阿星', role: 'host' },
  { id: 2, name: '星际小柚', role: 'host' }
])
const linkViewers = ref([
  { id: 11, name: '观众小鹿', role: 'viewer' },
  { id: 12, name: '观众阿北', role: 'viewer' },
  { id: 13, name: '观众甜莓', role: 'viewer' }
])

const openLinkPanel = () => {
  showLinkPanel.value = true
}
const closeLinkPanel = () => {
  showLinkPanel.value = false
}
const startLink = (target, mode) => {
  currentLink.value = {
    id: target.id,
    name: target.name,
    role: target.role,
    mode
  }
  showLinkPanel.value = false
}
const endLink = () => {
  currentLink.value = null
}

const openPkPanel = () => {
  showPkPanel.value = true
}
const closePkPanel = () => {
  showPkPanel.value = false
}
const canPkWithHost = computed(() => currentLink.value?.role === 'host' && currentLink.value?.mode === 'video')
const startMatchPk = () => {
  pkSession.value = { label: '匹配PK', leftScore: 126, rightScore: 98 }
  showPkPanel.value = false
}
const startHostPk = () => {
  if (!canPkWithHost.value) return
  pkSession.value = { label: '连麦主播PK', duration: pkDuration.value, leftScore: 88, rightScore: 102 }
  showPkPanel.value = false
}
const endPk = () => {
  pkSession.value = null
}

// 直播工具
const micMuted = ref(false)
const systemMuted = ref(false)
const lastMicVolume = ref(80)
const lastSystemVolume = ref(50)
const showManagement = ref(false)
const beautyEnabled = ref(false)
const mirrorEnabled = ref(false)
const showBeautyPanel = ref(false)

const toggleMirror = () => {
  mirrorEnabled.value = !mirrorEnabled.value
}

const toggleMicMute = () => {
  if (micMuted.value) {
    micMuted.value = false
    micVolume.value = lastMicVolume.value
  } else {
    micMuted.value = true
    lastMicVolume.value = micVolume.value
    micVolume.value = 0
  }
}

const toggleSystemMute = () => {
  if (systemMuted.value) {
    systemMuted.value = false
    systemVolume.value = lastSystemVolume.value
  } else {
    systemMuted.value = true
    lastSystemVolume.value = systemVolume.value
    systemVolume.value = 0
  }
}

const handleMicVolumeChange = () => {
  if (micMuted.value && micVolume.value > 0) {
    micMuted.value = false
  }
}

const handleSystemVolumeChange = () => {
  if (systemMuted.value && systemVolume.value > 0) {
    systemMuted.value = false
  }
}

// 直播状态与统计
const isStreaming = ref(false)
const streamTitle = ref('我的精彩直播')
const streamTag = ref('颜值')
const streamCover = ref('')
const showStreamEdit = ref(false)
const editStreamTitle = ref(streamTitle.value)
const editStreamTag = ref(streamTag.value)
const editStreamCover = ref(streamCover.value)
const orientation = ref('landscape')
const windowSize = ref('normal') // 'normal' (1280x720) or 'full' (100% canvas)
const coverInputRef = ref(null)

const triggerCoverUpload = () => {
  if (coverInputRef.value) {
    coverInputRef.value.click()
  }
}

const handleCoverUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  editStreamCover.value = URL.createObjectURL(file)
  event.target.value = ''
}

const coverPreviewStyle = computed(() => {
  if (editStreamCover.value) {
    return { backgroundImage: `url(${editStreamCover.value})` }
  }
  return { backgroundImage: 'linear-gradient(135deg, rgba(254, 44, 85, 0.4), rgba(88, 101, 242, 0.4))' }
})

const streamCoverStyle = computed(() => {
  if (streamCover.value) {
    return { backgroundImage: `url(${streamCover.value})` }
  }
  return { backgroundImage: 'linear-gradient(135deg, rgba(254, 44, 85, 0.5), rgba(255, 138, 184, 0.5))' }
})

const openStreamEdit = () => {
  editStreamTitle.value = streamTitle.value
  editStreamTag.value = streamTag.value
  editStreamCover.value = streamCover.value
  showStreamEdit.value = true
}

const closeStreamEdit = () => {
  showStreamEdit.value = false
}

const saveStreamEdit = () => {
  streamTitle.value = editStreamTitle.value.trim() || '我的精彩直播'
  streamTag.value = editStreamTag.value.trim().replace(/^#/, '') || '颜值'
  streamCover.value = editStreamCover.value.trim()
  showStreamEdit.value = false
}

const setOrientation = (value) => {
  if (isStreaming.value) return
  orientation.value = value
}

const windowX = ref(0)
const windowY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)
const savedWindowPosition = ref({ x: 0, y: 0 })

const windowStyle = computed(() => {
  if (windowSize.value === 'full') {
    return { transform: 'translate(0px, 0px)' }
  }
  return { transform: `translate(${windowX.value}px, ${windowY.value}px)` }
})

const centerWindow = () => {
  if (windowSize.value === 'full') return
  const width = 1280
  const height = 720
  windowX.value = Math.max(0, (window.innerWidth - width) / 2)
  windowY.value = Math.max(0, (window.innerHeight - height) / 2)
}

const startWindowDrag = (e) => {
  if (windowSize.value === 'full') return
  if (e.button !== 0) return
  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  dragOffsetX.value = windowX.value
  dragOffsetY.value = windowY.value
  document.addEventListener('mousemove', onWindowDrag)
  document.addEventListener('mouseup', stopWindowDrag)
}

let dragFrame = 0
let dragEventCache = null

const onWindowDrag = (e) => {
  if (!isDragging.value) return
  dragEventCache = { x: e.clientX, y: e.clientY }
  if (dragFrame) return
  dragFrame = requestAnimationFrame(() => {
    if (!dragEventCache) return
    const deltaX = dragEventCache.x - dragStartX.value
    const deltaY = dragEventCache.y - dragStartY.value
    windowX.value = dragOffsetX.value + deltaX
    windowY.value = dragOffsetY.value + deltaY
    dragFrame = 0
  })
}

const stopWindowDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onWindowDrag)
  document.removeEventListener('mouseup', stopWindowDrag)
  if (dragFrame) {
    cancelAnimationFrame(dragFrame)
    dragFrame = 0
  }
}

const toggleWindowSize = () => {
  if (windowSize.value === 'normal') {
    savedWindowPosition.value = { x: windowX.value, y: windowY.value }
    windowSize.value = 'full'
  } else {
    windowSize.value = 'normal'
    windowX.value = savedWindowPosition.value.x
    windowY.value = savedWindowPosition.value.y
    if (windowX.value === 0 && windowY.value === 0) {
      centerWindow()
    }
  }
}
const liveDuration = ref(0)
const liveStats = ref({
  viewers: 0
})

const liveDurationFormatted = computed(() => {
  const mins = Math.floor(liveDuration.value / 60)
  const secs = liveDuration.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// 音频与性能
const micVolume = ref(80)
const systemVolume = ref(50)
const perfData = ref({
  cpu: 12,
  droppedFrames: 0,
  bitrate: 4500
})

let timer = null
let perfTimer = null

const toggleStream = () => {
  isStreaming.value = !isStreaming.value
  if (isStreaming.value) {
    // 开始计时
    liveDuration.value = 0
    timer = setInterval(() => {
      liveDuration.value++
      // 模拟数据增长
      if (liveDuration.value % 5 === 0) {
        liveStats.value.viewers += Math.floor(Math.random() * 10)
      }
    }, 1000)
  } else {
    clearInterval(timer)
  }
}

// 模拟性能数据变化
onMounted(() => {
  perfTimer = setInterval(() => {
    perfData.value.cpu = Math.floor(10 + Math.random() * 10)
    perfData.value.bitrate = Math.floor(4000 + Math.random() * 1000)
    if (Math.random() > 0.95) {
      perfData.value.droppedFrames += 1
    }
  }, 2000)
  nextTick(() => {
    centerWindow()
  })
  window.addEventListener('resize', centerWindow)
  window.addEventListener('click', closeUserCard)
  stageBackgroundStyle.value = {
    backgroundImage: stageBackgrounds[Math.floor(Math.random() * stageBackgrounds.length)]
  }
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(perfTimer)
  window.removeEventListener('resize', centerWindow)
  window.removeEventListener('click', closeUserCard)
  stopWindowDrag()
})

// 画布相关
const canvasRef = ref(null)
const currentStream = ref(null)
const stageBackgrounds = [
  'linear-gradient(135deg, #1f005c, #5b0060, #870160, #ac255e, #ca485c, #e16b5c)',
  'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  'linear-gradient(135deg, #1d2b64, #f8cdda)',
  'linear-gradient(135deg, #2c3e50, #4ca1af)',
  'linear-gradient(135deg, #8e2de2, #4a00e0)'
]
const stageBackgroundStyle = ref({ backgroundImage: stageBackgrounds[0] })
const pkLeftRatio = computed(() => {
  if (!pkSession.value) return 50
  const total = pkSession.value.leftScore + pkSession.value.rightScore
  return total === 0 ? 50 : Math.round((pkSession.value.leftScore / total) * 100)
})
const pkRightRatio = computed(() => 100 - pkLeftRatio.value)

const canvasSize = computed(() => {
  if (orientation.value === 'landscape') {
    return { width: 854, height: 480 } // 480p
  } else {
    return { width: 360, height: 640 }
  }
})

const handleAddCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true
    })
    currentStream.value = stream
  } catch (err) {
    console.error('获取摄像头失败:', err)
  }
}

const handleBeautyApply = (settings) => {
  beautyEnabled.value = true
  console.log('应用美颜设置:', settings)
}

// 观众榜
const activeRankTab = ref('online')
const luxuryTab = ref('day')
const funTab = ref('day')
const onlineRank = ref([
  { id: 1, emoji: '😀', nickname: '快乐的小鱼', contribution: 12500 },
  { id: 2, emoji: '😎', nickname: '极客先锋', contribution: 9800 },
  { id: 3, emoji: '🥰', nickname: '梦幻泡泡', contribution: 7600 },
  { id: 4, emoji: '😊', nickname: '星光守护者', contribution: 5400 },
  { id: 5, emoji: '🤗', nickname: '暖心大叔', contribution: 4200 }
])
const funDayRank = ref([
  { id: 21, emoji: '🎈', nickname: '花火星人', contribution: 6800 },
  { id: 22, emoji: '🧩', nickname: '谜语小镇', contribution: 5200 },
  { id: 23, emoji: '🎮', nickname: '像素玩家', contribution: 4600 }
])
const funWeekRank = ref([
  { id: 26, emoji: '🪄', nickname: '魔法邮差', contribution: 9100 },
  { id: 27, emoji: '🎭', nickname: '舞台掌灯', contribution: 8300 },
  { id: 28, emoji: '🌈', nickname: '彩虹收藏家', contribution: 7900 }
])
const luxuryDayRank = ref([
  { id: 31, emoji: '👑', nickname: '星河掌舵', contribution: 18800 },
  { id: 32, emoji: '💎', nickname: '蓝钻守护', contribution: 15200 },
  { id: 33, emoji: '🏆', nickname: '荣耀星标', contribution: 12600 }
])
const luxuryWeekRank = ref([
  { id: 41, emoji: '🌟', nickname: '周榜王者', contribution: 25600 },
  { id: 42, emoji: '🚀', nickname: '银河风暴', contribution: 21400 },
  { id: 43, emoji: '🎖️', nickname: '巅峰守护', contribution: 19800 }
])

const currentRankList = computed(() => {
  if (activeRankTab.value === 'luxury') {
    return luxuryTab.value === 'day' ? luxuryDayRank.value : luxuryWeekRank.value
  }
  if (activeRankTab.value === 'fun') {
    return funTab.value === 'day' ? funDayRank.value : funWeekRank.value
  }
  return onlineRank.value
})

// 消息互动
const messages = ref([
  { id: 1, type: 'system', content: '直播间守则：请文明发言，禁止违规内容。' },
  { id: 2, type: 'text', user: '快乐的小鱼', content: '主播今天玩什么游戏？' },
  { id: 3, type: 'text', user: '极客先锋', content: '画质很清晰，给力！' }
])
const messageText = ref('')
const messageListRef = ref(null)
const showEmojiPicker = ref(false)

const blacklist = ref([
  { id: 1, name: '观众小鹿' },
  { id: 2, name: '白噪音' }
])
const muteList = ref([
  { id: 11, name: '观众阿北' },
  { id: 12, name: '观众甜莓' }
])
const blockedWords = ref(['刷屏', '广告'])
const blockedWordInput = ref('')

const unblockUser = (id) => {
  blacklist.value = blacklist.value.filter(item => item.id !== id)
}

const unmuteUser = (id) => {
  muteList.value = muteList.value.filter(item => item.id !== id)
}

const addBlockedWord = () => {
  const value = blockedWordInput.value.trim()
  if (!value) return
  if (!blockedWords.value.includes(value)) {
    blockedWords.value.push(value)
  }
  blockedWordInput.value = ''
}

const sendMessage = () => {
  if (!messageText.value.trim()) return
  messages.value.push({
    id: Date.now(),
    type: 'text',
    user: '我',
    content: messageText.value
  })
  messageText.value = ''
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

const userCard = ref({
  visible: false,
  user: null,
  x: 0,
  y: 0,
  followed: false,
  showMenu: false
})

const userCardStyle = computed(() => ({
  left: `${userCard.value.x}px`,
  top: `${userCard.value.y}px`
}))

const buildUserProfile = (name, avatar = '🙂') => ({
  name,
  avatar,
  fans: Math.floor(1200 + Math.random() * 5000),
  follows: Math.floor(100 + Math.random() * 800)
})

const openUserCard = (user, event) => {
  if (!streamingToolRef.value) return
  const rect = streamingToolRef.value.getBoundingClientRect()
  const cardWidth = 280
  const cardHeight = 200
  const x = event.clientX - rect.left + 12
  const y = event.clientY - rect.top + 12
  const maxX = rect.width - cardWidth - 12
  const maxY = rect.height - cardHeight - 12
  userCard.value = {
    visible: true,
    user,
    x: Math.max(12, Math.min(x, maxX)),
    y: Math.max(12, Math.min(y, maxY)),
    followed: false,
    showMenu: false
  }
}

const openUserCardFromRank = (aud, event) => {
  openUserCard(buildUserProfile(aud.nickname, aud.emoji), event)
}

const openUserCardByName = (name, event) => {
  if (name === '我') return
  openUserCard(buildUserProfile(name, name.slice(0, 1)), event)
}

const toggleFollow = () => {
  userCard.value.followed = !userCard.value.followed
}

const toggleActionMenu = () => {
  userCard.value.showMenu = !userCard.value.showMenu
}

const closeUserCard = (event) => {
  if (!userCard.value.visible) return
  if (event.target.closest('.user-card-popover')) return
  userCard.value.visible = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

.streaming-tool {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Noto Sans SC', sans-serif;
  background: #0a0a0a;
  position: relative;
  color: #f0f0f0;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  user-select: none;
  will-change: transform;
}

/* 窗口大小适配 - 核心优化 */
.streaming-tool.is-full-window {
  width: 100% !important;
  height: 100% !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0;
  z-index: 1000;
}

.streaming-tool:not(.is-full-window) {
  width: 1280px;
  height: 720px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9), 0 0 40px rgba(254, 44, 85, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.streaming-tool.is-dragging {
  transition: none;
}

/* 顶部导航栏 - 优化美化 */
.app-title-bar {
  height: 32px;
  background: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 18px;
  background: linear-gradient(135deg, #fe2c55, #ff6b81);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 5px rgba(254, 44, 85, 0.3));
}

.logo-text {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.app-title-bar .logo-icon {
  font-size: 14px;
}

.app-title-bar .logo-text {
  font-size: 11px;
  font-weight: 500;
  color: #86878b;
}

.title-right {
  display: flex;
}

.win-btn {
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #888;
  font-size: 10px;
  transition: all 0.2s;
  cursor: pointer;
}

.win-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.win-btn.close:hover {
  background: #e81123;
  color: #fff;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

/* 左侧面板 - 专业直播风格 */
.left-panel {
  width: 260px;
  background: #161823;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.panel-header-v3 {
  height: 54px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-scroll {
  flex: 1;
  overflow: hidden;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scene-section,
.source-section {
  flex: 0 0 auto;
}

.tools-section {
  margin-top: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  margin-bottom: 4px;
}

.header-label {
  font-size: 12px;
  font-weight: 600;
  color: #86878b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.delete-btn {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: #5c5e66;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  opacity: 0;
}

.scene-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(254, 44, 85, 0.1);
  color: #fe2c55;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.01);
  border: 1px dashed rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 10px 0;
}

.empty-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.3;
}

.empty-state p {
  font-size: 12px;
  color: #5c5e66;
  margin: 0;
}

.icon-add-btn {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #a9abb3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.icon-add-btn:hover {
  background: #fe2c55;
  color: #fff;
}

.text-add-btn {
  font-size: 11px;
  color: #fe2c55;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.scene-card, .source-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.scene-card:hover, .source-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
}

.scene-card.active {
  background: rgba(254, 44, 85, 0.08);
  border-color: rgba(254, 44, 85, 0.2);
}

.scene-card.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #fe2c55;
  box-shadow: 0 0 10px rgba(254, 44, 85, 0.5);
}

.drag-handle {
  color: #5c5e66;
  cursor: grab;
  font-size: 14px;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.scene-card:hover .drag-handle {
  opacity: 0.8;
}

.scene-index {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: #5c5e66;
  width: 16px;
  font-weight: 600;
}

.scene-info {
  flex: 1;
  min-width: 0;
}

.scene-name {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scene-meta {
  font-size: 11px;
  color: #86878b;
  margin-top: 4px;
}

.source-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.type-icon {
  font-size: 16px;
  filter: grayscale(0.2);
}

.source-name {
  font-size: 13px;
  color: #e1e2e6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-ops {
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateX(5px);
  transition: all 0.2s ease;
}

.source-card:hover .source-ops {
  opacity: 1;
  transform: translateX(0);
}

.op-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #a9abb3;
  cursor: pointer;
  font-size: 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.op-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.op-btn.disabled {
  color: #5c5e66;
  opacity: 0.5;
}

.op-btn.locked {
  color: #fe2c55;
}

.tools-grid-v3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.tool-item {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.tool-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.tool-item.active {
  background: rgba(254, 44, 85, 0.08);
  border-color: rgba(254, 44, 85, 0.2);
  box-shadow: inset 0 0 10px rgba(254, 44, 85, 0.05);
}

.tool-item.active .tool-icon {
  filter: drop-shadow(0 0 5px rgba(254, 44, 85, 0.5));
  transform: scale(1.1);
}

.tool-item.active .tool-name {
  color: #fe2c55;
  font-weight: 600;
}

.tool-icon {
  font-size: 20px;
  transition: all 0.2s ease;
}

.tool-name {
  font-size: 11px;
  color: #86878b;
  transition: color 0.2s;
}

/* 中间面板 - 沉浸式体验 */
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0f1017;
  min-width: 0;
}

.stream-header-v3 {
  height: 56px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #161823;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.title-input-v3 {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  padding: 2px 0;
  outline: none;
}

.title-input-v3:focus {
  color: #fe2c55;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(254, 44, 85, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.live-dot {
  width: 4px;
  height: 4px;
  background: #fe2c55;
  border-radius: 50%;
  box-shadow: 0 0 8px #fe2c55;
}

.live-label {
  color: #fe2c55;
  font-size: 10px;
  font-weight: 700;
}

.live-time {
  color: #fff;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.9;
}

.stream-meta-v3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 1px;
}

.meta-item {
  font-size: 10px;
  color: #5c5e66;
}

.meta-divider {
  width: 1px;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 11px;
  color: #a9abb3;
}

.pill-value {
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: #fff;
}

.share-btn-v3 {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #fff;
  padding: 5px 14px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.share-btn-v3:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn-v3 {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #a9abb3;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn-v3:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 主舞台区 - 深度优化预览适配 */
.main-stage-v3 {
  flex: 1;
  position: relative;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.preview-area {
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.preview-area.landscape {
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 1200px;
}

.preview-area.portrait {
  aspect-ratio: 9 / 16;
  height: 100%;
  max-height: 85%;
}

.preview-area.is-mirror canvas {
  transform: scaleX(-1);
}

canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.stage-placeholder-v3 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #11131a;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 2;
}

.big-icon {
  font-size: 48px;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 20px rgba(254, 44, 85, 0.2));
}

.stage-placeholder-v3 h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #fff;
}

.stage-placeholder-v3 p {
  font-size: 12px;
  color: #5c5e66;
  margin-bottom: 20px;
}

.primary-btn-v3 {
  background: #fe2c55;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 18px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn-v3:hover {
  background: #ff3b5c;
  transform: scale(1.05);
}

.bitrate-info {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 3px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #a9abb3;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 底部控制栏 - 对齐抖音 */
.stream-footer-v3 {
  height: 64px;
  background: #161823;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  gap: 16px;
  z-index: 100;
  position: relative;
}

.audio-mixer-v3 {
  display: flex;
  gap: 24px;
  flex: 0 0 auto;
}

.mixer-item {
  flex: 0 0 auto;
}

.mixer-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: #a9abb3;
  min-width: 100px;
}

.mixer-slider-v3 {
  position: relative;
  height: 16px;
  width: 80px;
  flex: 0 0 80px;
  display: flex;
  align-items: center;
}

.slider-bg {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.slider-bar {
  height: 100%;
  background: #fe2c55;
  border-radius: 2px;
  position: relative;
  z-index: 1;
}

.mixer-slider-v3 input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 16px;
  opacity: 0.01;
  cursor: pointer;
  z-index: 3;
  appearance: none;
}

.live-action-v3 {
  display: flex;
  justify-content: center;
  flex: 1;
}

.main-live-btn {
  width: 180px;
  height: 40px;
  background: #fe2c55;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(254, 44, 85, 0.3);
}

.main-live-btn:hover {
  background: #ff3b5c;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(254, 44, 85, 0.4);
}

.main-live-btn.is-live {
  background: #2a2c35;
  color: #fff;
  box-shadow: none;
}

@media (max-width: 1200px) {
  .stream-footer-v3 {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 16px;
    gap: 10px;
  }

  .audio-mixer-v3 {
    width: 100%;
    justify-content: space-between;
  }

  .mixer-row {
    min-width: 0;
    flex: 1 1 auto;
  }

  .perf-monitor-v3 {
    order: 2;
    flex: 1 1 100%;
    justify-content: flex-start;
  }

  .live-action-v3 {
    order: 3;
    flex: 0 0 100%;
    justify-content: flex-end;
  }
}
 
.live-btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  gap: 2px;
}

.live-btn-label {
  font-size: 11px;
  color: #fe2c55;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.live-btn-time {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #fff;
}

.perf-monitor-v3 {
  display: flex;
  gap: 24px;
  flex: 1;
  justify-content: flex-end;
}

.perf-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.perf-label {
  font-size: 10px;
  color: #5c5e66;
  text-transform: uppercase;
}

.perf-value {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #fff;
  font-weight: 500;
}

.perf-value.warning {
  color: #fe2c55;
}

/* 右侧面板 - 对齐抖音直播风格 */
.right-panel {
  width: 320px;
  background: #161823;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.panel-tabs-v3 {
  height: 48px;
  display: flex;
  padding: 0 16px;
  gap: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-item {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #7a7c85;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #fff;
}

.tab-item.active {
  color: #fff;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #fe2c55;
  border-radius: 1px;
}

.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

/* 观众榜精简版 - 抖音风 */
.audience-rank-mini {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.rank-item-mini {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank-avatar {
  width: 28px;
  height: 28px;
  background: #2a2c35;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rank-avatar.rank-1 { background: linear-gradient(135deg, #ffd700, #ff8c00); border-color: transparent; }
.rank-avatar.rank-2 { background: linear-gradient(135deg, #c0c0c0, #808080); border-color: transparent; }
.rank-avatar.rank-3 { background: linear-gradient(135deg, #cd7f32, #8b4513); border-color: transparent; }

.rank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rank-name {
  font-size: 11px;
  color: #a9abb3;
  font-weight: 500;
}

.rank-bar-bg {
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5px;
  overflow: hidden;
}

.rank-bar-fill {
  height: 100%;
  background: #fe2c55;
  border-radius: 1.5px;
  opacity: 0.5;
}

/* 聊天消息区 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

.message-item {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-out;
}

.msg-bubble {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px 8px 8px 2px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.is-self .msg-bubble {
  align-self: flex-end;
  background: rgba(254, 44, 85, 0.12);
  border-radius: 8px 8px 2px 8px;
  border: 1px solid rgba(254, 44, 85, 0.15);
}

.msg-user {
  font-size: 11px;
  color: #fe2c55;
  font-weight: 600;
}

.msg-content {
  font-size: 13px;
  color: #e1e2e6;
  line-height: 1.5;
  word-break: break-all;
}

.msg-sys {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 242, 234, 0.04);
  border-radius: 6px;
  color: #00f2ea;
  font-size: 11px;
}

.sys-dot {
  width: 4px;
  height: 4px;
  background: #00f2ea;
  border-radius: 50%;
}

/* 聊天输入框 - 对齐抖音 */
.chat-input-v4 {
  background: #1e2029;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.input-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.tool-btn:hover {
  opacity: 1;
}

.input-limit {
  margin-left: auto;
  font-size: 10px;
  color: #5c5e66;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-container input {
  flex: 1;
  background: #161823;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 8px 12px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.input-container input:focus {
  border-color: rgba(254, 44, 85, 0.4);
}

.btn-send {
  background: #fe2c55;
  color: #fff;
  border: none;
  padding: 0 16px;
  border-radius: 16px;
  height: 32px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-send:disabled {
  background: #2a2c35;
  color: #5c5e66;
  cursor: not-allowed;
}

/* 全屏模式适配 - 抖音风格修复 */
.is-full-window .main-layout {
  height: 100vh;
}

.is-full-window .preview-area.landscape {
  max-width: none;
  width: 100%;
  height: 100%;
  border: none;
}



/* 统计药丸 */
.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s;
}

.stat-pill:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(254, 44, 85, 0.3);
}

.pill-icon {
  font-size: 14px;
}

.pill-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

/* 场景与素材项优化 */
.scene-item, .source-item {
  margin-bottom: 4px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.scene-item:hover, .source-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(254, 44, 85, 0.2);
  transform: translateX(4px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.scene-item.active {
  background: linear-gradient(90deg, rgba(254, 44, 85, 0.15) 0%, rgba(254, 44, 85, 0.05) 100%);
  border-color: rgba(254, 44, 85, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.scene-item.active .scene-name {
  color: #FE2C55;
  font-weight: 600;
}

.scene-thumb {
  width: 40px;
  height: 24px;
  background: #1a1a1a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #444;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.scene-item.active .scene-thumb {
  border-color: rgba(254, 44, 85, 0.5);
  color: #FE2C55;
}

/* 中间面板 - 动态背景 */
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 50% -20%, rgba(254, 44, 85, 0.08) 0%, #080808 60%);
  min-width: 0;
  position: relative;
}

.stream-header-v3 {
  height: 80px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.title-input-v3 {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  padding: 4px 0;
  outline: none;
}

.title-input-v3:focus {
  border-bottom: 1px solid rgba(254, 44, 85, 0.5);
}

.meta-item {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 预览区域 3D 效果 */
.preview-area {
  background: #000;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.stage-random-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: saturate(1.1);
}

.preview-area.landscape {
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 1200px;
}

.preview-area.portrait {
  aspect-ratio: 9 / 16;
  height: 100%;
  max-height: 800px;
}

.preview-area.is-mirror canvas {
  transform: scaleX(-1);
}

canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: transparent;
  position: relative;
  z-index: 2;
}

.preview-area::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 100px rgba(254, 44, 85, 0.05);
  pointer-events: none;
  z-index: 1;
}

.main-live-btn {
  position: relative;
  height: 54px;
  padding: 0 40px;
  border-radius: 27px;
  background: #FE2C55;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 20px rgba(254, 44, 85, 0.3);
}

.main-live-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 15px 30px rgba(254, 44, 85, 0.4);
}

.main-live-btn.is-live {
  background: #1a1a1a;
  color: #FE2C55;
  border: 1px solid rgba(254, 44, 85, 0.5);
  box-shadow: 0 0 20px rgba(254, 44, 85, 0.1);
}

.main-live-btn.is-live::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(254, 44, 85, 0.1) 0%, transparent 70%);
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(0.8); opacity: 0.5; }
}

/* 右侧面板 - 磨砂玻璃与顺滑动画 */
.right-panel {
  width: 320px;
  background: rgba(18, 18, 18, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 10;
  backdrop-filter: blur(20px);
}

.panel-tabs-v3 {
  height: 48px;
  display: flex;
  padding: 0 16px;
  gap: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.tab-item {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #fff;
}

.tab-item.active {
  color: #fff;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #fe2c55;
  border-radius: 1px;
}

.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
  gap: 12px;
}

/* 观众榜精简版 */
.audience-rank-mini {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.rank-item-mini {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rank-avatar {
  width: 24px;
  height: 24px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.rank-avatar.rank-1 { background: linear-gradient(135deg, #ffd700, #ff8c00); }
.rank-avatar.rank-2 { background: linear-gradient(135deg, #c0c0c0, #808080); }
.rank-avatar.rank-3 { background: linear-gradient(135deg, #cd7f32, #8b4513); }

.rank-info {
  flex: 1;
}

.rank-name {
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
}

.rank-bar-bg {
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5px;
}

.rank-bar-fill {
  height: 100%;
  background: #fe2c55;
  border-radius: 1.5px;
  opacity: 0.6;
}

/* 聊天消息区 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.message-item {
  display: flex;
  flex-direction: column;
}

.msg-bubble {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px 8px 8px 2px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.is-self .msg-bubble {
  align-self: flex-end;
  background: rgba(254, 44, 85, 0.15);
  border-radius: 8px 8px 2px 8px;
  border: 1px solid rgba(254, 44, 85, 0.2);
}

.msg-user {
  font-size: 11px;
  color: #fe2c55;
  font-weight: 600;
}

.msg-content {
  font-size: 13px;
  color: #eee;
  line-height: 1.4;
  word-break: break-all;
}

.msg-sys {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(0, 242, 234, 0.05);
  border-radius: 4px;
  color: #00f2ea;
  font-size: 11px;
}

.sys-dot {
  width: 4px;
  height: 4px;
  background: #00f2ea;
  border-radius: 50%;
}

/* 聊天输入框 */
.chat-input-v4 {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.tool-btn:hover {
  opacity: 1;
}

.input-limit {
  margin-left: auto;
  font-size: 10px;
  color: #444;
}

.input-container {
  display: flex;
  gap: 8px;
}

.input-container input {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 8px 12px;
  color: #fff;
  font-size: 13px;
  outline: none;
}

.input-container input:focus {
  border-color: rgba(254, 44, 85, 0.5);
}

.btn-send {
  background: #fe2c55;
  color: #fff;
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-send:disabled {
  background: #2a2c35;
  color: #666;
  cursor: not-allowed;
}

/* 动画效果 */
.chat-msg-enter-active, .chat-msg-leave-active {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.chat-msg-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.chat-msg-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.ghost-item {
  opacity: 0.4;
  background: rgba(254, 44, 85, 0.2) !important;
}

/* 全屏模式下的布局微调 - 关键修复 */
.is-full-window .main-layout {
  height: 100vh;
}

.is-full-window .main-stage-v3 {
  padding: 0;
}

.is-full-window .preview-area.landscape {
  max-width: none;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.is-full-window .preview-area.portrait {
  max-height: none;
  height: 100%;
  border-radius: 0;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 滚动条美化 */
.panel-scroll::-webkit-scrollbar,
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.panel-scroll::-webkit-scrollbar-track,
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.panel-scroll::-webkit-scrollbar-thumb,
.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.panel-scroll::-webkit-scrollbar-thumb:hover,
.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}


.input-tools-v3 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tool-left {
  display: flex;
  gap: 12px;
}

.tool-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.4;
  transition: all 0.2s;
}

.tool-btn:hover {
  opacity: 1;
  transform: scale(1.2);
}

.char-count {
  font-size: 10px;
  color: #333;
  font-family: 'JetBrains Mono', monospace;
}

.input-box-v3 {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 4px 4px 16px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.input-box-v3:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(254, 44, 85, 0.4);
  box-shadow: 0 0 15px rgba(254, 44, 85, 0.1);
}

.input-box-v3 input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 13px;
  outline: none;
}

.send-btn-v3 {
  width: 32px;
  height: 32px;
  background: #fe2c55;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn-v3:disabled {
  background: #222;
  cursor: not-allowed;
  opacity: 0.5;
}

.send-btn-v3:not(:disabled):hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(254, 44, 85, 0.5);
}

.send-icon {
  font-size: 14px;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(254, 44, 85, 0.2);
}
/* 消息列表动画 */
.msg-list-enter-active,
.msg-list-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.msg-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.msg-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.msg-list-move {
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

/* 按钮点击反馈 */
button:active {
  transform: scale(0.95);
  filter: brightness(0.9);
}

/* 渐入动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-section {
  animation: fadeIn 0.5s ease-out forwards;
}

.panel-section:nth-child(2) { animation-delay: 0.1s; }
.panel-section:nth-child(3) { animation-delay: 0.2s; }
.panel-section:nth-child(4) { animation-delay: 0.3s; }

.app-title-bar {
  justify-content: flex-end;
}

.panel-scroll {
  overflow: hidden;
}

/* 场景网格 - 固定高度 */
.scene-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  max-height: 80px;
  overflow-y: auto;
  padding-right: 4px;
}

.scene-grid::-webkit-scrollbar {
  width: 3px;
}

.scene-grid::-webkit-scrollbar-thumb {
  background: rgba(236, 64, 122, 0.3);
  border-radius: 3px;
}

.scene-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 32px;
}

.scene-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(236, 64, 122, 0.4);
}

.scene-chip.active {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2), rgba(255, 64, 129, 0.15));
  border-color: rgba(236, 64, 122, 0.6);
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.25);
}

.chip-number {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: rgba(236, 64, 122, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #ff4081;
  flex-shrink: 0;
}

.scene-chip.active .chip-number {
  background: linear-gradient(135deg, #ec407a, #ff4081);
  color: #fff;
}

.chip-name {
  flex: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scene-chip.active .chip-name {
  color: #fff;
  font-weight: 500;
}

.chip-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(236, 64, 122, 0.6);
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 12px;
  color: #fff;
  outline: none;
}

.chip-delete {
  width: 18px;
  height: 18px;
  border: none;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-chip:hover .chip-delete {
  opacity: 1;
}

.chip-delete:hover {
  background: rgba(239, 68, 68, 0.4);
}

.source-list-v3 {
  height: clamp(140px, 26vh, 210px);
  overflow-y: auto;
  padding-right: 4px;
}

.scene-list-v3 .scene-card {
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 8px;
  margin-bottom: 0;
  min-width: 132px;
  height: 56px;
  flex: 0 0 auto;
}

.scene-list-v3 .drag-handle,
.scene-list-v3 .scene-meta {
  display: none;
}

.scene-list-v3 .scene-index {
  width: auto;
  font-size: 10px;
}

.scene-list-v3 .scene-name {
  font-size: 11px;
  white-space: nowrap;
}

.scene-list-v3 .delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 1;
}

.stream-header-v3 {
  height: 64px;
  padding: 0 20px;
  gap: 16px;
}

.stream-info-v3 {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stream-cover {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stream-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stream-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stream-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #c8cbd3;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  color: #fff;
  border-color: rgba(254, 44, 85, 0.4);
}

.edit-icon {
  font-size: 12px;
}

.orientation-toggle {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 3px;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.orientation-btn {
  background: transparent;
  border: none;
  color: #8c9099;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.orientation-btn.active {
  background: rgba(254, 44, 85, 0.2);
  color: #fff;
}

.orientation-btn:disabled,
.orientation-btn.disabled {
  color: #4d4f56;
  cursor: not-allowed;
}

.mixer-info {
  justify-content: flex-start;
  gap: 8px;
}

.mixer-toggle {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #cdd0d6;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.mixer-toggle.muted {
  background: rgba(254, 44, 85, 0.16);
  border-color: rgba(254, 44, 85, 0.3);
  color: #fe2c55;
}

.stream-footer-v3 {
  justify-content: space-between;
  gap: 16px;
}

.perf-monitor-v3 {
  flex: 0 0 auto;
}

.live-action-v3 {
  flex: 0 0 auto;
  margin-left: auto;
}

.main-live-btn {
  width: 176px;
  height: 44px;
  padding: 0 24px;
  border-radius: 22px;
  background: #fe2c55;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(254, 44, 85, 0.3);
}

.main-live-btn:hover {
  background: #ff3b5c;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(254, 44, 85, 0.4);
}

.main-live-btn.is-live {
  background: #2a2c35;
  color: #fff;
  box-shadow: none;
}

.right-panel {
  gap: 0;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow: hidden;
}

.rank-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.chat-section {
  flex: 1;
}

.right-panel .section-header {
  font-size: 13px;
  color: #e1e2e6;
  font-weight: 600;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}

.rank-count {
  font-size: 12px;
  color: #fe2c55;
  background: rgba(254, 44, 85, 0.12);
  border: 1px solid rgba(254, 44, 85, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
}

.rank-tabs,
.rank-subtabs {
  display: flex;
  gap: 8px;
}

.rank-tab,
.rank-subtab {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a9abb3;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.rank-tab.active,
.rank-subtab.active {
  background: rgba(254, 44, 85, 0.2);
  border-color: rgba(254, 44, 85, 0.4);
  color: #fff;
}

.audience-rank-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
  max-height: 220px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  justify-content: space-between;
}

.rank-score {
  font-size: 12px;
  color: #aeb2bc;
  margin-left: auto;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
}

.user-trigger:hover .rank-name {
  color: #fff;
}

.msg-user-btn {
  border: none;
  background: transparent;
  color: #fe2c55;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.msg-user-btn:hover {
  color: #ff5d82;
}

.link-action {
  background: rgba(254, 44, 85, 0.12);
  border: 1px solid rgba(254, 44, 85, 0.3);
  color: #fe2c55;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
}

.user-card-popover {
  position: absolute;
  width: 280px;
  background: #1b1d27;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  padding: 14px;
  z-index: 260;
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(254, 44, 85, 0.12);
  color: #fe2c55;
  font-size: 20px;
  font-weight: 600;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.user-stats {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #aeb2bc;
}

.follow-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
}

.follow-btn.active {
  background: rgba(254, 44, 85, 0.2);
  border-color: rgba(254, 44, 85, 0.4);
  color: #fe2c55;
}

.user-card-actions {
  margin-top: 12px;
  position: relative;
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  width: 32px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #d0d3db;
  cursor: pointer;
}

.action-menu {
  position: absolute;
  right: 0;
  top: 36px;
  width: 200px;
  background: #11131a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.menu-item {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e0e2e6;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
}

.menu-group {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-label {
  font-size: 11px;
  color: #9aa0ab;
}

.menu-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.menu-chip {
  background: rgba(254, 44, 85, 0.12);
  border: 1px solid rgba(254, 44, 85, 0.3);
  color: #fe2c55;
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
}

.chat-section .chat-messages {
  flex: 1;
}

@media (max-width: 1280px) {
  .right-panel {
    width: 240px;
  }

  .live-action-v3 {
    margin-left: 0;
    margin-right: 16px;
  }
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-card {
  width: min(460px, 86%);
  background: #1b1d27;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
}

.modal-card.modal-lg {
  width: min(620px, 92%);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.modal-close {
  background: transparent;
  border: none;
  color: #c6c9d1;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-section .section-title {
  font-size: 12px;
  color: #a9abb3;
}

.modal-footer {
  padding: 12px 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row label {
  font-size: 12px;
  color: #9ea2ac;
}

.form-row input {
  background: #11131a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  color: #fff;
  font-size: 12px;
}

.tag-select {
  background: #11131a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  color: #fff;
  font-size: 12px;
}

.cover-uploader {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cover-preview {
  width: 84px;
  height: 56px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cover-actions input[type="file"] {
  display: none;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.source-tile {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e1e2e6;
  padding: 10px 8px;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.source-tile:hover {
  border-color: rgba(254, 44, 85, 0.4);
  color: #fff;
}

.tag-chip {
  background: rgba(254, 44, 85, 0.12);
  border: 1px solid rgba(254, 44, 85, 0.3);
  color: #fe2c55;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.blocked-words {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blocked-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.blocked-input {
  display: flex;
  gap: 10px;
}

.blocked-input input {
  flex: 1;
  background: #11131a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 10px;
  color: #fff;
  font-size: 12px;
}

.btn-primary,
.btn-secondary,
.btn-ghost {
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #fe2c55;
  color: #fff;
  border: none;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-ghost {
  background: transparent;
  color: #c7cbd2;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-ghost.active {
  border-color: rgba(254, 44, 85, 0.5);
  color: #fe2c55;
}

.full-width {
  width: 100%;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.link-actions {
  display: flex;
  gap: 8px;
}

.link-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.link-split {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(0, 0, 0, 0.15);
}

.link-half {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.link-half:last-child {
  border-right: none;
}

.link-window {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 180px;
  height: 120px;
  border-radius: 12px;
  background: rgba(17, 19, 26, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.link-title {
  font-size: 12px;
  color: #fff;
}

.link-badge {
  font-size: 11px;
  color: #fe2c55;
}

.pk-banner {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(254, 44, 85, 0.2);
  border: 1px solid rgba(254, 44, 85, 0.4);
  color: #fff;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 16px;
  z-index: 3;
}

.pk-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.pk-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 3;
}

.pk-score {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  min-width: 30px;
  text-align: center;
}

.pk-score.left {
  color: #ff5964;
}

.pk-score.right {
  color: #4aa3ff;
}

.pk-gauge {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  display: flex;
  overflow: hidden;
}

.pk-left {
  background: linear-gradient(90deg, #ff5964, #ff7b8a);
}

.pk-right {
  background: linear-gradient(90deg, #4aa3ff, #7bb7ff);
}

.pk-split {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  z-index: 1;
}

.pk-half.left {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 89, 100, 0.12), rgba(0, 0, 0, 0));
}

.pk-half.right {
  background: linear-gradient(180deg, rgba(74, 163, 255, 0.12), rgba(0, 0, 0, 0));
}

</style>
