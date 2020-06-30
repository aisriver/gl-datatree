"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toWindowPosition = exports.changeCenterPoint = exports.getNodePosition = exports.getStraightPosition = exports.getUnitVectorPosition = exports.getOffsetPosition = exports.getAbsZ = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** 获取圆中另一个坐标的绝对值 */
var getAbsZ = function getAbsZ(r, x) {
  return Math.sqrt(r * r - x * x);
};
/** 获取分布的偏移坐标 */


exports.getAbsZ = getAbsZ;

var getOffsetPosition = function getOffsetPosition(props) {
  var startPosition = props.startPosition,
      length = props.length,
      rate = props.rate,
      maxNumber = props.maxNumber,
      index = props.index,
      _props$sameHeight = props.sameHeight,
      sameHeight = _props$sameHeight === void 0 ? true : _props$sameHeight;
  var rl;
  var vl; // 统一分支高度

  if (sameHeight) {
    vl = length;
    rl = Math.tan(2 * Math.PI / 360 * rate) * vl;
  } else {
    // 统一分支长度
    rl = Math.sin(2 * Math.PI / 360 * rate) * length;
    vl = Math.cos(2 * Math.PI / 360 * rate) * length;
  }

  var p1 = _objectSpread(_objectSpread({}, startPosition), {}, {
    y: startPosition.y + vl
  });

  var relativeRate = 360 / maxNumber * index;
  var relativeX;
  var relativeZ;

  if (relativeRate >= 0 && relativeRate <= 180) {
    relativeX = rl - relativeRate * rl / 90;
    relativeZ = getAbsZ(rl, relativeX);
  }

  if (relativeRate > 180 && relativeRate <= 360) {
    relativeX = relativeRate * rl / 90 - 3 * rl;
    relativeZ = -getAbsZ(rl, relativeX);
  }

  return _objectSpread(_objectSpread({}, p1), {}, {
    x: p1.x + relativeX,
    z: p1.z + relativeZ
  });
};
/** 获取单位向量坐标 */


exports.getOffsetPosition = getOffsetPosition;

var getUnitVectorPosition = function getUnitVectorPosition(startPosition, endPosition) {
  // 向量
  var l = {
    x: endPosition.x - startPosition.x,
    y: endPosition.y - startPosition.y,
    z: endPosition.z - startPosition.z
  }; // 单位向量

  var n = Math.sqrt(l.x * l.x + l.y * l.y + l.z * l.z);
  return {
    x: l.x / n,
    y: l.y / n,
    z: l.z / n
  };
};
/** 获取任意方向的直行坐标 */


exports.getUnitVectorPosition = getUnitVectorPosition;

var getStraightPosition = function getStraightPosition(startPosition, endPosition, length) {
  var m = getUnitVectorPosition(startPosition, endPosition); // 直行坐标

  return {
    x: m.x * length + endPosition.x,
    y: m.y * length + endPosition.y,
    z: m.z * length + endPosition.z
  };
};
/** 获取当前节点的位置 */


exports.getStraightPosition = getStraightPosition;

var getNodePosition = function getNodePosition(props) {
  var level = props.level,
      index = props.index,
      startPosition = props.startPosition,
      endPosition = props.endPosition,
      branchLength = props.branchLength,
      nodeNum = props.nodeNum; // 分支越多角度越大

  var rate = nodeNum * 10 - 10;

  if (rate > 90) {
    rate = 90;
  }

  if (rate < 15) {
    rate = 15;
  }

  if (nodeNum === 1) {
    rate = 0;
  }

  return getOffsetPosition({
    startPosition: level === 2 ? startPosition : endPosition,
    length: branchLength,
    rate: rate,
    maxNumber: nodeNum,
    index: index
  });
};
/** 更改对象中心点 */


exports.getNodePosition = getNodePosition;

var changeCenterPoint = function changeCenterPoint(x, y, z, obj) {
  var wrapper = new THREE.Object3D();
  wrapper.position.set(x, y, z);
  wrapper.add(obj);
  obj.position.set(-x, -y, -z);
  return wrapper;
};
/** 从webgl坐标反向映射出屏幕坐标 */


exports.changeCenterPoint = changeCenterPoint;

var toWindowPosition = function toWindowPosition(props) {
  var obj = props.obj,
      camera = props.camera,
      domInfo = props.domInfo;
  var position = obj.position;
  var mesh = new THREE.Mesh();
  var vector = mesh.localToWorld(new THREE.Vector3(position.x, position.y, position.z)).project(camera);
  var widthHalf = domInfo.width / 2;
  var heightHalf = domInfo.height / 2;
  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;
  return {
    x: vector.x + domInfo.x,
    y: vector.y + domInfo.y
  };
};

exports.toWindowPosition = toWindowPosition;
//# sourceMappingURL=position.js.map
