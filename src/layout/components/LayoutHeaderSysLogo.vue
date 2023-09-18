<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'
interface PropType {
  /** 是否折叠菜单 */
  collapse: boolean
}
withDefaults(defineProps<PropType>(), {
  collapse: false,
})
</script>

<template>
  <div class="layout-header-logo" :class="{ 'layout-header-logo--collapse': collapse }">
    <icon-park-outline-brain style="transform: rotateY(180deg);scale: 1.5;" />
    <span v-show="!collapse">特赛发</span>
  </div>
</template>

<style lang="less" scoped>
.layout-header-logo {
  @apply w-full flex items-center overflow-hidden whitespace-nowrap bg-white;
  height: 50px;
  padding-left: 20px;
  width: 258px;

  svg {
    color: var(--el-color-primary-light-3);
    margin-right: 9px;
  }

  span {
    font-size: 16px;
    @apply font-bold;
  }

}
</style>
