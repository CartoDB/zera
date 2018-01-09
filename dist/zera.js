(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["zera"] = factory();
	else
		root["zera"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = __webpack_require__(1);
var EventEmitter = __webpack_require__(4);
var TileLoader = __webpack_require__(5);

/**
 * 
 */

var Interactive = function () {
    function Interactive(map, gridUrl) {
        _classCallCheck(this, Interactive);

        // Map element
        if (map) {
            this._bindMap(map);
        }
        this._tileLoader = new TileLoader(gridUrl);
        // We asume 256x256px tiles
        this._tileSize = 256;
        // At the moment only one callback is supported so a custom event emitter is used.
        this._eventEmitter = new EventEmitter();
    }

    /**
     * Add the grid url from a tilejson file
     * @deprecated
     * Method added for backwards compatibility with wax
     */


    _createClass(Interactive, [{
        key: 'tilejson',
        value: function tilejson(_tilejson) {
            this._tileLoader.setUrl(_tilejson.grids[0]);
            return this;
        }

        /**
         * Add the native map 
         * @deprecated
         * Method added for backwards compatibility with wax
         */

    }, {
        key: 'map',
        value: function map(_map) {
            this._bindMap(_map);
            return this;
        }

        /**
         * Attach a native map to the interactivity object.
         * @param {*} map 
         */

    }, {
        key: '_bindMap',
        value: function _bindMap(map) {
            this._map = new Map(map);
            this._map.on('click', this._onMapClick.bind(this));
            this._map.on('mousemove', this._onMapMouseMove.bind(this));
        }

        /**
         * Attach event listeners to map events.
         * @param {on|off|error} event - The name of the event 
         * @param {function} callback - The callback to be executed when the event is fired
         */

    }, {
        key: 'on',
        value: function on(event, callback) {
            switch (event) {
                case 'on':
                    this._eventEmitter.addEventListener('mousemove', callback);
                    this._eventEmitter.addEventListener('click', callback);
                    break;
                case 'off':
                    this._eventEmitter.addEventListener('featureout', callback);
                    break;
                case 'error':
                    this._eventEmitter.addEventListener('error', callback);
                    break;
            }
            return this;
        }

        /**
         * Callback executed when the native map click event is fired
         * @param {*} e 
         */

    }, {
        key: '_onMapClick',
        value: function _onMapClick(e) {
            var _this = this;

            var eventClone = this._map.cloneEvent(e);
            var coords = this._getTileCoordsFromMouseEvent(eventClone);
            this._tileLoader.loadTile(coords.z, coords.x, coords.y).then(function (tile) {
                if (tile !== 'fetching') {
                    return _this._objectForEvent(tile, eventClone, 'click');
                }
            }).catch(function (err) {
                _this._eventEmitter.dispatchEvent('error', err);
            });
        }

        /**
         * Callback executed when the native map "mousemove" event is fired.
         * @param {*} e 
         */

    }, {
        key: '_onMapMouseMove',
        value: function _onMapMouseMove(e) {
            var _this2 = this;

            var eventClone = this._map.cloneEvent(e);
            var coords = this._getTileCoordsFromMouseEvent(eventClone);
            this._tileLoader.loadTile(coords.z, coords.x, coords.y).then(function (tile) {
                if (tile !== 'fetching') {
                    return _this2._objectForEvent(tile, eventClone, 'mousemove');
                }
            }).catch(function (err) {
                _this2._eventEmitter.dispatchEvent('error', err);
            });
        }

        /**
         * Return the tile coordinates from a mouseEvent
         * @param {*} mouseEvent 
         */

    }, {
        key: '_getTileCoordsFromMouseEvent',
        value: function _getTileCoordsFromMouseEvent(event) {
            var pixelPoint = this._map.project(event);
            var coords = this._unscale(pixelPoint, this._tileSize);
            coords.z = this._map.getZoom();
            return coords;
        }
    }, {
        key: '_unscale',
        value: function _unscale(pixelPoint, tileSize) {
            return {
                x: Math.floor(pixelPoint.x / tileSize),
                y: Math.floor(pixelPoint.y / tileSize)
            };
        }

        /**
         * Get the data from a map event.
         * Using the event coords and the grid.json tile.
         * 
         * This method fires an event with a `data` property. 
         * 
         * Warning: This method mutates the event object!
         */

    }, {
        key: '_objectForEvent',
        value: function _objectForEvent(tile, event, eventType) {
            var point = this._map.project(event);
            // 4 pixels asigned to each grid in the utfGrid.
            var resolution = 4;
            // get the tile coords to which the pixel belongs

            var _unscale2 = this._unscale(point, this._tileSize),
                x = _unscale2.x,
                y = _unscale2.y;

            var max = Math.pow(2, this._map.getZoom());
            x = (x + max) % max;
            y = (y + max) % max;

            if (tile && tile.grid) {
                var gridX = Math.floor((point.x - x * this._tileSize) / resolution);
                var gridY = Math.floor((point.y - y * this._tileSize) / resolution);
                var idx = this._utfDecode(tile.grid[gridY].charCodeAt(gridX));
                var key = tile.keys[idx];
                if (tile.data.hasOwnProperty(key)) {
                    // Extend the event with the data from the grid json
                    event.data = tile.data[key];
                }
            }

            // Add "e" property for backwards compatibility with wax.
            event.e = event.originalEvent || { type: eventType };

            // To emulate wax behaviour stop event propagation when there is data.
            if (event.data && event.originalEvent) {
                event.originalEvent.stopPropagation();
            }

            this._triggerEvent(eventType, event);
        }

        /**
         */

    }, {
        key: '_triggerEvent',
        value: function _triggerEvent(eventType, extendedEvent) {
            // If there is no data dont do anything!
            if (!extendedEvent.data) {
                this._eventEmitter.dispatchEvent('featureout', {});
                return;
            }
            if (eventType === 'mousemove') {
                this._eventEmitter.dispatchEvent('mousemove', extendedEvent);
                return;
            }
            if (eventType === 'click') {
                this._eventEmitter.dispatchEvent('featureout', {});
                this._eventEmitter.dispatchEvent('click', extendedEvent);
            }
        }

        /**
         * Remove interactivity
         */

    }, {
        key: 'remove',
        value: function remove() {
            this._eventEmitter.clear();
            // Remove native map listeners
            this._map.off('click');
            this._map.off('mousemove');
        }

        /**
         * Decode an utf gridjson cell
         * @see https://github.com/mapbox/utfgrid-spec/blob/master/1.3/utfgrid.md
         * @param {string} char 
         */

    }, {
        key: '_utfDecode',
        value: function _utfDecode(char) {
            if (char >= 93) {
                char--;
            }
            if (char >= 35) {
                char--;
            }
            return char - 32;
        }
    }]);

    return Interactive;
}();

module.exports = { Interactive: Interactive };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GoogleMap = __webpack_require__(2);
var LeafletMap = __webpack_require__(3);

function Map(nativeMap) {
    if (nativeMap.__gm) {
        return new GoogleMap(nativeMap);
    } else {
        return new LeafletMap(nativeMap);
    }
}
module.exports = Map;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoogleMap = function () {
    function GoogleMap(nativeMap) {
        _classCallCheck(this, GoogleMap);

        this._map = nativeMap;
        this._listeners = {};
    }

    /**
     * Return the pixel coordinates of an event at a certain zoom level.
     */


    _createClass(GoogleMap, [{
        key: "project",
        value: function project(event) {
            var latLng = event.latLng;
            var point = this._map.getProjection().fromLatLngToPoint(latLng);
            var scale = Math.pow(2, this.getZoom());
            return {
                x: Math.floor(scale * point.x),
                y: Math.floor(scale * point.y)
            };
        }
    }, {
        key: "getZoom",
        value: function getZoom() {
            return this._map.getZoom();
        }
    }, {
        key: "on",
        value: function on(event, callback) {
            this._listeners[event] = this._map.addListener(event, callback);
        }
    }, {
        key: "off",
        value: function off(event) {
            this._listeners[event] && this._listeners[event].remove();
        }

        // We need to clone events to avoid mutations causing buggy behaviour

    }, {
        key: "cloneEvent",
        value: function cloneEvent(event) {
            return {
                da: event.da,
                latLng: event.latLng,
                pixel: event.pixel
            };
        }
    }]);

    return GoogleMap;
}();

module.exports = GoogleMap;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LeafletMap = function () {
    function LeafletMap(nativeMap) {
        _classCallCheck(this, LeafletMap);

        this._map = nativeMap;
        this._listeners = {};
    }

    // LatLong to pixel coords


    _createClass(LeafletMap, [{
        key: "project",
        value: function project(event) {
            var latlng = event.latlng.wrap();
            return this._map.project(latlng, this._map.getZoom()).floor();
        }
    }, {
        key: "getZoom",
        value: function getZoom() {
            return this._map.getZoom();
        }
    }, {
        key: "on",
        value: function on(event, callback) {
            this._listeners[event] = callback;
            return this._map.on(event, callback);
        }
    }, {
        key: "off",
        value: function off(event) {
            return this._map.off(event, this._listeners[event]);
        }

        // We need to clone events to avoid mutations causing buggy behaviour

    }, {
        key: "cloneEvent",
        value: function cloneEvent(event) {
            return {
                containerPoint: event.containerPoint,
                latlng: event.latlng,
                layerPoint: event.layerPoint,
                originalEvent: event.originalEvent,
                target: event.target,
                type: event.type
            };
        }
    }]);

    return LeafletMap;
}();

module.exports = LeafletMap;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        // Callbacks for every event
        this._listeners = {
            click: undefined,
            move: undefined,
            out: undefined,
            error: undefined
        };
    }

    _createClass(EventEmitter, [{
        key: 'dispatchEvent',
        value: function dispatchEvent(event, data) {
            switch (event) {
                case 'mousemove':
                    this._listeners.move && this._listeners.move(data);
                    break;
                case 'click':
                    this._listeners.click && this._listeners.click(data);
                    break;
                case 'featureout':
                    this._listeners.out && this._listeners.out();
                    break;
                case 'error':
                    this._listeners.error && this._listeners.error(data);
            }
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(event, callback) {
            switch (event) {
                case 'mousemove':
                    this._listeners.move = callback;
                    break;
                case 'click':
                    this._listeners.click = callback;
                    break;
                case 'featureout':
                    this._listeners.out = callback;
                    break;
                case 'error':
                    this._listeners.error = callback;
            }
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(event) {
            switch (event) {
                case 'mousemove':
                    delete this._listeners.move;
                    break;
                case 'click':
                    delete this._listeners.click;
                    break;
                case 'featureout':
                    delete this._listeners.out;
                    break;
                case 'error':
                    delete this._listeners.error;
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            this._listeners = {
                click: undefined,
                move: undefined,
                out: undefined,
                error: undefined
            };
        }
    }]);

    return EventEmitter;
}();

module.exports = EventEmitter;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TileLoader = function () {
    function TileLoader(gridUrl) {
        _classCallCheck(this, TileLoader);

        this._url = gridUrl;
        this._cache = {};
    }

    _createClass(TileLoader, [{
        key: 'setUrl',
        value: function setUrl(newValue) {
            this._url = newValue;
        }

        /**
         * Load a grid.json tile from the coords using a cache system to improve performance.
         * @param {number} z 
         * @param {number} x 
         * @param {number} y 
         */

    }, {
        key: 'loadTile',
        value: function loadTile(z, x, y) {
            var _this = this;

            // If already cached the request is ignored.
            if (this._cache[z + '_' + x + '_' + y]) {
                return Promise.resolve(this._cache[z + '_' + x + '_' + y]);
            }
            // Mark the tile as "fetching" to prevent duplicated requests. The value will be async obtained.
            this._cache[z + '_' + x + '_' + y] = 'fetching';

            return fetch(this._buildTileUrl(z, x, y))
            // On server limit errors reject throw a featureError
            .then(this._handleLimitErrors).then(function (data) {
                _this._cache[z + '_' + x + '_' + y] = data;
                return data;
            });
        }

        /**
         * Builds the tile url from the coords.
         * @param {number} z 
         * @param {number} x 
         * @param {number} y 
         */

    }, {
        key: '_buildTileUrl',
        value: function _buildTileUrl(z, x, y) {
            var url = this._url;
            url = url.replace(/{z}/, z);
            url = url.replace(/{x}/, x);
            url = url.replace(/{y}/, y);
            return url;
        }

        /**
         * When the server returns a 429 we want to throw an especific error.
         */

    }, {
        key: '_handleLimitErrors',
        value: function _handleLimitErrors(response) {
            if (response.status === 429) {
                return response.json().then(function (data) {
                    return Promise.reject(data);
                });
            }
            return response.json();
        }
    }]);

    return TileLoader;
}();

module.exports = TileLoader;

/***/ })
/******/ ]);
});
//# sourceMappingURL=zera.js.map