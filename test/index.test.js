const gridjson = require('../lib/index');
const GoogleMap = require('../lib/map/google');
const LeafletMap = require('../lib/map/leaflet');

describe('gridjson', () => {
    let interactivity;
    beforeEach(() => {
        interactivity = new gridjson.Interactive();
    });
    
    describe('.tilejson', () => {
        test('should set the grid json url', () => {
            interactivity.tilejson({ grids: ['https://example.com/map_foo/{z}/{x}/{y}.grid.json'] });

            expect(interactivity._url).toEqual('https://example.com/map_foo/{z}/{x}/{y}.grid.json')
        });

        test('should return the interactivity object', () => {
            const actual = interactivity.tilejson({ grids: ['https://example.com/map_foo/{z}/{x}/{y}.grid.json'] });
            const expected = interactivity;

            expect(actual).toBe(expected);
        });
    });

    describe('.map', () => {
        test('should create a google maps wrapper when passing a google map as a parameter', () => {
            const gmapMock = { __gm: true, addListener: jest.fn() };

            interactivity.map(gmapMock);

            // Internal object Should be a Google Map wrapper
            expect(interactivity._map instanceof GoogleMap).toEqual(true);
            // Should link the native events
            expect(gmapMock.addListener).toHaveBeenCalledTimes(2);
            expect(gmapMock.addListener).toHaveBeenCalledWith('click', expect.any(Function));
            expect(gmapMock.addListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
        });

        test('should create a leaflet maps wrapper when passing a leaflet map as a parameter', () => {
            const leafletMapMock = { __gm: false, on: jest.fn() };

            interactivity.map(leafletMapMock);

            // Internal object Should be a Leaflet Map wrapper
            expect(interactivity._map instanceof LeafletMap).toEqual(true);
            // Should link the native events
            expect(leafletMapMock.on).toHaveBeenCalledTimes(2);
            expect(leafletMapMock.on).toHaveBeenCalledWith('click', expect.any(Function));
            expect(leafletMapMock.on).toHaveBeenCalledWith('mousemove', expect.any(Function));
        });
    });
});
