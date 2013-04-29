/********************************************
    Page Stuff
*********************************************/

var map,
    marker;

$(document).ready(function () {

    // Activate any tooltips
    $('a[rel=tooltip]').tooltip();

    // Activate popovers
    $('*[rel=popover]').popover();

    // Pubsub
    $.subscribe("/map/addmarker", zoomToLngLat);
    $.subscribe("/map/addmarker", addMarker);
    if (Modernizr.history) { $.subscribe("/map/addmarker", newHistory); }

    // jQuery UI Autocomplete
    $("#searchbox").click(function () { $(this).select(); });
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (index, item) {
                if (item.responsetype !== currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.responsetype + "</li>");
                    currentCategory = item.responsetype;
                }
                that._renderItemData(ul, item);
            });
        }
    });
    $("#searchbox").catcomplete({
        minLength: 4,
        delay: 250,
        autoFocus: true,
        source: function (request, response) {
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_ubersearch.php',
                dataType: 'jsonp',
                data: {
                    searchtypes: 'address,library,school,park,geoname,cast,nsa,intersection,pid,business,road',
                    query: request.term
                },
                success: function (data) {
                    if (data.length > 0) {
                        response($.map(data, function (item) {
                            return {
                                label: item.name,
                                gid: item.gid,
                                responsetype: item.type,
                                lng: item.lng,
                                lat: item.lat
                            };
                        }));
                    } else {
                        response($.map([{}], function (item) {
                            return { label: 'No matches found.', responsetype: "I've got nothing" };
                        }));
                    }
                }
            });
        },
        select: function (event, ui) {
            if (ui.item.lat) {
                $.publish("/map/addmarker", [ ui.item ]);
            }
            $(this).popover('hide').blur();
        },
        open: function (event, ui) {
            $(this).popover('hide');
        }
    });
    $(".searchbtn").bind("click", function (event) {
        $("#searchbox").catcomplete("search");
    });
});

// Window load
$(window).load(function () {
    // initialize map
    mapInit();

    // set up history API
    if (Modernizr.history) {
        // history is supported; do magical things
        $(window).bind("popstate", function () {
            // reset if no args
            if (getURLParameter("loc")) {
                var loc = getURLParameter("loc").split(",");
                loc = { "lat": loc[0], "lng": loc[1] };
                $.unsubscribe("/map/addmarker", newHistory);
                $.publish("/map/addmarker", [ loc ]);
                $.subscribe("/map/addmarker", newHistory);
            }
            else if (map.getCenter().lat.toString().substr(0,6) != 35.260) {
                map.setView([35.260, -80.807], 10);
            }
        });
    }
});

// Push state
function newHistory(data) {
    history.pushState(null, null, "?loc=" + data.lat + "," + data.lng);
}
