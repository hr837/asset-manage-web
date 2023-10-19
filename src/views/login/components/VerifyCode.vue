<script lang="ts" setup>
import { ref } from 'vue'
import DragVerify from './DragVerify.vue'

const showSlider = ref(true)
const success = ref(false)
</script>

<template>
  <div class="component verify-code">
    <el-button @click="showSlider = true">
      重置
    </el-button>
    <DragVerify v-if="showSlider" @success="showSlider = false" />
  </div>
</template>

<style lang="less" scoped>
.el-slider.success {
  background-color: green;
}

.verify-code {
  user-select: none;
}
</style>
