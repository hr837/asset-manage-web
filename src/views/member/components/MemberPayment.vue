<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { Subscription } from 'rxjs'
import { take, timer } from 'rxjs'
import { ref } from 'vue'
import { getTimeDown } from '@/utils/date.util'

const props = defineProps<{
  amount: number
  modelValue: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [falg: boolean]
}>()

let sub: Subscription | null = null

function closeDialog() {
  sub?.unsubscribe()
  emit('update:modelValue', false)
}

const leftTime = ref('')
const timeCount = 600

function onDialogOpened() {
  sub = timer(0, 1000).pipe(take(timeCount)).subscribe({
    next: (count) => {
      leftTime.value = `${getTimeDown(timeCount - count)}s`
    },
    complete: () => {
      ElMessage.error('支付超时')
      closeDialog()
    },
  })
}
</script>

<template>
  <el-dialog title="支付" :model-value="modelValue" @close="closeDialog" @opened="onDialogOpened">
    <div class="pay-left">
      <div class="pay-amount text-black/90">
        支付金额
        <span class="text-black/40">(元)</span>
        <b class="text-red-500 text-2xl font-semibold pl-2">{{ amount }}</b>
      </div>
      <el-radio-group class="pay-way">
        <el-radio label="wxpay">
          微信支付
        </el-radio>
        <el-radio label="alipay">
          支付宝
        </el-radio>
      </el-radio-group>
    </div>
    <div class="pay-right">
      <div class="text-black/60">
        请于
        <b class="text-orange-400">{{ leftTime }}</b>
        内完成支付
      </div>
    </div>
  </el-dialog>
</template>

<style lang="less" scoped></style>
