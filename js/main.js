var     wsbase = "http://maps.co.mecklenburg.nc.us/rest/",
        map,
        marker;

/********************************************
    Page Stuff
*********************************************/
$(document).ready( function() {

    // Activate any tooltips
    $('a[rel=tooltip]').tooltip();

    // Activate popovers
    $('a[rel=popover]').popover();
    $(".popover-trigger").hoverIntent( function(){
            if ( $(window).width() > 979 ) $( $(this).data("popover-selector") ).popover("show");
        }, function(){
            $( $(this).data("popover-selector") ).popover("hide");
        }
    );

    // Highlight search box text on click
    $("#searchbox").click(function() { $(this).select(); });

    // Pubsub
    $.subscribe("/map/addmarker", zoomToLngLat); // Zoom to location
    $.subscribe("/map/addmarker", addMarker); // Add marker

    // jQuery UI Autocomplete
    $("#searchbox").autocomplete({
        minLength: 4,
        delay: 400,
        autoFocus: true,
        source: function(request, response) {
            $.ajax({
                url: wsbase + "v4/ws_geo_ubersearch.php",
                dataType: "jsonp",
                data: {
                    searchtypes: "address,library,school,park,geoname,cast,intersection,pid",
                    query: request.term
                },
                success: function(data) {
                    if (data.length > 0) {
                        response($.map(data, function(item) {
                            return {
                                label: item.name,
                                gid: item.gid,
                                responsetype: item.type,
                                lng: item.lng,
                                lat: item.lat
                            };
                        }));
                    } else {
                        response($.map([{}], function(item) {
                            if (isNumber(request.term)) {
                                // Needs more data
                                return { label: "More information needed for search.", responsetype: "I've got nothing" };
                            } else {
                                // No records found
                                return { label: "No records found.", responsetype: "I've got nothing" };
                            }
                        }));
                    }
                }
            });
        },
        select: function(event, ui) {
            if (ui.item.gid) locationFinder(ui.item);
        },
        open: function(event, ui) {
            // Go if only 1 result
            menuItems = $("ul.ui-autocomplete li.ui-menu-item");
            if (menuItems.length == 1 && menuItems.text() != "More information needed for search." && menuItems.text() != "No records found.") {
                $($(this).data('autocomplete').menu.active).find('a').trigger('click');
            }
        }
    }).data("autocomplete")._renderMenu = function (ul, items) {
        // Match categories
        var self = this, currentCategory = "";
        $.each( items, function( index, item ) {
            if ( item.responsetype != currentCategory && item.responsetype !== undefined) {
                ul.append( "<li class='ui-autocomplete-category'>" + item.responsetype + "</li>" );
                currentCategory = item.responsetype;
            }
            self._renderItemData( ul, item );
        });
    };
});

// Window load
$(window).load( function() {
    // initialize map
    mapInit();
});


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

    //  Add Base Layer
    L.tileLayer( "http://maps.co.mecklenburg.nc.us/mbtiles/mbtiles-server.php?db=meckbase.mbtiles&z={z}&x={x}&y={y}",
     { "attribution": "<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>" } ).addTo( map );
}

// zoom to bounds
function zoomToFeature(bounds) {
    map.fitBounds(bounds);
}

// Add marker
function addMarker(data) {
    if (marker) {
        try { map.removeLayer(marker); }
        catch(err) {}
    }
    marker = L.marker([data.lat, data.lng]).addTo(map);
    marker.bindPopup(data.label).openPopup();
}

//  Zoom to latlong
function zoomToLngLat(data) {
    map.setView([data.lat, data.lng], 16);
}

// Find locations
function locationFinder(data) {
    $.publish("/map/addmarker", [ data ]);
}

