<script lang="ts" setup>
import { computed } from 'vue'
import { MemberSetting } from '../composable/constant'

const props = defineProps<{
  level: number
  price: number
  priceNow?: number
  unit?: string
}>()

const levelInfo = computed(() => MemberSetting.find(x => x.level === props.level) || MemberSetting[0])
const disCount = computed(() => props.priceNow ? props.priceNow / props.price : 1)
const showBtn = computed(() => props.level > 0)
const disCountText = computed(() => {
  const value = disCount.value
  if (value === 1)
    return ''
  const precentage = Math.round(value * 100)
  return `${precentage}%优惠`
})
</script>

<template>
  <div class="component member-price-card">
    <div v-if="disCount !== 1" class="price-discount">
      {{ disCountText }}
    </div>
    <div class="member-name">
      <icon-park-solid-vip-one v-if="showBtn" class="inline-block" :style="{ color: levelInfo.color }" />
      {{ levelInfo.name }}
    </div>
    <div class="price-wrapper">
      <div class="price-now">
        <span>￥</span>
        <span class="price-now-value">{{ priceNow || price }}</span>
        <span class="text-black"><b>/</b>{{ unit }}</span>
      </div>
      <div v-if="disCount !== 1" class="price">
        <span>￥</span>
        <span>{{ price }}</span>
        <span><b>/</b>{{ unit }}</span>
      </div>
    </div>
    <el-button v-if="showBtn" type="primary">
      开始体验
    </el-button>
  </div>
</template>

<style lang="less" scoped>
.member-price-card {
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04), 0px 38px 76px 0px rgba(150, 119, 247, 0.05);
  @apply bg-white rounded p-6 flex flex-col items-center relative;
}

.price-wrapper {
  @apply my-4 h-16 flex flex-col items-center justify-center;

  .price-now {
    @apply text-red-600;

    &-value {
      @apply text-3xl font-semibold;
    }
  }

  .price {
    @apply line-through text-gray-400;
  }
}

.price-discount{
  background: url('/public/images/discount-bg.png') no-repeat center/cover;
  @apply absolute -top-1 right-0 text-xs text-white/90 px-6 py-2 select-none;
}
</style>
