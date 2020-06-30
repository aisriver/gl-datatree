import { LabelValueType, DomPositionType } from '../interfaces/common';
export interface TooltipPropsType {
    title: string;
    showData: LabelValueType[];
    domPosition: DomPositionType;
}
/** 清除tooltip */
export declare const clearTooltip: () => void;
/** 更新tooltip dom */
export declare const updateTooltip: (props: TooltipPropsType) => void;
