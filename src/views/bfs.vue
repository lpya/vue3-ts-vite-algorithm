<template>
  <div class="bfs">
    <div class="header">
      <el-button @click="back">返回</el-button>
      <el-button type="primary" @click="createWalls">生成障碍物</el-button>
      <el-button type="success" @click="startFindPathByAnimation">开始【带动画】</el-button>
      <el-button type="warning" @click="startFindPath">开始【不带动画】</el-button>
      <el-button type="danger" @click="stopFindPath">停止</el-button>
    </div>
    <div id="canvas"></div>
  </div>
</template>

<script lang="ts" setup>
import Konva from 'konva';
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
interface IRectangle {
  x: number
  y: number
  parent?: string
}
interface IPathMap {
  [k: string]: IRectangle
}
interface IGridMap {
  [k: string]: Konva.Node
}
// 画布
let stage: Konva.Stage | null = null
// 图层
const layer: Konva.Layer = new Konva.Layer()
// 主组
const mainGroup: Konva.Group = new Konva.Group()
// 矩形
const rect: Konva.Rect = new Konva.Rect()
// 倍数
const multiples = 10
// 定时器
let timer: NodeJS.Timer
// 图形 map
let gridMap: IGridMap = {}
// 需要查找的点队列
let openList: IRectangle[] = []
// 开始的点
let startPoint: IRectangle = {
  x: 0,
  y: 0
}
// 可以走的路径
let mapPath: IPathMap = {}
// 路径
let pathList: IRectangle[] = []
// 是否成功
let isSuccess = false

onMounted(() => {
  init()
})

