<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import MessageNotify from './MessageNotify.vue'
import { useUserStore } from '@/store/user.store'
import router from '@/router'

const hasNew = ref(false)
const userStore = useUserStore()
let socket: WebSocket | null = null
const isDev = process.env.NODE_ENV === 'development'
watch(() => userStore.token, val => !isDev && val && initSocket(), { immediate: true })
let timerId = -1

function initSocket() {
  // websocket 路径, 正式环境使用/ws 开发环境使用 /socket代理
  const wsPath = isDev ? '/socket' : '/ws'
  // socket 主机
  const host = window.location.host
  // socket 协议
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  // socket 连接地址
  const baseUrl = `${protocol}//${host}${wsPath}`
  // 编码后的连接地址
  const wsUrl = encodeURI(`${baseUrl}?authorization=token ${userStore.token}`)
  socket = new WebSocket(wsUrl)
  socket.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('socket connected!')
    socket?.send('heartbeat')
  }
  socket.onmessage = ({ data }) => {
    if (data === 'ok') {
      window.clearTimeout(timerId)
      timerId = window.setTimeout(() => socket?.send('heartbeat'), 30 * 1000)
    }
    else {
      if (typeof data === 'string')
        hasNew.value = true
    }
  }
}

onBeforeUnmount(() => window.clearTimeout(timerId))
function exit() {
  socket?.close()
  userStore.$reset()
  router.push({ name: 'login' })
}
</script>

<template>
  <ul class="component header-action">
    <li>
      <MessageNotify v-model="hasNew" />
    </li>
    <li>
      <el-popconfirm title="确定退出账号吗?" width="200px" @confirm="exit">
        <template #reference>
          <icon-park-outline-logout class="h-5 w-5" />
        </template>
      </el-popconfirm>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.header-action {
  @apply flex justify-end items-center gap-4;

  li {
    @apply cursor-pointer text-gray-500;
  }
}
</style>
