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
            <button class="tool-btn" :class="{ active: beautyEnabled }" @click="showBeautyPanel = true">
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
              <div class="avatar">{{ audience.emoji }}</div>
              <div class="audience-info">
                <div class="nickname">{{ audience.nickname }}</div>
              </div>
              <div class="contribution">{{ audience.contribution }}</div>
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

    <!-- 美颜弹窗 -->
    <BeautyPanel
      :visible="showBeautyPanel"
      @close="showBeautyPanel = false"
      @apply="handleBeautyApply"
    />
  </DraggableWindow>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import DraggableWindow from '../components/DraggableWindow.vue'
import BeautyPanel from '../components/BeautyPanel.vue'

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
const showBeautyPanel = ref(false)

// 美颜设置处理
const handleBeautyApply = (settings) => {
  beautyEnabled.value = true
  console.log('应用美颜设置:', settings)
  // 这里可以调用火山美颜 API
  // volcBeauty.setBeautyParams(settings)
}

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
  { id: 1, emoji: '😀', nickname: '用户1', contribution: 9999 },
  { id: 2, emoji: '😎', nickname: '用户2', contribution: 8888 },
  { id: 3, emoji: '🥰', nickname: '用户3', contribution: 7777 },
  { id: 4, emoji: '😊', nickname: '用户4', contribution: 6666 },
  { id: 5, emoji: '🤗', nickname: '用户5', contribution: 5555 },
  { id: 6, emoji: '😇', nickname: '用户6', contribution: 4444 },
  { id: 7, emoji: '🤩', nickname: '用户7', contribution: 3333 },
  { id: 8, emoji: '😋', nickname: '用户8', contribution: 2888 },
  { id: 9, emoji: '🥳', nickname: '用户9', contribution: 2555 },
  { id: 10, emoji: '😺', nickname: '用户10', contribution: 2222 },
  { id: 11, emoji: '🐶', nickname: '用户11', contribution: 1999 },
  { id: 12, emoji: '🐱', nickname: '用户12', contribution: 1666 },
  { id: 13, emoji: '🐼', nickname: '用户13', contribution: 1333 },
  { id: 14, emoji: '🦊', nickname: '用户14', contribution: 1111 },
  { id: 15, emoji: '🐯', nickname: '用户15', contribution: 999 },
  { id: 16, emoji: '🦁', nickname: '用户16', contribution: 888 },
  { id: 17, emoji: '🐸', nickname: '用户17', contribution: 666 },
  { id: 18, emoji: '🐵', nickname: '用户18', contribution: 555 },
  { id: 19, emoji: '🦄', nickname: '用户19', contribution: 333 },
  { id: 20, emoji: '🐨', nickname: '用户20', contribution: 188 }
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
  gap: 2px;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
}

.streaming-tool::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(236, 64, 122, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(255, 64, 129, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 左侧面板 (20%) */
.left-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 52, 96, 0.9) 100%);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.panel-section {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.6) 100%);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(236, 64, 122, 0.3);
  box-shadow: 0 4px 16px rgba(236, 64, 122, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.panel-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(236, 64, 122, 0.5), transparent);
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #ec407a 0%, #ff4081 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 20px rgba(236, 64, 122, 0.5);
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
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.1) 0%, rgba(255, 64, 129, 0.05) 100%);
  border: 1px solid rgba(236, 64, 122, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.scene-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(236, 64, 122, 0.2), transparent);
  transition: left 0.5s ease;
}

.scene-item:hover::before {
  left: 100%;
}

.scene-item:hover {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2) 0%, rgba(255, 64, 129, 0.15) 100%);
  border-color: rgba(236, 64, 122, 0.5);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(236, 64, 122, 0.3);
}

.scene-item.active {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.3) 0%, rgba(255, 64, 129, 0.2) 100%);
  border-color: #ec407a;
  box-shadow: 0 0 20px rgba(236, 64, 122, 0.4),
              inset 0 0 20px rgba(236, 64, 122, 0.1);
}

.scene-name {
  color: #fff;
  font-size: 13px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.delete-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  color: #ff4081;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(236, 64, 122, 0.3);
}

.delete-btn:hover {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.5), rgba(255, 64, 129, 0.4));
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(236, 64, 122, 0.5);
}

.add-scene-btn {
  padding: 8px;
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.15), rgba(255, 64, 129, 0.1));
  border: 1px dashed rgba(236, 64, 122, 0.4);
  border-radius: 8px;
  color: #ff4081;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.add-scene-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(236, 64, 122, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.add-scene-btn:hover::before {
  width: 200%;
  height: 200%;
}

.add-scene-btn:hover {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.25), rgba(255, 64, 129, 0.2));
  border-color: rgba(236, 64, 122, 0.6);
  box-shadow: 0 4px 12px rgba(236, 64, 122, 0.3);
}

.scene-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(236, 64, 122, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scene-item:hover {
  background: rgba(255, 182, 193, 0.3);
  border-color: rgba(236, 64, 122, 0.4);
}

.scene-item.active {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2), rgba(233, 30, 99, 0.2));
  border-color: #ec407a;
}