// 初始化
const init = () => {
  const canvas = document.getElementById("canvas")
  if (!canvas) {
    return
  }
  const { clientWidth, clientHeight } = canvas
  stage = new Konva.Stage({
    container: 'canvas',
    width: clientWidth,
    height: clientHeight,
  })
  stage.add(layer)
  initBaseMap(clientWidth, clientHeight)
  createGrid()
  // 自适应

  window.onresize = () => {
    onresize()
  }
}
// 自适应
const onresize = () => {
  let canvas = document.getElementById('canvas');
  if (!canvas) {
    return
  }
  if (!stage) {
    return
  }
  const { clientWidth, clientHeight } = canvas
  stage.setAttrs({
    width: clientWidth,
    height: clientHeight,
  })
  const baseMap = stage.findOne("#baseMap")
  if (baseMap) {
    const baseMapAttrs = baseMap.getAttrs()
    const x = clientWidth / 2 - baseMapAttrs.width / 2
    const y = clientHeight / 2 - baseMapAttrs.height / 2
    mainGroup.setAttrs({ x, y })
  }
}
// 初始化底图区域
const initBaseMap = (clientWidth: number, clientHeight: number) => {
  const width = 600
  const height = 400
  const x = clientWidth / 2 - width / 2
  const y = clientHeight / 2 - height / 2
  const baseMap = rect.clone({
    id: "baseMap",
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: "#fff",
    stroke: 'black',
    strokeWidth: 1
  })
  mainGroup.setAttrs({ x, y })
  mainGroup.add(baseMap)
  layer.add(mainGroup)
}
// 初始化网格图形
const createGrid = () => {
  if (!stage) {
    return
  }
  const baseMap = stage.findOne("#baseMap")
  if (!baseMap) {
    return
  }
  const baseMapAttrs = baseMap.getAttrs()

  const xLen = baseMapAttrs.width / multiples
  const yLen = baseMapAttrs.height / multiples
  for (let y = 0; y < yLen; y++) {
    for (let x = 0; x < xLen; x++) {
      const grid = rect.clone({
        id: `${x}-${y}`,
        x: x * 10,
        y: y * 10,
        name: "grid",
        width: 9,
        height: 9,
        type: 1,
        fill: "#999",
      })
      mainGroup.add(grid)
    }
  }
}
// 设置禁区
const createWalls = () => {
  if (!stage) {
    return
  }
  const baseMap = stage.findOne("#baseMap")
  if (!baseMap) {
    return
  }
  clear()
  const baseMapAttrs = baseMap.getAttrs()
  let i = 0
  const xLen = baseMapAttrs.width / multiples - 1
  const yLen = baseMapAttrs.height / multiples - 1
  const rectangleList: IRectangle[] = []
  do {
    let x = Math.round(Math.random() * xLen)
    let y = Math.round(Math.random() * yLen)
    let newRectAngle: IRectangle = {
      x: x,
      y: y
    }
    let overlapping = false;
    for (const rect of rectangleList) {
      if (newRectAngle.x === rect.x && newRectAngle.y === rect.y) {
        overlapping = true
        break
      }
    }
    if (!overlapping) {
      i++
      rectangleList.push(newRectAngle)
    }

  } while (i < 500)
  rectangleList.forEach((item, key) => {
    const { x, y } = item
    const grid = mainGroup.findOne(`#${x}-${y}`)
    if (!grid) {
      return
    }
    if (key === 0) {
      setGridAttrs(grid, 3)
      startPoint = { x, y }
      openList.unshift({ x: x, y: y, parent: `0` })
    } else if (key === 1) {
      setGridAttrs(grid, 4)
    } else {
      setGridAttrs(grid, 2)
    }
  })
  setGridMap()
}
// 设置图形属性
const setGridAttrs = (grid: Konva.Node, type: number) => {
  let fill
  if (type === 2) {  // 禁区
    fill = "#000"
  } else if (type === 3) {// 开始
    fill = "#ff0000"
  } else if (type === 4) {// 结束 
    fill = "#00ff26"
  } else if (type === 5) {// 已访问
    fill = "#ffc800"
  } else if (type === 6) { // 路径
    fill = "#26deff"
  } else { // 默认
    fill = "#999"
  }
  grid.setAttrs({ type: type, fill: fill })
}
// 设置查找到的路径属性
const setPath = () => {
  pathList.forEach((item) => {
    const grid = gridMap[`${item.x}-${item.y}`]
    if (!grid) {
      return
    }
    setGridAttrs(grid, 6)
  })
}
// 设置图形map数据【优化】
const setGridMap = () => {
  const grids = mainGroup.find('.grid')
  grids.forEach((grid) => {
    const gridAttrs = grid.getAttrs()
    const id = `${gridAttrs.x / multiples}-${gridAttrs.y / multiples}`
    gridMap[id] = grid
  })
}
// 清空
const clear = () => {
  openList = []
  pathList = []
  mapPath = {}
  isSuccess = false
  stopFindPath()
  const grids = mainGroup.find('.grid')
  grids.forEach((shapes) => {
    setGridAttrs(shapes, 1)
  })
}
// 开始【带动画】
const startFindPathByAnimation = () => {
  if (isSuccess) {
    ElMessage.warning("请重新设置禁区")
    return
  }
  clearInterval(timer)
  timer = setInterval(() => {
    findPath()
  })
}
// 开始【不带动画】
const startFindPath = () => {
  if (isSuccess) {
    ElMessage.warning("请重新设置禁区")
    return
  }
  if (!stage) {
    return
  }
  const baseMap = stage.findOne("#baseMap")
  if (!baseMap) {
    return
  }
  const baseMapAttrs = baseMap.getAttrs()
  const maxX = baseMapAttrs.width / multiples
  const maxY = baseMapAttrs.height / multiples
  if (openList.length === 0) {
    return
  }
  pathList = []
  do {
    const itemPoint = openList.pop() as IRectangle
    const { x, y } = itemPoint
    if (x < 0 || x >= maxX) {
      continue
    }
    if (y < 0 || y >= maxY) {
      continue
    }
    const id = `${x}-${y}`
    const grid = gridMap[id]
    if (!grid) {
      continue
    }
    const gridAttrs = grid.getAttrs()
    if (gridAttrs.type === 2) {
      continue
    }
    if (gridAttrs.type === 4) {
      mapPath[id] = { x: x, y: y, parent: id }
      getPathPoint(mapPath, itemPoint.parent)
      isSuccess = true
      break
    }
    if (gridAttrs.type === 5) {
      continue
    }
    if (gridAttrs.type !== 3) {
      setGridAttrs(grid, 5)
    }
    mapPath[id] = { x: x, y: y, parent: itemPoint.parent }
    openList.unshift({ x: x + 1, y: y, parent: id })
    openList.unshift({ x: x - 1, y: y, parent: id })
    openList.unshift({ x: x, y: y + 1, parent: id })
    openList.unshift({ x: x, y: y - 1, parent: id })
  } while (openList.length > 0)
  setPath()
}
// 查找路径
const findPath = () => {
  if (!stage) {
    return
  }
  const baseMap = stage.findOne("#baseMap")
  if (!baseMap) {
    return
  }
  const baseMapAttrs = baseMap.getAttrs()
  const maxX = baseMapAttrs.width / multiples
  const maxY = baseMapAttrs.height / multiples

  for (let i = 0; i < openList.length; i++) {
    const itemPoint = openList.pop() as IRectangle
    const { x, y } = itemPoint
    if (x < 0 || x >= maxX) {
      return
    }
    if (y < 0 || y >= maxY) {
      return
    }
    const id = `${x}-${y}`
    const grid = gridMap[id]
    if (!grid) {
      return
    }
    const gridAttrs = grid.getAttrs()
    if (gridAttrs.type === 2) {
      return
    }
    if (gridAttrs.type === 4) {
      isSuccess = true
      mapPath[id] = { x: x, y: y, parent: id }
      getPathPoint(mapPath, itemPoint.parent)
      stopFindPath()
      setPath()
      return
    }
    if (gridAttrs.type === 5) {
      return
    }
    if (gridAttrs.type !== 3) {
      setGridAttrs(grid, 5)
    }
    mapPath[id] = { x: x, y: y, parent: itemPoint.parent }
    openList.unshift({ x: x + 1, y: y, parent: id })
    openList.unshift({ x: x - 1, y: y, parent: id })
    openList.unshift({ x: x, y: y + 1, parent: id })
    openList.unshift({ x: x, y: y - 1, parent: id })
  }
}
// 停止
const stopFindPath = () => {
  clearInterval(timer)
}
// 层层往上找对应的点
const getPathPoint = (pathMap: IPathMap, parent?: string) => {
  if (!parent) {
    return
  }
  let rectangle = pathMap[parent]
  if (parent === `${startPoint.x}-${startPoint.y}`) {
    return
  }
  if (rectangle) {
    pathList.push({ x: rectangle.x, y: rectangle.y })
    getPathPoint(pathMap, rectangle.parent)
  }
}
const router = useRouter()

const back = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.bfs {
  padding: 20px;

  .header {
    height: 50px;
  }

  #canvas {
    background-color: #eee;
    border: 1px solid #666;
    height: calc(100vh - 92px);
  }
}
</style>

