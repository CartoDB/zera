# zera

Grid json client for `leaflet` and `google maps`.


## Installing zera

    yarn add carto-zera

## Testing

zera uses [jest](https://facebook.github.io/jest/) for executing the unit tests located under the `__test__ ` folder and 
[karma with headless chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai) for running the tests located under the `test` folder.

By default you need to be hable to run [headless chrome](https://developers.google.com/web/updates/2017/04/headless-chrome) on your machine. But you can also edit the `karma.config.js` file and change the browser.

### Running the thests

    yarn test


## Building
zera uses [webpack](https://webpack.js.org/concepts/) to generate an umd bundle located under the `dist` folder.

    yarn build



## api


#### `new zera.Interactive([map], [gridUrl])`

This creates a new `zera` object.

`map` is a reference to the native google|leaflet map and `gridUrl` is a string poiting to the grid.json url server.


```javascript 
const map = L.map('map').setView([42, -0.08], 5);
const gridUrl = 'https://carto.com/map_id/1/{z}/{x}/{y}.grid.json';
const interactivity = new zera.Interactive(map, '');
```

#### `zera.on(event, callback)`

Attach event listeners to map events, only a single listener can be attached for every event type.
There are only three possible events:

    - **on:** Fired when the user clicks or moves the mouse over a feature. You can distinguish between them using `event.type` property.
    - **off:** Fired when the user clicks or moves the mouse outside a feature.
    - **error** Fired when there was an error getting the `grid.json` for a interaction.
        - This includes `CARTO-429` limit error.

```javascript
zera.on('on', event => {
    poup.setLatLng(event.latlng);
    poup.setContent(`<h5>${event.data.name}</h5> <h6> ${event.type} </h6>`);
    poup.openOn(map);
})
```

#### `zera.off(event)`

Remove an event listener.

```javascript
zera.off('on');
```


#### `zera.remove()`

Remove all the interactivity and callbacks.

```javascript
zera.remove();
```