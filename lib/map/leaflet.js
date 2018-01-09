class LeafletMap {
  constructor (nativeMap) {
    this._map = nativeMap;
    this._listeners = {};
  }

  // LatLong to pixel coords
  project (event) {
    const latlng = event.latlng.wrap();
    return this._map.project(latlng, this._map.getZoom()).floor();
  }

  getZoom () {
    return this._map.getZoom();
  }

  on (event, callback) {
    this._listeners[event] = callback;
    return this._map.on(event, callback);
  }

  off (event) {
    return this._map.off(event, this._listeners[event]);
  }

  // We need to clone events to avoid mutations causing buggy behaviour
  cloneEvent (event) {
    return {
      containerPoint: event.containerPoint,
      latlng: event.latlng,
      layerPoint: event.layerPoint,
      originalEvent: event.originalEvent,
      target: event.target,
      type: event.type
    };
  }
}

module.exports = LeafletMap;
