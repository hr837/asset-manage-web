<script lang="ts" setup>
import DigitalProductionList from './components/DigitalProductionList.vue'
</script>

<template>
  <el-container class="page digital-edit">
    <el-header class="flex items-center border-b">
      <RouterLink to="/zone">
        <icon-park-outline-arrow-left />
      </RouterLink>
      <span class="ml-4">我的作品</span>
    </el-header>
    <DigitalProductionList :data="[]" />
  </el-container>
</template>

<style lang="less" scoped></style>
