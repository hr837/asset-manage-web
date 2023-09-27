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
    <icon-park-outline-brain class="sys-log" />
    <span v-show="!collapse">特赛发</span>
  </div>
</template>

<style lang="less" scoped>
.layout-header-logo {
  @apply w-full flex items-center overflow-hidden whitespace-nowrap bg-white;
  height: 70px;
  width: 258px;

  .sys-log{
    transform: rotateY(180deg);
    color: var(--el-color-primary-light-3);
    width: 64px;
    @apply block text-4xl;
  }

  span {
    @apply text-2xl font-bold px-2;
  }

}
</style>
