<template>
  <div class="astart">
    <div class="header">
      <el-button @click="back">返回</el-button>
      <el-button type="primary" @click="createDarriers">生成障碍物</el-button>
      <el-button type="warning" @click="search">开始</el-button>
    </div>
    <div id="canvas">
      <div class="container">
        <div v-for="(item, key) in nodeList" :key="`item${key}`" class="item">
          <div v-for="(itemTwo, keyTwo) in item" :key="`box${keyTwo}`" class="box" :class="getBoxStyle(itemTwo.type)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';

interface Node {
  x: number;
  y: number;
  type: NodeType;
  g: number;
  h: number;
  f: number;
  parent: Node | null; //状态：0=正常|1=障碍物|2=起点|3=终点|4=路径|5=已访问
}
type NodeType = 0 | 1 | 2 | 3 | 4 | 5

interface Path {
  x: number
  y: number
}
const state = reactive({
  nodeList: [] as Node[][],
  startNode: {} as Node,
  endNode: {} as Node,
  pathList: [] as Path[]
});
let timer: NodeJS.Timer;

const { nodeList } = toRefs(state);
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
  state.nodeList = [];
  for (let x = 0; x < 80; x++) {
    state.nodeList[x] = [];
    for (let y = 0; y < 50; y++) {
      state.nodeList[x][y] = {
        x: x,
        y: y,
        type: 0,
        g: 1,
        h: 0,
        f: 0,
        parent: null
      };
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
  const nodeList: Node[] = [];
  do {
    let x = Math.round(Math.random() * 79);
    let y = Math.round(Math.random() * 49);
    let newNode: Node = {
      x: x,
      y: y,
      type: 0,
      g: 1,
      h: 0,
      f: 0,
      parent: null
    };
    let overlapping = false;
    for (const node of nodeList) {
      if (newNode.x === node.x && newNode.y === node.y) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      newNode.type = 1;
      state.nodeList[x][y] = newNode;
      i++;
    }
  } while (i < 1500);
  createStartEnd();
};
/**
 * @desc: 生成起点和终点
 * @return {*}
 */
const createStartEnd = () => {
  for (let i = 0; i < 2; i++) {
    let x = Math.round(Math.random() * 79);
    let y = Math.round(Math.random() * 49);
    let type: NodeType = 2;
    let currentNode = state.nodeList[x][y];
    if (i === 0) {
      type = 2;
      state.startNode = currentNode;
    } else {
      type = 3;
      state.endNode = currentNode;
    }
    state.nodeList[x][y].type = type;
  }
};
/**
 * @desc: 搜索
 * @return {*}
 */
const search = () => {
  astart(state.startNode, state.endNode, state.nodeList);
};

/**
 * @desc: 开始
 * @param {*} startNode
 * @param {*} endNode
 * @param {*} grid
 * @return {*}
 */
const astart = (startNode: Node, endNode: Node, grid: Node[][]) => {
  const openList: Node[] = [];
  const closeList: Node[] = [];
  openList.push(startNode);
  const start = () => {
    let currentNode = openList[0];
    let currentIndex = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < currentNode.f) {
        currentNode = openList[i];
        currentIndex = i;
      }
    }
    openList.splice(currentIndex, 1);
    closeList.push(currentNode);
    if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
      clearInterval(timer);
      setPath(getPath(currentNode));
      return;
    }
    const neighbors = getNeighbors(currentNode, grid);
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (closeList.includes(neighbor)) {
        continue;
      }
      const g = currentNode.g + getDistance(currentNode, neighbor);
      if (!openList.includes(neighbor) || g < neighbor.g) {
        // neighbor.g = 1
        neighbor.h = getDistance(currentNode, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = currentNode;
        if (!openList.includes(neighbor)) {
          openList.push(neighbor);
        }
      }
    }
  };
  clearInterval(timer);
  timer = setInterval(() => {
    start();
  });

  // while (openList.length > 0) {
  //   let currentNode = openList[0]
  //   let currentIndex = 0
  //   for (let i = 1; i < openList.length; i++) {
  //     if (openList[i].f < currentNode.f) {
  //       currentNode = openList[i]
  //       currentIndex = i
  //     }
  //   }
  //   openList.splice(currentIndex, 1)
  //   closeList.push(currentNode)
  //   if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
  //     setPath(getPath(currentNode))
  //     // return getPath(currentNode)
  //     return []
  //   }
  //   const neighbors = getNeighbors(currentNode, grid);
  //   for (let i = 0; i < neighbors.length; i++) {
  //     const neighbor = neighbors[i]
  //     if (closeList.includes(neighbor)) {
  //       continue
  //     }
  //     const g = currentNode.g + getDistance(currentNode, neighbor)
  //     if (!openList.includes(neighbor) || g < neighbor.g) {
  //       neighbor.g = g
  //       neighbor.h = getDistance(currentNode, endNode)
  //       neighbor.f = neighbor.g + neighbor.h
  //       neighbor.parent = currentNode
  //       if (!openList.includes(neighbor)) {
  //         openList.push(neighbor);
  //       }
  //     }
  //   }
  // }

  function getPath(endNode: Node) {
    const path = [];
    let currentNode = endNode;
    while (currentNode.parent !== null) {
      path.unshift({ x: currentNode.x, y: currentNode.y });
      if (currentNode.parent) {
        currentNode = currentNode.parent;
      } else {
        currentNode.parent = null;
      }
    }
    return path;
  }

  function getNeighbors(node: Node, grid: Node[][]) {
    const neighbors = [];
    const { x, y } = node;
    // const directions = [[-1, -1], [-1, 1], [1, 1], [1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let i = 0; i < directions.length; i++) {
      const [dx, dy] = directions[i];
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
        const neighbor = grid[newX][newY];
        if (neighbor.type === 0 || neighbor.type === 3) {
          if (dx === -1 && dy === -1 || dx === -1 && dy === 1 || dx === 1 && dy === -1 || dx === 1 && dy === 1) {
            neighbor.g = 2;
          }
          neighbors.push(neighbor);
        }
        if (neighbor.type !== 1 && neighbor.type !== 2 && neighbor.type !== 3) {
          state.nodeList[newX][newY].type = 5;
        }
      }
    }
    return neighbors;
  }

  function getDistance(nodeA: Node, nodeB: Node): number {
    const dx = Math.abs(nodeA.x - nodeB.x);
    const dy = Math.abs(nodeA.y - nodeB.y);
    // return dx + dy;
    return Math.sqrt(dx * dx + dy * dy);
  }
};
/**
 * @desc: 设置路径
 * @param {*} pathList
 * @return {*}
 */
const setPath = (pathList: Path[]) => {
  pathList.forEach((item) => {
    if (item.x !== state.endNode.x || item.y !== state.endNode.y) {
      state.nodeList[item.x][item.y].type = 4;
    }
  });
};
/**
 * @desc: 获取当前障碍物样式
 * @param {*} val 状态：0=正常|1=障碍物|2=起点|3=终点|4=路径|5=已访问
 * @return {string} class 样式 
 */
const getBoxStyle = (type: number) => {
  if (type === 0) {
    return 'normal';
  } else if (type === 1) {
    return 'darriers';
  } else if (type === 2) {
    return 'start';
  } else if (type === 3) {
    return 'end';
  } else if (type === 4) {
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
.astart {
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
      width: 800px;
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