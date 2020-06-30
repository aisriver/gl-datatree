"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTooltip = exports.clearTooltip = void 0;
var toolTipStyle = {
  minWidth: '250px',
  maxWidth: '400px',
  minHeight: '100px',
  maxHeight: '450px',
  position: 'absolute',
  // backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 101,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  paddingBottom: '16px',
  overFlow: 'auto'
};
var titleStyle = {
  lineHeight: '32px',
  minHeight: '32px',
  padding: '4px 8px',
  textAlign: 'center',
  color: '#fff',
  borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: 'rgba(0, 0, 0, 0.8)'
};
var labelStyle = {
  color: '#fff',
  fontWeight: 500,
  textAlign: 'right',
  width: '40%',
  display: 'inline-block',
  paddingRight: '4px'
};
var valueStyle = {
  color: '#fff',
  textAlign: 'left',
  width: '55%',
  display: 'inline-block',
  paddingLeft: '4px'
};
/** 清除tooltip */

var clearTooltip = function clearTooltip() {
  var getTooltip = document.getElementsByClassName('data-tree-tooltip') || [];
  Array.from(getTooltip).forEach(function (dom) {
    return document.body.removeChild(dom);
  });
};
/** 更新tooltip dom */


exports.clearTooltip = clearTooltip;

var updateTooltip = function updateTooltip(props) {
  var _props$title = props.title,
      title = _props$title === void 0 ? '' : _props$title,
      showData = props.showData,
      domPosition = props.domPosition;
  var x = domPosition.x,
      y = domPosition.y,
      _domPosition$offsetX = domPosition.offsetX,
      offsetX = _domPosition$offsetX === void 0 ? 20 : _domPosition$offsetX,
      _domPosition$offsetY = domPosition.offsetY,
      offsetY = _domPosition$offsetY === void 0 ? 15 : _domPosition$offsetY; // 清空存在的

  clearTooltip(); // 重新创建

  var tooltip = document.createElement('div');
  tooltip.className = 'data-tree-tooltip';
  tooltip.style.left = "".concat(x + offsetX, "px");
  tooltip.style.top = "".concat(y + offsetY, "px");
  Object.keys(toolTipStyle).forEach(function (key) {
    tooltip.style[key] = toolTipStyle[key];
  });
  var titleDom = document.createElement('div');
  titleDom.className = 'data-tree-tooltip-title';
  titleDom.title = title;
  titleDom.innerHTML = title;
  Object.keys(titleStyle).forEach(function (key) {
    titleDom.style[key] = titleStyle[key];
  });
  tooltip.appendChild(titleDom);
  showData.forEach(function (_ref, index) {
    var _ref$label = _ref.label,
        label = _ref$label === void 0 ? '' : _ref$label,
        _ref$value = _ref.value,
        value = _ref$value === void 0 ? '' : _ref$value;
    var itemDom = document.createElement('div');
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

    var labelDom = document.createElement('label');
    labelDom.className = 'data-tree-tooltip-item-label';
    labelDom.title = label;
    labelDom.innerHTML = "".concat(label, "\uFF1A");
    Object.keys(labelStyle).forEach(function (key) {
      labelDom.style[key] = labelStyle[key];
    });
    var valueDom = document.createElement('span');
    valueDom.className = 'data-tree-tooltip-item-value';
    valueDom.title = '' + value;
    valueDom.innerHTML = '' + value;
    Object.keys(valueStyle).forEach(function (key) {
      valueDom.style[key] = valueStyle[key];
    });
    itemDom.appendChild(labelDom);
    itemDom.appendChild(valueDom);
    tooltip.appendChild(itemDom);
  });
  document.body.appendChild(tooltip);
};

exports.updateTooltip = updateTooltip;
//# sourceMappingURL=tooltip.js.map
