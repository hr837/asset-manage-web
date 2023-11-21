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
  'success': []
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

const payWay = ref('wxpay')

function onPayComplete() {
  emit('update:modelValue', false)
  emit('success')
}
</script>

<template>
  <el-dialog
    class="component member-payment" title="支付" :model-value="modelValue" width="580px"
    @close="closeDialog" @opened="onDialogOpened"
  >
    <div class="pay-left">
      <div class="pay-amount text-black/90">
        支付金额
        <span class="text-black/40">(元)</span>
        <b class="text-red-500 text-2xl font-semibold pl-2">{{ amount }}</b>
      </div>
      <el-radio-group v-model="payWay" class="pay-way">
        <el-radio label="wxpay">
          <icon-local-wechat class="inline-block" />
          微信支付
        </el-radio>
        <el-radio label="alipay">
          <icon-local-alipay class="inline-block" />
          支付宝
        </el-radio>
      </el-radio-group>
    </div>
    <div class="pay-right">
      <img class="pay-image" src="/images/tmp/pay-qrcode.png" alt="pay-qr-code">
      <div class="pay-tip">
        请于
        <b class="text-orange-400">{{ leftTime }}</b>
        内完成支付
      </div>
    </div>
    <template #footer>
      <el-button type="primary" size="large" @click="onPayComplete">
        支付完成
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="less">
.component.member-payment {
  .el-dialog__body {
    @apply flex justify-between p-8;

    .pay-way{
      @apply pt-8;
      .el-radio{
        @apply mb-4;
      }
    }

    .pay-right {
      background: linear-gradient(180deg, rgba(243, 245, 248, 0.26) 0%, #FFFEFF 100%);
      box-shadow: 0px 0px 10px 0px #EFF2F8;
      @apply border-2 border-white rounded;

      .pay-image {
        @apply mx-12 mt-6 mb-4 border rounded overflow-hidden;
      }

      .pay-tip {
        @apply text-black/60 text-center pb-6;
      }
    }
  }
  .el-dialog__footer{
    @apply text-center;
  }
}
</style>
