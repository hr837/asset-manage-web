<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import MemberLevelTable from './components/MemberLevelTable.vue'
import MemberPriceCard from './components/MemberPriceCard.vue'
import { MemberPriceMonthly, MemberPriceQuarterly, MemberPriceYearly, RechargePrice } from './composable/constant'
import MemberDiamondRecharge from './components/MemberDiamondRecharge.vue'
import MemberPayment from './components/MemberPayment.vue'
import { useUserStore } from '@/store/user.store'

const userStore = useUserStore()
const myDiamondCount = computed(() => userStore.diamondCount)

const dialogShow = reactive({
  rechrnge: false,
  subscribe: false,
})

const payInfo = reactive({
  diamond: 0,
  amount: 0,
})

function onUserCharge(sku: string) {
  dialogShow.rechrnge = false
  const item = RechargePrice.find(x => x.sku === sku)!
  payInfo.amount = item.price
  payInfo.diamond = item.diamond
  dialogShow.subscribe = true
}

function onPaySuccess() {
  ElMessage.success('充值成功')
  payInfo.amount = 0
  userStore.increaseDiamond(payInfo.diamond)
}
</script>

<template>
  <el-container class="page member-plan-view">
    <el-header class="flex items-center border-b">
      <span class="font-semibold">计划&价格</span>
    </el-header>
    <el-main class="px-0 pt-0">
      <el-tabs model-value="monthly">
        <el-tab-pane label="包月" name="monthly">
          <MemberPriceCard v-for="item of MemberPriceMonthly" :key="`monthly-${item.level}`" unit="月" v-bind="item" />
        </el-tab-pane>
        <el-tab-pane label="包季(优惠)" name="quarterly">
          <MemberPriceCard v-for="item of MemberPriceQuarterly" :key="`quarterly-${item.level}`" unit="季" v-bind="item" />
        </el-tab-pane>
        <el-tab-pane label="包月(优惠)" name="yearly">
          <MemberPriceCard v-for="item of MemberPriceYearly" :key="`yearly-${item.level}`" unit="年" v-bind="item" />
        </el-tab-pane>
      </el-tabs>
      <!-- vip等级区分 -->
      <div class="px-4">
        <MemberLevelTable />
      </div>

      <!-- 钻石充值弹窗 -->
      <MemberDiamondRecharge v-model="dialogShow.rechrnge" :balance="myDiamondCount" @charge="onUserCharge" />
      <!-- 支付弹窗 -->
      <MemberPayment v-model="dialogShow.subscribe" :amount="payInfo.amount" @success="onPaySuccess" />
      <!-- </el-dialog> -->
    </el-main>
    <el-footer class="border-t flex justify-end items-center">
      <el-button type="primary" @click="dialogShow.rechrnge = true">
        <icon-local-diamond class="mr-1" />
        充值
      </el-button>
    </el-footer>
  </el-container>
</template>

<style lang="less" scoped>
.el-tab-pane {
  @apply grid grid-cols-5 gap-4 pt-4 pb-6 px-10;
}

:deep(.el-tabs) {
  --el-tabs-header-height: 34px;

  .el-tabs__header {
    background: linear-gradient(180deg, #F3F5F8 0%, #FFFEFF 100%);
    @apply pt-4;
  }

  .el-tabs__nav-wrap {
    @apply w-80 m-auto bg-gray-200 rounded-3xl px-4;

  }

  .el-tabs__nav {
    @apply float-none~'py-0.5';

    .el-tabs__item {
      @apply flex-1 px-0 text-sm select-none text-black/40;

      &.is-active {
        @apply text-white border-2 border-gray-100 bg-violet-500 shadow shadow-violet-200 rounded-3xl;
      }
    }
  }

  .el-tabs__active-bar {
    display: none;
  }
}
</style>
