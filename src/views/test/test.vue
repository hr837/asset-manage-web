<script lang="ts" setup>

</script>

<template>
  <div class="page ">
    <video
      id="my-player"
      class="video-js video-player" src="/tmp/test-video.mp4" controls="true" controlslist="nodownload nofullscreen noremoteplayback" disablepictureinpicture
    />
    <!-- <video
      id="my-player"
      class="video-js"
      controls
      preload="auto"
      poster="//vjs.zencdn.net/v/oceans.png"
      data-setup="{}"
    >
      <source src="/tmp/test-video.mp4" type="video/mp4">
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">
          supports HTML5 video
        </a>
      </p>
    </video> -->
  </div>
</template>

<style lang="less" scoped>
.video-js{
  height: 100px;
  &::-webkit-media-controls-fullscreen-button{
    display: none;
  }
  &::-webkit-media-controls{
    display: flex;
    background-color: red;
  }
  &::-webkit-media-controls-panel{
    input{
      display: none;
    }
  }

  &::-webkit-media-controls-play-button{
    // display: none;
  }
}
.video-player{
  height: 100px;
  width: 100%;
  &::webkit-media-controls-enclosure{
    display: block;
  }
}
</style>
