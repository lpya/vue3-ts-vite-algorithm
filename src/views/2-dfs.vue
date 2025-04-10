<template>
  <div class="bfs">
    <div class="header">
      <el-button @click="back">返回</el-button>
      <el-button type="primary" @click="createDarriers">生成障碍物</el-button>
      <el-button type="warning" @click="search">开始</el-button>
    </div>
    <div id="canvas">
      <div class="container">
        <div v-for="(item, key) in boxList" :key="`item${key}`" class="item">
          <div v-for="(itemTwo, keyTwo) in item" :key="`box${keyTwo}`" class="box" :class="getBoxStyle(itemTwo)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
interface IRect {
  x: number
  y: number
}
const state = reactive({
  boxList: [] as number[][],
  start: [] as number[],
  end: [] as number[],
  startX: 0,
  startY: 0,
  directions: [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1] // 左
  ],
  path: [] as number[][]
});
let timer: NodeJS.Timer;
let visited = new Set();

const { boxList } = toRefs(state);
onMounted(() => {
  init();
});

/**
 * @desc: 初始化
 * @return {*}
 */
const init = () => {
  createGrid();
};
/**
 * @desc: 生成网格图形
 * @return {*}
 */
const createGrid = () => {
  state.boxList = [];
  for (let x = 0; x < 50; x++) {
    state.boxList[x] = [];
    for (let y = 0; y < 50; y++) {
      state.boxList[x][y] = 0;
    }
  }
};
/**
 * @desc: 生成障碍物
 * @return {*}
 */
const createDarriers = () => {
  clearInterval(timer);
  createGrid();
  let i = 0;
  const rectList: IRect[] = [];
  do {
    let x = Math.round(Math.random() * 49);
    let y = Math.round(Math.random() * 49);
    let newRect: IRect = {
      x: x,
      y: y
    };
    let overlapping = false;
    for (const rect of rectList) {
      if (newRect.x === rect.x && newRect.y === rect.y) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      state.boxList[x][y] = 1;
      i++;
    }
  } while (i < 500);
  createStartEnd();
};
/**
 * @desc: 生成起点和终点
 * @return {*}
 */
const createStartEnd = () => {
  for (let i = 0; i < 2; i++) {
    let x = Math.round(Math.random() * 49);
    let y = Math.round(Math.random() * 49);
    let val = 2;
    if (i === 0) {
      val = 2;
      state.start = [x, y];
    } else {
      val = 3;
      state.end = [x, y];
    }
    state.boxList[x][y] = val;
  }
};
/**
 * @desc: 搜索
 * @return {*}
 */
const search = () => {
  state.path = [];
  visited.clear();
  state.startX = state.start[0];
  state.startY = state.start[1];
  function dfs(x: number, y: number) {
    if (!isValid(x, y)) {
      return false;
    }
    if (state.boxList[x][y] === 1) {
      return false;
    }
    if (state.boxList[x][y] === 5) {
      return false;
    }
    if (state.boxList[x][y] === 3) {
      state.path.push([x, y]);
      return true;
    }
    state.path.push([x, y]);
    if (state.boxList[x][y] !== 2) {
      state.boxList[x][y] = 5;
    }
    if (dfs(x, y + 1) || dfs(x, y - 1) || dfs(x + 1, y) || dfs(x - 1, y)) {
      return true;
    }
  }
  dfs(state.startX, state.startY);
  setPath(state.path);
};
/**
 * @desc: 设置路径
 * @param {*} pathList
 * @return {*}
 */
const setPath = (pathList: number[][]) => {
  let currentKey = 0;
  const setPathTimer = (i: number) => {
    const path = pathList[i];
    let x = path[0];
    let y = path[1];
    if (x == state.start[0] && y === state.start[1]) {
      state.boxList[x][y] = 2;
    } else if (x == state.end[0] && y === state.end[1]) {
      state.boxList[x][y] = 3;
    } else {
      state.boxList[x][y] = 4;
    }

  };
  clearInterval(timer);
  timer = setInterval(() => {
    if (currentKey < pathList.length) {
      setPathTimer(currentKey);
      currentKey++;
    } else {
      clearInterval(timer);
    }
  }, 20);
};
/**
 * @desc: 判断当前坐标是否超出范围
 * @param {*} x
 * @param {*} y
 * @return {*}
 */
const isValid = (x: number, y: number) => {
  if (x < 0 || x >= state.boxList.length) {
    return false;
  }
  if (y < 0 || y >= state.boxList[0].length) {
    return false;
  }
  return true;
};
/**
 * @desc: 获取当前障碍物样式
 * @param {*} val 状态：0=正常|1=障碍物|2=起点|3=终点|4=路径|5=已访问
 * @return {string} class 样式 
 */
const getBoxStyle = (val: number) => {
  if (val === 0) {
    return 'normal';
  } else if (val === 1) {
    return 'darriers';
  } else if (val === 2) {
    return 'start';
  } else if (val === 3) {
    return 'end';
  } else if (val === 4) {
    return 'path';
  } 
  return 'visited';
  
};
const router = useRouter();
/**
 * @desc: 返回
 * @return {*}
 */
const back = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>
.bfs {
  padding: 20px;

  .header {
    height: 50px;
  }

  #canvas {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    border: 1px solid #666;
    height: calc(100vh - 92px);

    .container {
      display: flex;
      width: 500px;
      height: 500px;
      border: 1px solid #666;

      .item {
        box-sizing: border-box;

        .box {
          width: 10px;
          height: 10px;
          box-sizing: border-box;
          background-color: #999;
          // border: 1px solid #999;

          &.normal {
            background-color: #999;
          }

          &.darriers {
            background-color: #333;
            // border: 1px solid #333;
          }

          &.start {
            background-color: #12ff36;
          }

          &.end {
            background-color: red;
          }

          &.path {
            background-color: #4afffc;
          }

          &.visited {
            background-color: #f6ff00;
          }
        }
      }
    }
  }
}
</style>