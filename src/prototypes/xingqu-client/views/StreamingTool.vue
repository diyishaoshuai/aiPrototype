<template>
  <DraggableWindow title="星趣直播工具">
    <div class="streaming-tool">
      <!-- 左侧面板 (20%) -->
      <div class="left-panel">
        <div class="panel-section scene-section">
          <h3 class="section-title">场景管理</h3>
          <div class="scene-list">
            <div
              v-for="scene in scenes"
              :key="scene.id"
              class="scene-item"
              :class="{ active: scene.id === activeScene }"
              @click="switchScene(scene.id)"
            >
              <span class="scene-name">{{ scene.name }}</span>
              <button
                v-if="scenes.length > 1"
                class="delete-btn"
                @click.stop="deleteScene(scene.id)"
              >×</button>
            </div>
            <button class="add-scene-btn" @click="createScene">
              <span>+</span> 新建场景
            </button>
          </div>
        </div>

        <div class="panel-section interaction-section">
          <h3 class="section-title">互动玩法</h3>
          <div class="tool-buttons">
            <button class="tool-btn" :class="{ active: pkMode }" @click="pkMode = !pkMode">
              <span class="icon">⚔️</span>
              <span>PK</span>
            </button>
            <button class="tool-btn" :class="{ active: voiceLink }" @click="voiceLink = !voiceLink">
              <span class="icon">🎤</span>
              <span>语音连麦</span>
            </button>
            <button class="tool-btn" :class="{ active: videoLink }" @click="videoLink = !videoLink">
              <span class="icon">📹</span>
              <span>视频连麦</span>
            </button>
          </div>
        </div>

        <div class="panel-section tools-section">
          <h3 class="section-title">直播工具</h3>
          <div class="tool-buttons">
            <button class="tool-btn" :class="{ active: !micMuted }" @click="micMuted = !micMuted">
              <span class="icon">{{ micMuted ? '🔇' : '🎤' }}</span>
              <span>麦克风</span>
            </button>
            <button class="tool-btn" @click="showManagement = true">
              <span class="icon">⚙️</span>
              <span>直播管理</span>
            </button>
            <button class="tool-btn" :class="{ active: beautyEnabled }" @click="beautyEnabled = !beautyEnabled">
              <span class="icon">✨</span>
              <span>美颜</span>
            </button>
            <button class="tool-btn" :class="{ active: mirrorEnabled }" @click="mirrorEnabled = !mirrorEnabled">
              <span class="icon">🔄</span>
              <span>画面镜像</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 中间面板 (60%) -->
      <div class="center-panel">
        <div class="stream-header">
          <div class="header-left">
            <div class="cover-upload">
              <img v-if="coverImage" :src="coverImage" alt="封面" />
              <span v-else class="upload-placeholder">📷</span>
            </div>
            <input
              v-model="streamTitle"
              class="title-input"
              placeholder="输入直播标题..."
            />
            <select v-model="streamCategory" class="category-select">
              <option value="">选择分类</option>
              <option value="game">游戏</option>
              <option value="music">音乐</option>
              <option value="chat">聊天</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="header-right">
            <button
              class="orientation-btn"
              :class="{ active: orientation === 'landscape' }"
              @click="orientation = 'landscape'"
            >
              <span>📱</span> 横屏
            </button>
            <button
              class="orientation-btn"
              :class="{ active: orientation === 'portrait' }"
              @click="orientation = 'portrait'"
            >
              <span>📱</span> 竖屏
            </button>
          </div>
        </div>

        <div class="live-canvas-container">
          <div
            class="live-canvas"
            :class="{
              landscape: orientation === 'landscape',
              portrait: orientation === 'portrait'
            }"
          >
            <canvas
              v-if="currentStream"
              ref="canvasRef"
              :width="canvasSize.width"
              :height="canvasSize.height"
            ></canvas>
            <div v-else class="no-stream" @click="handleAddCamera">
              <div class="add-icon">+</div>
              <div class="add-text">点击添加摄像头</div>
            </div>
          </div>
        </div>

        <div class="stream-footer">
          <div class="footer-left">
            <label class="volume-label">麦克风音量</label>
            <input
              v-model="micVolume"
              type="range"
              min="0"
              max="100"
              class="volume-slider"
            />
            <span class="volume-value">{{ micVolume }}%</span>
          </div>
          <div class="footer-right">
            <button
              class="start-stream-btn"
              :class="{ streaming: isStreaming }"
              @click="toggleStream"
            >
              {{ isStreaming ? '停止直播' : '开始直播' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧面板 (20%) -->
      <div class="right-panel">
        <div class="panel-section audience-section">
          <h3 class="section-title">在线观众榜</h3>
          <div class="audience-list">
            <div
              v-for="(audience, index) in audiences.slice(0, 20)"
              :key="audience.id"
              class="audience-item"
            >
              <span class="rank">{{ index + 1 }}</span>
              <img :src="audience.avatar || '/default-avatar.png'" class="avatar" />
              <div class="audience-info">
                <div class="nickname">{{ audience.nickname }}</div>
                <div class="duration">{{ formatDuration(audience.duration) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-section chat-section">
          <h3 class="section-title">互动消息</h3>
          <div class="message-list" ref="messageListRef">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-item"
              :class="msg.type"
            >
              <template v-if="msg.type === 'text'">
                <span class="username">{{ msg.user }}:</span>
                <span class="content">{{ msg.content }}</span>
              </template>
              <template v-else-if="msg.type === 'emoji'">
                <span class="username">{{ msg.user }}:</span>
                <span class="emoji">{{ msg.emoji }}</span>
              </template>
              <template v-else-if="msg.type === 'system'">
                <span class="system-text">{{ msg.content }}</span>
              </template>
            </div>
          </div>
          <div class="message-input">
            <input
              v-model="messageText"
              placeholder="说点什么..."
              @keyup.enter="sendMessage"
            />
            <button class="emoji-btn" @click="showEmojiPicker = !showEmojiPicker">😊</button>
            <button class="send-btn" @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </DraggableWindow>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import DraggableWindow from '../components/DraggableWindow.vue'

// 场景管理
const scenes = ref([
  { id: 1, name: '场景1', sources: [] }
])
const activeScene = ref(1)

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

// 互动玩法
const pkMode = ref(false)
const voiceLink = ref(false)
const videoLink = ref(false)

// 直播工具
const micMuted = ref(false)
const showManagement = ref(false)
const beautyEnabled = ref(false)
const mirrorEnabled = ref(false)

// 直播设置
const coverImage = ref('')
const streamTitle = ref('')
const streamCategory = ref('')
const orientation = ref('landscape')

// 画布
const canvasRef = ref(null)
const currentStream = ref(null)

const canvasSize = computed(() => {
  if (orientation.value === 'landscape') {
    return { width: 640, height: 360 }
  } else {
    return { width: 240, height: 426 }
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

// 音量控制
const micVolume = ref(80)

// 直播状态
const isStreaming = ref(false)

const toggleStream = () => {
  isStreaming.value = !isStreaming.value
}

// 观众榜
const audiences = ref([
  { id: 1, avatar: '', nickname: '用户1', duration: 3600 },
  { id: 2, avatar: '', nickname: '用户2', duration: 2400 },
  { id: 3, avatar: '', nickname: '用户3', duration: 1800 }
])

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// 消息互动
const messages = ref([
  { id: 1, type: 'system', content: '欢迎来到直播间' },
  { id: 2, type: 'text', user: '用户1', content: '你好' },
  { id: 3, type: 'emoji', user: '用户2', emoji: '😊' }
])
const messageText = ref('')
const messageListRef = ref(null)
const showEmojiPicker = ref(false)

const sendMessage = () => {
  if (!messageText.value.trim()) return

  messages.value.push({
    id: Date.now(),
    type: 'text',
    user: '主播',
    content: messageText.value
  })

  messageText.value = ''

  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

.streaming-tool {
  display: flex;
  height: 100%;
  font-family: 'Noto Sans SC', sans-serif;
  gap: 1px;
  background: rgba(139, 92, 246, 0.1);
}

/* 左侧面板 (20%) */
.left-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: rgba(15, 15, 25, 0.98);
  overflow-y: auto;
}

.panel-section {
  background: rgba(30, 30, 45, 0.6);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(139, 92, 246, 1);
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 场景管理 */
.scene-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.scene-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scene-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(139, 92, 246, 0.4);
}

.scene-item.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.6);
}

.scene-name {
  color: #fff;
  font-size: 13px;
}

.delete-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.4);
}

.add-scene-btn {
  padding: 8px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px dashed rgba(139, 92, 246, 0.4);
  border-radius: 6px;
  color: rgba(139, 92, 246, 1);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.add-scene-btn:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.6);
}

/* 工具按钮 */
.tool-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
}

.tool-btn.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.6);
  color: #fff;
}

