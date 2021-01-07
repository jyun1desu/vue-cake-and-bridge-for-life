"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = require("vue-router");

var _Home = _interopRequireDefault(require("../views/Home.vue"));

var _store = _interopRequireDefault(require("../store"));

var _db = _interopRequireDefault(require("../db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var routes = [{
  path: '/',
  name: 'Home',
  component: _Home["default"]
}, {
  path: '/waitingRoom/:roomName/:userName',
  name: 'WaitingRoom',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/WaitingRoom.vue'));
    });
  },
  beforeEnter: function beforeEnter(routerTo, from, next) {
    if (!_store["default"].state.userName) {
      router.push({
        name: "Home"
      });
    }

    next();
  }
}, {
  path: '/gameroom/:roomName/:userName',
  name: 'GameRoom',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/GameRoom.vue'));
    });
  },
  beforeEnter: function beforeEnter(routerTo, from, next) {
    if (!_store["default"].state.userName) {
      router.push({
        name: "Home"
      });
    }

    next();
  }
}];
var router = (0, _vueRouter.createRouter)({
  history: (0, _vueRouter.createWebHashHistory)(),
  routes: routes
});
var _default = router;
exports["default"] = _default;