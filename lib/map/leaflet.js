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
        return this._map.on(event, callback);
    }

    // We need to clone events to avoid mutations causing buggy behaviour
    cloneEvent(event) {
        return {
            containerPoint: event.containerPoint,
            latlng: event.latlng,
            layerPoint: event.layerPoint,
            originalEvent: event.originalEvent,
            target: event.target,
            type: event.type
        }
    }
}

module.exports = LeafletMap;
