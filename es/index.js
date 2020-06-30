function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getDomInfo } from './utils/dom';
import { updateTooltip, clearTooltip } from './utils/tooltip';
import { toWindowPosition } from './utils/position';
import RAF from './utils/RAF';
import createDataTree from './utils/datatree';

var groundImg = require('./assets/grasslight-small.jpg');

var GlDataTree = /*#__PURE__*/function () {
  function GlDataTree() {
    var _this = this;

    _classCallCheck(this, GlDataTree);

    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.pointLight = null;
    this.ambLight = null;
    this.controls = null;
    this.treeGroup = null;
    this.selectedNode = null;
    this.dom = null;
    this.rayRaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouseInfo = null; // 是否开启自动播放

    this.autoPlay = false; // autoPlay interval

    this.playInterval = 3000; // 场景自动旋转

    this.autoRotate = false;
    this.treeData = [];
    this.treeTitle = '';
    this.listening = {};
    /**
     * 鼠标移动
     */

    this.handleMousemove = function (e, dom) {
      _this.mouseInfo = e;

      var _getDomInfo = getDomInfo(dom),
          x = _getDomInfo.x,
          y = _getDomInfo.y,
          width = _getDomInfo.width,
          height = _getDomInfo.height; // 标准设备横坐标


      var correctX = (e.clientX - x) / width * 2 - 1; // 标准设备纵坐标

      var correctY = -((e.clientY - y) / height) * 2 + 1;
      _this.mouse.x = correctX;
      _this.mouse.y = correctY;
    };

    this.animate = this.animate.bind(this);
    this.setOption = this.setOption.bind(this);
    this.dispose = this.dispose.bind(this);
  }
  /**
   * 初始化renderer
   * @param props
   */


  _createClass(GlDataTree, [{
    key: "initRenderer",
    value: function initRenderer(props) {
      var _ref = props || {},
          _ref$shadow = _ref.shadow,
          shadow = _ref$shadow === void 0 ? true : _ref$shadow;

      if (this.dom) {
        var _getDomInfo2 = getDomInfo(this.dom),
            width = _getDomInfo2.width,
            height = _getDomInfo2.height;

        this.renderer = new THREE.WebGLRenderer({
          antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.shadowMapEnabled = shadow;
        this.dom.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xffffff, 1.0);
      }
    }
    /**
     * 初始化camera
     * @param param0
     */

  }, {
    key: "initCamera",
    value: function initCamera() {
      if (this.dom && this.renderer) {
        var _getDomInfo3 = getDomInfo(this.dom),
            width = _getDomInfo3.width,
            height = _getDomInfo3.height;

        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this.camera.position.set(0, 8, 60);
        this.camera.lookAt(0, 0, 0); // stats = new Stats();
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

  }, {
    key: "initScene",
    value: function initScene(props) {
      var _ref2 = props || {},
          _ref2$fog = _ref2.fog,
          fog = _ref2$fog === void 0 ? true : _ref2$fog;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xcce0ff);

      if (fog) {
        this.scene.fog = new THREE.Fog(0xcce0ff, 50, 500);
      } // ground


      var loader = new THREE.TextureLoader();
      var groundTexture = loader.load(groundImg);
      groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
      groundTexture.repeat.set(25, 25);
      groundTexture.anisotropy = 16;
      var groundMaterial = new THREE.MeshLambertMaterial({
        map: groundTexture
      });
      var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), groundMaterial);
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
    /**
     * 初始化灯光
     */

  }, {
    key: "initLight",
    value: function initLight() {
      if (this.scene) {
        // 点光
        this.pointLight = new THREE.PointLight(0xffffff, 1.0, 0);
        this.pointLight.position.set(100, 100, 200);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.camera.near = 8;
        this.pointLight.shadow.camera.far = 1000;
        this.pointLight.shadow.mapSize.width = 1024;
        this.pointLight.shadow.mapSize.height = 1024; // 环境光

        this.ambLight = new THREE.AmbientLight(0x666666);
        this.scene.add(this.ambLight);
        this.scene.add(this.pointLight);
      }
    }
    /**
     * 重置选择对象的样式
     */

  }, {
    key: "resetNodeStyle",
    value: function resetNodeStyle() {
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

  }, {
    key: "showDetails",
    value: function showDetails(currentMesh, domPosition) {
      if (currentMesh) {
        var userData = currentMesh.userData;

        if (!userData.type) {
          return;
        }

        document.body.style.cursor = 'pointer';
        currentMesh['material'].transparent = true;
        currentMesh['material'].opacity = 0.6;
        currentMesh['material'].color.set(0xff0000);
        var onSelected = this.listening.onSelected;

        if (onSelected) {
          onSelected(userData, domPosition);
        }
      }
    }
    /**
     * 动画
     */

  }, {
    key: "animate",
    value: function animate() {
      requestAnimationFrame(this.animate);

      if (this.controls) {
        this.controls.update();
      }

      if (this.camera) {
        //射线射出
        this.rayRaster.setFromCamera(this.mouse, this.camera); //射线上的物体

        if (this.treeGroup) {
          var intersects = this.rayRaster.intersectObjects(this.treeGroup.children);

          if (intersects.length > 0 && this.mouseInfo) {
            if (this.selectedNode && this.selectedNode.object.uuid !== intersects[0].object.uuid) {
              this.resetNodeStyle();
            }

            this.selectedNode = intersects[0];
            this.showDetails(this.selectedNode.object, {
              x: this.mouseInfo.clientX,
              y: this.mouseInfo.clientY
            });
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
        this.pointLight.position.set(this.camera.position.x * 2 + 50, this.camera.position.y * 2, this.camera.position.z * 2);
        this.renderer.render(this.scene, this.camera);
      } // stats.update();

    }
    /**
     * 自动播放详情
     */

  }, {
    key: "loopDetail",
    value: function loopDetail() {
      var _this2 = this;

      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.playInterval;

      if (!this.treeGroup || !this.treeGroup.userData || !this.treeGroup.userData.ids || !this.scene || !this.camera || !this.dom) {
        return;
      }

      var scene = this.scene;
      var camera = this.camera;
      var dom = this.dom;
      var ids = this.treeGroup.userData.ids || [];
      var length = ids.length;
      var raf = new RAF();

      if (length > 0) {
        var index = -1;
        raf.setInterval(function () {
          // 先重置
          if (index !== -1) {
            var preMesh = scene.getObjectByName(ids[index]);

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

          var currentMesh = scene.getObjectByName(ids[index]);

          if (currentMesh && currentMesh.userData) {
            var userData = currentMesh.userData;
            var domPosition = toWindowPosition({
              obj: currentMesh,
              camera: camera,
              domInfo: getDomInfo(dom)
            });

            if (userData.type) {
              _this2.showDetails(currentMesh, _objectSpread(_objectSpread({}, domPosition), {}, {
                x: domPosition.x + 100
              }));
            }
          }
        }, time);
      }
    }
    /**
     * 设置数据配置
     */

  }, {
    key: "setOption",
    value: function setOption(props) {
      var _this3 = this;

      if (!this.controls || !this.camera || !this.scene) {
        return;
      }

      var camera = this.camera;
      var scene = this.scene;
      var title = props.title,
          data = props.data;
      this.listening = props.listening || {};
      this.autoPlay = props.autoPlay || this.autoPlay;
      this.playInterval = props.playInterval || this.playInterval;
      this.autoRotate = props.autoRotate || this.autoRotate;
      this.controls.autoRotate = this.autoRotate;

      if (JSON.stringify(data) !== JSON.stringify(this.treeData) || title !== this.treeTitle) {
        this.treeData = _toConsumableArray(data);
        this.treeTitle = title;
        createDataTree({
          position: {
            x: 0,
            y: 1,
            z: 0
          },
          data: data,
          title: title
        }, function (group) {
          scene.add(group);
          _this3.treeGroup = group;

          if (_this3.autoPlay) {
            _this3.loopDetail(_this3.playInterval);
          }

          var box = new THREE.Box3().setFromObject(group);
          var max = box.max;

          if (!isNaN(max.z) && !isNaN(max.y) && !isNaN(max.x)) {
            // 相机位置自适应
            camera.position.z += max.z;
            camera.position.y = max.y + 4;
          }
        });
      }
    }
    /**
     * dispose
     */

  }, {
    key: "dispose",
    value: function dispose() {
      if (!this.renderer || !this.scene) {
        return;
      }

      this.renderer.dispose(); // dispose material

      var cleanMaterial = function cleanMaterial(material) {
        material.dispose(); // dispose textures

        for (var _i = 0, _Object$keys = Object.keys(material); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          var value = material[key];

          if (value && _typeof(value) === 'object' && 'minFilter' in value) {
            value.dispose();
          }
        }
      };

      this.scene.traverse(function (object) {
        if (!(object instanceof THREE.Mesh)) {
          return;
        }

        object.geometry.dispose();
        var materials = object.material;

        if (!Array.isArray(materials)) {
          cleanMaterial(materials);
        } else {
          // an array of materials
          materials.forEach(function (material) {
            return cleanMaterial(material);
          });
        }
      });
    }
    /**
     * 初始化
     */

  }, {
    key: "init",
    value: function init(glDom) {
      var _this4 = this;

      this.dom = glDom;
      this.initRenderer();
      this.initCamera();
      this.initScene();
      this.initLight();

      if (this.renderer && this.scene && this.camera) {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.animate(); // 绑定事件监听

        this.dom.onmousemove = function (e) {
          return _this4.handleMousemove(e, glDom);
        };
      }

      return {
        setOption: this.setOption,
        updateTooltip: updateTooltip,
        dispose: this.dispose
      };
    }
  }]);

  return GlDataTree;
}();

export default GlDataTree;
//# sourceMappingURL=index.js.map
