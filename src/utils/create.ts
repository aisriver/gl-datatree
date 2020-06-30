import * as THREE from 'three';
import { TextGeometryParameters } from 'three/src/geometries/TextGeometry';
import {
  CubeProps,
  LinkProps,
  CylinderProps,
  CylinderMeshProps,
  TubeProps,
} from '../interfaces/common';

export const initialCube = {
  size: { x: 10, y: 10, z: 10 },
};

export const initialColor = Math.random() * 0xffffff;

/** 创建立方体 */
export const createCube = ({ size, color }: CubeProps = initialCube) => {
  const { x, y, z } = size;
  const geometry = new THREE.BoxBufferGeometry(x, y, z);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshLambertMaterial({ color: color || initialColor }),
  );
  mesh.position.set(0, 0, 0);
  return mesh;
};

/** 创建连线 */
export const createLink = (props: LinkProps) => {
  const { startPosition, endPosition, color = initialColor, linewidth = 1 } = props;
  const geometry = new THREE.Geometry();
  const material = new THREE.LineBasicMaterial({ color, linewidth });

  // 线的材质可以由2点的颜色决定
  geometry.vertices.push(new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z));
  geometry.vertices.push(new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z));

  const line = new THREE.Line(geometry, material);
  return line;
};

/** 创建锥体 */
export const createCylinder = (props: CylinderProps) => {
  const {
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    color = initialColor,
    basePosition,
  } = props;
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  const material = new THREE.MeshLambertMaterial({ color });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(basePosition.x, height / 2, basePosition.z);
  return cylinder;
};

const loader = new THREE.TextureLoader();
const groundTexture = loader.load(require('../assets/tree.jpg'));

export const createCylinderMesh = function(props: CylinderMeshProps) {
  const { startPosition, endPosition, startWidth = 0.2, endWidth = 0.6 } = props;
  const vectorStartPoint = new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z);
  const vectorEndPoint = new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z);
  const direction = new THREE.Vector3().subVectors(vectorEndPoint, vectorStartPoint);
  const arrowDirection = direction.clone();
  const arrow = new THREE.ArrowHelper(arrowDirection.normalize(), vectorStartPoint);
  const edgeGeometry = new THREE.CylinderGeometry(startWidth, endWidth, direction.length(), 6, 4);

  // 添加树的纹理
  const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
  const edge = new THREE.Mesh(edgeGeometry, groundMaterial);

  edge.rotation.copy(arrow.rotation);
  const position = new THREE.Vector3().addVectors(vectorStartPoint, direction.multiplyScalar(0.5));
  edge.position.set(position.x, position.y, position.z);
  return edge;
};

export const createTube = (props: TubeProps) => {
  const {
    startPosition,
    endPosition,
    segments = 20,
    radius,
    radiusSegments = 10,
    closed = false,
  } = props;
  const startPoint = new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z);
  const endPoint = new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z);
  // 创建中心偏移节点 生成曲线
  const centerPoint = new THREE.Vector3(
    startPosition.x + (endPosition.x - startPosition.x) / 2 + 0.5,
    startPosition.y + (endPosition.y - startPosition.y) / 2 - 0.3,
    startPosition.z + (endPosition.z - startPosition.z) / 2 + 0.5,
  );
  const geometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([startPoint, centerPoint, endPoint]),
    segments,
    radius,
    radiusSegments,
    closed,
  );
  // 添加树的纹理
  const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
  const mesh = new THREE.Mesh(geometry, groundMaterial);
  return mesh;
};

interface TextOptionProps extends TextGeometryParameters {
  text: string;
  color?: number;
}

let font: THREE.Font | null = null;
const fontLoader = new THREE.FontLoader();

export const initFont = (callBack: (response: THREE.Font) => void) => {
  if (font) {
    callBack(font);
  } else {
    // const font = fontLoader.parse(require('../assets/gl/font/PingFang_SC_Regular.json'));
    // callBack(font);
    fontLoader.load(
      'https://raw.githubusercontent.com/aisriver/gl-datatree/master/src/assets/gl/font/PingFang_SC_Regular.json',
      response => {
        font = response;
        callBack(font);
      },
    );
  }
};

export const createFont = (
  option: TextOptionProps,
  callBack?: (result: THREE.Object3D) => void,
) => {
  const { text, size = 3, height = 0.1, color = 0xff0000 } = option;
  initFont(font => {
    const geometry = new THREE.TextGeometry(text, {
      font,
      size,
      height,
      curveSegments: 6,
      bevelThickness: 1,
      bevelSize: 1,
      bevelEnabled: false,
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color, specular: 0xffffff });
    const mesh = new THREE.Mesh(geometry, textMaterial);
    if (callBack && typeof callBack === 'function') {
      callBack(mesh);
    }
  });
};
