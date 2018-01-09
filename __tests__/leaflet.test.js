const leaflet = require('leaflet');
const Interactivity = require('../lib/index').Interactive;

describe('leafletMap', () => {
    describe('.off', () => {
        test('should remove only events suscribed by zera', () => {
            const event = { latlng: { wrap: () => { return { lat: 42, lng: -8 } } } };
            const map = new leaflet.map(document.createElement('div')).setView([51.505, -0.09], 13);
            const interactivity = new Interactivity();
            const nativeLeafletMapCallback = jest.fn();
            const zeraLeafletMapCallback = jest.fn();
            // Mock loadtile
            interactivity._tileLoader.loadTile = jest.fn(() => Promise.resolve());

            interactivity.map(map);
            const leafletMap = interactivity._map;
            map.on('click', nativeLeafletMapCallback)
            leafletMap.on('click', zeraLeafletMapCallback);
            
            // Both callbacks should receive the event
            leafletMap._map.fire('click', event);
            expect(nativeLeafletMapCallback).toHaveBeenCalledTimes(1);
            expect(zeraLeafletMapCallback).toHaveBeenCalledTimes(1);
            // Unsuscribe events from leafletmap doesnt affect native map events
            leafletMap.off('click', zeraLeafletMapCallback);
            // Now only the native callback should receive the event
            leafletMap._map.fire('click', event);
            expect(nativeLeafletMapCallback).toHaveBeenCalledTimes(2);
            expect(zeraLeafletMapCallback).toHaveBeenCalledTimes(1);
        });
    });
});
