import * as THREE from 'three';

export interface MixerType {
  update: (delta: number) => void;
}

export interface DomInfoType {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface GLTF {
  animations: THREE.AnimationClip[];
  scene: THREE.Scene;
  scenes: THREE.Scene[];
  cameras: THREE.Camera[];
  asset: object;
}

export interface SizeType {
  x?: number;
  y?: number;
  z?: number;
}

export interface PositionType {
  x: number;
  y: number;
  z: number;
}

export interface CubeProps {
  size: SizeType;
  color?: number;
}

export interface LinkProps {
  startPosition: PositionType;
  endPosition: PositionType;
  color?: number;
  linewidth?: number;
}

export interface CylinderProps {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
  color?: number;
  basePosition: PositionType;
}

export interface CylinderMeshProps {
  startPosition: PositionType;
  endPosition: PositionType;
  color?: number;
  startWidth?: number;
  endWidth?: number;
}

export interface TubeProps {
  startPosition: PositionType;
  endPosition: PositionType;
  segments?: number;
  radius: number;
  radiusSegments?: number;
  closed?: boolean;
  color?: number;
}

export interface ItemType {
  label: string;
  id: number | string;
  pid?: number | string;
  position?: PositionType;
}

export interface TreeDataType extends ItemType {
  children?: ItemType[];
}

export interface UserDataNodeType {
  type: string;
  position: PositionType;
  label: string;
  level: number;
  size: SizeType;
}

export interface UserDataLinkType {
  type: string;
  position: PositionType;
  label: string;
  level: number;
  size: SizeType;
}

export interface LabelValueType {
  label: string;
  value: string | number;
}

export interface DomPositionType {
  x: number;
  y: number;
  // 偏移量
  offsetX?: number;
  offsetY?: number;
}

export interface TreeOption {
  title: string;
  data: TreeDataType[];
  autoPlay?: boolean;
  playInterval?: number;
  autoRotate?: boolean;
  listening?: Listening;
}

export interface CreateDataTreeProps {
  title?: string;
  data: TreeDataType[];
  position: PositionType;
}

export interface Listening {
  onSelected?: (userData: object, domPosition: DomPositionType) => void;
}
