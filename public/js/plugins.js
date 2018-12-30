'use strict';
function _typeof(a) {
  return (
    (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function(a) {
            return typeof a;
          }
        : function(a) {
            return a &&
              'function' == typeof Symbol &&
              a.constructor === Symbol &&
              a !== Symbol.prototype
              ? 'symbol'
              : typeof a;
          }),
    _typeof(a)
  );
}
function _classCallCheck(a, b) {
  if (!(a instanceof b))
    throw new TypeError('Cannot call a class as a function');
}
function _defineProperties(a, b) {
  for (var c, d = 0; d < b.length; d++)
    (c = b[d]),
      (c.enumerable = c.enumerable || !1),
      (c.configurable = !0),
      'value' in c && (c.writable = !0),
      Object.defineProperty(a, c.key, c);
}
function _createClass(a, b, c) {
  return (
    b && _defineProperties(a.prototype, b), c && _defineProperties(a, c), a
  );
}
var FlipDown = (function() {
  var b = Math.floor;
  function a(b) {
    var c =
        1 < arguments.length && void 0 !== arguments[1]
          ? arguments[1]
          : 'flipdown',
      d = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
    if ((_classCallCheck(this, a), 'number' != typeof b))
      throw new Error(
        'FlipDown: Constructor expected unix timestamp, got '.concat(
          _typeof(b),
          ' instead.'
        )
      );
    'object' === _typeof(c) && ((d = c), (c = 'flipdown')),
      (this.version = '0.2.0'),
      (this.initialised = !1),
      (this.now = this._getTime()),
      (this.epoch = b),
      (this.countdownEnded = !1),
      (this.hasEndedCallback = null),
      (this.element = document.getElementById(c)),
      (this.rotors = []),
      (this.rotorLeafFront = []),
      (this.rotorLeafRear = []),
      (this.rotorTops = []),
      (this.rotorBottoms = []),
      (this.countdown = null),
      (this.daysRemaining = 0),
      (this.clockValues = {}),
      (this.clockStrings = {}),
      (this.clockValuesAsString = []),
      (this.prevClockValuesAsString = []),
      (this.opts = this._parseOptions(d)),
      this._setOptions(),
      console.log(
        'FlipDown '
          .concat(this.version, ' (Theme: ')
          .concat(this.opts.theme, ')')
      );
  }
  return (
    _createClass(a, [
      {
        key: 'start',
        value: function a() {
          return (
            this.initialised || this._init(),
            (this.countdown = setInterval(this._tick.bind(this), 1e3)),
            this
          );
        }
      },
      {
        key: 'ifEnded',
        value: function b(a) {
          return (
            (this.hasEndedCallback = function() {
              a(), (this.hasEndedCallback = null);
            }),
            this
          );
        }
      },
      {
        key: '_getTime',
        value: function a() {
          return new Date().getTime() / 1e3;
        }
      },
      {
        key: '_hasCountdownEnded',
        value: function a() {
          return 0 > this.epoch - this.now
            ? ((this.countdownEnded = !0),
              null != this.hasEndedCallback &&
                (this.hasEndedCallback(), (this.hasEndedCallback = null)),
              !0)
            : ((this.countdownEnded = !1), !1);
        }
      },
      {
        key: '_parseOptions',
        value: function b(a) {
          return { theme: a.hasOwnProperty('theme') ? a.theme : 'dark' };
        }
      },
      {
        key: '_setOptions',
        value: function a() {
          this.element.classList.add(
            'flipdown__theme-'.concat(this.opts.theme)
          );
        }
      },
      {
        key: '_init',
        value: function h() {
          (this.initialised = !0),
            (this.daysremaining = this._hasCountdownEnded()
              ? 0
              : b((this.epoch - this.now) / 86400).toString().length);
          for (
            var a = 2 >= this.daysremaining ? 2 : this.daysremaining, c = 0;
            c < a + 6;
            c++
          )
            this.rotors.push(this._createRotor(0));
          for (var d = [], c = 0; c < a; c++) d.push(this.rotors[c]);
          this.element.appendChild(this._createRotorGroup(d));
          for (var e, f = a, c = 0; 3 > c; c++) {
            e = [];
            for (var g = 0; 2 > g; g++) e.push(this.rotors[f]), f++;
            this.element.appendChild(this._createRotorGroup(e));
          }
          return (
            (this.rotorLeafFront = Array.from(
              this.element.getElementsByClassName('rotor-leaf-front')
            )),
            (this.rotorLeafRear = Array.from(
              this.element.getElementsByClassName('rotor-leaf-rear')
            )),
            (this.rotorTop = Array.from(
              this.element.getElementsByClassName('rotor-top')
            )),
            (this.rotorBottom = Array.from(
              this.element.getElementsByClassName('rotor-bottom')
            )),
            this._tick(),
            this._updateClockValues(!0),
            this
          );
        }
      },
      {
        key: '_createRotorGroup',
        value: function d(a) {
          var b = document.createElement('div');
          b.className = 'rotor-group';
          var c = document.createElement('div');
          return (
            (c.className = 'rotor-group-heading'),
            b.appendChild(c),
            appendChildren(b, a),
            b
          );
        }
      },
      {
        key: '_createRotor',
        value: function h() {
          var a =
              0 < arguments.length && void 0 !== arguments[0]
                ? arguments[0]
                : 0,
            b = document.createElement('div'),
            c = document.createElement('div'),
            d = document.createElement('figure'),
            e = document.createElement('figure'),
            f = document.createElement('div'),
            g = document.createElement('div');
          return (
            (b.className = 'rotor'),
            (c.className = 'rotor-leaf'),
            (d.className = 'rotor-leaf-rear'),
            (e.className = 'rotor-leaf-front'),
            (f.className = 'rotor-top'),
            (g.className = 'rotor-bottom'),
            (d.textContent = a),
            (f.textContent = a),
            (g.textContent = a),
            appendChildren(b, [c, f, g]),
            appendChildren(c, [d, e]),
            b
          );
        }
      },
      {
        key: '_tick',
        value: function c() {
          this.now = this._getTime();
          var a = 0 >= this.epoch - this.now ? 0 : this.epoch - this.now;
          (this.clockValues.d = b(a / 86400)),
            (a -= 86400 * this.clockValues.d),
            (this.clockValues.h = b(a / 3600)),
            (a -= 3600 * this.clockValues.h),
            (this.clockValues.m = b(a / 60)),
            (a -= 60 * this.clockValues.m),
            (this.clockValues.s = b(a)),
            this._updateClockValues(),
            this._hasCountdownEnded();
        }
      },
      {
        key: '_updateClockValues',
        value: function e() {
          function a() {
            var a = this;
            this.rotorTop.forEach(function(b, c) {
              b.textContent != a.clockValuesAsString[c] &&
                (b.textContent = a.clockValuesAsString[c]);
            });
          }
          function b() {
            var a = this;
            this.rotorLeafRear.forEach(function(b, c) {
              if (b.textContent != a.clockValuesAsString[c]) {
                (b.textContent = a.clockValuesAsString[c]),
                  b.parentElement.classList.add('flipped');
                var d = setInterval(
                  function() {
                    b.parentElement.classList.remove('flipped'),
                      clearInterval(d);
                  }.bind(a),
                  500
                );
              }
            });
          }
          var c = this,
            d =
              !!(0 < arguments.length && void 0 !== arguments[0]) &&
              arguments[0];
          (this.clockStrings.d = pad(this.clockValues.d, 2)),
            (this.clockStrings.h = pad(this.clockValues.h, 2)),
            (this.clockStrings.m = pad(this.clockValues.m, 2)),
            (this.clockStrings.s = pad(this.clockValues.s, 2)),
            (this.clockValuesAsString = (
              this.clockStrings.d +
              this.clockStrings.h +
              this.clockStrings.m +
              this.clockStrings.s
            ).split('')),
            this.rotorLeafFront.forEach(function(a, b) {
              a.textContent = c.prevClockValuesAsString[b];
            }),
            this.rotorBottom.forEach(function(a, b) {
              a.textContent = c.prevClockValuesAsString[b];
            }),
            d
              ? (a.call(this), b.call(this))
              : (setTimeout(a.bind(this), 500), setTimeout(b.bind(this), 500)),
            (this.prevClockValuesAsString = this.clockValuesAsString);
        }
      }
    ]),
    a
  );
})();
function pad(a, b) {
  return (a = a.toString()), a.length < b ? pad('0' + a, b) : a;
}
function appendChildren(a, b) {
  b.forEach(function(b) {
    a.appendChild(b);
  });
}
