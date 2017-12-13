'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.checkResolved = checkResolved;
exports.isResolved = isResolved;
exports.getRouteMatches = getRouteMatches;
exports.getRouteValues = getRouteValues;
exports.getComponents = getComponents;

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UNRESOLVED = {};

function checkResolved(value) {
  if (!(0, _isPromise2.default)(value)) {
    return value;
  }

  return _promise2.default.race([value, new _promise2.default(function (resolve) {
    (0, _setImmediate3.default)(resolve, UNRESOLVED);
  })]);
}

function isResolved(value) {
  return value !== UNRESOLVED;
}

function getRouteMatches(match) {
  return match.routes.map(function (route, i) {
    return (0, _extends3.default)({}, match, { route: route, routeParams: match.routeParams[i]
    });
  });
}

// This should work better with Flow than the obvious solution with keys.
function getRouteValues(routeMatches, getGetter, getValue) {
  return routeMatches.map(function (match) {
    var route = match.route;

    var getter = getGetter(route);
    return getter ? getter.call(route, match) : getValue(route);
  });
}

// This should be common to most resolvers, so make it available here.
function getComponents(routeMatches) {
  return getRouteValues(routeMatches, function (route) {
    return route.getComponent;
  }, function (route) {
    if (process.env.NODE_ENV !== 'production' && route.component) {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(route.Component, 'Route with `component` property `%s` has no `Component` ' + 'property. The expected property for the route component ' + 'is `Component`.', route.component.displayName || route.component.name) : void 0;
    }

    return route.Component;
  });
}