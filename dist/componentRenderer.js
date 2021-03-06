"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.componentRenderer = componentRenderer;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _server = require("react-dom/server");

var _lodash = require("lodash");

var _styledComponents = require("styled-components");

// For Jest. See: https://github.com/styled-components/styled-components/issues/1692
var StyleSheet = _styledComponents.__DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS.StyleSheet;
StyleSheet.reset(true);
var modes = {
  CLIENT: 'client',
  SERVER: 'server'
};

function componentRenderer(config) {
  var modules = config.modules,
      _config$mode = config.mode,
      mode = _config$mode === void 0 ? modes.SERVER : _config$mode,
      _config$serialize = config.serialize,
      serialize = _config$serialize === void 0 ? function (component) {
    return component;
  } : _config$serialize;
  var components = (0, _keys.default)(modules).reduce(function (moduleMap, moduleName) {
    var Component = modules[moduleName];
    return (0, _objectSpread3.default)({}, moduleMap, (0, _defineProperty2.default)({}, moduleName, function (props) {
      if (mode === modes.SERVER) {
        var mountId = (0, _lodash.uniqueId)('stitch-component-');
        var sheet = new _styledComponents.ServerStyleSheet();
        var html = (0, _server.renderToString)(sheet.collectStyles(_react.default.createElement(Component, props)));
        var css = sheet.getStyleTags();
        var markup = "\n            <div id=".concat(mountId, ">\n              ").concat(css, "\n              ").concat(html, "\n            </div>\n          ").trim();
        serialize({
          mountId: mountId,
          moduleName: moduleName,
          props: props
        });
        return markup; // Client
      } else if (mode === modes.CLIENT) {
        setTimeout(function () {
          _reactDom.default.hydrate(_react.default.createElement(Component, props), document.getElementById(props.mountId));
        }, 0);
      }
    }));
  }, {});
  return {
    components: components,
    mountOnClient: function mountOnClient(_ref) {
      var moduleName = _ref.moduleName,
          props = (0, _objectWithoutProperties2.default)(_ref, ["moduleName"]);
      components[moduleName](props);
    }
  };
}