const Interactive = require('../lib/index').Interactive;

describe('Zera', () => {
    let zera;
    let leafletMap;
    let container;

    describe('when the user clicks on the map', () => {
        beforeEach(() => {
            container = document.createElement('div');
            container.setAttribute('id', 'map');
            container.style.height = '200px';
            document.body.appendChild(container);
            leafletMap = L.map('map').setView([47.84808037632246, 14.2822265625], 4);

            zera = new Interactive();
            zera.map(leafletMap);
            zera.tilejson({
                grids: ['https://example.com/{z}/{x}/{y}/grid.json']
            })
        });

        afterEach(() => {
            document.body.removeChild(container);
        })
        
        it('should return a featureOver (off) event with the user clicks outside a feature ', done => {
            // Spy on tileLoader.loadTile
            zera._tileLoader.loadTile = () => Promise.resolve();
            // Fire leaflet event
            leafletMap.fireEvent('click', { latlng: {wrap: () => { return {lat: 9, lng: 8} }}});

            zera.on('off', event => {
                expect(event).to.be.undefined;
                done();
            })
        });

        it('should return a featureOver (off) event with the user moves the mouse outside a feature ', done => {
            // Spy on tileLoader.loadTile
            zera._tileLoader.loadTile = () => Promise.resolve();
            // Fire leaflet event
            leafletMap.fireEvent('mousemove', { latlng: {wrap: () => { return {lat: 9, lng: 8} }}});

            zera.on('off', event => {
                expect(event).to.be.undefined;
                done();
            })
        });
    });
});