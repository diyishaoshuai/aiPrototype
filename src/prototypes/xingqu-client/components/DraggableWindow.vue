<template>
  <div
    class="draggable-window"
    :class="{ maximized: isMaximized }"
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

// 窗口状态
const isMaximized = ref(false)
const isDragging = ref(false)

// 窗口位置和尺寸
const windowWidth = ref(1000)
const windowHeight = ref(500)
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
  width: 1000,
  height: 500
})

// 拖拽相关
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

// 计算窗口样式
const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%'
    }
  }

  return {
    left: `${windowX.value}px`,
    top: `${windowY.value}px`,
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

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 拖拽中
const onDrag = (e) => {
  if (!isDragging.value) return

  const deltaX = e.clientX - dragStartX.value
  const deltaY = e.clientY - dragStartY.value

  // 计算新位置
  let newX = dragOffsetX.value + deltaX
  let newY = dragOffsetY.value + deltaY

  // 获取画布尺寸
  const canvasWidth = window.innerWidth
  const canvasHeight = window.innerHeight

  // 边界检测
  newX = Math.max(0, Math.min(newX, canvasWidth - windowWidth.value))
  newY = Math.max(0, Math.min(newY, canvasHeight - windowHeight.value))

  windowX.value = newX
  windowY.value = newY
}

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
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
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.draggable-window {
  position: absolute;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.draggable-window.maximized {
  border-radius: 0;
  transition: all 0.2s ease;
}

.window-titlebar {
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: move;
  user-select: none;
  flex-shrink: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.draggable-window.maximized .window-titlebar {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.window-icon {
  font-size: 18px;
}

.window-title {
  font-size: 14px;
  font-weight: 600;
}

.titlebar-right {
  display: flex;
  gap: 4px;
}

.window-btn {
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.window-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.window-btn.close:hover {
  background: #ef4444;
}

.window-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.draggable-window.maximized .window-content {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>


