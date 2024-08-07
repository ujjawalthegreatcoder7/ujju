mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : "mapbox://styles/mapbox/streets-v12" , // street-v12
    center: (coordinates), // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// 77.209,28.6139

console.log(coordinates)

const marker = new mapboxgl.Marker({color : "red" , rotation : "45"})
.setLngLat (coordinates)  // isk andar location aayegi
.setPopup(new mapboxgl.Popup({offset : 25 })
.setHTML("<h1> RADHA ji bhla kre </h1> "))
.addTo(map) ;






























