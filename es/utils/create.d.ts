import * as THREE from 'three';
import { TextGeometryParameters } from 'three/src/geometries/TextGeometry';
import { CubeProps, LinkProps, CylinderProps, CylinderMeshProps, TubeProps } from '../interfaces/common';
export declare const initialCube: {
    size: {
        x: number;
        y: number;
        z: number;
    };
};
export declare const initialColor: number;
/** 创建立方体 */
export declare const createCube: ({ size, color }?: CubeProps) => THREE.Mesh;
/** 创建连线 */
export declare const createLink: (props: LinkProps) => THREE.Line;
/** 创建锥体 */
export declare const createCylinder: (props: CylinderProps) => THREE.Mesh;
export declare const createCylinderMesh: (props: CylinderMeshProps) => THREE.Mesh;
export declare const createTube: (props: TubeProps) => THREE.Mesh;
interface TextOptionProps extends TextGeometryParameters {
    text: string;
    color?: number;
}
export declare const initFont: (callBack: (response: THREE.Font) => void) => void;
export declare const createFont: (option: TextOptionProps, callBack?: ((result: THREE.Object3D) => void) | undefined) => void;
export {};
