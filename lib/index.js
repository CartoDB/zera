var Map = require('./map');

/**
 * 
 */
class Interactive {
    constructor(map, gridUrl) {
        // Map element
        this._map = map && new Map(map);
        // Object with the grid.json cached data
        this._cache = {};
        // Url template for the grid tiles
        this._url = gridUrl;
        // We asume 256x256px tiles
        this._tileSize = 256;
        // At the moment only one callback is supported so a custom event emitter is used.
        this._eventEmitter = {
            dispatchEvent: (event, data) => {
                switch (event) {
                    case 'mousemove':
                        this._listeners.move && this._listeners.move(data);
                        break;
                    case 'click':
                        this._listeners.click && this._listeners.click(data);
                        break;
                    case 'featureout':
                        this._listeners.out && this._listeners.out();
                }
            },
            addEventListener: (event, callback) => {
                switch (event) {
                    case 'mousemove':
                        this._listeners.move = callback;
                        break;
                    case 'click':
                        this._listeners.click = callback;
                        break;
                    case 'featureout':
                        this._listeners.out = callback;
                }
            },
            removeEventListener: (event) => {
                switch (event) {
                    case 'mousemove':
                        delete this._listeners.move;
                        break;
                    case 'click':
                        delete this._listeners.click;
                        break;
                    case 'featureout':
                        delete this._listeners.out;
                }
            }
        }
        // Callbacks for every event
        this._listeners = {
            click: undefined,
            move: undefined,
            out: undefined,
        }
    }

    /**
     * Add the grid url from a tilejson file
     * @deprecated
     * Method added for backwards compatibility with wax
     */
    tilejson(tilejson) {
        this._url = tilejson.grids[0];
        return this;
    }

    /**
     * Add the native map 
     * @deprecated
     * Method added for backwards compatibility with wax
     */
    map(map) {
        this._map = new Map(map);
        this._map.on('click', this._onMapClick.bind(this));
        this._map.on('mousemove', this._onMapMouseMove.bind(this));
        return this;
    }

    /**
     * Attach event listeners to map events
     * @param {*} event 
     * @param {*} callback 
     */
    on(event, callback) {
        switch (event) {
            case 'on':
                this._eventEmitter.addEventListener('mousemove', callback)
                this._eventEmitter.addEventListener('click', callback)
                break;
            case 'off':
                this._eventEmitter.addEventListener('featureout', callback)
                break;
            default:
        }
        return this;
    }

    /**
     * Callback executed when the native map click event is fired
     * @param {*} e 
     */
    _onMapClick(e) {
        var coords = this._getTileCoordsFromMouseEvent(e);
        this._loadTile(coords.z, coords.x, coords.y)
            .then(() => this._objectForEvent(e, 'click'));
    }

    /**
     * Callback executed when the native map "mousemove" event is fired.
     * @param {*} e 
     */
    _onMapMouseMove(e) {
        var coords = this._getTileCoordsFromMouseEvent(e);
        this._loadTile(coords.z, coords.x, coords.y)
            .then(() => this._objectForEvent(e, 'mousemove'));
    }

    /**
     * Return the tile coordinates from a mouseEvent
     * @param {*} mouseEvent 
     */
    _getTileCoordsFromMouseEvent(event) {
        var pixelPoint = this._map.project(event);
        var coords = this._unscale(pixelPoint, this._tileSize);
        coords.z = this._map.getZoom()
        return coords;
    }

    _unscale(pixelPoint, tileSize) {
        return {
            x: Math.floor(pixelPoint.x / tileSize),
            y: Math.floor(pixelPoint.y / tileSize),
        }
    }

    /**
     * Load a grid.json tile from the coords using a cache system to improve performance.
     * @param {*} z 
     * @param {*} x 
     * @param {*} y 
     */
    _loadTile(z, x, y) {
        // If already cached the request is ignored.
        if (this._cache[z + '_' + x + '_' + y]) {
            return Promise.resolve();
        }
        // Mark the tile as "fetching" to prevent duplicated requests. The value will be async obtained.
        this._cache[z + '_' + x + '_' + y] = 'fetching';
        return fetch(this._buildTileUrl(z, x, y))
            .then(data => data.json())
            .then(data => this._cache[z + '_' + x + '_' + y] = data);
    }

    /**
     * Builds the tile url from the coords.
     * @param {*} z 
     * @param {*} x 
     * @param {*} y 
     */
    _buildTileUrl(z, x, y) {
        let url = this._url;
        url = url.replace(/{z}/, z);
        url = url.replace(/{x}/, x);
        url = url.replace(/{y}/, y);
        return url;
    }

    /**
     * Get the data from a map event.
     * Using the event coords, get the data from the grid.json data stored in the cache.
     * 
     * This method Trigger an event with a `data` property. 
     */
    _objectForEvent(e, eventType) {
        const point = this._map.project(e);
        // 4 pixels asigned to each grid in the utfGrid.
        const resolution = 4;
        // get the tile coords to which the pixel belongs
        var x = this._unscale(point.x);
        var y = this._unscale(point.y);
        var max = Math.pow(2, this._map.getZoom());
        x = (x + max) % max;
        y = (y + max) % max;

        var tile = this._cache[this._map.getZoom() + '_' + x + '_' + y];

        if (tile && tile.grid) {
            let gridX = Math.floor((point.x - (x * this._tileSize)) / resolution);
            let gridY = Math.floor((point.y - (y * this._tileSize)) / resolution);
            let idx = this._utfDecode(tile.grid[gridY].charCodeAt(gridX));
            let key = tile.keys[idx];
            if (tile.data.hasOwnProperty(key)) {
                // Extend the event with the data from the grid json
                e.data = tile.data[key];
            }
        }

        // Add "e" property for backwards compatibility with wax.
        e.e = e.originalEvent || { type: eventType };

        this._triggerEvent(eventType, e);
    }

    /**
     */
    _triggerEvent(eventType, extendedEvent) {
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
    remove() {
        this._eventEmitter.removeEventListener(this._listeners.click);
        this._eventEmitter.removeEventListener(this._listeners.move);
        this._eventEmitter.removeEventListener(this._listeners.out);
    }

    /**
     * Decode an utf gridjson cell
     * @see https://github.com/mapbox/utfgrid-spec/blob/master/1.3/utfgrid.md
     * @param {string} char 
     */
    _utfDecode(char) {
        if (char >= 93) {
            char--;
        }
        if (char >= 35) {
            char--;
        }
        return char - 32;
    }
}


module.exports = { Interactive };