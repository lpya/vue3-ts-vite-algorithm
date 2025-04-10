<template>
  <div class="maze">
    <div class="header">
      <el-button @click="back">返回</el-button> 
    </div>
    <div class="container">33</div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
function back(){
  router.push('/');
}
</script>

<style lang="scss" scoped>
.maze {
  padding: 20px;

  .header {
    height: 50px;
  }

  .container{
    background-color: #eee;
    border: 1px solid #666;
    height: calc(100vh - 92px);
  }
}
</style>