// Embedded google map object;
var map;
// MarkerClusterer object;
var clusterer;
var locs = [
        {lat: -31.563910, lng: 147.154312, timestamp: 1370001284000},
        {lat: -33.718234, lng: 150.363181, timestamp: 1370001284000},
        {lat: -33.727111, lng: 150.371124, timestamp: 1370001284000},
        {lat: -33.848588, lng: 151.209834, timestamp: 1370001284000},
        {lat: -33.851702, lng: 151.216968, timestamp: 1370001284000},
        {lat: -34.671264, lng: 150.863657, timestamp: 1370001284000},
        {lat: -35.304724, lng: 148.662905, timestamp: 1370001284000},
        {lat: -36.817685, lng: 175.699196, timestamp: 1370001284000},
        {lat: -36.828611, lng: 175.790222, timestamp: 1370001284000},
        {lat: -37.750000, lng: 145.116667, timestamp: 1370001284000},
        {lat: -37.759859, lng: 145.128708, timestamp: 1370001284000},
        {lat: -37.765015, lng: 145.133858, timestamp: 1370001284000},
        {lat: -37.770104, lng: 145.143299, timestamp: 1370001284000},
        {lat: -37.773700, lng: 145.145187, timestamp: 1370001284000},
        {lat: -37.774785, lng: 145.137978, timestamp: 1370001284000},
        {lat: -37.819616, lng: 144.968119, timestamp: 1370001284000},
        {lat: -38.330766, lng: 144.695692, timestamp: 1370001284000},
        {lat: -39.927193, lng: 175.053218, timestamp: 1370001284000},
        {lat: -41.330162, lng: 174.865694, timestamp: 1370001284000},
        {lat: -42.734358, lng: 147.439506, timestamp: 1370001284000},
        {lat: -42.734358, lng: 147.501315, timestamp: 1370001284000},
        {lat: -42.735258, lng: 147.438000, timestamp: 1370001284000},
        {lat: -43.999792, lng: 170.463352, timestamp: 1370001284000}
      ];
// var markers;
// Called when gMaps embed is initialised
function initMap() {
    // Initialise map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: -33.8688, lng: 151.2093}
    });
    

    // var infowindow = new google.maps.InfoWindow({
    //     content: "You were here at "
    // });

    // markers.forEach((marker) => marker.addListener('click', () => infowindow.open(map, marker)));

    // Add a marker clusterer to manage the markers.
    clusterer = new MarkerClusterer(map, [],
        { imagePath: 'images/m' });
    
    // let markers = addMarkers(locs);
    // addMarkers(locs);
}

var firstRun = true;
function addMarkers(locations) {
    let markers = locations.map(function(location, i) {
        let m = new google.maps.Marker({
            position: location
        });
        m.addListener('click', () => 
        new google.maps.InfoWindow({
            content: "You were here at <strong>" + new Date((location.timestamp - new Date().getTimezoneOffset() * 60)* 1000).toLocaleString() + "</strong>"
        }).open(map, m));
        return m;
    });
    if (firstRun) {
        map.setCenter(locations[0]);
        firstRun = false;
    }
    // return markers;
    clusterer.addMarkers(markers);
}

window.onload = load_initial;
