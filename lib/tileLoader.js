
/**
 * Load grid.json tiles from a server.
 */
class TileLoader {
  constructor (gridUrl) {
    this._url = gridUrl;
    this._cache = {};
  }

  setUrl (newValue) {
    this._url = newValue;
  }

  /**
   * Load a grid.json tile from the coords using a cache system to improve performance.
   * @param {number} z
   * @param {number} x
   * @param {number} y
   */
  loadTile (z, x, y) {
    // If already cached the request is ignored.
    if (this._cache[z + '_' + x + '_' + y]) {
      return Promise.resolve(this._cache[z + '_' + x + '_' + y]);
    }
    // Mark the tile as "fetching" to prevent duplicated requests. The value will be async obtained.
    this._cache[z + '_' + x + '_' + y] = 'fetching';

    return fetch(this._buildTileUrl(z, x, y))
      // On server limit errors reject throw a featureError
      .then(this._handleLimitErrors)
      .then(data => {
        this._cache[z + '_' + x + '_' + y] = data;
        return data;
      });
  }

  /**
   * Builds the tile url from the coords.
   * @param {number} z
   * @param {number} x
   * @param {number} y
   */
  _buildTileUrl (z, x, y) {
    let url = this._url;
    url = url.replace(/{z}/, z);
    url = url.replace(/{x}/, x);
    url = url.replace(/{y}/, y);
    return url;
  }

  /**
   * When the server returns a 429 we want to throw an especific error.
   */
  _handleLimitErrors (response) {
    if (response.status === 429) {
      return response.json().then(data => Promise.reject(data));
    }
    return response.json();
  }
}

module.exports = TileLoader;
