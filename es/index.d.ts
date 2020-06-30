import { TreeOption } from './interfaces/common';
declare class GlDataTree {
    private renderer;
    private camera;
    private scene;
    private pointLight;
    private ambLight;
    private controls;
    private treeGroup;
    private selectedNode;
    private dom;
    private rayRaster;
    private mouse;
    private mouseInfo;
    private autoPlay;
    private playInterval;
    private autoRotate;
    private treeData;
    private treeTitle;
    private listening;
    constructor();
    /**
     * 初始化renderer
     * @param props
     */
    private initRenderer;
    /**
     * 初始化camera
     * @param param0
     */
    private initCamera;
    /**
     *初始化scene
     * @param props
     */
    private initScene;
    /**
     * 初始化灯光
     */
    private initLight;
    /**
     * 重置选择对象的样式
     */
    private resetNodeStyle;
    /**
     * 详情展示
     * @param currentMesh
     * @param domPosition
     */
    private showDetails;
    /**
     * 动画
     */
    private animate;
    /**
     * 自动播放详情
     */
    private loopDetail;
    /**
     * 设置数据配置
     */
    private setOption;
    /**
     * 鼠标移动
     */
    private handleMousemove;
    /**
     * dispose
     */
    private dispose;
    /**
     * 初始化
     */
    init(glDom: HTMLElement): {
        setOption: (props: TreeOption) => void;
        updateTooltip: (props: import("./utils/tooltip").TooltipPropsType) => void;
        dispose: () => void;
    };
}
export default GlDataTree;
