import * as THREE from 'three';
export var initialCube = {
  size: {
    x: 10,
    y: 10,
    z: 10
  }
};
export var initialColor = Math.random() * 0xffffff;
/** 创建立方体 */

export var createCube = function createCube() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialCube,
      size = _ref.size,
      color = _ref.color;

  var x = size.x,
      y = size.y,
      z = size.z;
  var geometry = new THREE.BoxBufferGeometry(x, y, z);
  var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    color: color || initialColor
  }));
  mesh.position.set(0, 0, 0);
  return mesh;
};
/** 创建连线 */

export var createLink = function createLink(props) {
  var startPosition = props.startPosition,
      endPosition = props.endPosition,
      _props$color = props.color,
      color = _props$color === void 0 ? initialColor : _props$color,
      _props$linewidth = props.linewidth,
      linewidth = _props$linewidth === void 0 ? 1 : _props$linewidth;
  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: linewidth
  }); // 线的材质可以由2点的颜色决定

  geometry.vertices.push(new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z));
  geometry.vertices.push(new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z));
  var line = new THREE.Line(geometry, material);
  return line;
};
/** 创建锥体 */

export var createCylinder = function createCylinder(props) {
  var radiusTop = props.radiusTop,
      radiusBottom = props.radiusBottom,
      height = props.height,
      radialSegments = props.radialSegments,
      _props$color2 = props.color,
      color = _props$color2 === void 0 ? initialColor : _props$color2,
      basePosition = props.basePosition;
  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  var material = new THREE.MeshLambertMaterial({
    color: color
  });
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(basePosition.x, height / 2, basePosition.z);
  return cylinder;
};
var loader = new THREE.TextureLoader();
var groundTexture = loader.load(require('../assets/tree.jpg'));
export var createCylinderMesh = function createCylinderMesh(props) {
  var startPosition = props.startPosition,
      endPosition = props.endPosition,
      _props$startWidth = props.startWidth,
      startWidth = _props$startWidth === void 0 ? 0.2 : _props$startWidth,
      _props$endWidth = props.endWidth,
      endWidth = _props$endWidth === void 0 ? 0.6 : _props$endWidth;
  var vectorStartPoint = new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z);
  var vectorEndPoint = new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z);
  var direction = new THREE.Vector3().subVectors(vectorEndPoint, vectorStartPoint);
  var arrowDirection = direction.clone();
  var arrow = new THREE.ArrowHelper(arrowDirection.normalize(), vectorStartPoint);
  var edgeGeometry = new THREE.CylinderGeometry(startWidth, endWidth, direction.length(), 6, 4); // 添加树的纹理

  var groundMaterial = new THREE.MeshLambertMaterial({
    map: groundTexture
  });
  var edge = new THREE.Mesh(edgeGeometry, groundMaterial);
  edge.rotation.copy(arrow.rotation);
  var position = new THREE.Vector3().addVectors(vectorStartPoint, direction.multiplyScalar(0.5));
  edge.position.set(position.x, position.y, position.z);
  return edge;
};
export var createTube = function createTube(props) {
  var startPosition = props.startPosition,
      endPosition = props.endPosition,
      _props$segments = props.segments,
      segments = _props$segments === void 0 ? 20 : _props$segments,
      radius = props.radius,
      _props$radiusSegments = props.radiusSegments,
      radiusSegments = _props$radiusSegments === void 0 ? 10 : _props$radiusSegments,
      _props$closed = props.closed,
      closed = _props$closed === void 0 ? false : _props$closed;
  var startPoint = new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z);
  var endPoint = new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z); // 创建中心偏移节点 生成曲线

  var centerPoint = new THREE.Vector3(startPosition.x + (endPosition.x - startPosition.x) / 2 + 0.5, startPosition.y + (endPosition.y - startPosition.y) / 2 - 0.3, startPosition.z + (endPosition.z - startPosition.z) / 2 + 0.5);
  var geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([startPoint, centerPoint, endPoint]), segments, radius, radiusSegments, closed); // 添加树的纹理

  var groundMaterial = new THREE.MeshLambertMaterial({
    map: groundTexture
  });
  var mesh = new THREE.Mesh(geometry, groundMaterial);
  return mesh;
};
var font = null;
var fontLoader = new THREE.FontLoader();
export var initFont = function initFont(callBack) {
  if (font) {
    callBack(font);
  } else {
    // const font = fontLoader.parse(require('../assets/gl/font/PingFang_SC_Regular.json'));
    // callBack(font);
    fontLoader.load('https://raw.githubusercontent.com/aisriver/gl-datatree/master/src/assets/gl/font/PingFang_SC_Regular.json', function (response) {
      font = response;
      callBack(font);
    });
  }
};
export var createFont = function createFont(option, callBack) {
  var text = option.text,
      _option$size = option.size,
      size = _option$size === void 0 ? 3 : _option$size,
      _option$height = option.height,
      height = _option$height === void 0 ? 0.1 : _option$height,
      _option$color = option.color,
      color = _option$color === void 0 ? 0xff0000 : _option$color;
  initFont(function (font) {
    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: size,
      height: height,
      curveSegments: 6,
      bevelThickness: 1,
      bevelSize: 1,
      bevelEnabled: false
    });
    var textMaterial = new THREE.MeshPhongMaterial({
      color: color,
      specular: 0xffffff
    });
    var mesh = new THREE.Mesh(geometry, textMaterial);

    if (callBack && typeof callBack === 'function') {
      callBack(mesh);
    }
  });
};
//# sourceMappingURL=create.js.map
