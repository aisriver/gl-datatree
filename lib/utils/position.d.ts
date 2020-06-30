import * as THREE from 'three';
import { PositionType, DomInfoType } from '../interfaces/common';
export interface GetOffsetPositionProps {
    startPosition: PositionType;
    length: number;
    rate: number;
    maxNumber: number;
    index: number;
    sameHeight?: boolean;
}
/** 获取圆中另一个坐标的绝对值 */
export declare const getAbsZ: (r: number, x: number) => number;
/** 获取分布的偏移坐标 */
export declare const getOffsetPosition: (props: GetOffsetPositionProps) => {
    x: number;
    z: number;
    y: number;
};
/** 获取单位向量坐标 */
export declare const getUnitVectorPosition: (startPosition: PositionType, endPosition: PositionType) => {
    x: number;
    y: number;
    z: number;
};
/** 获取任意方向的直行坐标 */
export declare const getStraightPosition: (startPosition: PositionType, endPosition: PositionType, length: number) => {
    x: number;
    y: number;
    z: number;
};
export interface GetNodePositionPropsType {
    level: number;
    index: number;
    treeHeight: number;
    startPosition: PositionType;
    endPosition: PositionType;
    branchLength: number;
    nodeNum: number;
}
/** 获取当前节点的位置 */
export declare const getNodePosition: (props: GetNodePositionPropsType) => {
    x: number;
    z: number;
    y: number;
};
/** 更改对象中心点 */
export declare const changeCenterPoint: (x: number, y: number, z: number, obj: THREE.Object3D) => THREE.Object3D;
interface TransPositionPropsType {
    obj: THREE.Mesh | THREE.Object3D;
    camera: THREE.Camera;
    domInfo: DomInfoType;
}
/** 从webgl坐标反向映射出屏幕坐标 */
export declare const toWindowPosition: (props: TransPositionPropsType) => {
    x: number;
    y: number;
};
export {};
