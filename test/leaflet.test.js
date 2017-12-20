const leaflet = require('leaflet');
const Interactivity = require('../lib/index').Interactive;

describe('leafletMap', () => {
    describe('.off', () => {
        test('should unsuscribe only suscribed events', () => {
            const event = { latlng: { wrap: () => { return { lat: 42, lng: -8 } } } };
            const map = new leaflet.map(document.createElement('div')).setView([51.505, -0.09], 13);
            const interactivity = new Interactivity();
            const callback0 = jest.fn();
            const callback1 = jest.fn();

            // Mock loadtile
            interactivity._loadTile = jest.fn(() => Promise.resolve());

            interactivity.map(map);
            const leafletMap = interactivity._map;
            
            map.on('click', callback0)
            leafletMap.on('click', callback1);

            leafletMap._map.fire('click', event);

            expect(callback0).toHaveBeenCalled();
            expect(callback1).toHaveBeenCalled();

            // Unsuscribe events from leafletmap doesnt affect native map events
            leafletMap.off('click', callback1);
            leafletMap._map.fire('click', event);

            expect(callback0).toHaveBeenCalledTimes(2);
            expect(callback1).toHaveBeenCalledTimes(1);
        });
    });
});
