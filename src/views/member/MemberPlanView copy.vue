<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Card from './components/Card.vue'
import Table from './components/Table.vue'
import PayDialog from './components/PayDialog.vue'

const activeName = ref('包月')
const costTypes = ['包月', '包季(优惠)', '包年(优惠)']
const cardList = [
  {
    icon: '',
    label: '免费版',
    price: 0,
    costPrice: 0,
    isDiscount: 0,
    discount: 0,
    type: '月',
    btnText: '',
  },
  {
    icon: require('@/assets/images/diamond1.png'),
    label: '普通会员',
    price: 149,
    costPrice: 149,
    isDiscount: 1,
    discount: 90,
    type: '月',
    btnText: '开始体验',
  },
  {
    icon: require('@/assets/images/diamond2.png'),
    label: '高级会员',
    price: 269,
    costPrice: 269,
    isDiscount: 1,
    discount: 90,
    type: '月',
    btnText: '开始体验',
  },
  {
    icon: require('@/assets/images/diamond3.png'),
    label: '进阶会员',
    price: 1109,
    costPrice: 1109,
    isDiscount: 1,
    discount: 90,
    type: '月',
    btnText: '开始体验',
  },
  {
    icon: require('@/assets/images/diamond4.png'),
    label: '黑钻会员',
    price: 4199,
    costPrice: 4199,
    isDiscount: 1,
    discount: 90,
    type: '月',
    btnText: '开始体验',
  },
]
const tableData = [
  {
    ability: '钻石数量',
    tip: '使用钻石进行视频创作，每月赠送，不可转下个月（1💎=1秒钟视频转换）',
    vip0: '35',
    vip1: '180',
    vip2: '480',
    vip3: '1500',
    vip4: '6000',
  },
  {
    ability: '视频最长时间',
    tip: '每个上传视频剪辑允许的最大视频长度（即持续时间）',
    vip0: '35s',
    vip1: '1min',
    vip2: '3min',
    vip3: '25min',
    vip4: '100min',
  },
  {
    ability: '工作优先级',
    tip: '优先级较高的用户将首先处理其动画作业',
    vip0: '低',
    vip1: '中',
    vip2: '高',
    vip3: '高',
    vip4: '最高',
  },
  {
    ability: '每秒最大帧数',
    tip: '输入视频允许的最大每秒帧数(FPS)',
    vip0: '30帧/秒',
    vip1: '30帧/秒',
    vip2: '60帧/秒',
    vip3: '120帧/秒',
    vip4: '240帧/秒',
  },
  {
    ability: '批量上传',
    tip: '同时上传多个视频',
    vip0: 0,
    vip1: 0,
    vip2: 1,
    vip3: 1,
    vip4: 1,
  },
  { ability: '商业许可', tip: '', vip0: 0, vip1: 1, vip2: 1, vip3: 1, vip4: 1 },
]
const payDialog = ref(null)
const payInfo = reactive({ show: false, title: '支付', type: 'pay' })

const onPlayShow = (cardItem, type) => {
  switch (type) {
    case 'pay':
      payInfo.title = '支付'
      break

    default:
      payInfo.title = '钻石充值'
      break
  }
  payInfo.type = type
  payInfo.show = true
}

const close = () => {
  payDialog.value.clearTimerId()
  payInfo.show = false
}
const onPay = (data) => {
  if (data === 'pay') {
    payInfo.type = data
    return
  }
  close()
}
</script>

<template>
  <div class="page">
    <el-tabs v-model="activeName" type="card" class="tabs">
      <el-tab-pane v-for="item of costTypes" :key="item" :label="item" :name="item">
        <div class="tabs-item">
          <!-- 会员等级卡片 -->
          <Card :card-list="cardList" @play-show="onPlayShow" />
          <!-- 会员权益列表 -->
          <Table :table-data="tableData" />
          <div class="tabs-item-btn">
            <el-button type="primary" @click="onPlayShow(cardItem, 'topUp')">
              <img src="@/assets/images/diamond.png" alt="">
              充值
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      v-model="payInfo.show" width="700" :title="payInfo.title" destroy-on-close
      @close="close"
    >
      <PayDialog ref="payDialog" :pay-info="payInfo" @confirm="onPay" />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.page {
  padding: 20px;
  .tabs {
    :deep(.el-tabs__header) {
      // background: linear-gradient(0deg, #f3f5f8 0%, #fffeff 100%);
      height: 60px;
      margin: 0;
      border: none;
      @apply border-0 h-14 m-0;
      .el-tabs__nav {
        float: none;
        background: #f0f1f2;
        width: 310px;
        justify-content: center;
        border: none;
        margin: 0 auto;
        border-radius: 20px;
        padding: 6px;
        // @apply justify-center border-none mx-auto rounded-3xl p-1;
        .el-tabs__item {
          color: #00000066;
          height: auto;
          border: none;
          padding: 3px 20px;
        }
        .is-active {
          border-radius: 20px;
          color: #fff;
          background-color: @color-primary;
        }
      }
    }
    .tabs-item {
      &-btn {
        text-align: right;
        margin-top: 24px;
        img {
          width: 18px;
          height: 18px;
          margin-right: 4px;
        }
      }
    }
  }
  :deep(.el-dialog__header) {
    margin: 0;
    background-color: @color-primary;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn i {
      color: #fff;
    }
  }
  :deep(.el-dialog__body) {
    padding: 34px;
  }
}
</style>
