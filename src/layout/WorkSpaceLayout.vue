<script lang="ts">
import { defineComponent } from 'vue'
import LayoutWorkMenu from './components/LayoutWorkMenu.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import MemberCard from './components/MemberCard.vue'
export default defineComponent({
  name: 'WorkSpaceLayout',
  components: {
    LayoutWorkMenu,
    LayoutHeader,
    MemberCard,
  },
})
</script>

<template>
  <el-container class="layout workspace-layout">
    <el-header>
      <LayoutHeader />
    </el-header>
    <el-container class="layout-work-container">
      <el-aside class="flex flex-col overflow-hidden" width="240px">
        <LayoutWorkMenu />
        <MemberCard />
      </el-aside>
      <el-main class="layout-work-container-main">
        <router-view v-slot="{ Component, route }" class="layout-work-container-main-content">
          <KeepAlive include="VideoUploadView">
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.el-header {
  --el-header-padding: 0 32px;
  --el-header-height: 70px;
  border-bottom: 1px solid #E7E7E7;
}

.layout-work-container {
  position: relative;
  width: 100%;
  overflow-x: auto;

  &-main {
    background-color: #EFF3F6;
    // 适配最低分辨率 1366
    min-width: 1100px;
    padding: 16px;

    &-content {
      @apply bg-white rounded;
    }
  }
}
</style>
