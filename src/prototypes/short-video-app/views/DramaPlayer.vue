<template>
  <div class="drama-player-page bg-black min-h-screen">
    <van-nav-bar title="播放中" left-arrow fixed @click-left="goBack" class="text-white" />
    <div class="pt-12 h-screen flex items-center justify-center text-7xl">
      💼
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()
</script>
