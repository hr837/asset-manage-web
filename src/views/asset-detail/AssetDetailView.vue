<script lang="ts" setup>
import { ref } from 'vue'
import AssetProgress from './components/AssetProgress.vue'
const src = ref<string>('blob:http://localhost:8080/146c7e38-edab-4fdc-9502-f177dd6906d1')
</script>

<template>
  <div class="page asset-detail">
    <div class="page-content">
      <div class="content-top">
        <div class="asset-tag w-24">
          tag
        </div>
        <div class="asset-progress ">
          <AssetProgress />
        </div>
        <div class="page-action ">
          <el-button size="small" type="primary">
            返回
          </el-button>
        </div>
      </div>
      <div class="content-main">
        <ul class="video-info ">
          <li>视频时长:14s</li>
          <li>视频大小:32MB</li>
        </ul>
        <div class="video-container">
          <video
            class="video-player" :src="src" controls controlslist="nodownload noremoteplayback"
            disablePictureInPicture
          />
        </div>
        <div class="video-aciton">
          <el-button>下载MP4文件</el-button>
          <el-button>下载FBX文件</el-button>
          <el-button>转换文件</el-button>
          <el-button>删除文件</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-content {
  width: 1100px;
  @apply mx-auto h-full;
}

.content-top {
  @apply flex pt-8;

  .asset-progress {
    @apply flex-1;
  }
  .page-action{
    @apply w-24 text-right;
  }
}

.content-main {
  @apply flex mt-20;

  .video-info {
    @apply w-32 text-sm text-gray-600;
  }

  .video-container {
    @apply flex-1 text-center;

    .video-player {
      @apply w-full max-h-128;
    }
  }

  .video-aciton {
    @apply pl-4 text-center;

    .el-button {
      @apply block mx-0 w-28 my-2;
    }
  }
}
</style>
