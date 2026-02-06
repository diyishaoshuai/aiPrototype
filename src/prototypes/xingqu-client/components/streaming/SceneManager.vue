<template>
  <div class="scene-manager">
    <div class="scene-list">
      <button
        v-for="scene in scenes"
        :key="scene.id"
        class="scene-btn"
        :class="{ active: scene.id === activeScene }"
        @click="selectScene(scene.id)"
      >
        {{ scene.name }}
        <span
          v-if="scenes.length > 1"
          class="delete-icon"
          @click.stop="deleteScene(scene.id)"
        >
          ×
        </span>
      </button>

      <button class="add-scene-btn" @click="createScene">
        + 新建场景
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeScene: String,
  scenes: Array
})

const emit = defineEmits(['update:activeScene', 'create-scene', 'delete-scene'])

const selectScene = (sceneId) => {
  emit('update:activeScene', sceneId)
}

const createScene = () => {
  emit('create-scene')
}

const deleteScene = (sceneId) => {
  emit('delete-scene', sceneId)
}
</script>

<style scoped>
.scene-manager {
  padding: 12px;
  background: white;
  border-radius: 8px;
  height: 70px;
}

.scene-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.scene-btn {
  position: relative;
  padding: 8px 14px;
  border: 1.5px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  height: 46px;
}

.scene-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.scene-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.delete-icon {
  margin-left: 8px;
  font-size: 18px;
  font-weight: bold;
  opacity: 0.7;
}

.delete-icon:hover {
  opacity: 1;
}

.add-scene-btn {
  padding: 8px 14px;
  border: 1.5px dashed #e5e7eb;
  background: white;
  color: #667eea;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  height: 46px;
}

.add-scene-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}
</style>