.scene-name {
  color: #333;
  font-size: 13px;
}

.delete-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(236, 64, 122, 0.2);
  color: #ec407a;
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
  background: rgba(236, 64, 122, 0.1);
  border: 1px dashed rgba(236, 64, 122, 0.4);
  border-radius: 6px;
  color: #ec407a;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.add-scene-btn:hover {
  background: rgba(236, 64, 122, 0.2);
  border-color: rgba(236, 64, 122, 0.6);
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
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.6) 0%, rgba(22, 33, 62, 0.4) 100%);
  border: 1px solid rgba(236, 64, 122, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  position: relative;
  overflow: hidden;
}

.tool-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2), rgba(255, 64, 129, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tool-btn:hover::before {
  opacity: 1;
}

.tool-btn:hover {
  border-color: rgba(236, 64, 122, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 64, 122, 0.3);
  color: #fff;
}

.tool-btn.active {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  border-color: #ec407a;
  color: #ff4081;
  box-shadow: 0 0 20px rgba(236, 64, 122, 0.4),
              inset 0 0 20px rgba(236, 64, 122, 0.1);
}

.tool-btn .icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(236, 64, 122, 0.3));
}

/* 中间面板 (60%) */
.center-panel {
  flex: 6;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(15, 52, 96, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%);
  backdrop-filter: blur(10px);
  gap: 2px;
  position: relative;
  z-index: 1;
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.6) 100%);
  border-bottom: 1px solid rgba(236, 64, 122, 0.3);
  flex-shrink: 0;
  position: relative;
}

.stream-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(236, 64, 122, 0.5), transparent);
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
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2), rgba(255, 64, 129, 0.1));
  border: 1px dashed rgba(236, 64, 122, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cover-upload::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(236, 64, 122, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
}

.cover-upload:hover::before {
  width: 200%;
  height: 200%;
}

.cover-upload:hover {
  border-color: rgba(236, 64, 122, 0.8);
  box-shadow: 0 0 20px rgba(236, 64, 122, 0.4);
}

.cover-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.upload-placeholder {
  font-size: 24px;
  color: #ff4081;
  filter: drop-shadow(0 0 10px rgba(236, 64, 122, 0.5));
}

.title-input {
  flex: 1;
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.6), rgba(22, 33, 62, 0.4));
  border: 1px solid rgba(236, 64, 122, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.title-input:focus {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.6));
  border-color: #ec407a;
  box-shadow: 0 0 20px rgba(236, 64, 122, 0.4);
}

.title-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.category-select {
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.6), rgba(22, 33, 62, 0.4));
  border: 1px solid rgba(236, 64, 122, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-select:hover {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.6));
  border-color: rgba(236, 64, 122, 0.5);
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.3);
}

.header-right {
  display: flex;
  gap: 8px;
}

.orientation-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.6), rgba(22, 33, 62, 0.4));
  border: 1px solid rgba(236, 64, 122, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.orientation-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(236, 64, 122, 0.3), transparent);
  transition: left 0.5s ease;
}

.orientation-btn:hover::before {
  left: 100%;
}

.orientation-btn:hover {
  border-color: rgba(236, 64, 122, 0.5);
  color: #fff;
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.3);
}

.orientation-btn.active {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  border-color: #ec407a;
  color: #ff4081;
  box-shadow: 0 0 20px rgba(236, 64, 122, 0.5);
}

/* 直播画布 */
.live-canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px 0 10px;
  background: radial-gradient(circle at center, rgba(236, 64, 122, 0.1) 0%, rgba(10, 10, 15, 0.8) 70%);
  min-height: 0;
  position: relative;
}

.live-canvas-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(236, 64, 122, 0.2) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

.live-canvas {
  position: relative;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(15, 52, 96, 0.8) 100%);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(236, 64, 122, 0.4);
  z-index: 1;
}

.live-canvas.landscape {
  width: 100%;
  max-width: calc(100% - 20px);
  height: auto;
  aspect-ratio: 16 / 9;
}

.live-canvas.portrait {
  width: auto;
  height: 100%;
  max-height: calc(100% - 20px);
  aspect-ratio: 9 / 16;
}

.live-canvas::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 48%, rgba(236, 64, 122, 0.1) 50%, transparent 52%);
  background-size: 20px 20px;
  opacity: 0.3;
  pointer-events: none;
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
  background: radial-gradient(circle, rgba(236, 64, 122, 0.15) 0%, transparent 70%);
}

.add-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  border: 2px dashed rgba(236, 64, 122, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #ff4081;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 0 30px rgba(236, 64, 122, 0.4);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 30px rgba(236, 64, 122, 0.4); }
  50% { box-shadow: 0 0 50px rgba(236, 64, 122, 0.6); }
}

.no-stream:hover .add-icon {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.5), rgba(255, 64, 129, 0.3));
  transform: scale(1.1) rotate(90deg);
  border-color: #ff4081;
}

