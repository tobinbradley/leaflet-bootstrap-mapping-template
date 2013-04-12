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
    $('*[rel=popover]').popover();
    $(".popover-trigger").hover(function () {
            if ($(window).width() > 979) { $($(this).data("popover-selector")).popover("show"); }
        }, function () {
            $($(this).data("popover-selector")).popover("hide");
        }
    );

    // Pubsub
    $.subscribe("/map/addmarker", zoomToLngLat); // Zoom to location
    $.subscribe("/map/addmarker", addMarker); // Add marker
    if (Modernizr.history) { $.subscribe("/map/addmarker", newHistory); } // Add marker

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
                url: wsbase + 'v4/ws_geo_ubersearch.php',
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
                            if (isNumber(request.term)) {
                                // Needs more data
                                return { label: 'More information needed for search.', responsetype: "I've got nothing" };
                            } else {
                                // No records found
                                return { label: "No records found.", responsetype: "I've got nothing" };
                            }
                        }));
                    }
                }
            });
        },
        select: function (event, ui) {
            if (ui.item.lat) {
                locationFinder(ui.item);
            }
            else if (ui.item.gid) {
                changeNeighborhood(ui.item.gid);
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
            else {
                map.setView([35.260, -80.807], 10);
            }
        });
    }
});




