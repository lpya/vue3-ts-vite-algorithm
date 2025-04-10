<template>
  <div class="maze">
    <div class="header">
      <el-button @click="back">返回</el-button> 
      <el-button type="primary" @click="generateMaze">生成新迷宫</el-button> 
    </div>
    <div class="container"> 
      <div class="content" :style="gridStyle">
        <div 
          v-for="(row, y) in maze" 
          :key="y"
          class="row"
        >
          <div
            v-for="(cell, x) in row"
            :key="x"
            class="cell"
            :class="{
              wall: cell === 1,
              start: x === 1 && y === 0,
              end: x === size - 2 && y === size - 1
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const state = reactive({
  size: 41, // 必须为奇数
  maze: [] as number[][]
});

const { size, maze } = toRefs(state);

onMounted(() => { 
  generateMaze();
});
// 生成迷宫逻辑
function generateMaze() {
  const size = parseInt(state.size.toString());
  state.size = size % 2 === 0 ? size + 1 : size; // 确保奇数
                    
  // 初始化迷宫
  state.maze = Array.from({ length: state.size }, () => 
    Array(state.size).fill(1)
  );
  // 递归回溯算法
  function carve(x:number, y:number) {
    const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]].sort(() => Math.random() - 0.5);
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < state.size && ny >= 0 && ny < state.size && state.maze[ny][nx] === 1) {
        state.maze[y + dy / 2][x + dx / 2] = 0;
        state.maze[ny][nx] = 0;
        carve(nx, ny);
      }
    }
  }

  // 设置起点并开始生成
  state.maze[1][1] = 0;
  carve(1, 1);

  // 设置出入口
  state.maze[0][1] = 0;
  state.maze[state.size - 1][state.size - 2] = 0;
}

// 动态网格样式
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${state.size}, 15px)`
}));

function back(){
  router.push('/');
}
</script>

<style lang="scss" scoped>
@import "@/styles/maze.scss";
</style>