<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getDuration } from '@/utils/date.util'

defineProps({
  payInfo: {
    type: Object,
    default: () => {},
  },
})
const emits = defineEmits(['confirm'])
const topUpOption = [
  { id: 23, count: 30, money: 30.0 },
  { id: 24, count: 50, money: 45.0 },
  { id: 25, count: 80, money: 72.0 },
  { id: 26, count: 100, money: 90.0 },
  { id: 27, count: 200, money: 1750.0 },
  { id: 28, count: 300, money: 450.0 },
]
const confirmData = ref({
  payType: '1',
  payMoney: 23,
})
const time = ref(1000 * 60 * 10)
const timerId = ref(null)

const clearTimerId = () => clearInterval(timerId.value)

const pay = (type?: string) => {
  if (type === 'pay')
    return emits('confirm', type)

  emits('confirm', confirmData.value)
  confirmData.value = {
    payType: '1',
    payMoney: 23,
  }
}

onMounted(() => {
  timerId.value = setInterval(() => {
    time.value = time.value - 1000
    if (time.value <= 0)
      clearTimerId()
  }, 1000)
})

defineExpose({ clearTimerId })
</script>

<template>
  <div v-if="payInfo.type === 'pay'" class="pay">
    <div class="pay-top">
      <div class="pay-top-left">
        <div class="pay-top-left-money">
          支付金额(元) <span>999.99</span>
        </div>
        <el-radio-group v-model="confirmData.payType" class="pay-top-left-option">
          <el-radio label="1" border class="pay-top-left-option-item">
            <img src="@/assets/images/diamond.png" alt="">
            支付宝
          </el-radio>
          <el-radio label="2" border class="pay-top-left-option-item">
            <img src="@/assets/images/diamond.png" alt="">
            微信支付
          </el-radio>
        </el-radio-group>
      </div>
      <div class="pay-top-right">
        <img src="" alt="">
        请于 <span>{{ getDuration(time) }}</span> 内完成支付
      </div>
    </div>
    <div class="pay-btn">
      <el-button type="primary" @click="pay">
        确认支付
      </el-button>
    </div>
  </div>
  <div v-if="payInfo.type === 'topUp'" class="topUp">
    <div class="topUp-balance">
      余额 <span>345 </span><img src="@/assets/images/diamond.png" alt="">
    </div>
    <div class="topUp-option">
      <el-radio-group v-model="confirmData.payMoney" class="topUp-option-group">
        <el-radio-button
          v-for="item in topUpOption"
          :key="item.id"
          :label="item.id"
          class="topUp-option-group-card"
        >
          <template #default>
            <div class="topUp-option-group-card-count">
              <img src="@/assets/images/diamond.png" alt="">
              {{ item.count }}
            </div>
            <div class="topUp-option-group-card-money">
              {{ item.money }}元
            </div>
          </template>
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="topUp-btn">
      <el-button type="primary" @click="pay('pay')">
        {{
          confirmData.payMoney
            ? `立即充值${topUpOption.find((item) => item.id === confirmData.payMoney).money}元`
            : "确认充值"
        }}
      </el-button>
      <div class="topUp-btn-tip">
        充值代表您已阅读并同意<span>《用户充值协议》</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pay {
  &-top {
    display: flex;
    justify-content: space-between;
    &-left {
      &-money {
        font-size: 14px;
        span {
          font-weight: 600;
          color: #ed1414;
          font-size: 24px;
        }
      }
      &-option {
        display: grid;
        justify-items: start;
        align-items: center;
        row-gap: 20px;
        align-content: center;
        margin-top: 40px;
        &-item {
          :deep(.el-radio__label) {
            display: flex;
            align-items: center;
            img {
              width: 20px;
              height: 20px;
              margin-right: 5px;
            }
          }
        }
      }
    }
    &-right {
      padding: 24px 50px;
      background: linear-gradient(180deg, rgba(243, 245, 248, 0.26) 0%, #fffeff 100%);
      box-shadow: 0px 0px 10px 0px #eff2f8;
      border-radius: 6px;
      text-align: center;
      img {
        border: 1px solid red;
        width: 170px;
        height: 170px;
        margin-bottom: 16px;
      }
      span {
        color: #ff7d00;
      }
    }
  }

  &-btn {
    text-align: center;
    margin-top: 36px;
  }
}
.topUp {
  &-balance {
    display: flex;
    align-items: baseline;
    span {
      font-size: 24px;
      font-weight: 600;
      margin: 0 5px;
    }
    img {
      width: 20px;
      height: 20px;
    }
  }
  &-option {
    margin: 20px 0 43px;
    &-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      &-card {
        :deep(.el-radio-button__inner) {
          width: 100%;
          height: 100%;
          background-color: #fff;
          border-radius: 6px;
          padding: 20px 40px;
          border: 1px solid #e6e6e6;
        }
        :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
          box-shadow: 0px 0 2px 2px @color-primary !important;
        }
        &-count {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          font-weight: 500;
          color: #000;
          margin-bottom: 10px;
          img {
            width: 16px;
            height: 16px;
            margin-right: 3px;
          }
        }
        &-money {
          color: #ed1414;
          font-weight: 500;
        }
      }
    }
  }
  &-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-tip {
      margin-top: 10px;
      span {
        color: @color-primary;
        cursor: pointer;
      }
    }
  }
}
</style>
