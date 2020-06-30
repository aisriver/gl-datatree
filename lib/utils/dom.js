"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDomInfo = void 0;

/** 获取载体相对与窗口的坐标 宽高等信息 */
var getDomInfo = function getDomInfo(dom) {
  if (!dom) {
    return {};
  }

  function getScrollTop(obj) {
    var tmp = obj.scrollTop;
    var val = obj.parentElement;

    while (val !== null) {
      tmp += val.scrollTop;
      val = val.parentElement;
    }

    return tmp;
  }

  function getScrollLeft(obj) {
    var tmp = obj.scrollLeft;
    var val = obj.parentElement;

    while (val !== null) {
      tmp += val.scrollLeft;
      val = val.parentElement;
    }

    return tmp;
  }

  var domInfo = {
    x: dom.offsetLeft - getScrollLeft(dom),
    y: dom.offsetTop - getScrollTop(dom),
    width: dom.clientWidth,
    height: dom.clientHeight
  };
  return domInfo;
};

exports.getDomInfo = getDomInfo;
//# sourceMappingURL=dom.js.map
