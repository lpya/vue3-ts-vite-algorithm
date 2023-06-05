<template>
  <div class="backtrack">
    <canvas id="maze-backtrack" style="width: 500px;height: 500px;background: #eee;"></canvas>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs } from "vue";
import { Maze } from "@/utils/maze"
const state = reactive({})

onMounted(() => {
  init()
})

const init = () => {
  // 创建迷宫对象并生成迷宫 
  const maze = new Maze(21, 21);
  maze.generateMaze();
  console.log(maze.grid)
  // 创建画布和绘制迷宫
  const canvas = document.getElementById('maze-backtrack');
  console.log(canvas)
  const ctx = canvas.getContext('2d');
  const cellSize = 20;

  canvas.width = maze.width * cellSize;
  canvas.height = maze.height * cellSize;

  for (let row = 0; row < maze.height; row++) {
    for (let col = 0; col < maze.width; col++) {
      if (maze.grid[row][col]) {
        ctx.fillStyle = '#000000'; // 墙的颜色
      } else {
        ctx.fillStyle = '#FFFFFF'; // 路径的颜色
      }
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}
</script>

<style lang="scss" scoped></style>