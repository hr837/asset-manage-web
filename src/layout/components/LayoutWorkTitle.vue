<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user.store'

const currentRoute = useRoute()
const title = computed(() => {
  return (currentRoute.meta && currentRoute.meta.title) || '标题'
})

const userStore = useUserStore()

watch(() => userStore.token, val => val && initSocket(), { immediate: true })
let timerId = -1

function initSocket() {
  const isProd = process.env.NODE_ENV === 'production'
  const configBaseUrl = process.env.VUE_APP_SOCKET_BASE!
  const baseUrl = isProd ? configBaseUrl : `ws://${window.location.host}${configBaseUrl}`
  const wsUrl = encodeURI(`${baseUrl}?authorization=token ` + 'b8f5d9e1-eb47-4f80-a066-c64356b1d066')
  const socket = new WebSocket(wsUrl)
  socket.onopen = () => {
    console.log('socket connected!')
    socket.send('heartbeat')
  }
  socket.onmessage = ({ data }) => {
    if (data === 'ok') {
      window.clearTimeout(timerId)
      timerId = window.setTimeout(() => socket.send('heartbeat'), 30 * 1000)
    }
    else {
      onSocketMessage(data)
    }
  }
}

function onSocketMessage(data: any) {
  console.log(data)
}
</script>

<template>
  <el-header>
    <h1>{{ title }}</h1>
    <div>
      <el-badge is-dot class="item">
        <icon-park-solid-remind />
      </el-badge>
    </div>
  </el-header>
</template>

<style lang="less" scoped>
header {
  @apply font-bold flex justify-between items-center bg-white;
}
</style>
