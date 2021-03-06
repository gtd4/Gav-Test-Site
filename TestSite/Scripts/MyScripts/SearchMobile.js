﻿var markers = [];

var service;
var map;
var origin;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;

$(document).ready(function () {
    HideResults();
    HideMap();
    HideDirections();
    SizeMap();
   
});

function SizeMap()
{
    var height = $(window).height() - 100;
    $('.map-container').css('height', height);
    $('#map-canvas').css('height', height);
}


function HideDirections()
{
    $('.directions-section').hide();
}

function ShowDirections()
{
    $('.directions-section').show();
}

function HideMap()
{
    $('.map-section').hide();
}

function ShowMap()
{
    $('.map-section').show();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(origin);
    map.setZoom(14);
}

function ShowSearch()
{
    $(".search-section").show();
}

function HideSearch() {
    $(".search-section").hide();


}

function ShowResults()
{
    $(".results-section").show();
}



function HideResults() {
    $(".results-section").hide();
    
}

function HideQuickSearch()
{
    $('.quick-search-section').hide();
}

function ShowQuickSearch()
{
    $('.quick-search-section').show();
}

function initialize() {
    SizeMap();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {

        zoom: 14
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);



    if (navigator.geolocation) {
        getLocation();

    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }


    var marker = new google.maps.Marker({
        position: origin,
        map: map,

    });



    service = new google.maps.places.PlacesService(map);

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
}
function getLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        origin = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
            map: map,
            position: origin,
            content: 'You are here.'
        });
        var myLocation = {
            center: origin,
            map: map,
            radius: 20,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,

        }

        var circle = new google.maps.Circle(myLocation);



        map.setCenter(origin);
    }, function () {
        handleNoGeolocation(true);
    });
}
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);

$('#search-places').keypress(function (e) {
    if (e.keyCode == 13) {

        Search();


    }
});

$(".search").click(function () {
    Search();

})

function Search() {
    emptyResultsList();
    clearMarkers();

    var search = $('#search-places').val();

    if (search == "") {
        alert("Please Enter a Search Term");
        return;
    }

    var request = {
        location: origin,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: search,

    };



    //service.textSearch(request, callback);
    service.nearbySearch(request, callback);

    HideSearch();

}

function callback(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {

            var place = results[i];
            createMarker(place);
            createResultList(place);
        }
    }
    else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        $(".result-list").append("<li> <h3> No Results Found </h3></li>");
    }
}

function createMarker(place) {

    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,

    });

    google.maps.event.addListener(marker, 'mousedown', function () {

        getDirections(marker.getPosition());
    });

    markers.push(marker);

}

function emptyResultsList() {
    $(".result-list").empty();
}

function createResultList(place) {
    var li = document.createElement("li");
    var infoDiv = document.createElement("div");
    var buttonDiv = document.createElement("div");
    var rowDiv = document.createElement("div");
    var button = "<button type='button' value='" + place.geometry.location + "' class='btn btn-success result-button'>Get Directions</button>";

    li.appendChild(rowDiv);
    rowDiv.appendChild(infoDiv);
    rowDiv.appendChild(buttonDiv);

    li.setAttribute("class", "result-item list-group-item");
    rowDiv.setAttribute("class", "row");
    infoDiv.setAttribute("class", "place-info col-sm-8");
    buttonDiv.setAttribute("class", "button col-sm-4")

    var placeInfo = "<h3>" + place.name + "</h3><p>" + place.vicinity + "</p>";

    infoDiv.innerHTML = placeInfo;
    buttonDiv.innerHTML = button;

    $(".result-list").append(li);
}

$(document).on('click', '.result-list .btn', function () {
    // Your Code
    console.log(this.value);
    
    getDirections(this.value);
    HideResults();
    ShowDirections();



});




$(".results-back").click(function () {

    HideDirections();
    ShowResults();

});

$(".map-back").click(function () {

    HideResults();
    ShowQuickSearch();
});

$('.directions-back').click(function () {

    HideMap();
    ShowDirections();
});

$('.view-map').click(function () {

    HideDirections();
    ShowMap();
})


function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

}

function getDirections(location) {
    var start = origin;
    var end = location;

    directionsDisplay.setMap(map);

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

$(".quick-search").click(function () {

    var searchTypes = $(this).val();
    var names = $(this).attr("name");
    quickSearch(searchTypes, names);
    HideQuickSearch();
    ShowResults();


});

function quickSearch(searchTypes, names) {
    emptyResultsList();
    clearMarkers();

    var types = searchTypes.split(",")
    //var search = $('#search-places').val();
    var request = {
        location: origin,
        rankBy: google.maps.places.RankBy.DISTANCE,
        name: names,
        types: types,
    };



    //service.textSearch(request, callback);
    service.nearbySearch(request, callback);

    directionsDisplay.setMap(null);

}



