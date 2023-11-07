<script lang="ts">
import { defineComponent } from 'vue'
import LayoutHeaderSysLogo from './components/LayoutHeaderSysLogo.vue'
import LayoutWorkAction from './components/LayoutWorkAction.vue'
import LayoutWorkTitle from './components/LayoutWorkTitle.vue'
import LayoutWorkMenu from './components/LayoutWorkMenu.vue'

export default defineComponent({
  name: 'WorkSpaceLayout',
  components: {
    LayoutHeaderSysLogo,
    LayoutWorkAction,
    LayoutWorkTitle,
    LayoutWorkMenu,
  },

})
</script>

<template>
  <el-container class="layout workspace-layout">
    <el-aside class="overflow-hidden" width="258px">
      <LayoutHeaderSysLogo />
      <LayoutWorkMenu />
    </el-aside>
    <el-container class="layout-work-container" direction="vertical">
      <LayoutWorkTitle />
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
.workspace-layout {
  position: relative;
}

.layout-work-container {
  position: relative;
  width: 100%;
  overflow-x: auto;

  &-main {
    background-color: #EFF3F6;
    // 适配最低分辨率 1366
    min-width: 1100px;
    padding: 15px;

    &-content {
      background-color: #fff;
      border-radius: 4px;
    }
  }
}
</style>
