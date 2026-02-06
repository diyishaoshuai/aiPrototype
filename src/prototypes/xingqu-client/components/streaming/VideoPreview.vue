<template>
  <div class="video-preview">
    <canvas
      ref="canvasRef"
      class="preview-canvas"
      :width="1280"
      :height="720"
    ></canvas>

    <div v-if="!stream" class="no-stream-placeholder">
      <div class="placeholder-icon">📹</div>
      <p>请选择视频源开始预览</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  stream: {
    type: MediaStream,
    default: null
  },
  beautyIntensity: {
    type: Number,
    default: 0
  },
  filter: {
    type: String,
    default: 'none'
  }
})

const canvasRef = ref(null)
const videoElement = ref(null)
let animationFrameId = null

// 初始化视频元素
onMounted(() => {
  videoElement.value = document.createElement('video')
  videoElement.value.autoplay = true
  videoElement.value.muted = true
})

// 停止渲染（需要在 watch 之前定义）
const stopRendering = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 清空画布
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    ctx.clearRect(0, 0, 1280, 720)
  }
}

// 开始渲染
const startRendering = () => {
  const render = () => {
    if (canvasRef.value && videoElement.value && videoElement.value.readyState >= 2) {
      const ctx = canvasRef.value.getContext('2d')

      // 绘制视频帧
      ctx.drawImage(videoElement.value, 0, 0, 1280, 720)

      // 应用美颜效果
      if (props.beautyIntensity > 0) {
        applyBeautyFilter(ctx, props.beautyIntensity)
      }

      // 应用滤镜
      if (props.filter !== 'none') {
        applyFilter(ctx, props.filter)
      }
    }

    animationFrameId = requestAnimationFrame(render)
  }

  render()
}

// 监听stream变化
watch(() => props.stream, (newStream) => {
  if (newStream && videoElement.value) {
    videoElement.value.srcObject = newStream
    videoElement.value.play()
    startRendering()
  } else {
    stopRendering()
  }
}, { immediate: true })

// 应用美颜滤镜
const applyBeautyFilter = (ctx, intensity) => {
  const imageData = ctx.getImageData(0, 0, 1280, 720)
  const data = imageData.data
  const brightness = intensity * 0.3

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] + brightness)     // R
    data[i + 1] = Math.min(255, data[i + 1] + brightness) // G
    data[i + 2] = Math.min(255, data[i + 2] + brightness) // B
  }

  ctx.putImageData(imageData, 0, 0)
}

// 应用滤镜
const applyFilter = (ctx, filterType) => {
  const filters = {
    fresh: 'brightness(1.1) contrast(1.1) saturate(1.2)',
    retro: 'sepia(0.5) contrast(1.2)',
    blackwhite: 'grayscale(1) contrast(1.1)'
  }

  if (filters[filterType]) {
    ctx.filter = filters[filterType]
  }
}

// 清理
onUnmounted(() => {
  stopRendering()
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
})
</script>

<style scoped>
.video-preview {
  position: relative;
  width: 100%;
  flex: 1;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.preview-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-stream-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-stream-placeholder p {
  font-size: 16px;
  margin: 0;
}
</style>
