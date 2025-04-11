<template>
  <div class="maze">
    <div class="action">
      <el-button @click="back">返回</el-button>
      <el-button type="primary" @click="startMaze">生成新迷宫</el-button>
    </div>
    <div id="container"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import { onMounted, ref } from 'vue'; 
import { useRouter } from 'vue-router';
 
let scene:THREE.Scene; 
let camera:THREE.PerspectiveCamera; 
let renderer:THREE.WebGLRenderer;  
let controls:OrbitControls;
//
let maze = ref<number[][] >([]);
let size = ref<number>(51); 
onMounted(() => {
  init();
});

function init() {  
  generateMaze();
  initScene();
  initCamera();
  initRenderer(); 
  initControls();
  initPlane(); 
  initCube();
  initSpotLight();
  render();
  animation();
}

function initScene(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
}

function initCamera(){
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 30, 50);
}

function initRenderer(){
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
}

function initControls(){
  controls = new OrbitControls(camera, renderer.domElement); 
  controls.dampingFactor = 15; 
  controls.addEventListener('change', render);
}

function initPlane(){
  let planeGeometry = new THREE.PlaneGeometry(size.value + 6, size.value + 6, 1, 1); 
  let planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x555555,
    dithering: true
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial); 
  // 接受阴影
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI * 0.5;
  scene.add(plane);
}
 
// 聚光灯
function initSpotLight() {
  const light = new THREE.SpotLight(0xffffff, 1);
  // 投射阴影
  light.castShadow = true;
  // 光照最大范围
  light.angle = 0.5;
  // 半影衰减百分比
  light.penumbra = 0.2;
  // 沿着光照距离的衰减量
  light.decay = 0.5;
  // 光照最大距离
  light.distance = 70;
  // 位置
  light.position.set(-30, 40, -10);
  scene.add(light); 
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
}

function animation(){ 
  requestAnimationFrame(animation);
}

function render(){
  if(!renderer || !scene || !camera){
    return;
  } 
  renderer.render(scene, camera);
}  

function initCube(){
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshPhongMaterial({ color: '#a65b00' });
  let cube = new THREE.Mesh(geometry, material);  
  for (let i = 0;i < maze.value.length;i++){
    for (let j = 0;j < maze.value[i].length;j++){
      if(maze.value[i][j] === 1){  
        let newCube = cube.clone();
        newCube.castShadow = true;
        newCube.receiveShadow = true;
        newCube.name = `cube cube${i}${j}`;
        newCube.position.x = i - size.value / 2 + 0.5;
        newCube.position.z = j - size.value / 2 + 0.5; 
        newCube.position.y = 1; 
        scene.add(newCube); 
      }
    }
  } 
}
// 生成迷宫逻辑
function generateMaze() { 
  size.value = size.value % 2 === 0 ? size.value + 1 : size.value; // 确保奇数
                    
  // 初始化迷宫
  maze.value = Array.from({ length: size.value }, () => 
    Array(size.value).fill(1)
  );
  // 递归回溯算法
  function carve(x:number, y:number) {
    const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]].sort(() => Math.random() - 0.5);
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size.value && ny >= 0 && ny < size.value && maze.value[ny][nx] === 1) {
        maze.value[y + dy / 2][x + dx / 2] = 0;
        maze.value[ny][nx] = 0;
        carve(nx, ny);
      }
    }
  }
  // 设置起点并开始生成
  maze.value[1][1] = 0;
  carve(1, 1);

  // 设置出入口
  maze.value[0][1] = 0;
  maze.value[size.value - 1][size.value - 2] = 0;
}

// 生成新迷宫
function startMaze(){ 
  generateMaze();
  scene.children
    .filter((obj) => obj.name.startsWith('cube'))
    .forEach((cube) => { 
      let c = cube as THREE.Mesh; 
      scene.remove(c); 
      c.geometry.dispose(); 
      (c.material as THREE.MeshBasicMaterial).dispose(); 
    }); 
  initCube();
  render();
}
const router = useRouter();
const back = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>
.action{
    position: fixed;
    background-color: #000;
    padding:15px;
}
</style>