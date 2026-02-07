<template>
  <div
    ref="windowRef"
    class="draggable-window"
    :class="{ maximized: isMaximized, dragging: isDragging }"
    :style="windowStyle"
  >
    <!-- 窗口标题栏 -->
    <div
      class="window-titlebar"
      @mousedown="startDrag"
      @dblclick="toggleMaximize"
    >
      <div class="titlebar-left">
        <span class="window-icon">⭐</span>
        <span class="window-title">{{ title }}</span>
      </div>

      <div class="titlebar-right">
        <button class="window-btn minimize" @click.stop="minimize" title="最小化">
          <span>─</span>
        </button>
        <button class="window-btn maximize" @click.stop="toggleMaximize" :title="isMaximized ? '还原' : '最大化'">
          <span>{{ isMaximized ? '❐' : '□' }}</span>
        </button>
        <button class="window-btn close" @click.stop="close" title="关闭">
          <span>×</span>
        </button>
      </div>
    </div>

    <!-- 窗口内容区 -->
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '星趣直播工具'
  }
})

const emit = defineEmits(['close', 'minimize'])

// 窗口引用
const windowRef = ref(null)

// 窗口状态
const isMaximized = ref(false)
const isDragging = ref(false)

// 窗口位置和尺寸
const windowWidth = ref(1280)
const windowHeight = ref(720)
const windowX = ref(0)
const windowY = ref(0)

// 初始化窗口居中位置
onMounted(() => {
  const canvasWidth = window.innerWidth
  const canvasHeight = window.innerHeight
  windowX.value = Math.max(0, (canvasWidth - windowWidth.value) / 2)
  windowY.value = Math.max(0, (canvasHeight - windowHeight.value) / 2)
})

// 保存最大化前的状态
const savedState = ref({
  x: 0,
  y: 0,
  width: 1280,
  height: 720
})

// 拖拽相关
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)
let rafId = null
let canvasBounds = null

// 计算窗口样式
const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      transform: 'translate(0, 0)',
      width: '100%',
      height: '100%'
    }
  }

  return {
    transform: `translate(${windowX.value}px, ${windowY.value}px)`,
    width: `${windowWidth.value}px`,
    height: `${windowHeight.value}px`
  }
})

// 开始拖拽
const startDrag = (e) => {
  if (isMaximized.value) return

  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  dragOffsetX.value = windowX.value
  dragOffsetY.value = windowY.value

  // 缓存画布边界
  canvasBounds = {
    width: window.innerWidth,
    height: window.innerHeight,
    maxX: window.innerWidth - windowWidth.value,
    maxY: window.innerHeight - windowHeight.value
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 拖拽中（使用 RAF 优化）
const onDrag = (e) => {
  if (!isDragging.value) return

  if (rafId) return

  rafId = requestAnimationFrame(() => {
    const deltaX = e.clientX - dragStartX.value
    const deltaY = e.clientY - dragStartY.value

    // 计算新位置
    let newX = dragOffsetX.value + deltaX
    let newY = dragOffsetY.value + deltaY

    // 边界检测（使用缓存的边界值）
    newX = Math.max(0, Math.min(newX, canvasBounds.maxX))
    newY = Math.max(0, Math.min(newY, canvasBounds.maxY))

    windowX.value = newX
    windowY.value = newY

    rafId = null
  })
}

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
  canvasBounds = null

  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 切换最大化
const toggleMaximize = () => {
  if (isMaximized.value) {
    // 还原
    windowX.value = savedState.value.x
    windowY.value = savedState.value.y
    windowWidth.value = savedState.value.width
    windowHeight.value = savedState.value.height
    isMaximized.value = false
  } else {
    // 最大化前保存状态
    savedState.value = {
      x: windowX.value,
      y: windowY.value,
      width: windowWidth.value,
      height: windowHeight.value
    }
    isMaximized.value = true
  }
}

// 最小化
const minimize = () => {
  emit('minimize')
}

// 关闭
const close = () => {
  emit('close')
}

// 清理
onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.draggable-window {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 12px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  background: rgba(20, 20, 30, 0.95);
}

/* 拖拽时禁用过渡动画 */
.draggable-window.dragging {
  transition: none !important;
}

.draggable-window.maximized {
  border-radius: 0;
  transition: all 0.2s ease;
}

.window-titlebar {
  height: 48px;
  background: linear-gradient(135deg,
    rgba(139, 92, 246, 0.2) 0%,
    rgba(59, 130, 246, 0.2) 100%);
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  cursor: move;
  user-select: none;
  flex-shrink: 0;
  position: relative;
}

.window-titlebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(139, 92, 246, 0.5) 50%,
    transparent 100%);
}

.draggable-window.maximized .window-titlebar {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.window-icon {
  font-size: 20px;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.8));
}

.window-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.titlebar-right {
  display: flex;
  gap: 8px;
}

.window-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.window-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.window-btn.close:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.window-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(15, 15, 25, 0.98);
}

.draggable-window.maximized .window-content {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
