class LeafletMap {
    constructor(nativeMap) {
        this._map = nativeMap;
    }

    // LatLong to pixel coords
    project(event) {
        const latlng = event.latlng.wrap();
        return this._map.project(latlng, this._map.getZoom()).floor()
    }

    getZoom() {
        return this._map.getZoom();
    }

    on(event, callback) {
        this._map.on(event, callback);
    }
}

module.exports = LeafletMap;
