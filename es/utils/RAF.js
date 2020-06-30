function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import 'core-js'; // 解决Symbol报错的问题

var RAF = /*#__PURE__*/function () {
  function RAF() {
    _classCallCheck(this, RAF);

    this._timerIdMap = {
      timeout: {},
      interval: {}
    };
  }

  _createClass(RAF, [{
    key: "run",
    value: function run() {
      var _this = this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'interval';
      var cb = arguments.length > 1 ? arguments[1] : undefined;
      var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16.7;
      var now = Date.now;
      var startTime = now();
      var endTime = startTime;
      var timerSymbol = Symbol();

      var loop = function loop() {
        _this.setIdMap(timerSymbol, type, loop);

        endTime = now();

        if (endTime - startTime >= interval) {
          if (type === 'interval') {
            startTime = now();
            endTime = startTime;
          }

          cb();
          type === 'timeout' && _this.clearTimeout(timerSymbol);
        }
      };

      this.setIdMap(timerSymbol, type, loop);
      return timerSymbol;
    }
  }, {
    key: "setIdMap",
    value: function setIdMap(timerSymbol, type, loop) {
      var id = requestAnimationFrame(loop);
      this._timerIdMap[type][timerSymbol] = id;
    }
  }, {
    key: "setTimeout",
    value: function setTimeout(cb, interval) {
      return this.run('timeout', cb, interval);
    }
  }, {
    key: "clearTimeout",
    value: function clearTimeout(timer) {
      cancelAnimationFrame(this._timerIdMap.timeout[timer]);
    }
  }, {
    key: "setInterval",
    value: function setInterval(cb, interval) {
      return this.run('interval', cb, interval);
    }
  }, {
    key: "clearInterval",
    value: function clearInterval(timer) {
      cancelAnimationFrame(this._timerIdMap.interval[timer]);
    }
  }]);

  return RAF;
}();

export { RAF as default };
//# sourceMappingURL=RAF.js.map
