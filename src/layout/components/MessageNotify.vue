<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MessageService } from '@/http/services/MessageService'
import { PageService } from '@/http/extends/page.service'
import type { MessageQueryOutItem } from '@/http/models/message.model'

const props = defineProps<{
  modelValue: boolean
}>()

defineEmits<{ 'update:modelValue': [value: boolean] }>()

const dataSet = ref<MessageQueryOutItem[]>([])
const service = new MessageService()
const pageServce = new PageService()
pageServce.pageLayouts = ['PrevJump', 'NextJump']

const total = ref(0)

const hiddenPager = computed(() => total.value <= pageServce.pageSize.value)

function fetchData() {
  pageServce.reset()
  service.getUnreadList([pageServce]).then((data) => {
    dataSet.value = data.rows
    total.value = data.totalRow
  }).catch(() => { })
}

onMounted(fetchData)

watch(() => props.modelValue, v => v && fetchData())

const router = useRouter()

function onMessageClick(data: MessageQueryOutItem) {
  router.push({ name: 'assets-detail', query: { id: data.fileId } })
  service.setRead([data.id]).then(() => fetchData()).catch(() => { })
}
</script>

<template>
  <div class="component message-notify">
    <el-popover
      placement="bottom-start" :width="400" trigger="click" popper-class="message-notify-popover"
      @show="() => $emit('update:modelValue', false)"
    >
      <template #reference>
        <el-badge :is-dot="modelValue">
          <icon-park-solid-remind class="text-gray-500 " />
        </el-badge>
      </template>
      <el-empty v-if="dataSet.length === 0" description="暂无消息" :image-size="60" />
      <ul v-else>
        <li v-for="item of dataSet" :key="item.id" class="message-item">
          <div class="message-item-info" :class="{ error: item.fileStatus === 4 }">
            {{ item.message }}
          </div>
          <el-button type="primary" link class="message-item-btn" @click="() => onMessageClick(item)">
            查看
          </el-button>
        </li>
      </ul>
      <el-pagination :hide-on-single-page="hiddenPager" :total="total" layout="prev, pager, next" />
    </el-popover>
  </div>
</template>

<style lang="less">
.message-notify-popover {
  min-height: 200px;

  .message-item {
    @apply flex items-center rounded hover:bg-gray-100;

    &-info {
      @apply flex-1 px-1 truncate;

      &.error {
        @apply text-red-500;
      }
    }

    &-btn {
      @apply mx-2 bg-transparent;
    }
  }
}
</style>