.tool-btn .icon {
  font-size: 20px;
}

/* 中间面板 (60%) */
.center-panel {
  flex: 6;
  display: flex;
  flex-direction: column;
  background: rgba(15, 15, 25, 0.98);
  gap: 1px;
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(30, 30, 45, 0.6);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.cover-upload {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(139, 92, 246, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cover-upload:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.6);
}

.cover-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.upload-placeholder {
  font-size: 24px;
  opacity: 0.5;
}

.title-input {
  flex: 1;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.title-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.6);
}

.title-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.category-select {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-select:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.4);
}

.header-right {
  display: flex;
  gap: 8px;
}

.orientation-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.orientation-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.4);
}

.orientation-btn.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.6);
  color: #fff;
}

/* 直播画布 */
.live-canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  min-height: 0;
}

.live-canvas {
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.live-canvas.landscape {
  width: 640px;
  height: 360px;
}

.live-canvas.portrait {
  width: 240px;
  height: 426px;
}

.live-canvas canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.no-stream {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.no-stream:hover {
  background: rgba(139, 92, 246, 0.1);
}

.add-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.2);
  border: 2px dashed rgba(139, 92, 246, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: rgba(139, 92, 246, 1);
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.no-stream:hover .add-icon {
  background: rgba(139, 92, 246, 0.3);
  transform: scale(1.1);
}

.add-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

/* 底部控制栏 */
.stream-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(30, 30, 45, 0.6);
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  flex-shrink: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.volume-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  white-space: nowrap;
}

.volume-slider {
  flex: 1;
  max-width: 200px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.8);
}

