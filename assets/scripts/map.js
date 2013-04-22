/********************************************
    Map Stuff
********************************************/

function mapInit() {
    // initialize map
    map = new L.Map('map', {
        center: [35.260, -80.827],
        zoom: 10,
        minZoom: 9,
        maxZoom: 18
    });
    map.attributionControl.setPrefix(false).setPosition("bottomleft");

    //  Mecklenburg Base Layer
    L.tileLayer("http://maps.co.mecklenburg.nc.us/mbtiles/mbtiles-server.php?db=meckbase.mbtiles&z={z}&x={x}&y={y}",
     { "attribution": "<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>" }).addTo(map);
}

//  Zoom to latlong
function zoomToLngLat(data) {
    map.setView([data.lat, data.lng], 17);
}

// Add marker
function addMarker(data) {
    if (marker) {
        try { map.removeLayer(marker); }
        catch(err) {}
    }
    marker = L.marker([data.lat, data.lng]).addTo(map);
    if (data.label) { marker.bindPopup(data.label).openPopup(); }
}
