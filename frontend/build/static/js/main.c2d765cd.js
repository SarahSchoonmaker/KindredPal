/*! For license information please see main.c2d765cd.js.LICENSE.txt */
(() => {
  "use strict";
  var e = {
      43(e, t, n) {
        e.exports = n(202);
      },
      153(e, t, n) {
        var r = n(43),
          a = Symbol.for("react.element"),
          i = Symbol.for("react.fragment"),
          o = Object.prototype.hasOwnProperty,
          s =
            r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
              .ReactCurrentOwner,
          l = { key: !0, ref: !0, __self: !0, __source: !0 };
        function c(e, t, n) {
          var r,
            i = {},
            c = null,
            u = null;
          for (r in (void 0 !== n && (c = "" + n),
          void 0 !== t.key && (c = "" + t.key),
          void 0 !== t.ref && (u = t.ref),
          t))
            o.call(t, r) && !l.hasOwnProperty(r) && (i[r] = t[r]);
          if (e && e.defaultProps)
            for (r in (t = e.defaultProps)) void 0 === i[r] && (i[r] = t[r]);
          return {
            $$typeof: a,
            type: e,
            key: c,
            ref: u,
            props: i,
            _owner: s.current,
          };
        }
        ((t.Fragment = i), (t.jsx = c), (t.jsxs = c));
      },
      202(e, t) {
        var n = Symbol.for("react.element"),
          r = Symbol.for("react.portal"),
          a = Symbol.for("react.fragment"),
          i = Symbol.for("react.strict_mode"),
          o = Symbol.for("react.profiler"),
          s = Symbol.for("react.provider"),
          l = Symbol.for("react.context"),
          c = Symbol.for("react.forward_ref"),
          u = Symbol.for("react.suspense"),
          d = Symbol.for("react.memo"),
          f = Symbol.for("react.lazy"),
          h = Symbol.iterator;
        var p = {
            isMounted: function () {
              return !1;
            },
            enqueueForceUpdate: function () {},
            enqueueReplaceState: function () {},
            enqueueSetState: function () {},
          },
          m = Object.assign,
          g = {};
        function y(e, t, n) {
          ((this.props = e),
            (this.context = t),
            (this.refs = g),
            (this.updater = n || p));
        }
        function v() {}
        function b(e, t, n) {
          ((this.props = e),
            (this.context = t),
            (this.refs = g),
            (this.updater = n || p));
        }
        ((y.prototype.isReactComponent = {}),
          (y.prototype.setState = function (e, t) {
            if ("object" !== typeof e && "function" !== typeof e && null != e)
              throw Error(
                "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
              );
            this.updater.enqueueSetState(this, e, t, "setState");
          }),
          (y.prototype.forceUpdate = function (e) {
            this.updater.enqueueForceUpdate(this, e, "forceUpdate");
          }),
          (v.prototype = y.prototype));
        var x = (b.prototype = new v());
        ((x.constructor = b), m(x, y.prototype), (x.isPureReactComponent = !0));
        var w = Array.isArray,
          k = Object.prototype.hasOwnProperty,
          S = { current: null },
          j = { key: !0, ref: !0, __self: !0, __source: !0 };
        function N(e, t, r) {
          var a,
            i = {},
            o = null,
            s = null;
          if (null != t)
            for (a in (void 0 !== t.ref && (s = t.ref),
            void 0 !== t.key && (o = "" + t.key),
            t))
              k.call(t, a) && !j.hasOwnProperty(a) && (i[a] = t[a]);
          var l = arguments.length - 2;
          if (1 === l) i.children = r;
          else if (1 < l) {
            for (var c = Array(l), u = 0; u < l; u++) c[u] = arguments[u + 2];
            i.children = c;
          }
          if (e && e.defaultProps)
            for (a in (l = e.defaultProps)) void 0 === i[a] && (i[a] = l[a]);
          return {
            $$typeof: n,
            type: e,
            key: o,
            ref: s,
            props: i,
            _owner: S.current,
          };
        }
        function E(e) {
          return "object" === typeof e && null !== e && e.$$typeof === n;
        }
        var _ = /\/+/g;
        function C(e, t) {
          return "object" === typeof e && null !== e && null != e.key
            ? (function (e) {
                var t = { "=": "=0", ":": "=2" };
                return (
                  "$" +
                  e.replace(/[=:]/g, function (e) {
                    return t[e];
                  })
                );
              })("" + e.key)
            : t.toString(36);
        }
        function P(e, t, a, i, o) {
          var s = typeof e;
          ("undefined" !== s && "boolean" !== s) || (e = null);
          var l = !1;
          if (null === e) l = !0;
          else
            switch (s) {
              case "string":
              case "number":
                l = !0;
                break;
              case "object":
                switch (e.$$typeof) {
                  case n:
                  case r:
                    l = !0;
                }
            }
          if (l)
            return (
              (o = o((l = e))),
              (e = "" === i ? "." + C(l, 0) : i),
              w(o)
                ? ((a = ""),
                  null != e && (a = e.replace(_, "$&/") + "/"),
                  P(o, t, a, "", function (e) {
                    return e;
                  }))
                : null != o &&
                  (E(o) &&
                    (o = (function (e, t) {
                      return {
                        $$typeof: n,
                        type: e.type,
                        key: t,
                        ref: e.ref,
                        props: e.props,
                        _owner: e._owner,
                      };
                    })(
                      o,
                      a +
                        (!o.key || (l && l.key === o.key)
                          ? ""
                          : ("" + o.key).replace(_, "$&/") + "/") +
                        e,
                    )),
                  t.push(o)),
              1
            );
          if (((l = 0), (i = "" === i ? "." : i + ":"), w(e)))
            for (var c = 0; c < e.length; c++) {
              var u = i + C((s = e[c]), c);
              l += P(s, t, a, u, o);
            }
          else if (
            ((u = (function (e) {
              return null === e || "object" !== typeof e
                ? null
                : "function" === typeof (e = (h && e[h]) || e["@@iterator"])
                  ? e
                  : null;
            })(e)),
            "function" === typeof u)
          )
            for (e = u.call(e), c = 0; !(s = e.next()).done; )
              l += P((s = s.value), t, a, (u = i + C(s, c++)), o);
          else if ("object" === s)
            throw (
              (t = String(e)),
              Error(
                "Objects are not valid as a React child (found: " +
                  ("[object Object]" === t
                    ? "object with keys {" + Object.keys(e).join(", ") + "}"
                    : t) +
                  "). If you meant to render a collection of children, use an array instead.",
              )
            );
          return l;
        }
        function O(e, t, n) {
          if (null == e) return e;
          var r = [],
            a = 0;
          return (
            P(e, r, "", "", function (e) {
              return t.call(n, e, a++);
            }),
            r
          );
        }
        function R(e) {
          if (-1 === e._status) {
            var t = e._result;
            ((t = t()).then(
              function (t) {
                (0 !== e._status && -1 !== e._status) ||
                  ((e._status = 1), (e._result = t));
              },
              function (t) {
                (0 !== e._status && -1 !== e._status) ||
                  ((e._status = 2), (e._result = t));
              },
            ),
              -1 === e._status && ((e._status = 0), (e._result = t)));
          }
          if (1 === e._status) return e._result.default;
          throw e._result;
        }
        var T = { current: null },
          L = { transition: null },
          A = {
            ReactCurrentDispatcher: T,
            ReactCurrentBatchConfig: L,
            ReactCurrentOwner: S,
          };
        function z() {
          throw Error(
            "act(...) is not supported in production builds of React.",
          );
        }
        ((t.Children = {
          map: O,
          forEach: function (e, t, n) {
            O(
              e,
              function () {
                t.apply(this, arguments);
              },
              n,
            );
          },
          count: function (e) {
            var t = 0;
            return (
              O(e, function () {
                t++;
              }),
              t
            );
          },
          toArray: function (e) {
            return (
              O(e, function (e) {
                return e;
              }) || []
            );
          },
          only: function (e) {
            if (!E(e))
              throw Error(
                "React.Children.only expected to receive a single React element child.",
              );
            return e;
          },
        }),
          (t.Component = y),
          (t.Fragment = a),
          (t.Profiler = o),
          (t.PureComponent = b),
          (t.StrictMode = i),
          (t.Suspense = u),
          (t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = A),
          (t.act = z),
          (t.cloneElement = function (e, t, r) {
            if (null === e || void 0 === e)
              throw Error(
                "React.cloneElement(...): The argument must be a React element, but you passed " +
                  e +
                  ".",
              );
            var a = m({}, e.props),
              i = e.key,
              o = e.ref,
              s = e._owner;
            if (null != t) {
              if (
                (void 0 !== t.ref && ((o = t.ref), (s = S.current)),
                void 0 !== t.key && (i = "" + t.key),
                e.type && e.type.defaultProps)
              )
                var l = e.type.defaultProps;
              for (c in t)
                k.call(t, c) &&
                  !j.hasOwnProperty(c) &&
                  (a[c] = void 0 === t[c] && void 0 !== l ? l[c] : t[c]);
            }
            var c = arguments.length - 2;
            if (1 === c) a.children = r;
            else if (1 < c) {
              l = Array(c);
              for (var u = 0; u < c; u++) l[u] = arguments[u + 2];
              a.children = l;
            }
            return {
              $$typeof: n,
              type: e.type,
              key: i,
              ref: o,
              props: a,
              _owner: s,
            };
          }),
          (t.createContext = function (e) {
            return (
              ((e = {
                $$typeof: l,
                _currentValue: e,
                _currentValue2: e,
                _threadCount: 0,
                Provider: null,
                Consumer: null,
                _defaultValue: null,
                _globalName: null,
              }).Provider = { $$typeof: s, _context: e }),
              (e.Consumer = e)
            );
          }),
          (t.createElement = N),
          (t.createFactory = function (e) {
            var t = N.bind(null, e);
            return ((t.type = e), t);
          }),
          (t.createRef = function () {
            return { current: null };
          }),
          (t.forwardRef = function (e) {
            return { $$typeof: c, render: e };
          }),
          (t.isValidElement = E),
          (t.lazy = function (e) {
            return {
              $$typeof: f,
              _payload: { _status: -1, _result: e },
              _init: R,
            };
          }),
          (t.memo = function (e, t) {
            return { $$typeof: d, type: e, compare: void 0 === t ? null : t };
          }),
          (t.startTransition = function (e) {
            var t = L.transition;
            L.transition = {};
            try {
              e();
            } finally {
              L.transition = t;
            }
          }),
          (t.unstable_act = z),
          (t.useCallback = function (e, t) {
            return T.current.useCallback(e, t);
          }),
          (t.useContext = function (e) {
            return T.current.useContext(e);
          }),
          (t.useDebugValue = function () {}),
          (t.useDeferredValue = function (e) {
            return T.current.useDeferredValue(e);
          }),
          (t.useEffect = function (e, t) {
            return T.current.useEffect(e, t);
          }),
          (t.useId = function () {
            return T.current.useId();
          }),
          (t.useImperativeHandle = function (e, t, n) {
            return T.current.useImperativeHandle(e, t, n);
          }),
          (t.useInsertionEffect = function (e, t) {
            return T.current.useInsertionEffect(e, t);
          }),
          (t.useLayoutEffect = function (e, t) {
            return T.current.useLayoutEffect(e, t);
          }),
          (t.useMemo = function (e, t) {
            return T.current.useMemo(e, t);
          }),
          (t.useReducer = function (e, t, n) {
            return T.current.useReducer(e, t, n);
          }),
          (t.useRef = function (e) {
            return T.current.useRef(e);
          }),
          (t.useState = function (e) {
            return T.current.useState(e);
          }),
          (t.useSyncExternalStore = function (e, t, n) {
            return T.current.useSyncExternalStore(e, t, n);
          }),
          (t.useTransition = function () {
            return T.current.useTransition();
          }),
          (t.version = "18.3.1"));
      },
      234(e, t) {
        function n(e, t) {
          var n = e.length;
          e.push(t);
          e: for (; 0 < n; ) {
            var r = (n - 1) >>> 1,
              a = e[r];
            if (!(0 < i(a, t))) break e;
            ((e[r] = t), (e[n] = a), (n = r));
          }
        }
        function r(e) {
          return 0 === e.length ? null : e[0];
        }
        function a(e) {
          if (0 === e.length) return null;
          var t = e[0],
            n = e.pop();
          if (n !== t) {
            e[0] = n;
            e: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
              var s = 2 * (r + 1) - 1,
                l = e[s],
                c = s + 1,
                u = e[c];
              if (0 > i(l, n))
                c < a && 0 > i(u, l)
                  ? ((e[r] = u), (e[c] = n), (r = c))
                  : ((e[r] = l), (e[s] = n), (r = s));
              else {
                if (!(c < a && 0 > i(u, n))) break e;
                ((e[r] = u), (e[c] = n), (r = c));
              }
            }
          }
          return t;
        }
        function i(e, t) {
          var n = e.sortIndex - t.sortIndex;
          return 0 !== n ? n : e.id - t.id;
        }
        if (
          "object" === typeof performance &&
          "function" === typeof performance.now
        ) {
          var o = performance;
          t.unstable_now = function () {
            return o.now();
          };
        } else {
          var s = Date,
            l = s.now();
          t.unstable_now = function () {
            return s.now() - l;
          };
        }
        var c = [],
          u = [],
          d = 1,
          f = null,
          h = 3,
          p = !1,
          m = !1,
          g = !1,
          y = "function" === typeof setTimeout ? setTimeout : null,
          v = "function" === typeof clearTimeout ? clearTimeout : null,
          b = "undefined" !== typeof setImmediate ? setImmediate : null;
        function x(e) {
          for (var t = r(u); null !== t; ) {
            if (null === t.callback) a(u);
            else {
              if (!(t.startTime <= e)) break;
              (a(u), (t.sortIndex = t.expirationTime), n(c, t));
            }
            t = r(u);
          }
        }
        function w(e) {
          if (((g = !1), x(e), !m))
            if (null !== r(c)) ((m = !0), L(k));
            else {
              var t = r(u);
              null !== t && A(w, t.startTime - e);
            }
        }
        function k(e, n) {
          ((m = !1), g && ((g = !1), v(E), (E = -1)), (p = !0));
          var i = h;
          try {
            for (
              x(n), f = r(c);
              null !== f && (!(f.expirationTime > n) || (e && !P()));
            ) {
              var o = f.callback;
              if ("function" === typeof o) {
                ((f.callback = null), (h = f.priorityLevel));
                var s = o(f.expirationTime <= n);
                ((n = t.unstable_now()),
                  "function" === typeof s
                    ? (f.callback = s)
                    : f === r(c) && a(c),
                  x(n));
              } else a(c);
              f = r(c);
            }
            if (null !== f) var l = !0;
            else {
              var d = r(u);
              (null !== d && A(w, d.startTime - n), (l = !1));
            }
            return l;
          } finally {
            ((f = null), (h = i), (p = !1));
          }
        }
        "undefined" !== typeof navigator &&
          void 0 !== navigator.scheduling &&
          void 0 !== navigator.scheduling.isInputPending &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        var S,
          j = !1,
          N = null,
          E = -1,
          _ = 5,
          C = -1;
        function P() {
          return !(t.unstable_now() - C < _);
        }
        function O() {
          if (null !== N) {
            var e = t.unstable_now();
            C = e;
            var n = !0;
            try {
              n = N(!0, e);
            } finally {
              n ? S() : ((j = !1), (N = null));
            }
          } else j = !1;
        }
        if ("function" === typeof b)
          S = function () {
            b(O);
          };
        else if ("undefined" !== typeof MessageChannel) {
          var R = new MessageChannel(),
            T = R.port2;
          ((R.port1.onmessage = O),
            (S = function () {
              T.postMessage(null);
            }));
        } else
          S = function () {
            y(O, 0);
          };
        function L(e) {
          ((N = e), j || ((j = !0), S()));
        }
        function A(e, n) {
          E = y(function () {
            e(t.unstable_now());
          }, n);
        }
        ((t.unstable_IdlePriority = 5),
          (t.unstable_ImmediatePriority = 1),
          (t.unstable_LowPriority = 4),
          (t.unstable_NormalPriority = 3),
          (t.unstable_Profiling = null),
          (t.unstable_UserBlockingPriority = 2),
          (t.unstable_cancelCallback = function (e) {
            e.callback = null;
          }),
          (t.unstable_continueExecution = function () {
            m || p || ((m = !0), L(k));
          }),
          (t.unstable_forceFrameRate = function (e) {
            0 > e || 125 < e
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (_ = 0 < e ? Math.floor(1e3 / e) : 5);
          }),
          (t.unstable_getCurrentPriorityLevel = function () {
            return h;
          }),
          (t.unstable_getFirstCallbackNode = function () {
            return r(c);
          }),
          (t.unstable_next = function (e) {
            switch (h) {
              case 1:
              case 2:
              case 3:
                var t = 3;
                break;
              default:
                t = h;
            }
            var n = h;
            h = t;
            try {
              return e();
            } finally {
              h = n;
            }
          }),
          (t.unstable_pauseExecution = function () {}),
          (t.unstable_requestPaint = function () {}),
          (t.unstable_runWithPriority = function (e, t) {
            switch (e) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                e = 3;
            }
            var n = h;
            h = e;
            try {
              return t();
            } finally {
              h = n;
            }
          }),
          (t.unstable_scheduleCallback = function (e, a, i) {
            var o = t.unstable_now();
            switch (
              ("object" === typeof i && null !== i
                ? (i = "number" === typeof (i = i.delay) && 0 < i ? o + i : o)
                : (i = o),
              e)
            ) {
              case 1:
                var s = -1;
                break;
              case 2:
                s = 250;
                break;
              case 5:
                s = 1073741823;
                break;
              case 4:
                s = 1e4;
                break;
              default:
                s = 5e3;
            }
            return (
              (e = {
                id: d++,
                callback: a,
                priorityLevel: e,
                startTime: i,
                expirationTime: (s = i + s),
                sortIndex: -1,
              }),
              i > o
                ? ((e.sortIndex = i),
                  n(u, e),
                  null === r(c) &&
                    e === r(u) &&
                    (g ? (v(E), (E = -1)) : (g = !0), A(w, i - o)))
                : ((e.sortIndex = s), n(c, e), m || p || ((m = !0), L(k))),
              e
            );
          }),
          (t.unstable_shouldYield = P),
          (t.unstable_wrapCallback = function (e) {
            var t = h;
            return function () {
              var n = h;
              h = t;
              try {
                return e.apply(this, arguments);
              } finally {
                h = n;
              }
            };
          }));
      },
      391(e, t, n) {
        var r = n(950);
        ((t.createRoot = r.createRoot), (t.hydrateRoot = r.hydrateRoot));
      },
      579(e, t, n) {
        e.exports = n(153);
      },
      730(e, t, n) {
        var r = n(43),
          a = n(853);
        function i(e) {
          for (
            var t =
                "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
              n = 1;
            n < arguments.length;
            n++
          )
            t += "&args[]=" + encodeURIComponent(arguments[n]);
          return (
            "Minified React error #" +
            e +
            "; visit " +
            t +
            " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
          );
        }
        var o = new Set(),
          s = {};
        function l(e, t) {
          (c(e, t), c(e + "Capture", t));
        }
        function c(e, t) {
          for (s[e] = t, e = 0; e < t.length; e++) o.add(t[e]);
        }
        var u = !(
            "undefined" === typeof window ||
            "undefined" === typeof window.document ||
            "undefined" === typeof window.document.createElement
          ),
          d = Object.prototype.hasOwnProperty,
          f =
            /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
          h = {},
          p = {};
        function m(e, t, n, r, a, i, o) {
          ((this.acceptsBooleans = 2 === t || 3 === t || 4 === t),
            (this.attributeName = r),
            (this.attributeNamespace = a),
            (this.mustUseProperty = n),
            (this.propertyName = e),
            (this.type = t),
            (this.sanitizeURL = i),
            (this.removeEmptyString = o));
        }
        var g = {};
        ("children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
          .split(" ")
          .forEach(function (e) {
            g[e] = new m(e, 0, !1, e, null, !1, !1);
          }),
          [
            ["acceptCharset", "accept-charset"],
            ["className", "class"],
            ["htmlFor", "for"],
            ["httpEquiv", "http-equiv"],
          ].forEach(function (e) {
            var t = e[0];
            g[t] = new m(t, 1, !1, e[1], null, !1, !1);
          }),
          ["contentEditable", "draggable", "spellCheck", "value"].forEach(
            function (e) {
              g[e] = new m(e, 2, !1, e.toLowerCase(), null, !1, !1);
            },
          ),
          [
            "autoReverse",
            "externalResourcesRequired",
            "focusable",
            "preserveAlpha",
          ].forEach(function (e) {
            g[e] = new m(e, 2, !1, e, null, !1, !1);
          }),
          "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
            .split(" ")
            .forEach(function (e) {
              g[e] = new m(e, 3, !1, e.toLowerCase(), null, !1, !1);
            }),
          ["checked", "multiple", "muted", "selected"].forEach(function (e) {
            g[e] = new m(e, 3, !0, e, null, !1, !1);
          }),
          ["capture", "download"].forEach(function (e) {
            g[e] = new m(e, 4, !1, e, null, !1, !1);
          }),
          ["cols", "rows", "size", "span"].forEach(function (e) {
            g[e] = new m(e, 6, !1, e, null, !1, !1);
          }),
          ["rowSpan", "start"].forEach(function (e) {
            g[e] = new m(e, 5, !1, e.toLowerCase(), null, !1, !1);
          }));
        var y = /[\-:]([a-z])/g;
        function v(e) {
          return e[1].toUpperCase();
        }
        function b(e, t, n, r) {
          var a = g.hasOwnProperty(t) ? g[t] : null;
          (null !== a
            ? 0 !== a.type
            : r ||
              !(2 < t.length) ||
              ("o" !== t[0] && "O" !== t[0]) ||
              ("n" !== t[1] && "N" !== t[1])) &&
            ((function (e, t, n, r) {
              if (
                null === t ||
                "undefined" === typeof t ||
                (function (e, t, n, r) {
                  if (null !== n && 0 === n.type) return !1;
                  switch (typeof t) {
                    case "function":
                    case "symbol":
                      return !0;
                    case "boolean":
                      return (
                        !r &&
                        (null !== n
                          ? !n.acceptsBooleans
                          : "data-" !== (e = e.toLowerCase().slice(0, 5)) &&
                            "aria-" !== e)
                      );
                    default:
                      return !1;
                  }
                })(e, t, n, r)
              )
                return !0;
              if (r) return !1;
              if (null !== n)
                switch (n.type) {
                  case 3:
                    return !t;
                  case 4:
                    return !1 === t;
                  case 5:
                    return isNaN(t);
                  case 6:
                    return isNaN(t) || 1 > t;
                }
              return !1;
            })(t, n, a, r) && (n = null),
            r || null === a
              ? (function (e) {
                  return (
                    !!d.call(p, e) ||
                    (!d.call(h, e) &&
                      (f.test(e) ? (p[e] = !0) : ((h[e] = !0), !1)))
                  );
                })(t) &&
                (null === n ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
              : a.mustUseProperty
                ? (e[a.propertyName] = null === n ? 3 !== a.type && "" : n)
                : ((t = a.attributeName),
                  (r = a.attributeNamespace),
                  null === n
                    ? e.removeAttribute(t)
                    : ((n =
                        3 === (a = a.type) || (4 === a && !0 === n)
                          ? ""
                          : "" + n),
                      r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
        }
        ("accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
          .split(" ")
          .forEach(function (e) {
            var t = e.replace(y, v);
            g[t] = new m(t, 1, !1, e, null, !1, !1);
          }),
          "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
            .split(" ")
            .forEach(function (e) {
              var t = e.replace(y, v);
              g[t] = new m(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
            }),
          ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
            var t = e.replace(y, v);
            g[t] = new m(
              t,
              1,
              !1,
              e,
              "http://www.w3.org/XML/1998/namespace",
              !1,
              !1,
            );
          }),
          ["tabIndex", "crossOrigin"].forEach(function (e) {
            g[e] = new m(e, 1, !1, e.toLowerCase(), null, !1, !1);
          }),
          (g.xlinkHref = new m(
            "xlinkHref",
            1,
            !1,
            "xlink:href",
            "http://www.w3.org/1999/xlink",
            !0,
            !1,
          )),
          ["src", "href", "action", "formAction"].forEach(function (e) {
            g[e] = new m(e, 1, !1, e.toLowerCase(), null, !0, !0);
          }));
        var x = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
          w = Symbol.for("react.element"),
          k = Symbol.for("react.portal"),
          S = Symbol.for("react.fragment"),
          j = Symbol.for("react.strict_mode"),
          N = Symbol.for("react.profiler"),
          E = Symbol.for("react.provider"),
          _ = Symbol.for("react.context"),
          C = Symbol.for("react.forward_ref"),
          P = Symbol.for("react.suspense"),
          O = Symbol.for("react.suspense_list"),
          R = Symbol.for("react.memo"),
          T = Symbol.for("react.lazy");
        (Symbol.for("react.scope"), Symbol.for("react.debug_trace_mode"));
        var L = Symbol.for("react.offscreen");
        (Symbol.for("react.legacy_hidden"),
          Symbol.for("react.cache"),
          Symbol.for("react.tracing_marker"));
        var A = Symbol.iterator;
        function z(e) {
          return null === e || "object" !== typeof e
            ? null
            : "function" === typeof (e = (A && e[A]) || e["@@iterator"])
              ? e
              : null;
        }
        var F,
          M = Object.assign;
        function B(e) {
          if (void 0 === F)
            try {
              throw Error();
            } catch (n) {
              var t = n.stack.trim().match(/\n( *(at )?)/);
              F = (t && t[1]) || "";
            }
          return "\n" + F + e;
        }
        var D = !1;
        function U(e, t) {
          if (!e || D) return "";
          D = !0;
          var n = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          try {
            if (t)
              if (
                ((t = function () {
                  throw Error();
                }),
                Object.defineProperty(t.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                "object" === typeof Reflect && Reflect.construct)
              ) {
                try {
                  Reflect.construct(t, []);
                } catch (c) {
                  var r = c;
                }
                Reflect.construct(e, [], t);
              } else {
                try {
                  t.call();
                } catch (c) {
                  r = c;
                }
                e.call(t.prototype);
              }
            else {
              try {
                throw Error();
              } catch (c) {
                r = c;
              }
              e();
            }
          } catch (c) {
            if (c && r && "string" === typeof c.stack) {
              for (
                var a = c.stack.split("\n"),
                  i = r.stack.split("\n"),
                  o = a.length - 1,
                  s = i.length - 1;
                1 <= o && 0 <= s && a[o] !== i[s];
              )
                s--;
              for (; 1 <= o && 0 <= s; o--, s--)
                if (a[o] !== i[s]) {
                  if (1 !== o || 1 !== s)
                    do {
                      if ((o--, 0 > --s || a[o] !== i[s])) {
                        var l = "\n" + a[o].replace(" at new ", " at ");
                        return (
                          e.displayName &&
                            l.includes("<anonymous>") &&
                            (l = l.replace("<anonymous>", e.displayName)),
                          l
                        );
                      }
                    } while (1 <= o && 0 <= s);
                  break;
                }
            }
          } finally {
            ((D = !1), (Error.prepareStackTrace = n));
          }
          return (e = e ? e.displayName || e.name : "") ? B(e) : "";
        }
        function I(e) {
          switch (e.tag) {
            case 5:
              return B(e.type);
            case 16:
              return B("Lazy");
            case 13:
              return B("Suspense");
            case 19:
              return B("SuspenseList");
            case 0:
            case 2:
            case 15:
              return (e = U(e.type, !1));
            case 11:
              return (e = U(e.type.render, !1));
            case 1:
              return (e = U(e.type, !0));
            default:
              return "";
          }
        }
        function q(e) {
          if (null == e) return null;
          if ("function" === typeof e) return e.displayName || e.name || null;
          if ("string" === typeof e) return e;
          switch (e) {
            case S:
              return "Fragment";
            case k:
              return "Portal";
            case N:
              return "Profiler";
            case j:
              return "StrictMode";
            case P:
              return "Suspense";
            case O:
              return "SuspenseList";
          }
          if ("object" === typeof e)
            switch (e.$$typeof) {
              case _:
                return (e.displayName || "Context") + ".Consumer";
              case E:
                return (e._context.displayName || "Context") + ".Provider";
              case C:
                var t = e.render;
                return (
                  (e = e.displayName) ||
                    (e =
                      "" !== (e = t.displayName || t.name || "")
                        ? "ForwardRef(" + e + ")"
                        : "ForwardRef"),
                  e
                );
              case R:
                return null !== (t = e.displayName || null)
                  ? t
                  : q(e.type) || "Memo";
              case T:
                ((t = e._payload), (e = e._init));
                try {
                  return q(e(t));
                } catch (n) {}
            }
          return null;
        }
        function V(e) {
          var t = e.type;
          switch (e.tag) {
            case 24:
              return "Cache";
            case 9:
              return (t.displayName || "Context") + ".Consumer";
            case 10:
              return (t._context.displayName || "Context") + ".Provider";
            case 18:
              return "DehydratedFragment";
            case 11:
              return (
                (e = (e = t.render).displayName || e.name || ""),
                t.displayName ||
                  ("" !== e ? "ForwardRef(" + e + ")" : "ForwardRef")
              );
            case 7:
              return "Fragment";
            case 5:
              return t;
            case 4:
              return "Portal";
            case 3:
              return "Root";
            case 6:
              return "Text";
            case 16:
              return q(t);
            case 8:
              return t === j ? "StrictMode" : "Mode";
            case 22:
              return "Offscreen";
            case 12:
              return "Profiler";
            case 21:
              return "Scope";
            case 13:
              return "Suspense";
            case 19:
              return "SuspenseList";
            case 25:
              return "TracingMarker";
            case 1:
            case 0:
            case 17:
            case 2:
            case 14:
            case 15:
              if ("function" === typeof t)
                return t.displayName || t.name || null;
              if ("string" === typeof t) return t;
          }
          return null;
        }
        function H(e) {
          switch (typeof e) {
            case "boolean":
            case "number":
            case "string":
            case "undefined":
            case "object":
              return e;
            default:
              return "";
          }
        }
        function W(e) {
          var t = e.type;
          return (
            (e = e.nodeName) &&
            "input" === e.toLowerCase() &&
            ("checkbox" === t || "radio" === t)
          );
        }
        function $(e) {
          e._valueTracker ||
            (e._valueTracker = (function (e) {
              var t = W(e) ? "checked" : "value",
                n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
                r = "" + e[t];
              if (
                !e.hasOwnProperty(t) &&
                "undefined" !== typeof n &&
                "function" === typeof n.get &&
                "function" === typeof n.set
              ) {
                var a = n.get,
                  i = n.set;
                return (
                  Object.defineProperty(e, t, {
                    configurable: !0,
                    get: function () {
                      return a.call(this);
                    },
                    set: function (e) {
                      ((r = "" + e), i.call(this, e));
                    },
                  }),
                  Object.defineProperty(e, t, { enumerable: n.enumerable }),
                  {
                    getValue: function () {
                      return r;
                    },
                    setValue: function (e) {
                      r = "" + e;
                    },
                    stopTracking: function () {
                      ((e._valueTracker = null), delete e[t]);
                    },
                  }
                );
              }
            })(e));
        }
        function K(e) {
          if (!e) return !1;
          var t = e._valueTracker;
          if (!t) return !0;
          var n = t.getValue(),
            r = "";
          return (
            e && (r = W(e) ? (e.checked ? "true" : "false") : e.value),
            (e = r) !== n && (t.setValue(e), !0)
          );
        }
        function Q(e) {
          if (
            "undefined" ===
            typeof (e =
              e || ("undefined" !== typeof document ? document : void 0))
          )
            return null;
          try {
            return e.activeElement || e.body;
          } catch (t) {
            return e.body;
          }
        }
        function Y(e, t) {
          var n = t.checked;
          return M({}, t, {
            defaultChecked: void 0,
            defaultValue: void 0,
            value: void 0,
            checked: null != n ? n : e._wrapperState.initialChecked,
          });
        }
        function J(e, t) {
          var n = null == t.defaultValue ? "" : t.defaultValue,
            r = null != t.checked ? t.checked : t.defaultChecked;
          ((n = H(null != t.value ? t.value : n)),
            (e._wrapperState = {
              initialChecked: r,
              initialValue: n,
              controlled:
                "checkbox" === t.type || "radio" === t.type
                  ? null != t.checked
                  : null != t.value,
            }));
        }
        function X(e, t) {
          null != (t = t.checked) && b(e, "checked", t, !1);
        }
        function G(e, t) {
          X(e, t);
          var n = H(t.value),
            r = t.type;
          if (null != n)
            "number" === r
              ? ((0 === n && "" === e.value) || e.value != n) &&
                (e.value = "" + n)
              : e.value !== "" + n && (e.value = "" + n);
          else if ("submit" === r || "reset" === r)
            return void e.removeAttribute("value");
          (t.hasOwnProperty("value")
            ? ee(e, t.type, n)
            : t.hasOwnProperty("defaultValue") &&
              ee(e, t.type, H(t.defaultValue)),
            null == t.checked &&
              null != t.defaultChecked &&
              (e.defaultChecked = !!t.defaultChecked));
        }
        function Z(e, t, n) {
          if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
            var r = t.type;
            if (
              !(
                ("submit" !== r && "reset" !== r) ||
                (void 0 !== t.value && null !== t.value)
              )
            )
              return;
            ((t = "" + e._wrapperState.initialValue),
              n || t === e.value || (e.value = t),
              (e.defaultValue = t));
          }
          ("" !== (n = e.name) && (e.name = ""),
            (e.defaultChecked = !!e._wrapperState.initialChecked),
            "" !== n && (e.name = n));
        }
        function ee(e, t, n) {
          ("number" === t && Q(e.ownerDocument) === e) ||
            (null == n
              ? (e.defaultValue = "" + e._wrapperState.initialValue)
              : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
        }
        var te = Array.isArray;
        function ne(e, t, n, r) {
          if (((e = e.options), t)) {
            t = {};
            for (var a = 0; a < n.length; a++) t["$" + n[a]] = !0;
            for (n = 0; n < e.length; n++)
              ((a = t.hasOwnProperty("$" + e[n].value)),
                e[n].selected !== a && (e[n].selected = a),
                a && r && (e[n].defaultSelected = !0));
          } else {
            for (n = "" + H(n), t = null, a = 0; a < e.length; a++) {
              if (e[a].value === n)
                return (
                  (e[a].selected = !0),
                  void (r && (e[a].defaultSelected = !0))
                );
              null !== t || e[a].disabled || (t = e[a]);
            }
            null !== t && (t.selected = !0);
          }
        }
        function re(e, t) {
          if (null != t.dangerouslySetInnerHTML) throw Error(i(91));
          return M({}, t, {
            value: void 0,
            defaultValue: void 0,
            children: "" + e._wrapperState.initialValue,
          });
        }
        function ae(e, t) {
          var n = t.value;
          if (null == n) {
            if (((n = t.children), (t = t.defaultValue), null != n)) {
              if (null != t) throw Error(i(92));
              if (te(n)) {
                if (1 < n.length) throw Error(i(93));
                n = n[0];
              }
              t = n;
            }
            (null == t && (t = ""), (n = t));
          }
          e._wrapperState = { initialValue: H(n) };
        }
        function ie(e, t) {
          var n = H(t.value),
            r = H(t.defaultValue);
          (null != n &&
            ((n = "" + n) !== e.value && (e.value = n),
            null == t.defaultValue &&
              e.defaultValue !== n &&
              (e.defaultValue = n)),
            null != r && (e.defaultValue = "" + r));
        }
        function oe(e) {
          var t = e.textContent;
          t === e._wrapperState.initialValue &&
            "" !== t &&
            null !== t &&
            (e.value = t);
        }
        function se(e) {
          switch (e) {
            case "svg":
              return "http://www.w3.org/2000/svg";
            case "math":
              return "http://www.w3.org/1998/Math/MathML";
            default:
              return "http://www.w3.org/1999/xhtml";
          }
        }
        function le(e, t) {
          return null == e || "http://www.w3.org/1999/xhtml" === e
            ? se(t)
            : "http://www.w3.org/2000/svg" === e && "foreignObject" === t
              ? "http://www.w3.org/1999/xhtml"
              : e;
        }
        var ce,
          ue,
          de =
            ((ue = function (e, t) {
              if (
                "http://www.w3.org/2000/svg" !== e.namespaceURI ||
                "innerHTML" in e
              )
                e.innerHTML = t;
              else {
                for (
                  (ce = ce || document.createElement("div")).innerHTML =
                    "<svg>" + t.valueOf().toString() + "</svg>",
                    t = ce.firstChild;
                  e.firstChild;
                )
                  e.removeChild(e.firstChild);
                for (; t.firstChild; ) e.appendChild(t.firstChild);
              }
            }),
            "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction
              ? function (e, t, n, r) {
                  MSApp.execUnsafeLocalFunction(function () {
                    return ue(e, t);
                  });
                }
              : ue);
        function fe(e, t) {
          if (t) {
            var n = e.firstChild;
            if (n && n === e.lastChild && 3 === n.nodeType)
              return void (n.nodeValue = t);
          }
          e.textContent = t;
        }
        var he = {
            animationIterationCount: !0,
            aspectRatio: !0,
            borderImageOutset: !0,
            borderImageSlice: !0,
            borderImageWidth: !0,
            boxFlex: !0,
            boxFlexGroup: !0,
            boxOrdinalGroup: !0,
            columnCount: !0,
            columns: !0,
            flex: !0,
            flexGrow: !0,
            flexPositive: !0,
            flexShrink: !0,
            flexNegative: !0,
            flexOrder: !0,
            gridArea: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowSpan: !0,
            gridRowStart: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnSpan: !0,
            gridColumnStart: !0,
            fontWeight: !0,
            lineClamp: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            tabSize: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0,
            fillOpacity: !0,
            floodOpacity: !0,
            stopOpacity: !0,
            strokeDasharray: !0,
            strokeDashoffset: !0,
            strokeMiterlimit: !0,
            strokeOpacity: !0,
            strokeWidth: !0,
          },
          pe = ["Webkit", "ms", "Moz", "O"];
        function me(e, t, n) {
          return null == t || "boolean" === typeof t || "" === t
            ? ""
            : n ||
                "number" !== typeof t ||
                0 === t ||
                (he.hasOwnProperty(e) && he[e])
              ? ("" + t).trim()
              : t + "px";
        }
        function ge(e, t) {
          for (var n in ((e = e.style), t))
            if (t.hasOwnProperty(n)) {
              var r = 0 === n.indexOf("--"),
                a = me(n, t[n], r);
              ("float" === n && (n = "cssFloat"),
                r ? e.setProperty(n, a) : (e[n] = a));
            }
        }
        Object.keys(he).forEach(function (e) {
          pe.forEach(function (t) {
            ((t = t + e.charAt(0).toUpperCase() + e.substring(1)),
              (he[t] = he[e]));
          });
        });
        var ye = M(
          { menuitem: !0 },
          {
            area: !0,
            base: !0,
            br: !0,
            col: !0,
            embed: !0,
            hr: !0,
            img: !0,
            input: !0,
            keygen: !0,
            link: !0,
            meta: !0,
            param: !0,
            source: !0,
            track: !0,
            wbr: !0,
          },
        );
        function ve(e, t) {
          if (t) {
            if (
              ye[e] &&
              (null != t.children || null != t.dangerouslySetInnerHTML)
            )
              throw Error(i(137, e));
            if (null != t.dangerouslySetInnerHTML) {
              if (null != t.children) throw Error(i(60));
              if (
                "object" !== typeof t.dangerouslySetInnerHTML ||
                !("__html" in t.dangerouslySetInnerHTML)
              )
                throw Error(i(61));
            }
            if (null != t.style && "object" !== typeof t.style)
              throw Error(i(62));
          }
        }
        function be(e, t) {
          if (-1 === e.indexOf("-")) return "string" === typeof t.is;
          switch (e) {
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
              return !1;
            default:
              return !0;
          }
        }
        var xe = null;
        function we(e) {
          return (
            (e = e.target || e.srcElement || window).correspondingUseElement &&
              (e = e.correspondingUseElement),
            3 === e.nodeType ? e.parentNode : e
          );
        }
        var ke = null,
          Se = null,
          je = null;
        function Ne(e) {
          if ((e = ba(e))) {
            if ("function" !== typeof ke) throw Error(i(280));
            var t = e.stateNode;
            t && ((t = wa(t)), ke(e.stateNode, e.type, t));
          }
        }
        function Ee(e) {
          Se ? (je ? je.push(e) : (je = [e])) : (Se = e);
        }
        function _e() {
          if (Se) {
            var e = Se,
              t = je;
            if (((je = Se = null), Ne(e), t))
              for (e = 0; e < t.length; e++) Ne(t[e]);
          }
        }
        function Ce(e, t) {
          return e(t);
        }
        function Pe() {}
        var Oe = !1;
        function Re(e, t, n) {
          if (Oe) return e(t, n);
          Oe = !0;
          try {
            return Ce(e, t, n);
          } finally {
            ((Oe = !1), (null !== Se || null !== je) && (Pe(), _e()));
          }
        }
        function Te(e, t) {
          var n = e.stateNode;
          if (null === n) return null;
          var r = wa(n);
          if (null === r) return null;
          n = r[t];
          e: switch (t) {
            case "onClick":
            case "onClickCapture":
            case "onDoubleClick":
            case "onDoubleClickCapture":
            case "onMouseDown":
            case "onMouseDownCapture":
            case "onMouseMove":
            case "onMouseMoveCapture":
            case "onMouseUp":
            case "onMouseUpCapture":
            case "onMouseEnter":
              ((r = !r.disabled) ||
                (r = !(
                  "button" === (e = e.type) ||
                  "input" === e ||
                  "select" === e ||
                  "textarea" === e
                )),
                (e = !r));
              break e;
            default:
              e = !1;
          }
          if (e) return null;
          if (n && "function" !== typeof n) throw Error(i(231, t, typeof n));
          return n;
        }
        var Le = !1;
        if (u)
          try {
            var Ae = {};
            (Object.defineProperty(Ae, "passive", {
              get: function () {
                Le = !0;
              },
            }),
              window.addEventListener("test", Ae, Ae),
              window.removeEventListener("test", Ae, Ae));
          } catch (ue) {
            Le = !1;
          }
        function ze(e, t, n, r, a, i, o, s, l) {
          var c = Array.prototype.slice.call(arguments, 3);
          try {
            t.apply(n, c);
          } catch (u) {
            this.onError(u);
          }
        }
        var Fe = !1,
          Me = null,
          Be = !1,
          De = null,
          Ue = {
            onError: function (e) {
              ((Fe = !0), (Me = e));
            },
          };
        function Ie(e, t, n, r, a, i, o, s, l) {
          ((Fe = !1), (Me = null), ze.apply(Ue, arguments));
        }
        function qe(e) {
          var t = e,
            n = e;
          if (e.alternate) for (; t.return; ) t = t.return;
          else {
            e = t;
            do {
              (0 !== (4098 & (t = e).flags) && (n = t.return), (e = t.return));
            } while (e);
          }
          return 3 === t.tag ? n : null;
        }
        function Ve(e) {
          if (13 === e.tag) {
            var t = e.memoizedState;
            if (
              (null === t &&
                null !== (e = e.alternate) &&
                (t = e.memoizedState),
              null !== t)
            )
              return t.dehydrated;
          }
          return null;
        }
        function He(e) {
          if (qe(e) !== e) throw Error(i(188));
        }
        function We(e) {
          return null !==
            (e = (function (e) {
              var t = e.alternate;
              if (!t) {
                if (null === (t = qe(e))) throw Error(i(188));
                return t !== e ? null : e;
              }
              for (var n = e, r = t; ; ) {
                var a = n.return;
                if (null === a) break;
                var o = a.alternate;
                if (null === o) {
                  if (null !== (r = a.return)) {
                    n = r;
                    continue;
                  }
                  break;
                }
                if (a.child === o.child) {
                  for (o = a.child; o; ) {
                    if (o === n) return (He(a), e);
                    if (o === r) return (He(a), t);
                    o = o.sibling;
                  }
                  throw Error(i(188));
                }
                if (n.return !== r.return) ((n = a), (r = o));
                else {
                  for (var s = !1, l = a.child; l; ) {
                    if (l === n) {
                      ((s = !0), (n = a), (r = o));
                      break;
                    }
                    if (l === r) {
                      ((s = !0), (r = a), (n = o));
                      break;
                    }
                    l = l.sibling;
                  }
                  if (!s) {
                    for (l = o.child; l; ) {
                      if (l === n) {
                        ((s = !0), (n = o), (r = a));
                        break;
                      }
                      if (l === r) {
                        ((s = !0), (r = o), (n = a));
                        break;
                      }
                      l = l.sibling;
                    }
                    if (!s) throw Error(i(189));
                  }
                }
                if (n.alternate !== r) throw Error(i(190));
              }
              if (3 !== n.tag) throw Error(i(188));
              return n.stateNode.current === n ? e : t;
            })(e))
            ? $e(e)
            : null;
        }
        function $e(e) {
          if (5 === e.tag || 6 === e.tag) return e;
          for (e = e.child; null !== e; ) {
            var t = $e(e);
            if (null !== t) return t;
            e = e.sibling;
          }
          return null;
        }
        var Ke = a.unstable_scheduleCallback,
          Qe = a.unstable_cancelCallback,
          Ye = a.unstable_shouldYield,
          Je = a.unstable_requestPaint,
          Xe = a.unstable_now,
          Ge = a.unstable_getCurrentPriorityLevel,
          Ze = a.unstable_ImmediatePriority,
          et = a.unstable_UserBlockingPriority,
          tt = a.unstable_NormalPriority,
          nt = a.unstable_LowPriority,
          rt = a.unstable_IdlePriority,
          at = null,
          it = null;
        var ot = Math.clz32
            ? Math.clz32
            : function (e) {
                return (
                  (e >>>= 0),
                  0 === e ? 32 : (31 - ((st(e) / lt) | 0)) | 0
                );
              },
          st = Math.log,
          lt = Math.LN2;
        var ct = 64,
          ut = 4194304;
        function dt(e) {
          switch (e & -e) {
            case 1:
              return 1;
            case 2:
              return 2;
            case 4:
              return 4;
            case 8:
              return 8;
            case 16:
              return 16;
            case 32:
              return 32;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
              return 4194240 & e;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              return 130023424 & e;
            case 134217728:
              return 134217728;
            case 268435456:
              return 268435456;
            case 536870912:
              return 536870912;
            case 1073741824:
              return 1073741824;
            default:
              return e;
          }
        }
        function ft(e, t) {
          var n = e.pendingLanes;
          if (0 === n) return 0;
          var r = 0,
            a = e.suspendedLanes,
            i = e.pingedLanes,
            o = 268435455 & n;
          if (0 !== o) {
            var s = o & ~a;
            0 !== s ? (r = dt(s)) : 0 !== (i &= o) && (r = dt(i));
          } else 0 !== (o = n & ~a) ? (r = dt(o)) : 0 !== i && (r = dt(i));
          if (0 === r) return 0;
          if (
            0 !== t &&
            t !== r &&
            0 === (t & a) &&
            ((a = r & -r) >= (i = t & -t) || (16 === a && 0 !== (4194240 & i)))
          )
            return t;
          if ((0 !== (4 & r) && (r |= 16 & n), 0 !== (t = e.entangledLanes)))
            for (e = e.entanglements, t &= r; 0 < t; )
              ((a = 1 << (n = 31 - ot(t))), (r |= e[n]), (t &= ~a));
          return r;
        }
        function ht(e, t) {
          switch (e) {
            case 1:
            case 2:
            case 4:
              return t + 250;
            case 8:
            case 16:
            case 32:
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
              return t + 5e3;
            default:
              return -1;
          }
        }
        function pt(e) {
          return 0 !== (e = -1073741825 & e.pendingLanes)
            ? e
            : 1073741824 & e
              ? 1073741824
              : 0;
        }
        function mt() {
          var e = ct;
          return (0 === (4194240 & (ct <<= 1)) && (ct = 64), e);
        }
        function gt(e) {
          for (var t = [], n = 0; 31 > n; n++) t.push(e);
          return t;
        }
        function yt(e, t, n) {
          ((e.pendingLanes |= t),
            536870912 !== t && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
            ((e = e.eventTimes)[(t = 31 - ot(t))] = n));
        }
        function vt(e, t) {
          var n = (e.entangledLanes |= t);
          for (e = e.entanglements; n; ) {
            var r = 31 - ot(n),
              a = 1 << r;
            ((a & t) | (e[r] & t) && (e[r] |= t), (n &= ~a));
          }
        }
        var bt = 0;
        function xt(e) {
          return 1 < (e &= -e)
            ? 4 < e
              ? 0 !== (268435455 & e)
                ? 16
                : 536870912
              : 4
            : 1;
        }
        var wt,
          kt,
          St,
          jt,
          Nt,
          Et = !1,
          _t = [],
          Ct = null,
          Pt = null,
          Ot = null,
          Rt = new Map(),
          Tt = new Map(),
          Lt = [],
          At =
            "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
              " ",
            );
        function zt(e, t) {
          switch (e) {
            case "focusin":
            case "focusout":
              Ct = null;
              break;
            case "dragenter":
            case "dragleave":
              Pt = null;
              break;
            case "mouseover":
            case "mouseout":
              Ot = null;
              break;
            case "pointerover":
            case "pointerout":
              Rt.delete(t.pointerId);
              break;
            case "gotpointercapture":
            case "lostpointercapture":
              Tt.delete(t.pointerId);
          }
        }
        function Ft(e, t, n, r, a, i) {
          return null === e || e.nativeEvent !== i
            ? ((e = {
                blockedOn: t,
                domEventName: n,
                eventSystemFlags: r,
                nativeEvent: i,
                targetContainers: [a],
              }),
              null !== t && null !== (t = ba(t)) && kt(t),
              e)
            : ((e.eventSystemFlags |= r),
              (t = e.targetContainers),
              null !== a && -1 === t.indexOf(a) && t.push(a),
              e);
        }
        function Mt(e) {
          var t = va(e.target);
          if (null !== t) {
            var n = qe(t);
            if (null !== n)
              if (13 === (t = n.tag)) {
                if (null !== (t = Ve(n)))
                  return (
                    (e.blockedOn = t),
                    void Nt(e.priority, function () {
                      St(n);
                    })
                  );
              } else if (
                3 === t &&
                n.stateNode.current.memoizedState.isDehydrated
              )
                return void (e.blockedOn =
                  3 === n.tag ? n.stateNode.containerInfo : null);
          }
          e.blockedOn = null;
        }
        function Bt(e) {
          if (null !== e.blockedOn) return !1;
          for (var t = e.targetContainers; 0 < t.length; ) {
            var n = Yt(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
            if (null !== n)
              return (null !== (t = ba(n)) && kt(t), (e.blockedOn = n), !1);
            var r = new (n = e.nativeEvent).constructor(n.type, n);
            ((xe = r), n.target.dispatchEvent(r), (xe = null), t.shift());
          }
          return !0;
        }
        function Dt(e, t, n) {
          Bt(e) && n.delete(t);
        }
        function Ut() {
          ((Et = !1),
            null !== Ct && Bt(Ct) && (Ct = null),
            null !== Pt && Bt(Pt) && (Pt = null),
            null !== Ot && Bt(Ot) && (Ot = null),
            Rt.forEach(Dt),
            Tt.forEach(Dt));
        }
        function It(e, t) {
          e.blockedOn === t &&
            ((e.blockedOn = null),
            Et ||
              ((Et = !0),
              a.unstable_scheduleCallback(a.unstable_NormalPriority, Ut)));
        }
        function qt(e) {
          function t(t) {
            return It(t, e);
          }
          if (0 < _t.length) {
            It(_t[0], e);
            for (var n = 1; n < _t.length; n++) {
              var r = _t[n];
              r.blockedOn === e && (r.blockedOn = null);
            }
          }
          for (
            null !== Ct && It(Ct, e),
              null !== Pt && It(Pt, e),
              null !== Ot && It(Ot, e),
              Rt.forEach(t),
              Tt.forEach(t),
              n = 0;
            n < Lt.length;
            n++
          )
            (r = Lt[n]).blockedOn === e && (r.blockedOn = null);
          for (; 0 < Lt.length && null === (n = Lt[0]).blockedOn; )
            (Mt(n), null === n.blockedOn && Lt.shift());
        }
        var Vt = x.ReactCurrentBatchConfig,
          Ht = !0;
        function Wt(e, t, n, r) {
          var a = bt,
            i = Vt.transition;
          Vt.transition = null;
          try {
            ((bt = 1), Kt(e, t, n, r));
          } finally {
            ((bt = a), (Vt.transition = i));
          }
        }
        function $t(e, t, n, r) {
          var a = bt,
            i = Vt.transition;
          Vt.transition = null;
          try {
            ((bt = 4), Kt(e, t, n, r));
          } finally {
            ((bt = a), (Vt.transition = i));
          }
        }
        function Kt(e, t, n, r) {
          if (Ht) {
            var a = Yt(e, t, n, r);
            if (null === a) (Hr(e, t, r, Qt, n), zt(e, r));
            else if (
              (function (e, t, n, r, a) {
                switch (t) {
                  case "focusin":
                    return ((Ct = Ft(Ct, e, t, n, r, a)), !0);
                  case "dragenter":
                    return ((Pt = Ft(Pt, e, t, n, r, a)), !0);
                  case "mouseover":
                    return ((Ot = Ft(Ot, e, t, n, r, a)), !0);
                  case "pointerover":
                    var i = a.pointerId;
                    return (
                      Rt.set(i, Ft(Rt.get(i) || null, e, t, n, r, a)),
                      !0
                    );
                  case "gotpointercapture":
                    return (
                      (i = a.pointerId),
                      Tt.set(i, Ft(Tt.get(i) || null, e, t, n, r, a)),
                      !0
                    );
                }
                return !1;
              })(a, e, t, n, r)
            )
              r.stopPropagation();
            else if ((zt(e, r), 4 & t && -1 < At.indexOf(e))) {
              for (; null !== a; ) {
                var i = ba(a);
                if (
                  (null !== i && wt(i),
                  null === (i = Yt(e, t, n, r)) && Hr(e, t, r, Qt, n),
                  i === a)
                )
                  break;
                a = i;
              }
              null !== a && r.stopPropagation();
            } else Hr(e, t, r, null, n);
          }
        }
        var Qt = null;
        function Yt(e, t, n, r) {
          if (((Qt = null), null !== (e = va((e = we(r))))))
            if (null === (t = qe(e))) e = null;
            else if (13 === (n = t.tag)) {
              if (null !== (e = Ve(t))) return e;
              e = null;
            } else if (3 === n) {
              if (t.stateNode.current.memoizedState.isDehydrated)
                return 3 === t.tag ? t.stateNode.containerInfo : null;
              e = null;
            } else t !== e && (e = null);
          return ((Qt = e), null);
        }
        function Jt(e) {
          switch (e) {
            case "cancel":
            case "click":
            case "close":
            case "contextmenu":
            case "copy":
            case "cut":
            case "auxclick":
            case "dblclick":
            case "dragend":
            case "dragstart":
            case "drop":
            case "focusin":
            case "focusout":
            case "input":
            case "invalid":
            case "keydown":
            case "keypress":
            case "keyup":
            case "mousedown":
            case "mouseup":
            case "paste":
            case "pause":
            case "play":
            case "pointercancel":
            case "pointerdown":
            case "pointerup":
            case "ratechange":
            case "reset":
            case "resize":
            case "seeked":
            case "submit":
            case "touchcancel":
            case "touchend":
            case "touchstart":
            case "volumechange":
            case "change":
            case "selectionchange":
            case "textInput":
            case "compositionstart":
            case "compositionend":
            case "compositionupdate":
            case "beforeblur":
            case "afterblur":
            case "beforeinput":
            case "blur":
            case "fullscreenchange":
            case "focus":
            case "hashchange":
            case "popstate":
            case "select":
            case "selectstart":
              return 1;
            case "drag":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "mousemove":
            case "mouseout":
            case "mouseover":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "scroll":
            case "toggle":
            case "touchmove":
            case "wheel":
            case "mouseenter":
            case "mouseleave":
            case "pointerenter":
            case "pointerleave":
              return 4;
            case "message":
              switch (Ge()) {
                case Ze:
                  return 1;
                case et:
                  return 4;
                case tt:
                case nt:
                  return 16;
                case rt:
                  return 536870912;
                default:
                  return 16;
              }
            default:
              return 16;
          }
        }
        var Xt = null,
          Gt = null,
          Zt = null;
        function en() {
          if (Zt) return Zt;
          var e,
            t,
            n = Gt,
            r = n.length,
            a = "value" in Xt ? Xt.value : Xt.textContent,
            i = a.length;
          for (e = 0; e < r && n[e] === a[e]; e++);
          var o = r - e;
          for (t = 1; t <= o && n[r - t] === a[i - t]; t++);
          return (Zt = a.slice(e, 1 < t ? 1 - t : void 0));
        }
        function tn(e) {
          var t = e.keyCode;
          return (
            "charCode" in e
              ? 0 === (e = e.charCode) && 13 === t && (e = 13)
              : (e = t),
            10 === e && (e = 13),
            32 <= e || 13 === e ? e : 0
          );
        }
        function nn() {
          return !0;
        }
        function rn() {
          return !1;
        }
        function an(e) {
          function t(t, n, r, a, i) {
            for (var o in ((this._reactName = t),
            (this._targetInst = r),
            (this.type = n),
            (this.nativeEvent = a),
            (this.target = i),
            (this.currentTarget = null),
            e))
              e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(a) : a[o]));
            return (
              (this.isDefaultPrevented = (
                null != a.defaultPrevented
                  ? a.defaultPrevented
                  : !1 === a.returnValue
              )
                ? nn
                : rn),
              (this.isPropagationStopped = rn),
              this
            );
          }
          return (
            M(t.prototype, {
              preventDefault: function () {
                this.defaultPrevented = !0;
                var e = this.nativeEvent;
                e &&
                  (e.preventDefault
                    ? e.preventDefault()
                    : "unknown" !== typeof e.returnValue &&
                      (e.returnValue = !1),
                  (this.isDefaultPrevented = nn));
              },
              stopPropagation: function () {
                var e = this.nativeEvent;
                e &&
                  (e.stopPropagation
                    ? e.stopPropagation()
                    : "unknown" !== typeof e.cancelBubble &&
                      (e.cancelBubble = !0),
                  (this.isPropagationStopped = nn));
              },
              persist: function () {},
              isPersistent: nn,
            }),
            t
          );
        }
        var on,
          sn,
          ln,
          cn = {
            eventPhase: 0,
            bubbles: 0,
            cancelable: 0,
            timeStamp: function (e) {
              return e.timeStamp || Date.now();
            },
            defaultPrevented: 0,
            isTrusted: 0,
          },
          un = an(cn),
          dn = M({}, cn, { view: 0, detail: 0 }),
          fn = an(dn),
          hn = M({}, dn, {
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            metaKey: 0,
            getModifierState: Nn,
            button: 0,
            buttons: 0,
            relatedTarget: function (e) {
              return void 0 === e.relatedTarget
                ? e.fromElement === e.srcElement
                  ? e.toElement
                  : e.fromElement
                : e.relatedTarget;
            },
            movementX: function (e) {
              return "movementX" in e
                ? e.movementX
                : (e !== ln &&
                    (ln && "mousemove" === e.type
                      ? ((on = e.screenX - ln.screenX),
                        (sn = e.screenY - ln.screenY))
                      : (sn = on = 0),
                    (ln = e)),
                  on);
            },
            movementY: function (e) {
              return "movementY" in e ? e.movementY : sn;
            },
          }),
          pn = an(hn),
          mn = an(M({}, hn, { dataTransfer: 0 })),
          gn = an(M({}, dn, { relatedTarget: 0 })),
          yn = an(
            M({}, cn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
          ),
          vn = M({}, cn, {
            clipboardData: function (e) {
              return "clipboardData" in e
                ? e.clipboardData
                : window.clipboardData;
            },
          }),
          bn = an(vn),
          xn = an(M({}, cn, { data: 0 })),
          wn = {
            Esc: "Escape",
            Spacebar: " ",
            Left: "ArrowLeft",
            Up: "ArrowUp",
            Right: "ArrowRight",
            Down: "ArrowDown",
            Del: "Delete",
            Win: "OS",
            Menu: "ContextMenu",
            Apps: "ContextMenu",
            Scroll: "ScrollLock",
            MozPrintableKey: "Unidentified",
          },
          kn = {
            8: "Backspace",
            9: "Tab",
            12: "Clear",
            13: "Enter",
            16: "Shift",
            17: "Control",
            18: "Alt",
            19: "Pause",
            20: "CapsLock",
            27: "Escape",
            32: " ",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "ArrowLeft",
            38: "ArrowUp",
            39: "ArrowRight",
            40: "ArrowDown",
            45: "Insert",
            46: "Delete",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "NumLock",
            145: "ScrollLock",
            224: "Meta",
          },
          Sn = {
            Alt: "altKey",
            Control: "ctrlKey",
            Meta: "metaKey",
            Shift: "shiftKey",
          };
        function jn(e) {
          var t = this.nativeEvent;
          return t.getModifierState
            ? t.getModifierState(e)
            : !!(e = Sn[e]) && !!t[e];
        }
        function Nn() {
          return jn;
        }
        var En = M({}, dn, {
            key: function (e) {
              if (e.key) {
                var t = wn[e.key] || e.key;
                if ("Unidentified" !== t) return t;
              }
              return "keypress" === e.type
                ? 13 === (e = tn(e))
                  ? "Enter"
                  : String.fromCharCode(e)
                : "keydown" === e.type || "keyup" === e.type
                  ? kn[e.keyCode] || "Unidentified"
                  : "";
            },
            code: 0,
            location: 0,
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            metaKey: 0,
            repeat: 0,
            locale: 0,
            getModifierState: Nn,
            charCode: function (e) {
              return "keypress" === e.type ? tn(e) : 0;
            },
            keyCode: function (e) {
              return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0;
            },
            which: function (e) {
              return "keypress" === e.type
                ? tn(e)
                : "keydown" === e.type || "keyup" === e.type
                  ? e.keyCode
                  : 0;
            },
          }),
          _n = an(En),
          Cn = an(
            M({}, hn, {
              pointerId: 0,
              width: 0,
              height: 0,
              pressure: 0,
              tangentialPressure: 0,
              tiltX: 0,
              tiltY: 0,
              twist: 0,
              pointerType: 0,
              isPrimary: 0,
            }),
          ),
          Pn = an(
            M({}, dn, {
              touches: 0,
              targetTouches: 0,
              changedTouches: 0,
              altKey: 0,
              metaKey: 0,
              ctrlKey: 0,
              shiftKey: 0,
              getModifierState: Nn,
            }),
          ),
          On = an(
            M({}, cn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
          ),
          Rn = M({}, hn, {
            deltaX: function (e) {
              return "deltaX" in e
                ? e.deltaX
                : "wheelDeltaX" in e
                  ? -e.wheelDeltaX
                  : 0;
            },
            deltaY: function (e) {
              return "deltaY" in e
                ? e.deltaY
                : "wheelDeltaY" in e
                  ? -e.wheelDeltaY
                  : "wheelDelta" in e
                    ? -e.wheelDelta
                    : 0;
            },
            deltaZ: 0,
            deltaMode: 0,
          }),
          Tn = an(Rn),
          Ln = [9, 13, 27, 32],
          An = u && "CompositionEvent" in window,
          zn = null;
        u && "documentMode" in document && (zn = document.documentMode);
        var Fn = u && "TextEvent" in window && !zn,
          Mn = u && (!An || (zn && 8 < zn && 11 >= zn)),
          Bn = String.fromCharCode(32),
          Dn = !1;
        function Un(e, t) {
          switch (e) {
            case "keyup":
              return -1 !== Ln.indexOf(t.keyCode);
            case "keydown":
              return 229 !== t.keyCode;
            case "keypress":
            case "mousedown":
            case "focusout":
              return !0;
            default:
              return !1;
          }
        }
        function In(e) {
          return "object" === typeof (e = e.detail) && "data" in e
            ? e.data
            : null;
        }
        var qn = !1;
        var Vn = {
          color: !0,
          date: !0,
          datetime: !0,
          "datetime-local": !0,
          email: !0,
          month: !0,
          number: !0,
          password: !0,
          range: !0,
          search: !0,
          tel: !0,
          text: !0,
          time: !0,
          url: !0,
          week: !0,
        };
        function Hn(e) {
          var t = e && e.nodeName && e.nodeName.toLowerCase();
          return "input" === t ? !!Vn[e.type] : "textarea" === t;
        }
        function Wn(e, t, n, r) {
          (Ee(r),
            0 < (t = $r(t, "onChange")).length &&
              ((n = new un("onChange", "change", null, n, r)),
              e.push({ event: n, listeners: t })));
        }
        var $n = null,
          Kn = null;
        function Qn(e) {
          Br(e, 0);
        }
        function Yn(e) {
          if (K(xa(e))) return e;
        }
        function Jn(e, t) {
          if ("change" === e) return t;
        }
        var Xn = !1;
        if (u) {
          var Gn;
          if (u) {
            var Zn = "oninput" in document;
            if (!Zn) {
              var er = document.createElement("div");
              (er.setAttribute("oninput", "return;"),
                (Zn = "function" === typeof er.oninput));
            }
            Gn = Zn;
          } else Gn = !1;
          Xn = Gn && (!document.documentMode || 9 < document.documentMode);
        }
        function tr() {
          $n && ($n.detachEvent("onpropertychange", nr), (Kn = $n = null));
        }
        function nr(e) {
          if ("value" === e.propertyName && Yn(Kn)) {
            var t = [];
            (Wn(t, Kn, e, we(e)), Re(Qn, t));
          }
        }
        function rr(e, t, n) {
          "focusin" === e
            ? (tr(), (Kn = n), ($n = t).attachEvent("onpropertychange", nr))
            : "focusout" === e && tr();
        }
        function ar(e) {
          if ("selectionchange" === e || "keyup" === e || "keydown" === e)
            return Yn(Kn);
        }
        function ir(e, t) {
          if ("click" === e) return Yn(t);
        }
        function or(e, t) {
          if ("input" === e || "change" === e) return Yn(t);
        }
        var sr =
          "function" === typeof Object.is
            ? Object.is
            : function (e, t) {
                return (
                  (e === t && (0 !== e || 1 / e === 1 / t)) ||
                  (e !== e && t !== t)
                );
              };
        function lr(e, t) {
          if (sr(e, t)) return !0;
          if (
            "object" !== typeof e ||
            null === e ||
            "object" !== typeof t ||
            null === t
          )
            return !1;
          var n = Object.keys(e),
            r = Object.keys(t);
          if (n.length !== r.length) return !1;
          for (r = 0; r < n.length; r++) {
            var a = n[r];
            if (!d.call(t, a) || !sr(e[a], t[a])) return !1;
          }
          return !0;
        }
        function cr(e) {
          for (; e && e.firstChild; ) e = e.firstChild;
          return e;
        }
        function ur(e, t) {
          var n,
            r = cr(e);
          for (e = 0; r; ) {
            if (3 === r.nodeType) {
              if (((n = e + r.textContent.length), e <= t && n >= t))
                return { node: r, offset: t - e };
              e = n;
            }
            e: {
              for (; r; ) {
                if (r.nextSibling) {
                  r = r.nextSibling;
                  break e;
                }
                r = r.parentNode;
              }
              r = void 0;
            }
            r = cr(r);
          }
        }
        function dr(e, t) {
          return (
            !(!e || !t) &&
            (e === t ||
              ((!e || 3 !== e.nodeType) &&
                (t && 3 === t.nodeType
                  ? dr(e, t.parentNode)
                  : "contains" in e
                    ? e.contains(t)
                    : !!e.compareDocumentPosition &&
                      !!(16 & e.compareDocumentPosition(t)))))
          );
        }
        function fr() {
          for (var e = window, t = Q(); t instanceof e.HTMLIFrameElement; ) {
            try {
              var n = "string" === typeof t.contentWindow.location.href;
            } catch (r) {
              n = !1;
            }
            if (!n) break;
            t = Q((e = t.contentWindow).document);
          }
          return t;
        }
        function hr(e) {
          var t = e && e.nodeName && e.nodeName.toLowerCase();
          return (
            t &&
            (("input" === t &&
              ("text" === e.type ||
                "search" === e.type ||
                "tel" === e.type ||
                "url" === e.type ||
                "password" === e.type)) ||
              "textarea" === t ||
              "true" === e.contentEditable)
          );
        }
        function pr(e) {
          var t = fr(),
            n = e.focusedElem,
            r = e.selectionRange;
          if (
            t !== n &&
            n &&
            n.ownerDocument &&
            dr(n.ownerDocument.documentElement, n)
          ) {
            if (null !== r && hr(n))
              if (
                ((t = r.start),
                void 0 === (e = r.end) && (e = t),
                "selectionStart" in n)
              )
                ((n.selectionStart = t),
                  (n.selectionEnd = Math.min(e, n.value.length)));
              else if (
                (e =
                  ((t = n.ownerDocument || document) && t.defaultView) ||
                  window).getSelection
              ) {
                e = e.getSelection();
                var a = n.textContent.length,
                  i = Math.min(r.start, a);
                ((r = void 0 === r.end ? i : Math.min(r.end, a)),
                  !e.extend && i > r && ((a = r), (r = i), (i = a)),
                  (a = ur(n, i)));
                var o = ur(n, r);
                a &&
                  o &&
                  (1 !== e.rangeCount ||
                    e.anchorNode !== a.node ||
                    e.anchorOffset !== a.offset ||
                    e.focusNode !== o.node ||
                    e.focusOffset !== o.offset) &&
                  ((t = t.createRange()).setStart(a.node, a.offset),
                  e.removeAllRanges(),
                  i > r
                    ? (e.addRange(t), e.extend(o.node, o.offset))
                    : (t.setEnd(o.node, o.offset), e.addRange(t)));
              }
            for (t = [], e = n; (e = e.parentNode); )
              1 === e.nodeType &&
                t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
            for (
              "function" === typeof n.focus && n.focus(), n = 0;
              n < t.length;
              n++
            )
              (((e = t[n]).element.scrollLeft = e.left),
                (e.element.scrollTop = e.top));
          }
        }
        var mr = u && "documentMode" in document && 11 >= document.documentMode,
          gr = null,
          yr = null,
          vr = null,
          br = !1;
        function xr(e, t, n) {
          var r =
            n.window === n
              ? n.document
              : 9 === n.nodeType
                ? n
                : n.ownerDocument;
          br ||
            null == gr ||
            gr !== Q(r) ||
            ("selectionStart" in (r = gr) && hr(r)
              ? (r = { start: r.selectionStart, end: r.selectionEnd })
              : (r = {
                  anchorNode: (r = (
                    (r.ownerDocument && r.ownerDocument.defaultView) ||
                    window
                  ).getSelection()).anchorNode,
                  anchorOffset: r.anchorOffset,
                  focusNode: r.focusNode,
                  focusOffset: r.focusOffset,
                }),
            (vr && lr(vr, r)) ||
              ((vr = r),
              0 < (r = $r(yr, "onSelect")).length &&
                ((t = new un("onSelect", "select", null, t, n)),
                e.push({ event: t, listeners: r }),
                (t.target = gr))));
        }
        function wr(e, t) {
          var n = {};
          return (
            (n[e.toLowerCase()] = t.toLowerCase()),
            (n["Webkit" + e] = "webkit" + t),
            (n["Moz" + e] = "moz" + t),
            n
          );
        }
        var kr = {
            animationend: wr("Animation", "AnimationEnd"),
            animationiteration: wr("Animation", "AnimationIteration"),
            animationstart: wr("Animation", "AnimationStart"),
            transitionend: wr("Transition", "TransitionEnd"),
          },
          Sr = {},
          jr = {};
        function Nr(e) {
          if (Sr[e]) return Sr[e];
          if (!kr[e]) return e;
          var t,
            n = kr[e];
          for (t in n)
            if (n.hasOwnProperty(t) && t in jr) return (Sr[e] = n[t]);
          return e;
        }
        u &&
          ((jr = document.createElement("div").style),
          "AnimationEvent" in window ||
            (delete kr.animationend.animation,
            delete kr.animationiteration.animation,
            delete kr.animationstart.animation),
          "TransitionEvent" in window || delete kr.transitionend.transition);
        var Er = Nr("animationend"),
          _r = Nr("animationiteration"),
          Cr = Nr("animationstart"),
          Pr = Nr("transitionend"),
          Or = new Map(),
          Rr =
            "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
              " ",
            );
        function Tr(e, t) {
          (Or.set(e, t), l(t, [e]));
        }
        for (var Lr = 0; Lr < Rr.length; Lr++) {
          var Ar = Rr[Lr];
          Tr(Ar.toLowerCase(), "on" + (Ar[0].toUpperCase() + Ar.slice(1)));
        }
        (Tr(Er, "onAnimationEnd"),
          Tr(_r, "onAnimationIteration"),
          Tr(Cr, "onAnimationStart"),
          Tr("dblclick", "onDoubleClick"),
          Tr("focusin", "onFocus"),
          Tr("focusout", "onBlur"),
          Tr(Pr, "onTransitionEnd"),
          c("onMouseEnter", ["mouseout", "mouseover"]),
          c("onMouseLeave", ["mouseout", "mouseover"]),
          c("onPointerEnter", ["pointerout", "pointerover"]),
          c("onPointerLeave", ["pointerout", "pointerover"]),
          l(
            "onChange",
            "change click focusin focusout input keydown keyup selectionchange".split(
              " ",
            ),
          ),
          l(
            "onSelect",
            "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
              " ",
            ),
          ),
          l("onBeforeInput", [
            "compositionend",
            "keypress",
            "textInput",
            "paste",
          ]),
          l(
            "onCompositionEnd",
            "compositionend focusout keydown keypress keyup mousedown".split(
              " ",
            ),
          ),
          l(
            "onCompositionStart",
            "compositionstart focusout keydown keypress keyup mousedown".split(
              " ",
            ),
          ),
          l(
            "onCompositionUpdate",
            "compositionupdate focusout keydown keypress keyup mousedown".split(
              " ",
            ),
          ));
        var zr =
            "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
              " ",
            ),
          Fr = new Set(
            "cancel close invalid load scroll toggle".split(" ").concat(zr),
          );
        function Mr(e, t, n) {
          var r = e.type || "unknown-event";
          ((e.currentTarget = n),
            (function (e, t, n, r, a, o, s, l, c) {
              if ((Ie.apply(this, arguments), Fe)) {
                if (!Fe) throw Error(i(198));
                var u = Me;
                ((Fe = !1), (Me = null), Be || ((Be = !0), (De = u)));
              }
            })(r, t, void 0, e),
            (e.currentTarget = null));
        }
        function Br(e, t) {
          t = 0 !== (4 & t);
          for (var n = 0; n < e.length; n++) {
            var r = e[n],
              a = r.event;
            r = r.listeners;
            e: {
              var i = void 0;
              if (t)
                for (var o = r.length - 1; 0 <= o; o--) {
                  var s = r[o],
                    l = s.instance,
                    c = s.currentTarget;
                  if (((s = s.listener), l !== i && a.isPropagationStopped()))
                    break e;
                  (Mr(a, s, c), (i = l));
                }
              else
                for (o = 0; o < r.length; o++) {
                  if (
                    ((l = (s = r[o]).instance),
                    (c = s.currentTarget),
                    (s = s.listener),
                    l !== i && a.isPropagationStopped())
                  )
                    break e;
                  (Mr(a, s, c), (i = l));
                }
            }
          }
          if (Be) throw ((e = De), (Be = !1), (De = null), e);
        }
        function Dr(e, t) {
          var n = t[ma];
          void 0 === n && (n = t[ma] = new Set());
          var r = e + "__bubble";
          n.has(r) || (Vr(t, e, 2, !1), n.add(r));
        }
        function Ur(e, t, n) {
          var r = 0;
          (t && (r |= 4), Vr(n, e, r, t));
        }
        var Ir = "_reactListening" + Math.random().toString(36).slice(2);
        function qr(e) {
          if (!e[Ir]) {
            ((e[Ir] = !0),
              o.forEach(function (t) {
                "selectionchange" !== t &&
                  (Fr.has(t) || Ur(t, !1, e), Ur(t, !0, e));
              }));
            var t = 9 === e.nodeType ? e : e.ownerDocument;
            null === t || t[Ir] || ((t[Ir] = !0), Ur("selectionchange", !1, t));
          }
        }
        function Vr(e, t, n, r) {
          switch (Jt(t)) {
            case 1:
              var a = Wt;
              break;
            case 4:
              a = $t;
              break;
            default:
              a = Kt;
          }
          ((n = a.bind(null, t, n, e)),
            (a = void 0),
            !Le ||
              ("touchstart" !== t && "touchmove" !== t && "wheel" !== t) ||
              (a = !0),
            r
              ? void 0 !== a
                ? e.addEventListener(t, n, { capture: !0, passive: a })
                : e.addEventListener(t, n, !0)
              : void 0 !== a
                ? e.addEventListener(t, n, { passive: a })
                : e.addEventListener(t, n, !1));
        }
        function Hr(e, t, n, r, a) {
          var i = r;
          if (0 === (1 & t) && 0 === (2 & t) && null !== r)
            e: for (;;) {
              if (null === r) return;
              var o = r.tag;
              if (3 === o || 4 === o) {
                var s = r.stateNode.containerInfo;
                if (s === a || (8 === s.nodeType && s.parentNode === a)) break;
                if (4 === o)
                  for (o = r.return; null !== o; ) {
                    var l = o.tag;
                    if (
                      (3 === l || 4 === l) &&
                      ((l = o.stateNode.containerInfo) === a ||
                        (8 === l.nodeType && l.parentNode === a))
                    )
                      return;
                    o = o.return;
                  }
                for (; null !== s; ) {
                  if (null === (o = va(s))) return;
                  if (5 === (l = o.tag) || 6 === l) {
                    r = i = o;
                    continue e;
                  }
                  s = s.parentNode;
                }
              }
              r = r.return;
            }
          Re(function () {
            var r = i,
              a = we(n),
              o = [];
            e: {
              var s = Or.get(e);
              if (void 0 !== s) {
                var l = un,
                  c = e;
                switch (e) {
                  case "keypress":
                    if (0 === tn(n)) break e;
                  case "keydown":
                  case "keyup":
                    l = _n;
                    break;
                  case "focusin":
                    ((c = "focus"), (l = gn));
                    break;
                  case "focusout":
                    ((c = "blur"), (l = gn));
                    break;
                  case "beforeblur":
                  case "afterblur":
                    l = gn;
                    break;
                  case "click":
                    if (2 === n.button) break e;
                  case "auxclick":
                  case "dblclick":
                  case "mousedown":
                  case "mousemove":
                  case "mouseup":
                  case "mouseout":
                  case "mouseover":
                  case "contextmenu":
                    l = pn;
                    break;
                  case "drag":
                  case "dragend":
                  case "dragenter":
                  case "dragexit":
                  case "dragleave":
                  case "dragover":
                  case "dragstart":
                  case "drop":
                    l = mn;
                    break;
                  case "touchcancel":
                  case "touchend":
                  case "touchmove":
                  case "touchstart":
                    l = Pn;
                    break;
                  case Er:
                  case _r:
                  case Cr:
                    l = yn;
                    break;
                  case Pr:
                    l = On;
                    break;
                  case "scroll":
                    l = fn;
                    break;
                  case "wheel":
                    l = Tn;
                    break;
                  case "copy":
                  case "cut":
                  case "paste":
                    l = bn;
                    break;
                  case "gotpointercapture":
                  case "lostpointercapture":
                  case "pointercancel":
                  case "pointerdown":
                  case "pointermove":
                  case "pointerout":
                  case "pointerover":
                  case "pointerup":
                    l = Cn;
                }
                var u = 0 !== (4 & t),
                  d = !u && "scroll" === e,
                  f = u ? (null !== s ? s + "Capture" : null) : s;
                u = [];
                for (var h, p = r; null !== p; ) {
                  var m = (h = p).stateNode;
                  if (
                    (5 === h.tag &&
                      null !== m &&
                      ((h = m),
                      null !== f &&
                        null != (m = Te(p, f)) &&
                        u.push(Wr(p, m, h))),
                    d)
                  )
                    break;
                  p = p.return;
                }
                0 < u.length &&
                  ((s = new l(s, c, null, n, a)),
                  o.push({ event: s, listeners: u }));
              }
            }
            if (0 === (7 & t)) {
              if (
                ((l = "mouseout" === e || "pointerout" === e),
                (!(s = "mouseover" === e || "pointerover" === e) ||
                  n === xe ||
                  !(c = n.relatedTarget || n.fromElement) ||
                  (!va(c) && !c[pa])) &&
                  (l || s) &&
                  ((s =
                    a.window === a
                      ? a
                      : (s = a.ownerDocument)
                        ? s.defaultView || s.parentWindow
                        : window),
                  l
                    ? ((l = r),
                      null !==
                        (c = (c = n.relatedTarget || n.toElement)
                          ? va(c)
                          : null) &&
                        (c !== (d = qe(c)) || (5 !== c.tag && 6 !== c.tag)) &&
                        (c = null))
                    : ((l = null), (c = r)),
                  l !== c))
              ) {
                if (
                  ((u = pn),
                  (m = "onMouseLeave"),
                  (f = "onMouseEnter"),
                  (p = "mouse"),
                  ("pointerout" !== e && "pointerover" !== e) ||
                    ((u = Cn),
                    (m = "onPointerLeave"),
                    (f = "onPointerEnter"),
                    (p = "pointer")),
                  (d = null == l ? s : xa(l)),
                  (h = null == c ? s : xa(c)),
                  ((s = new u(m, p + "leave", l, n, a)).target = d),
                  (s.relatedTarget = h),
                  (m = null),
                  va(a) === r &&
                    (((u = new u(f, p + "enter", c, n, a)).target = h),
                    (u.relatedTarget = d),
                    (m = u)),
                  (d = m),
                  l && c)
                )
                  e: {
                    for (f = c, p = 0, h = u = l; h; h = Kr(h)) p++;
                    for (h = 0, m = f; m; m = Kr(m)) h++;
                    for (; 0 < p - h; ) ((u = Kr(u)), p--);
                    for (; 0 < h - p; ) ((f = Kr(f)), h--);
                    for (; p--; ) {
                      if (u === f || (null !== f && u === f.alternate)) break e;
                      ((u = Kr(u)), (f = Kr(f)));
                    }
                    u = null;
                  }
                else u = null;
                (null !== l && Qr(o, s, l, u, !1),
                  null !== c && null !== d && Qr(o, d, c, u, !0));
              }
              if (
                "select" ===
                  (l =
                    (s = r ? xa(r) : window).nodeName &&
                    s.nodeName.toLowerCase()) ||
                ("input" === l && "file" === s.type)
              )
                var g = Jn;
              else if (Hn(s))
                if (Xn) g = or;
                else {
                  g = ar;
                  var y = rr;
                }
              else
                (l = s.nodeName) &&
                  "input" === l.toLowerCase() &&
                  ("checkbox" === s.type || "radio" === s.type) &&
                  (g = ir);
              switch (
                (g && (g = g(e, r))
                  ? Wn(o, g, n, a)
                  : (y && y(e, s, r),
                    "focusout" === e &&
                      (y = s._wrapperState) &&
                      y.controlled &&
                      "number" === s.type &&
                      ee(s, "number", s.value)),
                (y = r ? xa(r) : window),
                e)
              ) {
                case "focusin":
                  (Hn(y) || "true" === y.contentEditable) &&
                    ((gr = y), (yr = r), (vr = null));
                  break;
                case "focusout":
                  vr = yr = gr = null;
                  break;
                case "mousedown":
                  br = !0;
                  break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                  ((br = !1), xr(o, n, a));
                  break;
                case "selectionchange":
                  if (mr) break;
                case "keydown":
                case "keyup":
                  xr(o, n, a);
              }
              var v;
              if (An)
                e: {
                  switch (e) {
                    case "compositionstart":
                      var b = "onCompositionStart";
                      break e;
                    case "compositionend":
                      b = "onCompositionEnd";
                      break e;
                    case "compositionupdate":
                      b = "onCompositionUpdate";
                      break e;
                  }
                  b = void 0;
                }
              else
                qn
                  ? Un(e, n) && (b = "onCompositionEnd")
                  : "keydown" === e &&
                    229 === n.keyCode &&
                    (b = "onCompositionStart");
              (b &&
                (Mn &&
                  "ko" !== n.locale &&
                  (qn || "onCompositionStart" !== b
                    ? "onCompositionEnd" === b && qn && (v = en())
                    : ((Gt = "value" in (Xt = a) ? Xt.value : Xt.textContent),
                      (qn = !0))),
                0 < (y = $r(r, b)).length &&
                  ((b = new xn(b, e, null, n, a)),
                  o.push({ event: b, listeners: y }),
                  v ? (b.data = v) : null !== (v = In(n)) && (b.data = v))),
                (v = Fn
                  ? (function (e, t) {
                      switch (e) {
                        case "compositionend":
                          return In(t);
                        case "keypress":
                          return 32 !== t.which ? null : ((Dn = !0), Bn);
                        case "textInput":
                          return (e = t.data) === Bn && Dn ? null : e;
                        default:
                          return null;
                      }
                    })(e, n)
                  : (function (e, t) {
                      if (qn)
                        return "compositionend" === e || (!An && Un(e, t))
                          ? ((e = en()), (Zt = Gt = Xt = null), (qn = !1), e)
                          : null;
                      switch (e) {
                        case "paste":
                        default:
                          return null;
                        case "keypress":
                          if (
                            !(t.ctrlKey || t.altKey || t.metaKey) ||
                            (t.ctrlKey && t.altKey)
                          ) {
                            if (t.char && 1 < t.char.length) return t.char;
                            if (t.which) return String.fromCharCode(t.which);
                          }
                          return null;
                        case "compositionend":
                          return Mn && "ko" !== t.locale ? null : t.data;
                      }
                    })(e, n)) &&
                  0 < (r = $r(r, "onBeforeInput")).length &&
                  ((a = new xn("onBeforeInput", "beforeinput", null, n, a)),
                  o.push({ event: a, listeners: r }),
                  (a.data = v)));
            }
            Br(o, t);
          });
        }
        function Wr(e, t, n) {
          return { instance: e, listener: t, currentTarget: n };
        }
        function $r(e, t) {
          for (var n = t + "Capture", r = []; null !== e; ) {
            var a = e,
              i = a.stateNode;
            (5 === a.tag &&
              null !== i &&
              ((a = i),
              null != (i = Te(e, n)) && r.unshift(Wr(e, i, a)),
              null != (i = Te(e, t)) && r.push(Wr(e, i, a))),
              (e = e.return));
          }
          return r;
        }
        function Kr(e) {
          if (null === e) return null;
          do {
            e = e.return;
          } while (e && 5 !== e.tag);
          return e || null;
        }
        function Qr(e, t, n, r, a) {
          for (var i = t._reactName, o = []; null !== n && n !== r; ) {
            var s = n,
              l = s.alternate,
              c = s.stateNode;
            if (null !== l && l === r) break;
            (5 === s.tag &&
              null !== c &&
              ((s = c),
              a
                ? null != (l = Te(n, i)) && o.unshift(Wr(n, l, s))
                : a || (null != (l = Te(n, i)) && o.push(Wr(n, l, s)))),
              (n = n.return));
          }
          0 !== o.length && e.push({ event: t, listeners: o });
        }
        var Yr = /\r\n?/g,
          Jr = /\u0000|\uFFFD/g;
        function Xr(e) {
          return ("string" === typeof e ? e : "" + e)
            .replace(Yr, "\n")
            .replace(Jr, "");
        }
        function Gr(e, t, n) {
          if (((t = Xr(t)), Xr(e) !== t && n)) throw Error(i(425));
        }
        function Zr() {}
        var ea = null,
          ta = null;
        function na(e, t) {
          return (
            "textarea" === e ||
            "noscript" === e ||
            "string" === typeof t.children ||
            "number" === typeof t.children ||
            ("object" === typeof t.dangerouslySetInnerHTML &&
              null !== t.dangerouslySetInnerHTML &&
              null != t.dangerouslySetInnerHTML.__html)
          );
        }
        var ra = "function" === typeof setTimeout ? setTimeout : void 0,
          aa = "function" === typeof clearTimeout ? clearTimeout : void 0,
          ia = "function" === typeof Promise ? Promise : void 0,
          oa =
            "function" === typeof queueMicrotask
              ? queueMicrotask
              : "undefined" !== typeof ia
                ? function (e) {
                    return ia.resolve(null).then(e).catch(sa);
                  }
                : ra;
        function sa(e) {
          setTimeout(function () {
            throw e;
          });
        }
        function la(e, t) {
          var n = t,
            r = 0;
          do {
            var a = n.nextSibling;
            if ((e.removeChild(n), a && 8 === a.nodeType))
              if ("/$" === (n = a.data)) {
                if (0 === r) return (e.removeChild(a), void qt(t));
                r--;
              } else ("$" !== n && "$?" !== n && "$!" !== n) || r++;
            n = a;
          } while (n);
          qt(t);
        }
        function ca(e) {
          for (; null != e; e = e.nextSibling) {
            var t = e.nodeType;
            if (1 === t || 3 === t) break;
            if (8 === t) {
              if ("$" === (t = e.data) || "$!" === t || "$?" === t) break;
              if ("/$" === t) return null;
            }
          }
          return e;
        }
        function ua(e) {
          e = e.previousSibling;
          for (var t = 0; e; ) {
            if (8 === e.nodeType) {
              var n = e.data;
              if ("$" === n || "$!" === n || "$?" === n) {
                if (0 === t) return e;
                t--;
              } else "/$" === n && t++;
            }
            e = e.previousSibling;
          }
          return null;
        }
        var da = Math.random().toString(36).slice(2),
          fa = "__reactFiber$" + da,
          ha = "__reactProps$" + da,
          pa = "__reactContainer$" + da,
          ma = "__reactEvents$" + da,
          ga = "__reactListeners$" + da,
          ya = "__reactHandles$" + da;
        function va(e) {
          var t = e[fa];
          if (t) return t;
          for (var n = e.parentNode; n; ) {
            if ((t = n[pa] || n[fa])) {
              if (
                ((n = t.alternate),
                null !== t.child || (null !== n && null !== n.child))
              )
                for (e = ua(e); null !== e; ) {
                  if ((n = e[fa])) return n;
                  e = ua(e);
                }
              return t;
            }
            n = (e = n).parentNode;
          }
          return null;
        }
        function ba(e) {
          return !(e = e[fa] || e[pa]) ||
            (5 !== e.tag && 6 !== e.tag && 13 !== e.tag && 3 !== e.tag)
            ? null
            : e;
        }
        function xa(e) {
          if (5 === e.tag || 6 === e.tag) return e.stateNode;
          throw Error(i(33));
        }
        function wa(e) {
          return e[ha] || null;
        }
        var ka = [],
          Sa = -1;
        function ja(e) {
          return { current: e };
        }
        function Na(e) {
          0 > Sa || ((e.current = ka[Sa]), (ka[Sa] = null), Sa--);
        }
        function Ea(e, t) {
          (Sa++, (ka[Sa] = e.current), (e.current = t));
        }
        var _a = {},
          Ca = ja(_a),
          Pa = ja(!1),
          Oa = _a;
        function Ra(e, t) {
          var n = e.type.contextTypes;
          if (!n) return _a;
          var r = e.stateNode;
          if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
            return r.__reactInternalMemoizedMaskedChildContext;
          var a,
            i = {};
          for (a in n) i[a] = t[a];
          return (
            r &&
              (((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext =
                t),
              (e.__reactInternalMemoizedMaskedChildContext = i)),
            i
          );
        }
        function Ta(e) {
          return null !== (e = e.childContextTypes) && void 0 !== e;
        }
        function La() {
          (Na(Pa), Na(Ca));
        }
        function Aa(e, t, n) {
          if (Ca.current !== _a) throw Error(i(168));
          (Ea(Ca, t), Ea(Pa, n));
        }
        function za(e, t, n) {
          var r = e.stateNode;
          if (
            ((t = t.childContextTypes), "function" !== typeof r.getChildContext)
          )
            return n;
          for (var a in (r = r.getChildContext()))
            if (!(a in t)) throw Error(i(108, V(e) || "Unknown", a));
          return M({}, n, r);
        }
        function Fa(e) {
          return (
            (e =
              ((e = e.stateNode) &&
                e.__reactInternalMemoizedMergedChildContext) ||
              _a),
            (Oa = Ca.current),
            Ea(Ca, e),
            Ea(Pa, Pa.current),
            !0
          );
        }
        function Ma(e, t, n) {
          var r = e.stateNode;
          if (!r) throw Error(i(169));
          (n
            ? ((e = za(e, t, Oa)),
              (r.__reactInternalMemoizedMergedChildContext = e),
              Na(Pa),
              Na(Ca),
              Ea(Ca, e))
            : Na(Pa),
            Ea(Pa, n));
        }
        var Ba = null,
          Da = !1,
          Ua = !1;
        function Ia(e) {
          null === Ba ? (Ba = [e]) : Ba.push(e);
        }
        function qa() {
          if (!Ua && null !== Ba) {
            Ua = !0;
            var e = 0,
              t = bt;
            try {
              var n = Ba;
              for (bt = 1; e < n.length; e++) {
                var r = n[e];
                do {
                  r = r(!0);
                } while (null !== r);
              }
              ((Ba = null), (Da = !1));
            } catch (a) {
              throw (null !== Ba && (Ba = Ba.slice(e + 1)), Ke(Ze, qa), a);
            } finally {
              ((bt = t), (Ua = !1));
            }
          }
          return null;
        }
        var Va = [],
          Ha = 0,
          Wa = null,
          $a = 0,
          Ka = [],
          Qa = 0,
          Ya = null,
          Ja = 1,
          Xa = "";
        function Ga(e, t) {
          ((Va[Ha++] = $a), (Va[Ha++] = Wa), (Wa = e), ($a = t));
        }
        function Za(e, t, n) {
          ((Ka[Qa++] = Ja), (Ka[Qa++] = Xa), (Ka[Qa++] = Ya), (Ya = e));
          var r = Ja;
          e = Xa;
          var a = 32 - ot(r) - 1;
          ((r &= ~(1 << a)), (n += 1));
          var i = 32 - ot(t) + a;
          if (30 < i) {
            var o = a - (a % 5);
            ((i = (r & ((1 << o) - 1)).toString(32)),
              (r >>= o),
              (a -= o),
              (Ja = (1 << (32 - ot(t) + a)) | (n << a) | r),
              (Xa = i + e));
          } else ((Ja = (1 << i) | (n << a) | r), (Xa = e));
        }
        function ei(e) {
          null !== e.return && (Ga(e, 1), Za(e, 1, 0));
        }
        function ti(e) {
          for (; e === Wa; )
            ((Wa = Va[--Ha]),
              (Va[Ha] = null),
              ($a = Va[--Ha]),
              (Va[Ha] = null));
          for (; e === Ya; )
            ((Ya = Ka[--Qa]),
              (Ka[Qa] = null),
              (Xa = Ka[--Qa]),
              (Ka[Qa] = null),
              (Ja = Ka[--Qa]),
              (Ka[Qa] = null));
        }
        var ni = null,
          ri = null,
          ai = !1,
          ii = null;
        function oi(e, t) {
          var n = Oc(5, null, null, 0);
          ((n.elementType = "DELETED"),
            (n.stateNode = t),
            (n.return = e),
            null === (t = e.deletions)
              ? ((e.deletions = [n]), (e.flags |= 16))
              : t.push(n));
        }
        function si(e, t) {
          switch (e.tag) {
            case 5:
              var n = e.type;
              return (
                null !==
                  (t =
                    1 !== t.nodeType ||
                    n.toLowerCase() !== t.nodeName.toLowerCase()
                      ? null
                      : t) &&
                ((e.stateNode = t), (ni = e), (ri = ca(t.firstChild)), !0)
              );
            case 6:
              return (
                null !==
                  (t = "" === e.pendingProps || 3 !== t.nodeType ? null : t) &&
                ((e.stateNode = t), (ni = e), (ri = null), !0)
              );
            case 13:
              return (
                null !== (t = 8 !== t.nodeType ? null : t) &&
                ((n = null !== Ya ? { id: Ja, overflow: Xa } : null),
                (e.memoizedState = {
                  dehydrated: t,
                  treeContext: n,
                  retryLane: 1073741824,
                }),
                ((n = Oc(18, null, null, 0)).stateNode = t),
                (n.return = e),
                (e.child = n),
                (ni = e),
                (ri = null),
                !0)
              );
            default:
              return !1;
          }
        }
        function li(e) {
          return 0 !== (1 & e.mode) && 0 === (128 & e.flags);
        }
        function ci(e) {
          if (ai) {
            var t = ri;
            if (t) {
              var n = t;
              if (!si(e, t)) {
                if (li(e)) throw Error(i(418));
                t = ca(n.nextSibling);
                var r = ni;
                t && si(e, t)
                  ? oi(r, n)
                  : ((e.flags = (-4097 & e.flags) | 2), (ai = !1), (ni = e));
              }
            } else {
              if (li(e)) throw Error(i(418));
              ((e.flags = (-4097 & e.flags) | 2), (ai = !1), (ni = e));
            }
          }
        }
        function ui(e) {
          for (
            e = e.return;
            null !== e && 5 !== e.tag && 3 !== e.tag && 13 !== e.tag;
          )
            e = e.return;
          ni = e;
        }
        function di(e) {
          if (e !== ni) return !1;
          if (!ai) return (ui(e), (ai = !0), !1);
          var t;
          if (
            ((t = 3 !== e.tag) &&
              !(t = 5 !== e.tag) &&
              (t =
                "head" !== (t = e.type) &&
                "body" !== t &&
                !na(e.type, e.memoizedProps)),
            t && (t = ri))
          ) {
            if (li(e)) throw (fi(), Error(i(418)));
            for (; t; ) (oi(e, t), (t = ca(t.nextSibling)));
          }
          if ((ui(e), 13 === e.tag)) {
            if (!(e = null !== (e = e.memoizedState) ? e.dehydrated : null))
              throw Error(i(317));
            e: {
              for (e = e.nextSibling, t = 0; e; ) {
                if (8 === e.nodeType) {
                  var n = e.data;
                  if ("/$" === n) {
                    if (0 === t) {
                      ri = ca(e.nextSibling);
                      break e;
                    }
                    t--;
                  } else ("$" !== n && "$!" !== n && "$?" !== n) || t++;
                }
                e = e.nextSibling;
              }
              ri = null;
            }
          } else ri = ni ? ca(e.stateNode.nextSibling) : null;
          return !0;
        }
        function fi() {
          for (var e = ri; e; ) e = ca(e.nextSibling);
        }
        function hi() {
          ((ri = ni = null), (ai = !1));
        }
        function pi(e) {
          null === ii ? (ii = [e]) : ii.push(e);
        }
        var mi = x.ReactCurrentBatchConfig;
        function gi(e, t, n) {
          if (
            null !== (e = n.ref) &&
            "function" !== typeof e &&
            "object" !== typeof e
          ) {
            if (n._owner) {
              if ((n = n._owner)) {
                if (1 !== n.tag) throw Error(i(309));
                var r = n.stateNode;
              }
              if (!r) throw Error(i(147, e));
              var a = r,
                o = "" + e;
              return null !== t &&
                null !== t.ref &&
                "function" === typeof t.ref &&
                t.ref._stringRef === o
                ? t.ref
                : ((t = function (e) {
                    var t = a.refs;
                    null === e ? delete t[o] : (t[o] = e);
                  }),
                  (t._stringRef = o),
                  t);
            }
            if ("string" !== typeof e) throw Error(i(284));
            if (!n._owner) throw Error(i(290, e));
          }
          return e;
        }
        function yi(e, t) {
          throw (
            (e = Object.prototype.toString.call(t)),
            Error(
              i(
                31,
                "[object Object]" === e
                  ? "object with keys {" + Object.keys(t).join(", ") + "}"
                  : e,
              ),
            )
          );
        }
        function vi(e) {
          return (0, e._init)(e._payload);
        }
        function bi(e) {
          function t(t, n) {
            if (e) {
              var r = t.deletions;
              null === r ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
            }
          }
          function n(n, r) {
            if (!e) return null;
            for (; null !== r; ) (t(n, r), (r = r.sibling));
            return null;
          }
          function r(e, t) {
            for (e = new Map(); null !== t; )
              (null !== t.key ? e.set(t.key, t) : e.set(t.index, t),
                (t = t.sibling));
            return e;
          }
          function a(e, t) {
            return (((e = Tc(e, t)).index = 0), (e.sibling = null), e);
          }
          function o(t, n, r) {
            return (
              (t.index = r),
              e
                ? null !== (r = t.alternate)
                  ? (r = r.index) < n
                    ? ((t.flags |= 2), n)
                    : r
                  : ((t.flags |= 2), n)
                : ((t.flags |= 1048576), n)
            );
          }
          function s(t) {
            return (e && null === t.alternate && (t.flags |= 2), t);
          }
          function l(e, t, n, r) {
            return null === t || 6 !== t.tag
              ? (((t = Fc(n, e.mode, r)).return = e), t)
              : (((t = a(t, n)).return = e), t);
          }
          function c(e, t, n, r) {
            var i = n.type;
            return i === S
              ? d(e, t, n.props.children, r, n.key)
              : null !== t &&
                  (t.elementType === i ||
                    ("object" === typeof i &&
                      null !== i &&
                      i.$$typeof === T &&
                      vi(i) === t.type))
                ? (((r = a(t, n.props)).ref = gi(e, t, n)), (r.return = e), r)
                : (((r = Lc(n.type, n.key, n.props, null, e.mode, r)).ref = gi(
                    e,
                    t,
                    n,
                  )),
                  (r.return = e),
                  r);
          }
          function u(e, t, n, r) {
            return null === t ||
              4 !== t.tag ||
              t.stateNode.containerInfo !== n.containerInfo ||
              t.stateNode.implementation !== n.implementation
              ? (((t = Mc(n, e.mode, r)).return = e), t)
              : (((t = a(t, n.children || [])).return = e), t);
          }
          function d(e, t, n, r, i) {
            return null === t || 7 !== t.tag
              ? (((t = Ac(n, e.mode, r, i)).return = e), t)
              : (((t = a(t, n)).return = e), t);
          }
          function f(e, t, n) {
            if (("string" === typeof t && "" !== t) || "number" === typeof t)
              return (((t = Fc("" + t, e.mode, n)).return = e), t);
            if ("object" === typeof t && null !== t) {
              switch (t.$$typeof) {
                case w:
                  return (
                    ((n = Lc(t.type, t.key, t.props, null, e.mode, n)).ref = gi(
                      e,
                      null,
                      t,
                    )),
                    (n.return = e),
                    n
                  );
                case k:
                  return (((t = Mc(t, e.mode, n)).return = e), t);
                case T:
                  return f(e, (0, t._init)(t._payload), n);
              }
              if (te(t) || z(t))
                return (((t = Ac(t, e.mode, n, null)).return = e), t);
              yi(e, t);
            }
            return null;
          }
          function h(e, t, n, r) {
            var a = null !== t ? t.key : null;
            if (("string" === typeof n && "" !== n) || "number" === typeof n)
              return null !== a ? null : l(e, t, "" + n, r);
            if ("object" === typeof n && null !== n) {
              switch (n.$$typeof) {
                case w:
                  return n.key === a ? c(e, t, n, r) : null;
                case k:
                  return n.key === a ? u(e, t, n, r) : null;
                case T:
                  return h(e, t, (a = n._init)(n._payload), r);
              }
              if (te(n) || z(n)) return null !== a ? null : d(e, t, n, r, null);
              yi(e, n);
            }
            return null;
          }
          function p(e, t, n, r, a) {
            if (("string" === typeof r && "" !== r) || "number" === typeof r)
              return l(t, (e = e.get(n) || null), "" + r, a);
            if ("object" === typeof r && null !== r) {
              switch (r.$$typeof) {
                case w:
                  return c(
                    t,
                    (e = e.get(null === r.key ? n : r.key) || null),
                    r,
                    a,
                  );
                case k:
                  return u(
                    t,
                    (e = e.get(null === r.key ? n : r.key) || null),
                    r,
                    a,
                  );
                case T:
                  return p(e, t, n, (0, r._init)(r._payload), a);
              }
              if (te(r) || z(r))
                return d(t, (e = e.get(n) || null), r, a, null);
              yi(t, r);
            }
            return null;
          }
          function m(a, i, s, l) {
            for (
              var c = null, u = null, d = i, m = (i = 0), g = null;
              null !== d && m < s.length;
              m++
            ) {
              d.index > m ? ((g = d), (d = null)) : (g = d.sibling);
              var y = h(a, d, s[m], l);
              if (null === y) {
                null === d && (d = g);
                break;
              }
              (e && d && null === y.alternate && t(a, d),
                (i = o(y, i, m)),
                null === u ? (c = y) : (u.sibling = y),
                (u = y),
                (d = g));
            }
            if (m === s.length) return (n(a, d), ai && Ga(a, m), c);
            if (null === d) {
              for (; m < s.length; m++)
                null !== (d = f(a, s[m], l)) &&
                  ((i = o(d, i, m)),
                  null === u ? (c = d) : (u.sibling = d),
                  (u = d));
              return (ai && Ga(a, m), c);
            }
            for (d = r(a, d); m < s.length; m++)
              null !== (g = p(d, a, m, s[m], l)) &&
                (e &&
                  null !== g.alternate &&
                  d.delete(null === g.key ? m : g.key),
                (i = o(g, i, m)),
                null === u ? (c = g) : (u.sibling = g),
                (u = g));
            return (
              e &&
                d.forEach(function (e) {
                  return t(a, e);
                }),
              ai && Ga(a, m),
              c
            );
          }
          function g(a, s, l, c) {
            var u = z(l);
            if ("function" !== typeof u) throw Error(i(150));
            if (null == (l = u.call(l))) throw Error(i(151));
            for (
              var d = (u = null), m = s, g = (s = 0), y = null, v = l.next();
              null !== m && !v.done;
              g++, v = l.next()
            ) {
              m.index > g ? ((y = m), (m = null)) : (y = m.sibling);
              var b = h(a, m, v.value, c);
              if (null === b) {
                null === m && (m = y);
                break;
              }
              (e && m && null === b.alternate && t(a, m),
                (s = o(b, s, g)),
                null === d ? (u = b) : (d.sibling = b),
                (d = b),
                (m = y));
            }
            if (v.done) return (n(a, m), ai && Ga(a, g), u);
            if (null === m) {
              for (; !v.done; g++, v = l.next())
                null !== (v = f(a, v.value, c)) &&
                  ((s = o(v, s, g)),
                  null === d ? (u = v) : (d.sibling = v),
                  (d = v));
              return (ai && Ga(a, g), u);
            }
            for (m = r(a, m); !v.done; g++, v = l.next())
              null !== (v = p(m, a, g, v.value, c)) &&
                (e &&
                  null !== v.alternate &&
                  m.delete(null === v.key ? g : v.key),
                (s = o(v, s, g)),
                null === d ? (u = v) : (d.sibling = v),
                (d = v));
            return (
              e &&
                m.forEach(function (e) {
                  return t(a, e);
                }),
              ai && Ga(a, g),
              u
            );
          }
          return function e(r, i, o, l) {
            if (
              ("object" === typeof o &&
                null !== o &&
                o.type === S &&
                null === o.key &&
                (o = o.props.children),
              "object" === typeof o && null !== o)
            ) {
              switch (o.$$typeof) {
                case w:
                  e: {
                    for (var c = o.key, u = i; null !== u; ) {
                      if (u.key === c) {
                        if ((c = o.type) === S) {
                          if (7 === u.tag) {
                            (n(r, u.sibling),
                              ((i = a(u, o.props.children)).return = r),
                              (r = i));
                            break e;
                          }
                        } else if (
                          u.elementType === c ||
                          ("object" === typeof c &&
                            null !== c &&
                            c.$$typeof === T &&
                            vi(c) === u.type)
                        ) {
                          (n(r, u.sibling),
                            ((i = a(u, o.props)).ref = gi(r, u, o)),
                            (i.return = r),
                            (r = i));
                          break e;
                        }
                        n(r, u);
                        break;
                      }
                      (t(r, u), (u = u.sibling));
                    }
                    o.type === S
                      ? (((i = Ac(o.props.children, r.mode, l, o.key)).return =
                          r),
                        (r = i))
                      : (((l = Lc(
                          o.type,
                          o.key,
                          o.props,
                          null,
                          r.mode,
                          l,
                        )).ref = gi(r, i, o)),
                        (l.return = r),
                        (r = l));
                  }
                  return s(r);
                case k:
                  e: {
                    for (u = o.key; null !== i; ) {
                      if (i.key === u) {
                        if (
                          4 === i.tag &&
                          i.stateNode.containerInfo === o.containerInfo &&
                          i.stateNode.implementation === o.implementation
                        ) {
                          (n(r, i.sibling),
                            ((i = a(i, o.children || [])).return = r),
                            (r = i));
                          break e;
                        }
                        n(r, i);
                        break;
                      }
                      (t(r, i), (i = i.sibling));
                    }
                    (((i = Mc(o, r.mode, l)).return = r), (r = i));
                  }
                  return s(r);
                case T:
                  return e(r, i, (u = o._init)(o._payload), l);
              }
              if (te(o)) return m(r, i, o, l);
              if (z(o)) return g(r, i, o, l);
              yi(r, o);
            }
            return ("string" === typeof o && "" !== o) || "number" === typeof o
              ? ((o = "" + o),
                null !== i && 6 === i.tag
                  ? (n(r, i.sibling), ((i = a(i, o)).return = r), (r = i))
                  : (n(r, i), ((i = Fc(o, r.mode, l)).return = r), (r = i)),
                s(r))
              : n(r, i);
          };
        }
        var xi = bi(!0),
          wi = bi(!1),
          ki = ja(null),
          Si = null,
          ji = null,
          Ni = null;
        function Ei() {
          Ni = ji = Si = null;
        }
        function _i(e) {
          var t = ki.current;
          (Na(ki), (e._currentValue = t));
        }
        function Ci(e, t, n) {
          for (; null !== e; ) {
            var r = e.alternate;
            if (
              ((e.childLanes & t) !== t
                ? ((e.childLanes |= t), null !== r && (r.childLanes |= t))
                : null !== r && (r.childLanes & t) !== t && (r.childLanes |= t),
              e === n)
            )
              break;
            e = e.return;
          }
        }
        function Pi(e, t) {
          ((Si = e),
            (Ni = ji = null),
            null !== (e = e.dependencies) &&
              null !== e.firstContext &&
              (0 !== (e.lanes & t) && (bs = !0), (e.firstContext = null)));
        }
        function Oi(e) {
          var t = e._currentValue;
          if (Ni !== e)
            if (
              ((e = { context: e, memoizedValue: t, next: null }), null === ji)
            ) {
              if (null === Si) throw Error(i(308));
              ((ji = e), (Si.dependencies = { lanes: 0, firstContext: e }));
            } else ji = ji.next = e;
          return t;
        }
        var Ri = null;
        function Ti(e) {
          null === Ri ? (Ri = [e]) : Ri.push(e);
        }
        function Li(e, t, n, r) {
          var a = t.interleaved;
          return (
            null === a
              ? ((n.next = n), Ti(t))
              : ((n.next = a.next), (a.next = n)),
            (t.interleaved = n),
            Ai(e, r)
          );
        }
        function Ai(e, t) {
          e.lanes |= t;
          var n = e.alternate;
          for (null !== n && (n.lanes |= t), n = e, e = e.return; null !== e; )
            ((e.childLanes |= t),
              null !== (n = e.alternate) && (n.childLanes |= t),
              (n = e),
              (e = e.return));
          return 3 === n.tag ? n.stateNode : null;
        }
        var zi = !1;
        function Fi(e) {
          e.updateQueue = {
            baseState: e.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: { pending: null, interleaved: null, lanes: 0 },
            effects: null,
          };
        }
        function Mi(e, t) {
          ((e = e.updateQueue),
            t.updateQueue === e &&
              (t.updateQueue = {
                baseState: e.baseState,
                firstBaseUpdate: e.firstBaseUpdate,
                lastBaseUpdate: e.lastBaseUpdate,
                shared: e.shared,
                effects: e.effects,
              }));
        }
        function Bi(e, t) {
          return {
            eventTime: e,
            lane: t,
            tag: 0,
            payload: null,
            callback: null,
            next: null,
          };
        }
        function Di(e, t, n) {
          var r = e.updateQueue;
          if (null === r) return null;
          if (((r = r.shared), 0 !== (2 & _l))) {
            var a = r.pending;
            return (
              null === a ? (t.next = t) : ((t.next = a.next), (a.next = t)),
              (r.pending = t),
              Ai(e, n)
            );
          }
          return (
            null === (a = r.interleaved)
              ? ((t.next = t), Ti(r))
              : ((t.next = a.next), (a.next = t)),
            (r.interleaved = t),
            Ai(e, n)
          );
        }
        function Ui(e, t, n) {
          if (
            null !== (t = t.updateQueue) &&
            ((t = t.shared), 0 !== (4194240 & n))
          ) {
            var r = t.lanes;
            ((n |= r &= e.pendingLanes), (t.lanes = n), vt(e, n));
          }
        }
        function Ii(e, t) {
          var n = e.updateQueue,
            r = e.alternate;
          if (null !== r && n === (r = r.updateQueue)) {
            var a = null,
              i = null;
            if (null !== (n = n.firstBaseUpdate)) {
              do {
                var o = {
                  eventTime: n.eventTime,
                  lane: n.lane,
                  tag: n.tag,
                  payload: n.payload,
                  callback: n.callback,
                  next: null,
                };
                (null === i ? (a = i = o) : (i = i.next = o), (n = n.next));
              } while (null !== n);
              null === i ? (a = i = t) : (i = i.next = t);
            } else a = i = t;
            return (
              (n = {
                baseState: r.baseState,
                firstBaseUpdate: a,
                lastBaseUpdate: i,
                shared: r.shared,
                effects: r.effects,
              }),
              void (e.updateQueue = n)
            );
          }
          (null === (e = n.lastBaseUpdate)
            ? (n.firstBaseUpdate = t)
            : (e.next = t),
            (n.lastBaseUpdate = t));
        }
        function qi(e, t, n, r) {
          var a = e.updateQueue;
          zi = !1;
          var i = a.firstBaseUpdate,
            o = a.lastBaseUpdate,
            s = a.shared.pending;
          if (null !== s) {
            a.shared.pending = null;
            var l = s,
              c = l.next;
            ((l.next = null), null === o ? (i = c) : (o.next = c), (o = l));
            var u = e.alternate;
            null !== u &&
              (s = (u = u.updateQueue).lastBaseUpdate) !== o &&
              (null === s ? (u.firstBaseUpdate = c) : (s.next = c),
              (u.lastBaseUpdate = l));
          }
          if (null !== i) {
            var d = a.baseState;
            for (o = 0, u = c = l = null, s = i; ; ) {
              var f = s.lane,
                h = s.eventTime;
              if ((r & f) === f) {
                null !== u &&
                  (u = u.next =
                    {
                      eventTime: h,
                      lane: 0,
                      tag: s.tag,
                      payload: s.payload,
                      callback: s.callback,
                      next: null,
                    });
                e: {
                  var p = e,
                    m = s;
                  switch (((f = t), (h = n), m.tag)) {
                    case 1:
                      if ("function" === typeof (p = m.payload)) {
                        d = p.call(h, d, f);
                        break e;
                      }
                      d = p;
                      break e;
                    case 3:
                      p.flags = (-65537 & p.flags) | 128;
                    case 0:
                      if (
                        null ===
                          (f =
                            "function" === typeof (p = m.payload)
                              ? p.call(h, d, f)
                              : p) ||
                        void 0 === f
                      )
                        break e;
                      d = M({}, d, f);
                      break e;
                    case 2:
                      zi = !0;
                  }
                }
                null !== s.callback &&
                  0 !== s.lane &&
                  ((e.flags |= 64),
                  null === (f = a.effects) ? (a.effects = [s]) : f.push(s));
              } else
                ((h = {
                  eventTime: h,
                  lane: f,
                  tag: s.tag,
                  payload: s.payload,
                  callback: s.callback,
                  next: null,
                }),
                  null === u ? ((c = u = h), (l = d)) : (u = u.next = h),
                  (o |= f));
              if (null === (s = s.next)) {
                if (null === (s = a.shared.pending)) break;
                ((s = (f = s).next),
                  (f.next = null),
                  (a.lastBaseUpdate = f),
                  (a.shared.pending = null));
              }
            }
            if (
              (null === u && (l = d),
              (a.baseState = l),
              (a.firstBaseUpdate = c),
              (a.lastBaseUpdate = u),
              null !== (t = a.shared.interleaved))
            ) {
              a = t;
              do {
                ((o |= a.lane), (a = a.next));
              } while (a !== t);
            } else null === i && (a.shared.lanes = 0);
            ((zl |= o), (e.lanes = o), (e.memoizedState = d));
          }
        }
        function Vi(e, t, n) {
          if (((e = t.effects), (t.effects = null), null !== e))
            for (t = 0; t < e.length; t++) {
              var r = e[t],
                a = r.callback;
              if (null !== a) {
                if (((r.callback = null), (r = n), "function" !== typeof a))
                  throw Error(i(191, a));
                a.call(r);
              }
            }
        }
        var Hi = {},
          Wi = ja(Hi),
          $i = ja(Hi),
          Ki = ja(Hi);
        function Qi(e) {
          if (e === Hi) throw Error(i(174));
          return e;
        }
        function Yi(e, t) {
          switch ((Ea(Ki, t), Ea($i, e), Ea(Wi, Hi), (e = t.nodeType))) {
            case 9:
            case 11:
              t = (t = t.documentElement) ? t.namespaceURI : le(null, "");
              break;
            default:
              t = le(
                (t = (e = 8 === e ? t.parentNode : t).namespaceURI || null),
                (e = e.tagName),
              );
          }
          (Na(Wi), Ea(Wi, t));
        }
        function Ji() {
          (Na(Wi), Na($i), Na(Ki));
        }
        function Xi(e) {
          Qi(Ki.current);
          var t = Qi(Wi.current),
            n = le(t, e.type);
          t !== n && (Ea($i, e), Ea(Wi, n));
        }
        function Gi(e) {
          $i.current === e && (Na(Wi), Na($i));
        }
        var Zi = ja(0);
        function eo(e) {
          for (var t = e; null !== t; ) {
            if (13 === t.tag) {
              var n = t.memoizedState;
              if (
                null !== n &&
                (null === (n = n.dehydrated) ||
                  "$?" === n.data ||
                  "$!" === n.data)
              )
                return t;
            } else if (19 === t.tag && void 0 !== t.memoizedProps.revealOrder) {
              if (0 !== (128 & t.flags)) return t;
            } else if (null !== t.child) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === e) break;
            for (; null === t.sibling; ) {
              if (null === t.return || t.return === e) return null;
              t = t.return;
            }
            ((t.sibling.return = t.return), (t = t.sibling));
          }
          return null;
        }
        var to = [];
        function no() {
          for (var e = 0; e < to.length; e++)
            to[e]._workInProgressVersionPrimary = null;
          to.length = 0;
        }
        var ro = x.ReactCurrentDispatcher,
          ao = x.ReactCurrentBatchConfig,
          io = 0,
          oo = null,
          so = null,
          lo = null,
          co = !1,
          uo = !1,
          fo = 0,
          ho = 0;
        function po() {
          throw Error(i(321));
        }
        function mo(e, t) {
          if (null === t) return !1;
          for (var n = 0; n < t.length && n < e.length; n++)
            if (!sr(e[n], t[n])) return !1;
          return !0;
        }
        function go(e, t, n, r, a, o) {
          if (
            ((io = o),
            (oo = t),
            (t.memoizedState = null),
            (t.updateQueue = null),
            (t.lanes = 0),
            (ro.current = null === e || null === e.memoizedState ? Zo : es),
            (e = n(r, a)),
            uo)
          ) {
            o = 0;
            do {
              if (((uo = !1), (fo = 0), 25 <= o)) throw Error(i(301));
              ((o += 1),
                (lo = so = null),
                (t.updateQueue = null),
                (ro.current = ts),
                (e = n(r, a)));
            } while (uo);
          }
          if (
            ((ro.current = Go),
            (t = null !== so && null !== so.next),
            (io = 0),
            (lo = so = oo = null),
            (co = !1),
            t)
          )
            throw Error(i(300));
          return e;
        }
        function yo() {
          var e = 0 !== fo;
          return ((fo = 0), e);
        }
        function vo() {
          var e = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null,
          };
          return (
            null === lo ? (oo.memoizedState = lo = e) : (lo = lo.next = e),
            lo
          );
        }
        function bo() {
          if (null === so) {
            var e = oo.alternate;
            e = null !== e ? e.memoizedState : null;
          } else e = so.next;
          var t = null === lo ? oo.memoizedState : lo.next;
          if (null !== t) ((lo = t), (so = e));
          else {
            if (null === e) throw Error(i(310));
            ((e = {
              memoizedState: (so = e).memoizedState,
              baseState: so.baseState,
              baseQueue: so.baseQueue,
              queue: so.queue,
              next: null,
            }),
              null === lo ? (oo.memoizedState = lo = e) : (lo = lo.next = e));
          }
          return lo;
        }
        function xo(e, t) {
          return "function" === typeof t ? t(e) : t;
        }
        function wo(e) {
          var t = bo(),
            n = t.queue;
          if (null === n) throw Error(i(311));
          n.lastRenderedReducer = e;
          var r = so,
            a = r.baseQueue,
            o = n.pending;
          if (null !== o) {
            if (null !== a) {
              var s = a.next;
              ((a.next = o.next), (o.next = s));
            }
            ((r.baseQueue = a = o), (n.pending = null));
          }
          if (null !== a) {
            ((o = a.next), (r = r.baseState));
            var l = (s = null),
              c = null,
              u = o;
            do {
              var d = u.lane;
              if ((io & d) === d)
                (null !== c &&
                  (c = c.next =
                    {
                      lane: 0,
                      action: u.action,
                      hasEagerState: u.hasEagerState,
                      eagerState: u.eagerState,
                      next: null,
                    }),
                  (r = u.hasEagerState ? u.eagerState : e(r, u.action)));
              else {
                var f = {
                  lane: d,
                  action: u.action,
                  hasEagerState: u.hasEagerState,
                  eagerState: u.eagerState,
                  next: null,
                };
                (null === c ? ((l = c = f), (s = r)) : (c = c.next = f),
                  (oo.lanes |= d),
                  (zl |= d));
              }
              u = u.next;
            } while (null !== u && u !== o);
            (null === c ? (s = r) : (c.next = l),
              sr(r, t.memoizedState) || (bs = !0),
              (t.memoizedState = r),
              (t.baseState = s),
              (t.baseQueue = c),
              (n.lastRenderedState = r));
          }
          if (null !== (e = n.interleaved)) {
            a = e;
            do {
              ((o = a.lane), (oo.lanes |= o), (zl |= o), (a = a.next));
            } while (a !== e);
          } else null === a && (n.lanes = 0);
          return [t.memoizedState, n.dispatch];
        }
        function ko(e) {
          var t = bo(),
            n = t.queue;
          if (null === n) throw Error(i(311));
          n.lastRenderedReducer = e;
          var r = n.dispatch,
            a = n.pending,
            o = t.memoizedState;
          if (null !== a) {
            n.pending = null;
            var s = (a = a.next);
            do {
              ((o = e(o, s.action)), (s = s.next));
            } while (s !== a);
            (sr(o, t.memoizedState) || (bs = !0),
              (t.memoizedState = o),
              null === t.baseQueue && (t.baseState = o),
              (n.lastRenderedState = o));
          }
          return [o, r];
        }
        function So() {}
        function jo(e, t) {
          var n = oo,
            r = bo(),
            a = t(),
            o = !sr(r.memoizedState, a);
          if (
            (o && ((r.memoizedState = a), (bs = !0)),
            (r = r.queue),
            Fo(_o.bind(null, n, r, e), [e]),
            r.getSnapshot !== t ||
              o ||
              (null !== lo && 1 & lo.memoizedState.tag))
          ) {
            if (
              ((n.flags |= 2048),
              Ro(9, Eo.bind(null, n, r, a, t), void 0, null),
              null === Cl)
            )
              throw Error(i(349));
            0 !== (30 & io) || No(n, t, a);
          }
          return a;
        }
        function No(e, t, n) {
          ((e.flags |= 16384),
            (e = { getSnapshot: t, value: n }),
            null === (t = oo.updateQueue)
              ? ((t = { lastEffect: null, stores: null }),
                (oo.updateQueue = t),
                (t.stores = [e]))
              : null === (n = t.stores)
                ? (t.stores = [e])
                : n.push(e));
        }
        function Eo(e, t, n, r) {
          ((t.value = n), (t.getSnapshot = r), Co(t) && Po(e));
        }
        function _o(e, t, n) {
          return n(function () {
            Co(t) && Po(e);
          });
        }
        function Co(e) {
          var t = e.getSnapshot;
          e = e.value;
          try {
            var n = t();
            return !sr(e, n);
          } catch (r) {
            return !0;
          }
        }
        function Po(e) {
          var t = Ai(e, 1);
          null !== t && tc(t, e, 1, -1);
        }
        function Oo(e) {
          var t = vo();
          return (
            "function" === typeof e && (e = e()),
            (t.memoizedState = t.baseState = e),
            (e = {
              pending: null,
              interleaved: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: xo,
              lastRenderedState: e,
            }),
            (t.queue = e),
            (e = e.dispatch = Qo.bind(null, oo, e)),
            [t.memoizedState, e]
          );
        }
        function Ro(e, t, n, r) {
          return (
            (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
            null === (t = oo.updateQueue)
              ? ((t = { lastEffect: null, stores: null }),
                (oo.updateQueue = t),
                (t.lastEffect = e.next = e))
              : null === (n = t.lastEffect)
                ? (t.lastEffect = e.next = e)
                : ((r = n.next),
                  (n.next = e),
                  (e.next = r),
                  (t.lastEffect = e)),
            e
          );
        }
        function To() {
          return bo().memoizedState;
        }
        function Lo(e, t, n, r) {
          var a = vo();
          ((oo.flags |= e),
            (a.memoizedState = Ro(1 | t, n, void 0, void 0 === r ? null : r)));
        }
        function Ao(e, t, n, r) {
          var a = bo();
          r = void 0 === r ? null : r;
          var i = void 0;
          if (null !== so) {
            var o = so.memoizedState;
            if (((i = o.destroy), null !== r && mo(r, o.deps)))
              return void (a.memoizedState = Ro(t, n, i, r));
          }
          ((oo.flags |= e), (a.memoizedState = Ro(1 | t, n, i, r)));
        }
        function zo(e, t) {
          return Lo(8390656, 8, e, t);
        }
        function Fo(e, t) {
          return Ao(2048, 8, e, t);
        }
        function Mo(e, t) {
          return Ao(4, 2, e, t);
        }
        function Bo(e, t) {
          return Ao(4, 4, e, t);
        }
        function Do(e, t) {
          return "function" === typeof t
            ? ((e = e()),
              t(e),
              function () {
                t(null);
              })
            : null !== t && void 0 !== t
              ? ((e = e()),
                (t.current = e),
                function () {
                  t.current = null;
                })
              : void 0;
        }
        function Uo(e, t, n) {
          return (
            (n = null !== n && void 0 !== n ? n.concat([e]) : null),
            Ao(4, 4, Do.bind(null, t, e), n)
          );
        }
        function Io() {}
        function qo(e, t) {
          var n = bo();
          t = void 0 === t ? null : t;
          var r = n.memoizedState;
          return null !== r && null !== t && mo(t, r[1])
            ? r[0]
            : ((n.memoizedState = [e, t]), e);
        }
        function Vo(e, t) {
          var n = bo();
          t = void 0 === t ? null : t;
          var r = n.memoizedState;
          return null !== r && null !== t && mo(t, r[1])
            ? r[0]
            : ((e = e()), (n.memoizedState = [e, t]), e);
        }
        function Ho(e, t, n) {
          return 0 === (21 & io)
            ? (e.baseState && ((e.baseState = !1), (bs = !0)),
              (e.memoizedState = n))
            : (sr(n, t) ||
                ((n = mt()), (oo.lanes |= n), (zl |= n), (e.baseState = !0)),
              t);
        }
        function Wo(e, t) {
          var n = bt;
          ((bt = 0 !== n && 4 > n ? n : 4), e(!0));
          var r = ao.transition;
          ao.transition = {};
          try {
            (e(!1), t());
          } finally {
            ((bt = n), (ao.transition = r));
          }
        }
        function $o() {
          return bo().memoizedState;
        }
        function Ko(e, t, n) {
          var r = ec(e);
          if (
            ((n = {
              lane: r,
              action: n,
              hasEagerState: !1,
              eagerState: null,
              next: null,
            }),
            Yo(e))
          )
            Jo(t, n);
          else if (null !== (n = Li(e, t, n, r))) {
            (tc(n, e, r, Zl()), Xo(n, t, r));
          }
        }
        function Qo(e, t, n) {
          var r = ec(e),
            a = {
              lane: r,
              action: n,
              hasEagerState: !1,
              eagerState: null,
              next: null,
            };
          if (Yo(e)) Jo(t, a);
          else {
            var i = e.alternate;
            if (
              0 === e.lanes &&
              (null === i || 0 === i.lanes) &&
              null !== (i = t.lastRenderedReducer)
            )
              try {
                var o = t.lastRenderedState,
                  s = i(o, n);
                if (((a.hasEagerState = !0), (a.eagerState = s), sr(s, o))) {
                  var l = t.interleaved;
                  return (
                    null === l
                      ? ((a.next = a), Ti(t))
                      : ((a.next = l.next), (l.next = a)),
                    void (t.interleaved = a)
                  );
                }
              } catch (c) {}
            null !== (n = Li(e, t, a, r)) &&
              (tc(n, e, r, (a = Zl())), Xo(n, t, r));
          }
        }
        function Yo(e) {
          var t = e.alternate;
          return e === oo || (null !== t && t === oo);
        }
        function Jo(e, t) {
          uo = co = !0;
          var n = e.pending;
          (null === n ? (t.next = t) : ((t.next = n.next), (n.next = t)),
            (e.pending = t));
        }
        function Xo(e, t, n) {
          if (0 !== (4194240 & n)) {
            var r = t.lanes;
            ((n |= r &= e.pendingLanes), (t.lanes = n), vt(e, n));
          }
        }
        var Go = {
            readContext: Oi,
            useCallback: po,
            useContext: po,
            useEffect: po,
            useImperativeHandle: po,
            useInsertionEffect: po,
            useLayoutEffect: po,
            useMemo: po,
            useReducer: po,
            useRef: po,
            useState: po,
            useDebugValue: po,
            useDeferredValue: po,
            useTransition: po,
            useMutableSource: po,
            useSyncExternalStore: po,
            useId: po,
            unstable_isNewReconciler: !1,
          },
          Zo = {
            readContext: Oi,
            useCallback: function (e, t) {
              return ((vo().memoizedState = [e, void 0 === t ? null : t]), e);
            },
            useContext: Oi,
            useEffect: zo,
            useImperativeHandle: function (e, t, n) {
              return (
                (n = null !== n && void 0 !== n ? n.concat([e]) : null),
                Lo(4194308, 4, Do.bind(null, t, e), n)
              );
            },
            useLayoutEffect: function (e, t) {
              return Lo(4194308, 4, e, t);
            },
            useInsertionEffect: function (e, t) {
              return Lo(4, 2, e, t);
            },
            useMemo: function (e, t) {
              var n = vo();
              return (
                (t = void 0 === t ? null : t),
                (e = e()),
                (n.memoizedState = [e, t]),
                e
              );
            },
            useReducer: function (e, t, n) {
              var r = vo();
              return (
                (t = void 0 !== n ? n(t) : t),
                (r.memoizedState = r.baseState = t),
                (e = {
                  pending: null,
                  interleaved: null,
                  lanes: 0,
                  dispatch: null,
                  lastRenderedReducer: e,
                  lastRenderedState: t,
                }),
                (r.queue = e),
                (e = e.dispatch = Ko.bind(null, oo, e)),
                [r.memoizedState, e]
              );
            },
            useRef: function (e) {
              return ((e = { current: e }), (vo().memoizedState = e));
            },
            useState: Oo,
            useDebugValue: Io,
            useDeferredValue: function (e) {
              return (vo().memoizedState = e);
            },
            useTransition: function () {
              var e = Oo(!1),
                t = e[0];
              return (
                (e = Wo.bind(null, e[1])),
                (vo().memoizedState = e),
                [t, e]
              );
            },
            useMutableSource: function () {},
            useSyncExternalStore: function (e, t, n) {
              var r = oo,
                a = vo();
              if (ai) {
                if (void 0 === n) throw Error(i(407));
                n = n();
              } else {
                if (((n = t()), null === Cl)) throw Error(i(349));
                0 !== (30 & io) || No(r, t, n);
              }
              a.memoizedState = n;
              var o = { value: n, getSnapshot: t };
              return (
                (a.queue = o),
                zo(_o.bind(null, r, o, e), [e]),
                (r.flags |= 2048),
                Ro(9, Eo.bind(null, r, o, n, t), void 0, null),
                n
              );
            },
            useId: function () {
              var e = vo(),
                t = Cl.identifierPrefix;
              if (ai) {
                var n = Xa;
                ((t =
                  ":" +
                  t +
                  "R" +
                  (n = (Ja & ~(1 << (32 - ot(Ja) - 1))).toString(32) + n)),
                  0 < (n = fo++) && (t += "H" + n.toString(32)),
                  (t += ":"));
              } else t = ":" + t + "r" + (n = ho++).toString(32) + ":";
              return (e.memoizedState = t);
            },
            unstable_isNewReconciler: !1,
          },
          es = {
            readContext: Oi,
            useCallback: qo,
            useContext: Oi,
            useEffect: Fo,
            useImperativeHandle: Uo,
            useInsertionEffect: Mo,
            useLayoutEffect: Bo,
            useMemo: Vo,
            useReducer: wo,
            useRef: To,
            useState: function () {
              return wo(xo);
            },
            useDebugValue: Io,
            useDeferredValue: function (e) {
              return Ho(bo(), so.memoizedState, e);
            },
            useTransition: function () {
              return [wo(xo)[0], bo().memoizedState];
            },
            useMutableSource: So,
            useSyncExternalStore: jo,
            useId: $o,
            unstable_isNewReconciler: !1,
          },
          ts = {
            readContext: Oi,
            useCallback: qo,
            useContext: Oi,
            useEffect: Fo,
            useImperativeHandle: Uo,
            useInsertionEffect: Mo,
            useLayoutEffect: Bo,
            useMemo: Vo,
            useReducer: ko,
            useRef: To,
            useState: function () {
              return ko(xo);
            },
            useDebugValue: Io,
            useDeferredValue: function (e) {
              var t = bo();
              return null === so
                ? (t.memoizedState = e)
                : Ho(t, so.memoizedState, e);
            },
            useTransition: function () {
              return [ko(xo)[0], bo().memoizedState];
            },
            useMutableSource: So,
            useSyncExternalStore: jo,
            useId: $o,
            unstable_isNewReconciler: !1,
          };
        function ns(e, t) {
          if (e && e.defaultProps) {
            for (var n in ((t = M({}, t)), (e = e.defaultProps)))
              void 0 === t[n] && (t[n] = e[n]);
            return t;
          }
          return t;
        }
        function rs(e, t, n, r) {
          ((n =
            null === (n = n(r, (t = e.memoizedState))) || void 0 === n
              ? t
              : M({}, t, n)),
            (e.memoizedState = n),
            0 === e.lanes && (e.updateQueue.baseState = n));
        }
        var as = {
          isMounted: function (e) {
            return !!(e = e._reactInternals) && qe(e) === e;
          },
          enqueueSetState: function (e, t, n) {
            e = e._reactInternals;
            var r = Zl(),
              a = ec(e),
              i = Bi(r, a);
            ((i.payload = t),
              void 0 !== n && null !== n && (i.callback = n),
              null !== (t = Di(e, i, a)) && (tc(t, e, a, r), Ui(t, e, a)));
          },
          enqueueReplaceState: function (e, t, n) {
            e = e._reactInternals;
            var r = Zl(),
              a = ec(e),
              i = Bi(r, a);
            ((i.tag = 1),
              (i.payload = t),
              void 0 !== n && null !== n && (i.callback = n),
              null !== (t = Di(e, i, a)) && (tc(t, e, a, r), Ui(t, e, a)));
          },
          enqueueForceUpdate: function (e, t) {
            e = e._reactInternals;
            var n = Zl(),
              r = ec(e),
              a = Bi(n, r);
            ((a.tag = 2),
              void 0 !== t && null !== t && (a.callback = t),
              null !== (t = Di(e, a, r)) && (tc(t, e, r, n), Ui(t, e, r)));
          },
        };
        function is(e, t, n, r, a, i, o) {
          return "function" === typeof (e = e.stateNode).shouldComponentUpdate
            ? e.shouldComponentUpdate(r, i, o)
            : !t.prototype ||
                !t.prototype.isPureReactComponent ||
                !lr(n, r) ||
                !lr(a, i);
        }
        function os(e, t, n) {
          var r = !1,
            a = _a,
            i = t.contextType;
          return (
            "object" === typeof i && null !== i
              ? (i = Oi(i))
              : ((a = Ta(t) ? Oa : Ca.current),
                (i = (r = null !== (r = t.contextTypes) && void 0 !== r)
                  ? Ra(e, a)
                  : _a)),
            (t = new t(n, i)),
            (e.memoizedState =
              null !== t.state && void 0 !== t.state ? t.state : null),
            (t.updater = as),
            (e.stateNode = t),
            (t._reactInternals = e),
            r &&
              (((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext =
                a),
              (e.__reactInternalMemoizedMaskedChildContext = i)),
            t
          );
        }
        function ss(e, t, n, r) {
          ((e = t.state),
            "function" === typeof t.componentWillReceiveProps &&
              t.componentWillReceiveProps(n, r),
            "function" === typeof t.UNSAFE_componentWillReceiveProps &&
              t.UNSAFE_componentWillReceiveProps(n, r),
            t.state !== e && as.enqueueReplaceState(t, t.state, null));
        }
        function ls(e, t, n, r) {
          var a = e.stateNode;
          ((a.props = n), (a.state = e.memoizedState), (a.refs = {}), Fi(e));
          var i = t.contextType;
          ("object" === typeof i && null !== i
            ? (a.context = Oi(i))
            : ((i = Ta(t) ? Oa : Ca.current), (a.context = Ra(e, i))),
            (a.state = e.memoizedState),
            "function" === typeof (i = t.getDerivedStateFromProps) &&
              (rs(e, t, i, n), (a.state = e.memoizedState)),
            "function" === typeof t.getDerivedStateFromProps ||
              "function" === typeof a.getSnapshotBeforeUpdate ||
              ("function" !== typeof a.UNSAFE_componentWillMount &&
                "function" !== typeof a.componentWillMount) ||
              ((t = a.state),
              "function" === typeof a.componentWillMount &&
                a.componentWillMount(),
              "function" === typeof a.UNSAFE_componentWillMount &&
                a.UNSAFE_componentWillMount(),
              t !== a.state && as.enqueueReplaceState(a, a.state, null),
              qi(e, n, a, r),
              (a.state = e.memoizedState)),
            "function" === typeof a.componentDidMount && (e.flags |= 4194308));
        }
        function cs(e, t) {
          try {
            var n = "",
              r = t;
            do {
              ((n += I(r)), (r = r.return));
            } while (r);
            var a = n;
          } catch (i) {
            a = "\nError generating stack: " + i.message + "\n" + i.stack;
          }
          return { value: e, source: t, stack: a, digest: null };
        }
        function us(e, t, n) {
          return {
            value: e,
            source: null,
            stack: null != n ? n : null,
            digest: null != t ? t : null,
          };
        }
        function ds(e, t) {
          try {
            console.error(t.value);
          } catch (n) {
            setTimeout(function () {
              throw n;
            });
          }
        }
        var fs = "function" === typeof WeakMap ? WeakMap : Map;
        function hs(e, t, n) {
          (((n = Bi(-1, n)).tag = 3), (n.payload = { element: null }));
          var r = t.value;
          return (
            (n.callback = function () {
              (Vl || ((Vl = !0), (Hl = r)), ds(0, t));
            }),
            n
          );
        }
        function ps(e, t, n) {
          (n = Bi(-1, n)).tag = 3;
          var r = e.type.getDerivedStateFromError;
          if ("function" === typeof r) {
            var a = t.value;
            ((n.payload = function () {
              return r(a);
            }),
              (n.callback = function () {
                ds(0, t);
              }));
          }
          var i = e.stateNode;
          return (
            null !== i &&
              "function" === typeof i.componentDidCatch &&
              (n.callback = function () {
                (ds(0, t),
                  "function" !== typeof r &&
                    (null === Wl ? (Wl = new Set([this])) : Wl.add(this)));
                var e = t.stack;
                this.componentDidCatch(t.value, {
                  componentStack: null !== e ? e : "",
                });
              }),
            n
          );
        }
        function ms(e, t, n) {
          var r = e.pingCache;
          if (null === r) {
            r = e.pingCache = new fs();
            var a = new Set();
            r.set(t, a);
          } else void 0 === (a = r.get(t)) && ((a = new Set()), r.set(t, a));
          a.has(n) || (a.add(n), (e = jc.bind(null, e, t, n)), t.then(e, e));
        }
        function gs(e) {
          do {
            var t;
            if (
              ((t = 13 === e.tag) &&
                (t = null === (t = e.memoizedState) || null !== t.dehydrated),
              t)
            )
              return e;
            e = e.return;
          } while (null !== e);
          return null;
        }
        function ys(e, t, n, r, a) {
          return 0 === (1 & e.mode)
            ? (e === t
                ? (e.flags |= 65536)
                : ((e.flags |= 128),
                  (n.flags |= 131072),
                  (n.flags &= -52805),
                  1 === n.tag &&
                    (null === n.alternate
                      ? (n.tag = 17)
                      : (((t = Bi(-1, 1)).tag = 2), Di(n, t, 1))),
                  (n.lanes |= 1)),
              e)
            : ((e.flags |= 65536), (e.lanes = a), e);
        }
        var vs = x.ReactCurrentOwner,
          bs = !1;
        function xs(e, t, n, r) {
          t.child = null === e ? wi(t, null, n, r) : xi(t, e.child, n, r);
        }
        function ws(e, t, n, r, a) {
          n = n.render;
          var i = t.ref;
          return (
            Pi(t, a),
            (r = go(e, t, n, r, i, a)),
            (n = yo()),
            null === e || bs
              ? (ai && n && ei(t), (t.flags |= 1), xs(e, t, r, a), t.child)
              : ((t.updateQueue = e.updateQueue),
                (t.flags &= -2053),
                (e.lanes &= ~a),
                Vs(e, t, a))
          );
        }
        function ks(e, t, n, r, a) {
          if (null === e) {
            var i = n.type;
            return "function" !== typeof i ||
              Rc(i) ||
              void 0 !== i.defaultProps ||
              null !== n.compare ||
              void 0 !== n.defaultProps
              ? (((e = Lc(n.type, null, r, t, t.mode, a)).ref = t.ref),
                (e.return = t),
                (t.child = e))
              : ((t.tag = 15), (t.type = i), Ss(e, t, i, r, a));
          }
          if (((i = e.child), 0 === (e.lanes & a))) {
            var o = i.memoizedProps;
            if (
              (n = null !== (n = n.compare) ? n : lr)(o, r) &&
              e.ref === t.ref
            )
              return Vs(e, t, a);
          }
          return (
            (t.flags |= 1),
            ((e = Tc(i, r)).ref = t.ref),
            (e.return = t),
            (t.child = e)
          );
        }
        function Ss(e, t, n, r, a) {
          if (null !== e) {
            var i = e.memoizedProps;
            if (lr(i, r) && e.ref === t.ref) {
              if (((bs = !1), (t.pendingProps = r = i), 0 === (e.lanes & a)))
                return ((t.lanes = e.lanes), Vs(e, t, a));
              0 !== (131072 & e.flags) && (bs = !0);
            }
          }
          return Es(e, t, n, r, a);
        }
        function js(e, t, n) {
          var r = t.pendingProps,
            a = r.children,
            i = null !== e ? e.memoizedState : null;
          if ("hidden" === r.mode)
            if (0 === (1 & t.mode))
              ((t.memoizedState = {
                baseLanes: 0,
                cachePool: null,
                transitions: null,
              }),
                Ea(Tl, Rl),
                (Rl |= n));
            else {
              if (0 === (1073741824 & n))
                return (
                  (e = null !== i ? i.baseLanes | n : n),
                  (t.lanes = t.childLanes = 1073741824),
                  (t.memoizedState = {
                    baseLanes: e,
                    cachePool: null,
                    transitions: null,
                  }),
                  (t.updateQueue = null),
                  Ea(Tl, Rl),
                  (Rl |= e),
                  null
                );
              ((t.memoizedState = {
                baseLanes: 0,
                cachePool: null,
                transitions: null,
              }),
                (r = null !== i ? i.baseLanes : n),
                Ea(Tl, Rl),
                (Rl |= r));
            }
          else
            (null !== i
              ? ((r = i.baseLanes | n), (t.memoizedState = null))
              : (r = n),
              Ea(Tl, Rl),
              (Rl |= r));
          return (xs(e, t, a, n), t.child);
        }
        function Ns(e, t) {
          var n = t.ref;
          ((null === e && null !== n) || (null !== e && e.ref !== n)) &&
            ((t.flags |= 512), (t.flags |= 2097152));
        }
        function Es(e, t, n, r, a) {
          var i = Ta(n) ? Oa : Ca.current;
          return (
            (i = Ra(t, i)),
            Pi(t, a),
            (n = go(e, t, n, r, i, a)),
            (r = yo()),
            null === e || bs
              ? (ai && r && ei(t), (t.flags |= 1), xs(e, t, n, a), t.child)
              : ((t.updateQueue = e.updateQueue),
                (t.flags &= -2053),
                (e.lanes &= ~a),
                Vs(e, t, a))
          );
        }
        function _s(e, t, n, r, a) {
          if (Ta(n)) {
            var i = !0;
            Fa(t);
          } else i = !1;
          if ((Pi(t, a), null === t.stateNode))
            (qs(e, t), os(t, n, r), ls(t, n, r, a), (r = !0));
          else if (null === e) {
            var o = t.stateNode,
              s = t.memoizedProps;
            o.props = s;
            var l = o.context,
              c = n.contextType;
            "object" === typeof c && null !== c
              ? (c = Oi(c))
              : (c = Ra(t, (c = Ta(n) ? Oa : Ca.current)));
            var u = n.getDerivedStateFromProps,
              d =
                "function" === typeof u ||
                "function" === typeof o.getSnapshotBeforeUpdate;
            (d ||
              ("function" !== typeof o.UNSAFE_componentWillReceiveProps &&
                "function" !== typeof o.componentWillReceiveProps) ||
              ((s !== r || l !== c) && ss(t, o, r, c)),
              (zi = !1));
            var f = t.memoizedState;
            ((o.state = f),
              qi(t, r, o, a),
              (l = t.memoizedState),
              s !== r || f !== l || Pa.current || zi
                ? ("function" === typeof u &&
                    (rs(t, n, u, r), (l = t.memoizedState)),
                  (s = zi || is(t, n, s, r, f, l, c))
                    ? (d ||
                        ("function" !== typeof o.UNSAFE_componentWillMount &&
                          "function" !== typeof o.componentWillMount) ||
                        ("function" === typeof o.componentWillMount &&
                          o.componentWillMount(),
                        "function" === typeof o.UNSAFE_componentWillMount &&
                          o.UNSAFE_componentWillMount()),
                      "function" === typeof o.componentDidMount &&
                        (t.flags |= 4194308))
                    : ("function" === typeof o.componentDidMount &&
                        (t.flags |= 4194308),
                      (t.memoizedProps = r),
                      (t.memoizedState = l)),
                  (o.props = r),
                  (o.state = l),
                  (o.context = c),
                  (r = s))
                : ("function" === typeof o.componentDidMount &&
                    (t.flags |= 4194308),
                  (r = !1)));
          } else {
            ((o = t.stateNode),
              Mi(e, t),
              (s = t.memoizedProps),
              (c = t.type === t.elementType ? s : ns(t.type, s)),
              (o.props = c),
              (d = t.pendingProps),
              (f = o.context),
              "object" === typeof (l = n.contextType) && null !== l
                ? (l = Oi(l))
                : (l = Ra(t, (l = Ta(n) ? Oa : Ca.current))));
            var h = n.getDerivedStateFromProps;
            ((u =
              "function" === typeof h ||
              "function" === typeof o.getSnapshotBeforeUpdate) ||
              ("function" !== typeof o.UNSAFE_componentWillReceiveProps &&
                "function" !== typeof o.componentWillReceiveProps) ||
              ((s !== d || f !== l) && ss(t, o, r, l)),
              (zi = !1),
              (f = t.memoizedState),
              (o.state = f),
              qi(t, r, o, a));
            var p = t.memoizedState;
            s !== d || f !== p || Pa.current || zi
              ? ("function" === typeof h &&
                  (rs(t, n, h, r), (p = t.memoizedState)),
                (c = zi || is(t, n, c, r, f, p, l) || !1)
                  ? (u ||
                      ("function" !== typeof o.UNSAFE_componentWillUpdate &&
                        "function" !== typeof o.componentWillUpdate) ||
                      ("function" === typeof o.componentWillUpdate &&
                        o.componentWillUpdate(r, p, l),
                      "function" === typeof o.UNSAFE_componentWillUpdate &&
                        o.UNSAFE_componentWillUpdate(r, p, l)),
                    "function" === typeof o.componentDidUpdate &&
                      (t.flags |= 4),
                    "function" === typeof o.getSnapshotBeforeUpdate &&
                      (t.flags |= 1024))
                  : ("function" !== typeof o.componentDidUpdate ||
                      (s === e.memoizedProps && f === e.memoizedState) ||
                      (t.flags |= 4),
                    "function" !== typeof o.getSnapshotBeforeUpdate ||
                      (s === e.memoizedProps && f === e.memoizedState) ||
                      (t.flags |= 1024),
                    (t.memoizedProps = r),
                    (t.memoizedState = p)),
                (o.props = r),
                (o.state = p),
                (o.context = l),
                (r = c))
              : ("function" !== typeof o.componentDidUpdate ||
                  (s === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                "function" !== typeof o.getSnapshotBeforeUpdate ||
                  (s === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (r = !1));
          }
          return Cs(e, t, n, r, i, a);
        }
        function Cs(e, t, n, r, a, i) {
          Ns(e, t);
          var o = 0 !== (128 & t.flags);
          if (!r && !o) return (a && Ma(t, n, !1), Vs(e, t, i));
          ((r = t.stateNode), (vs.current = t));
          var s =
            o && "function" !== typeof n.getDerivedStateFromError
              ? null
              : r.render();
          return (
            (t.flags |= 1),
            null !== e && o
              ? ((t.child = xi(t, e.child, null, i)),
                (t.child = xi(t, null, s, i)))
              : xs(e, t, s, i),
            (t.memoizedState = r.state),
            a && Ma(t, n, !0),
            t.child
          );
        }
        function Ps(e) {
          var t = e.stateNode;
          (t.pendingContext
            ? Aa(0, t.pendingContext, t.pendingContext !== t.context)
            : t.context && Aa(0, t.context, !1),
            Yi(e, t.containerInfo));
        }
        function Os(e, t, n, r, a) {
          return (hi(), pi(a), (t.flags |= 256), xs(e, t, n, r), t.child);
        }
        var Rs,
          Ts,
          Ls,
          As = { dehydrated: null, treeContext: null, retryLane: 0 };
        function zs(e) {
          return { baseLanes: e, cachePool: null, transitions: null };
        }
        function Fs(e, t, n) {
          var r,
            a = t.pendingProps,
            o = Zi.current,
            s = !1,
            l = 0 !== (128 & t.flags);
          if (
            ((r = l) ||
              (r = (null === e || null !== e.memoizedState) && 0 !== (2 & o)),
            r
              ? ((s = !0), (t.flags &= -129))
              : (null !== e && null === e.memoizedState) || (o |= 1),
            Ea(Zi, 1 & o),
            null === e)
          )
            return (
              ci(t),
              null !== (e = t.memoizedState) && null !== (e = e.dehydrated)
                ? (0 === (1 & t.mode)
                    ? (t.lanes = 1)
                    : "$!" === e.data
                      ? (t.lanes = 8)
                      : (t.lanes = 1073741824),
                  null)
                : ((l = a.children),
                  (e = a.fallback),
                  s
                    ? ((a = t.mode),
                      (s = t.child),
                      (l = { mode: "hidden", children: l }),
                      0 === (1 & a) && null !== s
                        ? ((s.childLanes = 0), (s.pendingProps = l))
                        : (s = zc(l, a, 0, null)),
                      (e = Ac(e, a, n, null)),
                      (s.return = t),
                      (e.return = t),
                      (s.sibling = e),
                      (t.child = s),
                      (t.child.memoizedState = zs(n)),
                      (t.memoizedState = As),
                      e)
                    : Ms(t, l))
            );
          if (null !== (o = e.memoizedState) && null !== (r = o.dehydrated))
            return (function (e, t, n, r, a, o, s) {
              if (n)
                return 256 & t.flags
                  ? ((t.flags &= -257), Bs(e, t, s, (r = us(Error(i(422))))))
                  : null !== t.memoizedState
                    ? ((t.child = e.child), (t.flags |= 128), null)
                    : ((o = r.fallback),
                      (a = t.mode),
                      (r = zc(
                        { mode: "visible", children: r.children },
                        a,
                        0,
                        null,
                      )),
                      ((o = Ac(o, a, s, null)).flags |= 2),
                      (r.return = t),
                      (o.return = t),
                      (r.sibling = o),
                      (t.child = r),
                      0 !== (1 & t.mode) && xi(t, e.child, null, s),
                      (t.child.memoizedState = zs(s)),
                      (t.memoizedState = As),
                      o);
              if (0 === (1 & t.mode)) return Bs(e, t, s, null);
              if ("$!" === a.data) {
                if ((r = a.nextSibling && a.nextSibling.dataset))
                  var l = r.dgst;
                return (
                  (r = l),
                  Bs(e, t, s, (r = us((o = Error(i(419))), r, void 0)))
                );
              }
              if (((l = 0 !== (s & e.childLanes)), bs || l)) {
                if (null !== (r = Cl)) {
                  switch (s & -s) {
                    case 4:
                      a = 2;
                      break;
                    case 16:
                      a = 8;
                      break;
                    case 64:
                    case 128:
                    case 256:
                    case 512:
                    case 1024:
                    case 2048:
                    case 4096:
                    case 8192:
                    case 16384:
                    case 32768:
                    case 65536:
                    case 131072:
                    case 262144:
                    case 524288:
                    case 1048576:
                    case 2097152:
                    case 4194304:
                    case 8388608:
                    case 16777216:
                    case 33554432:
                    case 67108864:
                      a = 32;
                      break;
                    case 536870912:
                      a = 268435456;
                      break;
                    default:
                      a = 0;
                  }
                  0 !== (a = 0 !== (a & (r.suspendedLanes | s)) ? 0 : a) &&
                    a !== o.retryLane &&
                    ((o.retryLane = a), Ai(e, a), tc(r, e, a, -1));
                }
                return (pc(), Bs(e, t, s, (r = us(Error(i(421))))));
              }
              return "$?" === a.data
                ? ((t.flags |= 128),
                  (t.child = e.child),
                  (t = Ec.bind(null, e)),
                  (a._reactRetry = t),
                  null)
                : ((e = o.treeContext),
                  (ri = ca(a.nextSibling)),
                  (ni = t),
                  (ai = !0),
                  (ii = null),
                  null !== e &&
                    ((Ka[Qa++] = Ja),
                    (Ka[Qa++] = Xa),
                    (Ka[Qa++] = Ya),
                    (Ja = e.id),
                    (Xa = e.overflow),
                    (Ya = t)),
                  (t = Ms(t, r.children)),
                  (t.flags |= 4096),
                  t);
            })(e, t, l, a, r, o, n);
          if (s) {
            ((s = a.fallback), (l = t.mode), (r = (o = e.child).sibling));
            var c = { mode: "hidden", children: a.children };
            return (
              0 === (1 & l) && t.child !== o
                ? (((a = t.child).childLanes = 0),
                  (a.pendingProps = c),
                  (t.deletions = null))
                : ((a = Tc(o, c)).subtreeFlags = 14680064 & o.subtreeFlags),
              null !== r
                ? (s = Tc(r, s))
                : ((s = Ac(s, l, n, null)).flags |= 2),
              (s.return = t),
              (a.return = t),
              (a.sibling = s),
              (t.child = a),
              (a = s),
              (s = t.child),
              (l =
                null === (l = e.child.memoizedState)
                  ? zs(n)
                  : {
                      baseLanes: l.baseLanes | n,
                      cachePool: null,
                      transitions: l.transitions,
                    }),
              (s.memoizedState = l),
              (s.childLanes = e.childLanes & ~n),
              (t.memoizedState = As),
              a
            );
          }
          return (
            (e = (s = e.child).sibling),
            (a = Tc(s, { mode: "visible", children: a.children })),
            0 === (1 & t.mode) && (a.lanes = n),
            (a.return = t),
            (a.sibling = null),
            null !== e &&
              (null === (n = t.deletions)
                ? ((t.deletions = [e]), (t.flags |= 16))
                : n.push(e)),
            (t.child = a),
            (t.memoizedState = null),
            a
          );
        }
        function Ms(e, t) {
          return (
            ((t = zc(
              { mode: "visible", children: t },
              e.mode,
              0,
              null,
            )).return = e),
            (e.child = t)
          );
        }
        function Bs(e, t, n, r) {
          return (
            null !== r && pi(r),
            xi(t, e.child, null, n),
            ((e = Ms(t, t.pendingProps.children)).flags |= 2),
            (t.memoizedState = null),
            e
          );
        }
        function Ds(e, t, n) {
          e.lanes |= t;
          var r = e.alternate;
          (null !== r && (r.lanes |= t), Ci(e.return, t, n));
        }
        function Us(e, t, n, r, a) {
          var i = e.memoizedState;
          null === i
            ? (e.memoizedState = {
                isBackwards: t,
                rendering: null,
                renderingStartTime: 0,
                last: r,
                tail: n,
                tailMode: a,
              })
            : ((i.isBackwards = t),
              (i.rendering = null),
              (i.renderingStartTime = 0),
              (i.last = r),
              (i.tail = n),
              (i.tailMode = a));
        }
        function Is(e, t, n) {
          var r = t.pendingProps,
            a = r.revealOrder,
            i = r.tail;
          if ((xs(e, t, r.children, n), 0 !== (2 & (r = Zi.current))))
            ((r = (1 & r) | 2), (t.flags |= 128));
          else {
            if (null !== e && 0 !== (128 & e.flags))
              e: for (e = t.child; null !== e; ) {
                if (13 === e.tag) null !== e.memoizedState && Ds(e, n, t);
                else if (19 === e.tag) Ds(e, n, t);
                else if (null !== e.child) {
                  ((e.child.return = e), (e = e.child));
                  continue;
                }
                if (e === t) break e;
                for (; null === e.sibling; ) {
                  if (null === e.return || e.return === t) break e;
                  e = e.return;
                }
                ((e.sibling.return = e.return), (e = e.sibling));
              }
            r &= 1;
          }
          if ((Ea(Zi, r), 0 === (1 & t.mode))) t.memoizedState = null;
          else
            switch (a) {
              case "forwards":
                for (n = t.child, a = null; null !== n; )
                  (null !== (e = n.alternate) && null === eo(e) && (a = n),
                    (n = n.sibling));
                (null === (n = a)
                  ? ((a = t.child), (t.child = null))
                  : ((a = n.sibling), (n.sibling = null)),
                  Us(t, !1, a, n, i));
                break;
              case "backwards":
                for (n = null, a = t.child, t.child = null; null !== a; ) {
                  if (null !== (e = a.alternate) && null === eo(e)) {
                    t.child = a;
                    break;
                  }
                  ((e = a.sibling), (a.sibling = n), (n = a), (a = e));
                }
                Us(t, !0, n, null, i);
                break;
              case "together":
                Us(t, !1, null, null, void 0);
                break;
              default:
                t.memoizedState = null;
            }
          return t.child;
        }
        function qs(e, t) {
          0 === (1 & t.mode) &&
            null !== e &&
            ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
        }
        function Vs(e, t, n) {
          if (
            (null !== e && (t.dependencies = e.dependencies),
            (zl |= t.lanes),
            0 === (n & t.childLanes))
          )
            return null;
          if (null !== e && t.child !== e.child) throw Error(i(153));
          if (null !== t.child) {
            for (
              n = Tc((e = t.child), e.pendingProps), t.child = n, n.return = t;
              null !== e.sibling;
            )
              ((e = e.sibling),
                ((n = n.sibling = Tc(e, e.pendingProps)).return = t));
            n.sibling = null;
          }
          return t.child;
        }
        function Hs(e, t) {
          if (!ai)
            switch (e.tailMode) {
              case "hidden":
                t = e.tail;
                for (var n = null; null !== t; )
                  (null !== t.alternate && (n = t), (t = t.sibling));
                null === n ? (e.tail = null) : (n.sibling = null);
                break;
              case "collapsed":
                n = e.tail;
                for (var r = null; null !== n; )
                  (null !== n.alternate && (r = n), (n = n.sibling));
                null === r
                  ? t || null === e.tail
                    ? (e.tail = null)
                    : (e.tail.sibling = null)
                  : (r.sibling = null);
            }
        }
        function Ws(e) {
          var t = null !== e.alternate && e.alternate.child === e.child,
            n = 0,
            r = 0;
          if (t)
            for (var a = e.child; null !== a; )
              ((n |= a.lanes | a.childLanes),
                (r |= 14680064 & a.subtreeFlags),
                (r |= 14680064 & a.flags),
                (a.return = e),
                (a = a.sibling));
          else
            for (a = e.child; null !== a; )
              ((n |= a.lanes | a.childLanes),
                (r |= a.subtreeFlags),
                (r |= a.flags),
                (a.return = e),
                (a = a.sibling));
          return ((e.subtreeFlags |= r), (e.childLanes = n), t);
        }
        function $s(e, t, n) {
          var r = t.pendingProps;
          switch ((ti(t), t.tag)) {
            case 2:
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14:
              return (Ws(t), null);
            case 1:
            case 17:
              return (Ta(t.type) && La(), Ws(t), null);
            case 3:
              return (
                (r = t.stateNode),
                Ji(),
                Na(Pa),
                Na(Ca),
                no(),
                r.pendingContext &&
                  ((r.context = r.pendingContext), (r.pendingContext = null)),
                (null !== e && null !== e.child) ||
                  (di(t)
                    ? (t.flags |= 4)
                    : null === e ||
                      (e.memoizedState.isDehydrated && 0 === (256 & t.flags)) ||
                      ((t.flags |= 1024),
                      null !== ii && (ic(ii), (ii = null)))),
                Ws(t),
                null
              );
            case 5:
              Gi(t);
              var a = Qi(Ki.current);
              if (((n = t.type), null !== e && null != t.stateNode))
                (Ts(e, t, n, r),
                  e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
              else {
                if (!r) {
                  if (null === t.stateNode) throw Error(i(166));
                  return (Ws(t), null);
                }
                if (((e = Qi(Wi.current)), di(t))) {
                  ((r = t.stateNode), (n = t.type));
                  var o = t.memoizedProps;
                  switch (
                    ((r[fa] = t), (r[ha] = o), (e = 0 !== (1 & t.mode)), n)
                  ) {
                    case "dialog":
                      (Dr("cancel", r), Dr("close", r));
                      break;
                    case "iframe":
                    case "object":
                    case "embed":
                      Dr("load", r);
                      break;
                    case "video":
                    case "audio":
                      for (a = 0; a < zr.length; a++) Dr(zr[a], r);
                      break;
                    case "source":
                      Dr("error", r);
                      break;
                    case "img":
                    case "image":
                    case "link":
                      (Dr("error", r), Dr("load", r));
                      break;
                    case "details":
                      Dr("toggle", r);
                      break;
                    case "input":
                      (J(r, o), Dr("invalid", r));
                      break;
                    case "select":
                      ((r._wrapperState = { wasMultiple: !!o.multiple }),
                        Dr("invalid", r));
                      break;
                    case "textarea":
                      (ae(r, o), Dr("invalid", r));
                  }
                  for (var l in (ve(n, o), (a = null), o))
                    if (o.hasOwnProperty(l)) {
                      var c = o[l];
                      "children" === l
                        ? "string" === typeof c
                          ? r.textContent !== c &&
                            (!0 !== o.suppressHydrationWarning &&
                              Gr(r.textContent, c, e),
                            (a = ["children", c]))
                          : "number" === typeof c &&
                            r.textContent !== "" + c &&
                            (!0 !== o.suppressHydrationWarning &&
                              Gr(r.textContent, c, e),
                            (a = ["children", "" + c]))
                        : s.hasOwnProperty(l) &&
                          null != c &&
                          "onScroll" === l &&
                          Dr("scroll", r);
                    }
                  switch (n) {
                    case "input":
                      ($(r), Z(r, o, !0));
                      break;
                    case "textarea":
                      ($(r), oe(r));
                      break;
                    case "select":
                    case "option":
                      break;
                    default:
                      "function" === typeof o.onClick && (r.onclick = Zr);
                  }
                  ((r = a), (t.updateQueue = r), null !== r && (t.flags |= 4));
                } else {
                  ((l = 9 === a.nodeType ? a : a.ownerDocument),
                    "http://www.w3.org/1999/xhtml" === e && (e = se(n)),
                    "http://www.w3.org/1999/xhtml" === e
                      ? "script" === n
                        ? (((e = l.createElement("div")).innerHTML =
                            "<script><\/script>"),
                          (e = e.removeChild(e.firstChild)))
                        : "string" === typeof r.is
                          ? (e = l.createElement(n, { is: r.is }))
                          : ((e = l.createElement(n)),
                            "select" === n &&
                              ((l = e),
                              r.multiple
                                ? (l.multiple = !0)
                                : r.size && (l.size = r.size)))
                      : (e = l.createElementNS(e, n)),
                    (e[fa] = t),
                    (e[ha] = r),
                    Rs(e, t),
                    (t.stateNode = e));
                  e: {
                    switch (((l = be(n, r)), n)) {
                      case "dialog":
                        (Dr("cancel", e), Dr("close", e), (a = r));
                        break;
                      case "iframe":
                      case "object":
                      case "embed":
                        (Dr("load", e), (a = r));
                        break;
                      case "video":
                      case "audio":
                        for (a = 0; a < zr.length; a++) Dr(zr[a], e);
                        a = r;
                        break;
                      case "source":
                        (Dr("error", e), (a = r));
                        break;
                      case "img":
                      case "image":
                      case "link":
                        (Dr("error", e), Dr("load", e), (a = r));
                        break;
                      case "details":
                        (Dr("toggle", e), (a = r));
                        break;
                      case "input":
                        (J(e, r), (a = Y(e, r)), Dr("invalid", e));
                        break;
                      case "option":
                      default:
                        a = r;
                        break;
                      case "select":
                        ((e._wrapperState = { wasMultiple: !!r.multiple }),
                          (a = M({}, r, { value: void 0 })),
                          Dr("invalid", e));
                        break;
                      case "textarea":
                        (ae(e, r), (a = re(e, r)), Dr("invalid", e));
                    }
                    for (o in (ve(n, a), (c = a)))
                      if (c.hasOwnProperty(o)) {
                        var u = c[o];
                        "style" === o
                          ? ge(e, u)
                          : "dangerouslySetInnerHTML" === o
                            ? null != (u = u ? u.__html : void 0) && de(e, u)
                            : "children" === o
                              ? "string" === typeof u
                                ? ("textarea" !== n || "" !== u) && fe(e, u)
                                : "number" === typeof u && fe(e, "" + u)
                              : "suppressContentEditableWarning" !== o &&
                                "suppressHydrationWarning" !== o &&
                                "autoFocus" !== o &&
                                (s.hasOwnProperty(o)
                                  ? null != u &&
                                    "onScroll" === o &&
                                    Dr("scroll", e)
                                  : null != u && b(e, o, u, l));
                      }
                    switch (n) {
                      case "input":
                        ($(e), Z(e, r, !1));
                        break;
                      case "textarea":
                        ($(e), oe(e));
                        break;
                      case "option":
                        null != r.value &&
                          e.setAttribute("value", "" + H(r.value));
                        break;
                      case "select":
                        ((e.multiple = !!r.multiple),
                          null != (o = r.value)
                            ? ne(e, !!r.multiple, o, !1)
                            : null != r.defaultValue &&
                              ne(e, !!r.multiple, r.defaultValue, !0));
                        break;
                      default:
                        "function" === typeof a.onClick && (e.onclick = Zr);
                    }
                    switch (n) {
                      case "button":
                      case "input":
                      case "select":
                      case "textarea":
                        r = !!r.autoFocus;
                        break e;
                      case "img":
                        r = !0;
                        break e;
                      default:
                        r = !1;
                    }
                  }
                  r && (t.flags |= 4);
                }
                null !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
              }
              return (Ws(t), null);
            case 6:
              if (e && null != t.stateNode) Ls(0, t, e.memoizedProps, r);
              else {
                if ("string" !== typeof r && null === t.stateNode)
                  throw Error(i(166));
                if (((n = Qi(Ki.current)), Qi(Wi.current), di(t))) {
                  if (
                    ((r = t.stateNode),
                    (n = t.memoizedProps),
                    (r[fa] = t),
                    (o = r.nodeValue !== n) && null !== (e = ni))
                  )
                    switch (e.tag) {
                      case 3:
                        Gr(r.nodeValue, n, 0 !== (1 & e.mode));
                        break;
                      case 5:
                        !0 !== e.memoizedProps.suppressHydrationWarning &&
                          Gr(r.nodeValue, n, 0 !== (1 & e.mode));
                    }
                  o && (t.flags |= 4);
                } else
                  (((r = (
                    9 === n.nodeType ? n : n.ownerDocument
                  ).createTextNode(r))[fa] = t),
                    (t.stateNode = r));
              }
              return (Ws(t), null);
            case 13:
              if (
                (Na(Zi),
                (r = t.memoizedState),
                null === e ||
                  (null !== e.memoizedState &&
                    null !== e.memoizedState.dehydrated))
              ) {
                if (
                  ai &&
                  null !== ri &&
                  0 !== (1 & t.mode) &&
                  0 === (128 & t.flags)
                )
                  (fi(), hi(), (t.flags |= 98560), (o = !1));
                else if (((o = di(t)), null !== r && null !== r.dehydrated)) {
                  if (null === e) {
                    if (!o) throw Error(i(318));
                    if (
                      !(o =
                        null !== (o = t.memoizedState) ? o.dehydrated : null)
                    )
                      throw Error(i(317));
                    o[fa] = t;
                  } else
                    (hi(),
                      0 === (128 & t.flags) && (t.memoizedState = null),
                      (t.flags |= 4));
                  (Ws(t), (o = !1));
                } else (null !== ii && (ic(ii), (ii = null)), (o = !0));
                if (!o) return 65536 & t.flags ? t : null;
              }
              return 0 !== (128 & t.flags)
                ? ((t.lanes = n), t)
                : ((r = null !== r) !==
                    (null !== e && null !== e.memoizedState) &&
                    r &&
                    ((t.child.flags |= 8192),
                    0 !== (1 & t.mode) &&
                      (null === e || 0 !== (1 & Zi.current)
                        ? 0 === Ll && (Ll = 3)
                        : pc())),
                  null !== t.updateQueue && (t.flags |= 4),
                  Ws(t),
                  null);
            case 4:
              return (
                Ji(),
                null === e && qr(t.stateNode.containerInfo),
                Ws(t),
                null
              );
            case 10:
              return (_i(t.type._context), Ws(t), null);
            case 19:
              if ((Na(Zi), null === (o = t.memoizedState)))
                return (Ws(t), null);
              if (((r = 0 !== (128 & t.flags)), null === (l = o.rendering)))
                if (r) Hs(o, !1);
                else {
                  if (0 !== Ll || (null !== e && 0 !== (128 & e.flags)))
                    for (e = t.child; null !== e; ) {
                      if (null !== (l = eo(e))) {
                        for (
                          t.flags |= 128,
                            Hs(o, !1),
                            null !== (r = l.updateQueue) &&
                              ((t.updateQueue = r), (t.flags |= 4)),
                            t.subtreeFlags = 0,
                            r = n,
                            n = t.child;
                          null !== n;
                        )
                          ((e = r),
                            ((o = n).flags &= 14680066),
                            null === (l = o.alternate)
                              ? ((o.childLanes = 0),
                                (o.lanes = e),
                                (o.child = null),
                                (o.subtreeFlags = 0),
                                (o.memoizedProps = null),
                                (o.memoizedState = null),
                                (o.updateQueue = null),
                                (o.dependencies = null),
                                (o.stateNode = null))
                              : ((o.childLanes = l.childLanes),
                                (o.lanes = l.lanes),
                                (o.child = l.child),
                                (o.subtreeFlags = 0),
                                (o.deletions = null),
                                (o.memoizedProps = l.memoizedProps),
                                (o.memoizedState = l.memoizedState),
                                (o.updateQueue = l.updateQueue),
                                (o.type = l.type),
                                (e = l.dependencies),
                                (o.dependencies =
                                  null === e
                                    ? null
                                    : {
                                        lanes: e.lanes,
                                        firstContext: e.firstContext,
                                      })),
                            (n = n.sibling));
                        return (Ea(Zi, (1 & Zi.current) | 2), t.child);
                      }
                      e = e.sibling;
                    }
                  null !== o.tail &&
                    Xe() > Il &&
                    ((t.flags |= 128),
                    (r = !0),
                    Hs(o, !1),
                    (t.lanes = 4194304));
                }
              else {
                if (!r)
                  if (null !== (e = eo(l))) {
                    if (
                      ((t.flags |= 128),
                      (r = !0),
                      null !== (n = e.updateQueue) &&
                        ((t.updateQueue = n), (t.flags |= 4)),
                      Hs(o, !0),
                      null === o.tail &&
                        "hidden" === o.tailMode &&
                        !l.alternate &&
                        !ai)
                    )
                      return (Ws(t), null);
                  } else
                    2 * Xe() - o.renderingStartTime > Il &&
                      1073741824 !== n &&
                      ((t.flags |= 128),
                      (r = !0),
                      Hs(o, !1),
                      (t.lanes = 4194304));
                o.isBackwards
                  ? ((l.sibling = t.child), (t.child = l))
                  : (null !== (n = o.last) ? (n.sibling = l) : (t.child = l),
                    (o.last = l));
              }
              return null !== o.tail
                ? ((t = o.tail),
                  (o.rendering = t),
                  (o.tail = t.sibling),
                  (o.renderingStartTime = Xe()),
                  (t.sibling = null),
                  (n = Zi.current),
                  Ea(Zi, r ? (1 & n) | 2 : 1 & n),
                  t)
                : (Ws(t), null);
            case 22:
            case 23:
              return (
                uc(),
                (r = null !== t.memoizedState),
                null !== e &&
                  (null !== e.memoizedState) !== r &&
                  (t.flags |= 8192),
                r && 0 !== (1 & t.mode)
                  ? 0 !== (1073741824 & Rl) &&
                    (Ws(t), 6 & t.subtreeFlags && (t.flags |= 8192))
                  : Ws(t),
                null
              );
            case 24:
            case 25:
              return null;
          }
          throw Error(i(156, t.tag));
        }
        function Ks(e, t) {
          switch ((ti(t), t.tag)) {
            case 1:
              return (
                Ta(t.type) && La(),
                65536 & (e = t.flags)
                  ? ((t.flags = (-65537 & e) | 128), t)
                  : null
              );
            case 3:
              return (
                Ji(),
                Na(Pa),
                Na(Ca),
                no(),
                0 !== (65536 & (e = t.flags)) && 0 === (128 & e)
                  ? ((t.flags = (-65537 & e) | 128), t)
                  : null
              );
            case 5:
              return (Gi(t), null);
            case 13:
              if (
                (Na(Zi),
                null !== (e = t.memoizedState) && null !== e.dehydrated)
              ) {
                if (null === t.alternate) throw Error(i(340));
                hi();
              }
              return 65536 & (e = t.flags)
                ? ((t.flags = (-65537 & e) | 128), t)
                : null;
            case 19:
              return (Na(Zi), null);
            case 4:
              return (Ji(), null);
            case 10:
              return (_i(t.type._context), null);
            case 22:
            case 23:
              return (uc(), null);
            default:
              return null;
          }
        }
        ((Rs = function (e, t) {
          for (var n = t.child; null !== n; ) {
            if (5 === n.tag || 6 === n.tag) e.appendChild(n.stateNode);
            else if (4 !== n.tag && null !== n.child) {
              ((n.child.return = n), (n = n.child));
              continue;
            }
            if (n === t) break;
            for (; null === n.sibling; ) {
              if (null === n.return || n.return === t) return;
              n = n.return;
            }
            ((n.sibling.return = n.return), (n = n.sibling));
          }
        }),
          (Ts = function (e, t, n, r) {
            var a = e.memoizedProps;
            if (a !== r) {
              ((e = t.stateNode), Qi(Wi.current));
              var i,
                o = null;
              switch (n) {
                case "input":
                  ((a = Y(e, a)), (r = Y(e, r)), (o = []));
                  break;
                case "select":
                  ((a = M({}, a, { value: void 0 })),
                    (r = M({}, r, { value: void 0 })),
                    (o = []));
                  break;
                case "textarea":
                  ((a = re(e, a)), (r = re(e, r)), (o = []));
                  break;
                default:
                  "function" !== typeof a.onClick &&
                    "function" === typeof r.onClick &&
                    (e.onclick = Zr);
              }
              for (u in (ve(n, r), (n = null), a))
                if (!r.hasOwnProperty(u) && a.hasOwnProperty(u) && null != a[u])
                  if ("style" === u) {
                    var l = a[u];
                    for (i in l)
                      l.hasOwnProperty(i) && (n || (n = {}), (n[i] = ""));
                  } else
                    "dangerouslySetInnerHTML" !== u &&
                      "children" !== u &&
                      "suppressContentEditableWarning" !== u &&
                      "suppressHydrationWarning" !== u &&
                      "autoFocus" !== u &&
                      (s.hasOwnProperty(u)
                        ? o || (o = [])
                        : (o = o || []).push(u, null));
              for (u in r) {
                var c = r[u];
                if (
                  ((l = null != a ? a[u] : void 0),
                  r.hasOwnProperty(u) && c !== l && (null != c || null != l))
                )
                  if ("style" === u)
                    if (l) {
                      for (i in l)
                        !l.hasOwnProperty(i) ||
                          (c && c.hasOwnProperty(i)) ||
                          (n || (n = {}), (n[i] = ""));
                      for (i in c)
                        c.hasOwnProperty(i) &&
                          l[i] !== c[i] &&
                          (n || (n = {}), (n[i] = c[i]));
                    } else (n || (o || (o = []), o.push(u, n)), (n = c));
                  else
                    "dangerouslySetInnerHTML" === u
                      ? ((c = c ? c.__html : void 0),
                        (l = l ? l.__html : void 0),
                        null != c && l !== c && (o = o || []).push(u, c))
                      : "children" === u
                        ? ("string" !== typeof c && "number" !== typeof c) ||
                          (o = o || []).push(u, "" + c)
                        : "suppressContentEditableWarning" !== u &&
                          "suppressHydrationWarning" !== u &&
                          (s.hasOwnProperty(u)
                            ? (null != c && "onScroll" === u && Dr("scroll", e),
                              o || l === c || (o = []))
                            : (o = o || []).push(u, c));
              }
              n && (o = o || []).push("style", n);
              var u = o;
              (t.updateQueue = u) && (t.flags |= 4);
            }
          }),
          (Ls = function (e, t, n, r) {
            n !== r && (t.flags |= 4);
          }));
        var Qs = !1,
          Ys = !1,
          Js = "function" === typeof WeakSet ? WeakSet : Set,
          Xs = null;
        function Gs(e, t) {
          var n = e.ref;
          if (null !== n)
            if ("function" === typeof n)
              try {
                n(null);
              } catch (r) {
                Sc(e, t, r);
              }
            else n.current = null;
        }
        function Zs(e, t, n) {
          try {
            n();
          } catch (r) {
            Sc(e, t, r);
          }
        }
        var el = !1;
        function tl(e, t, n) {
          var r = t.updateQueue;
          if (null !== (r = null !== r ? r.lastEffect : null)) {
            var a = (r = r.next);
            do {
              if ((a.tag & e) === e) {
                var i = a.destroy;
                ((a.destroy = void 0), void 0 !== i && Zs(t, n, i));
              }
              a = a.next;
            } while (a !== r);
          }
        }
        function nl(e, t) {
          if (
            null !== (t = null !== (t = t.updateQueue) ? t.lastEffect : null)
          ) {
            var n = (t = t.next);
            do {
              if ((n.tag & e) === e) {
                var r = n.create;
                n.destroy = r();
              }
              n = n.next;
            } while (n !== t);
          }
        }
        function rl(e) {
          var t = e.ref;
          if (null !== t) {
            var n = e.stateNode;
            (e.tag, (e = n), "function" === typeof t ? t(e) : (t.current = e));
          }
        }
        function al(e) {
          var t = e.alternate;
          (null !== t && ((e.alternate = null), al(t)),
            (e.child = null),
            (e.deletions = null),
            (e.sibling = null),
            5 === e.tag &&
              null !== (t = e.stateNode) &&
              (delete t[fa],
              delete t[ha],
              delete t[ma],
              delete t[ga],
              delete t[ya]),
            (e.stateNode = null),
            (e.return = null),
            (e.dependencies = null),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.pendingProps = null),
            (e.stateNode = null),
            (e.updateQueue = null));
        }
        function il(e) {
          return 5 === e.tag || 3 === e.tag || 4 === e.tag;
        }
        function ol(e) {
          e: for (;;) {
            for (; null === e.sibling; ) {
              if (null === e.return || il(e.return)) return null;
              e = e.return;
            }
            for (
              e.sibling.return = e.return, e = e.sibling;
              5 !== e.tag && 6 !== e.tag && 18 !== e.tag;
            ) {
              if (2 & e.flags) continue e;
              if (null === e.child || 4 === e.tag) continue e;
              ((e.child.return = e), (e = e.child));
            }
            if (!(2 & e.flags)) return e.stateNode;
          }
        }
        function sl(e, t, n) {
          var r = e.tag;
          if (5 === r || 6 === r)
            ((e = e.stateNode),
              t
                ? 8 === n.nodeType
                  ? n.parentNode.insertBefore(e, t)
                  : n.insertBefore(e, t)
                : (8 === n.nodeType
                    ? (t = n.parentNode).insertBefore(e, n)
                    : (t = n).appendChild(e),
                  (null !== (n = n._reactRootContainer) && void 0 !== n) ||
                    null !== t.onclick ||
                    (t.onclick = Zr)));
          else if (4 !== r && null !== (e = e.child))
            for (sl(e, t, n), e = e.sibling; null !== e; )
              (sl(e, t, n), (e = e.sibling));
        }
        function ll(e, t, n) {
          var r = e.tag;
          if (5 === r || 6 === r)
            ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
          else if (4 !== r && null !== (e = e.child))
            for (ll(e, t, n), e = e.sibling; null !== e; )
              (ll(e, t, n), (e = e.sibling));
        }
        var cl = null,
          ul = !1;
        function dl(e, t, n) {
          for (n = n.child; null !== n; ) (fl(e, t, n), (n = n.sibling));
        }
        function fl(e, t, n) {
          if (it && "function" === typeof it.onCommitFiberUnmount)
            try {
              it.onCommitFiberUnmount(at, n);
            } catch (s) {}
          switch (n.tag) {
            case 5:
              Ys || Gs(n, t);
            case 6:
              var r = cl,
                a = ul;
              ((cl = null),
                dl(e, t, n),
                (ul = a),
                null !== (cl = r) &&
                  (ul
                    ? ((e = cl),
                      (n = n.stateNode),
                      8 === e.nodeType
                        ? e.parentNode.removeChild(n)
                        : e.removeChild(n))
                    : cl.removeChild(n.stateNode)));
              break;
            case 18:
              null !== cl &&
                (ul
                  ? ((e = cl),
                    (n = n.stateNode),
                    8 === e.nodeType
                      ? la(e.parentNode, n)
                      : 1 === e.nodeType && la(e, n),
                    qt(e))
                  : la(cl, n.stateNode));
              break;
            case 4:
              ((r = cl),
                (a = ul),
                (cl = n.stateNode.containerInfo),
                (ul = !0),
                dl(e, t, n),
                (cl = r),
                (ul = a));
              break;
            case 0:
            case 11:
            case 14:
            case 15:
              if (
                !Ys &&
                null !== (r = n.updateQueue) &&
                null !== (r = r.lastEffect)
              ) {
                a = r = r.next;
                do {
                  var i = a,
                    o = i.destroy;
                  ((i = i.tag),
                    void 0 !== o &&
                      (0 !== (2 & i) || 0 !== (4 & i)) &&
                      Zs(n, t, o),
                    (a = a.next));
                } while (a !== r);
              }
              dl(e, t, n);
              break;
            case 1:
              if (
                !Ys &&
                (Gs(n, t),
                "function" === typeof (r = n.stateNode).componentWillUnmount)
              )
                try {
                  ((r.props = n.memoizedProps),
                    (r.state = n.memoizedState),
                    r.componentWillUnmount());
                } catch (s) {
                  Sc(n, t, s);
                }
              dl(e, t, n);
              break;
            case 21:
              dl(e, t, n);
              break;
            case 22:
              1 & n.mode
                ? ((Ys = (r = Ys) || null !== n.memoizedState),
                  dl(e, t, n),
                  (Ys = r))
                : dl(e, t, n);
              break;
            default:
              dl(e, t, n);
          }
        }
        function hl(e) {
          var t = e.updateQueue;
          if (null !== t) {
            e.updateQueue = null;
            var n = e.stateNode;
            (null === n && (n = e.stateNode = new Js()),
              t.forEach(function (t) {
                var r = _c.bind(null, e, t);
                n.has(t) || (n.add(t), t.then(r, r));
              }));
          }
        }
        function pl(e, t) {
          var n = t.deletions;
          if (null !== n)
            for (var r = 0; r < n.length; r++) {
              var a = n[r];
              try {
                var o = e,
                  s = t,
                  l = s;
                e: for (; null !== l; ) {
                  switch (l.tag) {
                    case 5:
                      ((cl = l.stateNode), (ul = !1));
                      break e;
                    case 3:
                    case 4:
                      ((cl = l.stateNode.containerInfo), (ul = !0));
                      break e;
                  }
                  l = l.return;
                }
                if (null === cl) throw Error(i(160));
                (fl(o, s, a), (cl = null), (ul = !1));
                var c = a.alternate;
                (null !== c && (c.return = null), (a.return = null));
              } catch (u) {
                Sc(a, t, u);
              }
            }
          if (12854 & t.subtreeFlags)
            for (t = t.child; null !== t; ) (ml(t, e), (t = t.sibling));
        }
        function ml(e, t) {
          var n = e.alternate,
            r = e.flags;
          switch (e.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
              if ((pl(t, e), gl(e), 4 & r)) {
                try {
                  (tl(3, e, e.return), nl(3, e));
                } catch (g) {
                  Sc(e, e.return, g);
                }
                try {
                  tl(5, e, e.return);
                } catch (g) {
                  Sc(e, e.return, g);
                }
              }
              break;
            case 1:
              (pl(t, e), gl(e), 512 & r && null !== n && Gs(n, n.return));
              break;
            case 5:
              if (
                (pl(t, e),
                gl(e),
                512 & r && null !== n && Gs(n, n.return),
                32 & e.flags)
              ) {
                var a = e.stateNode;
                try {
                  fe(a, "");
                } catch (g) {
                  Sc(e, e.return, g);
                }
              }
              if (4 & r && null != (a = e.stateNode)) {
                var o = e.memoizedProps,
                  s = null !== n ? n.memoizedProps : o,
                  l = e.type,
                  c = e.updateQueue;
                if (((e.updateQueue = null), null !== c))
                  try {
                    ("input" === l &&
                      "radio" === o.type &&
                      null != o.name &&
                      X(a, o),
                      be(l, s));
                    var u = be(l, o);
                    for (s = 0; s < c.length; s += 2) {
                      var d = c[s],
                        f = c[s + 1];
                      "style" === d
                        ? ge(a, f)
                        : "dangerouslySetInnerHTML" === d
                          ? de(a, f)
                          : "children" === d
                            ? fe(a, f)
                            : b(a, d, f, u);
                    }
                    switch (l) {
                      case "input":
                        G(a, o);
                        break;
                      case "textarea":
                        ie(a, o);
                        break;
                      case "select":
                        var h = a._wrapperState.wasMultiple;
                        a._wrapperState.wasMultiple = !!o.multiple;
                        var p = o.value;
                        null != p
                          ? ne(a, !!o.multiple, p, !1)
                          : h !== !!o.multiple &&
                            (null != o.defaultValue
                              ? ne(a, !!o.multiple, o.defaultValue, !0)
                              : ne(a, !!o.multiple, o.multiple ? [] : "", !1));
                    }
                    a[ha] = o;
                  } catch (g) {
                    Sc(e, e.return, g);
                  }
              }
              break;
            case 6:
              if ((pl(t, e), gl(e), 4 & r)) {
                if (null === e.stateNode) throw Error(i(162));
                ((a = e.stateNode), (o = e.memoizedProps));
                try {
                  a.nodeValue = o;
                } catch (g) {
                  Sc(e, e.return, g);
                }
              }
              break;
            case 3:
              if (
                (pl(t, e),
                gl(e),
                4 & r && null !== n && n.memoizedState.isDehydrated)
              )
                try {
                  qt(t.containerInfo);
                } catch (g) {
                  Sc(e, e.return, g);
                }
              break;
            case 4:
            default:
              (pl(t, e), gl(e));
              break;
            case 13:
              (pl(t, e),
                gl(e),
                8192 & (a = e.child).flags &&
                  ((o = null !== a.memoizedState),
                  (a.stateNode.isHidden = o),
                  !o ||
                    (null !== a.alternate &&
                      null !== a.alternate.memoizedState) ||
                    (Ul = Xe())),
                4 & r && hl(e));
              break;
            case 22:
              if (
                ((d = null !== n && null !== n.memoizedState),
                1 & e.mode
                  ? ((Ys = (u = Ys) || d), pl(t, e), (Ys = u))
                  : pl(t, e),
                gl(e),
                8192 & r)
              ) {
                if (
                  ((u = null !== e.memoizedState),
                  (e.stateNode.isHidden = u) && !d && 0 !== (1 & e.mode))
                )
                  for (Xs = e, d = e.child; null !== d; ) {
                    for (f = Xs = d; null !== Xs; ) {
                      switch (((p = (h = Xs).child), h.tag)) {
                        case 0:
                        case 11:
                        case 14:
                        case 15:
                          tl(4, h, h.return);
                          break;
                        case 1:
                          Gs(h, h.return);
                          var m = h.stateNode;
                          if ("function" === typeof m.componentWillUnmount) {
                            ((r = h), (n = h.return));
                            try {
                              ((t = r),
                                (m.props = t.memoizedProps),
                                (m.state = t.memoizedState),
                                m.componentWillUnmount());
                            } catch (g) {
                              Sc(r, n, g);
                            }
                          }
                          break;
                        case 5:
                          Gs(h, h.return);
                          break;
                        case 22:
                          if (null !== h.memoizedState) {
                            xl(f);
                            continue;
                          }
                      }
                      null !== p ? ((p.return = h), (Xs = p)) : xl(f);
                    }
                    d = d.sibling;
                  }
                e: for (d = null, f = e; ; ) {
                  if (5 === f.tag) {
                    if (null === d) {
                      d = f;
                      try {
                        ((a = f.stateNode),
                          u
                            ? "function" === typeof (o = a.style).setProperty
                              ? o.setProperty("display", "none", "important")
                              : (o.display = "none")
                            : ((l = f.stateNode),
                              (s =
                                void 0 !== (c = f.memoizedProps.style) &&
                                null !== c &&
                                c.hasOwnProperty("display")
                                  ? c.display
                                  : null),
                              (l.style.display = me("display", s))));
                      } catch (g) {
                        Sc(e, e.return, g);
                      }
                    }
                  } else if (6 === f.tag) {
                    if (null === d)
                      try {
                        f.stateNode.nodeValue = u ? "" : f.memoizedProps;
                      } catch (g) {
                        Sc(e, e.return, g);
                      }
                  } else if (
                    ((22 !== f.tag && 23 !== f.tag) ||
                      null === f.memoizedState ||
                      f === e) &&
                    null !== f.child
                  ) {
                    ((f.child.return = f), (f = f.child));
                    continue;
                  }
                  if (f === e) break e;
                  for (; null === f.sibling; ) {
                    if (null === f.return || f.return === e) break e;
                    (d === f && (d = null), (f = f.return));
                  }
                  (d === f && (d = null),
                    (f.sibling.return = f.return),
                    (f = f.sibling));
                }
              }
              break;
            case 19:
              (pl(t, e), gl(e), 4 & r && hl(e));
            case 21:
          }
        }
        function gl(e) {
          var t = e.flags;
          if (2 & t) {
            try {
              e: {
                for (var n = e.return; null !== n; ) {
                  if (il(n)) {
                    var r = n;
                    break e;
                  }
                  n = n.return;
                }
                throw Error(i(160));
              }
              switch (r.tag) {
                case 5:
                  var a = r.stateNode;
                  (32 & r.flags && (fe(a, ""), (r.flags &= -33)),
                    ll(e, ol(e), a));
                  break;
                case 3:
                case 4:
                  var o = r.stateNode.containerInfo;
                  sl(e, ol(e), o);
                  break;
                default:
                  throw Error(i(161));
              }
            } catch (s) {
              Sc(e, e.return, s);
            }
            e.flags &= -3;
          }
          4096 & t && (e.flags &= -4097);
        }
        function yl(e, t, n) {
          ((Xs = e), vl(e, t, n));
        }
        function vl(e, t, n) {
          for (var r = 0 !== (1 & e.mode); null !== Xs; ) {
            var a = Xs,
              i = a.child;
            if (22 === a.tag && r) {
              var o = null !== a.memoizedState || Qs;
              if (!o) {
                var s = a.alternate,
                  l = (null !== s && null !== s.memoizedState) || Ys;
                s = Qs;
                var c = Ys;
                if (((Qs = o), (Ys = l) && !c))
                  for (Xs = a; null !== Xs; )
                    ((l = (o = Xs).child),
                      22 === o.tag && null !== o.memoizedState
                        ? wl(a)
                        : null !== l
                          ? ((l.return = o), (Xs = l))
                          : wl(a));
                for (; null !== i; ) ((Xs = i), vl(i, t, n), (i = i.sibling));
                ((Xs = a), (Qs = s), (Ys = c));
              }
              bl(e);
            } else
              0 !== (8772 & a.subtreeFlags) && null !== i
                ? ((i.return = a), (Xs = i))
                : bl(e);
          }
        }
        function bl(e) {
          for (; null !== Xs; ) {
            var t = Xs;
            if (0 !== (8772 & t.flags)) {
              var n = t.alternate;
              try {
                if (0 !== (8772 & t.flags))
                  switch (t.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ys || nl(5, t);
                      break;
                    case 1:
                      var r = t.stateNode;
                      if (4 & t.flags && !Ys)
                        if (null === n) r.componentDidMount();
                        else {
                          var a =
                            t.elementType === t.type
                              ? n.memoizedProps
                              : ns(t.type, n.memoizedProps);
                          r.componentDidUpdate(
                            a,
                            n.memoizedState,
                            r.__reactInternalSnapshotBeforeUpdate,
                          );
                        }
                      var o = t.updateQueue;
                      null !== o && Vi(t, o, r);
                      break;
                    case 3:
                      var s = t.updateQueue;
                      if (null !== s) {
                        if (((n = null), null !== t.child))
                          switch (t.child.tag) {
                            case 5:
                            case 1:
                              n = t.child.stateNode;
                          }
                        Vi(t, s, n);
                      }
                      break;
                    case 5:
                      var l = t.stateNode;
                      if (null === n && 4 & t.flags) {
                        n = l;
                        var c = t.memoizedProps;
                        switch (t.type) {
                          case "button":
                          case "input":
                          case "select":
                          case "textarea":
                            c.autoFocus && n.focus();
                            break;
                          case "img":
                            c.src && (n.src = c.src);
                        }
                      }
                      break;
                    case 6:
                    case 4:
                    case 12:
                    case 19:
                    case 17:
                    case 21:
                    case 22:
                    case 23:
                    case 25:
                      break;
                    case 13:
                      if (null === t.memoizedState) {
                        var u = t.alternate;
                        if (null !== u) {
                          var d = u.memoizedState;
                          if (null !== d) {
                            var f = d.dehydrated;
                            null !== f && qt(f);
                          }
                        }
                      }
                      break;
                    default:
                      throw Error(i(163));
                  }
                Ys || (512 & t.flags && rl(t));
              } catch (h) {
                Sc(t, t.return, h);
              }
            }
            if (t === e) {
              Xs = null;
              break;
            }
            if (null !== (n = t.sibling)) {
              ((n.return = t.return), (Xs = n));
              break;
            }
            Xs = t.return;
          }
        }
        function xl(e) {
          for (; null !== Xs; ) {
            var t = Xs;
            if (t === e) {
              Xs = null;
              break;
            }
            var n = t.sibling;
            if (null !== n) {
              ((n.return = t.return), (Xs = n));
              break;
            }
            Xs = t.return;
          }
        }
        function wl(e) {
          for (; null !== Xs; ) {
            var t = Xs;
            try {
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  var n = t.return;
                  try {
                    nl(4, t);
                  } catch (l) {
                    Sc(t, n, l);
                  }
                  break;
                case 1:
                  var r = t.stateNode;
                  if ("function" === typeof r.componentDidMount) {
                    var a = t.return;
                    try {
                      r.componentDidMount();
                    } catch (l) {
                      Sc(t, a, l);
                    }
                  }
                  var i = t.return;
                  try {
                    rl(t);
                  } catch (l) {
                    Sc(t, i, l);
                  }
                  break;
                case 5:
                  var o = t.return;
                  try {
                    rl(t);
                  } catch (l) {
                    Sc(t, o, l);
                  }
              }
            } catch (l) {
              Sc(t, t.return, l);
            }
            if (t === e) {
              Xs = null;
              break;
            }
            var s = t.sibling;
            if (null !== s) {
              ((s.return = t.return), (Xs = s));
              break;
            }
            Xs = t.return;
          }
        }
        var kl,
          Sl = Math.ceil,
          jl = x.ReactCurrentDispatcher,
          Nl = x.ReactCurrentOwner,
          El = x.ReactCurrentBatchConfig,
          _l = 0,
          Cl = null,
          Pl = null,
          Ol = 0,
          Rl = 0,
          Tl = ja(0),
          Ll = 0,
          Al = null,
          zl = 0,
          Fl = 0,
          Ml = 0,
          Bl = null,
          Dl = null,
          Ul = 0,
          Il = 1 / 0,
          ql = null,
          Vl = !1,
          Hl = null,
          Wl = null,
          $l = !1,
          Kl = null,
          Ql = 0,
          Yl = 0,
          Jl = null,
          Xl = -1,
          Gl = 0;
        function Zl() {
          return 0 !== (6 & _l) ? Xe() : -1 !== Xl ? Xl : (Xl = Xe());
        }
        function ec(e) {
          return 0 === (1 & e.mode)
            ? 1
            : 0 !== (2 & _l) && 0 !== Ol
              ? Ol & -Ol
              : null !== mi.transition
                ? (0 === Gl && (Gl = mt()), Gl)
                : 0 !== (e = bt)
                  ? e
                  : (e = void 0 === (e = window.event) ? 16 : Jt(e.type));
        }
        function tc(e, t, n, r) {
          if (50 < Yl) throw ((Yl = 0), (Jl = null), Error(i(185)));
          (yt(e, n, r),
            (0 !== (2 & _l) && e === Cl) ||
              (e === Cl && (0 === (2 & _l) && (Fl |= n), 4 === Ll && oc(e, Ol)),
              nc(e, r),
              1 === n &&
                0 === _l &&
                0 === (1 & t.mode) &&
                ((Il = Xe() + 500), Da && qa())));
        }
        function nc(e, t) {
          var n = e.callbackNode;
          !(function (e, t) {
            for (
              var n = e.suspendedLanes,
                r = e.pingedLanes,
                a = e.expirationTimes,
                i = e.pendingLanes;
              0 < i;
            ) {
              var o = 31 - ot(i),
                s = 1 << o,
                l = a[o];
              (-1 === l
                ? (0 !== (s & n) && 0 === (s & r)) || (a[o] = ht(s, t))
                : l <= t && (e.expiredLanes |= s),
                (i &= ~s));
            }
          })(e, t);
          var r = ft(e, e === Cl ? Ol : 0);
          if (0 === r)
            (null !== n && Qe(n),
              (e.callbackNode = null),
              (e.callbackPriority = 0));
          else if (((t = r & -r), e.callbackPriority !== t)) {
            if ((null != n && Qe(n), 1 === t))
              (0 === e.tag
                ? (function (e) {
                    ((Da = !0), Ia(e));
                  })(sc.bind(null, e))
                : Ia(sc.bind(null, e)),
                oa(function () {
                  0 === (6 & _l) && qa();
                }),
                (n = null));
            else {
              switch (xt(r)) {
                case 1:
                  n = Ze;
                  break;
                case 4:
                  n = et;
                  break;
                case 16:
                default:
                  n = tt;
                  break;
                case 536870912:
                  n = rt;
              }
              n = Cc(n, rc.bind(null, e));
            }
            ((e.callbackPriority = t), (e.callbackNode = n));
          }
        }
        function rc(e, t) {
          if (((Xl = -1), (Gl = 0), 0 !== (6 & _l))) throw Error(i(327));
          var n = e.callbackNode;
          if (wc() && e.callbackNode !== n) return null;
          var r = ft(e, e === Cl ? Ol : 0);
          if (0 === r) return null;
          if (0 !== (30 & r) || 0 !== (r & e.expiredLanes) || t) t = mc(e, r);
          else {
            t = r;
            var a = _l;
            _l |= 2;
            var o = hc();
            for (
              (Cl === e && Ol === t) ||
              ((ql = null), (Il = Xe() + 500), dc(e, t));
              ;
            )
              try {
                yc();
                break;
              } catch (l) {
                fc(e, l);
              }
            (Ei(),
              (jl.current = o),
              (_l = a),
              null !== Pl ? (t = 0) : ((Cl = null), (Ol = 0), (t = Ll)));
          }
          if (0 !== t) {
            if (
              (2 === t && 0 !== (a = pt(e)) && ((r = a), (t = ac(e, a))),
              1 === t)
            )
              throw ((n = Al), dc(e, 0), oc(e, r), nc(e, Xe()), n);
            if (6 === t) oc(e, r);
            else {
              if (
                ((a = e.current.alternate),
                0 === (30 & r) &&
                  !(function (e) {
                    for (var t = e; ; ) {
                      if (16384 & t.flags) {
                        var n = t.updateQueue;
                        if (null !== n && null !== (n = n.stores))
                          for (var r = 0; r < n.length; r++) {
                            var a = n[r],
                              i = a.getSnapshot;
                            a = a.value;
                            try {
                              if (!sr(i(), a)) return !1;
                            } catch (s) {
                              return !1;
                            }
                          }
                      }
                      if (((n = t.child), 16384 & t.subtreeFlags && null !== n))
                        ((n.return = t), (t = n));
                      else {
                        if (t === e) break;
                        for (; null === t.sibling; ) {
                          if (null === t.return || t.return === e) return !0;
                          t = t.return;
                        }
                        ((t.sibling.return = t.return), (t = t.sibling));
                      }
                    }
                    return !0;
                  })(a) &&
                  (2 === (t = mc(e, r)) &&
                    0 !== (o = pt(e)) &&
                    ((r = o), (t = ac(e, o))),
                  1 === t))
              )
                throw ((n = Al), dc(e, 0), oc(e, r), nc(e, Xe()), n);
              switch (((e.finishedWork = a), (e.finishedLanes = r), t)) {
                case 0:
                case 1:
                  throw Error(i(345));
                case 2:
                case 5:
                  xc(e, Dl, ql);
                  break;
                case 3:
                  if (
                    (oc(e, r),
                    (130023424 & r) === r && 10 < (t = Ul + 500 - Xe()))
                  ) {
                    if (0 !== ft(e, 0)) break;
                    if (((a = e.suspendedLanes) & r) !== r) {
                      (Zl(), (e.pingedLanes |= e.suspendedLanes & a));
                      break;
                    }
                    e.timeoutHandle = ra(xc.bind(null, e, Dl, ql), t);
                    break;
                  }
                  xc(e, Dl, ql);
                  break;
                case 4:
                  if ((oc(e, r), (4194240 & r) === r)) break;
                  for (t = e.eventTimes, a = -1; 0 < r; ) {
                    var s = 31 - ot(r);
                    ((o = 1 << s), (s = t[s]) > a && (a = s), (r &= ~o));
                  }
                  if (
                    ((r = a),
                    10 <
                      (r =
                        (120 > (r = Xe() - r)
                          ? 120
                          : 480 > r
                            ? 480
                            : 1080 > r
                              ? 1080
                              : 1920 > r
                                ? 1920
                                : 3e3 > r
                                  ? 3e3
                                  : 4320 > r
                                    ? 4320
                                    : 1960 * Sl(r / 1960)) - r))
                  ) {
                    e.timeoutHandle = ra(xc.bind(null, e, Dl, ql), r);
                    break;
                  }
                  xc(e, Dl, ql);
                  break;
                default:
                  throw Error(i(329));
              }
            }
          }
          return (nc(e, Xe()), e.callbackNode === n ? rc.bind(null, e) : null);
        }
        function ac(e, t) {
          var n = Bl;
          return (
            e.current.memoizedState.isDehydrated && (dc(e, t).flags |= 256),
            2 !== (e = mc(e, t)) && ((t = Dl), (Dl = n), null !== t && ic(t)),
            e
          );
        }
        function ic(e) {
          null === Dl ? (Dl = e) : Dl.push.apply(Dl, e);
        }
        function oc(e, t) {
          for (
            t &= ~Ml,
              t &= ~Fl,
              e.suspendedLanes |= t,
              e.pingedLanes &= ~t,
              e = e.expirationTimes;
            0 < t;
          ) {
            var n = 31 - ot(t),
              r = 1 << n;
            ((e[n] = -1), (t &= ~r));
          }
        }
        function sc(e) {
          if (0 !== (6 & _l)) throw Error(i(327));
          wc();
          var t = ft(e, 0);
          if (0 === (1 & t)) return (nc(e, Xe()), null);
          var n = mc(e, t);
          if (0 !== e.tag && 2 === n) {
            var r = pt(e);
            0 !== r && ((t = r), (n = ac(e, r)));
          }
          if (1 === n) throw ((n = Al), dc(e, 0), oc(e, t), nc(e, Xe()), n);
          if (6 === n) throw Error(i(345));
          return (
            (e.finishedWork = e.current.alternate),
            (e.finishedLanes = t),
            xc(e, Dl, ql),
            nc(e, Xe()),
            null
          );
        }
        function lc(e, t) {
          var n = _l;
          _l |= 1;
          try {
            return e(t);
          } finally {
            0 === (_l = n) && ((Il = Xe() + 500), Da && qa());
          }
        }
        function cc(e) {
          null !== Kl && 0 === Kl.tag && 0 === (6 & _l) && wc();
          var t = _l;
          _l |= 1;
          var n = El.transition,
            r = bt;
          try {
            if (((El.transition = null), (bt = 1), e)) return e();
          } finally {
            ((bt = r), (El.transition = n), 0 === (6 & (_l = t)) && qa());
          }
        }
        function uc() {
          ((Rl = Tl.current), Na(Tl));
        }
        function dc(e, t) {
          ((e.finishedWork = null), (e.finishedLanes = 0));
          var n = e.timeoutHandle;
          if ((-1 !== n && ((e.timeoutHandle = -1), aa(n)), null !== Pl))
            for (n = Pl.return; null !== n; ) {
              var r = n;
              switch ((ti(r), r.tag)) {
                case 1:
                  null !== (r = r.type.childContextTypes) &&
                    void 0 !== r &&
                    La();
                  break;
                case 3:
                  (Ji(), Na(Pa), Na(Ca), no());
                  break;
                case 5:
                  Gi(r);
                  break;
                case 4:
                  Ji();
                  break;
                case 13:
                case 19:
                  Na(Zi);
                  break;
                case 10:
                  _i(r.type._context);
                  break;
                case 22:
                case 23:
                  uc();
              }
              n = n.return;
            }
          if (
            ((Cl = e),
            (Pl = e = Tc(e.current, null)),
            (Ol = Rl = t),
            (Ll = 0),
            (Al = null),
            (Ml = Fl = zl = 0),
            (Dl = Bl = null),
            null !== Ri)
          ) {
            for (t = 0; t < Ri.length; t++)
              if (null !== (r = (n = Ri[t]).interleaved)) {
                n.interleaved = null;
                var a = r.next,
                  i = n.pending;
                if (null !== i) {
                  var o = i.next;
                  ((i.next = a), (r.next = o));
                }
                n.pending = r;
              }
            Ri = null;
          }
          return e;
        }
        function fc(e, t) {
          for (;;) {
            var n = Pl;
            try {
              if ((Ei(), (ro.current = Go), co)) {
                for (var r = oo.memoizedState; null !== r; ) {
                  var a = r.queue;
                  (null !== a && (a.pending = null), (r = r.next));
                }
                co = !1;
              }
              if (
                ((io = 0),
                (lo = so = oo = null),
                (uo = !1),
                (fo = 0),
                (Nl.current = null),
                null === n || null === n.return)
              ) {
                ((Ll = 1), (Al = t), (Pl = null));
                break;
              }
              e: {
                var o = e,
                  s = n.return,
                  l = n,
                  c = t;
                if (
                  ((t = Ol),
                  (l.flags |= 32768),
                  null !== c &&
                    "object" === typeof c &&
                    "function" === typeof c.then)
                ) {
                  var u = c,
                    d = l,
                    f = d.tag;
                  if (0 === (1 & d.mode) && (0 === f || 11 === f || 15 === f)) {
                    var h = d.alternate;
                    h
                      ? ((d.updateQueue = h.updateQueue),
                        (d.memoizedState = h.memoizedState),
                        (d.lanes = h.lanes))
                      : ((d.updateQueue = null), (d.memoizedState = null));
                  }
                  var p = gs(s);
                  if (null !== p) {
                    ((p.flags &= -257),
                      ys(p, s, l, 0, t),
                      1 & p.mode && ms(o, u, t),
                      (c = u));
                    var m = (t = p).updateQueue;
                    if (null === m) {
                      var g = new Set();
                      (g.add(c), (t.updateQueue = g));
                    } else m.add(c);
                    break e;
                  }
                  if (0 === (1 & t)) {
                    (ms(o, u, t), pc());
                    break e;
                  }
                  c = Error(i(426));
                } else if (ai && 1 & l.mode) {
                  var y = gs(s);
                  if (null !== y) {
                    (0 === (65536 & y.flags) && (y.flags |= 256),
                      ys(y, s, l, 0, t),
                      pi(cs(c, l)));
                    break e;
                  }
                }
                ((o = c = cs(c, l)),
                  4 !== Ll && (Ll = 2),
                  null === Bl ? (Bl = [o]) : Bl.push(o),
                  (o = s));
                do {
                  switch (o.tag) {
                    case 3:
                      ((o.flags |= 65536),
                        (t &= -t),
                        (o.lanes |= t),
                        Ii(o, hs(0, c, t)));
                      break e;
                    case 1:
                      l = c;
                      var v = o.type,
                        b = o.stateNode;
                      if (
                        0 === (128 & o.flags) &&
                        ("function" === typeof v.getDerivedStateFromError ||
                          (null !== b &&
                            "function" === typeof b.componentDidCatch &&
                            (null === Wl || !Wl.has(b))))
                      ) {
                        ((o.flags |= 65536),
                          (t &= -t),
                          (o.lanes |= t),
                          Ii(o, ps(o, l, t)));
                        break e;
                      }
                  }
                  o = o.return;
                } while (null !== o);
              }
              bc(n);
            } catch (x) {
              ((t = x), Pl === n && null !== n && (Pl = n = n.return));
              continue;
            }
            break;
          }
        }
        function hc() {
          var e = jl.current;
          return ((jl.current = Go), null === e ? Go : e);
        }
        function pc() {
          ((0 !== Ll && 3 !== Ll && 2 !== Ll) || (Ll = 4),
            null === Cl ||
              (0 === (268435455 & zl) && 0 === (268435455 & Fl)) ||
              oc(Cl, Ol));
        }
        function mc(e, t) {
          var n = _l;
          _l |= 2;
          var r = hc();
          for ((Cl === e && Ol === t) || ((ql = null), dc(e, t)); ; )
            try {
              gc();
              break;
            } catch (a) {
              fc(e, a);
            }
          if ((Ei(), (_l = n), (jl.current = r), null !== Pl))
            throw Error(i(261));
          return ((Cl = null), (Ol = 0), Ll);
        }
        function gc() {
          for (; null !== Pl; ) vc(Pl);
        }
        function yc() {
          for (; null !== Pl && !Ye(); ) vc(Pl);
        }
        function vc(e) {
          var t = kl(e.alternate, e, Rl);
          ((e.memoizedProps = e.pendingProps),
            null === t ? bc(e) : (Pl = t),
            (Nl.current = null));
        }
        function bc(e) {
          var t = e;
          do {
            var n = t.alternate;
            if (((e = t.return), 0 === (32768 & t.flags))) {
              if (null !== (n = $s(n, t, Rl))) return void (Pl = n);
            } else {
              if (null !== (n = Ks(n, t)))
                return ((n.flags &= 32767), void (Pl = n));
              if (null === e) return ((Ll = 6), void (Pl = null));
              ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
            }
            if (null !== (t = t.sibling)) return void (Pl = t);
            Pl = t = e;
          } while (null !== t);
          0 === Ll && (Ll = 5);
        }
        function xc(e, t, n) {
          var r = bt,
            a = El.transition;
          try {
            ((El.transition = null),
              (bt = 1),
              (function (e, t, n, r) {
                do {
                  wc();
                } while (null !== Kl);
                if (0 !== (6 & _l)) throw Error(i(327));
                n = e.finishedWork;
                var a = e.finishedLanes;
                if (null === n) return null;
                if (
                  ((e.finishedWork = null),
                  (e.finishedLanes = 0),
                  n === e.current)
                )
                  throw Error(i(177));
                ((e.callbackNode = null), (e.callbackPriority = 0));
                var o = n.lanes | n.childLanes;
                if (
                  ((function (e, t) {
                    var n = e.pendingLanes & ~t;
                    ((e.pendingLanes = t),
                      (e.suspendedLanes = 0),
                      (e.pingedLanes = 0),
                      (e.expiredLanes &= t),
                      (e.mutableReadLanes &= t),
                      (e.entangledLanes &= t),
                      (t = e.entanglements));
                    var r = e.eventTimes;
                    for (e = e.expirationTimes; 0 < n; ) {
                      var a = 31 - ot(n),
                        i = 1 << a;
                      ((t[a] = 0), (r[a] = -1), (e[a] = -1), (n &= ~i));
                    }
                  })(e, o),
                  e === Cl && ((Pl = Cl = null), (Ol = 0)),
                  (0 === (2064 & n.subtreeFlags) && 0 === (2064 & n.flags)) ||
                    $l ||
                    (($l = !0),
                    Cc(tt, function () {
                      return (wc(), null);
                    })),
                  (o = 0 !== (15990 & n.flags)),
                  0 !== (15990 & n.subtreeFlags) || o)
                ) {
                  ((o = El.transition), (El.transition = null));
                  var s = bt;
                  bt = 1;
                  var l = _l;
                  ((_l |= 4),
                    (Nl.current = null),
                    (function (e, t) {
                      if (((ea = Ht), hr((e = fr())))) {
                        if ("selectionStart" in e)
                          var n = {
                            start: e.selectionStart,
                            end: e.selectionEnd,
                          };
                        else
                          e: {
                            var r =
                              (n =
                                ((n = e.ownerDocument) && n.defaultView) ||
                                window).getSelection && n.getSelection();
                            if (r && 0 !== r.rangeCount) {
                              n = r.anchorNode;
                              var a = r.anchorOffset,
                                o = r.focusNode;
                              r = r.focusOffset;
                              try {
                                (n.nodeType, o.nodeType);
                              } catch (w) {
                                n = null;
                                break e;
                              }
                              var s = 0,
                                l = -1,
                                c = -1,
                                u = 0,
                                d = 0,
                                f = e,
                                h = null;
                              t: for (;;) {
                                for (
                                  var p;
                                  f !== n ||
                                    (0 !== a && 3 !== f.nodeType) ||
                                    (l = s + a),
                                    f !== o ||
                                      (0 !== r && 3 !== f.nodeType) ||
                                      (c = s + r),
                                    3 === f.nodeType &&
                                      (s += f.nodeValue.length),
                                    null !== (p = f.firstChild);
                                )
                                  ((h = f), (f = p));
                                for (;;) {
                                  if (f === e) break t;
                                  if (
                                    (h === n && ++u === a && (l = s),
                                    h === o && ++d === r && (c = s),
                                    null !== (p = f.nextSibling))
                                  )
                                    break;
                                  h = (f = h).parentNode;
                                }
                                f = p;
                              }
                              n =
                                -1 === l || -1 === c
                                  ? null
                                  : { start: l, end: c };
                            } else n = null;
                          }
                        n = n || { start: 0, end: 0 };
                      } else n = null;
                      for (
                        ta = { focusedElem: e, selectionRange: n },
                          Ht = !1,
                          Xs = t;
                        null !== Xs;
                      )
                        if (
                          ((e = (t = Xs).child),
                          0 !== (1028 & t.subtreeFlags) && null !== e)
                        )
                          ((e.return = t), (Xs = e));
                        else
                          for (; null !== Xs; ) {
                            t = Xs;
                            try {
                              var m = t.alternate;
                              if (0 !== (1024 & t.flags))
                                switch (t.tag) {
                                  case 0:
                                  case 11:
                                  case 15:
                                  case 5:
                                  case 6:
                                  case 4:
                                  case 17:
                                    break;
                                  case 1:
                                    if (null !== m) {
                                      var g = m.memoizedProps,
                                        y = m.memoizedState,
                                        v = t.stateNode,
                                        b = v.getSnapshotBeforeUpdate(
                                          t.elementType === t.type
                                            ? g
                                            : ns(t.type, g),
                                          y,
                                        );
                                      v.__reactInternalSnapshotBeforeUpdate = b;
                                    }
                                    break;
                                  case 3:
                                    var x = t.stateNode.containerInfo;
                                    1 === x.nodeType
                                      ? (x.textContent = "")
                                      : 9 === x.nodeType &&
                                        x.documentElement &&
                                        x.removeChild(x.documentElement);
                                    break;
                                  default:
                                    throw Error(i(163));
                                }
                            } catch (w) {
                              Sc(t, t.return, w);
                            }
                            if (null !== (e = t.sibling)) {
                              ((e.return = t.return), (Xs = e));
                              break;
                            }
                            Xs = t.return;
                          }
                      ((m = el), (el = !1));
                    })(e, n),
                    ml(n, e),
                    pr(ta),
                    (Ht = !!ea),
                    (ta = ea = null),
                    (e.current = n),
                    yl(n, e, a),
                    Je(),
                    (_l = l),
                    (bt = s),
                    (El.transition = o));
                } else e.current = n;
                if (
                  ($l && (($l = !1), (Kl = e), (Ql = a)),
                  (o = e.pendingLanes),
                  0 === o && (Wl = null),
                  (function (e) {
                    if (it && "function" === typeof it.onCommitFiberRoot)
                      try {
                        it.onCommitFiberRoot(
                          at,
                          e,
                          void 0,
                          128 === (128 & e.current.flags),
                        );
                      } catch (t) {}
                  })(n.stateNode),
                  nc(e, Xe()),
                  null !== t)
                )
                  for (r = e.onRecoverableError, n = 0; n < t.length; n++)
                    ((a = t[n]),
                      r(a.value, {
                        componentStack: a.stack,
                        digest: a.digest,
                      }));
                if (Vl) throw ((Vl = !1), (e = Hl), (Hl = null), e);
                (0 !== (1 & Ql) && 0 !== e.tag && wc(),
                  (o = e.pendingLanes),
                  0 !== (1 & o)
                    ? e === Jl
                      ? Yl++
                      : ((Yl = 0), (Jl = e))
                    : (Yl = 0),
                  qa());
              })(e, t, n, r));
          } finally {
            ((El.transition = a), (bt = r));
          }
          return null;
        }
        function wc() {
          if (null !== Kl) {
            var e = xt(Ql),
              t = El.transition,
              n = bt;
            try {
              if (((El.transition = null), (bt = 16 > e ? 16 : e), null === Kl))
                var r = !1;
              else {
                if (((e = Kl), (Kl = null), (Ql = 0), 0 !== (6 & _l)))
                  throw Error(i(331));
                var a = _l;
                for (_l |= 4, Xs = e.current; null !== Xs; ) {
                  var o = Xs,
                    s = o.child;
                  if (0 !== (16 & Xs.flags)) {
                    var l = o.deletions;
                    if (null !== l) {
                      for (var c = 0; c < l.length; c++) {
                        var u = l[c];
                        for (Xs = u; null !== Xs; ) {
                          var d = Xs;
                          switch (d.tag) {
                            case 0:
                            case 11:
                            case 15:
                              tl(8, d, o);
                          }
                          var f = d.child;
                          if (null !== f) ((f.return = d), (Xs = f));
                          else
                            for (; null !== Xs; ) {
                              var h = (d = Xs).sibling,
                                p = d.return;
                              if ((al(d), d === u)) {
                                Xs = null;
                                break;
                              }
                              if (null !== h) {
                                ((h.return = p), (Xs = h));
                                break;
                              }
                              Xs = p;
                            }
                        }
                      }
                      var m = o.alternate;
                      if (null !== m) {
                        var g = m.child;
                        if (null !== g) {
                          m.child = null;
                          do {
                            var y = g.sibling;
                            ((g.sibling = null), (g = y));
                          } while (null !== g);
                        }
                      }
                      Xs = o;
                    }
                  }
                  if (0 !== (2064 & o.subtreeFlags) && null !== s)
                    ((s.return = o), (Xs = s));
                  else
                    e: for (; null !== Xs; ) {
                      if (0 !== (2048 & (o = Xs).flags))
                        switch (o.tag) {
                          case 0:
                          case 11:
                          case 15:
                            tl(9, o, o.return);
                        }
                      var v = o.sibling;
                      if (null !== v) {
                        ((v.return = o.return), (Xs = v));
                        break e;
                      }
                      Xs = o.return;
                    }
                }
                var b = e.current;
                for (Xs = b; null !== Xs; ) {
                  var x = (s = Xs).child;
                  if (0 !== (2064 & s.subtreeFlags) && null !== x)
                    ((x.return = s), (Xs = x));
                  else
                    e: for (s = b; null !== Xs; ) {
                      if (0 !== (2048 & (l = Xs).flags))
                        try {
                          switch (l.tag) {
                            case 0:
                            case 11:
                            case 15:
                              nl(9, l);
                          }
                        } catch (k) {
                          Sc(l, l.return, k);
                        }
                      if (l === s) {
                        Xs = null;
                        break e;
                      }
                      var w = l.sibling;
                      if (null !== w) {
                        ((w.return = l.return), (Xs = w));
                        break e;
                      }
                      Xs = l.return;
                    }
                }
                if (
                  ((_l = a),
                  qa(),
                  it && "function" === typeof it.onPostCommitFiberRoot)
                )
                  try {
                    it.onPostCommitFiberRoot(at, e);
                  } catch (k) {}
                r = !0;
              }
              return r;
            } finally {
              ((bt = n), (El.transition = t));
            }
          }
          return !1;
        }
        function kc(e, t, n) {
          ((e = Di(e, (t = hs(0, (t = cs(n, t)), 1)), 1)),
            (t = Zl()),
            null !== e && (yt(e, 1, t), nc(e, t)));
        }
        function Sc(e, t, n) {
          if (3 === e.tag) kc(e, e, n);
          else
            for (; null !== t; ) {
              if (3 === t.tag) {
                kc(t, e, n);
                break;
              }
              if (1 === t.tag) {
                var r = t.stateNode;
                if (
                  "function" === typeof t.type.getDerivedStateFromError ||
                  ("function" === typeof r.componentDidCatch &&
                    (null === Wl || !Wl.has(r)))
                ) {
                  ((t = Di(t, (e = ps(t, (e = cs(n, e)), 1)), 1)),
                    (e = Zl()),
                    null !== t && (yt(t, 1, e), nc(t, e)));
                  break;
                }
              }
              t = t.return;
            }
        }
        function jc(e, t, n) {
          var r = e.pingCache;
          (null !== r && r.delete(t),
            (t = Zl()),
            (e.pingedLanes |= e.suspendedLanes & n),
            Cl === e &&
              (Ol & n) === n &&
              (4 === Ll ||
              (3 === Ll && (130023424 & Ol) === Ol && 500 > Xe() - Ul)
                ? dc(e, 0)
                : (Ml |= n)),
            nc(e, t));
        }
        function Nc(e, t) {
          0 === t &&
            (0 === (1 & e.mode)
              ? (t = 1)
              : ((t = ut), 0 === (130023424 & (ut <<= 1)) && (ut = 4194304)));
          var n = Zl();
          null !== (e = Ai(e, t)) && (yt(e, t, n), nc(e, n));
        }
        function Ec(e) {
          var t = e.memoizedState,
            n = 0;
          (null !== t && (n = t.retryLane), Nc(e, n));
        }
        function _c(e, t) {
          var n = 0;
          switch (e.tag) {
            case 13:
              var r = e.stateNode,
                a = e.memoizedState;
              null !== a && (n = a.retryLane);
              break;
            case 19:
              r = e.stateNode;
              break;
            default:
              throw Error(i(314));
          }
          (null !== r && r.delete(t), Nc(e, n));
        }
        function Cc(e, t) {
          return Ke(e, t);
        }
        function Pc(e, t, n, r) {
          ((this.tag = e),
            (this.key = n),
            (this.sibling =
              this.child =
              this.return =
              this.stateNode =
              this.type =
              this.elementType =
                null),
            (this.index = 0),
            (this.ref = null),
            (this.pendingProps = t),
            (this.dependencies =
              this.memoizedState =
              this.updateQueue =
              this.memoizedProps =
                null),
            (this.mode = r),
            (this.subtreeFlags = this.flags = 0),
            (this.deletions = null),
            (this.childLanes = this.lanes = 0),
            (this.alternate = null));
        }
        function Oc(e, t, n, r) {
          return new Pc(e, t, n, r);
        }
        function Rc(e) {
          return !(!(e = e.prototype) || !e.isReactComponent);
        }
        function Tc(e, t) {
          var n = e.alternate;
          return (
            null === n
              ? (((n = Oc(e.tag, t, e.key, e.mode)).elementType =
                  e.elementType),
                (n.type = e.type),
                (n.stateNode = e.stateNode),
                (n.alternate = e),
                (e.alternate = n))
              : ((n.pendingProps = t),
                (n.type = e.type),
                (n.flags = 0),
                (n.subtreeFlags = 0),
                (n.deletions = null)),
            (n.flags = 14680064 & e.flags),
            (n.childLanes = e.childLanes),
            (n.lanes = e.lanes),
            (n.child = e.child),
            (n.memoizedProps = e.memoizedProps),
            (n.memoizedState = e.memoizedState),
            (n.updateQueue = e.updateQueue),
            (t = e.dependencies),
            (n.dependencies =
              null === t
                ? null
                : { lanes: t.lanes, firstContext: t.firstContext }),
            (n.sibling = e.sibling),
            (n.index = e.index),
            (n.ref = e.ref),
            n
          );
        }
        function Lc(e, t, n, r, a, o) {
          var s = 2;
          if (((r = e), "function" === typeof e)) Rc(e) && (s = 1);
          else if ("string" === typeof e) s = 5;
          else
            e: switch (e) {
              case S:
                return Ac(n.children, a, o, t);
              case j:
                ((s = 8), (a |= 8));
                break;
              case N:
                return (
                  ((e = Oc(12, n, t, 2 | a)).elementType = N),
                  (e.lanes = o),
                  e
                );
              case P:
                return (
                  ((e = Oc(13, n, t, a)).elementType = P),
                  (e.lanes = o),
                  e
                );
              case O:
                return (
                  ((e = Oc(19, n, t, a)).elementType = O),
                  (e.lanes = o),
                  e
                );
              case L:
                return zc(n, a, o, t);
              default:
                if ("object" === typeof e && null !== e)
                  switch (e.$$typeof) {
                    case E:
                      s = 10;
                      break e;
                    case _:
                      s = 9;
                      break e;
                    case C:
                      s = 11;
                      break e;
                    case R:
                      s = 14;
                      break e;
                    case T:
                      ((s = 16), (r = null));
                      break e;
                  }
                throw Error(i(130, null == e ? e : typeof e, ""));
            }
          return (
            ((t = Oc(s, n, t, a)).elementType = e),
            (t.type = r),
            (t.lanes = o),
            t
          );
        }
        function Ac(e, t, n, r) {
          return (((e = Oc(7, e, r, t)).lanes = n), e);
        }
        function zc(e, t, n, r) {
          return (
            ((e = Oc(22, e, r, t)).elementType = L),
            (e.lanes = n),
            (e.stateNode = { isHidden: !1 }),
            e
          );
        }
        function Fc(e, t, n) {
          return (((e = Oc(6, e, null, t)).lanes = n), e);
        }
        function Mc(e, t, n) {
          return (
            ((t = Oc(
              4,
              null !== e.children ? e.children : [],
              e.key,
              t,
            )).lanes = n),
            (t.stateNode = {
              containerInfo: e.containerInfo,
              pendingChildren: null,
              implementation: e.implementation,
            }),
            t
          );
        }
        function Bc(e, t, n, r, a) {
          ((this.tag = t),
            (this.containerInfo = e),
            (this.finishedWork =
              this.pingCache =
              this.current =
              this.pendingChildren =
                null),
            (this.timeoutHandle = -1),
            (this.callbackNode = this.pendingContext = this.context = null),
            (this.callbackPriority = 0),
            (this.eventTimes = gt(0)),
            (this.expirationTimes = gt(-1)),
            (this.entangledLanes =
              this.finishedLanes =
              this.mutableReadLanes =
              this.expiredLanes =
              this.pingedLanes =
              this.suspendedLanes =
              this.pendingLanes =
                0),
            (this.entanglements = gt(0)),
            (this.identifierPrefix = r),
            (this.onRecoverableError = a),
            (this.mutableSourceEagerHydrationData = null));
        }
        function Dc(e, t, n, r, a, i, o, s, l) {
          return (
            (e = new Bc(e, t, n, s, l)),
            1 === t ? ((t = 1), !0 === i && (t |= 8)) : (t = 0),
            (i = Oc(3, null, null, t)),
            (e.current = i),
            (i.stateNode = e),
            (i.memoizedState = {
              element: r,
              isDehydrated: n,
              cache: null,
              transitions: null,
              pendingSuspenseBoundaries: null,
            }),
            Fi(i),
            e
          );
        }
        function Uc(e) {
          if (!e) return _a;
          e: {
            if (qe((e = e._reactInternals)) !== e || 1 !== e.tag)
              throw Error(i(170));
            var t = e;
            do {
              switch (t.tag) {
                case 3:
                  t = t.stateNode.context;
                  break e;
                case 1:
                  if (Ta(t.type)) {
                    t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                    break e;
                  }
              }
              t = t.return;
            } while (null !== t);
            throw Error(i(171));
          }
          if (1 === e.tag) {
            var n = e.type;
            if (Ta(n)) return za(e, n, t);
          }
          return t;
        }
        function Ic(e, t, n, r, a, i, o, s, l) {
          return (
            ((e = Dc(n, r, !0, e, 0, i, 0, s, l)).context = Uc(null)),
            (n = e.current),
            ((i = Bi((r = Zl()), (a = ec(n)))).callback =
              void 0 !== t && null !== t ? t : null),
            Di(n, i, a),
            (e.current.lanes = a),
            yt(e, a, r),
            nc(e, r),
            e
          );
        }
        function qc(e, t, n, r) {
          var a = t.current,
            i = Zl(),
            o = ec(a);
          return (
            (n = Uc(n)),
            null === t.context ? (t.context = n) : (t.pendingContext = n),
            ((t = Bi(i, o)).payload = { element: e }),
            null !== (r = void 0 === r ? null : r) && (t.callback = r),
            null !== (e = Di(a, t, o)) && (tc(e, a, o, i), Ui(e, a, o)),
            o
          );
        }
        function Vc(e) {
          return (e = e.current).child
            ? (e.child.tag, e.child.stateNode)
            : null;
        }
        function Hc(e, t) {
          if (null !== (e = e.memoizedState) && null !== e.dehydrated) {
            var n = e.retryLane;
            e.retryLane = 0 !== n && n < t ? n : t;
          }
        }
        function Wc(e, t) {
          (Hc(e, t), (e = e.alternate) && Hc(e, t));
        }
        kl = function (e, t, n) {
          if (null !== e)
            if (e.memoizedProps !== t.pendingProps || Pa.current) bs = !0;
            else {
              if (0 === (e.lanes & n) && 0 === (128 & t.flags))
                return (
                  (bs = !1),
                  (function (e, t, n) {
                    switch (t.tag) {
                      case 3:
                        (Ps(t), hi());
                        break;
                      case 5:
                        Xi(t);
                        break;
                      case 1:
                        Ta(t.type) && Fa(t);
                        break;
                      case 4:
                        Yi(t, t.stateNode.containerInfo);
                        break;
                      case 10:
                        var r = t.type._context,
                          a = t.memoizedProps.value;
                        (Ea(ki, r._currentValue), (r._currentValue = a));
                        break;
                      case 13:
                        if (null !== (r = t.memoizedState))
                          return null !== r.dehydrated
                            ? (Ea(Zi, 1 & Zi.current), (t.flags |= 128), null)
                            : 0 !== (n & t.child.childLanes)
                              ? Fs(e, t, n)
                              : (Ea(Zi, 1 & Zi.current),
                                null !== (e = Vs(e, t, n)) ? e.sibling : null);
                        Ea(Zi, 1 & Zi.current);
                        break;
                      case 19:
                        if (
                          ((r = 0 !== (n & t.childLanes)),
                          0 !== (128 & e.flags))
                        ) {
                          if (r) return Is(e, t, n);
                          t.flags |= 128;
                        }
                        if (
                          (null !== (a = t.memoizedState) &&
                            ((a.rendering = null),
                            (a.tail = null),
                            (a.lastEffect = null)),
                          Ea(Zi, Zi.current),
                          r)
                        )
                          break;
                        return null;
                      case 22:
                      case 23:
                        return ((t.lanes = 0), js(e, t, n));
                    }
                    return Vs(e, t, n);
                  })(e, t, n)
                );
              bs = 0 !== (131072 & e.flags);
            }
          else
            ((bs = !1), ai && 0 !== (1048576 & t.flags) && Za(t, $a, t.index));
          switch (((t.lanes = 0), t.tag)) {
            case 2:
              var r = t.type;
              (qs(e, t), (e = t.pendingProps));
              var a = Ra(t, Ca.current);
              (Pi(t, n), (a = go(null, t, r, e, a, n)));
              var o = yo();
              return (
                (t.flags |= 1),
                "object" === typeof a &&
                null !== a &&
                "function" === typeof a.render &&
                void 0 === a.$$typeof
                  ? ((t.tag = 1),
                    (t.memoizedState = null),
                    (t.updateQueue = null),
                    Ta(r) ? ((o = !0), Fa(t)) : (o = !1),
                    (t.memoizedState =
                      null !== a.state && void 0 !== a.state ? a.state : null),
                    Fi(t),
                    (a.updater = as),
                    (t.stateNode = a),
                    (a._reactInternals = t),
                    ls(t, r, e, n),
                    (t = Cs(null, t, r, !0, o, n)))
                  : ((t.tag = 0),
                    ai && o && ei(t),
                    xs(null, t, a, n),
                    (t = t.child)),
                t
              );
            case 16:
              r = t.elementType;
              e: {
                switch (
                  (qs(e, t),
                  (e = t.pendingProps),
                  (r = (a = r._init)(r._payload)),
                  (t.type = r),
                  (a = t.tag =
                    (function (e) {
                      if ("function" === typeof e) return Rc(e) ? 1 : 0;
                      if (void 0 !== e && null !== e) {
                        if ((e = e.$$typeof) === C) return 11;
                        if (e === R) return 14;
                      }
                      return 2;
                    })(r)),
                  (e = ns(r, e)),
                  a)
                ) {
                  case 0:
                    t = Es(null, t, r, e, n);
                    break e;
                  case 1:
                    t = _s(null, t, r, e, n);
                    break e;
                  case 11:
                    t = ws(null, t, r, e, n);
                    break e;
                  case 14:
                    t = ks(null, t, r, ns(r.type, e), n);
                    break e;
                }
                throw Error(i(306, r, ""));
              }
              return t;
            case 0:
              return (
                (r = t.type),
                (a = t.pendingProps),
                Es(e, t, r, (a = t.elementType === r ? a : ns(r, a)), n)
              );
            case 1:
              return (
                (r = t.type),
                (a = t.pendingProps),
                _s(e, t, r, (a = t.elementType === r ? a : ns(r, a)), n)
              );
            case 3:
              e: {
                if ((Ps(t), null === e)) throw Error(i(387));
                ((r = t.pendingProps),
                  (a = (o = t.memoizedState).element),
                  Mi(e, t),
                  qi(t, r, null, n));
                var s = t.memoizedState;
                if (((r = s.element), o.isDehydrated)) {
                  if (
                    ((o = {
                      element: r,
                      isDehydrated: !1,
                      cache: s.cache,
                      pendingSuspenseBoundaries: s.pendingSuspenseBoundaries,
                      transitions: s.transitions,
                    }),
                    (t.updateQueue.baseState = o),
                    (t.memoizedState = o),
                    256 & t.flags)
                  ) {
                    t = Os(e, t, r, n, (a = cs(Error(i(423)), t)));
                    break e;
                  }
                  if (r !== a) {
                    t = Os(e, t, r, n, (a = cs(Error(i(424)), t)));
                    break e;
                  }
                  for (
                    ri = ca(t.stateNode.containerInfo.firstChild),
                      ni = t,
                      ai = !0,
                      ii = null,
                      n = wi(t, null, r, n),
                      t.child = n;
                    n;
                  )
                    ((n.flags = (-3 & n.flags) | 4096), (n = n.sibling));
                } else {
                  if ((hi(), r === a)) {
                    t = Vs(e, t, n);
                    break e;
                  }
                  xs(e, t, r, n);
                }
                t = t.child;
              }
              return t;
            case 5:
              return (
                Xi(t),
                null === e && ci(t),
                (r = t.type),
                (a = t.pendingProps),
                (o = null !== e ? e.memoizedProps : null),
                (s = a.children),
                na(r, a)
                  ? (s = null)
                  : null !== o && na(r, o) && (t.flags |= 32),
                Ns(e, t),
                xs(e, t, s, n),
                t.child
              );
            case 6:
              return (null === e && ci(t), null);
            case 13:
              return Fs(e, t, n);
            case 4:
              return (
                Yi(t, t.stateNode.containerInfo),
                (r = t.pendingProps),
                null === e ? (t.child = xi(t, null, r, n)) : xs(e, t, r, n),
                t.child
              );
            case 11:
              return (
                (r = t.type),
                (a = t.pendingProps),
                ws(e, t, r, (a = t.elementType === r ? a : ns(r, a)), n)
              );
            case 7:
              return (xs(e, t, t.pendingProps, n), t.child);
            case 8:
            case 12:
              return (xs(e, t, t.pendingProps.children, n), t.child);
            case 10:
              e: {
                if (
                  ((r = t.type._context),
                  (a = t.pendingProps),
                  (o = t.memoizedProps),
                  (s = a.value),
                  Ea(ki, r._currentValue),
                  (r._currentValue = s),
                  null !== o)
                )
                  if (sr(o.value, s)) {
                    if (o.children === a.children && !Pa.current) {
                      t = Vs(e, t, n);
                      break e;
                    }
                  } else
                    for (
                      null !== (o = t.child) && (o.return = t);
                      null !== o;
                    ) {
                      var l = o.dependencies;
                      if (null !== l) {
                        s = o.child;
                        for (var c = l.firstContext; null !== c; ) {
                          if (c.context === r) {
                            if (1 === o.tag) {
                              (c = Bi(-1, n & -n)).tag = 2;
                              var u = o.updateQueue;
                              if (null !== u) {
                                var d = (u = u.shared).pending;
                                (null === d
                                  ? (c.next = c)
                                  : ((c.next = d.next), (d.next = c)),
                                  (u.pending = c));
                              }
                            }
                            ((o.lanes |= n),
                              null !== (c = o.alternate) && (c.lanes |= n),
                              Ci(o.return, n, t),
                              (l.lanes |= n));
                            break;
                          }
                          c = c.next;
                        }
                      } else if (10 === o.tag)
                        s = o.type === t.type ? null : o.child;
                      else if (18 === o.tag) {
                        if (null === (s = o.return)) throw Error(i(341));
                        ((s.lanes |= n),
                          null !== (l = s.alternate) && (l.lanes |= n),
                          Ci(s, n, t),
                          (s = o.sibling));
                      } else s = o.child;
                      if (null !== s) s.return = o;
                      else
                        for (s = o; null !== s; ) {
                          if (s === t) {
                            s = null;
                            break;
                          }
                          if (null !== (o = s.sibling)) {
                            ((o.return = s.return), (s = o));
                            break;
                          }
                          s = s.return;
                        }
                      o = s;
                    }
                (xs(e, t, a.children, n), (t = t.child));
              }
              return t;
            case 9:
              return (
                (a = t.type),
                (r = t.pendingProps.children),
                Pi(t, n),
                (r = r((a = Oi(a)))),
                (t.flags |= 1),
                xs(e, t, r, n),
                t.child
              );
            case 14:
              return (
                (a = ns((r = t.type), t.pendingProps)),
                ks(e, t, r, (a = ns(r.type, a)), n)
              );
            case 15:
              return Ss(e, t, t.type, t.pendingProps, n);
            case 17:
              return (
                (r = t.type),
                (a = t.pendingProps),
                (a = t.elementType === r ? a : ns(r, a)),
                qs(e, t),
                (t.tag = 1),
                Ta(r) ? ((e = !0), Fa(t)) : (e = !1),
                Pi(t, n),
                os(t, r, a),
                ls(t, r, a, n),
                Cs(null, t, r, !0, e, n)
              );
            case 19:
              return Is(e, t, n);
            case 22:
              return js(e, t, n);
          }
          throw Error(i(156, t.tag));
        };
        var $c =
          "function" === typeof reportError
            ? reportError
            : function (e) {
                console.error(e);
              };
        function Kc(e) {
          this._internalRoot = e;
        }
        function Qc(e) {
          this._internalRoot = e;
        }
        function Yc(e) {
          return !(
            !e ||
            (1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType)
          );
        }
        function Jc(e) {
          return !(
            !e ||
            (1 !== e.nodeType &&
              9 !== e.nodeType &&
              11 !== e.nodeType &&
              (8 !== e.nodeType ||
                " react-mount-point-unstable " !== e.nodeValue))
          );
        }
        function Xc() {}
        function Gc(e, t, n, r, a) {
          var i = n._reactRootContainer;
          if (i) {
            var o = i;
            if ("function" === typeof a) {
              var s = a;
              a = function () {
                var e = Vc(o);
                s.call(e);
              };
            }
            qc(t, o, e, a);
          } else
            o = (function (e, t, n, r, a) {
              if (a) {
                if ("function" === typeof r) {
                  var i = r;
                  r = function () {
                    var e = Vc(o);
                    i.call(e);
                  };
                }
                var o = Ic(t, r, e, 0, null, !1, 0, "", Xc);
                return (
                  (e._reactRootContainer = o),
                  (e[pa] = o.current),
                  qr(8 === e.nodeType ? e.parentNode : e),
                  cc(),
                  o
                );
              }
              for (; (a = e.lastChild); ) e.removeChild(a);
              if ("function" === typeof r) {
                var s = r;
                r = function () {
                  var e = Vc(l);
                  s.call(e);
                };
              }
              var l = Dc(e, 0, !1, null, 0, !1, 0, "", Xc);
              return (
                (e._reactRootContainer = l),
                (e[pa] = l.current),
                qr(8 === e.nodeType ? e.parentNode : e),
                cc(function () {
                  qc(t, l, n, r);
                }),
                l
              );
            })(n, t, e, a, r);
          return Vc(o);
        }
        ((Qc.prototype.render = Kc.prototype.render =
          function (e) {
            var t = this._internalRoot;
            if (null === t) throw Error(i(409));
            qc(e, t, null, null);
          }),
          (Qc.prototype.unmount = Kc.prototype.unmount =
            function () {
              var e = this._internalRoot;
              if (null !== e) {
                this._internalRoot = null;
                var t = e.containerInfo;
                (cc(function () {
                  qc(null, e, null, null);
                }),
                  (t[pa] = null));
              }
            }),
          (Qc.prototype.unstable_scheduleHydration = function (e) {
            if (e) {
              var t = jt();
              e = { blockedOn: null, target: e, priority: t };
              for (
                var n = 0;
                n < Lt.length && 0 !== t && t < Lt[n].priority;
                n++
              );
              (Lt.splice(n, 0, e), 0 === n && Mt(e));
            }
          }),
          (wt = function (e) {
            switch (e.tag) {
              case 3:
                var t = e.stateNode;
                if (t.current.memoizedState.isDehydrated) {
                  var n = dt(t.pendingLanes);
                  0 !== n &&
                    (vt(t, 1 | n),
                    nc(t, Xe()),
                    0 === (6 & _l) && ((Il = Xe() + 500), qa()));
                }
                break;
              case 13:
                (cc(function () {
                  var t = Ai(e, 1);
                  if (null !== t) {
                    var n = Zl();
                    tc(t, e, 1, n);
                  }
                }),
                  Wc(e, 1));
            }
          }),
          (kt = function (e) {
            if (13 === e.tag) {
              var t = Ai(e, 134217728);
              if (null !== t) tc(t, e, 134217728, Zl());
              Wc(e, 134217728);
            }
          }),
          (St = function (e) {
            if (13 === e.tag) {
              var t = ec(e),
                n = Ai(e, t);
              if (null !== n) tc(n, e, t, Zl());
              Wc(e, t);
            }
          }),
          (jt = function () {
            return bt;
          }),
          (Nt = function (e, t) {
            var n = bt;
            try {
              return ((bt = e), t());
            } finally {
              bt = n;
            }
          }),
          (ke = function (e, t, n) {
            switch (t) {
              case "input":
                if ((G(e, n), (t = n.name), "radio" === n.type && null != t)) {
                  for (n = e; n.parentNode; ) n = n.parentNode;
                  for (
                    n = n.querySelectorAll(
                      "input[name=" +
                        JSON.stringify("" + t) +
                        '][type="radio"]',
                    ),
                      t = 0;
                    t < n.length;
                    t++
                  ) {
                    var r = n[t];
                    if (r !== e && r.form === e.form) {
                      var a = wa(r);
                      if (!a) throw Error(i(90));
                      (K(r), G(r, a));
                    }
                  }
                }
                break;
              case "textarea":
                ie(e, n);
                break;
              case "select":
                null != (t = n.value) && ne(e, !!n.multiple, t, !1);
            }
          }),
          (Ce = lc),
          (Pe = cc));
        var Zc = {
            usingClientEntryPoint: !1,
            Events: [ba, xa, wa, Ee, _e, lc],
          },
          eu = {
            findFiberByHostInstance: va,
            bundleType: 0,
            version: "18.3.1",
            rendererPackageName: "react-dom",
          },
          tu = {
            bundleType: eu.bundleType,
            version: eu.version,
            rendererPackageName: eu.rendererPackageName,
            rendererConfig: eu.rendererConfig,
            overrideHookState: null,
            overrideHookStateDeletePath: null,
            overrideHookStateRenamePath: null,
            overrideProps: null,
            overridePropsDeletePath: null,
            overridePropsRenamePath: null,
            setErrorHandler: null,
            setSuspenseHandler: null,
            scheduleUpdate: null,
            currentDispatcherRef: x.ReactCurrentDispatcher,
            findHostInstanceByFiber: function (e) {
              return null === (e = We(e)) ? null : e.stateNode;
            },
            findFiberByHostInstance:
              eu.findFiberByHostInstance ||
              function () {
                return null;
              },
            findHostInstancesForRefresh: null,
            scheduleRefresh: null,
            scheduleRoot: null,
            setRefreshHandler: null,
            getCurrentFiber: null,
            reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
          };
        if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
          var nu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
          if (!nu.isDisabled && nu.supportsFiber)
            try {
              ((at = nu.inject(tu)), (it = nu));
            } catch (ue) {}
        }
        ((t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Zc),
          (t.createPortal = function (e, t) {
            var n =
              2 < arguments.length && void 0 !== arguments[2]
                ? arguments[2]
                : null;
            if (!Yc(t)) throw Error(i(200));
            return (function (e, t, n) {
              var r =
                3 < arguments.length && void 0 !== arguments[3]
                  ? arguments[3]
                  : null;
              return {
                $$typeof: k,
                key: null == r ? null : "" + r,
                children: e,
                containerInfo: t,
                implementation: n,
              };
            })(e, t, null, n);
          }),
          (t.createRoot = function (e, t) {
            if (!Yc(e)) throw Error(i(299));
            var n = !1,
              r = "",
              a = $c;
            return (
              null !== t &&
                void 0 !== t &&
                (!0 === t.unstable_strictMode && (n = !0),
                void 0 !== t.identifierPrefix && (r = t.identifierPrefix),
                void 0 !== t.onRecoverableError && (a = t.onRecoverableError)),
              (t = Dc(e, 1, !1, null, 0, n, 0, r, a)),
              (e[pa] = t.current),
              qr(8 === e.nodeType ? e.parentNode : e),
              new Kc(t)
            );
          }),
          (t.findDOMNode = function (e) {
            if (null == e) return null;
            if (1 === e.nodeType) return e;
            var t = e._reactInternals;
            if (void 0 === t) {
              if ("function" === typeof e.render) throw Error(i(188));
              throw ((e = Object.keys(e).join(",")), Error(i(268, e)));
            }
            return (e = null === (e = We(t)) ? null : e.stateNode);
          }),
          (t.flushSync = function (e) {
            return cc(e);
          }),
          (t.hydrate = function (e, t, n) {
            if (!Jc(t)) throw Error(i(200));
            return Gc(null, e, t, !0, n);
          }),
          (t.hydrateRoot = function (e, t, n) {
            if (!Yc(e)) throw Error(i(405));
            var r = (null != n && n.hydratedSources) || null,
              a = !1,
              o = "",
              s = $c;
            if (
              (null !== n &&
                void 0 !== n &&
                (!0 === n.unstable_strictMode && (a = !0),
                void 0 !== n.identifierPrefix && (o = n.identifierPrefix),
                void 0 !== n.onRecoverableError && (s = n.onRecoverableError)),
              (t = Ic(t, null, e, 1, null != n ? n : null, a, 0, o, s)),
              (e[pa] = t.current),
              qr(e),
              r)
            )
              for (e = 0; e < r.length; e++)
                ((a = (a = (n = r[e])._getVersion)(n._source)),
                  null == t.mutableSourceEagerHydrationData
                    ? (t.mutableSourceEagerHydrationData = [n, a])
                    : t.mutableSourceEagerHydrationData.push(n, a));
            return new Qc(t);
          }),
          (t.render = function (e, t, n) {
            if (!Jc(t)) throw Error(i(200));
            return Gc(null, e, t, !1, n);
          }),
          (t.unmountComponentAtNode = function (e) {
            if (!Jc(e)) throw Error(i(40));
            return (
              !!e._reactRootContainer &&
              (cc(function () {
                Gc(null, null, e, !1, function () {
                  ((e._reactRootContainer = null), (e[pa] = null));
                });
              }),
              !0)
            );
          }),
          (t.unstable_batchedUpdates = lc),
          (t.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
            if (!Jc(n)) throw Error(i(200));
            if (null == e || void 0 === e._reactInternals) throw Error(i(38));
            return Gc(e, t, n, !1, r);
          }),
          (t.version = "18.3.1-next-f1338f8080-20240426"));
      },
      853(e, t, n) {
        e.exports = n(234);
      },
      950(e, t, n) {
        (!(function e() {
          if (
            "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
            "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
          )
            try {
              __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
            } catch (t) {
              console.error(t);
            }
        })(),
          (e.exports = n(730)));
      },
    },
    t = {};
  function n(r) {
    var a = t[r];
    if (void 0 !== a) return a.exports;
    var i = (t[r] = { exports: {} });
    return (e[r](i, i.exports, n), i.exports);
  }
  ((() => {
    var e,
      t = Object.getPrototypeOf
        ? (e) => Object.getPrototypeOf(e)
        : (e) => e.__proto__;
    n.t = function (r, a) {
      if ((1 & a && (r = this(r)), 8 & a)) return r;
      if ("object" === typeof r && r) {
        if (4 & a && r.__esModule) return r;
        if (16 & a && "function" === typeof r.then) return r;
      }
      var i = Object.create(null);
      n.r(i);
      var o = {};
      e = e || [null, t({}), t([]), t(t)];
      for (
        var s = 2 & a && r;
        ("object" == typeof s || "function" == typeof s) && !~e.indexOf(s);
        s = t(s)
      )
        Object.getOwnPropertyNames(s).forEach((e) => (o[e] = () => r[e]));
      return ((o.default = () => r), n.d(i, o), i);
    };
  })(),
    (n.d = (e, t) => {
      for (var r in t)
        n.o(t, r) &&
          !n.o(e, r) &&
          Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
    }),
    (n.g = (function () {
      if ("object" === typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" === typeof window) return window;
      }
    })()),
    (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (n.r = (e) => {
      ("undefined" !== typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 }));
    }));
  var r = {};
  (n.r(r),
    n.d(r, {
      Decoder: () => rn,
      Encoder: () => nn,
      PacketType: () => tn,
      isPacketValid: () => ln,
      protocol: () => en,
    }));
  var a = {};
  (n.r(a),
    n.d(a, {
      hasBrowserEnv: () => Nr,
      hasStandardBrowserEnv: () => _r,
      hasStandardBrowserWebWorkerEnv: () => Cr,
      navigator: () => Er,
      origin: () => Pr,
    }));
  var i,
    o = n(43),
    s = n.t(o, 2),
    l = n(391);
  function c() {
    return (
      (c = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          }),
      c.apply(this, arguments)
    );
  }
  !(function (e) {
    ((e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE"));
  })(i || (i = {}));
  const u = "popstate";
  function d(e, t) {
    if (!1 === e || null === e || "undefined" === typeof e) throw new Error(t);
  }
  function f(e, t) {
    if (!e) {
      "undefined" !== typeof console && console.warn(t);
      try {
        throw new Error(t);
      } catch (n) {}
    }
  }
  function h(e, t) {
    return { usr: e.state, key: e.key, idx: t };
  }
  function p(e, t, n, r) {
    return (
      void 0 === n && (n = null),
      c(
        {
          pathname: "string" === typeof e ? e : e.pathname,
          search: "",
          hash: "",
        },
        "string" === typeof t ? g(t) : t,
        {
          state: n,
          key: (t && t.key) || r || Math.random().toString(36).substr(2, 8),
        },
      )
    );
  }
  function m(e) {
    let { pathname: t = "/", search: n = "", hash: r = "" } = e;
    return (
      n && "?" !== n && (t += "?" === n.charAt(0) ? n : "?" + n),
      r && "#" !== r && (t += "#" === r.charAt(0) ? r : "#" + r),
      t
    );
  }
  function g(e) {
    let t = {};
    if (e) {
      let n = e.indexOf("#");
      n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
      let r = e.indexOf("?");
      (r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
        e && (t.pathname = e));
    }
    return t;
  }
  function y(e, t, n, r) {
    void 0 === r && (r = {});
    let { window: a = document.defaultView, v5Compat: o = !1 } = r,
      s = a.history,
      l = i.Pop,
      f = null,
      g = y();
    function y() {
      return (s.state || { idx: null }).idx;
    }
    function v() {
      l = i.Pop;
      let e = y(),
        t = null == e ? null : e - g;
      ((g = e), f && f({ action: l, location: x.location, delta: t }));
    }
    function b(e) {
      let t =
          "null" !== a.location.origin ? a.location.origin : a.location.href,
        n = "string" === typeof e ? e : m(e);
      return (
        (n = n.replace(/ $/, "%20")),
        d(
          t,
          "No window.location.(origin|href) available to create URL for href: " +
            n,
        ),
        new URL(n, t)
      );
    }
    null == g && ((g = 0), s.replaceState(c({}, s.state, { idx: g }), ""));
    let x = {
      get action() {
        return l;
      },
      get location() {
        return e(a, s);
      },
      listen(e) {
        if (f) throw new Error("A history only accepts one active listener");
        return (
          a.addEventListener(u, v),
          (f = e),
          () => {
            (a.removeEventListener(u, v), (f = null));
          }
        );
      },
      createHref: (e) => t(a, e),
      createURL: b,
      encodeLocation(e) {
        let t = b(e);
        return { pathname: t.pathname, search: t.search, hash: t.hash };
      },
      push: function (e, t) {
        l = i.Push;
        let r = p(x.location, e, t);
        (n && n(r, e), (g = y() + 1));
        let c = h(r, g),
          u = x.createHref(r);
        try {
          s.pushState(c, "", u);
        } catch (d) {
          if (d instanceof DOMException && "DataCloneError" === d.name) throw d;
          a.location.assign(u);
        }
        o && f && f({ action: l, location: x.location, delta: 1 });
      },
      replace: function (e, t) {
        l = i.Replace;
        let r = p(x.location, e, t);
        (n && n(r, e), (g = y()));
        let a = h(r, g),
          c = x.createHref(r);
        (s.replaceState(a, "", c),
          o && f && f({ action: l, location: x.location, delta: 0 }));
      },
      go: (e) => s.go(e),
    };
    return x;
  }
  var v;
  !(function (e) {
    ((e.data = "data"),
      (e.deferred = "deferred"),
      (e.redirect = "redirect"),
      (e.error = "error"));
  })(v || (v = {}));
  new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
  function b(e, t, n) {
    return (void 0 === n && (n = "/"), x(e, t, n, !1));
  }
  function x(e, t, n, r) {
    let a = A(("string" === typeof t ? g(t) : t).pathname || "/", n);
    if (null == a) return null;
    let i = w(e);
    !(function (e) {
      e.sort((e, t) =>
        e.score !== t.score
          ? t.score - e.score
          : (function (e, t) {
              let n =
                e.length === t.length &&
                e.slice(0, -1).every((e, n) => e === t[n]);
              return n ? e[e.length - 1] - t[t.length - 1] : 0;
            })(
              e.routesMeta.map((e) => e.childrenIndex),
              t.routesMeta.map((e) => e.childrenIndex),
            ),
      );
    })(i);
    let o = null;
    for (let s = 0; null == o && s < i.length; ++s) {
      let e = L(a);
      o = R(i[s], e, r);
    }
    return o;
  }
  function w(e, t, n, r) {
    (void 0 === t && (t = []),
      void 0 === n && (n = []),
      void 0 === r && (r = ""));
    let a = (e, a, i) => {
      let o = {
        relativePath: void 0 === i ? e.path || "" : i,
        caseSensitive: !0 === e.caseSensitive,
        childrenIndex: a,
        route: e,
      };
      o.relativePath.startsWith("/") &&
        (d(
          o.relativePath.startsWith(r),
          'Absolute route path "' +
            o.relativePath +
            '" nested under path "' +
            r +
            '" is not valid. An absolute child route path must start with the combined path of all its parent routes.',
        ),
        (o.relativePath = o.relativePath.slice(r.length)));
      let s = q([r, o.relativePath]),
        l = n.concat(o);
      (e.children &&
        e.children.length > 0 &&
        (d(
          !0 !== e.index,
          'Index routes must not have child routes. Please remove all child routes from route path "' +
            s +
            '".',
        ),
        w(e.children, t, l, s)),
        (null != e.path || e.index) &&
          t.push({ path: s, score: O(s, e.index), routesMeta: l }));
    };
    return (
      e.forEach((e, t) => {
        var n;
        if ("" !== e.path && null != (n = e.path) && n.includes("?"))
          for (let r of k(e.path)) a(e, t, r);
        else a(e, t);
      }),
      t
    );
  }
  function k(e) {
    let t = e.split("/");
    if (0 === t.length) return [];
    let [n, ...r] = t,
      a = n.endsWith("?"),
      i = n.replace(/\?$/, "");
    if (0 === r.length) return a ? [i, ""] : [i];
    let o = k(r.join("/")),
      s = [];
    return (
      s.push(...o.map((e) => ("" === e ? i : [i, e].join("/")))),
      a && s.push(...o),
      s.map((t) => (e.startsWith("/") && "" === t ? "/" : t))
    );
  }
  const S = /^:[\w-]+$/,
    j = 3,
    N = 2,
    E = 1,
    _ = 10,
    C = -2,
    P = (e) => "*" === e;
  function O(e, t) {
    let n = e.split("/"),
      r = n.length;
    return (
      n.some(P) && (r += C),
      t && (r += N),
      n
        .filter((e) => !P(e))
        .reduce((e, t) => e + (S.test(t) ? j : "" === t ? E : _), r)
    );
  }
  function R(e, t, n) {
    void 0 === n && (n = !1);
    let { routesMeta: r } = e,
      a = {},
      i = "/",
      o = [];
    for (let s = 0; s < r.length; ++s) {
      let e = r[s],
        l = s === r.length - 1,
        c = "/" === i ? t : t.slice(i.length) || "/",
        u = T(
          { path: e.relativePath, caseSensitive: e.caseSensitive, end: l },
          c,
        ),
        d = e.route;
      if (
        (!u &&
          l &&
          n &&
          !r[r.length - 1].route.index &&
          (u = T(
            { path: e.relativePath, caseSensitive: e.caseSensitive, end: !1 },
            c,
          )),
        !u)
      )
        return null;
      (Object.assign(a, u.params),
        o.push({
          params: a,
          pathname: q([i, u.pathname]),
          pathnameBase: V(q([i, u.pathnameBase])),
          route: d,
        }),
        "/" !== u.pathnameBase && (i = q([i, u.pathnameBase])));
    }
    return o;
  }
  function T(e, t) {
    "string" === typeof e && (e = { path: e, caseSensitive: !1, end: !0 });
    let [n, r] = (function (e, t, n) {
        void 0 === t && (t = !1);
        void 0 === n && (n = !0);
        f(
          "*" === e || !e.endsWith("*") || e.endsWith("/*"),
          'Route path "' +
            e +
            '" will be treated as if it were "' +
            e.replace(/\*$/, "/*") +
            '" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "' +
            e.replace(/\*$/, "/*") +
            '".',
        );
        let r = [],
          a =
            "^" +
            e
              .replace(/\/*\*?$/, "")
              .replace(/^\/*/, "/")
              .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
              .replace(
                /\/:([\w-]+)(\?)?/g,
                (e, t, n) => (
                  r.push({ paramName: t, isOptional: null != n }),
                  n ? "/?([^\\/]+)?" : "/([^\\/]+)"
                ),
              );
        e.endsWith("*")
          ? (r.push({ paramName: "*" }),
            (a += "*" === e || "/*" === e ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
          : n
            ? (a += "\\/*$")
            : "" !== e && "/" !== e && (a += "(?:(?=\\/|$))");
        let i = new RegExp(a, t ? void 0 : "i");
        return [i, r];
      })(e.path, e.caseSensitive, e.end),
      a = t.match(n);
    if (!a) return null;
    let i = a[0],
      o = i.replace(/(.)\/+$/, "$1"),
      s = a.slice(1),
      l = r.reduce((e, t, n) => {
        let { paramName: r, isOptional: a } = t;
        if ("*" === r) {
          let e = s[n] || "";
          o = i.slice(0, i.length - e.length).replace(/(.)\/+$/, "$1");
        }
        const l = s[n];
        return ((e[r] = a && !l ? void 0 : (l || "").replace(/%2F/g, "/")), e);
      }, {});
    return { params: l, pathname: i, pathnameBase: o, pattern: e };
  }
  function L(e) {
    try {
      return e
        .split("/")
        .map((e) => decodeURIComponent(e).replace(/\//g, "%2F"))
        .join("/");
    } catch (t) {
      return (
        f(
          !1,
          'The URL path "' +
            e +
            '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding (' +
            t +
            ").",
        ),
        e
      );
    }
  }
  function A(e, t) {
    if ("/" === t) return e;
    if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
    let n = t.endsWith("/") ? t.length - 1 : t.length,
      r = e.charAt(n);
    return r && "/" !== r ? null : e.slice(n) || "/";
  }
  const z = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
  function F(e, t) {
    void 0 === t && (t = "/");
    let n,
      {
        pathname: r,
        search: a = "",
        hash: i = "",
      } = "string" === typeof e ? g(e) : e;
    if (r)
      if (((e) => z.test(e))(r)) n = r;
      else {
        if (r.includes("//")) {
          let e = r;
          ((r = r.replace(/\/\/+/g, "/")),
            f(
              !1,
              "Pathnames cannot have embedded double slashes - normalizing " +
                e +
                " -> " +
                r,
            ));
        }
        n = r.startsWith("/") ? M(r.substring(1), "/") : M(r, t);
      }
    else n = t;
    return { pathname: n, search: H(a), hash: W(i) };
  }
  function M(e, t) {
    let n = t.replace(/\/+$/, "").split("/");
    return (
      e.split("/").forEach((e) => {
        ".." === e ? n.length > 1 && n.pop() : "." !== e && n.push(e);
      }),
      n.length > 1 ? n.join("/") : "/"
    );
  }
  function B(e, t, n, r) {
    return (
      "Cannot include a '" +
      e +
      "' character in a manually specified `to." +
      t +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the `to." +
      n +
      '` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.'
    );
  }
  function D(e) {
    return e.filter(
      (e, t) => 0 === t || (e.route.path && e.route.path.length > 0),
    );
  }
  function U(e, t) {
    let n = D(e);
    return t
      ? n.map((e, t) => (t === n.length - 1 ? e.pathname : e.pathnameBase))
      : n.map((e) => e.pathnameBase);
  }
  function I(e, t, n, r) {
    let a;
    (void 0 === r && (r = !1),
      "string" === typeof e
        ? (a = g(e))
        : ((a = c({}, e)),
          d(
            !a.pathname || !a.pathname.includes("?"),
            B("?", "pathname", "search", a),
          ),
          d(
            !a.pathname || !a.pathname.includes("#"),
            B("#", "pathname", "hash", a),
          ),
          d(
            !a.search || !a.search.includes("#"),
            B("#", "search", "hash", a),
          )));
    let i,
      o = "" === e || "" === a.pathname,
      s = o ? "/" : a.pathname;
    if (null == s) i = n;
    else {
      let e = t.length - 1;
      if (!r && s.startsWith("..")) {
        let t = s.split("/");
        for (; ".." === t[0]; ) (t.shift(), (e -= 1));
        a.pathname = t.join("/");
      }
      i = e >= 0 ? t[e] : "/";
    }
    let l = F(a, i),
      u = s && "/" !== s && s.endsWith("/"),
      f = (o || "." === s) && n.endsWith("/");
    return (l.pathname.endsWith("/") || (!u && !f) || (l.pathname += "/"), l);
  }
  const q = (e) => e.join("/").replace(/\/\/+/g, "/"),
    V = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
    H = (e) => (e && "?" !== e ? (e.startsWith("?") ? e : "?" + e) : ""),
    W = (e) => (e && "#" !== e ? (e.startsWith("#") ? e : "#" + e) : "");
  Error;
  function $(e) {
    return (
      null != e &&
      "number" === typeof e.status &&
      "string" === typeof e.statusText &&
      "boolean" === typeof e.internal &&
      "data" in e
    );
  }
  const K = ["post", "put", "patch", "delete"],
    Q = (new Set(K), ["get", ...K]);
  (new Set(Q), new Set([301, 302, 303, 307, 308]), new Set([307, 308]));
  Symbol("deferred");
  function Y() {
    return (
      (Y = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          }),
      Y.apply(this, arguments)
    );
  }
  const J = o.createContext(null);
  const X = o.createContext(null);
  const G = o.createContext(null);
  const Z = o.createContext(null);
  const ee = o.createContext({ outlet: null, matches: [], isDataRoute: !1 });
  const te = o.createContext(null);
  function ne() {
    return null != o.useContext(Z);
  }
  function re() {
    return (ne() || d(!1), o.useContext(Z).location);
  }
  function ae(e) {
    o.useContext(G).static || o.useLayoutEffect(e);
  }
  function ie() {
    let { isDataRoute: e } = o.useContext(ee);
    return e
      ? (function () {
          let { router: e } = ye(me.UseNavigateStable),
            t = be(ge.UseNavigateStable),
            n = o.useRef(!1);
          return (
            ae(() => {
              n.current = !0;
            }),
            o.useCallback(
              function (r, a) {
                (void 0 === a && (a = {}),
                  n.current &&
                    ("number" === typeof r
                      ? e.navigate(r)
                      : e.navigate(r, Y({ fromRouteId: t }, a))));
              },
              [e, t],
            )
          );
        })()
      : (function () {
          ne() || d(!1);
          let e = o.useContext(J),
            { basename: t, future: n, navigator: r } = o.useContext(G),
            { matches: a } = o.useContext(ee),
            { pathname: i } = re(),
            s = JSON.stringify(U(a, n.v7_relativeSplatPath)),
            l = o.useRef(!1);
          return (
            ae(() => {
              l.current = !0;
            }),
            o.useCallback(
              function (n, a) {
                if ((void 0 === a && (a = {}), !l.current)) return;
                if ("number" === typeof n) return void r.go(n);
                let o = I(n, JSON.parse(s), i, "path" === a.relative);
                (null == e &&
                  "/" !== t &&
                  (o.pathname = "/" === o.pathname ? t : q([t, o.pathname])),
                  (a.replace ? r.replace : r.push)(o, a.state, a));
              },
              [t, r, s, i, e],
            )
          );
        })();
  }
  const oe = o.createContext(null);
  function se() {
    let { matches: e } = o.useContext(ee),
      t = e[e.length - 1];
    return t ? t.params : {};
  }
  function le(e, t) {
    let { relative: n } = void 0 === t ? {} : t,
      { future: r } = o.useContext(G),
      { matches: a } = o.useContext(ee),
      { pathname: i } = re(),
      s = JSON.stringify(U(a, r.v7_relativeSplatPath));
    return o.useMemo(() => I(e, JSON.parse(s), i, "path" === n), [e, s, i, n]);
  }
  function ce(e, t, n, r) {
    ne() || d(!1);
    let { navigator: a } = o.useContext(G),
      { matches: s } = o.useContext(ee),
      l = s[s.length - 1],
      c = l ? l.params : {},
      u = (l && l.pathname, l ? l.pathnameBase : "/");
    l && l.route;
    let f,
      h = re();
    if (t) {
      var p;
      let e = "string" === typeof t ? g(t) : t;
      ("/" === u ||
        (null == (p = e.pathname) ? void 0 : p.startsWith(u)) ||
        d(!1),
        (f = e));
    } else f = h;
    let m = f.pathname || "/",
      y = m;
    if ("/" !== u) {
      let e = u.replace(/^\//, "").split("/");
      y = "/" + m.replace(/^\//, "").split("/").slice(e.length).join("/");
    }
    let v = b(e, { pathname: y });
    let x = pe(
      v &&
        v.map((e) =>
          Object.assign({}, e, {
            params: Object.assign({}, c, e.params),
            pathname: q([
              u,
              a.encodeLocation
                ? a.encodeLocation(e.pathname).pathname
                : e.pathname,
            ]),
            pathnameBase:
              "/" === e.pathnameBase
                ? u
                : q([
                    u,
                    a.encodeLocation
                      ? a.encodeLocation(e.pathnameBase).pathname
                      : e.pathnameBase,
                  ]),
          }),
        ),
      s,
      n,
      r,
    );
    return t && x
      ? o.createElement(
          Z.Provider,
          {
            value: {
              location: Y(
                {
                  pathname: "/",
                  search: "",
                  hash: "",
                  state: null,
                  key: "default",
                },
                f,
              ),
              navigationType: i.Pop,
            },
          },
          x,
        )
      : x;
  }
  function ue() {
    let e = (function () {
        var e;
        let t = o.useContext(te),
          n = ve(ge.UseRouteError),
          r = be(ge.UseRouteError);
        if (void 0 !== t) return t;
        return null == (e = n.errors) ? void 0 : e[r];
      })(),
      t = $(e)
        ? e.status + " " + e.statusText
        : e instanceof Error
          ? e.message
          : JSON.stringify(e),
      n = e instanceof Error ? e.stack : null,
      r = "rgba(200,200,200, 0.5)",
      a = { padding: "0.5rem", backgroundColor: r };
    return o.createElement(
      o.Fragment,
      null,
      o.createElement("h2", null, "Unexpected Application Error!"),
      o.createElement("h3", { style: { fontStyle: "italic" } }, t),
      n ? o.createElement("pre", { style: a }, n) : null,
      null,
    );
  }
  const de = o.createElement(ue, null);
  class fe extends o.Component {
    constructor(e) {
      (super(e),
        (this.state = {
          location: e.location,
          revalidation: e.revalidation,
          error: e.error,
        }));
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      return t.location !== e.location ||
        ("idle" !== t.revalidation && "idle" === e.revalidation)
        ? { error: e.error, location: e.location, revalidation: e.revalidation }
        : {
            error: void 0 !== e.error ? e.error : t.error,
            location: t.location,
            revalidation: e.revalidation || t.revalidation,
          };
    }
    componentDidCatch(e, t) {
      console.error(
        "React Router caught the following error during render",
        e,
        t,
      );
    }
    render() {
      return void 0 !== this.state.error
        ? o.createElement(
            ee.Provider,
            { value: this.props.routeContext },
            o.createElement(te.Provider, {
              value: this.state.error,
              children: this.props.component,
            }),
          )
        : this.props.children;
    }
  }
  function he(e) {
    let { routeContext: t, match: n, children: r } = e,
      a = o.useContext(J);
    return (
      a &&
        a.static &&
        a.staticContext &&
        (n.route.errorElement || n.route.ErrorBoundary) &&
        (a.staticContext._deepestRenderedBoundaryId = n.route.id),
      o.createElement(ee.Provider, { value: t }, r)
    );
  }
  function pe(e, t, n, r) {
    var a;
    if (
      (void 0 === t && (t = []),
      void 0 === n && (n = null),
      void 0 === r && (r = null),
      null == e)
    ) {
      var i;
      if (!n) return null;
      if (n.errors) e = n.matches;
      else {
        if (
          !(
            null != (i = r) &&
            i.v7_partialHydration &&
            0 === t.length &&
            !n.initialized &&
            n.matches.length > 0
          )
        )
          return null;
        e = n.matches;
      }
    }
    let s = e,
      l = null == (a = n) ? void 0 : a.errors;
    if (null != l) {
      let e = s.findIndex(
        (e) => e.route.id && void 0 !== (null == l ? void 0 : l[e.route.id]),
      );
      (e >= 0 || d(!1), (s = s.slice(0, Math.min(s.length, e + 1))));
    }
    let c = !1,
      u = -1;
    if (n && r && r.v7_partialHydration)
      for (let o = 0; o < s.length; o++) {
        let e = s[o];
        if (
          ((e.route.HydrateFallback || e.route.hydrateFallbackElement) &&
            (u = o),
          e.route.id)
        ) {
          let { loaderData: t, errors: r } = n,
            a =
              e.route.loader &&
              void 0 === t[e.route.id] &&
              (!r || void 0 === r[e.route.id]);
          if (e.route.lazy || a) {
            ((c = !0), (s = u >= 0 ? s.slice(0, u + 1) : [s[0]]));
            break;
          }
        }
      }
    return s.reduceRight((e, r, a) => {
      let i,
        d = !1,
        f = null,
        h = null;
      var p;
      n &&
        ((i = l && r.route.id ? l[r.route.id] : void 0),
        (f = r.route.errorElement || de),
        c &&
          (u < 0 && 0 === a
            ? ((p = "route-fallback"),
              !1 || xe[p] || (xe[p] = !0),
              (d = !0),
              (h = null))
            : u === a &&
              ((d = !0), (h = r.route.hydrateFallbackElement || null))));
      let m = t.concat(s.slice(0, a + 1)),
        g = () => {
          let t;
          return (
            (t = i
              ? f
              : d
                ? h
                : r.route.Component
                  ? o.createElement(r.route.Component, null)
                  : r.route.element
                    ? r.route.element
                    : e),
            o.createElement(he, {
              match: r,
              routeContext: { outlet: e, matches: m, isDataRoute: null != n },
              children: t,
            })
          );
        };
      return n && (r.route.ErrorBoundary || r.route.errorElement || 0 === a)
        ? o.createElement(fe, {
            location: n.location,
            revalidation: n.revalidation,
            component: f,
            error: i,
            children: g(),
            routeContext: { outlet: null, matches: m, isDataRoute: !0 },
          })
        : g();
    }, null);
  }
  var me = (function (e) {
      return (
        (e.UseBlocker = "useBlocker"),
        (e.UseRevalidator = "useRevalidator"),
        (e.UseNavigateStable = "useNavigate"),
        e
      );
    })(me || {}),
    ge = (function (e) {
      return (
        (e.UseBlocker = "useBlocker"),
        (e.UseLoaderData = "useLoaderData"),
        (e.UseActionData = "useActionData"),
        (e.UseRouteError = "useRouteError"),
        (e.UseNavigation = "useNavigation"),
        (e.UseRouteLoaderData = "useRouteLoaderData"),
        (e.UseMatches = "useMatches"),
        (e.UseRevalidator = "useRevalidator"),
        (e.UseNavigateStable = "useNavigate"),
        (e.UseRouteId = "useRouteId"),
        e
      );
    })(ge || {});
  function ye(e) {
    let t = o.useContext(J);
    return (t || d(!1), t);
  }
  function ve(e) {
    let t = o.useContext(X);
    return (t || d(!1), t);
  }
  function be(e) {
    let t = (function () {
        let e = o.useContext(ee);
        return (e || d(!1), e);
      })(),
      n = t.matches[t.matches.length - 1];
    return (n.route.id || d(!1), n.route.id);
  }
  const xe = {};
  function we(e, t) {
    (null == e || e.v7_startTransition,
      void 0 === (null == e ? void 0 : e.v7_relativeSplatPath) &&
        (!t || t.v7_relativeSplatPath),
      t &&
        (t.v7_fetcherPersist,
        t.v7_normalizeFormMethod,
        t.v7_partialHydration,
        t.v7_skipActionErrorRevalidation));
  }
  s.startTransition;
  function ke(e) {
    let { to: t, replace: n, state: r, relative: a } = e;
    ne() || d(!1);
    let { future: i, static: s } = o.useContext(G),
      { matches: l } = o.useContext(ee),
      { pathname: c } = re(),
      u = ie(),
      f = I(t, U(l, i.v7_relativeSplatPath), c, "path" === a),
      h = JSON.stringify(f);
    return (
      o.useEffect(
        () => u(JSON.parse(h), { replace: n, state: r, relative: a }),
        [u, h, a, n, r],
      ),
      null
    );
  }
  function Se(e) {
    return (function (e) {
      let t = o.useContext(ee).outlet;
      return t ? o.createElement(oe.Provider, { value: e }, t) : t;
    })(e.context);
  }
  function je(e) {
    d(!1);
  }
  function Ne(e) {
    let {
      basename: t = "/",
      children: n = null,
      location: r,
      navigationType: a = i.Pop,
      navigator: s,
      static: l = !1,
      future: c,
    } = e;
    ne() && d(!1);
    let u = t.replace(/^\/*/, "/"),
      f = o.useMemo(
        () => ({
          basename: u,
          navigator: s,
          static: l,
          future: Y({ v7_relativeSplatPath: !1 }, c),
        }),
        [u, c, s, l],
      );
    "string" === typeof r && (r = g(r));
    let {
        pathname: h = "/",
        search: p = "",
        hash: m = "",
        state: y = null,
        key: v = "default",
      } = r,
      b = o.useMemo(() => {
        let e = A(h, u);
        return null == e
          ? null
          : {
              location: { pathname: e, search: p, hash: m, state: y, key: v },
              navigationType: a,
            };
      }, [u, h, p, m, y, v, a]);
    return null == b
      ? null
      : o.createElement(
          G.Provider,
          { value: f },
          o.createElement(Z.Provider, { children: n, value: b }),
        );
  }
  function Ee(e) {
    let { children: t, location: n } = e;
    return ce(_e(t), n);
  }
  new Promise(() => {});
  o.Component;
  function _e(e, t) {
    void 0 === t && (t = []);
    let n = [];
    return (
      o.Children.forEach(e, (e, r) => {
        if (!o.isValidElement(e)) return;
        let a = [...t, r];
        if (e.type === o.Fragment)
          return void n.push.apply(n, _e(e.props.children, a));
        (e.type !== je && d(!1), e.props.index && e.props.children && d(!1));
        let i = {
          id: e.props.id || a.join("-"),
          caseSensitive: e.props.caseSensitive,
          element: e.props.element,
          Component: e.props.Component,
          index: e.props.index,
          path: e.props.path,
          loader: e.props.loader,
          action: e.props.action,
          errorElement: e.props.errorElement,
          ErrorBoundary: e.props.ErrorBoundary,
          hasErrorBoundary:
            null != e.props.ErrorBoundary || null != e.props.errorElement,
          shouldRevalidate: e.props.shouldRevalidate,
          handle: e.props.handle,
          lazy: e.props.lazy,
        };
        (e.props.children && (i.children = _e(e.props.children, a)), n.push(i));
      }),
      n
    );
  }
  var Ce = n(950),
    Pe = n.t(Ce, 2);
  function Oe() {
    return (
      (Oe = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n)
                Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          }),
      Oe.apply(this, arguments)
    );
  }
  function Re(e, t) {
    if (null == e) return {};
    var n,
      r,
      a = {},
      i = Object.keys(e);
    for (r = 0; r < i.length; r++)
      ((n = i[r]), t.indexOf(n) >= 0 || (a[n] = e[n]));
    return a;
  }
  new Set([
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain",
  ]);
  const Te = [
      "onClick",
      "relative",
      "reloadDocument",
      "replace",
      "state",
      "target",
      "to",
      "preventScrollReset",
      "viewTransition",
    ],
    Le = [
      "aria-current",
      "caseSensitive",
      "className",
      "end",
      "style",
      "to",
      "viewTransition",
      "children",
    ];
  try {
    window.__reactRouterVersion = "6";
  } catch (Qi) {}
  const Ae = o.createContext({ isTransitioning: !1 });
  new Map();
  const ze = s.startTransition;
  (Pe.flushSync, s.useId);
  function Fe(e) {
    let { basename: t, children: n, future: r, window: a } = e,
      i = o.useRef();
    var s;
    null == i.current &&
      (i.current =
        (void 0 === (s = { window: a, v5Compat: !0 }) && (s = {}),
        y(
          function (e, t) {
            let { pathname: n, search: r, hash: a } = e.location;
            return p(
              "",
              { pathname: n, search: r, hash: a },
              (t.state && t.state.usr) || null,
              (t.state && t.state.key) || "default",
            );
          },
          function (e, t) {
            return "string" === typeof t ? t : m(t);
          },
          null,
          s,
        )));
    let l = i.current,
      [c, u] = o.useState({ action: l.action, location: l.location }),
      { v7_startTransition: d } = r || {},
      f = o.useCallback(
        (e) => {
          d && ze ? ze(() => u(e)) : u(e);
        },
        [u, d],
      );
    return (
      o.useLayoutEffect(() => l.listen(f), [l, f]),
      o.useEffect(() => we(r), [r]),
      o.createElement(Ne, {
        basename: t,
        children: n,
        location: c.location,
        navigationType: c.action,
        navigator: l,
        future: r,
      })
    );
  }
  const Me =
      "undefined" !== typeof window &&
      "undefined" !== typeof window.document &&
      "undefined" !== typeof window.document.createElement,
    Be = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
    De = o.forwardRef(function (e, t) {
      let n,
        {
          onClick: r,
          relative: a,
          reloadDocument: i,
          replace: s,
          state: l,
          target: c,
          to: u,
          preventScrollReset: f,
          viewTransition: h,
        } = e,
        p = Re(e, Te),
        { basename: g } = o.useContext(G),
        y = !1;
      if ("string" === typeof u && Be.test(u) && ((n = u), Me))
        try {
          let e = new URL(window.location.href),
            t = u.startsWith("//") ? new URL(e.protocol + u) : new URL(u),
            n = A(t.pathname, g);
          t.origin === e.origin && null != n
            ? (u = n + t.search + t.hash)
            : (y = !0);
        } catch (Qi) {}
      let v = (function (e, t) {
          let { relative: n } = void 0 === t ? {} : t;
          ne() || d(!1);
          let { basename: r, navigator: a } = o.useContext(G),
            { hash: i, pathname: s, search: l } = le(e, { relative: n }),
            c = s;
          return (
            "/" !== r && (c = "/" === s ? r : q([r, s])),
            a.createHref({ pathname: c, search: l, hash: i })
          );
        })(u, { relative: a }),
        b = (function (e, t) {
          let {
              target: n,
              replace: r,
              state: a,
              preventScrollReset: i,
              relative: s,
              viewTransition: l,
            } = void 0 === t ? {} : t,
            c = ie(),
            u = re(),
            d = le(e, { relative: s });
          return o.useCallback(
            (t) => {
              if (
                (function (e, t) {
                  return (
                    0 === e.button &&
                    (!t || "_self" === t) &&
                    !(function (e) {
                      return !!(
                        e.metaKey ||
                        e.altKey ||
                        e.ctrlKey ||
                        e.shiftKey
                      );
                    })(e)
                  );
                })(t, n)
              ) {
                t.preventDefault();
                let n = void 0 !== r ? r : m(u) === m(d);
                c(e, {
                  replace: n,
                  state: a,
                  preventScrollReset: i,
                  relative: s,
                  viewTransition: l,
                });
              }
            },
            [u, c, d, r, a, n, e, i, s, l],
          );
        })(u, {
          replace: s,
          state: l,
          target: c,
          preventScrollReset: f,
          relative: a,
          viewTransition: h,
        });
      return o.createElement(
        "a",
        Oe({}, p, {
          href: n || v,
          onClick:
            y || i
              ? r
              : function (e) {
                  (r && r(e), e.defaultPrevented || b(e));
                },
          ref: t,
          target: c,
        }),
      );
    });
  const Ue = o.forwardRef(function (e, t) {
    let {
        "aria-current": n = "page",
        caseSensitive: r = !1,
        className: a = "",
        end: i = !1,
        style: s,
        to: l,
        viewTransition: c,
        children: u,
      } = e,
      f = Re(e, Le),
      h = le(l, { relative: f.relative }),
      p = re(),
      m = o.useContext(X),
      { navigator: g, basename: y } = o.useContext(G),
      v =
        null != m &&
        (function (e, t) {
          void 0 === t && (t = {});
          let n = o.useContext(Ae);
          null == n && d(!1);
          let { basename: r } = Ve(Ie.useViewTransitionState),
            a = le(e, { relative: t.relative });
          if (!n.isTransitioning) return !1;
          let i =
              A(n.currentLocation.pathname, r) || n.currentLocation.pathname,
            s = A(n.nextLocation.pathname, r) || n.nextLocation.pathname;
          return null != T(a.pathname, s) || null != T(a.pathname, i);
        })(h) &&
        !0 === c,
      b = g.encodeLocation ? g.encodeLocation(h).pathname : h.pathname,
      x = p.pathname,
      w =
        m && m.navigation && m.navigation.location
          ? m.navigation.location.pathname
          : null;
    (r ||
      ((x = x.toLowerCase()),
      (w = w ? w.toLowerCase() : null),
      (b = b.toLowerCase())),
      w && y && (w = A(w, y) || w));
    const k = "/" !== b && b.endsWith("/") ? b.length - 1 : b.length;
    let S,
      j = x === b || (!i && x.startsWith(b) && "/" === x.charAt(k)),
      N =
        null != w &&
        (w === b || (!i && w.startsWith(b) && "/" === w.charAt(b.length))),
      E = { isActive: j, isPending: N, isTransitioning: v },
      _ = j ? n : void 0;
    S =
      "function" === typeof a
        ? a(E)
        : [
            a,
            j ? "active" : null,
            N ? "pending" : null,
            v ? "transitioning" : null,
          ]
            .filter(Boolean)
            .join(" ");
    let C = "function" === typeof s ? s(E) : s;
    return o.createElement(
      De,
      Oe({}, f, {
        "aria-current": _,
        className: S,
        ref: t,
        style: C,
        to: l,
        viewTransition: c,
      }),
      "function" === typeof u ? u(E) : u,
    );
  });
  var Ie, qe;
  function Ve(e) {
    let t = o.useContext(J);
    return (t || d(!1), t);
  }
  ((function (e) {
    ((e.UseScrollRestoration = "useScrollRestoration"),
      (e.UseSubmit = "useSubmit"),
      (e.UseSubmitFetcher = "useSubmitFetcher"),
      (e.UseFetcher = "useFetcher"),
      (e.useViewTransitionState = "useViewTransitionState"));
  })(Ie || (Ie = {})),
    (function (e) {
      ((e.UseFetcher = "useFetcher"),
        (e.UseFetchers = "useFetchers"),
        (e.UseScrollRestoration = "useScrollRestoration"));
    })(qe || (qe = {})));
  const He = Object.create(null);
  ((He.open = "0"),
    (He.close = "1"),
    (He.ping = "2"),
    (He.pong = "3"),
    (He.message = "4"),
    (He.upgrade = "5"),
    (He.noop = "6"));
  const We = Object.create(null);
  Object.keys(He).forEach((e) => {
    We[He[e]] = e;
  });
  const $e = { type: "error", data: "parser error" },
    Ke =
      "function" === typeof Blob ||
      ("undefined" !== typeof Blob &&
        "[object BlobConstructor]" === Object.prototype.toString.call(Blob)),
    Qe = "function" === typeof ArrayBuffer,
    Ye = (e) =>
      "function" === typeof ArrayBuffer.isView
        ? ArrayBuffer.isView(e)
        : e && e.buffer instanceof ArrayBuffer,
    Je = (e, t, n) => {
      let { type: r, data: a } = e;
      return Ke && a instanceof Blob
        ? t
          ? n(a)
          : Xe(a, n)
        : Qe && (a instanceof ArrayBuffer || Ye(a))
          ? t
            ? n(a)
            : Xe(new Blob([a]), n)
          : n(He[r] + (a || ""));
    },
    Xe = (e, t) => {
      const n = new FileReader();
      return (
        (n.onload = function () {
          const e = n.result.split(",")[1];
          t("b" + (e || ""));
        }),
        n.readAsDataURL(e)
      );
    };
  function Ge(e) {
    return e instanceof Uint8Array
      ? e
      : e instanceof ArrayBuffer
        ? new Uint8Array(e)
        : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  }
  let Ze;
  const et = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    tt = "undefined" === typeof Uint8Array ? [] : new Uint8Array(256);
  for (let Ji = 0; Ji < 64; Ji++) tt[et.charCodeAt(Ji)] = Ji;
  const nt = "function" === typeof ArrayBuffer,
    rt = (e, t) => {
      if ("string" !== typeof e) return { type: "message", data: it(e, t) };
      const n = e.charAt(0);
      if ("b" === n) return { type: "message", data: at(e.substring(1), t) };
      return We[n]
        ? e.length > 1
          ? { type: We[n], data: e.substring(1) }
          : { type: We[n] }
        : $e;
    },
    at = (e, t) => {
      if (nt) {
        const n = ((e) => {
          let t,
            n,
            r,
            a,
            i,
            o = 0.75 * e.length,
            s = e.length,
            l = 0;
          "=" === e[e.length - 1] && (o--, "=" === e[e.length - 2] && o--);
          const c = new ArrayBuffer(o),
            u = new Uint8Array(c);
          for (t = 0; t < s; t += 4)
            ((n = tt[e.charCodeAt(t)]),
              (r = tt[e.charCodeAt(t + 1)]),
              (a = tt[e.charCodeAt(t + 2)]),
              (i = tt[e.charCodeAt(t + 3)]),
              (u[l++] = (n << 2) | (r >> 4)),
              (u[l++] = ((15 & r) << 4) | (a >> 2)),
              (u[l++] = ((3 & a) << 6) | (63 & i)));
          return c;
        })(e);
        return it(n, t);
      }
      return { base64: !0, data: e };
    },
    it = (e, t) =>
      "blob" === t
        ? e instanceof Blob
          ? e
          : new Blob([e])
        : e instanceof ArrayBuffer
          ? e
          : e.buffer,
    ot = String.fromCharCode(30);
  function st() {
    return new TransformStream({
      transform(e, t) {
        !(function (e, t) {
          Ke && e.data instanceof Blob
            ? e.data.arrayBuffer().then(Ge).then(t)
            : Qe && (e.data instanceof ArrayBuffer || Ye(e.data))
              ? t(Ge(e.data))
              : Je(e, !1, (e) => {
                  (Ze || (Ze = new TextEncoder()), t(Ze.encode(e)));
                });
        })(e, (n) => {
          const r = n.length;
          let a;
          if (r < 126)
            ((a = new Uint8Array(1)), new DataView(a.buffer).setUint8(0, r));
          else if (r < 65536) {
            a = new Uint8Array(3);
            const e = new DataView(a.buffer);
            (e.setUint8(0, 126), e.setUint16(1, r));
          } else {
            a = new Uint8Array(9);
            const e = new DataView(a.buffer);
            (e.setUint8(0, 127), e.setBigUint64(1, BigInt(r)));
          }
          (e.data && "string" !== typeof e.data && (a[0] |= 128),
            t.enqueue(a),
            t.enqueue(n));
        });
      },
    });
  }
  let lt;
  function ct(e) {
    return e.reduce((e, t) => e + t.length, 0);
  }
  function ut(e, t) {
    if (e[0].length === t) return e.shift();
    const n = new Uint8Array(t);
    let r = 0;
    for (let a = 0; a < t; a++)
      ((n[a] = e[0][r++]), r === e[0].length && (e.shift(), (r = 0)));
    return (e.length && r < e[0].length && (e[0] = e[0].slice(r)), n);
  }
  function dt(e) {
    if (e)
      return (function (e) {
        for (var t in dt.prototype) e[t] = dt.prototype[t];
        return e;
      })(e);
  }
  ((dt.prototype.on = dt.prototype.addEventListener =
    function (e, t) {
      return (
        (this._callbacks = this._callbacks || {}),
        (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t),
        this
      );
    }),
    (dt.prototype.once = function (e, t) {
      function n() {
        (this.off(e, n), t.apply(this, arguments));
      }
      return ((n.fn = t), this.on(e, n), this);
    }),
    (dt.prototype.off =
      dt.prototype.removeListener =
      dt.prototype.removeAllListeners =
      dt.prototype.removeEventListener =
        function (e, t) {
          if (
            ((this._callbacks = this._callbacks || {}), 0 == arguments.length)
          )
            return ((this._callbacks = {}), this);
          var n,
            r = this._callbacks["$" + e];
          if (!r) return this;
          if (1 == arguments.length)
            return (delete this._callbacks["$" + e], this);
          for (var a = 0; a < r.length; a++)
            if ((n = r[a]) === t || n.fn === t) {
              r.splice(a, 1);
              break;
            }
          return (0 === r.length && delete this._callbacks["$" + e], this);
        }),
    (dt.prototype.emit = function (e) {
      this._callbacks = this._callbacks || {};
      for (
        var t = new Array(arguments.length - 1),
          n = this._callbacks["$" + e],
          r = 1;
        r < arguments.length;
        r++
      )
        t[r - 1] = arguments[r];
      if (n) {
        r = 0;
        for (var a = (n = n.slice(0)).length; r < a; ++r) n[r].apply(this, t);
      }
      return this;
    }),
    (dt.prototype.emitReserved = dt.prototype.emit),
    (dt.prototype.listeners = function (e) {
      return (
        (this._callbacks = this._callbacks || {}),
        this._callbacks["$" + e] || []
      );
    }),
    (dt.prototype.hasListeners = function (e) {
      return !!this.listeners(e).length;
    }));
  const ft =
      "function" === typeof Promise && "function" === typeof Promise.resolve
        ? (e) => Promise.resolve().then(e)
        : (e, t) => t(e, 0),
    ht =
      "undefined" !== typeof self
        ? self
        : "undefined" !== typeof window
          ? window
          : Function("return this")();
  function pt(e) {
    for (
      var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
      r < t;
      r++
    )
      n[r - 1] = arguments[r];
    return n.reduce((t, n) => (e.hasOwnProperty(n) && (t[n] = e[n]), t), {});
  }
  const mt = ht.setTimeout,
    gt = ht.clearTimeout;
  function yt(e, t) {
    t.useNativeTimers
      ? ((e.setTimeoutFn = mt.bind(ht)), (e.clearTimeoutFn = gt.bind(ht)))
      : ((e.setTimeoutFn = ht.setTimeout.bind(ht)),
        (e.clearTimeoutFn = ht.clearTimeout.bind(ht)));
  }
  function vt(e) {
    return "string" === typeof e
      ? (function (e) {
          let t = 0,
            n = 0;
          for (let r = 0, a = e.length; r < a; r++)
            ((t = e.charCodeAt(r)),
              t < 128
                ? (n += 1)
                : t < 2048
                  ? (n += 2)
                  : t < 55296 || t >= 57344
                    ? (n += 3)
                    : (r++, (n += 4)));
          return n;
        })(e)
      : Math.ceil(1.33 * (e.byteLength || e.size));
  }
  function bt() {
    return (
      Date.now().toString(36).substring(3) +
      Math.random().toString(36).substring(2, 5)
    );
  }
  class xt extends Error {
    constructor(e, t, n) {
      (super(e),
        (this.description = t),
        (this.context = n),
        (this.type = "TransportError"));
    }
  }
  class wt extends dt {
    constructor(e) {
      (super(),
        (this.writable = !1),
        yt(this, e),
        (this.opts = e),
        (this.query = e.query),
        (this.socket = e.socket),
        (this.supportsBinary = !e.forceBase64));
    }
    onError(e, t, n) {
      return (super.emitReserved("error", new xt(e, t, n)), this);
    }
    open() {
      return ((this.readyState = "opening"), this.doOpen(), this);
    }
    close() {
      return (
        ("opening" !== this.readyState && "open" !== this.readyState) ||
          (this.doClose(), this.onClose()),
        this
      );
    }
    send(e) {
      "open" === this.readyState && this.write(e);
    }
    onOpen() {
      ((this.readyState = "open"),
        (this.writable = !0),
        super.emitReserved("open"));
    }
    onData(e) {
      const t = rt(e, this.socket.binaryType);
      this.onPacket(t);
    }
    onPacket(e) {
      super.emitReserved("packet", e);
    }
    onClose(e) {
      ((this.readyState = "closed"), super.emitReserved("close", e));
    }
    pause(e) {}
    createUri(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      return (
        e +
        "://" +
        this._hostname() +
        this._port() +
        this.opts.path +
        this._query(t)
      );
    }
    _hostname() {
      const e = this.opts.hostname;
      return -1 === e.indexOf(":") ? e : "[" + e + "]";
    }
    _port() {
      return this.opts.port &&
        ((this.opts.secure && 443 !== Number(this.opts.port)) ||
          (!this.opts.secure && 80 !== Number(this.opts.port)))
        ? ":" + this.opts.port
        : "";
    }
    _query(e) {
      const t = (function (e) {
        let t = "";
        for (let n in e)
          e.hasOwnProperty(n) &&
            (t.length && (t += "&"),
            (t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n])));
        return t;
      })(e);
      return t.length ? "?" + t : "";
    }
  }
  class kt extends wt {
    constructor() {
      (super(...arguments), (this._polling = !1));
    }
    get name() {
      return "polling";
    }
    doOpen() {
      this._poll();
    }
    pause(e) {
      this.readyState = "pausing";
      const t = () => {
        ((this.readyState = "paused"), e());
      };
      if (this._polling || !this.writable) {
        let e = 0;
        (this._polling &&
          (e++,
          this.once("pollComplete", function () {
            --e || t();
          })),
          this.writable ||
            (e++,
            this.once("drain", function () {
              --e || t();
            })));
      } else t();
    }
    _poll() {
      ((this._polling = !0), this.doPoll(), this.emitReserved("poll"));
    }
    onData(e) {
      (((e, t) => {
        const n = e.split(ot),
          r = [];
        for (let a = 0; a < n.length; a++) {
          const e = rt(n[a], t);
          if ((r.push(e), "error" === e.type)) break;
        }
        return r;
      })(e, this.socket.binaryType).forEach((e) => {
        if (
          ("opening" === this.readyState && "open" === e.type && this.onOpen(),
          "close" === e.type)
        )
          return (
            this.onClose({ description: "transport closed by the server" }),
            !1
          );
        this.onPacket(e);
      }),
        "closed" !== this.readyState &&
          ((this._polling = !1),
          this.emitReserved("pollComplete"),
          "open" === this.readyState && this._poll()));
    }
    doClose() {
      const e = () => {
        this.write([{ type: "close" }]);
      };
      "open" === this.readyState ? e() : this.once("open", e);
    }
    write(e) {
      ((this.writable = !1),
        ((e, t) => {
          const n = e.length,
            r = new Array(n);
          let a = 0;
          e.forEach((e, i) => {
            Je(e, !1, (e) => {
              ((r[i] = e), ++a === n && t(r.join(ot)));
            });
          });
        })(e, (e) => {
          this.doWrite(e, () => {
            ((this.writable = !0), this.emitReserved("drain"));
          });
        }));
    }
    uri() {
      const e = this.opts.secure ? "https" : "http",
        t = this.query || {};
      return (
        !1 !== this.opts.timestampRequests &&
          (t[this.opts.timestampParam] = bt()),
        this.supportsBinary || t.sid || (t.b64 = 1),
        this.createUri(e, t)
      );
    }
  }
  let St = !1;
  try {
    St =
      "undefined" !== typeof XMLHttpRequest &&
      "withCredentials" in new XMLHttpRequest();
  } catch (Yi) {}
  const jt = St;
  function Nt() {}
  class Et extends kt {
    constructor(e) {
      if ((super(e), "undefined" !== typeof location)) {
        const t = "https:" === location.protocol;
        let n = location.port;
        (n || (n = t ? "443" : "80"),
          (this.xd =
            ("undefined" !== typeof location &&
              e.hostname !== location.hostname) ||
            n !== e.port));
      }
    }
    doWrite(e, t) {
      const n = this.request({ method: "POST", data: e });
      (n.on("success", t),
        n.on("error", (e, t) => {
          this.onError("xhr post error", e, t);
        }));
    }
    doPoll() {
      const e = this.request();
      (e.on("data", this.onData.bind(this)),
        e.on("error", (e, t) => {
          this.onError("xhr poll error", e, t);
        }),
        (this.pollXhr = e));
    }
  }
  class _t extends dt {
    constructor(e, t, n) {
      (super(),
        (this.createRequest = e),
        yt(this, n),
        (this._opts = n),
        (this._method = n.method || "GET"),
        (this._uri = t),
        (this._data = void 0 !== n.data ? n.data : null),
        this._create());
    }
    _create() {
      var e;
      const t = pt(
        this._opts,
        "agent",
        "pfx",
        "key",
        "passphrase",
        "cert",
        "ca",
        "ciphers",
        "rejectUnauthorized",
        "autoUnref",
      );
      t.xdomain = !!this._opts.xd;
      const n = (this._xhr = this.createRequest(t));
      try {
        n.open(this._method, this._uri, !0);
        try {
          if (this._opts.extraHeaders) {
            n.setDisableHeaderCheck && n.setDisableHeaderCheck(!0);
            for (let e in this._opts.extraHeaders)
              this._opts.extraHeaders.hasOwnProperty(e) &&
                n.setRequestHeader(e, this._opts.extraHeaders[e]);
          }
        } catch (Qi) {}
        if ("POST" === this._method)
          try {
            n.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
          } catch (Qi) {}
        try {
          n.setRequestHeader("Accept", "*/*");
        } catch (Qi) {}
        (null === (e = this._opts.cookieJar) || void 0 === e || e.addCookies(n),
          "withCredentials" in n &&
            (n.withCredentials = this._opts.withCredentials),
          this._opts.requestTimeout && (n.timeout = this._opts.requestTimeout),
          (n.onreadystatechange = () => {
            var e;
            (3 === n.readyState &&
              (null === (e = this._opts.cookieJar) ||
                void 0 === e ||
                e.parseCookies(n.getResponseHeader("set-cookie"))),
              4 === n.readyState &&
                (200 === n.status || 1223 === n.status
                  ? this._onLoad()
                  : this.setTimeoutFn(() => {
                      this._onError(
                        "number" === typeof n.status ? n.status : 0,
                      );
                    }, 0)));
          }),
          n.send(this._data));
      } catch (Qi) {
        return void this.setTimeoutFn(() => {
          this._onError(Qi);
        }, 0);
      }
      "undefined" !== typeof document &&
        ((this._index = _t.requestsCount++), (_t.requests[this._index] = this));
    }
    _onError(e) {
      (this.emitReserved("error", e, this._xhr), this._cleanup(!0));
    }
    _cleanup(e) {
      if ("undefined" !== typeof this._xhr && null !== this._xhr) {
        if (((this._xhr.onreadystatechange = Nt), e))
          try {
            this._xhr.abort();
          } catch (Qi) {}
        ("undefined" !== typeof document && delete _t.requests[this._index],
          (this._xhr = null));
      }
    }
    _onLoad() {
      const e = this._xhr.responseText;
      null !== e &&
        (this.emitReserved("data", e),
        this.emitReserved("success"),
        this._cleanup());
    }
    abort() {
      this._cleanup();
    }
  }
  if (
    ((_t.requestsCount = 0),
    (_t.requests = {}),
    "undefined" !== typeof document)
  )
    if ("function" === typeof attachEvent) attachEvent("onunload", Ct);
    else if ("function" === typeof addEventListener) {
      addEventListener("onpagehide" in ht ? "pagehide" : "unload", Ct, !1);
    }
  function Ct() {
    for (let e in _t.requests)
      _t.requests.hasOwnProperty(e) && _t.requests[e].abort();
  }
  const Pt = (function () {
    const e = Ot({ xdomain: !1 });
    return e && null !== e.responseType;
  })();
  function Ot(e) {
    const t = e.xdomain;
    try {
      if ("undefined" !== typeof XMLHttpRequest && (!t || jt))
        return new XMLHttpRequest();
    } catch (Qi) {}
    if (!t)
      try {
        return new ht[["Active"].concat("Object").join("X")](
          "Microsoft.XMLHTTP",
        );
      } catch (Qi) {}
  }
  const Rt =
    "undefined" !== typeof navigator &&
    "string" === typeof navigator.product &&
    "reactnative" === navigator.product.toLowerCase();
  class Tt extends wt {
    get name() {
      return "websocket";
    }
    doOpen() {
      const e = this.uri(),
        t = this.opts.protocols,
        n = Rt
          ? {}
          : pt(
              this.opts,
              "agent",
              "perMessageDeflate",
              "pfx",
              "key",
              "passphrase",
              "cert",
              "ca",
              "ciphers",
              "rejectUnauthorized",
              "localAddress",
              "protocolVersion",
              "origin",
              "maxPayload",
              "family",
              "checkServerIdentity",
            );
      this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
      try {
        this.ws = this.createSocket(e, t, n);
      } catch (Yi) {
        return this.emitReserved("error", Yi);
      }
      ((this.ws.binaryType = this.socket.binaryType), this.addEventListeners());
    }
    addEventListeners() {
      ((this.ws.onopen = () => {
        (this.opts.autoUnref && this.ws._socket.unref(), this.onOpen());
      }),
        (this.ws.onclose = (e) =>
          this.onClose({
            description: "websocket connection closed",
            context: e,
          })),
        (this.ws.onmessage = (e) => this.onData(e.data)),
        (this.ws.onerror = (e) => this.onError("websocket error", e)));
    }
    write(e) {
      this.writable = !1;
      for (let t = 0; t < e.length; t++) {
        const n = e[t],
          r = t === e.length - 1;
        Je(n, this.supportsBinary, (e) => {
          try {
            this.doWrite(n, e);
          } catch (Qi) {}
          r &&
            ft(() => {
              ((this.writable = !0), this.emitReserved("drain"));
            }, this.setTimeoutFn);
        });
      }
    }
    doClose() {
      "undefined" !== typeof this.ws &&
        ((this.ws.onerror = () => {}), this.ws.close(), (this.ws = null));
    }
    uri() {
      const e = this.opts.secure ? "wss" : "ws",
        t = this.query || {};
      return (
        this.opts.timestampRequests && (t[this.opts.timestampParam] = bt()),
        this.supportsBinary || (t.b64 = 1),
        this.createUri(e, t)
      );
    }
  }
  const Lt = ht.WebSocket || ht.MozWebSocket;
  const At = {
      websocket: class extends Tt {
        createSocket(e, t, n) {
          return Rt ? new Lt(e, t, n) : t ? new Lt(e, t) : new Lt(e);
        }
        doWrite(e, t) {
          this.ws.send(t);
        }
      },
      webtransport: class extends wt {
        get name() {
          return "webtransport";
        }
        doOpen() {
          try {
            this._transport = new WebTransport(
              this.createUri("https"),
              this.opts.transportOptions[this.name],
            );
          } catch (Yi) {
            return this.emitReserved("error", Yi);
          }
          (this._transport.closed
            .then(() => {
              this.onClose();
            })
            .catch((e) => {
              this.onError("webtransport error", e);
            }),
            this._transport.ready.then(() => {
              this._transport.createBidirectionalStream().then((e) => {
                const t = (function (e, t) {
                    lt || (lt = new TextDecoder());
                    const n = [];
                    let r = 0,
                      a = -1,
                      i = !1;
                    return new TransformStream({
                      transform(o, s) {
                        for (n.push(o); ; ) {
                          if (0 === r) {
                            if (ct(n) < 1) break;
                            const e = ut(n, 1);
                            ((i = 128 === (128 & e[0])),
                              (a = 127 & e[0]),
                              (r = a < 126 ? 3 : 126 === a ? 1 : 2));
                          } else if (1 === r) {
                            if (ct(n) < 2) break;
                            const e = ut(n, 2);
                            ((a = new DataView(
                              e.buffer,
                              e.byteOffset,
                              e.length,
                            ).getUint16(0)),
                              (r = 3));
                          } else if (2 === r) {
                            if (ct(n) < 8) break;
                            const e = ut(n, 8),
                              t = new DataView(
                                e.buffer,
                                e.byteOffset,
                                e.length,
                              ),
                              i = t.getUint32(0);
                            if (i > Math.pow(2, 21) - 1) {
                              s.enqueue($e);
                              break;
                            }
                            ((a = i * Math.pow(2, 32) + t.getUint32(4)),
                              (r = 3));
                          } else {
                            if (ct(n) < a) break;
                            const e = ut(n, a);
                            (s.enqueue(rt(i ? e : lt.decode(e), t)), (r = 0));
                          }
                          if (0 === a || a > e) {
                            s.enqueue($e);
                            break;
                          }
                        }
                      },
                    });
                  })(Number.MAX_SAFE_INTEGER, this.socket.binaryType),
                  n = e.readable.pipeThrough(t).getReader(),
                  r = st();
                (r.readable.pipeTo(e.writable),
                  (this._writer = r.writable.getWriter()));
                const a = () => {
                  n.read()
                    .then((e) => {
                      let { done: t, value: n } = e;
                      t || (this.onPacket(n), a());
                    })
                    .catch((e) => {});
                };
                a();
                const i = { type: "open" };
                (this.query.sid &&
                  (i.data = '{"sid":"'.concat(this.query.sid, '"}')),
                  this._writer.write(i).then(() => this.onOpen()));
              });
            }));
        }
        write(e) {
          this.writable = !1;
          for (let t = 0; t < e.length; t++) {
            const n = e[t],
              r = t === e.length - 1;
            this._writer.write(n).then(() => {
              r &&
                ft(() => {
                  ((this.writable = !0), this.emitReserved("drain"));
                }, this.setTimeoutFn);
            });
          }
        }
        doClose() {
          var e;
          null === (e = this._transport) || void 0 === e || e.close();
        }
      },
      polling: class extends Et {
        constructor(e) {
          super(e);
          const t = e && e.forceBase64;
          this.supportsBinary = Pt && !t;
        }
        request() {
          let e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          return (
            Object.assign(e, { xd: this.xd }, this.opts),
            new _t(Ot, this.uri(), e)
          );
        }
      },
    },
    zt =
      /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
    Ft = [
      "source",
      "protocol",
      "authority",
      "userInfo",
      "user",
      "password",
      "host",
      "port",
      "relative",
      "path",
      "directory",
      "file",
      "query",
      "anchor",
    ];
  function Mt(e) {
    if (e.length > 8e3) throw "URI too long";
    const t = e,
      n = e.indexOf("["),
      r = e.indexOf("]");
    -1 != n &&
      -1 != r &&
      (e =
        e.substring(0, n) +
        e.substring(n, r).replace(/:/g, ";") +
        e.substring(r, e.length));
    let a = zt.exec(e || ""),
      i = {},
      o = 14;
    for (; o--; ) i[Ft[o]] = a[o] || "";
    return (
      -1 != n &&
        -1 != r &&
        ((i.source = t),
        (i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":")),
        (i.authority = i.authority
          .replace("[", "")
          .replace("]", "")
          .replace(/;/g, ":")),
        (i.ipv6uri = !0)),
      (i.pathNames = (function (e, t) {
        const n = /\/{2,9}/g,
          r = t.replace(n, "/").split("/");
        ("/" != t.slice(0, 1) && 0 !== t.length) || r.splice(0, 1);
        "/" == t.slice(-1) && r.splice(r.length - 1, 1);
        return r;
      })(0, i.path)),
      (i.queryKey = (function (e, t) {
        const n = {};
        return (
          t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (e, t, r) {
            t && (n[t] = r);
          }),
          n
        );
      })(0, i.query)),
      i
    );
  }
  const Bt =
      "function" === typeof addEventListener &&
      "function" === typeof removeEventListener,
    Dt = [];
  Bt &&
    addEventListener(
      "offline",
      () => {
        Dt.forEach((e) => e());
      },
      !1,
    );
  class Ut extends dt {
    constructor(e, t) {
      if (
        (super(),
        (this.binaryType = "arraybuffer"),
        (this.writeBuffer = []),
        (this._prevBufferLen = 0),
        (this._pingInterval = -1),
        (this._pingTimeout = -1),
        (this._maxPayload = -1),
        (this._pingTimeoutTime = 1 / 0),
        e && "object" === typeof e && ((t = e), (e = null)),
        e)
      ) {
        const n = Mt(e);
        ((t.hostname = n.host),
          (t.secure = "https" === n.protocol || "wss" === n.protocol),
          (t.port = n.port),
          n.query && (t.query = n.query));
      } else t.host && (t.hostname = Mt(t.host).host);
      (yt(this, t),
        (this.secure =
          null != t.secure
            ? t.secure
            : "undefined" !== typeof location &&
              "https:" === location.protocol),
        t.hostname && !t.port && (t.port = this.secure ? "443" : "80"),
        (this.hostname =
          t.hostname ||
          ("undefined" !== typeof location ? location.hostname : "localhost")),
        (this.port =
          t.port ||
          ("undefined" !== typeof location && location.port
            ? location.port
            : this.secure
              ? "443"
              : "80")),
        (this.transports = []),
        (this._transportsByName = {}),
        t.transports.forEach((e) => {
          const t = e.prototype.name;
          (this.transports.push(t), (this._transportsByName[t] = e));
        }),
        (this.opts = Object.assign(
          {
            path: "/engine.io",
            agent: !1,
            withCredentials: !1,
            upgrade: !0,
            timestampParam: "t",
            rememberUpgrade: !1,
            addTrailingSlash: !0,
            rejectUnauthorized: !0,
            perMessageDeflate: { threshold: 1024 },
            transportOptions: {},
            closeOnBeforeunload: !1,
          },
          t,
        )),
        (this.opts.path =
          this.opts.path.replace(/\/$/, "") +
          (this.opts.addTrailingSlash ? "/" : "")),
        "string" === typeof this.opts.query &&
          (this.opts.query = (function (e) {
            let t = {},
              n = e.split("&");
            for (let r = 0, a = n.length; r < a; r++) {
              let e = n[r].split("=");
              t[decodeURIComponent(e[0])] = decodeURIComponent(e[1]);
            }
            return t;
          })(this.opts.query)),
        Bt &&
          (this.opts.closeOnBeforeunload &&
            ((this._beforeunloadEventListener = () => {
              this.transport &&
                (this.transport.removeAllListeners(), this.transport.close());
            }),
            addEventListener(
              "beforeunload",
              this._beforeunloadEventListener,
              !1,
            )),
          "localhost" !== this.hostname &&
            ((this._offlineEventListener = () => {
              this._onClose("transport close", {
                description: "network connection lost",
              });
            }),
            Dt.push(this._offlineEventListener))),
        this.opts.withCredentials && (this._cookieJar = void 0),
        this._open());
    }
    createTransport(e) {
      const t = Object.assign({}, this.opts.query);
      ((t.EIO = 4), (t.transport = e), this.id && (t.sid = this.id));
      const n = Object.assign(
        {},
        this.opts,
        {
          query: t,
          socket: this,
          hostname: this.hostname,
          secure: this.secure,
          port: this.port,
        },
        this.opts.transportOptions[e],
      );
      return new this._transportsByName[e](n);
    }
    _open() {
      if (0 === this.transports.length)
        return void this.setTimeoutFn(() => {
          this.emitReserved("error", "No transports available");
        }, 0);
      const e =
        this.opts.rememberUpgrade &&
        Ut.priorWebsocketSuccess &&
        -1 !== this.transports.indexOf("websocket")
          ? "websocket"
          : this.transports[0];
      this.readyState = "opening";
      const t = this.createTransport(e);
      (t.open(), this.setTransport(t));
    }
    setTransport(e) {
      (this.transport && this.transport.removeAllListeners(),
        (this.transport = e),
        e
          .on("drain", this._onDrain.bind(this))
          .on("packet", this._onPacket.bind(this))
          .on("error", this._onError.bind(this))
          .on("close", (e) => this._onClose("transport close", e)));
    }
    onOpen() {
      ((this.readyState = "open"),
        (Ut.priorWebsocketSuccess = "websocket" === this.transport.name),
        this.emitReserved("open"),
        this.flush());
    }
    _onPacket(e) {
      if (
        "opening" === this.readyState ||
        "open" === this.readyState ||
        "closing" === this.readyState
      )
        switch (
          (this.emitReserved("packet", e),
          this.emitReserved("heartbeat"),
          e.type)
        ) {
          case "open":
            this.onHandshake(JSON.parse(e.data));
            break;
          case "ping":
            (this._sendPacket("pong"),
              this.emitReserved("ping"),
              this.emitReserved("pong"),
              this._resetPingTimeout());
            break;
          case "error":
            const t = new Error("server error");
            ((t.code = e.data), this._onError(t));
            break;
          case "message":
            (this.emitReserved("data", e.data),
              this.emitReserved("message", e.data));
        }
    }
    onHandshake(e) {
      (this.emitReserved("handshake", e),
        (this.id = e.sid),
        (this.transport.query.sid = e.sid),
        (this._pingInterval = e.pingInterval),
        (this._pingTimeout = e.pingTimeout),
        (this._maxPayload = e.maxPayload),
        this.onOpen(),
        "closed" !== this.readyState && this._resetPingTimeout());
    }
    _resetPingTimeout() {
      this.clearTimeoutFn(this._pingTimeoutTimer);
      const e = this._pingInterval + this._pingTimeout;
      ((this._pingTimeoutTime = Date.now() + e),
        (this._pingTimeoutTimer = this.setTimeoutFn(() => {
          this._onClose("ping timeout");
        }, e)),
        this.opts.autoUnref && this._pingTimeoutTimer.unref());
    }
    _onDrain() {
      (this.writeBuffer.splice(0, this._prevBufferLen),
        (this._prevBufferLen = 0),
        0 === this.writeBuffer.length
          ? this.emitReserved("drain")
          : this.flush());
    }
    flush() {
      if (
        "closed" !== this.readyState &&
        this.transport.writable &&
        !this.upgrading &&
        this.writeBuffer.length
      ) {
        const e = this._getWritablePackets();
        (this.transport.send(e),
          (this._prevBufferLen = e.length),
          this.emitReserved("flush"));
      }
    }
    _getWritablePackets() {
      if (
        !(
          this._maxPayload &&
          "polling" === this.transport.name &&
          this.writeBuffer.length > 1
        )
      )
        return this.writeBuffer;
      let e = 1;
      for (let t = 0; t < this.writeBuffer.length; t++) {
        const n = this.writeBuffer[t].data;
        if ((n && (e += vt(n)), t > 0 && e > this._maxPayload))
          return this.writeBuffer.slice(0, t);
        e += 2;
      }
      return this.writeBuffer;
    }
    _hasPingExpired() {
      if (!this._pingTimeoutTime) return !0;
      const e = Date.now() > this._pingTimeoutTime;
      return (
        e &&
          ((this._pingTimeoutTime = 0),
          ft(() => {
            this._onClose("ping timeout");
          }, this.setTimeoutFn)),
        e
      );
    }
    write(e, t, n) {
      return (this._sendPacket("message", e, t, n), this);
    }
    send(e, t, n) {
      return (this._sendPacket("message", e, t, n), this);
    }
    _sendPacket(e, t, n, r) {
      if (
        ("function" === typeof t && ((r = t), (t = void 0)),
        "function" === typeof n && ((r = n), (n = null)),
        "closing" === this.readyState || "closed" === this.readyState)
      )
        return;
      (n = n || {}).compress = !1 !== n.compress;
      const a = { type: e, data: t, options: n };
      (this.emitReserved("packetCreate", a),
        this.writeBuffer.push(a),
        r && this.once("flush", r),
        this.flush());
    }
    close() {
      const e = () => {
          (this._onClose("forced close"), this.transport.close());
        },
        t = () => {
          (this.off("upgrade", t), this.off("upgradeError", t), e());
        },
        n = () => {
          (this.once("upgrade", t), this.once("upgradeError", t));
        };
      return (
        ("opening" !== this.readyState && "open" !== this.readyState) ||
          ((this.readyState = "closing"),
          this.writeBuffer.length
            ? this.once("drain", () => {
                this.upgrading ? n() : e();
              })
            : this.upgrading
              ? n()
              : e()),
        this
      );
    }
    _onError(e) {
      if (
        ((Ut.priorWebsocketSuccess = !1),
        this.opts.tryAllTransports &&
          this.transports.length > 1 &&
          "opening" === this.readyState)
      )
        return (this.transports.shift(), this._open());
      (this.emitReserved("error", e), this._onClose("transport error", e));
    }
    _onClose(e, t) {
      if (
        "opening" === this.readyState ||
        "open" === this.readyState ||
        "closing" === this.readyState
      ) {
        if (
          (this.clearTimeoutFn(this._pingTimeoutTimer),
          this.transport.removeAllListeners("close"),
          this.transport.close(),
          this.transport.removeAllListeners(),
          Bt &&
            (this._beforeunloadEventListener &&
              removeEventListener(
                "beforeunload",
                this._beforeunloadEventListener,
                !1,
              ),
            this._offlineEventListener))
        ) {
          const e = Dt.indexOf(this._offlineEventListener);
          -1 !== e && Dt.splice(e, 1);
        }
        ((this.readyState = "closed"),
          (this.id = null),
          this.emitReserved("close", e, t),
          (this.writeBuffer = []),
          (this._prevBufferLen = 0));
      }
    }
  }
  Ut.protocol = 4;
  class It extends Ut {
    constructor() {
      (super(...arguments), (this._upgrades = []));
    }
    onOpen() {
      if ((super.onOpen(), "open" === this.readyState && this.opts.upgrade))
        for (let e = 0; e < this._upgrades.length; e++)
          this._probe(this._upgrades[e]);
    }
    _probe(e) {
      let t = this.createTransport(e),
        n = !1;
      Ut.priorWebsocketSuccess = !1;
      const r = () => {
        n ||
          (t.send([{ type: "ping", data: "probe" }]),
          t.once("packet", (e) => {
            if (!n)
              if ("pong" === e.type && "probe" === e.data) {
                if (
                  ((this.upgrading = !0), this.emitReserved("upgrading", t), !t)
                )
                  return;
                ((Ut.priorWebsocketSuccess = "websocket" === t.name),
                  this.transport.pause(() => {
                    n ||
                      ("closed" !== this.readyState &&
                        (c(),
                        this.setTransport(t),
                        t.send([{ type: "upgrade" }]),
                        this.emitReserved("upgrade", t),
                        (t = null),
                        (this.upgrading = !1),
                        this.flush()));
                  }));
              } else {
                const e = new Error("probe error");
                ((e.transport = t.name), this.emitReserved("upgradeError", e));
              }
          }));
      };
      function a() {
        n || ((n = !0), c(), t.close(), (t = null));
      }
      const i = (e) => {
        const n = new Error("probe error: " + e);
        ((n.transport = t.name), a(), this.emitReserved("upgradeError", n));
      };
      function o() {
        i("transport closed");
      }
      function s() {
        i("socket closed");
      }
      function l(e) {
        t && e.name !== t.name && a();
      }
      const c = () => {
        (t.removeListener("open", r),
          t.removeListener("error", i),
          t.removeListener("close", o),
          this.off("close", s),
          this.off("upgrading", l));
      };
      (t.once("open", r),
        t.once("error", i),
        t.once("close", o),
        this.once("close", s),
        this.once("upgrading", l),
        -1 !== this._upgrades.indexOf("webtransport") && "webtransport" !== e
          ? this.setTimeoutFn(() => {
              n || t.open();
            }, 200)
          : t.open());
    }
    onHandshake(e) {
      ((this._upgrades = this._filterUpgrades(e.upgrades)),
        super.onHandshake(e));
    }
    _filterUpgrades(e) {
      const t = [];
      for (let n = 0; n < e.length; n++)
        ~this.transports.indexOf(e[n]) && t.push(e[n]);
      return t;
    }
  }
  class qt extends It {
    constructor(e) {
      const t =
        "object" === typeof e
          ? e
          : arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : {};
      ((!t.transports ||
        (t.transports && "string" === typeof t.transports[0])) &&
        (t.transports = (
          t.transports || ["polling", "websocket", "webtransport"]
        )
          .map((e) => At[e])
          .filter((e) => !!e)),
        super(e, t));
    }
  }
  const Vt = "function" === typeof ArrayBuffer,
    Ht = Object.prototype.toString,
    Wt =
      "function" === typeof Blob ||
      ("undefined" !== typeof Blob &&
        "[object BlobConstructor]" === Ht.call(Blob)),
    $t =
      "function" === typeof File ||
      ("undefined" !== typeof File &&
        "[object FileConstructor]" === Ht.call(File));
  function Kt(e) {
    return (
      (Vt &&
        (e instanceof ArrayBuffer ||
          ((e) =>
            "function" === typeof ArrayBuffer.isView
              ? ArrayBuffer.isView(e)
              : e.buffer instanceof ArrayBuffer)(e))) ||
      (Wt && e instanceof Blob) ||
      ($t && e instanceof File)
    );
  }
  function Qt(e, t) {
    if (!e || "object" !== typeof e) return !1;
    if (Array.isArray(e)) {
      for (let t = 0, n = e.length; t < n; t++) if (Qt(e[t])) return !0;
      return !1;
    }
    if (Kt(e)) return !0;
    if (e.toJSON && "function" === typeof e.toJSON && 1 === arguments.length)
      return Qt(e.toJSON(), !0);
    for (const n in e)
      if (Object.prototype.hasOwnProperty.call(e, n) && Qt(e[n])) return !0;
    return !1;
  }
  function Yt(e) {
    const t = [],
      n = e.data,
      r = e;
    return (
      (r.data = Jt(n, t)),
      (r.attachments = t.length),
      { packet: r, buffers: t }
    );
  }
  function Jt(e, t) {
    if (!e) return e;
    if (Kt(e)) {
      const n = { _placeholder: !0, num: t.length };
      return (t.push(e), n);
    }
    if (Array.isArray(e)) {
      const n = new Array(e.length);
      for (let r = 0; r < e.length; r++) n[r] = Jt(e[r], t);
      return n;
    }
    if ("object" === typeof e && !(e instanceof Date)) {
      const n = {};
      for (const r in e)
        Object.prototype.hasOwnProperty.call(e, r) && (n[r] = Jt(e[r], t));
      return n;
    }
    return e;
  }
  function Xt(e, t) {
    return ((e.data = Gt(e.data, t)), delete e.attachments, e);
  }
  function Gt(e, t) {
    if (!e) return e;
    if (e && !0 === e._placeholder) {
      if ("number" === typeof e.num && e.num >= 0 && e.num < t.length)
        return t[e.num];
      throw new Error("illegal attachments");
    }
    if (Array.isArray(e)) for (let n = 0; n < e.length; n++) e[n] = Gt(e[n], t);
    else if ("object" === typeof e)
      for (const n in e)
        Object.prototype.hasOwnProperty.call(e, n) && (e[n] = Gt(e[n], t));
    return e;
  }
  const Zt = [
      "connect",
      "connect_error",
      "disconnect",
      "disconnecting",
      "newListener",
      "removeListener",
    ],
    en = 5;
  var tn;
  !(function (e) {
    ((e[(e.CONNECT = 0)] = "CONNECT"),
      (e[(e.DISCONNECT = 1)] = "DISCONNECT"),
      (e[(e.EVENT = 2)] = "EVENT"),
      (e[(e.ACK = 3)] = "ACK"),
      (e[(e.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
      (e[(e.BINARY_EVENT = 5)] = "BINARY_EVENT"),
      (e[(e.BINARY_ACK = 6)] = "BINARY_ACK"));
  })(tn || (tn = {}));
  class nn {
    constructor(e) {
      this.replacer = e;
    }
    encode(e) {
      return (e.type !== tn.EVENT && e.type !== tn.ACK) || !Qt(e)
        ? [this.encodeAsString(e)]
        : this.encodeAsBinary({
            type: e.type === tn.EVENT ? tn.BINARY_EVENT : tn.BINARY_ACK,
            nsp: e.nsp,
            data: e.data,
            id: e.id,
          });
    }
    encodeAsString(e) {
      let t = "" + e.type;
      return (
        (e.type !== tn.BINARY_EVENT && e.type !== tn.BINARY_ACK) ||
          (t += e.attachments + "-"),
        e.nsp && "/" !== e.nsp && (t += e.nsp + ","),
        null != e.id && (t += e.id),
        null != e.data && (t += JSON.stringify(e.data, this.replacer)),
        t
      );
    }
    encodeAsBinary(e) {
      const t = Yt(e),
        n = this.encodeAsString(t.packet),
        r = t.buffers;
      return (r.unshift(n), r);
    }
  }
  class rn extends dt {
    constructor(e) {
      (super(), (this.reviver = e));
    }
    add(e) {
      let t;
      if ("string" === typeof e) {
        if (this.reconstructor)
          throw new Error("got plaintext data when reconstructing a packet");
        t = this.decodeString(e);
        const n = t.type === tn.BINARY_EVENT;
        n || t.type === tn.BINARY_ACK
          ? ((t.type = n ? tn.EVENT : tn.ACK),
            (this.reconstructor = new an(t)),
            0 === t.attachments && super.emitReserved("decoded", t))
          : super.emitReserved("decoded", t);
      } else {
        if (!Kt(e) && !e.base64) throw new Error("Unknown type: " + e);
        if (!this.reconstructor)
          throw new Error("got binary data when not reconstructing a packet");
        ((t = this.reconstructor.takeBinaryData(e)),
          t && ((this.reconstructor = null), super.emitReserved("decoded", t)));
      }
    }
    decodeString(e) {
      let t = 0;
      const n = { type: Number(e.charAt(0)) };
      if (void 0 === tn[n.type])
        throw new Error("unknown packet type " + n.type);
      if (n.type === tn.BINARY_EVENT || n.type === tn.BINARY_ACK) {
        const r = t + 1;
        for (; "-" !== e.charAt(++t) && t != e.length; );
        const a = e.substring(r, t);
        if (a != Number(a) || "-" !== e.charAt(t))
          throw new Error("Illegal attachments");
        n.attachments = Number(a);
      }
      if ("/" === e.charAt(t + 1)) {
        const r = t + 1;
        for (; ++t; ) {
          if ("," === e.charAt(t)) break;
          if (t === e.length) break;
        }
        n.nsp = e.substring(r, t);
      } else n.nsp = "/";
      const r = e.charAt(t + 1);
      if ("" !== r && Number(r) == r) {
        const r = t + 1;
        for (; ++t; ) {
          const n = e.charAt(t);
          if (null == n || Number(n) != n) {
            --t;
            break;
          }
          if (t === e.length) break;
        }
        n.id = Number(e.substring(r, t + 1));
      }
      if (e.charAt(++t)) {
        const r = this.tryParse(e.substr(t));
        if (!rn.isPayloadValid(n.type, r)) throw new Error("invalid payload");
        n.data = r;
      }
      return n;
    }
    tryParse(e) {
      try {
        return JSON.parse(e, this.reviver);
      } catch (Qi) {
        return !1;
      }
    }
    static isPayloadValid(e, t) {
      switch (e) {
        case tn.CONNECT:
          return sn(t);
        case tn.DISCONNECT:
          return void 0 === t;
        case tn.CONNECT_ERROR:
          return "string" === typeof t || sn(t);
        case tn.EVENT:
        case tn.BINARY_EVENT:
          return (
            Array.isArray(t) &&
            ("number" === typeof t[0] ||
              ("string" === typeof t[0] && -1 === Zt.indexOf(t[0])))
          );
        case tn.ACK:
        case tn.BINARY_ACK:
          return Array.isArray(t);
      }
    }
    destroy() {
      this.reconstructor &&
        (this.reconstructor.finishedReconstruction(),
        (this.reconstructor = null));
    }
  }
  class an {
    constructor(e) {
      ((this.packet = e), (this.buffers = []), (this.reconPack = e));
    }
    takeBinaryData(e) {
      if (
        (this.buffers.push(e),
        this.buffers.length === this.reconPack.attachments)
      ) {
        const e = Xt(this.reconPack, this.buffers);
        return (this.finishedReconstruction(), e);
      }
      return null;
    }
    finishedReconstruction() {
      ((this.reconPack = null), (this.buffers = []));
    }
  }
  const on =
    Number.isInteger ||
    function (e) {
      return "number" === typeof e && isFinite(e) && Math.floor(e) === e;
    };
  function sn(e) {
    return "[object Object]" === Object.prototype.toString.call(e);
  }
  function ln(e) {
    return (
      "string" === typeof e.nsp &&
      (void 0 === (t = e.id) || on(t)) &&
      (function (e, t) {
        switch (e) {
          case tn.CONNECT:
            return void 0 === t || sn(t);
          case tn.DISCONNECT:
            return void 0 === t;
          case tn.EVENT:
            return (
              Array.isArray(t) &&
              ("number" === typeof t[0] ||
                ("string" === typeof t[0] && -1 === Zt.indexOf(t[0])))
            );
          case tn.ACK:
            return Array.isArray(t);
          case tn.CONNECT_ERROR:
            return "string" === typeof t || sn(t);
          default:
            return !1;
        }
      })(e.type, e.data)
    );
    var t;
  }
  function cn(e, t, n) {
    return (
      e.on(t, n),
      function () {
        e.off(t, n);
      }
    );
  }
  const un = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    newListener: 1,
    removeListener: 1,
  });
  class dn extends dt {
    constructor(e, t, n) {
      (super(),
        (this.connected = !1),
        (this.recovered = !1),
        (this.receiveBuffer = []),
        (this.sendBuffer = []),
        (this._queue = []),
        (this._queueSeq = 0),
        (this.ids = 0),
        (this.acks = {}),
        (this.flags = {}),
        (this.io = e),
        (this.nsp = t),
        n && n.auth && (this.auth = n.auth),
        (this._opts = Object.assign({}, n)),
        this.io._autoConnect && this.open());
    }
    get disconnected() {
      return !this.connected;
    }
    subEvents() {
      if (this.subs) return;
      const e = this.io;
      this.subs = [
        cn(e, "open", this.onopen.bind(this)),
        cn(e, "packet", this.onpacket.bind(this)),
        cn(e, "error", this.onerror.bind(this)),
        cn(e, "close", this.onclose.bind(this)),
      ];
    }
    get active() {
      return !!this.subs;
    }
    connect() {
      return (
        this.connected ||
          (this.subEvents(),
          this.io._reconnecting || this.io.open(),
          "open" === this.io._readyState && this.onopen()),
        this
      );
    }
    open() {
      return this.connect();
    }
    send() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
      return (t.unshift("message"), this.emit.apply(this, t), this);
    }
    emit(e) {
      var t, n, r;
      if (un.hasOwnProperty(e))
        throw new Error('"' + e.toString() + '" is a reserved event name');
      for (
        var a = arguments.length, i = new Array(a > 1 ? a - 1 : 0), o = 1;
        o < a;
        o++
      )
        i[o - 1] = arguments[o];
      if (
        (i.unshift(e),
        this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      )
        return (this._addToQueue(i), this);
      const s = { type: tn.EVENT, data: i, options: {} };
      if (
        ((s.options.compress = !1 !== this.flags.compress),
        "function" === typeof i[i.length - 1])
      ) {
        const e = this.ids++,
          t = i.pop();
        (this._registerAckCallback(e, t), (s.id = e));
      }
      const l =
          null ===
            (n =
              null === (t = this.io.engine) || void 0 === t
                ? void 0
                : t.transport) || void 0 === n
            ? void 0
            : n.writable,
        c =
          this.connected &&
          !(null === (r = this.io.engine) || void 0 === r
            ? void 0
            : r._hasPingExpired());
      return (
        (this.flags.volatile && !l) ||
          (c
            ? (this.notifyOutgoingListeners(s), this.packet(s))
            : this.sendBuffer.push(s)),
        (this.flags = {}),
        this
      );
    }
    _registerAckCallback(e, t) {
      var n,
        r = this;
      const a =
        null !== (n = this.flags.timeout) && void 0 !== n
          ? n
          : this._opts.ackTimeout;
      if (void 0 === a) return void (this.acks[e] = t);
      const i = this.io.setTimeoutFn(() => {
          delete this.acks[e];
          for (let t = 0; t < this.sendBuffer.length; t++)
            this.sendBuffer[t].id === e && this.sendBuffer.splice(t, 1);
          t.call(this, new Error("operation has timed out"));
        }, a),
        o = function () {
          r.io.clearTimeoutFn(i);
          for (var e = arguments.length, n = new Array(e), a = 0; a < e; a++)
            n[a] = arguments[a];
          t.apply(r, n);
        };
      ((o.withError = !0), (this.acks[e] = o));
    }
    emitWithAck(e) {
      for (
        var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
        r < t;
        r++
      )
        n[r - 1] = arguments[r];
      return new Promise((t, r) => {
        const a = (e, n) => (e ? r(e) : t(n));
        ((a.withError = !0), n.push(a), this.emit(e, ...n));
      });
    }
    _addToQueue(e) {
      var t = this;
      let n;
      "function" === typeof e[e.length - 1] && (n = e.pop());
      const r = {
        id: this._queueSeq++,
        tryCount: 0,
        pending: !1,
        args: e,
        flags: Object.assign({ fromQueue: !0 }, this.flags),
      };
      (e.push(function (e) {
        t._queue[0];
        if (null !== e)
          r.tryCount > t._opts.retries && (t._queue.shift(), n && n(e));
        else if ((t._queue.shift(), n)) {
          for (
            var a = arguments.length, i = new Array(a > 1 ? a - 1 : 0), o = 1;
            o < a;
            o++
          )
            i[o - 1] = arguments[o];
          n(null, ...i);
        }
        return ((r.pending = !1), t._drainQueue());
      }),
        this._queue.push(r),
        this._drainQueue());
    }
    _drainQueue() {
      let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (!this.connected || 0 === this._queue.length) return;
      const t = this._queue[0];
      (t.pending && !e) ||
        ((t.pending = !0),
        t.tryCount++,
        (this.flags = t.flags),
        this.emit.apply(this, t.args));
    }
    packet(e) {
      ((e.nsp = this.nsp), this.io._packet(e));
    }
    onopen() {
      "function" == typeof this.auth
        ? this.auth((e) => {
            this._sendConnectPacket(e);
          })
        : this._sendConnectPacket(this.auth);
    }
    _sendConnectPacket(e) {
      this.packet({
        type: tn.CONNECT,
        data: this._pid
          ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e)
          : e,
      });
    }
    onerror(e) {
      this.connected || this.emitReserved("connect_error", e);
    }
    onclose(e, t) {
      ((this.connected = !1),
        delete this.id,
        this.emitReserved("disconnect", e, t),
        this._clearAcks());
    }
    _clearAcks() {
      Object.keys(this.acks).forEach((e) => {
        if (!this.sendBuffer.some((t) => String(t.id) === e)) {
          const t = this.acks[e];
          (delete this.acks[e],
            t.withError &&
              t.call(this, new Error("socket has been disconnected")));
        }
      });
    }
    onpacket(e) {
      if (e.nsp === this.nsp)
        switch (e.type) {
          case tn.CONNECT:
            e.data && e.data.sid
              ? this.onconnect(e.data.sid, e.data.pid)
              : this.emitReserved(
                  "connect_error",
                  new Error(
                    "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)",
                  ),
                );
            break;
          case tn.EVENT:
          case tn.BINARY_EVENT:
            this.onevent(e);
            break;
          case tn.ACK:
          case tn.BINARY_ACK:
            this.onack(e);
            break;
          case tn.DISCONNECT:
            this.ondisconnect();
            break;
          case tn.CONNECT_ERROR:
            this.destroy();
            const t = new Error(e.data.message);
            ((t.data = e.data.data), this.emitReserved("connect_error", t));
        }
    }
    onevent(e) {
      const t = e.data || [];
      (null != e.id && t.push(this.ack(e.id)),
        this.connected
          ? this.emitEvent(t)
          : this.receiveBuffer.push(Object.freeze(t)));
    }
    emitEvent(e) {
      if (this._anyListeners && this._anyListeners.length) {
        const t = this._anyListeners.slice();
        for (const n of t) n.apply(this, e);
      }
      (super.emit.apply(this, e),
        this._pid &&
          e.length &&
          "string" === typeof e[e.length - 1] &&
          (this._lastOffset = e[e.length - 1]));
    }
    ack(e) {
      const t = this;
      let n = !1;
      return function () {
        if (!n) {
          n = !0;
          for (var r = arguments.length, a = new Array(r), i = 0; i < r; i++)
            a[i] = arguments[i];
          t.packet({ type: tn.ACK, id: e, data: a });
        }
      };
    }
    onack(e) {
      const t = this.acks[e.id];
      "function" === typeof t &&
        (delete this.acks[e.id],
        t.withError && e.data.unshift(null),
        t.apply(this, e.data));
    }
    onconnect(e, t) {
      ((this.id = e),
        (this.recovered = t && this._pid === t),
        (this._pid = t),
        (this.connected = !0),
        this.emitBuffered(),
        this._drainQueue(!0),
        this.emitReserved("connect"));
    }
    emitBuffered() {
      (this.receiveBuffer.forEach((e) => this.emitEvent(e)),
        (this.receiveBuffer = []),
        this.sendBuffer.forEach((e) => {
          (this.notifyOutgoingListeners(e), this.packet(e));
        }),
        (this.sendBuffer = []));
    }
    ondisconnect() {
      (this.destroy(), this.onclose("io server disconnect"));
    }
    destroy() {
      (this.subs && (this.subs.forEach((e) => e()), (this.subs = void 0)),
        this.io._destroy(this));
    }
    disconnect() {
      return (
        this.connected && this.packet({ type: tn.DISCONNECT }),
        this.destroy(),
        this.connected && this.onclose("io client disconnect"),
        this
      );
    }
    close() {
      return this.disconnect();
    }
    compress(e) {
      return ((this.flags.compress = e), this);
    }
    get volatile() {
      return ((this.flags.volatile = !0), this);
    }
    timeout(e) {
      return ((this.flags.timeout = e), this);
    }
    onAny(e) {
      return (
        (this._anyListeners = this._anyListeners || []),
        this._anyListeners.push(e),
        this
      );
    }
    prependAny(e) {
      return (
        (this._anyListeners = this._anyListeners || []),
        this._anyListeners.unshift(e),
        this
      );
    }
    offAny(e) {
      if (!this._anyListeners) return this;
      if (e) {
        const t = this._anyListeners;
        for (let n = 0; n < t.length; n++)
          if (e === t[n]) return (t.splice(n, 1), this);
      } else this._anyListeners = [];
      return this;
    }
    listenersAny() {
      return this._anyListeners || [];
    }
    onAnyOutgoing(e) {
      return (
        (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
        this._anyOutgoingListeners.push(e),
        this
      );
    }
    prependAnyOutgoing(e) {
      return (
        (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
        this._anyOutgoingListeners.unshift(e),
        this
      );
    }
    offAnyOutgoing(e) {
      if (!this._anyOutgoingListeners) return this;
      if (e) {
        const t = this._anyOutgoingListeners;
        for (let n = 0; n < t.length; n++)
          if (e === t[n]) return (t.splice(n, 1), this);
      } else this._anyOutgoingListeners = [];
      return this;
    }
    listenersAnyOutgoing() {
      return this._anyOutgoingListeners || [];
    }
    notifyOutgoingListeners(e) {
      if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
        const t = this._anyOutgoingListeners.slice();
        for (const n of t) n.apply(this, e.data);
      }
    }
  }
  function fn(e) {
    ((e = e || {}),
      (this.ms = e.min || 100),
      (this.max = e.max || 1e4),
      (this.factor = e.factor || 2),
      (this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0),
      (this.attempts = 0));
  }
  ((fn.prototype.duration = function () {
    var e = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
      var t = Math.random(),
        n = Math.floor(t * this.jitter * e);
      e = 0 == (1 & Math.floor(10 * t)) ? e - n : e + n;
    }
    return 0 | Math.min(e, this.max);
  }),
    (fn.prototype.reset = function () {
      this.attempts = 0;
    }),
    (fn.prototype.setMin = function (e) {
      this.ms = e;
    }),
    (fn.prototype.setMax = function (e) {
      this.max = e;
    }),
    (fn.prototype.setJitter = function (e) {
      this.jitter = e;
    }));
  class hn extends dt {
    constructor(e, t) {
      var n;
      (super(),
        (this.nsps = {}),
        (this.subs = []),
        e && "object" === typeof e && ((t = e), (e = void 0)),
        ((t = t || {}).path = t.path || "/socket.io"),
        (this.opts = t),
        yt(this, t),
        this.reconnection(!1 !== t.reconnection),
        this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0),
        this.reconnectionDelay(t.reconnectionDelay || 1e3),
        this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3),
        this.randomizationFactor(
          null !== (n = t.randomizationFactor) && void 0 !== n ? n : 0.5,
        ),
        (this.backoff = new fn({
          min: this.reconnectionDelay(),
          max: this.reconnectionDelayMax(),
          jitter: this.randomizationFactor(),
        })),
        this.timeout(null == t.timeout ? 2e4 : t.timeout),
        (this._readyState = "closed"),
        (this.uri = e));
      const a = t.parser || r;
      ((this.encoder = new a.Encoder()),
        (this.decoder = new a.Decoder()),
        (this._autoConnect = !1 !== t.autoConnect),
        this._autoConnect && this.open());
    }
    reconnection(e) {
      return arguments.length
        ? ((this._reconnection = !!e), e || (this.skipReconnect = !0), this)
        : this._reconnection;
    }
    reconnectionAttempts(e) {
      return void 0 === e
        ? this._reconnectionAttempts
        : ((this._reconnectionAttempts = e), this);
    }
    reconnectionDelay(e) {
      var t;
      return void 0 === e
        ? this._reconnectionDelay
        : ((this._reconnectionDelay = e),
          null === (t = this.backoff) || void 0 === t || t.setMin(e),
          this);
    }
    randomizationFactor(e) {
      var t;
      return void 0 === e
        ? this._randomizationFactor
        : ((this._randomizationFactor = e),
          null === (t = this.backoff) || void 0 === t || t.setJitter(e),
          this);
    }
    reconnectionDelayMax(e) {
      var t;
      return void 0 === e
        ? this._reconnectionDelayMax
        : ((this._reconnectionDelayMax = e),
          null === (t = this.backoff) || void 0 === t || t.setMax(e),
          this);
    }
    timeout(e) {
      return arguments.length ? ((this._timeout = e), this) : this._timeout;
    }
    maybeReconnectOnOpen() {
      !this._reconnecting &&
        this._reconnection &&
        0 === this.backoff.attempts &&
        this.reconnect();
    }
    open(e) {
      if (~this._readyState.indexOf("open")) return this;
      this.engine = new qt(this.uri, this.opts);
      const t = this.engine,
        n = this;
      ((this._readyState = "opening"), (this.skipReconnect = !1));
      const r = cn(t, "open", function () {
          (n.onopen(), e && e());
        }),
        a = (t) => {
          (this.cleanup(),
            (this._readyState = "closed"),
            this.emitReserved("error", t),
            e ? e(t) : this.maybeReconnectOnOpen());
        },
        i = cn(t, "error", a);
      if (!1 !== this._timeout) {
        const e = this._timeout,
          n = this.setTimeoutFn(() => {
            (r(), a(new Error("timeout")), t.close());
          }, e);
        (this.opts.autoUnref && n.unref(),
          this.subs.push(() => {
            this.clearTimeoutFn(n);
          }));
      }
      return (this.subs.push(r), this.subs.push(i), this);
    }
    connect(e) {
      return this.open(e);
    }
    onopen() {
      (this.cleanup(), (this._readyState = "open"), this.emitReserved("open"));
      const e = this.engine;
      this.subs.push(
        cn(e, "ping", this.onping.bind(this)),
        cn(e, "data", this.ondata.bind(this)),
        cn(e, "error", this.onerror.bind(this)),
        cn(e, "close", this.onclose.bind(this)),
        cn(this.decoder, "decoded", this.ondecoded.bind(this)),
      );
    }
    onping() {
      this.emitReserved("ping");
    }
    ondata(e) {
      try {
        this.decoder.add(e);
      } catch (Qi) {
        this.onclose("parse error", Qi);
      }
    }
    ondecoded(e) {
      ft(() => {
        this.emitReserved("packet", e);
      }, this.setTimeoutFn);
    }
    onerror(e) {
      this.emitReserved("error", e);
    }
    socket(e, t) {
      let n = this.nsps[e];
      return (
        n
          ? this._autoConnect && !n.active && n.connect()
          : ((n = new dn(this, e, t)), (this.nsps[e] = n)),
        n
      );
    }
    _destroy(e) {
      const t = Object.keys(this.nsps);
      for (const n of t) {
        if (this.nsps[n].active) return;
      }
      this._close();
    }
    _packet(e) {
      const t = this.encoder.encode(e);
      for (let n = 0; n < t.length; n++) this.engine.write(t[n], e.options);
    }
    cleanup() {
      (this.subs.forEach((e) => e()),
        (this.subs.length = 0),
        this.decoder.destroy());
    }
    _close() {
      ((this.skipReconnect = !0),
        (this._reconnecting = !1),
        this.onclose("forced close"));
    }
    disconnect() {
      return this._close();
    }
    onclose(e, t) {
      var n;
      (this.cleanup(),
        null === (n = this.engine) || void 0 === n || n.close(),
        this.backoff.reset(),
        (this._readyState = "closed"),
        this.emitReserved("close", e, t),
        this._reconnection && !this.skipReconnect && this.reconnect());
    }
    reconnect() {
      if (this._reconnecting || this.skipReconnect) return this;
      const e = this;
      if (this.backoff.attempts >= this._reconnectionAttempts)
        (this.backoff.reset(),
          this.emitReserved("reconnect_failed"),
          (this._reconnecting = !1));
      else {
        const t = this.backoff.duration();
        this._reconnecting = !0;
        const n = this.setTimeoutFn(() => {
          e.skipReconnect ||
            (this.emitReserved("reconnect_attempt", e.backoff.attempts),
            e.skipReconnect ||
              e.open((t) => {
                t
                  ? ((e._reconnecting = !1),
                    e.reconnect(),
                    this.emitReserved("reconnect_error", t))
                  : e.onreconnect();
              }));
        }, t);
        (this.opts.autoUnref && n.unref(),
          this.subs.push(() => {
            this.clearTimeoutFn(n);
          }));
      }
    }
    onreconnect() {
      const e = this.backoff.attempts;
      ((this._reconnecting = !1),
        this.backoff.reset(),
        this.emitReserved("reconnect", e));
    }
  }
  const pn = {};
  function mn(e, t) {
    "object" === typeof e && ((t = e), (e = void 0));
    const n = (function (e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
          n = arguments.length > 2 ? arguments[2] : void 0,
          r = e;
        ((n = n || ("undefined" !== typeof location && location)),
          null == e && (e = n.protocol + "//" + n.host),
          "string" === typeof e &&
            ("/" === e.charAt(0) &&
              (e = "/" === e.charAt(1) ? n.protocol + e : n.host + e),
            /^(https?|wss?):\/\//.test(e) ||
              (e =
                "undefined" !== typeof n
                  ? n.protocol + "//" + e
                  : "https://" + e),
            (r = Mt(e))),
          r.port ||
            (/^(http|ws)$/.test(r.protocol)
              ? (r.port = "80")
              : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
          (r.path = r.path || "/"));
        const a = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
        return (
          (r.id = r.protocol + "://" + a + ":" + r.port + t),
          (r.href =
            r.protocol +
            "://" +
            a +
            (n && n.port === r.port ? "" : ":" + r.port)),
          r
        );
      })(e, (t = t || {}).path || "/socket.io"),
      r = n.source,
      a = n.id,
      i = n.path,
      o = pn[a] && i in pn[a].nsps;
    let s;
    return (
      t.forceNew || t["force new connection"] || !1 === t.multiplex || o
        ? (s = new hn(r, t))
        : (pn[a] || (pn[a] = new hn(r, t)), (s = pn[a])),
      n.query && !t.query && (t.query = n.queryKey),
      s.socket(n.path, t)
    );
  }
  function gn(e, t) {
    return function () {
      return e.apply(t, arguments);
    };
  }
  Object.assign(mn, { Manager: hn, Socket: dn, io: mn, connect: mn });
  const { toString: yn } = Object.prototype,
    { getPrototypeOf: vn } = Object,
    { iterator: bn, toStringTag: xn } = Symbol,
    wn = ((e) => (t) => {
      const n = yn.call(t);
      return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
    })(Object.create(null)),
    kn = (e) => ((e = e.toLowerCase()), (t) => wn(t) === e),
    Sn = (e) => (t) => typeof t === e,
    { isArray: jn } = Array,
    Nn = Sn("undefined");
  function En(e) {
    return (
      null !== e &&
      !Nn(e) &&
      null !== e.constructor &&
      !Nn(e.constructor) &&
      Pn(e.constructor.isBuffer) &&
      e.constructor.isBuffer(e)
    );
  }
  const _n = kn("ArrayBuffer");
  const Cn = Sn("string"),
    Pn = Sn("function"),
    On = Sn("number"),
    Rn = (e) => null !== e && "object" === typeof e,
    Tn = (e) => {
      if ("object" !== wn(e)) return !1;
      const t = vn(e);
      return (
        (null === t ||
          t === Object.prototype ||
          null === Object.getPrototypeOf(t)) &&
        !(xn in e) &&
        !(bn in e)
      );
    },
    Ln = kn("Date"),
    An = kn("File"),
    zn = kn("Blob"),
    Fn = kn("FileList"),
    Mn = kn("URLSearchParams"),
    [Bn, Dn, Un, In] = ["ReadableStream", "Request", "Response", "Headers"].map(
      kn,
    );
  function qn(e, t) {
    let n,
      r,
      { allOwnKeys: a = !1 } =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    if (null !== e && "undefined" !== typeof e)
      if (("object" !== typeof e && (e = [e]), jn(e)))
        for (n = 0, r = e.length; n < r; n++) t.call(null, e[n], n, e);
      else {
        if (En(e)) return;
        const r = a ? Object.getOwnPropertyNames(e) : Object.keys(e),
          i = r.length;
        let o;
        for (n = 0; n < i; n++) ((o = r[n]), t.call(null, e[o], o, e));
      }
  }
  function Vn(e, t) {
    if (En(e)) return null;
    t = t.toLowerCase();
    const n = Object.keys(e);
    let r,
      a = n.length;
    for (; a-- > 0; ) if (((r = n[a]), t === r.toLowerCase())) return r;
    return null;
  }
  const Hn =
      "undefined" !== typeof globalThis
        ? globalThis
        : "undefined" !== typeof self
          ? self
          : "undefined" !== typeof window
            ? window
            : n.g,
    Wn = (e) => !Nn(e) && e !== Hn;
  const $n =
    ((Kn = "undefined" !== typeof Uint8Array && vn(Uint8Array)),
    (e) => Kn && e instanceof Kn);
  var Kn;
  const Qn = kn("HTMLFormElement"),
    Yn = ((e) => {
      let { hasOwnProperty: t } = e;
      return (e, n) => t.call(e, n);
    })(Object.prototype),
    Jn = kn("RegExp"),
    Xn = (e, t) => {
      const n = Object.getOwnPropertyDescriptors(e),
        r = {};
      (qn(n, (n, a) => {
        let i;
        !1 !== (i = t(n, a, e)) && (r[a] = i || n);
      }),
        Object.defineProperties(e, r));
    };
  const Gn = kn("AsyncFunction"),
    Zn = ((e, t) => {
      return e
        ? setImmediate
        : t
          ? ((n = "axios@".concat(Math.random())),
            (r = []),
            Hn.addEventListener(
              "message",
              (e) => {
                let { source: t, data: a } = e;
                t === Hn && a === n && r.length && r.shift()();
              },
              !1,
            ),
            (e) => {
              (r.push(e), Hn.postMessage(n, "*"));
            })
          : (e) => setTimeout(e);
      var n, r;
    })("function" === typeof setImmediate, Pn(Hn.postMessage)),
    er =
      "undefined" !== typeof queueMicrotask
        ? queueMicrotask.bind(Hn)
        : ("undefined" !== typeof process && process.nextTick) || Zn,
    tr = {
      isArray: jn,
      isArrayBuffer: _n,
      isBuffer: En,
      isFormData: (e) => {
        let t;
        return (
          e &&
          (("function" === typeof FormData && e instanceof FormData) ||
            (Pn(e.append) &&
              ("formdata" === (t = wn(e)) ||
                ("object" === t &&
                  Pn(e.toString) &&
                  "[object FormData]" === e.toString()))))
        );
      },
      isArrayBufferView: function (e) {
        let t;
        return (
          (t =
            "undefined" !== typeof ArrayBuffer && ArrayBuffer.isView
              ? ArrayBuffer.isView(e)
              : e && e.buffer && _n(e.buffer)),
          t
        );
      },
      isString: Cn,
      isNumber: On,
      isBoolean: (e) => !0 === e || !1 === e,
      isObject: Rn,
      isPlainObject: Tn,
      isEmptyObject: (e) => {
        if (!Rn(e) || En(e)) return !1;
        try {
          return (
            0 === Object.keys(e).length &&
            Object.getPrototypeOf(e) === Object.prototype
          );
        } catch (Qi) {
          return !1;
        }
      },
      isReadableStream: Bn,
      isRequest: Dn,
      isResponse: Un,
      isHeaders: In,
      isUndefined: Nn,
      isDate: Ln,
      isFile: An,
      isBlob: zn,
      isRegExp: Jn,
      isFunction: Pn,
      isStream: (e) => Rn(e) && Pn(e.pipe),
      isURLSearchParams: Mn,
      isTypedArray: $n,
      isFileList: Fn,
      forEach: qn,
      merge: function e() {
        const { caseless: t, skipUndefined: n } = (Wn(this) && this) || {},
          r = {},
          a = (a, i) => {
            const o = (t && Vn(r, i)) || i;
            Tn(r[o]) && Tn(a)
              ? (r[o] = e(r[o], a))
              : Tn(a)
                ? (r[o] = e({}, a))
                : jn(a)
                  ? (r[o] = a.slice())
                  : (n && Nn(a)) || (r[o] = a);
          };
        for (let i = 0, o = arguments.length; i < o; i++)
          arguments[i] && qn(arguments[i], a);
        return r;
      },
      extend: function (e, t, n) {
        let { allOwnKeys: r } =
          arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
        return (
          qn(
            t,
            (t, r) => {
              n && Pn(t) ? (e[r] = gn(t, n)) : (e[r] = t);
            },
            { allOwnKeys: r },
          ),
          e
        );
      },
      trim: (e) =>
        e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
      stripBOM: (e) => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
      inherits: (e, t, n, r) => {
        ((e.prototype = Object.create(t.prototype, r)),
          (e.prototype.constructor = e),
          Object.defineProperty(e, "super", { value: t.prototype }),
          n && Object.assign(e.prototype, n));
      },
      toFlatObject: (e, t, n, r) => {
        let a, i, o;
        const s = {};
        if (((t = t || {}), null == e)) return t;
        do {
          for (a = Object.getOwnPropertyNames(e), i = a.length; i-- > 0; )
            ((o = a[i]),
              (r && !r(o, e, t)) || s[o] || ((t[o] = e[o]), (s[o] = !0)));
          e = !1 !== n && vn(e);
        } while (e && (!n || n(e, t)) && e !== Object.prototype);
        return t;
      },
      kindOf: wn,
      kindOfTest: kn,
      endsWith: (e, t, n) => {
        ((e = String(e)),
          (void 0 === n || n > e.length) && (n = e.length),
          (n -= t.length));
        const r = e.indexOf(t, n);
        return -1 !== r && r === n;
      },
      toArray: (e) => {
        if (!e) return null;
        if (jn(e)) return e;
        let t = e.length;
        if (!On(t)) return null;
        const n = new Array(t);
        for (; t-- > 0; ) n[t] = e[t];
        return n;
      },
      forEachEntry: (e, t) => {
        const n = (e && e[bn]).call(e);
        let r;
        for (; (r = n.next()) && !r.done; ) {
          const n = r.value;
          t.call(e, n[0], n[1]);
        }
      },
      matchAll: (e, t) => {
        let n;
        const r = [];
        for (; null !== (n = e.exec(t)); ) r.push(n);
        return r;
      },
      isHTMLForm: Qn,
      hasOwnProperty: Yn,
      hasOwnProp: Yn,
      reduceDescriptors: Xn,
      freezeMethods: (e) => {
        Xn(e, (t, n) => {
          if (Pn(e) && -1 !== ["arguments", "caller", "callee"].indexOf(n))
            return !1;
          const r = e[n];
          Pn(r) &&
            ((t.enumerable = !1),
            "writable" in t
              ? (t.writable = !1)
              : t.set ||
                (t.set = () => {
                  throw Error("Can not rewrite read-only method '" + n + "'");
                }));
        });
      },
      toObjectSet: (e, t) => {
        const n = {},
          r = (e) => {
            e.forEach((e) => {
              n[e] = !0;
            });
          };
        return (jn(e) ? r(e) : r(String(e).split(t)), n);
      },
      toCamelCase: (e) =>
        e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, n) {
          return t.toUpperCase() + n;
        }),
      noop: () => {},
      toFiniteNumber: (e, t) =>
        null != e && Number.isFinite((e = +e)) ? e : t,
      findKey: Vn,
      global: Hn,
      isContextDefined: Wn,
      isSpecCompliantForm: function (e) {
        return !!(e && Pn(e.append) && "FormData" === e[xn] && e[bn]);
      },
      toJSONObject: (e) => {
        const t = new Array(10),
          n = (e, r) => {
            if (Rn(e)) {
              if (t.indexOf(e) >= 0) return;
              if (En(e)) return e;
              if (!("toJSON" in e)) {
                t[r] = e;
                const a = jn(e) ? [] : {};
                return (
                  qn(e, (e, t) => {
                    const i = n(e, r + 1);
                    !Nn(i) && (a[t] = i);
                  }),
                  (t[r] = void 0),
                  a
                );
              }
            }
            return e;
          };
        return n(e, 0);
      },
      isAsyncFn: Gn,
      isThenable: (e) => e && (Rn(e) || Pn(e)) && Pn(e.then) && Pn(e.catch),
      setImmediate: Zn,
      asap: er,
      isIterable: (e) => null != e && Pn(e[bn]),
    };
  function nr(e, t, n, r, a) {
    (Error.call(this),
      Error.captureStackTrace
        ? Error.captureStackTrace(this, this.constructor)
        : (this.stack = new Error().stack),
      (this.message = e),
      (this.name = "AxiosError"),
      t && (this.code = t),
      n && (this.config = n),
      r && (this.request = r),
      a && ((this.response = a), (this.status = a.status ? a.status : null)));
  }
  tr.inherits(nr, Error, {
    toJSON: function () {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: tr.toJSONObject(this.config),
        code: this.code,
        status: this.status,
      };
    },
  });
  const rr = nr.prototype,
    ar = {};
  ([
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL",
  ].forEach((e) => {
    ar[e] = { value: e };
  }),
    Object.defineProperties(nr, ar),
    Object.defineProperty(rr, "isAxiosError", { value: !0 }),
    (nr.from = (e, t, n, r, a, i) => {
      const o = Object.create(rr);
      tr.toFlatObject(
        e,
        o,
        function (e) {
          return e !== Error.prototype;
        },
        (e) => "isAxiosError" !== e,
      );
      const s = e && e.message ? e.message : "Error",
        l = null == t && e ? e.code : t;
      return (
        nr.call(o, s, l, n, r, a),
        e &&
          null == o.cause &&
          Object.defineProperty(o, "cause", { value: e, configurable: !0 }),
        (o.name = (e && e.name) || "Error"),
        i && Object.assign(o, i),
        o
      );
    }));
  const ir = nr;
  function or(e) {
    return tr.isPlainObject(e) || tr.isArray(e);
  }
  function sr(e) {
    return tr.endsWith(e, "[]") ? e.slice(0, -2) : e;
  }
  function lr(e, t, n) {
    return e
      ? e
          .concat(t)
          .map(function (e, t) {
            return ((e = sr(e)), !n && t ? "[" + e + "]" : e);
          })
          .join(n ? "." : "")
      : t;
  }
  const cr = tr.toFlatObject(tr, {}, null, function (e) {
    return /^is[A-Z]/.test(e);
  });
  const ur = function (e, t, n) {
    if (!tr.isObject(e)) throw new TypeError("target must be an object");
    t = t || new FormData();
    const r = (n = tr.toFlatObject(
        n,
        { metaTokens: !0, dots: !1, indexes: !1 },
        !1,
        function (e, t) {
          return !tr.isUndefined(t[e]);
        },
      )).metaTokens,
      a = n.visitor || c,
      i = n.dots,
      o = n.indexes,
      s =
        (n.Blob || ("undefined" !== typeof Blob && Blob)) &&
        tr.isSpecCompliantForm(t);
    if (!tr.isFunction(a)) throw new TypeError("visitor must be a function");
    function l(e) {
      if (null === e) return "";
      if (tr.isDate(e)) return e.toISOString();
      if (tr.isBoolean(e)) return e.toString();
      if (!s && tr.isBlob(e))
        throw new ir("Blob is not supported. Use a Buffer instead.");
      return tr.isArrayBuffer(e) || tr.isTypedArray(e)
        ? s && "function" === typeof Blob
          ? new Blob([e])
          : Buffer.from(e)
        : e;
    }
    function c(e, n, a) {
      let s = e;
      if (e && !a && "object" === typeof e)
        if (tr.endsWith(n, "{}"))
          ((n = r ? n : n.slice(0, -2)), (e = JSON.stringify(e)));
        else if (
          (tr.isArray(e) &&
            (function (e) {
              return tr.isArray(e) && !e.some(or);
            })(e)) ||
          ((tr.isFileList(e) || tr.endsWith(n, "[]")) && (s = tr.toArray(e)))
        )
          return (
            (n = sr(n)),
            s.forEach(function (e, r) {
              !tr.isUndefined(e) &&
                null !== e &&
                t.append(
                  !0 === o ? lr([n], r, i) : null === o ? n : n + "[]",
                  l(e),
                );
            }),
            !1
          );
      return !!or(e) || (t.append(lr(a, n, i), l(e)), !1);
    }
    const u = [],
      d = Object.assign(cr, {
        defaultVisitor: c,
        convertValue: l,
        isVisitable: or,
      });
    if (!tr.isObject(e)) throw new TypeError("data must be an object");
    return (
      (function e(n, r) {
        if (!tr.isUndefined(n)) {
          if (-1 !== u.indexOf(n))
            throw Error("Circular reference detected in " + r.join("."));
          (u.push(n),
            tr.forEach(n, function (n, i) {
              !0 ===
                (!(tr.isUndefined(n) || null === n) &&
                  a.call(t, n, tr.isString(i) ? i.trim() : i, r, d)) &&
                e(n, r ? r.concat(i) : [i]);
            }),
            u.pop());
        }
      })(e),
      t
    );
  };
  function dr(e) {
    const t = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0",
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (e) {
      return t[e];
    });
  }
  function fr(e, t) {
    ((this._pairs = []), e && ur(e, this, t));
  }
  const hr = fr.prototype;
  ((hr.append = function (e, t) {
    this._pairs.push([e, t]);
  }),
    (hr.toString = function (e) {
      const t = e
        ? function (t) {
            return e.call(this, t, dr);
          }
        : dr;
      return this._pairs
        .map(function (e) {
          return t(e[0]) + "=" + t(e[1]);
        }, "")
        .join("&");
    }));
  const pr = fr;
  function mr(e) {
    return encodeURIComponent(e)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+");
  }
  function gr(e, t, n) {
    if (!t) return e;
    const r = (n && n.encode) || mr;
    tr.isFunction(n) && (n = { serialize: n });
    const a = n && n.serialize;
    let i;
    if (
      ((i = a
        ? a(t, n)
        : tr.isURLSearchParams(t)
          ? t.toString()
          : new pr(t, n).toString(r)),
      i)
    ) {
      const t = e.indexOf("#");
      (-1 !== t && (e = e.slice(0, t)),
        (e += (-1 === e.indexOf("?") ? "?" : "&") + i));
    }
    return e;
  }
  const yr = class {
      constructor() {
        this.handlers = [];
      }
      use(e, t, n) {
        return (
          this.handlers.push({
            fulfilled: e,
            rejected: t,
            synchronous: !!n && n.synchronous,
            runWhen: n ? n.runWhen : null,
          }),
          this.handlers.length - 1
        );
      }
      eject(e) {
        this.handlers[e] && (this.handlers[e] = null);
      }
      clear() {
        this.handlers && (this.handlers = []);
      }
      forEach(e) {
        tr.forEach(this.handlers, function (t) {
          null !== t && e(t);
        });
      }
    },
    vr = {
      silentJSONParsing: !0,
      forcedJSONParsing: !0,
      clarifyTimeoutError: !1,
    };
  function br(e) {
    return (
      (br =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            }),
      br(e)
    );
  }
  function xr(e) {
    var t = (function (e, t) {
      if ("object" != br(e) || !e) return e;
      var n = e[Symbol.toPrimitive];
      if (void 0 !== n) {
        var r = n.call(e, t || "default");
        if ("object" != br(r)) return r;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t ? String : Number)(e);
    })(e, "string");
    return "symbol" == br(t) ? t : t + "";
  }
  function wr(e, t, n) {
    return (
      (t = xr(t)) in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function kr(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      (t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r));
    }
    return n;
  }
  function Sr(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? kr(Object(n), !0).forEach(function (t) {
            wr(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : kr(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t),
              );
            });
    }
    return e;
  }
  const jr = {
      isBrowser: !0,
      classes: {
        URLSearchParams:
          "undefined" !== typeof URLSearchParams ? URLSearchParams : pr,
        FormData: "undefined" !== typeof FormData ? FormData : null,
        Blob: "undefined" !== typeof Blob ? Blob : null,
      },
      protocols: ["http", "https", "file", "blob", "url", "data"],
    },
    Nr = "undefined" !== typeof window && "undefined" !== typeof document,
    Er = ("object" === typeof navigator && navigator) || void 0,
    _r =
      Nr &&
      (!Er || ["ReactNative", "NativeScript", "NS"].indexOf(Er.product) < 0),
    Cr =
      "undefined" !== typeof WorkerGlobalScope &&
      self instanceof WorkerGlobalScope &&
      "function" === typeof self.importScripts,
    Pr = (Nr && window.location.href) || "http://localhost",
    Or = Sr(Sr({}, a), jr);
  const Rr = function (e) {
    function t(e, n, r, a) {
      let i = e[a++];
      if ("__proto__" === i) return !0;
      const o = Number.isFinite(+i),
        s = a >= e.length;
      if (((i = !i && tr.isArray(r) ? r.length : i), s))
        return (tr.hasOwnProp(r, i) ? (r[i] = [r[i], n]) : (r[i] = n), !o);
      (r[i] && tr.isObject(r[i])) || (r[i] = []);
      return (
        t(e, n, r[i], a) &&
          tr.isArray(r[i]) &&
          (r[i] = (function (e) {
            const t = {},
              n = Object.keys(e);
            let r;
            const a = n.length;
            let i;
            for (r = 0; r < a; r++) ((i = n[r]), (t[i] = e[i]));
            return t;
          })(r[i])),
        !o
      );
    }
    if (tr.isFormData(e) && tr.isFunction(e.entries)) {
      const n = {};
      return (
        tr.forEachEntry(e, (e, r) => {
          t(
            (function (e) {
              return tr
                .matchAll(/\w+|\[(\w*)]/g, e)
                .map((e) => ("[]" === e[0] ? "" : e[1] || e[0]));
            })(e),
            r,
            n,
            0,
          );
        }),
        n
      );
    }
    return null;
  };
  const Tr = {
    transitional: vr,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function (e, t) {
        const n = t.getContentType() || "",
          r = n.indexOf("application/json") > -1,
          a = tr.isObject(e);
        a && tr.isHTMLForm(e) && (e = new FormData(e));
        if (tr.isFormData(e)) return r ? JSON.stringify(Rr(e)) : e;
        if (
          tr.isArrayBuffer(e) ||
          tr.isBuffer(e) ||
          tr.isStream(e) ||
          tr.isFile(e) ||
          tr.isBlob(e) ||
          tr.isReadableStream(e)
        )
          return e;
        if (tr.isArrayBufferView(e)) return e.buffer;
        if (tr.isURLSearchParams(e))
          return (
            t.setContentType(
              "application/x-www-form-urlencoded;charset=utf-8",
              !1,
            ),
            e.toString()
          );
        let i;
        if (a) {
          if (n.indexOf("application/x-www-form-urlencoded") > -1)
            return (function (e, t) {
              return ur(
                e,
                new Or.classes.URLSearchParams(),
                Sr(
                  {
                    visitor: function (e, t, n, r) {
                      return Or.isNode && tr.isBuffer(e)
                        ? (this.append(t, e.toString("base64")), !1)
                        : r.defaultVisitor.apply(this, arguments);
                    },
                  },
                  t,
                ),
              );
            })(e, this.formSerializer).toString();
          if ((i = tr.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
            const t = this.env && this.env.FormData;
            return ur(
              i ? { "files[]": e } : e,
              t && new t(),
              this.formSerializer,
            );
          }
        }
        return a || r
          ? (t.setContentType("application/json", !1),
            (function (e, t, n) {
              if (tr.isString(e))
                try {
                  return ((t || JSON.parse)(e), tr.trim(e));
                } catch (Qi) {
                  if ("SyntaxError" !== Qi.name) throw Qi;
                }
              return (n || JSON.stringify)(e);
            })(e))
          : e;
      },
    ],
    transformResponse: [
      function (e) {
        const t = this.transitional || Tr.transitional,
          n = t && t.forcedJSONParsing,
          r = "json" === this.responseType;
        if (tr.isResponse(e) || tr.isReadableStream(e)) return e;
        if (e && tr.isString(e) && ((n && !this.responseType) || r)) {
          const n = !(t && t.silentJSONParsing) && r;
          try {
            return JSON.parse(e, this.parseReviver);
          } catch (Qi) {
            if (n) {
              if ("SyntaxError" === Qi.name)
                throw ir.from(
                  Qi,
                  ir.ERR_BAD_RESPONSE,
                  this,
                  null,
                  this.response,
                );
              throw Qi;
            }
          }
        }
        return e;
      },
    ],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: { FormData: Or.classes.FormData, Blob: Or.classes.Blob },
    validateStatus: function (e) {
      return e >= 200 && e < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0,
      },
    },
  };
  tr.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
    Tr.headers[e] = {};
  });
  const Lr = Tr,
    Ar = tr.toObjectSet([
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent",
    ]),
    zr = Symbol("internals");
  function Fr(e) {
    return e && String(e).trim().toLowerCase();
  }
  function Mr(e) {
    return !1 === e || null == e ? e : tr.isArray(e) ? e.map(Mr) : String(e);
  }
  function Br(e, t, n, r, a) {
    return tr.isFunction(r)
      ? r.call(this, t, n)
      : (a && (t = n),
        tr.isString(t)
          ? tr.isString(r)
            ? -1 !== t.indexOf(r)
            : tr.isRegExp(r)
              ? r.test(t)
              : void 0
          : void 0);
  }
  class Dr {
    constructor(e) {
      e && this.set(e);
    }
    set(e, t, n) {
      const r = this;
      function a(e, t, n) {
        const a = Fr(t);
        if (!a) throw new Error("header name must be a non-empty string");
        const i = tr.findKey(r, a);
        (!i || void 0 === r[i] || !0 === n || (void 0 === n && !1 !== r[i])) &&
          (r[i || t] = Mr(e));
      }
      const i = (e, t) => tr.forEach(e, (e, n) => a(e, n, t));
      if (tr.isPlainObject(e) || e instanceof this.constructor) i(e, t);
      else if (
        tr.isString(e) &&
        (e = e.trim()) &&
        !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
      )
        i(
          ((e) => {
            const t = {};
            let n, r, a;
            return (
              e &&
                e.split("\n").forEach(function (e) {
                  ((a = e.indexOf(":")),
                    (n = e.substring(0, a).trim().toLowerCase()),
                    (r = e.substring(a + 1).trim()),
                    !n ||
                      (t[n] && Ar[n]) ||
                      ("set-cookie" === n
                        ? t[n]
                          ? t[n].push(r)
                          : (t[n] = [r])
                        : (t[n] = t[n] ? t[n] + ", " + r : r)));
                }),
              t
            );
          })(e),
          t,
        );
      else if (tr.isObject(e) && tr.isIterable(e)) {
        let n,
          r,
          a = {};
        for (const t of e) {
          if (!tr.isArray(t))
            throw TypeError("Object iterator must return a key-value pair");
          a[(r = t[0])] = (n = a[r])
            ? tr.isArray(n)
              ? [...n, t[1]]
              : [n, t[1]]
            : t[1];
        }
        i(a, t);
      } else null != e && a(t, e, n);
      return this;
    }
    get(e, t) {
      if ((e = Fr(e))) {
        const n = tr.findKey(this, e);
        if (n) {
          const e = this[n];
          if (!t) return e;
          if (!0 === t)
            return (function (e) {
              const t = Object.create(null),
                n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
              let r;
              for (; (r = n.exec(e)); ) t[r[1]] = r[2];
              return t;
            })(e);
          if (tr.isFunction(t)) return t.call(this, e, n);
          if (tr.isRegExp(t)) return t.exec(e);
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(e, t) {
      if ((e = Fr(e))) {
        const n = tr.findKey(this, e);
        return !(!n || void 0 === this[n] || (t && !Br(0, this[n], n, t)));
      }
      return !1;
    }
    delete(e, t) {
      const n = this;
      let r = !1;
      function a(e) {
        if ((e = Fr(e))) {
          const a = tr.findKey(n, e);
          !a || (t && !Br(0, n[a], a, t)) || (delete n[a], (r = !0));
        }
      }
      return (tr.isArray(e) ? e.forEach(a) : a(e), r);
    }
    clear(e) {
      const t = Object.keys(this);
      let n = t.length,
        r = !1;
      for (; n--; ) {
        const a = t[n];
        (e && !Br(0, this[a], a, e, !0)) || (delete this[a], (r = !0));
      }
      return r;
    }
    normalize(e) {
      const t = this,
        n = {};
      return (
        tr.forEach(this, (r, a) => {
          const i = tr.findKey(n, a);
          if (i) return ((t[i] = Mr(r)), void delete t[a]);
          const o = e
            ? (function (e) {
                return e
                  .trim()
                  .toLowerCase()
                  .replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
              })(a)
            : String(a).trim();
          (o !== a && delete t[a], (t[o] = Mr(r)), (n[o] = !0));
        }),
        this
      );
    }
    concat() {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
      return this.constructor.concat(this, ...t);
    }
    toJSON(e) {
      const t = Object.create(null);
      return (
        tr.forEach(this, (n, r) => {
          null != n &&
            !1 !== n &&
            (t[r] = e && tr.isArray(n) ? n.join(", ") : n);
        }),
        t
      );
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON())
        .map((e) => {
          let [t, n] = e;
          return t + ": " + n;
        })
        .join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(e) {
      return e instanceof this ? e : new this(e);
    }
    static concat(e) {
      const t = new this(e);
      for (
        var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), a = 1;
        a < n;
        a++
      )
        r[a - 1] = arguments[a];
      return (r.forEach((e) => t.set(e)), t);
    }
    static accessor(e) {
      const t = (this[zr] = this[zr] = { accessors: {} }).accessors,
        n = this.prototype;
      function r(e) {
        const r = Fr(e);
        t[r] ||
          (!(function (e, t) {
            const n = tr.toCamelCase(" " + t);
            ["get", "set", "has"].forEach((r) => {
              Object.defineProperty(e, r + n, {
                value: function (e, n, a) {
                  return this[r].call(this, t, e, n, a);
                },
                configurable: !0,
              });
            });
          })(n, e),
          (t[r] = !0));
      }
      return (tr.isArray(e) ? e.forEach(r) : r(e), this);
    }
  }
  (Dr.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization",
  ]),
    tr.reduceDescriptors(Dr.prototype, (e, t) => {
      let { value: n } = e,
        r = t[0].toUpperCase() + t.slice(1);
      return {
        get: () => n,
        set(e) {
          this[r] = e;
        },
      };
    }),
    tr.freezeMethods(Dr));
  const Ur = Dr;
  function Ir(e, t) {
    const n = this || Lr,
      r = t || n,
      a = Ur.from(r.headers);
    let i = r.data;
    return (
      tr.forEach(e, function (e) {
        i = e.call(n, i, a.normalize(), t ? t.status : void 0);
      }),
      a.normalize(),
      i
    );
  }
  function qr(e) {
    return !(!e || !e.__CANCEL__);
  }
  function Vr(e, t, n) {
    (ir.call(this, null == e ? "canceled" : e, ir.ERR_CANCELED, t, n),
      (this.name = "CanceledError"));
  }
  tr.inherits(Vr, ir, { __CANCEL__: !0 });
  const Hr = Vr;
  function Wr(e, t, n) {
    const r = n.config.validateStatus;
    n.status && r && !r(n.status)
      ? t(
          new ir(
            "Request failed with status code " + n.status,
            [ir.ERR_BAD_REQUEST, ir.ERR_BAD_RESPONSE][
              Math.floor(n.status / 100) - 4
            ],
            n.config,
            n.request,
            n,
          ),
        )
      : e(n);
  }
  const $r = function (e, t) {
    e = e || 10;
    const n = new Array(e),
      r = new Array(e);
    let a,
      i = 0,
      o = 0;
    return (
      (t = void 0 !== t ? t : 1e3),
      function (s) {
        const l = Date.now(),
          c = r[o];
        (a || (a = l), (n[i] = s), (r[i] = l));
        let u = o,
          d = 0;
        for (; u !== i; ) ((d += n[u++]), (u %= e));
        if (((i = (i + 1) % e), i === o && (o = (o + 1) % e), l - a < t))
          return;
        const f = c && l - c;
        return f ? Math.round((1e3 * d) / f) : void 0;
      }
    );
  };
  const Kr = function (e, t) {
      let n,
        r,
        a = 0,
        i = 1e3 / t;
      const o = function (t) {
        let i =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : Date.now();
        ((a = i), (n = null), r && (clearTimeout(r), (r = null)), e(...t));
      };
      return [
        function () {
          const e = Date.now(),
            t = e - a;
          for (var s = arguments.length, l = new Array(s), c = 0; c < s; c++)
            l[c] = arguments[c];
          t >= i
            ? o(l, e)
            : ((n = l),
              r ||
                (r = setTimeout(() => {
                  ((r = null), o(n));
                }, i - t)));
        },
        () => n && o(n),
      ];
    },
    Qr = function (e, t) {
      let n =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3,
        r = 0;
      const a = $r(50, 250);
      return Kr((n) => {
        const i = n.loaded,
          o = n.lengthComputable ? n.total : void 0,
          s = i - r,
          l = a(s);
        r = i;
        e({
          loaded: i,
          total: o,
          progress: o ? i / o : void 0,
          bytes: s,
          rate: l || void 0,
          estimated: l && o && i <= o ? (o - i) / l : void 0,
          event: n,
          lengthComputable: null != o,
          [t ? "download" : "upload"]: !0,
        });
      }, n);
    },
    Yr = (e, t) => {
      const n = null != e;
      return [(r) => t[0]({ lengthComputable: n, total: e, loaded: r }), t[1]];
    },
    Jr = (e) =>
      function () {
        for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
          n[r] = arguments[r];
        return tr.asap(() => e(...n));
      },
    Xr = Or.hasStandardBrowserEnv
      ? ((e, t) => (n) => (
          (n = new URL(n, Or.origin)),
          e.protocol === n.protocol &&
            e.host === n.host &&
            (t || e.port === n.port)
        ))(
          new URL(Or.origin),
          Or.navigator && /(msie|trident)/i.test(Or.navigator.userAgent),
        )
      : () => !0,
    Gr = Or.hasStandardBrowserEnv
      ? {
          write(e, t, n, r, a, i, o) {
            if ("undefined" === typeof document) return;
            const s = ["".concat(e, "=").concat(encodeURIComponent(t))];
            (tr.isNumber(n) &&
              s.push("expires=".concat(new Date(n).toUTCString())),
              tr.isString(r) && s.push("path=".concat(r)),
              tr.isString(a) && s.push("domain=".concat(a)),
              !0 === i && s.push("secure"),
              tr.isString(o) && s.push("SameSite=".concat(o)),
              (document.cookie = s.join("; ")));
          },
          read(e) {
            if ("undefined" === typeof document) return null;
            const t = document.cookie.match(
              new RegExp("(?:^|; )" + e + "=([^;]*)"),
            );
            return t ? decodeURIComponent(t[1]) : null;
          },
          remove(e) {
            this.write(e, "", Date.now() - 864e5, "/");
          },
        }
      : { write() {}, read: () => null, remove() {} };
  function Zr(e, t, n) {
    let r = !(function (e) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
    })(t);
    return e && (r || 0 == n)
      ? (function (e, t) {
          return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
        })(e, t)
      : t;
  }
  const ea = (e) => (e instanceof Ur ? Sr({}, e) : e);
  function ta(e, t) {
    t = t || {};
    const n = {};
    function r(e, t, n, r) {
      return tr.isPlainObject(e) && tr.isPlainObject(t)
        ? tr.merge.call({ caseless: r }, e, t)
        : tr.isPlainObject(t)
          ? tr.merge({}, t)
          : tr.isArray(t)
            ? t.slice()
            : t;
    }
    function a(e, t, n, a) {
      return tr.isUndefined(t)
        ? tr.isUndefined(e)
          ? void 0
          : r(void 0, e, 0, a)
        : r(e, t, 0, a);
    }
    function i(e, t) {
      if (!tr.isUndefined(t)) return r(void 0, t);
    }
    function o(e, t) {
      return tr.isUndefined(t)
        ? tr.isUndefined(e)
          ? void 0
          : r(void 0, e)
        : r(void 0, t);
    }
    function s(n, a, i) {
      return i in t ? r(n, a) : i in e ? r(void 0, n) : void 0;
    }
    const l = {
      url: i,
      method: i,
      data: i,
      baseURL: o,
      transformRequest: o,
      transformResponse: o,
      paramsSerializer: o,
      timeout: o,
      timeoutMessage: o,
      withCredentials: o,
      withXSRFToken: o,
      adapter: o,
      responseType: o,
      xsrfCookieName: o,
      xsrfHeaderName: o,
      onUploadProgress: o,
      onDownloadProgress: o,
      decompress: o,
      maxContentLength: o,
      maxBodyLength: o,
      beforeRedirect: o,
      transport: o,
      httpAgent: o,
      httpsAgent: o,
      cancelToken: o,
      socketPath: o,
      responseEncoding: o,
      validateStatus: s,
      headers: (e, t, n) => a(ea(e), ea(t), 0, !0),
    };
    return (
      tr.forEach(Object.keys(Sr(Sr({}, e), t)), function (r) {
        const i = l[r] || a,
          o = i(e[r], t[r], r);
        (tr.isUndefined(o) && i !== s) || (n[r] = o);
      }),
      n
    );
  }
  const na = (e) => {
      const t = ta({}, e);
      let {
        data: n,
        withXSRFToken: r,
        xsrfHeaderName: a,
        xsrfCookieName: i,
        headers: o,
        auth: s,
      } = t;
      if (
        ((t.headers = o = Ur.from(o)),
        (t.url = gr(
          Zr(t.baseURL, t.url, t.allowAbsoluteUrls),
          e.params,
          e.paramsSerializer,
        )),
        s &&
          o.set(
            "Authorization",
            "Basic " +
              btoa(
                (s.username || "") +
                  ":" +
                  (s.password ? unescape(encodeURIComponent(s.password)) : ""),
              ),
          ),
        tr.isFormData(n))
      )
        if (Or.hasStandardBrowserEnv || Or.hasStandardBrowserWebWorkerEnv)
          o.setContentType(void 0);
        else if (tr.isFunction(n.getHeaders)) {
          const e = n.getHeaders(),
            t = ["content-type", "content-length"];
          Object.entries(e).forEach((e) => {
            let [n, r] = e;
            t.includes(n.toLowerCase()) && o.set(n, r);
          });
        }
      if (
        Or.hasStandardBrowserEnv &&
        (r && tr.isFunction(r) && (r = r(t)), r || (!1 !== r && Xr(t.url)))
      ) {
        const e = a && i && Gr.read(i);
        e && o.set(a, e);
      }
      return t;
    },
    ra =
      "undefined" !== typeof XMLHttpRequest &&
      function (e) {
        return new Promise(function (t, n) {
          const r = na(e);
          let a = r.data;
          const i = Ur.from(r.headers).normalize();
          let o,
            s,
            l,
            c,
            u,
            { responseType: d, onUploadProgress: f, onDownloadProgress: h } = r;
          function p() {
            (c && c(),
              u && u(),
              r.cancelToken && r.cancelToken.unsubscribe(o),
              r.signal && r.signal.removeEventListener("abort", o));
          }
          let m = new XMLHttpRequest();
          function g() {
            if (!m) return;
            const r = Ur.from(
              "getAllResponseHeaders" in m && m.getAllResponseHeaders(),
            );
            (Wr(
              function (e) {
                (t(e), p());
              },
              function (e) {
                (n(e), p());
              },
              {
                data:
                  d && "text" !== d && "json" !== d
                    ? m.response
                    : m.responseText,
                status: m.status,
                statusText: m.statusText,
                headers: r,
                config: e,
                request: m,
              },
            ),
              (m = null));
          }
          (m.open(r.method.toUpperCase(), r.url, !0),
            (m.timeout = r.timeout),
            "onloadend" in m
              ? (m.onloadend = g)
              : (m.onreadystatechange = function () {
                  m &&
                    4 === m.readyState &&
                    (0 !== m.status ||
                      (m.responseURL &&
                        0 === m.responseURL.indexOf("file:"))) &&
                    setTimeout(g);
                }),
            (m.onabort = function () {
              m &&
                (n(new ir("Request aborted", ir.ECONNABORTED, e, m)),
                (m = null));
            }),
            (m.onerror = function (t) {
              const r = t && t.message ? t.message : "Network Error",
                a = new ir(r, ir.ERR_NETWORK, e, m);
              ((a.event = t || null), n(a), (m = null));
            }),
            (m.ontimeout = function () {
              let t = r.timeout
                ? "timeout of " + r.timeout + "ms exceeded"
                : "timeout exceeded";
              const a = r.transitional || vr;
              (r.timeoutErrorMessage && (t = r.timeoutErrorMessage),
                n(
                  new ir(
                    t,
                    a.clarifyTimeoutError ? ir.ETIMEDOUT : ir.ECONNABORTED,
                    e,
                    m,
                  ),
                ),
                (m = null));
            }),
            void 0 === a && i.setContentType(null),
            "setRequestHeader" in m &&
              tr.forEach(i.toJSON(), function (e, t) {
                m.setRequestHeader(t, e);
              }),
            tr.isUndefined(r.withCredentials) ||
              (m.withCredentials = !!r.withCredentials),
            d && "json" !== d && (m.responseType = r.responseType),
            h && (([l, u] = Qr(h, !0)), m.addEventListener("progress", l)),
            f &&
              m.upload &&
              (([s, c] = Qr(f)),
              m.upload.addEventListener("progress", s),
              m.upload.addEventListener("loadend", c)),
            (r.cancelToken || r.signal) &&
              ((o = (t) => {
                m &&
                  (n(!t || t.type ? new Hr(null, e, m) : t),
                  m.abort(),
                  (m = null));
              }),
              r.cancelToken && r.cancelToken.subscribe(o),
              r.signal &&
                (r.signal.aborted
                  ? o()
                  : r.signal.addEventListener("abort", o))));
          const y = (function (e) {
            const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
            return (t && t[1]) || "";
          })(r.url);
          y && -1 === Or.protocols.indexOf(y)
            ? n(
                new ir(
                  "Unsupported protocol " + y + ":",
                  ir.ERR_BAD_REQUEST,
                  e,
                ),
              )
            : m.send(a || null);
        });
      },
    aa = (e, t) => {
      const { length: n } = (e = e ? e.filter(Boolean) : []);
      if (t || n) {
        let n,
          r = new AbortController();
        const a = function (e) {
          if (!n) {
            ((n = !0), o());
            const t = e instanceof Error ? e : this.reason;
            r.abort(
              t instanceof ir ? t : new Hr(t instanceof Error ? t.message : t),
            );
          }
        };
        let i =
          t &&
          setTimeout(() => {
            ((i = null),
              a(new ir("timeout ".concat(t, " of ms exceeded"), ir.ETIMEDOUT)));
          }, t);
        const o = () => {
          e &&
            (i && clearTimeout(i),
            (i = null),
            e.forEach((e) => {
              e.unsubscribe
                ? e.unsubscribe(a)
                : e.removeEventListener("abort", a);
            }),
            (e = null));
        };
        e.forEach((e) => e.addEventListener("abort", a));
        const { signal: s } = r;
        return ((s.unsubscribe = () => tr.asap(o)), s);
      }
    };
  function ia(e, t) {
    ((this.v = e), (this.k = t));
  }
  function oa(e) {
    return function () {
      return new sa(e.apply(this, arguments));
    };
  }
  function sa(e) {
    var t, n;
    function r(t, n) {
      try {
        var i = e[t](n),
          o = i.value,
          s = o instanceof ia;
        Promise.resolve(s ? o.v : o).then(
          function (n) {
            if (s) {
              var l = "return" === t ? "return" : "next";
              if (!o.k || n.done) return r(l, n);
              n = e[l](n).value;
            }
            a(i.done ? "return" : "normal", n);
          },
          function (e) {
            r("throw", e);
          },
        );
      } catch (e) {
        a("throw", e);
      }
    }
    function a(e, a) {
      switch (e) {
        case "return":
          t.resolve({ value: a, done: !0 });
          break;
        case "throw":
          t.reject(a);
          break;
        default:
          t.resolve({ value: a, done: !1 });
      }
      (t = t.next) ? r(t.key, t.arg) : (n = null);
    }
    ((this._invoke = function (e, a) {
      return new Promise(function (i, o) {
        var s = { key: e, arg: a, resolve: i, reject: o, next: null };
        n ? (n = n.next = s) : ((t = n = s), r(e, a));
      });
    }),
      "function" != typeof e.return && (this.return = void 0));
  }
  function la(e) {
    return new ia(e, 0);
  }
  function ca(e) {
    var t = {},
      n = !1;
    function r(t, r) {
      return (
        (n = !0),
        (r = new Promise(function (n) {
          n(e[t](r));
        })),
        { done: !1, value: new ia(r, 1) }
      );
    }
    return (
      (t[("undefined" != typeof Symbol && Symbol.iterator) || "@@iterator"] =
        function () {
          return this;
        }),
      (t.next = function (e) {
        return n ? ((n = !1), e) : r("next", e);
      }),
      "function" == typeof e.throw &&
        (t.throw = function (e) {
          if (n) throw ((n = !1), e);
          return r("throw", e);
        }),
      "function" == typeof e.return &&
        (t.return = function (e) {
          return n ? ((n = !1), e) : r("return", e);
        }),
      t
    );
  }
  function ua(e) {
    var t,
      n,
      r,
      a = 2;
    for (
      "undefined" != typeof Symbol &&
      ((n = Symbol.asyncIterator), (r = Symbol.iterator));
      a--;
    ) {
      if (n && null != (t = e[n])) return t.call(e);
      if (r && null != (t = e[r])) return new da(t.call(e));
      ((n = "@@asyncIterator"), (r = "@@iterator"));
    }
    throw new TypeError("Object is not async iterable");
  }
  function da(e) {
    function t(e) {
      if (Object(e) !== e)
        return Promise.reject(new TypeError(e + " is not an object."));
      var t = e.done;
      return Promise.resolve(e.value).then(function (e) {
        return { value: e, done: t };
      });
    }
    return (
      (da = function (e) {
        ((this.s = e), (this.n = e.next));
      }),
      (da.prototype = {
        s: null,
        n: null,
        next: function () {
          return t(this.n.apply(this.s, arguments));
        },
        return: function (e) {
          var n = this.s.return;
          return void 0 === n
            ? Promise.resolve({ value: e, done: !0 })
            : t(n.apply(this.s, arguments));
        },
        throw: function (e) {
          var n = this.s.return;
          return void 0 === n
            ? Promise.reject(e)
            : t(n.apply(this.s, arguments));
        },
      }),
      new da(e)
    );
  }
  ((sa.prototype[
    ("function" == typeof Symbol && Symbol.asyncIterator) || "@@asyncIterator"
  ] = function () {
    return this;
  }),
    (sa.prototype.next = function (e) {
      return this._invoke("next", e);
    }),
    (sa.prototype.throw = function (e) {
      return this._invoke("throw", e);
    }),
    (sa.prototype.return = function (e) {
      return this._invoke("return", e);
    }));
  const fa = function* (e, t) {
      let n = e.byteLength;
      if (!t || n < t) return void (yield e);
      let r,
        a = 0;
      for (; a < n; ) ((r = a + t), yield e.slice(a, r), (a = r));
    },
    ha = (function () {
      var e = oa(function* (e, t) {
        var n,
          r = !1,
          a = !1;
        try {
          for (
            var i, o = ua(pa(e));
            (r = !(i = yield la(o.next())).done);
            r = !1
          ) {
            const e = i.value;
            yield* ca(ua(fa(e, t)));
          }
        } catch (Yi) {
          ((a = !0), (n = Yi));
        } finally {
          try {
            r && null != o.return && (yield la(o.return()));
          } finally {
            if (a) throw n;
          }
        }
      });
      return function (t, n) {
        return e.apply(this, arguments);
      };
    })(),
    pa = (function () {
      var e = oa(function* (e) {
        if (e[Symbol.asyncIterator]) return void (yield* ca(ua(e)));
        const t = e.getReader();
        try {
          for (;;) {
            const { done: e, value: n } = yield la(t.read());
            if (e) break;
            yield n;
          }
        } finally {
          yield la(t.cancel());
        }
      });
      return function (t) {
        return e.apply(this, arguments);
      };
    })(),
    ma = (e, t, n, r) => {
      const a = ha(e, t);
      let i,
        o = 0,
        s = (e) => {
          i || ((i = !0), r && r(e));
        };
      return new ReadableStream(
        {
          async pull(e) {
            try {
              const { done: t, value: r } = await a.next();
              if (t) return (s(), void e.close());
              let i = r.byteLength;
              if (n) {
                let e = (o += i);
                n(e);
              }
              e.enqueue(new Uint8Array(r));
            } catch (Yi) {
              throw (s(Yi), Yi);
            }
          },
          cancel: (e) => (s(e), a.return()),
        },
        { highWaterMark: 2 },
      );
    },
    { isFunction: ga } = tr,
    ya = ((e) => {
      let { Request: t, Response: n } = e;
      return { Request: t, Response: n };
    })(tr.global),
    { ReadableStream: va, TextEncoder: ba } = tr.global,
    xa = function (e) {
      try {
        for (
          var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        return !!e(...n);
      } catch (Qi) {
        return !1;
      }
    },
    wa = (e) => {
      e = tr.merge.call({ skipUndefined: !0 }, ya, e);
      const { fetch: t, Request: n, Response: r } = e,
        a = t ? ga(t) : "function" === typeof fetch,
        i = ga(n),
        o = ga(r);
      if (!a) return !1;
      const s = a && ga(va),
        l =
          a &&
          ("function" === typeof ba
            ? ((c = new ba()), (e) => c.encode(e))
            : async (e) => new Uint8Array(await new n(e).arrayBuffer()));
      var c;
      const u =
          i &&
          s &&
          xa(() => {
            let e = !1;
            const t = new n(Or.origin, {
              body: new va(),
              method: "POST",
              get duplex() {
                return ((e = !0), "half");
              },
            }).headers.has("Content-Type");
            return e && !t;
          }),
        d = o && s && xa(() => tr.isReadableStream(new r("").body)),
        f = { stream: d && ((e) => e.body) };
      a &&
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
          !f[e] &&
            (f[e] = (t, n) => {
              let r = t && t[e];
              if (r) return r.call(t);
              throw new ir(
                "Response type '".concat(e, "' is not supported"),
                ir.ERR_NOT_SUPPORT,
                n,
              );
            });
        });
      const h = async (e, t) => {
        const r = tr.toFiniteNumber(e.getContentLength());
        return null == r
          ? (async (e) => {
              if (null == e) return 0;
              if (tr.isBlob(e)) return e.size;
              if (tr.isSpecCompliantForm(e)) {
                const t = new n(Or.origin, { method: "POST", body: e });
                return (await t.arrayBuffer()).byteLength;
              }
              return tr.isArrayBufferView(e) || tr.isArrayBuffer(e)
                ? e.byteLength
                : (tr.isURLSearchParams(e) && (e += ""),
                  tr.isString(e) ? (await l(e)).byteLength : void 0);
            })(t)
          : r;
      };
      return async (e) => {
        let {
            url: a,
            method: o,
            data: s,
            signal: l,
            cancelToken: c,
            timeout: p,
            onDownloadProgress: m,
            onUploadProgress: g,
            responseType: y,
            headers: v,
            withCredentials: b = "same-origin",
            fetchOptions: x,
          } = na(e),
          w = t || fetch;
        y = y ? (y + "").toLowerCase() : "text";
        let k = aa([l, c && c.toAbortSignal()], p),
          S = null;
        const j =
          k &&
          k.unsubscribe &&
          (() => {
            k.unsubscribe();
          });
        let N;
        try {
          if (
            g &&
            u &&
            "get" !== o &&
            "head" !== o &&
            0 !== (N = await h(v, s))
          ) {
            let e,
              t = new n(a, { method: "POST", body: s, duplex: "half" });
            if (
              (tr.isFormData(s) &&
                (e = t.headers.get("content-type")) &&
                v.setContentType(e),
              t.body)
            ) {
              const [e, n] = Yr(N, Qr(Jr(g)));
              s = ma(t.body, 65536, e, n);
            }
          }
          tr.isString(b) || (b = b ? "include" : "omit");
          const t = i && "credentials" in n.prototype,
            l = Sr(
              Sr({}, x),
              {},
              {
                signal: k,
                method: o.toUpperCase(),
                headers: v.normalize().toJSON(),
                body: s,
                duplex: "half",
                credentials: t ? b : void 0,
              },
            );
          S = i && new n(a, l);
          let c = await (i ? w(S, x) : w(a, l));
          const p = d && ("stream" === y || "response" === y);
          if (d && (m || (p && j))) {
            const e = {};
            ["status", "statusText", "headers"].forEach((t) => {
              e[t] = c[t];
            });
            const t = tr.toFiniteNumber(c.headers.get("content-length")),
              [n, a] = (m && Yr(t, Qr(Jr(m), !0))) || [];
            c = new r(
              ma(c.body, 65536, n, () => {
                (a && a(), j && j());
              }),
              e,
            );
          }
          y = y || "text";
          let E = await f[tr.findKey(f, y) || "text"](c, e);
          return (
            !p && j && j(),
            await new Promise((t, n) => {
              Wr(t, n, {
                data: E,
                headers: Ur.from(c.headers),
                status: c.status,
                statusText: c.statusText,
                config: e,
                request: S,
              });
            })
          );
        } catch (Yi) {
          if (
            (j && j(),
            Yi &&
              "TypeError" === Yi.name &&
              /Load failed|fetch/i.test(Yi.message))
          )
            throw Object.assign(new ir("Network Error", ir.ERR_NETWORK, e, S), {
              cause: Yi.cause || Yi,
            });
          throw ir.from(Yi, Yi && Yi.code, e, S);
        }
      };
    },
    ka = new Map(),
    Sa = (e) => {
      let t = (e && e.env) || {};
      const { fetch: n, Request: r, Response: a } = t,
        i = [r, a, n];
      let o,
        s,
        l = i.length,
        c = ka;
      for (; l--; )
        ((o = i[l]),
          (s = c.get(o)),
          void 0 === s && c.set(o, (s = l ? new Map() : wa(t))),
          (c = s));
      return s;
    },
    ja = (Sa(), { http: null, xhr: ra, fetch: { get: Sa } });
  tr.forEach(ja, (e, t) => {
    if (e) {
      try {
        Object.defineProperty(e, "name", { value: t });
      } catch (Qi) {}
      Object.defineProperty(e, "adapterName", { value: t });
    }
  });
  const Na = (e) => "- ".concat(e),
    Ea = (e) => tr.isFunction(e) || null === e || !1 === e;
  const _a = {
    getAdapter: function (e, t) {
      e = tr.isArray(e) ? e : [e];
      const { length: n } = e;
      let r, a;
      const i = {};
      for (let o = 0; o < n; o++) {
        let n;
        if (
          ((r = e[o]),
          (a = r),
          !Ea(r) && ((a = ja[(n = String(r)).toLowerCase()]), void 0 === a))
        )
          throw new ir("Unknown adapter '".concat(n, "'"));
        if (a && (tr.isFunction(a) || (a = a.get(t)))) break;
        i[n || "#" + o] = a;
      }
      if (!a) {
        const e = Object.entries(i).map((e) => {
          let [t, n] = e;
          return (
            "adapter ".concat(t, " ") +
            (!1 === n
              ? "is not supported by the environment"
              : "is not available in the build")
          );
        });
        let t = n
          ? e.length > 1
            ? "since :\n" + e.map(Na).join("\n")
            : " " + Na(e[0])
          : "as no adapter specified";
        throw new ir(
          "There is no suitable adapter to dispatch the request " + t,
          "ERR_NOT_SUPPORT",
        );
      }
      return a;
    },
    adapters: ja,
  };
  function Ca(e) {
    if (
      (e.cancelToken && e.cancelToken.throwIfRequested(),
      e.signal && e.signal.aborted)
    )
      throw new Hr(null, e);
  }
  function Pa(e) {
    (Ca(e),
      (e.headers = Ur.from(e.headers)),
      (e.data = Ir.call(e, e.transformRequest)),
      -1 !== ["post", "put", "patch"].indexOf(e.method) &&
        e.headers.setContentType("application/x-www-form-urlencoded", !1));
    return _a
      .getAdapter(
        e.adapter || Lr.adapter,
        e,
      )(e)
      .then(
        function (t) {
          return (
            Ca(e),
            (t.data = Ir.call(e, e.transformResponse, t)),
            (t.headers = Ur.from(t.headers)),
            t
          );
        },
        function (t) {
          return (
            qr(t) ||
              (Ca(e),
              t &&
                t.response &&
                ((t.response.data = Ir.call(
                  e,
                  e.transformResponse,
                  t.response,
                )),
                (t.response.headers = Ur.from(t.response.headers)))),
            Promise.reject(t)
          );
        },
      );
  }
  const Oa = "1.13.2",
    Ra = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(
    (e, t) => {
      Ra[e] = function (n) {
        return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
      };
    },
  );
  const Ta = {};
  ((Ra.transitional = function (e, t, n) {
    function r(e, t) {
      return (
        "[Axios v" +
        Oa +
        "] Transitional option '" +
        e +
        "'" +
        t +
        (n ? ". " + n : "")
      );
    }
    return (n, a, i) => {
      if (!1 === e)
        throw new ir(
          r(a, " has been removed" + (t ? " in " + t : "")),
          ir.ERR_DEPRECATED,
        );
      return (
        t &&
          !Ta[a] &&
          ((Ta[a] = !0),
          console.warn(
            r(
              a,
              " has been deprecated since v" +
                t +
                " and will be removed in the near future",
            ),
          )),
        !e || e(n, a, i)
      );
    };
  }),
    (Ra.spelling = function (e) {
      return (t, n) => (
        console.warn("".concat(n, " is likely a misspelling of ").concat(e)),
        !0
      );
    }));
  const La = {
      assertOptions: function (e, t, n) {
        if ("object" !== typeof e)
          throw new ir("options must be an object", ir.ERR_BAD_OPTION_VALUE);
        const r = Object.keys(e);
        let a = r.length;
        for (; a-- > 0; ) {
          const i = r[a],
            o = t[i];
          if (o) {
            const t = e[i],
              n = void 0 === t || o(t, i, e);
            if (!0 !== n)
              throw new ir(
                "option " + i + " must be " + n,
                ir.ERR_BAD_OPTION_VALUE,
              );
            continue;
          }
          if (!0 !== n) throw new ir("Unknown option " + i, ir.ERR_BAD_OPTION);
        }
      },
      validators: Ra,
    },
    Aa = La.validators;
  class za {
    constructor(e) {
      ((this.defaults = e || {}),
        (this.interceptors = { request: new yr(), response: new yr() }));
    }
    async request(e, t) {
      try {
        return await this._request(e, t);
      } catch (Yi) {
        if (Yi instanceof Error) {
          let t = {};
          Error.captureStackTrace
            ? Error.captureStackTrace(t)
            : (t = new Error());
          const n = t.stack ? t.stack.replace(/^.+\n/, "") : "";
          try {
            Yi.stack
              ? n &&
                !String(Yi.stack).endsWith(n.replace(/^.+\n.+\n/, "")) &&
                (Yi.stack += "\n" + n)
              : (Yi.stack = n);
          } catch (Qi) {}
        }
        throw Yi;
      }
    }
    _request(e, t) {
      ("string" === typeof e ? ((t = t || {}).url = e) : (t = e || {}),
        (t = ta(this.defaults, t)));
      const { transitional: n, paramsSerializer: r, headers: a } = t;
      (void 0 !== n &&
        La.assertOptions(
          n,
          {
            silentJSONParsing: Aa.transitional(Aa.boolean),
            forcedJSONParsing: Aa.transitional(Aa.boolean),
            clarifyTimeoutError: Aa.transitional(Aa.boolean),
          },
          !1,
        ),
        null != r &&
          (tr.isFunction(r)
            ? (t.paramsSerializer = { serialize: r })
            : La.assertOptions(
                r,
                { encode: Aa.function, serialize: Aa.function },
                !0,
              )),
        void 0 !== t.allowAbsoluteUrls ||
          (void 0 !== this.defaults.allowAbsoluteUrls
            ? (t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
            : (t.allowAbsoluteUrls = !0)),
        La.assertOptions(
          t,
          {
            baseUrl: Aa.spelling("baseURL"),
            withXsrfToken: Aa.spelling("withXSRFToken"),
          },
          !0,
        ),
        (t.method = (t.method || this.defaults.method || "get").toLowerCase()));
      let i = a && tr.merge(a.common, a[t.method]);
      (a &&
        tr.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          (e) => {
            delete a[e];
          },
        ),
        (t.headers = Ur.concat(i, a)));
      const o = [];
      let s = !0;
      this.interceptors.request.forEach(function (e) {
        ("function" === typeof e.runWhen && !1 === e.runWhen(t)) ||
          ((s = s && e.synchronous), o.unshift(e.fulfilled, e.rejected));
      });
      const l = [];
      let c;
      this.interceptors.response.forEach(function (e) {
        l.push(e.fulfilled, e.rejected);
      });
      let u,
        d = 0;
      if (!s) {
        const e = [Pa.bind(this), void 0];
        for (
          e.unshift(...o), e.push(...l), u = e.length, c = Promise.resolve(t);
          d < u;
        )
          c = c.then(e[d++], e[d++]);
        return c;
      }
      u = o.length;
      let f = t;
      for (; d < u; ) {
        const e = o[d++],
          t = o[d++];
        try {
          f = e(f);
        } catch (h) {
          t.call(this, h);
          break;
        }
      }
      try {
        c = Pa.call(this, f);
      } catch (h) {
        return Promise.reject(h);
      }
      for (d = 0, u = l.length; d < u; ) c = c.then(l[d++], l[d++]);
      return c;
    }
    getUri(e) {
      return gr(
        Zr((e = ta(this.defaults, e)).baseURL, e.url, e.allowAbsoluteUrls),
        e.params,
        e.paramsSerializer,
      );
    }
  }
  (tr.forEach(["delete", "get", "head", "options"], function (e) {
    za.prototype[e] = function (t, n) {
      return this.request(
        ta(n || {}, { method: e, url: t, data: (n || {}).data }),
      );
    };
  }),
    tr.forEach(["post", "put", "patch"], function (e) {
      function t(t) {
        return function (n, r, a) {
          return this.request(
            ta(a || {}, {
              method: e,
              headers: t ? { "Content-Type": "multipart/form-data" } : {},
              url: n,
              data: r,
            }),
          );
        };
      }
      ((za.prototype[e] = t()), (za.prototype[e + "Form"] = t(!0)));
    }));
  const Fa = za;
  class Ma {
    constructor(e) {
      if ("function" !== typeof e)
        throw new TypeError("executor must be a function.");
      let t;
      this.promise = new Promise(function (e) {
        t = e;
      });
      const n = this;
      (this.promise.then((e) => {
        if (!n._listeners) return;
        let t = n._listeners.length;
        for (; t-- > 0; ) n._listeners[t](e);
        n._listeners = null;
      }),
        (this.promise.then = (e) => {
          let t;
          const r = new Promise((e) => {
            (n.subscribe(e), (t = e));
          }).then(e);
          return (
            (r.cancel = function () {
              n.unsubscribe(t);
            }),
            r
          );
        }),
        e(function (e, r, a) {
          n.reason || ((n.reason = new Hr(e, r, a)), t(n.reason));
        }));
    }
    throwIfRequested() {
      if (this.reason) throw this.reason;
    }
    subscribe(e) {
      this.reason
        ? e(this.reason)
        : this._listeners
          ? this._listeners.push(e)
          : (this._listeners = [e]);
    }
    unsubscribe(e) {
      if (!this._listeners) return;
      const t = this._listeners.indexOf(e);
      -1 !== t && this._listeners.splice(t, 1);
    }
    toAbortSignal() {
      const e = new AbortController(),
        t = (t) => {
          e.abort(t);
        };
      return (
        this.subscribe(t),
        (e.signal.unsubscribe = () => this.unsubscribe(t)),
        e.signal
      );
    }
    static source() {
      let e;
      return {
        token: new Ma(function (t) {
          e = t;
        }),
        cancel: e,
      };
    }
  }
  const Ba = Ma;
  const Da = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526,
  };
  Object.entries(Da).forEach((e) => {
    let [t, n] = e;
    Da[n] = t;
  });
  const Ua = Da;
  const Ia = (function e(t) {
    const n = new Fa(t),
      r = gn(Fa.prototype.request, n);
    return (
      tr.extend(r, Fa.prototype, n, { allOwnKeys: !0 }),
      tr.extend(r, n, null, { allOwnKeys: !0 }),
      (r.create = function (n) {
        return e(ta(t, n));
      }),
      r
    );
  })(Lr);
  ((Ia.Axios = Fa),
    (Ia.CanceledError = Hr),
    (Ia.CancelToken = Ba),
    (Ia.isCancel = qr),
    (Ia.VERSION = Oa),
    (Ia.toFormData = ur),
    (Ia.AxiosError = ir),
    (Ia.Cancel = Ia.CanceledError),
    (Ia.all = function (e) {
      return Promise.all(e);
    }),
    (Ia.spread = function (e) {
      return function (t) {
        return e.apply(null, t);
      };
    }),
    (Ia.isAxiosError = function (e) {
      return tr.isObject(e) && !0 === e.isAxiosError;
    }),
    (Ia.mergeConfig = ta),
    (Ia.AxiosHeaders = Ur),
    (Ia.formToJSON = (e) => Rr(tr.isHTMLForm(e) ? new FormData(e) : e)),
    (Ia.getAdapter = _a.getAdapter),
    (Ia.HttpStatusCode = Ua),
    (Ia.default = Ia));
  const qa = Ia.create({
    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
  });
  qa.interceptors.request.use(
    (e) => {
      const t = localStorage.getItem("token");
      return (t && (e.headers.Authorization = "Bearer ".concat(t)), e);
    },
    (e) => Promise.reject(e),
  );
  const Va = () => qa.get("/users/discover"),
    Ha = (e) => qa.post("/users/like/".concat(e)),
    Wa = (e) => qa.post("/users/pass/".concat(e)),
    $a = (e) => qa.put("/users/profile", e),
    Ka = () => qa.get("/users/matches"),
    Qa = (e) => qa.get("/users/profile/".concat(e)),
    Ya = () => qa.get("/users/likes-you"),
    Ja = (e) => qa.put("/users/notification-settings", e),
    Xa = () => qa.delete("/users/account"),
    Ga = (e) => qa.get("/messages/".concat(e)),
    Za = (e, t) => qa.post("/messages", { recipientId: e, content: t }),
    ei = (e) => qa.get("/messages/unread/count/".concat(e)),
    ti = qa;
  var ni = n(579);
  const ri = (0, o.createContext)(),
    ai = () => {
      const e = (0, o.useContext)(ri);
      if (!e) throw new Error("useAuth must be used within an AuthProvider");
      return e;
    },
    ii = (e) => {
      let { children: t } = e;
      const [n, r] = (0, o.useState)(null),
        [a, i] = (0, o.useState)(!0),
        [s, l] = (0, o.useState)(0),
        c = (0, o.useRef)(null),
        u = !!n;
      ((0, o.useEffect)(() => {
        localStorage.getItem("token") ? d() : i(!1);
      }, []),
        (0, o.useEffect)(() => {
          if (null === n || void 0 === n || !n.id) return;
          (async () => {
            try {
              const e = await ti.get("/messages/unread/count");
              (console.log("\ud83d\udcca Initial unread count:", e.data.count),
                l(e.data.count));
            } catch (e) {
              (console.error("Error loading initial unread count:", e), l(0));
            }
          })();
        }, [null === n || void 0 === n ? void 0 : n.id]),
        (0, o.useEffect)(() => {
          if (null === n || void 0 === n || !n.id) return;
          (c.current && (c.current.disconnect(), (c.current = null)),
            console.log("\ud83d\udd0c Connecting to socket..."));
          const e = mn("http://localhost:5000", { transports: ["websocket"] });
          return (
            (c.current = e),
            e.on("connect", () => {
              (console.log("\u2705 Socket connected!"),
                e.emit("user-online", n.id));
            }),
            e.on("new-message", () => {
              console.log("\ud83d\udce8 NEW MESSAGE EVENT RECEIVED!");
              const e = window.location.pathname.startsWith("/messages");
              (console.log("\ud83d\udccd On messages page?", e),
                e ||
                  (console.log("\u2795 Incrementing unread count"),
                  l(
                    (e) => (
                      console.log(
                        "Unread: ".concat(e, " \u2192 ").concat(e + 1),
                      ),
                      e + 1
                    ),
                  )));
            }),
            e.on("disconnect", () => {
              console.log("\ud83d\udd0c Socket disconnected");
            }),
            () => {
              (e.disconnect(), (c.current = null));
            }
          );
        }, [null === n || void 0 === n ? void 0 : n.id]));
      const d = async () => {
          try {
            const e = await ti.get("/auth/profile");
            r(e.data);
          } catch (e) {
            (console.error("Error fetching user:", e),
              localStorage.removeItem("token"),
              r(null));
          } finally {
            i(!1);
          }
        },
        f = {
          user: n,
          loading: a,
          isAuthenticated: u,
          signup: async (e) => {
            try {
              const t = await ti.post("/auth/signup", e);
              return t.data.token
                ? (localStorage.setItem("token", t.data.token),
                  r(t.data.user),
                  { success: !0 })
                : { success: !1, error: "Signup failed" };
            } catch (a) {
              var t, n;
              return {
                success: !1,
                error:
                  (null === (t = a.response) ||
                  void 0 === t ||
                  null === (n = t.data) ||
                  void 0 === n
                    ? void 0
                    : n.message) || "Signup failed",
              };
            }
          },
          login: async (e, t) => {
            try {
              const n = await ti.post("/auth/login", { email: e, password: t });
              return n.data.token
                ? (localStorage.setItem("token", n.data.token),
                  r(n.data.user),
                  { success: !0 })
                : { success: !1, error: "Login failed" };
            } catch (i) {
              var n, a;
              return {
                success: !1,
                error:
                  (null === (n = i.response) ||
                  void 0 === n ||
                  null === (a = n.data) ||
                  void 0 === a
                    ? void 0
                    : a.message) || "Login failed",
              };
            }
          },
          logout: () => {
            (localStorage.removeItem("token"),
              r(null),
              l(0),
              c.current && (c.current.disconnect(), (c.current = null)));
          },
          updateUser: (e) => {
            r(e);
          },
          fetchUser: d,
          unreadCount: s,
          incrementUnread: () => {
            (console.log("\u2795 Manual increment unread"), l((e) => e + 1));
          },
          clearUnread: () => {
            (console.log("\ud83e\uddf9 Clearing unread count"), l(0));
          },
          socket: c.current,
        };
      return (0, ni.jsx)(ri.Provider, { value: f, children: !a && t });
    };
  function oi(e, t) {
    if (null == e) return {};
    var n,
      r,
      a = (function (e, t) {
        if (null == e) return {};
        var n = {};
        for (var r in e)
          if ({}.hasOwnProperty.call(e, r)) {
            if (-1 !== t.indexOf(r)) continue;
            n[r] = e[r];
          }
        return n;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      for (r = 0; r < i.length; r++)
        ((n = i[r]),
          -1 === t.indexOf(n) &&
            {}.propertyIsEnumerable.call(e, n) &&
            (a[n] = e[n]));
    }
    return a;
  }
  var si = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const li = [
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "children",
  ];
  var ci = (e, t) => {
    const n = (0, o.forwardRef)((n, r) => {
      let {
          color: a = "currentColor",
          size: i = 24,
          strokeWidth: s = 2,
          absoluteStrokeWidth: l,
          children: c,
        } = n,
        u = oi(n, li);
      return (0, o.createElement)(
        "svg",
        Sr(
          Sr({ ref: r }, si),
          {},
          {
            width: i,
            height: i,
            stroke: a,
            strokeWidth: l ? (24 * Number(s)) / Number(i) : s,
            className: "lucide lucide-".concat(
              ((d = e), d.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()),
            ),
          },
          u,
        ),
        [
          ...t.map((e) => {
            let [t, n] = e;
            return (0, o.createElement)(t, n);
          }),
          ...((Array.isArray(c) ? c : [c]) || []),
        ],
      );
      var d;
    });
    return ((n.displayName = "".concat(e)), n);
  };
  const ui = ci("Users", [
      [
        "path",
        { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" },
      ],
      ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
      ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
      ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }],
    ]),
    di = ci("Home", [
      [
        "path",
        { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", key: "y5dka4" },
      ],
      ["polyline", { points: "9 22 9 12 15 12 15 22", key: "e2us08" }],
    ]),
    fi = ci("Search", [
      ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
      ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
    ]),
    hi = ci("Heart", [
      [
        "path",
        {
          d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
          key: "c3ymky",
        },
      ],
    ]),
    pi = ci("MessageCircle", [
      ["path", { d: "m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z", key: "v2veuj" }],
    ]),
    mi = ci("User", [
      [
        "path",
        { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" },
      ],
      ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
    ]),
    gi = ci("LogOut", [
      ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
      ["polyline", { points: "16 17 21 12 16 7", key: "1gabdz" }],
      ["line", { x1: "21", x2: "9", y1: "12", y2: "12", key: "1uyos4" }],
    ]),
    yi = () => {
      const e = ie(),
        { logout: t, unreadCount: n } = ai();
      return (0, ni.jsxs)("div", {
        className: "layout",
        children: [
          (0, ni.jsxs)("header", {
            className: "app-header",
            children: [
              (0, ni.jsxs)("div", {
                className: "logo",
                onClick: () => e("/"),
                style: { cursor: "pointer" },
                children: [
                  (0, ni.jsx)("div", {
                    className: "logo-icon",
                    children: (0, ni.jsx)(ui, { size: 20 }),
                  }),
                  (0, ni.jsx)("span", {
                    className: "logo-text",
                    children: "KindredPal",
                  }),
                ],
              }),
              (0, ni.jsxs)("nav", {
                className: "app-nav",
                children: [
                  (0, ni.jsxs)(Ue, {
                    to: "/",
                    className: "app-nav-link",
                    children: [
                      (0, ni.jsx)(di, { size: 20 }),
                      (0, ni.jsx)("span", { children: "Home" }),
                    ],
                  }),
                  (0, ni.jsxs)(Ue, {
                    to: "/discover",
                    className: "app-nav-link",
                    children: [
                      (0, ni.jsx)(fi, { size: 20 }),
                      (0, ni.jsx)("span", { children: "Discover" }),
                    ],
                  }),
                  (0, ni.jsxs)(Ue, {
                    to: "/likes-you",
                    className: "app-nav-link",
                    children: [
                      (0, ni.jsx)(hi, { size: 20 }),
                      (0, ni.jsx)("span", { children: "Likes You" }),
                    ],
                  }),
                  (0, ni.jsxs)(Ue, {
                    to: "/matches",
                    className: "app-nav-link",
                    children: [
                      (0, ni.jsx)(ui, { size: 20 }),
                      (0, ni.jsx)("span", { children: "Matches" }),
                    ],
                  }),
                  (0, ni.jsxs)(Ue, {
                    to: "/messages",
                    className: "app-nav-link",
                    children: [
                      (0, ni.jsxs)("div", {
                        className: "nav-icon-wrapper",
                        children: [
                          (0, ni.jsx)(pi, { size: 20 }),
                          n > 0 &&
                            (0, ni.jsx)("span", {
                              className: "unread-badge",
                              children: n,
                            }),
                        ],
                      }),
                      (0, ni.jsx)("span", { children: "Messages" }),
                    ],
                  }),
                  (0, ni.jsxs)(Ue, {
                    to: "/profile",
                    className: "app-nav-link",
                    children: [
                      (0, ni.jsx)(mi, { size: 20 }),
                      (0, ni.jsx)("span", { children: "Profile" }),
                    ],
                  }),
                  (0, ni.jsxs)("button", {
                    className: "app-nav-link logout-btn",
                    onClick: () => {
                      (t(), e("/"));
                    },
                    children: [
                      (0, ni.jsx)(gi, { size: 20 }),
                      (0, ni.jsx)("span", { children: "Logout" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, ni.jsx)("main", {
            className: "main-content",
            children: (0, ni.jsx)(Se, {}),
          }),
        ],
      });
    },
    vi = () =>
      (0, ni.jsxs)("div", {
        className: "landing-page",
        children: [
          (0, ni.jsxs)("header", {
            className: "landing-header",
            children: [
              (0, ni.jsxs)("div", {
                className: "landing-logo",
                children: [
                  (0, ni.jsx)("div", {
                    className: "landing-logo-icon",
                    children: (0, ni.jsx)(ui, { size: 24 }),
                  }),
                  (0, ni.jsx)("span", { children: "KindredPal" }),
                ],
              }),
              (0, ni.jsxs)("nav", {
                className: "landing-nav",
                children: [
                  (0, ni.jsx)(De, {
                    to: "/login",
                    className: "nav-btn",
                    children: "Log In",
                  }),
                  (0, ni.jsx)(De, {
                    to: "/signup",
                    className: "nav-btn primary",
                    children: "Sign Up",
                  }),
                ],
              }),
            ],
          }),
          (0, ni.jsxs)("section", {
            className: "landing-hero",
            children: [
              (0, ni.jsx)("h1", { children: "Find Your People" }),
              (0, ni.jsx)("p", {
                children:
                  "Connect with like-minded individuals who share your values, beliefs, and life stage in your local community.",
              }),
              (0, ni.jsxs)("div", {
                className: "hero-buttons",
                children: [
                  (0, ni.jsx)(De, {
                    to: "/signup",
                    className: "btn-get-started",
                    children: "Get Started",
                  }),
                  (0, ni.jsx)(De, {
                    to: "/login",
                    className: "btn-login",
                    children: "Log In",
                  }),
                ],
              }),
            ],
          }),
          (0, ni.jsx)("section", {
            className: "landing-features",
            children: (0, ni.jsxs)("div", {
              className: "features-container",
              children: [
                (0, ni.jsxs)("div", {
                  className: "feature-card",
                  children: [
                    (0, ni.jsx)("div", {
                      className: "feature-icon",
                      style: {
                        background: "linear-gradient(135deg, #4299E1, #2B6CB0)",
                      },
                      children: (0, ni.jsx)(hi, { size: 32 }),
                    }),
                    (0, ni.jsx)("h3", { children: "Value-Based Matching" }),
                    (0, ni.jsx)("p", {
                      children:
                        "Connect with people who share your core values around religion, politics, environment, and more.",
                    }),
                  ],
                }),
                (0, ni.jsxs)("div", {
                  className: "feature-card",
                  children: [
                    (0, ni.jsx)("div", {
                      className: "feature-icon",
                      style: {
                        background: "linear-gradient(135deg, #48BB78, #38A169)",
                      },
                      children: (0, ni.jsx)(ui, { size: 32 }),
                    }),
                    (0, ni.jsx)("h3", { children: "Life Stage Connection" }),
                    (0, ni.jsx)("p", {
                      children:
                        "Meet others in similar life stages\u2014whether single, married, retired, or a student.",
                    }),
                  ],
                }),
                (0, ni.jsxs)("div", {
                  className: "feature-card",
                  children: [
                    (0, ni.jsx)("div", {
                      className: "feature-icon",
                      style: {
                        background: "linear-gradient(135deg, #9F7AEA, #7C3AED)",
                      },
                      children: (0, ni.jsx)(pi, { size: 32 }),
                    }),
                    (0, ni.jsx)("h3", { children: "Meaningful Conversations" }),
                    (0, ni.jsx)("p", {
                      children:
                        "Build genuine connections through thoughtful matches and authentic conversations.",
                    }),
                  ],
                }),
                (0, ni.jsxs)("div", {
                  className: "feature-card",
                  children: [
                    (0, ni.jsx)("div", {
                      className: "feature-icon",
                      style: {
                        background: "linear-gradient(135deg, #F59E0B, #D97706)",
                      },
                      children: (0, ni.jsx)(fi, { size: 32 }),
                    }),
                    (0, ni.jsx)("h3", { children: "Local Community" }),
                    (0, ni.jsx)("p", {
                      children:
                        "Discover people in your city or state who you'd actually want to meet in person.",
                    }),
                  ],
                }),
              ],
            }),
          }),
          (0, ni.jsxs)("section", {
            className: "landing-cta",
            children: [
              (0, ni.jsx)("h2", { children: "Ready to Find Your Circle?" }),
              (0, ni.jsx)("p", {
                children:
                  "Join thousands of people making meaningful connections based on what truly matters.",
              }),
              (0, ni.jsx)(De, {
                to: "/signup",
                className: "btn-cta",
                children: "Create Your Account",
              }),
            ],
          }),
          (0, ni.jsx)("footer", {
            className: "landing-footer",
            children: (0, ni.jsxs)("div", {
              className: "footer-content",
              children: [
                (0, ni.jsxs)("div", {
                  className: "footer-logo",
                  children: [
                    (0, ni.jsx)(ui, { size: 20 }),
                    (0, ni.jsx)("span", { children: "KindredPal" }),
                  ],
                }),
                (0, ni.jsx)("p", {
                  children: "\xa9 2026 KindredPal. Find your people.",
                }),
              ],
            }),
          }),
        ],
      }),
    bi = () => {
      const e = ie(),
        { login: t } = ai(),
        [n, r] = (0, o.useState)({ email: "", password: "" }),
        [a, i] = (0, o.useState)(""),
        [s, l] = (0, o.useState)(!1),
        c = (e) => {
          r(Sr(Sr({}, n), {}, { [e.target.name]: e.target.value }));
        };
      return (0, ni.jsx)("div", {
        className: "auth-page",
        children: (0, ni.jsx)("div", {
          className: "auth-container",
          children: (0, ni.jsxs)("div", {
            className: "auth-card",
            children: [
              (0, ni.jsx)("h2", { children: "Welcome Back" }),
              (0, ni.jsx)("p", {
                className: "auth-subtitle",
                children: "Log in to continue your journey",
              }),
              a &&
                (0, ni.jsx)("div", { className: "error-message", children: a }),
              (0, ni.jsxs)("form", {
                onSubmit: async (r) => {
                  (r.preventDefault(),
                    i(""),
                    l(!0),
                    console.log(
                      "\ud83d\udd0d Frontend: Attempting login with:",
                      n.email,
                    ));
                  const a = await t(n.email, n.password);
                  (console.log("\ud83d\udd0d Frontend: Login result:", a),
                    a.success
                      ? (console.log(
                          "\u2705 Frontend: Login successful, navigating to /discover",
                        ),
                        e("/discover"))
                      : (console.log("\u274c Frontend: Login failed:", a.error),
                        i(a.error)),
                    l(!1));
                },
                children: [
                  (0, ni.jsxs)("div", {
                    className: "form-group",
                    children: [
                      (0, ni.jsx)("label", {
                        className: "form-label",
                        children: "Email",
                      }),
                      (0, ni.jsx)("input", {
                        type: "email",
                        name: "email",
                        className: "form-input",
                        value: n.email,
                        onChange: c,
                        required: !0,
                      }),
                    ],
                  }),
                  (0, ni.jsxs)("div", {
                    className: "form-group",
                    children: [
                      (0, ni.jsx)("label", {
                        className: "form-label",
                        children: "Password",
                      }),
                      (0, ni.jsx)("input", {
                        type: "password",
                        name: "password",
                        className: "form-input",
                        value: n.password,
                        onChange: c,
                        required: !0,
                      }),
                    ],
                  }),
                  (0, ni.jsx)("button", {
                    type: "submit",
                    className: "btn btn-primary btn-full",
                    disabled: s,
                    children: s ? "Logging in..." : "Log In",
                  }),
                ],
              }),
              (0, ni.jsxs)("p", {
                className: "auth-link",
                children: [
                  "Don't have an account? ",
                  (0, ni.jsx)(De, { to: "/signup", children: "Sign up" }),
                ],
              }),
              (0, ni.jsx)("p", {
                className: "auth-link",
                children: (0, ni.jsx)(De, {
                  to: "/",
                  children: "\u2190 Back to home",
                }),
              }),
            ],
          }),
        }),
      });
    },
    xi = ci("Check", [
      ["polyline", { points: "20 6 9 17 4 12", key: "10jjfj" }],
    ]),
    wi = ci("X", [
      ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
      ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
    ]),
    ki = ci("Upload", [
      [
        "path",
        { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" },
      ],
      ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
      ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }],
    ]),
    Si = (e) => {
      let {
        photos: t = [],
        onPhotosChange: n,
        maxPhotos: r = 3,
        profilePhotoIndex: a = 0,
      } = e;
      const [i, s] = (0, o.useState)([]),
        [l, c] = (0, o.useState)(a);
      (0, o.useEffect)(() => {
        (s([...t]), c(a));
      }, [t, a]);
      return (0, ni.jsxs)("div", {
        className: "photo-upload-container",
        children: [
          (0, ni.jsxs)("div", {
            className: "photo-grid",
            children: [
              i.map((e, t) =>
                (0, ni.jsxs)(
                  "div",
                  {
                    className: "photo-item",
                    children: [
                      (0, ni.jsx)(
                        "img",
                        {
                          src: e,
                          alt: "Photo ".concat(t + 1),
                          className: "photo-preview",
                        },
                        e.substring(0, 50),
                      ),
                      t === l &&
                        (0, ni.jsxs)("div", {
                          className: "profile-badge",
                          children: [
                            (0, ni.jsx)(xi, { size: 16 }),
                            "Profile Photo",
                          ],
                        }),
                      (0, ni.jsxs)("div", {
                        className: "photo-actions",
                        children: [
                          t !== l &&
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn-set-profile",
                              onClick: () =>
                                ((e) => {
                                  (c(e), n(i, e));
                                })(t),
                              title: "Set as profile photo",
                              children: "Set as Profile",
                            }),
                          (0, ni.jsx)("button", {
                            type: "button",
                            className: "btn-remove",
                            onClick: () =>
                              ((e) => {
                                s((t) => {
                                  const r = t.filter((t, n) => n !== e);
                                  let a = l;
                                  return (
                                    e === l ? (a = 0) : e < l && (a = l - 1),
                                    c(a),
                                    n(r, a),
                                    r
                                  );
                                });
                              })(t),
                            title: "Remove photo",
                            children: (0, ni.jsx)(wi, { size: 18 }),
                          }),
                        ],
                      }),
                    ],
                  },
                  "photo-".concat(t, "-").concat(e.substring(0, 30)),
                ),
              ),
              i.length < r &&
                (0, ni.jsxs)(
                  "label",
                  {
                    className: "photo-upload-box",
                    children: [
                      (0, ni.jsx)(
                        "input",
                        {
                          type: "file",
                          accept: "image/*",
                          multiple: !0,
                          onChange: (e) => {
                            const t = Array.from(e.target.files);
                            if (i.length + t.length > r)
                              return (
                                alert(
                                  "You can only upload ".concat(r, " photos"),
                                ),
                                void (e.target.value = "")
                              );
                            (t.forEach((t) => {
                              if (t.size > 5242880)
                                return (
                                  alert("File size must be less than 5MB"),
                                  void (e.target.value = "")
                                );
                              const r = new FileReader();
                              ((r.onloadend = () => {
                                s((e) => {
                                  const t = [...e, r.result];
                                  return (n(t, l), t);
                                });
                              }),
                                r.readAsDataURL(t));
                            }),
                              (e.target.value = ""));
                          },
                          className: "file-input-hidden",
                        },
                        "file-input-".concat(i.length),
                      ),
                      (0, ni.jsx)(ki, { size: 32 }),
                      (0, ni.jsx)("span", { children: "Add Photo" }),
                      (0, ni.jsxs)("small", { children: [i.length, "/", r] }),
                    ],
                  },
                  "upload-".concat(i.length),
                ),
            ],
          }),
          0 === i.length &&
            (0, ni.jsxs)("p", {
              className: "upload-hint",
              children: [
                "\ud83d\udcf8 Upload at least one photo to continue. You can add up to",
                " ",
                r,
                " photos.",
              ],
            }),
          i.length > 0 &&
            (0, ni.jsxs)("p", {
              className: "upload-hint",
              children: [
                "\u2705 Photo ",
                l + 1,
                " is set as your profile picture",
              ],
            }),
        ],
      });
    },
    ji = ["confirmPassword"],
    Ni = () => {
      const e = ie(),
        { signup: t } = ai(),
        [n, r] = (0, o.useState)(1),
        [a, i] = (0, o.useState)(""),
        [s, l] = (0, o.useState)(!1),
        [c, u] = (0, o.useState)([]),
        [d, f] = (0, o.useState)(0),
        [h, p] = (0, o.useState)({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          age: "",
          gender: "",
          city: "",
          state: "",
          bio: "",
          politicalBeliefs: [],
          religion: "",
          causes: [],
          lifeStage: [],
          lookingFor: [],
        }),
        m = (e) => {
          const { name: t, value: n } = e.target;
          p((e) => Sr(Sr({}, e), {}, { [t]: n }));
        },
        g = (e, t) => {
          p((n) => {
            const r = n[e];
            return r.includes(t)
              ? Sr(Sr({}, n), {}, { [e]: r.filter((e) => e !== t) })
              : Sr(Sr({}, n), {}, { [e]: [...r, t] });
          });
        },
        y = () => {
          i("");
          let e = !1;
          switch (n) {
            case 1:
              e =
                h.password !== h.confirmPassword
                  ? (i("Passwords do not match"), !1)
                  : !(h.password.length < 6) ||
                    (i("Password must be at least 6 characters"), !1);
              break;
            case 2:
              e =
                h.name && h.age && h.gender && h.city && h.state && h.bio
                  ? !(h.age < 18) ||
                    (i("You must be at least 18 years old"), !1)
                  : (i("Please fill in all required fields"), !1);
              break;
            case 3:
              e =
                0 === h.lifeStage.length
                  ? (i(
                      "Please select at least one life stage - this is very important for matching!",
                    ),
                    !1)
                  : 0 !== h.lookingFor.length ||
                    (i("Please select what you're looking for"), !1);
              break;
            case 4:
              e =
                0 === h.politicalBeliefs.length
                  ? (i("Please select at least one political belief"), !1)
                  : h.religion
                    ? !(h.causes.length < 3) ||
                      (i(
                        "Please select at least 3 causes to help us find better matches",
                      ),
                      !1)
                    : (i("Please select your religious/spiritual beliefs"), !1);
              break;
            default:
              e = !0;
          }
          e && r(n + 1);
        };
      return (0, ni.jsx)("div", {
        className: "auth-page",
        children: (0, ni.jsx)("div", {
          className: "auth-container",
          children: (0, ni.jsxs)("div", {
            className: "auth-card signup-card",
            children: [
              (0, ni.jsx)("h2", { children: "Join KindredPal" }),
              (0, ni.jsx)("p", {
                className: "auth-subtitle",
                children: "Find your people based on what matters most",
              }),
              (0, ni.jsx)("div", {
                className: "progress-bar",
                children: (0, ni.jsx)("div", {
                  className: "progress-fill",
                  style: { width: "".concat((n / 5) * 100, "%") },
                }),
              }),
              (0, ni.jsxs)("p", {
                className: "step-indicator",
                children: ["Step ", n, " of 5"],
              }),
              a &&
                (0, ni.jsx)("div", { className: "error-message", children: a }),
              (0, ni.jsxs)("form", {
                onSubmit: async (n) => {
                  var r, a;
                  if (
                    (n.preventDefault(),
                    i(""),
                    0 === c.length &&
                      (i("Please upload at least one photo"), 1))
                  )
                    return;
                  l(!0);
                  const { confirmPassword: o } = h,
                    s = oi(h, ji);
                  ((s.profilePhoto = c[d]),
                    (s.additionalPhotos = c.filter((e, t) => t !== d)),
                    console.log(
                      "\ud83c\udfaf FRONTEND - Sending signup with photos",
                    ),
                    console.log(
                      "Profile photo length:",
                      (null === (r = s.profilePhoto) || void 0 === r
                        ? void 0
                        : r.length) || 0,
                    ),
                    console.log(
                      "Additional photos:",
                      (null === (a = s.additionalPhotos) || void 0 === a
                        ? void 0
                        : a.length) || 0,
                    ));
                  const u = await t(s);
                  u.success ? e("/discover") : (i(u.error), l(!1));
                },
                children: [
                  1 === n &&
                    (0, ni.jsxs)("div", {
                      className: "form-step",
                      children: [
                        (0, ni.jsx)("h3", { children: "Create Account" }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Email",
                            }),
                            (0, ni.jsx)("input", {
                              type: "email",
                              name: "email",
                              className: "form-input",
                              value: h.email,
                              onChange: m,
                              required: !0,
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Password",
                            }),
                            (0, ni.jsx)("input", {
                              type: "password",
                              name: "password",
                              className: "form-input",
                              value: h.password,
                              onChange: m,
                              required: !0,
                              minLength: 6,
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Confirm Password",
                            }),
                            (0, ni.jsx)("input", {
                              type: "password",
                              name: "confirmPassword",
                              className: "form-input",
                              value: h.confirmPassword,
                              onChange: m,
                              required: !0,
                            }),
                          ],
                        }),
                        (0, ni.jsx)("button", {
                          type: "button",
                          className: "btn btn-primary btn-full",
                          onClick: y,
                          children: "Next",
                        }),
                      ],
                    }),
                  2 === n &&
                    (0, ni.jsxs)("div", {
                      className: "form-step",
                      children: [
                        (0, ni.jsx)("h3", { children: "About You" }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Full Name",
                            }),
                            (0, ni.jsx)("input", {
                              type: "text",
                              name: "name",
                              className: "form-input",
                              value: h.name,
                              onChange: m,
                              required: !0,
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-row",
                          children: [
                            (0, ni.jsxs)("div", {
                              className: "form-group",
                              children: [
                                (0, ni.jsx)("label", {
                                  className: "form-label",
                                  children: "Age",
                                }),
                                (0, ni.jsx)("input", {
                                  type: "number",
                                  name: "age",
                                  className: "form-input",
                                  value: h.age,
                                  onChange: m,
                                  min: "18",
                                  required: !0,
                                }),
                              ],
                            }),
                            (0, ni.jsxs)("div", {
                              className: "form-group",
                              children: [
                                (0, ni.jsx)("label", {
                                  className: "form-label",
                                  children: "Gender",
                                }),
                                (0, ni.jsxs)("select", {
                                  name: "gender",
                                  className: "form-select",
                                  value: h.gender,
                                  onChange: m,
                                  required: !0,
                                  children: [
                                    (0, ni.jsx)("option", {
                                      value: "",
                                      children: "Select",
                                    }),
                                    (0, ni.jsx)("option", {
                                      value: "Male",
                                      children: "Male",
                                    }),
                                    (0, ni.jsx)("option", {
                                      value: "Female",
                                      children: "Female",
                                    }),
                                    (0, ni.jsx)("option", {
                                      value: "Non-binary",
                                      children: "Non-binary",
                                    }),
                                    (0, ni.jsx)("option", {
                                      value: "Other",
                                      children: "Other",
                                    }),
                                    (0, ni.jsx)("option", {
                                      value: "Prefer not to say",
                                      children: "Prefer not to say",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-row",
                          children: [
                            (0, ni.jsxs)("div", {
                              className: "form-group",
                              children: [
                                (0, ni.jsx)("label", {
                                  className: "form-label",
                                  children: "City",
                                }),
                                (0, ni.jsx)("input", {
                                  type: "text",
                                  name: "city",
                                  className: "form-input",
                                  value: h.city,
                                  onChange: m,
                                  required: !0,
                                }),
                              ],
                            }),
                            (0, ni.jsxs)("div", {
                              className: "form-group",
                              children: [
                                (0, ni.jsx)("label", {
                                  className: "form-label",
                                  children: "State",
                                }),
                                (0, ni.jsx)("input", {
                                  type: "text",
                                  name: "state",
                                  className: "form-input",
                                  value: h.state,
                                  onChange: m,
                                  maxLength: 2,
                                  placeholder: "e.g., OR",
                                  required: !0,
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Bio",
                            }),
                            (0, ni.jsx)("textarea", {
                              name: "bio",
                              className: "form-textarea",
                              value: h.bio,
                              onChange: m,
                              maxLength: 500,
                              placeholder: "Tell us about yourself...",
                              required: !0,
                            }),
                            (0, ni.jsxs)("small", {
                              children: [h.bio.length, "/500 characters"],
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "button-group",
                          children: [
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn btn-secondary",
                              onClick: () => r(1),
                              children: "Back",
                            }),
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn btn-primary",
                              onClick: y,
                              children: "Next",
                            }),
                          ],
                        }),
                      ],
                    }),
                  3 === n &&
                    (0, ni.jsxs)("div", {
                      className: "form-step",
                      children: [
                        (0, ni.jsx)("h3", { children: "Life Stage & Goals" }),
                        (0, ni.jsx)("p", {
                          className: "form-help",
                          children:
                            "\u2b50 This is the MOST important for matching! Select all that apply.",
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Life Stage (select all that apply) *",
                            }),
                            (0, ni.jsx)("div", {
                              className: "checkbox-grid",
                              children: [
                                "Single",
                                "Married",
                                "Divorced",
                                "Widowed",
                                "In a relationship",
                                "Have children",
                                "Child-free by choice",
                                "Want children someday",
                                "Don't want children",
                                "Empty nester",
                                "College student",
                                "Grad student",
                                "Working professional",
                                "Entrepreneur",
                                "Retired",
                                "Semi-retired",
                                "Career change",
                                "Stay-at-home parent",
                              ].map((e) =>
                                (0, ni.jsxs)(
                                  "label",
                                  {
                                    className: "checkbox-card ".concat(
                                      h.lifeStage.includes(e) ? "selected" : "",
                                    ),
                                    children: [
                                      (0, ni.jsx)("input", {
                                        type: "checkbox",
                                        checked: h.lifeStage.includes(e),
                                        onChange: () => g("lifeStage", e),
                                      }),
                                      (0, ni.jsx)("span", { children: e }),
                                    ],
                                  },
                                  e,
                                ),
                              ),
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Looking For",
                            }),
                            (0, ni.jsx)("div", {
                              className: "checkbox-grid",
                              children: [
                                "Friendship",
                                "Romance",
                                "Networking",
                                "Activity Partner",
                                "Mentor",
                                "Community",
                              ].map((e) =>
                                (0, ni.jsxs)(
                                  "label",
                                  {
                                    className: "checkbox-card ".concat(
                                      h.lookingFor.includes(e)
                                        ? "selected"
                                        : "",
                                    ),
                                    children: [
                                      (0, ni.jsx)("input", {
                                        type: "checkbox",
                                        checked: h.lookingFor.includes(e),
                                        onChange: () => g("lookingFor", e),
                                      }),
                                      (0, ni.jsx)("span", { children: e }),
                                    ],
                                  },
                                  e,
                                ),
                              ),
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "button-group",
                          children: [
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn btn-secondary",
                              onClick: () => r(2),
                              children: "Back",
                            }),
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn btn-primary",
                              onClick: y,
                              children: "Next",
                            }),
                          ],
                        }),
                      ],
                    }),
                  4 === n &&
                    (0, ni.jsxs)("div", {
                      className: "form-step",
                      children: [
                        (0, ni.jsx)("h3", {
                          children: "Your Values & Interests",
                        }),
                        (0, ni.jsx)("p", {
                          className: "form-help",
                          children:
                            "Help us find people who share your beliefs and passions",
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children:
                                "Political Beliefs (select at least 1) *",
                            }),
                            (0, ni.jsx)("div", {
                              className: "checkbox-grid",
                              children: [
                                "Liberal",
                                "Conservative",
                                "Republican",
                                "Democrat",
                                "Libertarian",
                                "Moderate",
                                "Progressive",
                                "Independent",
                                "Apolitical",
                              ].map((e) =>
                                (0, ni.jsxs)(
                                  "label",
                                  {
                                    className: "checkbox-card ".concat(
                                      h.politicalBeliefs.includes(e)
                                        ? "selected"
                                        : "",
                                    ),
                                    children: [
                                      (0, ni.jsx)("input", {
                                        type: "checkbox",
                                        checked: h.politicalBeliefs.includes(e),
                                        onChange: () =>
                                          g("politicalBeliefs", e),
                                      }),
                                      (0, ni.jsx)("span", { children: e }),
                                    ],
                                  },
                                  e,
                                ),
                              ),
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children: "Religion/Spirituality *",
                            }),
                            (0, ni.jsxs)("select", {
                              name: "religion",
                              className: "form-select",
                              value: h.religion,
                              onChange: m,
                              required: !0,
                              children: [
                                (0, ni.jsx)("option", {
                                  value: "",
                                  children: "Select...",
                                }),
                                [
                                  "Christian",
                                  "Catholic",
                                  "Protestant",
                                  "Muslim",
                                  "Jewish",
                                  "Hindu",
                                  "Buddhist",
                                  "Sikh",
                                  "Spiritual but not religious",
                                  "Agnostic",
                                  "Atheist",
                                  "Other",
                                  "Prefer not to say",
                                ].map((e) =>
                                  (0, ni.jsx)(
                                    "option",
                                    { value: e, children: e },
                                    e,
                                  ),
                                ),
                              ],
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "form-group",
                          children: [
                            (0, ni.jsx)("label", {
                              className: "form-label",
                              children:
                                "Causes You Care About (select at least 3) *",
                            }),
                            (0, ni.jsx)("div", {
                              className: "checkbox-grid",
                              children: [
                                "Environment & Climate",
                                "Animal Welfare",
                                "Health & Wellness",
                                "Fitness & Active Living",
                                "Arts & Culture",
                                "Education & Continuous Learning",
                                "Social Justice",
                                "Community Service",
                                "Mental Health",
                                "LGBTQ+ Rights",
                                "Women's Rights",
                                "Racial Equality",
                                "Economic Justice",
                                "Technology & Innovation",
                                "Entrepreneurship",
                                "Spirituality",
                                "Family & Parenting",
                                "Sustainability",
                                "Food & Nutrition",
                                "Travel & Adventure",
                              ].map((e) =>
                                (0, ni.jsxs)(
                                  "label",
                                  {
                                    className: "checkbox-card ".concat(
                                      h.causes.includes(e) ? "selected" : "",
                                    ),
                                    children: [
                                      (0, ni.jsx)("input", {
                                        type: "checkbox",
                                        checked: h.causes.includes(e),
                                        onChange: () => g("causes", e),
                                      }),
                                      (0, ni.jsx)("span", { children: e }),
                                    ],
                                  },
                                  e,
                                ),
                              ),
                            }),
                            (0, ni.jsxs)("small", {
                              children: [
                                h.causes.length,
                                " selected (minimum 3)",
                              ],
                            }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "button-group",
                          children: [
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn btn-secondary",
                              onClick: () => r(3),
                              children: "Back",
                            }),
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn btn-primary",
                              onClick: y,
                              children: "Next",
                            }),
                          ],
                        }),
                      ],
                    }),
                  5 === n &&
                    (0, ni.jsxs)("div", {
                      className: "form-step",
                      children: [
                        (0, ni.jsx)("h3", { children: "Add Your Photos" }),
                        (0, ni.jsx)("p", {
                          className: "form-help",
                          children:
                            "\ud83d\udcf8 Upload 1-3 photos. Select which one will be your main profile picture.",
                        }),
                        (0, ni.jsx)(Si, {
                          photos: c,
                          onPhotosChange: (e, t) => {
                            (u(e), f(t));
                          },
                          maxPhotos: 3,
                          profilePhotoIndex: d,
                        }),
                        (0, ni.jsxs)("div", {
                          className: "button-group",
                          children: [
                            (0, ni.jsx)("button", {
                              type: "button",
                              className: "btn btn-secondary",
                              onClick: () => r(4),
                              children: "Back",
                            }),
                            (0, ni.jsx)("button", {
                              type: "submit",
                              className: "btn btn-primary",
                              disabled: s || 0 === c.length,
                              children: s
                                ? "Creating Account..."
                                : "Create Account",
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
              (0, ni.jsxs)("p", {
                className: "auth-link",
                children: [
                  "Already have an account? ",
                  (0, ni.jsx)(De, { to: "/login", children: "Log in" }),
                ],
              }),
            ],
          }),
        }),
      });
    },
    Ei = ci("ChevronLeft", [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]]),
    _i = ci("ChevronRight", [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]),
    Ci = ci("MapPin", [
      [
        "path",
        { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", key: "2oe9fu" },
      ],
      ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
    ]),
    Pi = ci("Briefcase", [
      [
        "rect",
        {
          width: "20",
          height: "14",
          x: "2",
          y: "7",
          rx: "2",
          ry: "2",
          key: "eto64e",
        },
      ],
      [
        "path",
        { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "zwj3tp" },
      ],
    ]),
    Oi = () => {
      const { user: e } = ai(),
        [t, n] = (0, o.useState)([]),
        [r, a] = (0, o.useState)(0),
        [i, s] = (0, o.useState)(0),
        [l, c] = (0, o.useState)(10),
        [u, d] = (0, o.useState)(!0),
        [f, h] = (0, o.useState)(null);
      (0, o.useEffect)(() => {
        p();
      }, []);
      const p = async () => {
          try {
            const e = await Va();
            (n(e.data.users), c(e.data.dailyLikesRemaining));
          } catch (e) {
            console.error("Error loading profiles:", e);
          } finally {
            d(!1);
          }
        },
        m = () => {
          (a((e) => e + 1), s(0));
        },
        g = t[r],
        y = g
          ? [g.profilePhoto, ...(g.additionalPhotos || [])].filter(Boolean)
          : [];
      return u
        ? (0, ni.jsx)("div", {
            className: "discover-page",
            children: (0, ni.jsxs)("div", {
              className: "loading-spinner",
              children: [
                (0, ni.jsx)("div", { className: "spinner" }),
                (0, ni.jsx)("p", {
                  children: "Finding your perfect matches...",
                }),
              ],
            }),
          })
        : g
          ? (0, ni.jsxs)("div", {
              className: "discover-page",
              children: [
                (0, ni.jsxs)("div", {
                  className: "discover-header",
                  children: [
                    (0, ni.jsxs)("div", {
                      children: [
                        (0, ni.jsx)("h1", { children: "Discover Your People" }),
                        (0, ni.jsx)("p", {
                          className: "subtitle",
                          children: "Find connections based on shared values",
                        }),
                      ],
                    }),
                    (0, ni.jsxs)("div", {
                      className: "likes-badge",
                      children: [
                        (0, ni.jsx)(hi, { size: 18, fill: "#fff" }),
                        (0, ni.jsxs)("span", {
                          children: [l, " likes left today"],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, ni.jsxs)("div", {
                  className: "discover-card-wrapper",
                  children: [
                    (0, ni.jsxs)("div", {
                      className: "discover-card",
                      children: [
                        (0, ni.jsxs)("div", {
                          className: "card-image-section",
                          children: [
                            (0, ni.jsx)(
                              "img",
                              {
                                src: y[i],
                                alt: g.name,
                                className: "card-image",
                              },
                              i,
                            ),
                            (0, ni.jsxs)("div", {
                              className: "match-badge",
                              children: [g.matchScore, "% Match"],
                            }),
                            y.length > 1 &&
                              (0, ni.jsxs)(ni.Fragment, {
                                children: [
                                  i > 0 &&
                                    (0, ni.jsx)("button", {
                                      className: "photo-nav photo-nav-prev",
                                      onClick: () => {
                                        i > 0 && s((e) => e - 1);
                                      },
                                      "aria-label": "Previous photo",
                                      children: (0, ni.jsx)(Ei, { size: 32 }),
                                    }),
                                  i < y.length - 1 &&
                                    (0, ni.jsx)("button", {
                                      className: "photo-nav photo-nav-next",
                                      onClick: () => {
                                        i < y.length - 1 && s((e) => e + 1);
                                      },
                                      "aria-label": "Next photo",
                                      children: (0, ni.jsx)(_i, { size: 32 }),
                                    }),
                                  (0, ni.jsx)("div", {
                                    className: "photo-indicators",
                                    children: y.map((e, t) =>
                                      (0, ni.jsx)(
                                        "button",
                                        {
                                          className: "photo-dot ".concat(
                                            t === i ? "active" : "",
                                          ),
                                          onClick: () => s(t),
                                          "aria-label": "Go to photo ".concat(
                                            t + 1,
                                          ),
                                        },
                                        t,
                                      ),
                                    ),
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "photo-counter",
                                    children: [i + 1, " / ", y.length],
                                  }),
                                ],
                              }),
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "card-content",
                          children: [
                            (0, ni.jsx)("div", {
                              className: "profile-header",
                              children: (0, ni.jsxs)("div", {
                                children: [
                                  (0, ni.jsxs)("h2", {
                                    className: "profile-name",
                                    children: [g.name, ", ", g.age],
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "profile-meta",
                                    children: [
                                      (0, ni.jsx)(Ci, { size: 16 }),
                                      (0, ni.jsxs)("span", {
                                        children: [g.city, ", ", g.state],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            (0, ni.jsx)("p", {
                              className: "profile-bio",
                              children: g.bio,
                            }),
                            g.lifeStage &&
                              g.lifeStage.length > 0 &&
                              (0, ni.jsxs)("div", {
                                className: "info-section",
                                children: [
                                  (0, ni.jsxs)("h4", {
                                    className: "section-title",
                                    children: [
                                      (0, ni.jsx)(Pi, { size: 16 }),
                                      "Life Stage",
                                    ],
                                  }),
                                  (0, ni.jsx)("div", {
                                    className: "tags-container",
                                    children: g.lifeStage.map((e) =>
                                      (0, ni.jsx)(
                                        "span",
                                        {
                                          className: "tag tag-primary",
                                          children: e,
                                        },
                                        e,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            g.lookingFor &&
                              g.lookingFor.length > 0 &&
                              (0, ni.jsxs)("div", {
                                className: "info-section",
                                children: [
                                  (0, ni.jsx)("h4", {
                                    className: "section-title",
                                    children: "\ud83d\udcab Looking For",
                                  }),
                                  (0, ni.jsx)("div", {
                                    className: "tags-container",
                                    children: g.lookingFor.map((e) =>
                                      (0, ni.jsx)(
                                        "span",
                                        {
                                          className: "tag tag-secondary",
                                          children: e,
                                        },
                                        e,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            (0, ni.jsxs)("div", {
                              className: "info-section",
                              children: [
                                (0, ni.jsx)("h4", {
                                  className: "section-title",
                                  children: "\ud83c\udfaf Values & Beliefs",
                                }),
                                (0, ni.jsxs)("div", {
                                  className: "values-grid",
                                  children: [
                                    g.religion &&
                                      (0, ni.jsxs)("div", {
                                        className: "value-card",
                                        children: [
                                          (0, ni.jsx)("span", {
                                            className: "value-label",
                                            children: "Religion",
                                          }),
                                          (0, ni.jsx)("span", {
                                            className: "value-text",
                                            children: g.religion,
                                          }),
                                        ],
                                      }),
                                    g.politicalBeliefs &&
                                      g.politicalBeliefs.length > 0 &&
                                      (0, ni.jsxs)("div", {
                                        className: "value-card",
                                        children: [
                                          (0, ni.jsx)("span", {
                                            className: "value-label",
                                            children: "Politics",
                                          }),
                                          (0, ni.jsx)("span", {
                                            className: "value-text",
                                            children:
                                              g.politicalBeliefs.join(", "),
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                            g.causes &&
                              g.causes.length > 0 &&
                              (0, ni.jsxs)("div", {
                                className: "info-section",
                                children: [
                                  (0, ni.jsx)("h4", {
                                    className: "section-title",
                                    children: "\u2764\ufe0f Passionate About",
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "tags-container",
                                    children: [
                                      g.causes
                                        .slice(0, 6)
                                        .map((e) =>
                                          (0, ni.jsx)(
                                            "span",
                                            {
                                              className: "tag tag-accent",
                                              children: e,
                                            },
                                            e,
                                          ),
                                        ),
                                      g.causes.length > 6 &&
                                        (0, ni.jsxs)("span", {
                                          className: "tag tag-accent",
                                          children: [
                                            "+",
                                            g.causes.length - 6,
                                            " more",
                                          ],
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    }),
                    (0, ni.jsxs)("div", {
                      className: "action-buttons-container",
                      children: [
                        (0, ni.jsxs)("button", {
                          className: "action-button pass-button",
                          onClick: async () => {
                            if (g)
                              try {
                                (await Wa(g._id), m());
                              } catch (e) {
                                console.error("Error passing user:", e);
                              }
                          },
                          title: "Pass",
                          children: [
                            (0, ni.jsx)(wi, { size: 28 }),
                            (0, ni.jsx)("span", { children: "Pass" }),
                          ],
                        }),
                        (0, ni.jsxs)("button", {
                          className: "action-button like-button",
                          onClick: async () => {
                            if (!(l <= 0) && g)
                              try {
                                const e = await Ha(g._id);
                                (c(e.data.dailyLikesRemaining),
                                  e.data.isMatch &&
                                    (h(e.data.matchedUser),
                                    setTimeout(() => h(null), 3e3)),
                                  m());
                              } catch (e) {
                                console.error("Error liking user:", e);
                              }
                          },
                          disabled: l <= 0,
                          title: "Like",
                          children: [
                            (0, ni.jsx)(hi, { size: 28 }),
                            (0, ni.jsx)("span", { children: "Connect" }),
                          ],
                        }),
                      ],
                    }),
                    (0, ni.jsx)("div", {
                      className: "progress-indicator",
                      children: (0, ni.jsxs)("span", {
                        children: [r + 1, " of ", t.length],
                      }),
                    }),
                  ],
                }),
                f &&
                  (0, ni.jsx)("div", {
                    className: "match-modal-overlay",
                    onClick: () => h(null),
                    children: (0, ni.jsxs)("div", {
                      className: "match-modal-card",
                      onClick: (e) => e.stopPropagation(),
                      children: [
                        (0, ni.jsx)("div", {
                          className: "match-celebration",
                          children: "\ud83c\udf89",
                        }),
                        (0, ni.jsx)("h2", { children: "It's a Match!" }),
                        (0, ni.jsxs)("p", {
                          children: [
                            "You and ",
                            (0, ni.jsx)("strong", { children: f.name }),
                            " both liked each other!",
                          ],
                        }),
                        (0, ni.jsxs)("div", {
                          className: "match-actions",
                          children: [
                            (0, ni.jsx)("button", {
                              className: "btn-secondary",
                              onClick: () => h(null),
                              children: "Keep Browsing",
                            }),
                            (0, ni.jsx)("button", {
                              className: "btn-primary",
                              onClick: () =>
                                (window.location.href = "/messages"),
                              children: "Send Message",
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
              ],
            })
          : (0, ni.jsxs)("div", {
              className: "discover-page",
              children: [
                (0, ni.jsx)("div", {
                  className: "discover-header discover-header--center",
                  children: (0, ni.jsx)("h1", {
                    children: "Discover Your People",
                  }),
                }),
                (0, ni.jsxs)("div", {
                  className: "empty-state",
                  children: [
                    (0, ni.jsx)("div", {
                      className: "empty-icon",
                      children: "\ud83d\udc65",
                    }),
                    (0, ni.jsx)("h2", { children: "You've Seen Everyone!" }),
                    (0, ni.jsx)("p", {
                      children: "Check back tomorrow for new matches.",
                    }),
                  ],
                }),
              ],
            });
    },
    Ri = () => {
      const e = ie(),
        [t, n] = (0, o.useState)([]),
        [r, a] = (0, o.useState)(!0);
      (0, o.useEffect)(() => {
        i();
      }, []);
      const i = async () => {
        try {
          const e = await Ka();
          n(e.data);
        } catch (e) {
          console.error("Error loading matches:", e);
        } finally {
          a(!1);
        }
      };
      return r
        ? (0, ni.jsx)("div", {
            className: "matches-page",
            children: (0, ni.jsx)("div", {
              className: "loading",
              children: "Loading matches...",
            }),
          })
        : (0, ni.jsxs)("div", {
            className: "matches-page",
            children: [
              (0, ni.jsxs)("div", {
                className: "matches-header",
                children: [
                  (0, ni.jsxs)("h1", {
                    children: [(0, ni.jsx)(hi, { size: 32 }), "Your Matches"],
                  }),
                  (0, ni.jsx)("p", {
                    className: "subtitle",
                    children:
                      t.length > 0
                        ? "You have "
                            .concat(t.length, " ")
                            .concat(1 === t.length ? "match" : "matches", "!")
                        : "No matches yet. Keep swiping!",
                  }),
                ],
              }),
              0 === t.length
                ? (0, ni.jsxs)("div", {
                    className: "empty-state",
                    children: [
                      (0, ni.jsx)("div", {
                        className: "empty-icon",
                        children: "\ud83d\udc95",
                      }),
                      (0, ni.jsx)("h2", { children: "No Matches Yet" }),
                      (0, ni.jsx)("p", {
                        children:
                          "Start liking people on the Discover page to find your matches!",
                      }),
                      (0, ni.jsx)("button", {
                        className: "btn-discover",
                        onClick: () => e("/discover"),
                        children: "Go to Discover",
                      }),
                    ],
                  })
                : (0, ni.jsx)("div", {
                    className: "matches-grid",
                    children: t.map((t) =>
                      (0, ni.jsxs)(
                        "div",
                        {
                          className: "match-card",
                          onClick: () => {
                            return ((n = t._id), void e("/profile/".concat(n)));
                            var n;
                          },
                          children: [
                            (0, ni.jsx)("div", {
                              className: "match-photo",
                              children: (0, ni.jsx)("img", {
                                src: t.profilePhoto,
                                alt: t.name,
                              }),
                            }),
                            (0, ni.jsxs)("div", {
                              className: "match-info",
                              children: [
                                (0, ni.jsxs)("h3", {
                                  children: [t.name, ", ", t.age],
                                }),
                                (0, ni.jsxs)("div", {
                                  className: "match-location",
                                  children: [
                                    (0, ni.jsx)(Ci, { size: 14 }),
                                    (0, ni.jsxs)("span", {
                                      children: [t.city, ", ", t.state],
                                    }),
                                  ],
                                }),
                                t.lifeStage &&
                                  t.lifeStage.length > 0 &&
                                  (0, ni.jsx)("div", {
                                    className: "match-tags",
                                    children: t.lifeStage
                                      .slice(0, 2)
                                      .map((e) =>
                                        (0, ni.jsx)(
                                          "span",
                                          {
                                            className: "tag-small",
                                            children: e,
                                          },
                                          e,
                                        ),
                                      ),
                                  }),
                                (0, ni.jsxs)("button", {
                                  className: "btn-message",
                                  onClick: (n) =>
                                    ((t, n) => {
                                      (n.stopPropagation(),
                                        e("/messages/".concat(t)));
                                    })(t._id, n),
                                  children: [
                                    (0, ni.jsx)(pi, { size: 16 }),
                                    "Message",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        t._id,
                      ),
                    ),
                  }),
            ],
          });
    },
    Ti = ci("ArrowLeft", [
      ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
      ["path", { d: "M19 12H5", key: "x3x0zl" }],
    ]),
    Li = ci("Send", [
      ["path", { d: "m22 2-7 20-4-9-9-4Z", key: "1q3vgg" }],
      ["path", { d: "M22 2 11 13", key: "nzbqef" }],
    ]),
    Ai = () => {
      const { userId: e } = se(),
        t = ie(),
        { user: n, clearUnread: r } = ai(),
        [a, i] = (0, o.useState)([]),
        [s, l] = (0, o.useState)({}),
        [c, u] = (0, o.useState)(null),
        [d, f] = (0, o.useState)([]),
        [h, p] = (0, o.useState)(""),
        [m, g] = (0, o.useState)(!0),
        [y, v] = (0, o.useState)(!1);
      (0, o.useEffect)(() => {
        (b(), e && w(e));
      }, [e]);
      const b = async () => {
          try {
            const e = await Ka();
            (i(e.data), await x(e.data), g(!1));
          } catch (e) {
            (console.error("Error loading conversations:", e), g(!1));
          }
        },
        x = async (e) => {
          try {
            const n = {};
            for (const r of e)
              try {
                const e = await ei(r._id);
                n[r._id] = e.data.count;
              } catch (t) {
                (console.error(
                  "Error loading unread for ".concat(r._id, ":"),
                  t,
                ),
                  (n[r._id] = 0));
              }
            (l(n), console.log("\ud83d\udcca Unread counts per user:", n));
          } catch (t) {
            console.error("Error loading unread counts:", t);
          }
        },
        w = async (e) => {
          try {
            const t = a.find((t) => t._id === e);
            u(t);
            const n = await Ga(e);
            (f(n.data),
              l((t) => Sr(Sr({}, t), {}, { [e]: 0 })),
              console.log(
                "\ud83d\udcd6 Viewing conversation - clearing badges",
              ),
              r());
          } catch (t) {
            console.error("Error loading conversation:", t);
          }
        };
      return m
        ? (0, ni.jsx)("div", {
            className: "messages-container",
            children: (0, ni.jsx)("div", {
              className: "loading",
              children: "Loading messages...",
            }),
          })
        : (0, ni.jsx)("div", {
            className: "messages-container",
            children: (0, ni.jsxs)("div", {
              className: "messages-layout",
              children: [
                (0, ni.jsxs)("div", {
                  className: "conversations-sidebar ".concat(
                    c ? "mobile-hidden" : "",
                  ),
                  children: [
                    (0, ni.jsxs)("div", {
                      className: "sidebar-header",
                      children: [
                        (0, ni.jsx)("h2", { children: "Messages" }),
                        (0, ni.jsxs)("p", {
                          className: "subtitle",
                          children: [a.length, " matches"],
                        }),
                      ],
                    }),
                    0 === a.length
                      ? (0, ni.jsxs)("div", {
                          className: "empty-conversations",
                          children: [
                            (0, ni.jsx)(mi, { size: 48 }),
                            (0, ni.jsx)("h3", { children: "No Matches Yet" }),
                            (0, ni.jsx)("p", {
                              children:
                                "Start liking profiles to find your matches!",
                            }),
                            (0, ni.jsx)("button", {
                              className: "btn-primary",
                              onClick: () => t("/discover"),
                              children: "Discover People",
                            }),
                          ],
                        })
                      : (0, ni.jsx)("div", {
                          className: "conversations-list",
                          children: a.map((e) =>
                            (0, ni.jsxs)(
                              "div",
                              {
                                className: "conversation-item ".concat(
                                  (null === c || void 0 === c
                                    ? void 0
                                    : c._id) === e._id
                                    ? "active"
                                    : "",
                                ),
                                onClick: () => {
                                  return (
                                    t("/messages/".concat((n = e)._id)),
                                    u(n),
                                    void w(n._id)
                                  );
                                  var n;
                                },
                                children: [
                                  (0, ni.jsxs)("div", {
                                    className: "conversation-avatar-wrapper",
                                    children: [
                                      (0, ni.jsx)("img", {
                                        src: e.profilePhoto,
                                        alt: e.name,
                                        className: "conversation-avatar",
                                      }),
                                      s[e._id] > 0 &&
                                        (0, ni.jsx)("span", {
                                          className:
                                            "conversation-unread-badge",
                                          children: s[e._id],
                                        }),
                                    ],
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "conversation-info",
                                    children: [
                                      (0, ni.jsx)("h4", { children: e.name }),
                                      (0, ni.jsxs)("p", {
                                        children: [e.city, ", ", e.state],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              e._id,
                            ),
                          ),
                        }),
                  ],
                }),
                (0, ni.jsx)("div", {
                  className: "chat-area ".concat(c ? "" : "mobile-hidden"),
                  children: c
                    ? (0, ni.jsxs)(ni.Fragment, {
                        children: [
                          (0, ni.jsxs)("div", {
                            className: "chat-header",
                            children: [
                              (0, ni.jsx)("button", {
                                className: "back-button mobile-only",
                                onClick: () => {
                                  (u(null), t("/messages"));
                                },
                                children: (0, ni.jsx)(Ti, { size: 20 }),
                              }),
                              (0, ni.jsx)("img", {
                                src: c.profilePhoto,
                                alt: c.name,
                                className: "chat-avatar",
                              }),
                              (0, ni.jsxs)("div", {
                                className: "chat-user-info",
                                children: [
                                  (0, ni.jsx)("h3", { children: c.name }),
                                  (0, ni.jsxs)("p", {
                                    children: [c.city, ", ", c.state],
                                  }),
                                ],
                              }),
                              (0, ni.jsx)("button", {
                                className: "btn-view-profile",
                                onClick: () => {
                                  t("/profile/".concat(c._id));
                                },
                                children: "View Profile",
                              }),
                            ],
                          }),
                          (0, ni.jsx)("div", {
                            className: "messages-area",
                            children:
                              0 === d.length
                                ? (0, ni.jsxs)("div", {
                                    className: "no-messages",
                                    children: [
                                      (0, ni.jsx)("h3", {
                                        children: "Say Hello! \ud83d\udc4b",
                                      }),
                                      (0, ni.jsxs)("p", {
                                        children: [
                                          "You matched with ",
                                          c.name,
                                          "!",
                                        ],
                                      }),
                                      (0, ni.jsx)("p", {
                                        children: "Start a conversation below",
                                      }),
                                    ],
                                  })
                                : d.map((e, t) =>
                                    (0, ni.jsx)(
                                      "div",
                                      {
                                        className: "message ".concat(
                                          e.senderId === n.id
                                            ? "sent"
                                            : "received",
                                        ),
                                        children: (0, ni.jsxs)("div", {
                                          className: "message-bubble",
                                          children: [
                                            (0, ni.jsx)("p", {
                                              children: e.content,
                                            }),
                                            (0, ni.jsx)("span", {
                                              className: "message-time",
                                              children: new Date(
                                                e.createdAt,
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              }),
                                            }),
                                          ],
                                        }),
                                      },
                                      t,
                                    ),
                                  ),
                          }),
                          (0, ni.jsxs)("form", {
                            className: "message-input-form",
                            onSubmit: async (e) => {
                              if ((e.preventDefault(), h.trim() && c)) {
                                v(!0);
                                try {
                                  (await Za(c._id, h), p(""));
                                  const e = await Ga(c._id);
                                  f(e.data);
                                } catch (t) {
                                  console.error("Error sending message:", t);
                                } finally {
                                  v(!1);
                                }
                              }
                            },
                            children: [
                              (0, ni.jsx)("input", {
                                type: "text",
                                className: "message-input",
                                placeholder: "Message ".concat(c.name, "..."),
                                value: h,
                                onChange: (e) => p(e.target.value),
                                disabled: y,
                              }),
                              (0, ni.jsx)("button", {
                                type: "submit",
                                className: "send-button",
                                disabled: y || !h.trim(),
                                children: (0, ni.jsx)(Li, { size: 20 }),
                              }),
                            ],
                          }),
                        ],
                      })
                    : (0, ni.jsxs)("div", {
                        className: "no-chat-selected",
                        children: [
                          (0, ni.jsx)(mi, { size: 64 }),
                          (0, ni.jsx)("h3", {
                            children: "Select a Match to Start Chatting",
                          }),
                          (0, ni.jsx)("p", {
                            children:
                              "Choose a conversation from the left to begin messaging",
                          }),
                        ],
                      }),
                }),
              ],
            }),
          });
    },
    zi = ci("Pen", [
      [
        "path",
        {
          d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",
          key: "5qss01",
        },
      ],
    ]),
    Fi = ci("Save", [
      [
        "path",
        {
          d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",
          key: "1owoqh",
        },
      ],
      ["polyline", { points: "17 21 17 13 7 13 7 21", key: "1md35c" }],
      ["polyline", { points: "7 3 7 8 15 8", key: "8nz8an" }],
    ]),
    Mi = ci("Camera", [
      [
        "path",
        {
          d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
          key: "1tc9qg",
        },
      ],
      ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }],
    ]),
    Bi = ci("Mail", [
      [
        "rect",
        { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" },
      ],
      [
        "path",
        { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" },
      ],
    ]),
    Di = ci("Trash2", [
      ["path", { d: "M3 6h18", key: "d0wm0j" }],
      ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
      ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
      ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
      ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
    ]),
    Ui = () => {
      var e, t, n, r, a;
      const i = ie(),
        { user: s, updateUser: l, logout: c } = ai(),
        [u, d] = (0, o.useState)(!1),
        [f, h] = (0, o.useState)(!1),
        [p, m] = (0, o.useState)(!1),
        [g, y] = (0, o.useState)({
          name: "",
          age: "",
          city: "",
          state: "",
          bio: "",
          politicalBeliefs: [],
          religion: "",
          causes: [],
          lifeStage: [],
          lookingFor: [],
          profilePhoto: "",
          additionalPhotos: [],
          emailNotifications: { newMatch: !0, newMessage: !0 },
        });
      (0, o.useEffect)(() => {
        s &&
          y({
            name: s.name || "",
            age: s.age || "",
            city: s.city || "",
            state: s.state || "",
            bio: s.bio || "",
            politicalBeliefs: s.politicalBeliefs || [],
            religion: s.religion || "",
            causes: s.causes || [],
            lifeStage: s.lifeStage || [],
            lookingFor: s.lookingFor || [],
            profilePhoto: s.profilePhoto || "",
            additionalPhotos: s.additionalPhotos || [],
            emailNotifications: s.emailNotifications || {
              newMatch: !0,
              newMessage: !0,
            },
          });
      }, [s]);
      const v = (e) => {
          const { name: t, value: n } = e.target;
          y((e) => Sr(Sr({}, e), {}, { [t]: n }));
        },
        b = (e) => {
          y((t) =>
            Sr(
              Sr({}, t),
              {},
              {
                emailNotifications: Sr(
                  Sr({}, t.emailNotifications),
                  {},
                  { [e]: !t.emailNotifications[e] },
                ),
              },
            ),
          );
        };
      return s
        ? (0, ni.jsxs)("div", {
            className: "profile-page",
            children: [
              (0, ni.jsxs)("div", {
                className: "profile-container",
                children: [
                  (0, ni.jsxs)("div", {
                    className: "profile-header",
                    children: [
                      (0, ni.jsx)("h1", { children: "My Profile" }),
                      u
                        ? (0, ni.jsxs)("div", {
                            className: "edit-actions",
                            children: [
                              (0, ni.jsxs)("button", {
                                className: "btn-save",
                                onClick: async () => {
                                  try {
                                    const e = await $a(g);
                                    (l(e.data),
                                      d(!1),
                                      alert("Profile updated successfully!"));
                                  } catch (e) {
                                    (console.error(
                                      "Error updating profile:",
                                      e,
                                    ),
                                      alert("Error updating profile"));
                                  }
                                },
                                children: [
                                  (0, ni.jsx)(Fi, { size: 20 }),
                                  (0, ni.jsx)("span", { children: "Save" }),
                                ],
                              }),
                              (0, ni.jsxs)("button", {
                                className: "btn-cancel",
                                onClick: () => d(!1),
                                children: [
                                  (0, ni.jsx)(wi, { size: 20 }),
                                  (0, ni.jsx)("span", { children: "Cancel" }),
                                ],
                              }),
                            ],
                          })
                        : (0, ni.jsxs)("button", {
                            className: "btn-edit",
                            onClick: () => d(!0),
                            children: [
                              (0, ni.jsx)(zi, { size: 20 }),
                              (0, ni.jsx)("span", { children: "Edit Profile" }),
                            ],
                          }),
                    ],
                  }),
                  (0, ni.jsxs)("div", {
                    className: "profile-content",
                    children: [
                      (0, ni.jsxs)("section", {
                        className: "profile-section",
                        children: [
                          (0, ni.jsx)("h2", { children: "Photos" }),
                          (0, ni.jsxs)("div", {
                            className: "photo-section",
                            children: [
                              (0, ni.jsxs)("div", {
                                className: "main-photo-container",
                                children: [
                                  (0, ni.jsx)("img", {
                                    src:
                                      g.profilePhoto || "/default-avatar.png",
                                    alt: "Profile",
                                    className: "main-photo",
                                  }),
                                  u &&
                                    (0, ni.jsxs)("button", {
                                      className: "photo-edit-btn",
                                      onClick: () => h(!0),
                                      children: [
                                        (0, ni.jsx)(Mi, { size: 20 }),
                                        (0, ni.jsx)("span", {
                                          children: "Change Photo",
                                        }),
                                      ],
                                    }),
                                ],
                              }),
                              (null === (e = g.additionalPhotos) || void 0 === e
                                ? void 0
                                : e.length) > 0 &&
                                (0, ni.jsx)("div", {
                                  className: "additional-photos",
                                  children: g.additionalPhotos.map((e, t) =>
                                    (0, ni.jsx)(
                                      "img",
                                      {
                                        src: e,
                                        alt: "Additional ".concat(t + 1),
                                        className: "additional-photo",
                                      },
                                      t,
                                    ),
                                  ),
                                }),
                            ],
                          }),
                        ],
                      }),
                      (0, ni.jsxs)("section", {
                        className: "profile-section",
                        children: [
                          (0, ni.jsx)("h2", { children: "Basic Information" }),
                          u
                            ? (0, ni.jsxs)("div", {
                                className: "form-fields",
                                children: [
                                  (0, ni.jsxs)("div", {
                                    className: "form-field",
                                    children: [
                                      (0, ni.jsx)("label", {
                                        children: "Name",
                                      }),
                                      (0, ni.jsx)("input", {
                                        type: "text",
                                        name: "name",
                                        value: g.name,
                                        onChange: v,
                                      }),
                                    ],
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "form-field",
                                    children: [
                                      (0, ni.jsx)("label", { children: "Age" }),
                                      (0, ni.jsx)("input", {
                                        type: "number",
                                        name: "age",
                                        value: g.age,
                                        onChange: v,
                                      }),
                                    ],
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "form-field",
                                    children: [
                                      (0, ni.jsx)("label", {
                                        children: "City",
                                      }),
                                      (0, ni.jsx)("input", {
                                        type: "text",
                                        name: "city",
                                        value: g.city,
                                        onChange: v,
                                      }),
                                    ],
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "form-field",
                                    children: [
                                      (0, ni.jsx)("label", {
                                        children: "State",
                                      }),
                                      (0, ni.jsx)("input", {
                                        type: "text",
                                        name: "state",
                                        value: g.state,
                                        onChange: v,
                                      }),
                                    ],
                                  }),
                                  (0, ni.jsxs)("div", {
                                    className: "form-field",
                                    children: [
                                      (0, ni.jsx)("label", { children: "Bio" }),
                                      (0, ni.jsx)("textarea", {
                                        name: "bio",
                                        value: g.bio,
                                        onChange: v,
                                        rows: "4",
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : (0, ni.jsxs)("div", {
                                className: "info-display",
                                children: [
                                  (0, ni.jsxs)("p", {
                                    children: [
                                      (0, ni.jsx)("strong", {
                                        children: "Name:",
                                      }),
                                      " ",
                                      s.name,
                                      ", ",
                                      s.age,
                                    ],
                                  }),
                                  (0, ni.jsxs)("p", {
                                    children: [
                                      (0, ni.jsx)("strong", {
                                        children: "Location:",
                                      }),
                                      " ",
                                      s.city,
                                      ", ",
                                      s.state,
                                    ],
                                  }),
                                  (0, ni.jsxs)("p", {
                                    children: [
                                      (0, ni.jsx)("strong", {
                                        children: "Bio:",
                                      }),
                                      " ",
                                      s.bio,
                                    ],
                                  }),
                                ],
                              }),
                        ],
                      }),
                      "// Replace the Email Notifications section in your Profile.js with this:",
                      (0, ni.jsxs)("section", {
                        className: "profile-section",
                        children: [
                          (0, ni.jsxs)("h2", {
                            children: [
                              (0, ni.jsx)(Bi, { size: 24 }),
                              "Email Notifications",
                            ],
                          }),
                          (0, ni.jsxs)("div", {
                            className: "email-settings",
                            children: [
                              (0, ni.jsxs)("div", {
                                className: "email-toggle",
                                children: [
                                  (0, ni.jsxs)("div", {
                                    className: "toggle-info",
                                    children: [
                                      (0, ni.jsx)("strong", {
                                        children: "New Match Notifications",
                                      }),
                                      (0, ni.jsx)("p", {
                                        children:
                                          "Get notified when someone matches with you",
                                      }),
                                    ],
                                  }),
                                  (0, ni.jsxs)("label", {
                                    className: "toggle-switch",
                                    children: [
                                      (0, ni.jsx)("input", {
                                        type: "checkbox",
                                        checked: g.emailNotifications.newMatch,
                                        onChange: async () => {
                                          const e =
                                            !g.emailNotifications.newMatch;
                                          b("newMatch");
                                          try {
                                            const t = Sr(
                                              Sr({}, g.emailNotifications),
                                              {},
                                              { newMatch: e },
                                            );
                                            (await Ja(t),
                                              console.log(
                                                "\u2705 Notification settings saved",
                                              ));
                                          } catch (t) {
                                            console.error(
                                              "Error saving settings:",
                                              t,
                                            );
                                          }
                                        },
                                      }),
                                      (0, ni.jsx)("span", {
                                        className: "toggle-slider",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, ni.jsxs)("div", {
                                className: "email-toggle",
                                children: [
                                  (0, ni.jsxs)("div", {
                                    className: "toggle-info",
                                    children: [
                                      (0, ni.jsx)("strong", {
                                        children: "New Message Notifications",
                                      }),
                                      (0, ni.jsx)("p", {
                                        children:
                                          "Get notified when you receive a new message",
                                      }),
                                    ],
                                  }),
                                  (0, ni.jsxs)("label", {
                                    className: "toggle-switch",
                                    children: [
                                      (0, ni.jsx)("input", {
                                        type: "checkbox",
                                        checked:
                                          g.emailNotifications.newMessage,
                                        onChange: async () => {
                                          const e =
                                            !g.emailNotifications.newMessage;
                                          b("newMessage");
                                          try {
                                            const t = Sr(
                                              Sr({}, g.emailNotifications),
                                              {},
                                              { newMessage: e },
                                            );
                                            (await Ja(t),
                                              console.log(
                                                "\u2705 Notification settings saved",
                                              ));
                                          } catch (t) {
                                            console.error(
                                              "Error saving settings:",
                                              t,
                                            );
                                          }
                                        },
                                      }),
                                      (0, ni.jsx)("span", {
                                        className: "toggle-slider",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      !u &&
                        (0, ni.jsxs)(ni.Fragment, {
                          children: [
                            (0, ni.jsxs)("section", {
                              className: "profile-section",
                              children: [
                                (0, ni.jsx)("h2", { children: "My Values" }),
                                (0, ni.jsxs)("div", {
                                  className: "values-display",
                                  children: [
                                    (0, ni.jsxs)("div", {
                                      className: "value-item",
                                      children: [
                                        (0, ni.jsx)("strong", {
                                          children: "Religion:",
                                        }),
                                        " ",
                                        s.religion,
                                      ],
                                    }),
                                    (0, ni.jsxs)("div", {
                                      className: "value-item",
                                      children: [
                                        (0, ni.jsx)("strong", {
                                          children: "Political Beliefs:",
                                        }),
                                        " ",
                                        null === (t = s.politicalBeliefs) ||
                                        void 0 === t
                                          ? void 0
                                          : t.join(", "),
                                      ],
                                    }),
                                    (0, ni.jsxs)("div", {
                                      className: "value-item",
                                      children: [
                                        (0, ni.jsx)("strong", {
                                          children: "Causes I Care About:",
                                        }),
                                        " ",
                                        null === (n = s.causes) || void 0 === n
                                          ? void 0
                                          : n.join(", "),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, ni.jsxs)("section", {
                              className: "profile-section",
                              children: [
                                (0, ni.jsx)("h2", { children: "Life Stage" }),
                                (0, ni.jsx)("div", {
                                  className: "tags-display",
                                  children:
                                    null === (r = s.lifeStage) || void 0 === r
                                      ? void 0
                                      : r.map((e) =>
                                          (0, ni.jsx)(
                                            "span",
                                            { className: "tag", children: e },
                                            e,
                                          ),
                                        ),
                                }),
                              ],
                            }),
                            (0, ni.jsxs)("section", {
                              className: "profile-section",
                              children: [
                                (0, ni.jsx)("h2", { children: "Looking For" }),
                                (0, ni.jsx)("div", {
                                  className: "tags-display",
                                  children:
                                    null === (a = s.lookingFor) || void 0 === a
                                      ? void 0
                                      : a.map((e) =>
                                          (0, ni.jsx)(
                                            "span",
                                            { className: "tag", children: e },
                                            e,
                                          ),
                                        ),
                                }),
                              ],
                            }),
                          ],
                        }),
                      (0, ni.jsxs)("section", {
                        className: "profile-section danger-zone",
                        children: [
                          (0, ni.jsxs)("h2", {
                            children: [
                              (0, ni.jsx)(Di, { size: 24 }),
                              "Danger Zone",
                            ],
                          }),
                          (0, ni.jsxs)("div", {
                            className: "danger-content",
                            children: [
                              (0, ni.jsxs)("div", {
                                className: "danger-info",
                                children: [
                                  (0, ni.jsx)("strong", {
                                    children: "Delete Account",
                                  }),
                                  (0, ni.jsx)("p", {
                                    children:
                                      "Once you delete your account, there is no going back. All your matches, messages, and profile data will be permanently deleted.",
                                  }),
                                ],
                              }),
                              (0, ni.jsx)("button", {
                                className: "btn-delete",
                                onClick: () => m(!0),
                                children: "Delete Account",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              f &&
                (0, ni.jsx)("div", {
                  className: "modal-overlay",
                  children: (0, ni.jsxs)("div", {
                    className: "modal-content",
                    children: [
                      (0, ni.jsx)("button", {
                        className: "modal-close",
                        onClick: () => h(!1),
                        children: (0, ni.jsx)(wi, { size: 24 }),
                      }),
                      (0, ni.jsx)(Si, {
                        currentPhoto: g.profilePhoto,
                        additionalPhotos: g.additionalPhotos,
                        onPhotoUpdate: (e) => {
                          (y((t) => Sr(Sr({}, t), e)), h(!1));
                        },
                      }),
                    ],
                  }),
                }),
              p &&
                (0, ni.jsx)("div", {
                  className: "modal-overlay",
                  children: (0, ni.jsxs)("div", {
                    className: "modal-content delete-confirm-modal",
                    children: [
                      (0, ni.jsx)("h2", { children: "Delete Account?" }),
                      (0, ni.jsx)("p", {
                        children:
                          "Are you absolutely sure you want to delete your account? This action cannot be undone.",
                      }),
                      (0, ni.jsxs)("div", {
                        className: "delete-confirm-actions",
                        children: [
                          (0, ni.jsx)("button", {
                            className: "btn-delete-confirm",
                            onClick: async () => {
                              try {
                                (await Xa(),
                                  alert("Your account has been deleted."),
                                  c(),
                                  i("/"));
                              } catch (e) {
                                (console.error("Error deleting account:", e),
                                  alert(
                                    "Error deleting account. Please try again.",
                                  ));
                              }
                            },
                            children: "Yes, Delete My Account",
                          }),
                          (0, ni.jsx)("button", {
                            className: "btn-cancel",
                            onClick: () => m(!1),
                            children: "Cancel",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
            ],
          })
        : (0, ni.jsx)("div", { children: "Loading..." });
    },
    Ii = ci("Sparkles", [
      [
        "path",
        {
          d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",
          key: "17u4zn",
        },
      ],
      ["path", { d: "M5 3v4", key: "bklmnn" }],
      ["path", { d: "M19 17v4", key: "iiml17" }],
      ["path", { d: "M3 5h4", key: "nem4j1" }],
      ["path", { d: "M17 19h4", key: "lbex7p" }],
    ]),
    qi = () => {
      const e = ie(),
        { user: t } = ai(),
        [n, r] = (0, o.useState)([]),
        [a, i] = (0, o.useState)(!0),
        [s, l] = (0, o.useState)(10);
      (0, o.useEffect)(() => {
        c();
      }, []);
      const c = async () => {
        try {
          const e = await Ya();
          (r(e.data.users), l(e.data.dailyLikesRemaining));
        } catch (e) {
          console.error("Error loading likes:", e);
        } finally {
          i(!1);
        }
      };
      return a
        ? (0, ni.jsx)("div", {
            className: "likes-you-page",
            children: (0, ni.jsxs)("div", {
              className: "loading-spinner",
              children: [
                (0, ni.jsx)("div", { className: "spinner" }),
                (0, ni.jsx)("p", { children: "Loading your admirers..." }),
              ],
            }),
          })
        : (0, ni.jsxs)("div", {
            className: "likes-you-page",
            children: [
              (0, ni.jsxs)("div", {
                className: "likes-you-header",
                children: [
                  (0, ni.jsxs)("div", {
                    children: [
                      (0, ni.jsxs)("h1", {
                        children: [
                          (0, ni.jsx)(Ii, { size: 32 }),
                          "People Who Like You",
                        ],
                      }),
                      (0, ni.jsx)("p", {
                        className: "subtitle",
                        children:
                          n.length > 0
                            ? ""
                                .concat(n.length, " ")
                                .concat(
                                  1 === n.length ? "person" : "people",
                                  " interested in connecting with you!",
                                )
                            : "No one has liked you yet. Keep browsing!",
                      }),
                    ],
                  }),
                  (0, ni.jsxs)("div", {
                    className: "likes-badge",
                    children: [
                      (0, ni.jsx)(hi, { size: 18, fill: "#fff" }),
                      (0, ni.jsxs)("span", {
                        children: [s, " likes left today"],
                      }),
                    ],
                  }),
                ],
              }),
              0 === n.length
                ? (0, ni.jsxs)("div", {
                    className: "empty-state",
                    children: [
                      (0, ni.jsx)("div", {
                        className: "empty-icon",
                        children: "\ud83d\udc9d",
                      }),
                      (0, ni.jsx)("h2", { children: "No Likes Yet" }),
                      (0, ni.jsx)("p", {
                        children:
                          "When someone likes you, they'll appear here.",
                      }),
                      (0, ni.jsx)("p", {
                        children:
                          "Keep updating your profile and browsing to get noticed!",
                      }),
                      (0, ni.jsx)("button", {
                        className: "btn-primary",
                        onClick: () => e("/discover"),
                        children: "Go to Discover",
                      }),
                    ],
                  })
                : (0, ni.jsx)("div", {
                    className: "likes-grid",
                    children: n.map((t) =>
                      (0, ni.jsxs)(
                        "div",
                        {
                          className: "like-card",
                          children: [
                            (0, ni.jsxs)("div", {
                              className: "like-card-image",
                              onClick: () => {
                                return (
                                  (n = t._id),
                                  void e("/profile/".concat(n))
                                );
                                var n;
                              },
                              children: [
                                (0, ni.jsx)("img", {
                                  src: t.profilePhoto,
                                  alt: t.name,
                                }),
                                (0, ni.jsxs)("div", {
                                  className: "match-badge-small",
                                  children: [t.matchScore, "% Match"],
                                }),
                              ],
                            }),
                            (0, ni.jsxs)("div", {
                              className: "like-card-content",
                              children: [
                                (0, ni.jsxs)("h3", {
                                  className: "person-name",
                                  children: [t.name, ", ", t.age],
                                }),
                                (0, ni.jsxs)("div", {
                                  className: "person-location",
                                  children: [
                                    (0, ni.jsx)(Ci, { size: 14 }),
                                    (0, ni.jsxs)("span", {
                                      children: [t.city, ", ", t.state],
                                    }),
                                  ],
                                }),
                                (0, ni.jsx)("p", {
                                  className: "bio-preview",
                                  children:
                                    t.bio.length > 80
                                      ? "".concat(t.bio.substring(0, 80), "...")
                                      : t.bio,
                                }),
                                t.lifeStage &&
                                  t.lifeStage.length > 0 &&
                                  (0, ni.jsxs)("div", {
                                    className: "tags-preview",
                                    children: [
                                      t.lifeStage
                                        .slice(0, 2)
                                        .map((e) =>
                                          (0, ni.jsx)(
                                            "span",
                                            {
                                              className: "tag-small",
                                              children: e,
                                            },
                                            e,
                                          ),
                                        ),
                                      t.lifeStage.length > 2 &&
                                        (0, ni.jsxs)("span", {
                                          className: "tag-small",
                                          children: [
                                            "+",
                                            t.lifeStage.length - 2,
                                          ],
                                        }),
                                    ],
                                  }),
                                (0, ni.jsxs)("div", {
                                  className: "like-card-actions",
                                  children: [
                                    (0, ni.jsx)("button", {
                                      className: "btn-pass",
                                      onClick: () =>
                                        (async (e) => {
                                          try {
                                            (await Wa(e),
                                              r((t) =>
                                                t.filter((t) => t._id !== e),
                                              ));
                                          } catch (t) {
                                            console.error("Error passing:", t);
                                          }
                                        })(t._id),
                                      title: "Not interested",
                                      children: "Pass",
                                    }),
                                    (0, ni.jsxs)("button", {
                                      className: "btn-like-back",
                                      onClick: () =>
                                        (async (t) => {
                                          if (s <= 0)
                                            alert(
                                              "You've reached your daily like limit. Upgrade to premium for unlimited likes!",
                                            );
                                          else
                                            try {
                                              const n = await Ha(t);
                                              (l(n.data.dailyLikesRemaining),
                                                n.data.isMatch
                                                  ? (alert(
                                                      "It's a Match! You can now message ".concat(
                                                        n.data.matchedUser.name,
                                                      ),
                                                    ),
                                                    e("/messages/".concat(t)))
                                                  : r((e) =>
                                                      e.filter(
                                                        (e) => e._id !== t,
                                                      ),
                                                    ));
                                            } catch (n) {
                                              console.error(
                                                "Error liking back:",
                                                n,
                                              );
                                            }
                                        })(t._id),
                                      disabled: s <= 0,
                                      title: "Like them back",
                                      children: [
                                        (0, ni.jsx)(hi, { size: 18 }),
                                        "Like Back",
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        t._id,
                      ),
                    ),
                  }),
            ],
          });
    },
    Vi = () => {
      const { userId: e } = se(),
        t = ie(),
        [n, r] = (0, o.useState)(null),
        [a, i] = (0, o.useState)(!0);
      (0, o.useEffect)(() => {
        (async () => {
          try {
            const t = await Qa(e);
            r(t.data);
          } catch (t) {
            console.error("Error loading profile:", t);
          } finally {
            i(!1);
          }
        })();
      }, [e]);
      const s = () => {
        t("/messages/".concat(e));
      };
      return a
        ? (0, ni.jsx)("div", {
            className: "user-profile-container",
            children: (0, ni.jsx)("div", {
              className: "loading",
              children: "Loading profile...",
            }),
          })
        : n
          ? (0, ni.jsx)("div", {
              className: "user-profile-container",
              children: (0, ni.jsxs)("div", {
                className: "profile-wrapper",
                children: [
                  (0, ni.jsxs)("div", {
                    className: "profile-top-bar",
                    children: [
                      (0, ni.jsxs)("button", {
                        className: "back-btn",
                        onClick: () => t(-1),
                        children: [
                          (0, ni.jsx)(Ti, { size: 20 }),
                          (0, ni.jsx)("span", { children: "Back" }),
                        ],
                      }),
                      (0, ni.jsxs)("button", {
                        className: "message-btn",
                        onClick: s,
                        children: [
                          (0, ni.jsx)(pi, { size: 20 }),
                          (0, ni.jsx)("span", { children: "Message" }),
                        ],
                      }),
                    ],
                  }),
                  (0, ni.jsxs)("div", {
                    className: "user-profile-card",
                    children: [
                      (0, ni.jsxs)("div", {
                        className: "profile-hero",
                        children: [
                          (0, ni.jsx)("img", {
                            src: n.profilePhoto,
                            alt: n.name,
                            className: "profile-hero-image",
                          }),
                          (0, ni.jsxs)("div", {
                            className: "profile-hero-overlay",
                            children: [
                              (0, ni.jsxs)("h1", {
                                children: [n.name, ", ", n.age],
                              }),
                              (0, ni.jsxs)("div", {
                                className: "profile-location",
                                children: [
                                  (0, ni.jsx)(Ci, { size: 18 }),
                                  (0, ni.jsxs)("span", {
                                    children: [n.city, ", ", n.state],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, ni.jsxs)("div", {
                        className: "profile-content",
                        children: [
                          (0, ni.jsxs)("section", {
                            className: "profile-section",
                            children: [
                              (0, ni.jsx)("h3", {
                                className: "section-title",
                                children: "About",
                              }),
                              (0, ni.jsx)("p", {
                                className: "bio-text",
                                children: n.bio,
                              }),
                            ],
                          }),
                          n.additionalPhotos &&
                            n.additionalPhotos.length > 0 &&
                            (0, ni.jsxs)("section", {
                              className: "profile-section",
                              children: [
                                (0, ni.jsx)("h3", {
                                  className: "section-title",
                                  children: "Photos",
                                }),
                                (0, ni.jsx)("div", {
                                  className: "photo-gallery",
                                  children: n.additionalPhotos.map((e, t) =>
                                    (0, ni.jsx)(
                                      "div",
                                      {
                                        className: "photo-gallery-item",
                                        children: (0, ni.jsx)("img", {
                                          src: e,
                                          alt: ""
                                            .concat(n.name, " ")
                                            .concat(t + 1),
                                        }),
                                      },
                                      t,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          n.lifeStage &&
                            n.lifeStage.length > 0 &&
                            (0, ni.jsxs)("section", {
                              className: "profile-section",
                              children: [
                                (0, ni.jsx)("h3", {
                                  className: "section-title",
                                  children: "Life Stage",
                                }),
                                (0, ni.jsx)("div", {
                                  className: "tags-container",
                                  children: n.lifeStage.map((e) =>
                                    (0, ni.jsx)(
                                      "span",
                                      {
                                        className: "tag tag-blue",
                                        children: e,
                                      },
                                      e,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          n.lookingFor &&
                            n.lookingFor.length > 0 &&
                            (0, ni.jsxs)("section", {
                              className: "profile-section",
                              children: [
                                (0, ni.jsx)("h3", {
                                  className: "section-title",
                                  children: "Looking For",
                                }),
                                (0, ni.jsx)("div", {
                                  className: "tags-container",
                                  children: n.lookingFor.map((e) =>
                                    (0, ni.jsx)(
                                      "span",
                                      {
                                        className: "tag tag-green",
                                        children: e,
                                      },
                                      e,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          (0, ni.jsxs)("section", {
                            className: "profile-section",
                            children: [
                              (0, ni.jsx)("h3", {
                                className: "section-title",
                                children: "Values & Beliefs",
                              }),
                              (0, ni.jsxs)("div", {
                                className: "values-grid",
                                children: [
                                  n.religion &&
                                    (0, ni.jsxs)("div", {
                                      className: "value-item",
                                      children: [
                                        (0, ni.jsx)("span", {
                                          className: "value-label",
                                          children: "Religion",
                                        }),
                                        (0, ni.jsx)("span", {
                                          className: "value-text",
                                          children: n.religion,
                                        }),
                                      ],
                                    }),
                                  n.politicalBeliefs &&
                                    n.politicalBeliefs.length > 0 &&
                                    (0, ni.jsxs)("div", {
                                      className: "value-item",
                                      children: [
                                        (0, ni.jsx)("span", {
                                          className: "value-label",
                                          children: "Political Beliefs",
                                        }),
                                        (0, ni.jsx)("span", {
                                          className: "value-text",
                                          children:
                                            n.politicalBeliefs.join(", "),
                                        }),
                                      ],
                                    }),
                                ],
                              }),
                            ],
                          }),
                          n.causes &&
                            n.causes.length > 0 &&
                            (0, ni.jsxs)("section", {
                              className: "profile-section",
                              children: [
                                (0, ni.jsx)("h3", {
                                  className: "section-title",
                                  children: "Passionate About",
                                }),
                                (0, ni.jsx)("div", {
                                  className: "tags-container",
                                  children: n.causes.map((e) =>
                                    (0, ni.jsx)(
                                      "span",
                                      {
                                        className: "tag tag-accent",
                                        children: e,
                                      },
                                      e,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          (0, ni.jsx)("div", {
                            className: "profile-actions",
                            children: (0, ni.jsxs)("button", {
                              className: "btn-message-large",
                              onClick: s,
                              children: [
                                (0, ni.jsx)(pi, { size: 20 }),
                                "Send Message",
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            })
          : (0, ni.jsx)("div", {
              className: "user-profile-container",
              children: (0, ni.jsx)("div", {
                className: "error",
                children: "Profile not found",
              }),
            });
    },
    Hi = (e) => {
      let { children: t } = e;
      const { isAuthenticated: n, loading: r } = ai();
      return r
        ? (0, ni.jsx)("div", {
            className: "loading-screen",
            children: "Loading...",
          })
        : n
          ? t
          : (0, ni.jsx)(ke, { to: "/login" });
    },
    Wi = (e) => {
      let { children: t } = e;
      const { isAuthenticated: n, loading: r } = ai();
      return r
        ? (0, ni.jsx)("div", {
            className: "loading-screen",
            children: "Loading...",
          })
        : n
          ? (0, ni.jsx)(ke, { to: "/discover" })
          : t;
    };
  function $i() {
    return (0, ni.jsx)(Fe, {
      children: (0, ni.jsxs)(Ee, {
        children: [
          (0, ni.jsx)(je, {
            path: "/",
            element: (0, ni.jsx)(Wi, { children: (0, ni.jsx)(vi, {}) }),
          }),
          (0, ni.jsx)(je, {
            path: "/login",
            element: (0, ni.jsx)(Wi, { children: (0, ni.jsx)(bi, {}) }),
          }),
          (0, ni.jsx)(je, {
            path: "/signup",
            element: (0, ni.jsx)(Wi, { children: (0, ni.jsx)(Ni, {}) }),
          }),
          (0, ni.jsxs)(je, {
            element: (0, ni.jsx)(Hi, { children: (0, ni.jsx)(yi, {}) }),
            children: [
              (0, ni.jsx)(je, {
                path: "discover",
                element: (0, ni.jsx)(Oi, {}),
              }),
              (0, ni.jsx)(je, {
                path: "likes-you",
                element: (0, ni.jsx)(qi, {}),
              }),
              (0, ni.jsx)(je, {
                path: "matches",
                element: (0, ni.jsx)(Ri, {}),
              }),
              (0, ni.jsx)(je, {
                path: "messages",
                element: (0, ni.jsx)(Ai, {}),
              }),
              (0, ni.jsx)(je, {
                path: "messages/:userId",
                element: (0, ni.jsx)(Ai, {}),
              }),
              (0, ni.jsx)(je, {
                path: "profile",
                element: (0, ni.jsx)(Ui, {}),
              }),
              (0, ni.jsx)(je, {
                path: "profile/:userId",
                element: (0, ni.jsx)(Vi, {}),
              }),
            ],
          }),
          (0, ni.jsx)(je, { path: "*", element: (0, ni.jsx)(ke, { to: "/" }) }),
        ],
      }),
    });
  }
  const Ki = function () {
    return (0, ni.jsx)(ii, { children: (0, ni.jsx)($i, {}) });
  };
  l.createRoot(document.getElementById("root")).render(
    (0, ni.jsx)(o.StrictMode, { children: (0, ni.jsx)(Ki, {}) }),
  );
})();
//# sourceMappingURL=main.c2d765cd.js.map
