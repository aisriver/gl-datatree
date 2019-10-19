import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import { PositionType, TreeDataType, GLTF, CreateDataTreeProps } from '../interfaces/common';
import { createCylinderMesh, createFont } from '../utils/create';
import { getNodePosition } from '../utils/position';

export interface RenderTreePropsType {
  data: TreeDataType[];
  group: THREE.Group;
  level: number;
  treeHeight: number;
  startPosition: PositionType;
  baseNodeSize: PositionType;
  endPosition: PositionType;
}

export interface GridBoxType {
  level: number;
  positionY: number;
}

const initialDataTree = {
  position: { x: 0, y: 0, z: 0 },
  data: [],
};

let leafs: GLTF;
const leafLoader = new GLTFLoader();
// 轮播对象的id
let dataIds: string[] = [];
const gridBox: GridBoxType[] = [];

/** 获取树枝长度 */
const getBranchLength = (treeHeight: number, level: number) => {
  const maxLength = treeHeight * 0.618;
  const minLength = (treeHeight - maxLength) / 2;
  const currentLength = maxLength - (maxLength / 10) * level;
  return currentLength > minLength ? currentLength : minLength;
};

const renderTree = (props: RenderTreePropsType) => {
  const { data, group, level, startPosition, endPosition, baseNodeSize, treeHeight } = props;
  const isFirstNode = level === 1;
  // 保存网格盒子的数据
  if (gridBox.filter(item => item.level === level).length === 0) {
    gridBox.push({ level, positionY: endPosition.y });
  }
  const branchLength = getBranchLength(treeHeight, level);
  const nodeNum = data.length;
  data.forEach((item: TreeDataType, index: number) => {
    const { children, ...restParams } = item;
    const id = '' + item.id;
    const pid = '' + item.pid;
    const nodeRate = 0.5 / level;
    const nodeSize = {
      x: baseNodeSize.x * nodeRate,
      y: baseNodeSize.y * nodeRate,
      z: baseNodeSize.z * nodeRate,
    };
    const nodeCubeConfig = {
      size: nodeSize,
      color: 0x229a41, // 0xc14826
    };
    // 方块节点
    // const node = createCube(nodeCubeConfig);
    // 树叶团节点
    const node: THREE.Mesh | THREE.Object3D = leafs.scene.clone().children[2];
    node['material'] = node['material'].clone();
    node.scale.set(1 / level, 1 / level, 1 / level);
    const nodePosition = isFirstNode
      ? endPosition
      : restParams.position // 如果是自定义位置 直接使用
      ? restParams.position
      : getNodePosition({
          level,
          treeHeight,
          startPosition,
          endPosition,
          index,
          branchLength,
          nodeNum,
        });
    node.position.set(nodePosition.x, nodePosition.y, nodePosition.z);
    node.castShadow = true;
    node.receiveShadow = true;
    // 设置节点携带数据
    node.name = id;
    node.userData = {
      type: 'node',
      position: nodePosition,
      label: item.label,
      level,
      ...nodeCubeConfig,
      ...restParams,
    };
    if (!isFirstNode) {
      const linkStartPosition = level === 2 ? startPosition : endPosition;
      const linkMeshConfig = {
        startWidth: 0.1,
        endWidth: 0.2,
        startPosition: linkStartPosition,
        endPosition: nodePosition,
        color: 0x7d653a,
      };
      // 圆柱连线
      const link = createCylinderMesh(linkMeshConfig);
      // 弯曲管道连线
      // const tubeRadius = 0.4 / level;
      // const link = createTube({
      //   startPosition: linkStartPosition,
      //   endPosition: nodePosition,
      //   radius: tubeRadius < 0.05 ? 0.05 : tubeRadius,
      //   color: 0x7d653a,
      // });
      // 设置联线携带数据
      const linkName = `${pid}_${id}`;
      link.name = linkName;
      link.castShadow = true;
      link.receiveShadow = true;
      dataIds.push(linkName);
      link.userData = {
        type: 'link',
        label: linkName,
        from: pid,
        to: id,
        ...linkMeshConfig,
      };
      group.add(link);
    }
    dataIds.push(id);
    group.add(node);
    if (children && children.length) {
      const currentEndPosition = { ...nodePosition };
      if (isFirstNode) {
        currentEndPosition.y = currentEndPosition.y + branchLength;
      }
      renderTree({
        data: children,
        group,
        level: level + 1,
        treeHeight,
        startPosition: endPosition,
        endPosition: currentEndPosition,
        baseNodeSize,
      });
    }
  });
};

/**
 * 创建数据树
 */
const createDataTree = (props: CreateDataTreeProps = initialDataTree, callBack: (treeGroup: THREE.Group) => void) => {
  const { position, data, title = '' } = props;
  const { x, y, z } = position;
  const group = new THREE.Group();
  // 树干高度
  const treeHeight = 10;
  const baseNodeWidth = 4;
  const baseNodeHeight = baseNodeWidth / 2;
  const titleLength = title.length;
  const baseNodeSize = { x: baseNodeWidth, y: baseNodeHeight, z: baseNodeWidth };

  // 树根节点
  // const startNode = createCube({ size: baseNodeSize, color: 0x4f4118 });
  let startNode;
  const startPosition = { x: 0, y: 0, z: 0 };
  const endPosition = { x: 0, y: treeHeight, z: 0 };
  leafLoader.load(require('../assets/gl/object/tree/root.gltf'), (gltf: GLTF) => {
    startNode = gltf.scene.clone();
    startNode.position.set(0, 0, 0);
    startNode.scale.set(2, 2, 2);
    group.add(startNode);
  });
  // 树干
  const trunk = createCylinderMesh({
    startWidth: 0.4,
    endWidth: 0.8,
    startPosition,
    endPosition,
    color: 0x7d653a,
  });
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.name = 'trunk';
  trunk.userData = {
    type: 'link',
    startPosition,
    endPosition,
    label: '树干',
    from: '根',
    to: '初始节点',
  };
  // const line = createLink({
  //   startPosition: { x: 0, y: 0, z: 0 },
  //   endPosition: { x: 0, y: 10, z: 0 },
  // });

  // 创建字体
  const fontSize = baseNodeWidth / titleLength / 1.5;
  createFont({ text: title, size: fontSize, color: 0xffffff }, result => {
    result.position.set(-baseNodeHeight, fontSize / 2, baseNodeHeight);
    group.add(result);
  });

  // group.add(line);
  // group.add(cylinder);
  group.add(trunk);
  dataIds = ['trunk'];
  leafLoader.load(require('../assets/gl/object/tree/leafs.gltf'), (gltf: GLTF) => {
    leafs = gltf;
    renderTree({
      data,
      group,
      level: 1,
      treeHeight,
      startPosition,
      endPosition,
      baseNodeSize,
    });
    group.position.set(x, y, z);
    group.userData = {
      ids: dataIds,
      gridBox,
    };
    callBack(group);
  });
};

export default createDataTree;
