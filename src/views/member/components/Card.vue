<script lang="ts" setup>
defineProps({
  cardList: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['playShow'])

const playShow = (cardItem, type) => {
  emits('playShow', cardItem, type)
}
</script>

<template>
  <div class="card">
    <div v-for="(cardItem, cardIndex) in cardList" :key="cardIndex" class="card-item">
      <div v-if="cardItem.isDiscount" class="discount-box">
        <img src="@/assets/images/discount-bg.png" alt="">
        <span>{{ cardItem.discount }}%优惠</span>
      </div>
      <div class="card-item-title">
        <img v-if="cardItem.icon" :src="cardItem.icon" alt="">
        {{ cardItem.label }}
      </div>
      <div class="card-item-price">
        <div>
          <span class="card-item-price-mark">￥<span class="price">{{ cardItem.price }}</span></span>
          <span>/</span>{{ cardItem.type }}
        </div>
        <div v-if="cardItem.costPrice" class="card-item-price-cost">
          ￥{{ cardItem.costPrice }}<span>/</span>{{ cardItem.type }}
        </div>
      </div>
      <div class="card-item-btn">
        <el-button
          v-if="cardItem.btnText"
          type="primary"
          @click="playShow(cardItem, 'pay')"
        >
          {{ cardItem.btnText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 20px;
  padding: 16px 20px 25px;
  &-item {
    background: #fff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04),
      0px 38px 76px 0px rgba(150, 119, 247, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    border-radius: 4px;
    position: relative;
    .discount-box {
      position: absolute;
      right: -3px;
      top: -6px;
      width: 50%;
      img {
        min-width: 100%;
        height: 34px;
      }
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-45%, -55%);
        color: #fff;
        white-space: nowrap;
      }
    }
    &-title {
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
    &-price {
      font-size: 16px;
      margin: 25px 0;
      &-mark {
        color: #ff4d4f;
        .price {
          font-size: 32px;
          font-weight: bold;
        }
      }
      &-cost {
        color: #909399;
        text-align: center;
        text-decoration: line-through;
      }
    }
    &-btn {
      width: 100%;
      text-align: center;
      .el-button {
        width: 70%;
      }
    }
  }
}
</style>
