<script lang="ts" setup>
import { computed, ref } from 'vue'
import { RechargePrice } from '../composable/constant'

defineProps<{
  /** 账户钻石余额 */
  balance: number
  modelValue: boolean
}>()
defineEmits<{
  'update:modelValue': [value:boolean]
  'charge': [sku:string]
}>()

const selectValue = ref(RechargePrice[0].sku)

const currentInfo = computed(() => RechargePrice.find(x => x.sku === selectValue.value))
</script>

<template>
  <el-dialog
    class="component diamond-recharge" :model-value="modelValue" title="钻石充值" width="550px"
    @close="$emit('update:modelValue', false)"
  >
    <div class="diamond-balance">
      <span>余额</span>
      <span class="pl-2 pr-1 text-2xl font-semibold">{{ balance }} </span>
      <icon-local-diamond class="inline-block" />
    </div>
    <el-radio-group v-model="selectValue">
      <el-radio v-for="item in RechargePrice" :key="item.sku" :label="item.sku" border>
        <div class="inline-flex items-center">
          <icon-local-diamond class="inline-block" />
          <span class="pl-1 text-2xl">{{ item.diamond }}</span>
        </div>
        <div class="text-red-500 mt-1">
          {{ item.price }}元
        </div>
      </el-radio>
    </el-radio-group>
    <template #footer>
      <el-button type="primary" size="large" @click="$emit('charge', selectValue)">
        立即充值{{ currentInfo?.price }}元
      </el-button>
      <div class="mt-2 text-sm">
        <span class="pt-px">充值代表您已阅读并同意</span>
        <el-button link text type="primary">
          《用户充值协议》
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.component.diamond-recharge {
  .el-radio-group {
    @apply grid grid-cols-3 gap-4 pt-4;
  }

  .el-radio {
    --el-radio-text-color: rgba(0,0,0,0.9);
    background: linear-gradient(to bottom, #F3F5F8, #fff);
    box-shadow: 6px 10px 30px 0px #EFF2F8;
    @apply h-auto w-full m-auto p-2;

    .el-radio__input {
      @apply hidden;
    }

    .el-radio__label {
      @apply w-full text-center pl-0;

    }
  }

  .el-dialog__footer {
    @apply text-center;
  }
}
</style>
