const EventEmitter = require('../lib/eventEmitter');

fdescribe('eventEmitter', () => {
    describe('.addEventListener', () => {
        test('should add a new listener to the list', () => {
            const eventEmitter = new EventEmitter();

            expect(eventEmitter._listeners.click).toBeUndefined();
            expect(eventEmitter._listeners.move).toBeUndefined();
            expect(eventEmitter._listeners.out).toBeUndefined();
            expect(eventEmitter._listeners.error).toBeUndefined();

            const clickListenerMock = jest.fn();
            const mouseMoveListenerMock = jest.fn();
            const outListenerMock = jest.fn();
            const errorListenerMock = jest.fn();

            eventEmitter.addEventListener('click', clickListenerMock);
            eventEmitter.addEventListener('mousemove', mouseMoveListenerMock);
            eventEmitter.addEventListener('featureout', outListenerMock);
            eventEmitter.addEventListener('error', errorListenerMock);

            expect(eventEmitter._listeners.click).toEqual(clickListenerMock);
            expect(eventEmitter._listeners.move).toEqual(mouseMoveListenerMock);
            expect(eventEmitter._listeners.out).toEqual(outListenerMock);
            expect(eventEmitter._listeners.error).toEqual(errorListenerMock);

        });

        test('should add only one listener per event', () => {
            const eventEmitter = new EventEmitter();
            const clickListenerMock0 = jest.fn();
            const clickListenerMock1 = jest.fn();

            eventEmitter.addEventListener('click', clickListenerMock0);
            eventEmitter.addEventListener('click', clickListenerMock1);

            expect(eventEmitter._listeners.click).toEqual(clickListenerMock1);
        });
    });

    describe('.removeEventListener', () => {
        test('should remove a listener', () => {
            const eventEmitter = new EventEmitter();
            const clickListenerMock = jest.fn();
            eventEmitter.addEventListener('click', clickListenerMock);
            expect(eventEmitter._listeners.click).toEqual(clickListenerMock);

            eventEmitter.removeEventListener('click');

            expect(eventEmitter._listeners.click).toBeUndefined();
        });
    });

    describe('.dispatchEvent', () => {
        test('should trigger an event', done => {
            const eventEmitter = new EventEmitter();
            const clickListenerMock = jest.fn(event => {
                expect(event.foo).toEqual('bar');
                done();
            });
            eventEmitter.addEventListener('click', clickListenerMock);
            eventEmitter.dispatchEvent('click', { foo: 'bar' });
        });
    });

    describe('.clear', () => {
        test('should remove all listeners', () => {
            const eventEmitter = new EventEmitter();
            const clickListenerMock = jest.fn();
            const mouseMoveListenerMock = jest.fn();
            const outListenerMock = jest.fn();
            const errorListenerMock = jest.fn();
            
            eventEmitter.addEventListener('click', clickListenerMock);
            eventEmitter.addEventListener('mousemove', mouseMoveListenerMock);
            eventEmitter.addEventListener('featureout', outListenerMock);
            eventEmitter.addEventListener('error', errorListenerMock);

            expect(eventEmitter._listeners.click).toEqual(clickListenerMock);
            expect(eventEmitter._listeners.move).toEqual(mouseMoveListenerMock);
            expect(eventEmitter._listeners.out).toEqual(outListenerMock);
            expect(eventEmitter._listeners.error).toEqual(errorListenerMock);

            eventEmitter.clear();

            expect(eventEmitter._listeners.click).toBeUndefined();
            expect(eventEmitter._listeners.move).toBeUndefined();
            expect(eventEmitter._listeners.out).toBeUndefined();
            expect(eventEmitter._listeners.error).toBeUndefined();
        })
    })
});