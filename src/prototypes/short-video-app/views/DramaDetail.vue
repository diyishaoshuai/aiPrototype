<template>
  <div class="drama-detail-page bg-gray-50 min-h-screen">
    <van-nav-bar title="短剧详情" left-arrow fixed @click-left="goBack" />
    <div class="pt-12">
      <div class="h-52 flex items-center justify-center text-7xl bg-gradient-to-br from-indigo-500 to-purple-600">
        💼
      </div>
      <div class="bg-white p-4">
        <h1 class="text-xl font-semibold mb-2">霸道总裁爱上我</h1>
        <van-button type="primary" block round @click="playDrama">▶ 开始播放</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => router.back()
const playDrama = () => router.push({ name: 'DramaPlayer', params: { id: 1 }, query: { episode: 1 } })
</script>
