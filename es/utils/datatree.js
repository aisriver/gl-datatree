function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import { createCylinderMesh, createFont } from '../utils/create';
import { getNodePosition } from '../utils/position';
var initialDataTree = {
  position: {
    x: 0,
    y: 0,
    z: 0
  },
  data: []
};
var leafs;
var leafLoader = new GLTFLoader(); // 轮播对象的id

var dataIds = [];
var gridBox = [];
/** 获取树枝长度 */

var getBranchLength = function getBranchLength(treeHeight, level) {
  var maxLength = treeHeight * 0.618;
  var minLength = (treeHeight - maxLength) / 2;
  var currentLength = maxLength - maxLength / 10 * level;
  return currentLength > minLength ? currentLength : minLength;
};

var renderTree = function renderTree(props) {
  var data = props.data,
      group = props.group,
      level = props.level,
      startPosition = props.startPosition,
      endPosition = props.endPosition,
      baseNodeSize = props.baseNodeSize,
      treeHeight = props.treeHeight;
  var isFirstNode = level === 1; // 保存网格盒子的数据

  if (gridBox.filter(function (item) {
    return item.level === level;
  }).length === 0) {
    gridBox.push({
      level: level,
      positionY: endPosition.y
    });
  }

  var branchLength = getBranchLength(treeHeight, level);
  var nodeNum = data.length;
  data.forEach(function (item, index) {
    var children = item.children,
        restParams = _objectWithoutProperties(item, ["children"]);

    var id = '' + item.id;
    var pid = '' + item.pid;
    var nodeRate = 0.5 / level;
    var nodeSize = {
      x: baseNodeSize.x * nodeRate,
      y: baseNodeSize.y * nodeRate,
      z: baseNodeSize.z * nodeRate
    };
    var nodeCubeConfig = {
      size: nodeSize,
      color: 0x229a41
    }; // 方块节点
    // const node = createCube(nodeCubeConfig);
    // 树叶团节点

    var node = leafs.scene.clone().children[2];
    node['material'] = node['material'].clone();
    node.scale.set(1 / level, 1 / level, 1 / level);
    var nodePosition = isFirstNode ? endPosition : restParams.position // 如果是自定义位置 直接使用
    ? restParams.position : getNodePosition({
      level: level,
      treeHeight: treeHeight,
      startPosition: startPosition,
      endPosition: endPosition,
      index: index,
      branchLength: branchLength,
      nodeNum: nodeNum
    });
    node.position.set(nodePosition.x, nodePosition.y, nodePosition.z);
    node.castShadow = true;
    node.receiveShadow = true; // 设置节点携带数据

    node.name = id;
    node.userData = _objectSpread(_objectSpread({
      type: 'node',
      position: nodePosition,
      level: level
    }, nodeCubeConfig), restParams);

    if (!isFirstNode) {
      var linkStartPosition = level === 2 ? startPosition : endPosition;
      var linkMeshConfig = {
        startWidth: 0.1,
        endWidth: 0.2,
        startPosition: linkStartPosition,
        endPosition: nodePosition,
        color: 0x7d653a
      }; // 圆柱连线

      var link = createCylinderMesh(linkMeshConfig); // 弯曲管道连线
      // const tubeRadius = 0.4 / level;
      // const link = createTube({
      //   startPosition: linkStartPosition,
      //   endPosition: nodePosition,
      //   radius: tubeRadius < 0.05 ? 0.05 : tubeRadius,
      //   color: 0x7d653a,
      // });
      // 设置联线携带数据

      var linkName = "".concat(pid, "_").concat(id);
      link.name = linkName;
      link.castShadow = true;
      link.receiveShadow = true;
      dataIds.push(linkName);
      link.userData = _objectSpread({
        type: 'link',
        label: linkName,
        from: pid,
        to: id
      }, linkMeshConfig);
      group.add(link);
    }

    dataIds.push(id);
    group.add(node);

    if (children && children.length) {
      var currentEndPosition = _objectSpread({}, nodePosition);

      if (isFirstNode) {
        currentEndPosition.y = currentEndPosition.y + branchLength;
      }

      renderTree({
        data: children,
        group: group,
        level: level + 1,
        treeHeight: treeHeight,
        startPosition: endPosition,
        endPosition: currentEndPosition,
        baseNodeSize: baseNodeSize
      });
    }
  });
};
/**
 * 创建数据树
 */


var createDataTree = function createDataTree() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialDataTree;
  var callBack = arguments.length > 1 ? arguments[1] : undefined;
  var position = props.position,
      data = props.data,
      _props$title = props.title,
      title = _props$title === void 0 ? '' : _props$title;
  var x = position.x,
      y = position.y,
      z = position.z;
  var group = new THREE.Group(); // 树干高度

  var treeHeight = 10;
  var baseNodeWidth = 4;
  var baseNodeHeight = baseNodeWidth / 2;
  var titleLength = title.length;
  var baseNodeSize = {
    x: baseNodeWidth,
    y: baseNodeHeight,
    z: baseNodeWidth
  }; // 树根节点
  // const startNode = createCube({ size: baseNodeSize, color: 0x4f4118 });

  var startNode;
  var startPosition = {
    x: 0,
    y: 0,
    z: 0
  };
  var endPosition = {
    x: 0,
    y: treeHeight,
    z: 0
  };
  leafLoader.load(require('../assets/tree/root.gltf'), function (gltf) {
    startNode = gltf.scene.clone();
    startNode.position.set(0, 0, 0);
    startNode.scale.set(2, 2, 2);
    group.add(startNode);
  }); // 树干

  var trunk = createCylinderMesh({
    startWidth: 0.4,
    endWidth: 0.8,
    startPosition: startPosition,
    endPosition: endPosition,
    color: 0x7d653a
  });
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.name = 'trunk';
  trunk.userData = {
    type: 'link',
    startPosition: startPosition,
    endPosition: endPosition,
    label: '树干',
    from: '根',
    to: '初始节点'
  }; // const line = createLink({
  //   startPosition: { x: 0, y: 0, z: 0 },
  //   endPosition: { x: 0, y: 10, z: 0 },
  // });
  // 创建字体

  var fontSize = baseNodeWidth / titleLength / 1.5;
  createFont({
    text: title,
    size: fontSize,
    color: 0xffffff
  }, function (result) {
    result.position.set(-baseNodeHeight, fontSize / 2, baseNodeHeight);
    group.add(result);
  }); // group.add(line);
  // group.add(cylinder);

  group.add(trunk);
  dataIds = ['trunk'];
  leafLoader.load(require('../assets/tree/leafs.gltf'), function (gltf) {
    leafs = gltf;
    renderTree({
      data: data,
      group: group,
      level: 1,
      treeHeight: treeHeight,
      startPosition: startPosition,
      endPosition: endPosition,
      baseNodeSize: baseNodeSize
    });
    group.position.set(x, y, z);
    group.userData = {
      ids: dataIds,
      gridBox: gridBox
    };
    callBack(group);
  });
};

export default createDataTree;
//# sourceMappingURL=datatree.js.map
