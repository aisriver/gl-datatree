import { LabelValueType, DomPositionType } from '../interfaces/common';

export interface TooltipPropsType {
  title: string;
  showData: LabelValueType[];
  domPosition: DomPositionType;
}

const toolTipStyle = {
  minWidth: '250px',
  maxWidth: '400px',
  minHeight: '100px',
  maxHeight: '450px',
  position: 'absolute',
  // backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 101,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  paddingBottom: '16px',
  overFlow: 'auto',
};

const titleStyle = {
  lineHeight: '32px',
  minHeight: '32px',
  padding: '4px 8px',
  textAlign: 'center',
  color: '#fff',
  borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
};

const labelStyle = {
  color: '#fff',
  fontWeight: 500,
  textAlign: 'right',
  width: '40%',
  display: 'inline-block',
  paddingRight: '4px',
};

const valueStyle = {
  color: '#fff',
  textAlign: 'left',
  width: '55%',
  display: 'inline-block',
  paddingLeft: '4px',
};

/** 清除tooltip */
export const clearTooltip = () => {
  const getTooltip = document.getElementsByClassName('data-tree-tooltip') || [];
  Array.from(getTooltip).forEach(dom => document.body.removeChild(dom));
};

/** 更新tooltip dom */
export const updateTooltip = (props: TooltipPropsType) => {
  const { title = '', showData, domPosition } = props;
  const { x, y, offsetX = 20, offsetY = 15 } = domPosition;
  // 清空存在的
  clearTooltip();
  // 重新创建
  const tooltip = document.createElement('div');
  tooltip.className = 'data-tree-tooltip';
  tooltip.style.left = `${x + offsetX}px`;
  tooltip.style.top = `${y + offsetY}px`;
  Object.keys(toolTipStyle).forEach(key => {
    tooltip.style[key] = toolTipStyle[key];
  });
  const titleDom = document.createElement('div');
  titleDom.className = 'data-tree-tooltip-title';
  titleDom.title = title;
  titleDom.innerHTML = title;
  Object.keys(titleStyle).forEach(key => {
    titleDom.style[key] = titleStyle[key];
  });
  tooltip.appendChild(titleDom);
  showData.forEach(({ label = '', value = '' }, index) => {
    const itemDom = document.createElement('div');
    itemDom.className = 'data-tree-tooltip-item';
    itemDom.style.padding = '4px 8px';
    itemDom.style.lineHeight = '30px';
    if (index !== 0) {
      itemDom.style.borderTop = '1px solid rgba(0, 0, 0, 0.8)';
    }
    itemDom.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    if (index % 2 === 0) {
      itemDom.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }

    const labelDom = document.createElement('label');
    labelDom.className = 'data-tree-tooltip-item-label';
    labelDom.title = label;
    labelDom.innerHTML = `${label}：`;
    Object.keys(labelStyle).forEach(key => {
      labelDom.style[key] = labelStyle[key];
    });

    const valueDom = document.createElement('span');
    valueDom.className = 'data-tree-tooltip-item-value';
    valueDom.title = '' + value;
    valueDom.innerHTML = '' + value;
    Object.keys(valueStyle).forEach(key => {
      valueDom.style[key] = valueStyle[key];
    });

    itemDom.appendChild(labelDom);
    itemDom.appendChild(valueDom);
    tooltip.appendChild(itemDom);
  });
  document.body.appendChild(tooltip);
};
