<template>
  <DraggableWindow title="星趣直播工具">
    <div class="streaming-tool">
    <!-- 左侧：视频预览区域 (70%) -->
    <div class="preview-section">
      <VideoPreview
        :stream="currentStream"
        :beautyIntensity="beautyIntensity"
        :filter="selectedFilter"
      />

      <SceneManager
        v-model:activeScene="activeScene"
        :scenes="scenes"
        @create-scene="createScene"
        @delete-scene="deleteScene"
      />
    </div>

    <!-- 右侧：控制面板 (30%) -->
    <div class="control-panel">
      <SourceSelector
        @camera-selected="handleCameraSelected"
        @screen-capture="handleScreenCapture"
      />
      <BeautyPanel
        v-model:intensity="beautyIntensity"
        v-model:filter="selectedFilter"
      />
      <AudioMixer
        v-model:volume="audioVolume"
        v-model:noiseReduction="noiseReduction"
      />
      <StreamSettings
        v-model:quality="streamQuality"
        v-model:bitrate="bitrate"
        v-model:framerate="framerate"
      />
      <StreamStats
        :viewers="viewers"
        :bitrate="currentBitrate"
        :fps="currentFps"
      />
      <button
        class="start-stream-btn"
        :class="{ streaming: isStreaming }"
        @click="toggleStream"
      >
        {{ isStreaming ? '停止直播' : '开始直播' }}
      </button>
    </div>
    </div>
  </DraggableWindow>
</template>

<script setup>
import { ref } from 'vue'
import DraggableWindow from '../components/DraggableWindow.vue'
import VideoPreview from '../components/streaming/VideoPreview.vue'
import SceneManager from '../components/streaming/SceneManager.vue'
import SourceSelector from '../components/streaming/SourceSelector.vue'
import BeautyPanel from '../components/streaming/BeautyPanel.vue'
import AudioMixer from '../components/streaming/AudioMixer.vue'
import StreamSettings from '../components/streaming/StreamSettings.vue'
import StreamStats from '../components/streaming/StreamStats.vue'
import { useMediaCapture } from '../composables/useMediaCapture.js'

const { currentStream, getCameraStream, getScreenStream } = useMediaCapture()

// 场景管理
const scenes = ref([
  { id: 'scene-1', name: '场景1', sources: [] }
])
const activeScene = ref('scene-1')

// 美颜设置
const beautyIntensity = ref(50)
const selectedFilter = ref('none')

// 音频设置
const audioVolume = ref(80)
const noiseReduction = ref(false)

// 推流设置
const streamQuality = ref('hd')
const bitrate = ref(2500)
const framerate = ref(30)

// 实时数据
const viewers = ref(0)
const currentBitrate = ref(0)
const currentFps = ref(0)
const isStreaming = ref(false)

// 处理摄像头选择
const handleCameraSelected = async (deviceId) => {
  const stream = await getCameraStream(deviceId)
  if (stream) {
    currentStream.value = stream
  }
}

// 处理屏幕捕获
const handleScreenCapture = async () => {
  const stream = await getScreenStream()
  if (stream) {
    currentStream.value = stream
  }
}

// 创建场景
const createScene = () => {
  const newId = `scene-${scenes.value.length + 1}`
  scenes.value.push({
    id: newId,
    name: `场景${scenes.value.length + 1}`,
    sources: []
  })
}

// 删除场景
const deleteScene = (sceneId) => {
  if (scenes.value.length > 1) {
    scenes.value = scenes.value.filter(s => s.id !== sceneId)
    if (activeScene.value === sceneId) {
      activeScene.value = scenes.value[0].id
    }
  }
}

// 切换直播状态
const toggleStream = () => {
  isStreaming.value = !isStreaming.value
  if (isStreaming.value) {
    // 模拟直播数据
    currentBitrate.value = bitrate.value
    currentFps.value = framerate.value
    viewers.value = Math.floor(Math.random() * 100)
  } else {
    currentBitrate.value = 0
    currentFps.value = 0
    viewers.value = 0
  }
}
</script>

<style scoped>
.streaming-tool {
  display: flex;
  height: 640px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.preview-section {
  flex: 7;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
}

.control-panel {
  flex: 3;
  background: white;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-left: 1px solid #e5e7eb;
}

.start-stream-btn {
  width: 100%;
  padding: 16px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
}

.start-stream-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.start-stream-btn.streaming {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}
</style>
