<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AssetProgress from './components/AssetProgress.vue'
import AssetDetailTag from './components/AssetDetailTag.vue'
const route = useRoute()

const src = ref('')
let id = ''
onMounted(() => {
  id = route.query.id as string
})
</script>

<template>
  <div class="page asset-detail">
    <div class="page-action ">
      <AssetDetailTag :status="5" />
      <el-button type="primary">
        返回
      </el-button>
    </div>
    <div class="detial-content">
      <AssetProgress />
      <div class="video-detail">
        <div class="video-name">
          五折
        </div>
        <div class="file-info">
          <div class="video-druation">
            视频时长：14s
          </div>
          <div class="video-size">
            视频大小：2.09MB
          </div>
        </div>
      </div>
      <div class="video-aciton">
        <el-button>下载MP4文件</el-button>
        <el-button>下载FBX文件</el-button>
        <el-button>转换文件</el-button>
        <el-button>删除文件</el-button>
      </div>

      <video
        class="video-player" :src="src" controls controlslist="nodownload noremoteplayback"
        disablePictureInPicture
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.asset-detail {
  @apply p-0;
}

.page-action {
  @apply py-2 pr-4 border-b flex justify-between;
}
</style>
