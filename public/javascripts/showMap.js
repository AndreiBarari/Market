
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
center: farm.geometry.coordinates, // starting position [lng, lat]
zoom: 7 // starting zoom
});


new mapboxgl.Marker()
.setLngLat(farm.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${farm.farmName}</h3>`
    )
)
.addTo(map)