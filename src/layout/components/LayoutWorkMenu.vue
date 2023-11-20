<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'
import { useRoute, useRouter } from 'vue-router'

withDefaults(defineProps<PropType>(), {
  collapse: false,
})
const router = useRouter()
const route = useRoute()

interface PropType {
  /** 是否折叠菜单 */
  collapse: boolean
}
</script>

<template>
  <el-menu
    :default-active="route.meta.menuPath || route.path" class="component layout-work-menu" router
    :collapse="collapse"
  >
    <el-menu-item index="/index">
      <icon-park-outline-cylinder />
      <template #title>
        <span>资产管理</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/upload">
      <icon-park-outline-upload />
      <template #title>
        <span>上传视频</span>
      </template>
    </el-menu-item>
  </el-menu>

  <div v-if="!collapse" class="member">
    <div class="member-title">
      免费会员
    </div>
    <div class="member-grade">
      <div class="member-grade-left">
        <img src="@/assets/images/diamond.png" alt="">
        355
      </div>
      <el-button type="primary" class="member-grade-right" plain round @click="() => router.push('/member')">
        充值
      </el-button>
    </div>
    <div class="member-plan">
      <el-button type="primary" @click="() => router.push('/member')">
        升级计划
      </el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.layout-work-menu {
  @apply h-full overflow-x-hidden overflow-y-auto border-0;

  &:not(.el-menu--collapse) {
    width: 100%;
  }

  --el-menu-item-height: 48px;

  .el-menu-item {
    :deep(.el-menu-tooltip__trigger) {
      justify-content: center;
    }

    span {
      padding-left: 5px;
    }

    &.is-active {
      @apply text-white rounded-lg;
      background-color: @color-primary;
    }
  }
}
.member{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 16px;
  width: 192px;
  height: 192px;
  background: #fff;
  box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.05), 0px 38px 76px 0px rgba(150,119,247,0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  &-title{
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 19px;
  }
  &-grade{
    width: 100%;
    margin: 24px 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left{
      display:flex;
      align-items: center;
      font-size: 24px;
      font-weight: 600;
      color: #333;
      img{
        width:16px;
        height:16px;
        margin-right: 8px;
      }
    }
    &-right{
      width:48px;
      height:22px;
      font-size:12px;
    }
  }
  &-plan{
    width:100%;text-align: center;
  }
}
</style>
