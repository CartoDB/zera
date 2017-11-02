class GoogleMap {
    constructor(nativeMap) {
        this._map = nativeMap;
    }

    /**
     * Return the pixel coordinates of an event at a certain zoom level.
     */
    project(event) {
        const latLng = event.latLng;
        const point = this._map.getProjection().fromLatLngToPoint(latLng);
        const scale = Math.pow(2, this.getZoom());
        return {
            x: Math.floor(scale * point.x),
            y: Math.floor(scale * point.y),
        }
    }

    getZoom() {
        return this._map.getZoom();
    }

    on(event, callback) {
        this._map.addListener(event, callback);
    }
}

module.exports = GoogleMap;