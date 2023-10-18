<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MessageNotify from './MessageNotify.vue'
import { useUserStore } from '@/store/user.store'
import workspaceRoutes from '@/router/routes/workspace.routes'

const currentRoute = useRoute()

const title = ref('')

watch(() => currentRoute.path, () => {
  const menuPath = currentRoute.meta?.menuPath
  if (menuPath)
    title.value = workspaceRoutes.find(x => x.path === menuPath)?.meta?.title ?? ''
  else
    title.value = currentRoute.meta?.title ?? ''
}, { immediate: true })

const hasNew = ref(false)
const userStore = useUserStore()

watch(() => userStore.token, val => val && initSocket(), { immediate: true })
let timerId = -1

function initSocket() {
  // websocket 路径, 正式环境使用/ws 开发环境使用 /socket代理
  const wsPath = process.env.NODE_ENV === 'development' ? '/socket' : '/ws'
  // socket 主机
  const host = window.location.host
  // socket 协议
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  // socket 连接地址
  const baseUrl = `${protocol}//${host}${wsPath}`
  // 编码后的连接地址
  const wsUrl = encodeURI(`${baseUrl}?authorization=token ${userStore.token}`)
  const socket = new WebSocket(wsUrl)
  socket.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('socket connected!')
    socket.send('heartbeat')
  }
  socket.onmessage = ({ data }) => {
    if (data === 'ok') {
      window.clearTimeout(timerId)
      timerId = window.setTimeout(() => socket.send('heartbeat'), 30 * 1000)
    }
    else {
      if (typeof data === 'string')
        hasNew.value = true
    }
  }
}

onBeforeUnmount(() => window.clearTimeout(timerId))
</script>

<template>
  <el-header>
    <h1>{{ title }}</h1>
    <MessageNotify v-model="hasNew" />
  </el-header>
</template>

<style lang="less" scoped>
header {
  @apply text-lg font-bold flex justify-between items-center bg-white;
}
</style>
