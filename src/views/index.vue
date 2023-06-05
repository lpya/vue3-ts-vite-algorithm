
<template>
  <div class="index">
    <ul>
      <li v-for="(item, key) in linkList" :key="key">
        <router-link :to="item.path">
          {{ key + 1 }}、{{ item.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, toRefs } from 'vue';

const state = reactive({
  linkList: [
    {
      title: '广度优先搜索(BFS)',
      path: '/bfs',
    },
    {
      title: '深度优先搜索(DFS)',
      path: '/dfs',
    },
    {
      title: 'A*寻路算法',
      path: '/astart',
    },
    // {
    //   title: '回溯算法画迷宫',
    //   path: '/backtrack',
    // },
  ]
})
const { linkList } = toRefs(state)
</script>
  
<style lang="scss">
.index {
  ul {
    li {
      padding: 10px 20px;

      a {
        text-decoration: none;
      }
    }
  }
}
</style>
  