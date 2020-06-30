import * as THREE from 'three';
import { PositionType, TreeDataType, CreateDataTreeProps } from '../interfaces/common';
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
/**
 * 创建数据树
 */
declare const createDataTree: (props: CreateDataTreeProps | undefined, callBack: (treeGroup: THREE.Group) => void) => void;
export default createDataTree;
