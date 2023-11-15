<script lang="ts" setup>
</script>

<template>
  <el-container class="page digital-zone-view">
    <el-header class="page-header">
      <div class="text-block font-bold">
        创作空间
      </div>
      <el-dropdown popper-class="digital-zone-popper">
        <el-button type="primary">
          去创作 <icon-park-outline-down />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>照片会说话</el-dropdown-item>
            <el-dropdown-item>数字人制作</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-main>
      <div class="draft-container">
        <div class="container-header">
          <div class="container-title">
            草稿箱
          </div>
        </div>
      </div>
      <div class="production-container">
        <div class="container-header">
          <div class="container-title">
            草稿箱
          </div>
          <div class="container-action">
            <router-link to="/my-production">
              查看更多 <icon-park-outline-right />
            </router-link>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
.digital-zone-view {}

.page-header {
  --el-header-height: 50px;
  @apply flex justify-between items-center border-b;
}

.container-header {
  @apply h-14 flex justify-between items-center;

  .container-title {
    @apply text-gray-700 font-semibold;
  }
}
</style>
