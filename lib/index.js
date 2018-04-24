var Map = require('./map');
var EventEmitter = require('./eventEmitter');
var TileLoader = require('./tileLoader');

/**
 *
 */
class Interactive {
  constructor (map, gridUrl) {
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
  tilejson (tilejson) {
    this._tileLoader.setUrl(tilejson.grids[0]);
    return this;
  }

  /**
   * Add the native map
   * @deprecated
   * Method added for backwards compatibility with wax
   */
  map (map) {
    this._bindMap(map);
    return this;
  }

  /**
   * Attach a native map to the interactivity object.
   * @param {*} map
   */
  _bindMap (map) {
    this._map = new Map(map);
    this._map.on('click', this._onMapClick.bind(this));
    this._map.on('mousemove', this._onMapMouseMove.bind(this));
  }

  /**
   * Attach event listeners to map events.
   * @param {on|off|error} event - The name of the event
   * @param {function} callback - The callback to be executed when the event is fired
   */
  on (event, callback) {
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
   * @param {object} e
   */
  _onMapClick (e) {
    var eventClone = this._map.cloneEvent(e);
    const coords = this._getTileCoordsFromMouseEvent(eventClone);
    this._tileLoader.loadTile(coords.z, coords.x, coords.y)
      .then(tile => {
        if (tile !== 'fetching') {
          return this._objectForEvent(tile, eventClone, 'click');
        }
      })
      .catch(err => {
        this._eventEmitter.dispatchEvent('error', err);
      });
  }

  /**
   * Callback executed when the native map "mousemove" event is fired.
   * @param {object} e
   */
  _onMapMouseMove (e) {
    const eventClone = this._map.cloneEvent(e);
    const coords = this._getTileCoordsFromMouseEvent(eventClone);
    this._tileLoader.loadTile(coords.z, coords.x, coords.y)
      .then(tile => {
        if (tile !== 'fetching') {
          return this._objectForEvent(tile, eventClone, 'mousemove');
        }
      })
      .catch(err => {
        this._eventEmitter.dispatchEvent('error', err);
      });
  }

  /**
   * Return the tile coordinates from a mouseEvent
   * @param {*} mouseEvent
   */
  _getTileCoordsFromMouseEvent (event) {
    const pixelPoint = this._map.project(event);
    const coords = this._unscale(pixelPoint, this._tileSize);
    coords.z = Math.round(this._map.getZoom());
    return coords;
  }

  /**
   * Divide each point coord by the tilesize
   */
  _unscale (pixelPoint, tileSize) {
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
  _objectForEvent (tile, event, eventType) {
    const point = this._map.project(event);
    // 4 pixels asigned to each grid in the utfGrid.
    const resolution = 4;
    // get the tile coords to which the pixel belongs
    let { x, y } = this._unscale(point, this._tileSize);
    const max = Math.pow(2, this._map.getZoom());
    x = (x + max) % max;
    y = (y + max) % max;

    if (tile && tile.grid) {
      let gridX = Math.floor((point.x - (x * this._tileSize)) / resolution);
      let gridY = Math.floor((point.y - (y * this._tileSize)) / resolution);
      let idx = this._utfDecode(tile.grid[gridY].charCodeAt(gridX));
      let key = tile.keys[idx];
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
   * Trigger a wax event.
   */
  _triggerEvent (eventType, extendedEvent) {
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
  remove () {
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
  _utfDecode (char) {
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
