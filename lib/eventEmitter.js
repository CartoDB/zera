/**
 * Simple event emmiter with one listener per event.
 */
class EventEmitter {
  constructor () {
    // Callbacks for every event
    this._listeners = {
      click: undefined,
      move: undefined,
      out: undefined,
      error: undefined
    };
  }

  dispatchEvent (event, data) {
    switch (event) {
      case 'mousemove':
        this._listeners.move && this._listeners.move(data);
        break;
      case 'click':
        this._listeners.click && this._listeners.click(data);
        break;
      case 'featureout':
        this._listeners.out && this._listeners.out();
        break;
      case 'error':
        this._listeners.error && this._listeners.error(data);
    }
  }

  addEventListener (event, callback) {
    switch (event) {
      case 'mousemove':
        this._listeners.move = callback;
        break;
      case 'click':
        this._listeners.click = callback;
        break;
      case 'featureout':
        this._listeners.out = callback;
        break;
      case 'error':
        this._listeners.error = callback;
    }
  }

  removeEventListener (event) {
    switch (event) {
      case 'mousemove':
        delete this._listeners.move;
        break;
      case 'click':
        delete this._listeners.click;
        break;
      case 'featureout':
        delete this._listeners.out;
        break;
      case 'error':
        delete this._listeners.error;
    }
  }

  clear () {
    this._listeners = {
      click: undefined,
      move: undefined,
      out: undefined,
      error: undefined
    };
  }
}

module.exports = EventEmitter;