.add-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 底部控制栏 */
.stream-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.6) 100%);
  border-top: 1px solid rgba(236, 64, 122, 0.3);
  flex-shrink: 0;
  position: relative;
}

.stream-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(236, 64, 122, 0.5), transparent);
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.volume-slider {
  flex: 1;
  max-width: 200px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec407a, #ff4081);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.6);
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.3);
  box-shadow: 0 0 20px rgba(236, 64, 122, 1);
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
  background: linear-gradient(135deg, #ec407a 0%, #ff4081 50%, #f06292 100%);
  border: 1px solid #ec407a;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(236, 64, 122, 0.4),
              0 0 30px rgba(236, 64, 122, 0.3);
  position: relative;
  overflow: hidden;
}

.start-stream-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.start-stream-btn:hover::before {
  left: 100%;
}

.start-stream-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(236, 64, 122, 0.6),
              0 0 40px rgba(236, 64, 122, 0.5);
}

.start-stream-btn.streaming {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
  border-color: #ef4444;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4),
              0 0 30px rgba(239, 68, 68, 0.3);
  animation: streaming-pulse 2s ease-in-out infinite;
}

@keyframes streaming-pulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 6px 24px rgba(239, 68, 68, 0.6), 0 0 50px rgba(239, 68, 68, 0.5); }
}

.start-stream-btn.streaming:hover {
  box-shadow: 0 6px 24px rgba(239, 68, 68, 0.6),
              0 0 40px rgba(239, 68, 68, 0.5);
}

/* 右侧面板 (20%) */
.right-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 52, 96, 0.9) 100%);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  z-index: 1;
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
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.1) 0%, rgba(255, 64, 129, 0.05) 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(236, 64, 122, 0.2);
}

.audience-item:hover {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2) 0%, rgba(255, 64, 129, 0.15) 100%);
  border-color: rgba(236, 64, 122, 0.4);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(236, 64, 122, 0.3);
}

.audience-item .rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  border-radius: 4px;
  color: #ff4081;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(236, 64, 122, 0.3);
}

.audience-item .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2), rgba(255, 64, 129, 0.1));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 1px solid rgba(236, 64, 122, 0.3);
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.3);
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.contribution {
  color: #ff4081;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  text-shadow: 0 0 10px rgba(236, 64, 122, 0.8);
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
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.1) 0%, rgba(255, 64, 129, 0.05) 100%);
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  word-wrap: break-word;
  border: 1px solid rgba(236, 64, 122, 0.2);
  transition: all 0.3s ease;
}

.message-item:hover {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.15) 0%, rgba(255, 64, 129, 0.1) 100%);
  border-color: rgba(236, 64, 122, 0.3);
}

.message-item.text .username {
  color: #ff4081;
  font-weight: 600;
  margin-right: 6px;
  text-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
}

.message-item.text .content {
  color: rgba(255, 255, 255, 0.9);
}

.message-item.emoji .username {
  color: #ff4081;
  font-weight: 600;
  margin-right: 6px;
  text-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
}

.message-item.emoji .emoji {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.message-item.system {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.2), rgba(255, 64, 129, 0.15));
  border: 1px solid rgba(236, 64, 122, 0.4);
  text-align: center;
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.3);
}

.message-item.system .system-text {
  color: #ff4081;
  font-size: 12px;
  text-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
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
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.6), rgba(22, 33, 62, 0.4));
  border: 1px solid rgba(236, 64, 122, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  outline: none;
  transition: all 0.3s ease;
}

.message-input input:focus {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.6));
  border-color: #ec407a;
  box-shadow: 0 0 20px rgba(236, 64, 122, 0.4);
}

.message-input input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.emoji-btn,
.send-btn {
  padding: 8px 10px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.6), rgba(22, 33, 62, 0.4));
  border: 1px solid rgba(236, 64, 122, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.emoji-btn:hover,
.send-btn:hover {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.6));
  border-color: rgba(236, 64, 122, 0.5);
  color: #fff;
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.3);
}

.send-btn {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  border-color: rgba(236, 64, 122, 0.5);
  color: #ff4081;
  font-weight: 600;
}

.send-btn:hover {
  background: linear-gradient(135deg, rgba(236, 64, 122, 0.5), rgba(255, 64, 129, 0.3));
  border-color: rgba(236, 64, 122, 0.7);
  box-shadow: 0 0 20px rgba(236, 64, 122, 0.5);
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
  background: rgba(26, 26, 46, 0.5);
  border-radius: 3px;
}

.left-panel::-webkit-scrollbar-thumb,
.audience-list::-webkit-scrollbar-thumb,
.message-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(236, 64, 122, 0.6), rgba(255, 64, 129, 0.4));
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
}

.left-panel::-webkit-scrollbar-thumb:hover,
.audience-list::-webkit-scrollbar-thumb:hover,
.message-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(236, 64, 122, 0.8), rgba(255, 64, 129, 0.6));
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.8);
}
</style>



