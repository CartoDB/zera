const TileLoader = require('../lib/tileLoader');

describe('TileLoader', () => {
    describe('.constructor', () => {
        test('should set the grid url', () => {
            const fakeUrl = 'https://example.com/map_foo/{z}/{x}/{y}.grid.json';
            const tileLoader = new TileLoader(fakeUrl);

            expect(tileLoader._url).toEqual(fakeUrl);
        });

        test('should init an empty cache', () => {
            const tileLoader = new TileLoader();

            expect(tileLoader._cache).toBeDefined();
        });
    });

    describe('loadTile', () => {
        let mockFetch;
        let tileLoader;
        beforeEach(() => {
            mockFetch = jest.fn();
            global.fetch =  mockFetch;
            const fakeUrl = 'https://example.com/map_foo/{z}/{x}/{y}.grid.json';
            tileLoader = new TileLoader(fakeUrl);
        });

        test('should perform a request to the right url', () => {
            mockFetch.mockReturnValue(Promise.resolve({status: 200, json: () => {Promise.resolve('ok')}}));
           
            expect(mockFetch).not.toHaveBeenCalled();
            tileLoader.loadTile(0,0,0);
            expect(mockFetch).toHaveBeenCalledWith('https://example.com/map_foo/0/0/0.grid.json');
        });
        
        test('should return the result from cache when availiable', done => {
            const expected = 'data_0_0_0';
            mockFetch.mockReturnValue(Promise.resolve( { json: () => expected }));
            expect(mockFetch).not.toHaveBeenCalled();
            
            tileLoader.loadTile(0,0,0)
                .then(() => tileLoader.loadTile(0,0,0))
                .then(actual => {
                    expect(actual).toEqual(expected);
                    expect(mockFetch).toHaveBeenCalledTimes(1);
                    done();
                });
        });
        
        test('should return a rejected promise then fetch success with limit erros', done => {
            mockFetch.mockReturnValue(Promise.resolve( { status: 429, json: jest.fn().mockReturnValue(Promise.resolve('limit_error_mock'))}));
            
            tileLoader.loadTile(0,0,0).catch(err => {
                expect(err).toEqual('limit_error_mock');
                done();
            });
        });

        test('should return a rejected promise then fetch fails', done => {
            mockFetch.mockReturnValue(Promise.reject('fake_error'));
            
            tileLoader.loadTile(0,0,0).catch(err => {
                expect(err).toEqual('fake_error');
                done();
            });
        });
    });
});