<script lang="ts" setup>
import { computed, ref } from 'vue'
import CountUp from 'vue-countup-v3'
import { useUserStore } from '@/store/user.store'

const userStore = useUserStore()
const startValue = ref(userStore.diamondCount)
const userDiamondCount = computed(() => userStore.diamondCount)
</script>

<template>
  <div class="component member-card">
    <div class="text-center font-semibold">
      免费会员
    </div>
    <div class="member-grade">
      <icon-local-diamond />
      <div class="diamond-count font-semibold text-2xl">
        <!-- {{ userDiamondCount }} -->
        <CountUp :start-val="startValue" :end-val="userDiamondCount" @finished="startValue = userDiamondCount" />
      </div>
      <div class="flex-1 text-right">
        <RouterLink to="/member">
          <el-button type="primary" plain round style="--el-button-bg-color:#fff">
            充值
          </el-button>
        </RouterLink>
      </div>
    </div>
    <div class="mt-8 ">
      <RouterLink to="/member">
        <el-button class="w-full" type="primary" size="large">
          升级计划
        </el-button>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="less" scoped>
.member-card {
  box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.05), 0px 38px 76px 0px rgba(150, 119, 247, 0.1);
  width: 196px;
  @apply p-4 mx-auto my-4 rounded;
}

.member-grade {
  @apply mt-4 flex gap-2 items-center;
}
</style>
