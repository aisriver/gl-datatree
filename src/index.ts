import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import Stats from 'three/examples/jsm/libs/stats.module';
import { DomPositionType, TreeOption, TreeDataType, Listening } from './interfaces/common';
import { getDomInfo } from './utils/dom';
import { updateTooltip, clearTooltip } from './utils/tooltip';
import { toWindowPosition } from './utils/position';
import RAF from './utils/RAF';
import { Intersection } from 'three/src/core/Raycaster';
import createDataTree from './utils/datatree';
const groundImg = require('./assets/grasslight-small.jpg');

class GlDataTree {
  private renderer: THREE.WebGLRenderer | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private scene: THREE.Scene | null = null;
  private pointLight: THREE.PointLight | null = null;
  private ambLight: THREE.AmbientLight | null = null;
  private controls: OrbitControls | null = null;
  private treeGroup: THREE.Group | null = null;
  private selectedNode: Intersection | null = null;
  private dom: HTMLElement | null = null;
  private rayRaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private mouseInfo: MouseEvent | null = null;
  // 是否开启自动播放
  private autoPlay = false;
  // autoPlay interval
  private playInterval = 3000;
  // 场景自动旋转
  private autoRotate = false;
  private treeData: TreeDataType[] = [];
  private treeTitle: string = '';
  private listening: Listening = {};