.volume-value {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  min-width: 40px;
  text-align: right;
}

.footer-right {
  display: flex;
  gap: 12px;
}

.start-stream-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.6);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.start-stream-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(139, 92, 246, 0.5);
}

.start-stream-btn.streaming {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8));
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.start-stream-btn.streaming:hover {
  box-shadow: 0 6px 24px rgba(239, 68, 68, 0.5);
}

/* 右侧面板 (20%) */
.right-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: rgba(15, 15, 25, 0.98);
  overflow: hidden;
}

/* 观众榜 */
.audience-section {
  flex: 0 0 240px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.audience-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.audience-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.audience-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.audience-item .rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 4px;
  color: rgba(139, 92, 246, 1);
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.audience-item .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.audience-info {
  flex: 1;
  min-width: 0;
}

.audience-info .nickname {
  color: #fff;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audience-info .duration {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  margin-top: 2px;
}

/* 聊天区域 */
.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 240px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.message-item {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-item.text .username {
  color: rgba(139, 92, 246, 1);
  font-weight: 600;
  margin-right: 6px;
}

.message-item.text .content {
  color: rgba(255, 255, 255, 0.9);
}

.message-item.emoji .username {
  color: rgba(139, 92, 246, 1);
  font-weight: 600;
  margin-right: 6px;
}

.message-item.emoji .emoji {
  font-size: 20px;
}

.message-item.system {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  text-align: center;
}

.message-item.system .system-text {
  color: rgba(139, 92, 246, 1);
  font-size: 12px;
}

.message-input {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.message-input input {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  outline: none;
  transition: all 0.2s ease;
}

.message-input input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.6);
}

.message-input input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.emoji-btn,
.send-btn {
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.emoji-btn:hover,
.send-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.4);
  color: #fff;
}

.send-btn {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
  color: rgba(139, 92, 246, 1);
  font-weight: 600;
}

.send-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  border-color: rgba(139, 92, 246, 0.6);
}

/* 滚动条样式 */
.left-panel::-webkit-scrollbar,
.audience-list::-webkit-scrollbar,
.message-list::-webkit-scrollbar {
  width: 6px;
}

.left-panel::-webkit-scrollbar-track,
.audience-list::-webkit-scrollbar-track,
.message-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.left-panel::-webkit-scrollbar-thumb,
.audience-list::-webkit-scrollbar-thumb,
.message-list::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.4);
  border-radius: 3px;
}

.left-panel::-webkit-scrollbar-thumb:hover,
.audience-list::-webkit-scrollbar-thumb:hover,
.message-list::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.6);
}
</style>



