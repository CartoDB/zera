var GoogleMap = require('./google');
var LeafletMap = require('./leaflet');

function Map (nativeMap) {
  if (nativeMap.__gm) {
    return new GoogleMap(nativeMap);
  } else {
    return new LeafletMap(nativeMap);
  }
}

module.exports = Map;