  constructor() {
    this.animate = this.animate.bind(this);
    this.setOption = this.setOption.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  /**
   * 初始化renderer
   * @param props
   */
  private initRenderer(props?: { shadow?: boolean }) {
    const { shadow = true } = props || {};
    if (this.dom) {
      const { width, height } = getDomInfo(this.dom);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width as number, height as number);
      this.renderer.shadowMapEnabled = shadow;
      this.dom.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 1.0);
    }
  }

  /**
   * 初始化camera
   * @param param0
   */
  private initCamera() {
    if (this.dom && this.renderer) {
      const { width, height } = getDomInfo(this.dom);
      this.camera = new THREE.PerspectiveCamera(45, (width as number) / (height as number), 1, 1000);
      this.camera.position.set(0, 8, 60);
      this.camera.lookAt(0, 0, 0);

      // stats = new Stats();
      // dom.appendChild(stats.dom);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls.update();
      this.dom.appendChild(this.renderer.domElement);
    }
  }

  /**
   *初始化scene
   * @param props
   */
  private initScene(props?: { fog?: boolean }) {
    const { fog = true } = props || {};
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcce0ff);
    if (fog) {
      this.scene.fog = new THREE.Fog(0xcce0ff, 50, 500);
    }
    // ground
    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load(groundImg);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), groundMaterial);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  /**
   * 初始化灯光
   */
  private initLight() {
    if (this.scene) {
      // 点光
      this.pointLight = new THREE.PointLight(0xffffff, 1.0, 0);
      this.pointLight.position.set(100, 100, 200);
      this.pointLight.castShadow = true;
      this.pointLight.shadow.camera.near = 8;
      this.pointLight.shadow.camera.far = 1000;
      this.pointLight.shadow.mapSize.width = 1024;
      this.pointLight.shadow.mapSize.height = 1024;
      // 环境光
      this.ambLight = new THREE.AmbientLight(0x666666);
      this.scene.add(this.ambLight);
      this.scene.add(this.pointLight);
    }
  }

  /**
   * 重置选择对象的样式
   */
  private resetNodeStyle() {
    if (!this.selectedNode) {
      return;
    }
    this.selectedNode.object['material']['opacity'] = 1;
    this.selectedNode.object['material']['color'].set(0xffffff);
  }

  /**
   * 详情展示
   * @param currentMesh
   * @param domPosition
   */
  private showDetails(currentMesh: THREE.Mesh | THREE.Object3D, domPosition: DomPositionType) {
    if (currentMesh) {
      const { userData } = currentMesh;
      if (!userData.type) {
        return;
      }
      document.body.style.cursor = 'pointer';
      currentMesh['material'].transparent = true;
      currentMesh['material'].opacity = 0.6;
      currentMesh['material'].color.set(0xff0000);
      const { onSelected } = this.listening;
      if (onSelected) {
        onSelected(userData, domPosition);
      }
    }
  }

  /**
   * 动画
   */
  private animate() {
    requestAnimationFrame(this.animate);
    if (this.controls) {
      this.controls.update();
    }

    if (this.camera) {
      //射线射出
      this.rayRaster.setFromCamera(this.mouse, this.camera);
      //射线上的物体
      if (this.treeGroup) {
        const intersects: Intersection[] = this.rayRaster.intersectObjects(this.treeGroup.children);
        if (intersects.length > 0 && this.mouseInfo) {
          if (this.selectedNode && this.selectedNode.object.uuid !== intersects[0].object.uuid) {
            this.resetNodeStyle();
          }
          this.selectedNode = intersects[0];
          this.showDetails(this.selectedNode.object, { x: this.mouseInfo.clientX, y: this.mouseInfo.clientY });
        } else {
          document.body.style.cursor = 'auto';
          if (!this.autoPlay) {
            clearTooltip();
          }
          this.resetNodeStyle();
        }
      }
    }
    if (this.renderer && this.pointLight && this.camera && this.scene) {
      // 根据相机位置调整光源
      this.pointLight.position.set(
        this.camera.position.x * 2 + 50,
        this.camera.position.y * 2,
        this.camera.position.z * 2,
      );
      this.renderer.render(this.scene, this.camera);
    }
    // stats.update();
  }

  /**
   * 自动播放详情
   */
  private loopDetail(time: number = this.playInterval) {
    if (
      !this.treeGroup ||
      !this.treeGroup.userData ||
      !this.treeGroup.userData.ids ||
      !this.scene ||
      !this.camera ||
      !this.dom
    ) {
      return;
    }
    const scene = this.scene;
    const camera = this.camera;
    const dom = this.dom;
    const ids = this.treeGroup.userData.ids || [];
    const length = ids.length;
    const raf = new RAF();
    if (length > 0) {
      let index = -1;
      raf.setInterval(() => {
        // 先重置
        if (index !== -1) {
          const preMesh = scene.getObjectByName(ids[index]);
          if (preMesh) {
            preMesh['material'].opacity = 1;
            preMesh['material']['color'].set(0xffffff);
          }
        }
        if (index < length - 1) {
          index++;
        } else {
          index = 0;
        }
        const currentMesh = scene.getObjectByName(ids[index]);
        if (currentMesh && currentMesh.userData) {
          const { userData } = currentMesh;
          const domPosition = toWindowPosition({
            obj: currentMesh,
            camera,
            domInfo: getDomInfo(dom),
          });
          if (userData.type) {
            this.showDetails(currentMesh, { ...domPosition, x: domPosition.x + 100 });
          }
        }
      }, time);
    }
  }

  /**
   * 设置数据配置
   */
  private setOption(props: TreeOption) {
    if (!this.controls || !this.camera || !this.scene) {
      return;
    }
    const camera = this.camera;
    const scene = this.scene;
    const { title, data } = props;
    this.listening = props.listening || {};
    this.autoPlay = props.autoPlay || this.autoPlay;
    this.playInterval = props.playInterval || this.playInterval;
    this.autoRotate = props.autoRotate || this.autoRotate;
    this.controls.autoRotate = this.autoRotate;
    if (JSON.stringify(data) !== JSON.stringify(this.treeData) || title !== this.treeTitle) {
      this.treeData = [...data];
      this.treeTitle = title;
      createDataTree({ position: { x: 0, y: 1, z: 0 }, data, title }, group => {
        scene.add(group);
        this.treeGroup = group;
        if (this.autoPlay) {
          this.loopDetail(this.playInterval);
        }
        const box = new THREE.Box3().setFromObject(group);
        const { max } = box;
        if (!isNaN(max.z) && !isNaN(max.y) && !isNaN(max.x)) {
          // 相机位置自适应
          camera.position.z += max.z;
          camera.position.y = max.y + 4;
        }
      });
    }
  }

  /**
   * 鼠标移动
   */
  private handleMousemove = (e: MouseEvent, dom: HTMLElement) => {
    this.mouseInfo = e;
    const { x, y, width, height } = getDomInfo(dom);
    // 标准设备横坐标
    const correctX = ((e.clientX - (x as number)) / (width as number)) * 2 - 1;
    // 标准设备纵坐标
    const correctY = -((e.clientY - (y as number)) / (height as number)) * 2 + 1;
    this.mouse.x = correctX;
    this.mouse.y = correctY;
  };

  /**
   * dispose
   */
  private dispose() {
    if (!this.renderer || !this.scene) {
      return;
    }
    this.renderer.dispose();

    // dispose material
    const cleanMaterial = (material: THREE.Material) => {
      material.dispose();

      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose();
        }
      }
    };

    this.scene.traverse(object => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }
      object.geometry.dispose();
      const materials = object.material;

      if (!Array.isArray(materials)) {
        cleanMaterial(materials);
      } else {
        // an array of materials
        materials.forEach(material => cleanMaterial(material));
      }
    });
  }

  /**
   * 初始化
   */
  public init(glDom: HTMLElement) {
    this.dom = glDom;
    this.initRenderer();
    this.initCamera();
    this.initScene();
    this.initLight();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.animate();
      // 绑定事件监听
      this.dom.onmousemove = (e: MouseEvent) => this.handleMousemove(e, glDom);
    }
    return {
      setOption: this.setOption,
      updateTooltip,
      dispose: this.dispose,
    };
  }
}

export default GlDataTree;
