
<template>
  <div class="index">
    <div class="header">
      <div class="action-left"> </div>
      <div class="action-right">
        <el-button type="primary" @click="jumpHome">主页</el-button>
        <el-button type="success" @click="jumpGithub">项目地址</el-button>
      </div>
    </div>
    <div class="content">
      <el-row class="list" :gutter="20">
        <el-col v-for="(item, key) in linkList" :key="key" class="list-item" :span="6">
          <router-link :to="item.path" class="card">
            <!-- githubpage不支持动态导入路径 -->
            <!-- <div class="cover" :style="{ background: `url(${getAssetsFile(item.coverUrl)})`, backgroundSize: '100% 100%' }"></div> -->
            <div class="cover"></div>
            <div class="title">{{ item.title }}</div>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <div class="footer"></div>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, toRefs } from 'vue';

const state = reactive({
  linkList: [
    {
      title: '广度优先搜索(BFS)',
      path: '/bfs',
      coverUrl: '../assets/images/1.png'
    },
    {
      title: '深度优先搜索(DFS)',
      path: '/dfs',
      coverUrl: '../assets/images/2.png'
    },
    {
      title: 'A*寻路算法',
      path: '/astart',
      coverUrl: '../assets/images/3.png'
    },
    {
      title: '迷宫生成',
      path: '/maze',
      coverUrl: '../assets/images/3.png'
    }
  ]
});
const { linkList } = toRefs(state);

const jumpHome = () => {
  window.location.href = 'https://www.jjianli.com';
};

const jumpGithub = () => {
  window.location.href = 'https://github.com/lpya/vue3-ts-vite-algorithm';
};

const getAssetsFile = (url: string) => {
  const imgUrl = new URL(url, import.meta.url).href;
  return imgUrl;
};
</script>
  
<style lang="scss" scoped>
.index {
  height: 100vh;
  background: #202835;
  color: #919bb0;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
    background: #323e52;
    border-bottom: 1px solid #202835;
  }

  .content {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 70px);

    .list {
      padding: 20px;
      margin-top: 20px;

      .card {
        display: block;
        border-radius: 5px;
        padding: 15px;
        background: #323e52;
        margin-bottom: 20px;
        text-decoration: none;
        color: #919bb0;
        transition: all 0.3s;

        &:hover {
          transform: scale(1.01);

          .title {
            color: #c5cfe3;
          }
        }

        .cover {
          padding-bottom: 60%;
          border-radius: 5px;

        }

        .title {
          margin-top: 10px;
          text-align: center;
          font-size: 18px;
        }
      }

    }

  }

}

@for $i from 1 through 4 {
  .list-item:nth-child(#{$i}) {
    .cover {
      background: url("@/assets/images/#{$i}.png");
      background-size: 100% 100%;
    }
  }
}
</style>
