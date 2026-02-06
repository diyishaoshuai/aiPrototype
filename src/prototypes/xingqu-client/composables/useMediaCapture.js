import { ref, onUnmounted } from 'vue'

export function useMediaCapture() {
  const cameras = ref([])
  const microphones = ref([])
  const currentStream = ref(null)
  const error = ref(null)

  // 枚举媒体设备
  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      cameras.value = devices.filter(d => d.kind === 'videoinput')
      microphones.value = devices.filter(d => d.kind === 'audioinput')
      return { cameras: cameras.value, microphones: microphones.value }
    } catch (err) {
      error.value = '无法枚举设备: ' + err.message
      console.error('枚举设备失败:', err)
      return { cameras: [], microphones: [] }
    }
  }

  // 获取摄像头流
  const getCameraStream = async (deviceId = null) => {
    try {
      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: true
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      // 停止之前的流
      if (currentStream.value) {
        currentStream.value.getTracks().forEach(track => track.stop())
      }

      currentStream.value = stream
      error.value = null
      return stream
    } catch (err) {
      error.value = '摄像头访问失败: ' + err.message
      console.error('摄像头访问失败:', err)
      return null
    }
  }

  // 获取屏幕捕获流
  const getScreenStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      })

      // 停止之前的流
      if (currentStream.value) {
        currentStream.value.getTracks().forEach(track => track.stop())
      }

      currentStream.value = stream
      error.value = null
      return stream
    } catch (err) {
      error.value = '屏幕捕获失败: ' + err.message
      console.error('屏幕捕获失败:', err)
      return null
    }
  }

  // 停止当前流
  const stopStream = () => {
    if (currentStream.value) {
      currentStream.value.getTracks().forEach(track => track.stop())
      currentStream.value = null
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    stopStream()
  })

  return {
    cameras,
    microphones,
    currentStream,
    error,
    enumerateDevices,
    getCameraStream,
    getScreenStream,
    stopStream
  }
}
