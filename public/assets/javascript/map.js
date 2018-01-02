//The "destAdd" div will be hidden. It will contain the restaurant's address
$("#destAdd").hide();
//The duration will be hidden until the drive time is calculated
$("#theDuration").hide();

var userAddress;
var restaurantAddress = $("#destAdd").text();

$("#homeLink").on("click", function() {
    $.ajax({
        url: "/",
        method: "GET",
    }).done(function(err, res) {
        location.assign("/");
    });
});

//getLocation will get the users location from the browser
function getLocation() {
    function showPosition(position) {

        startLat = position.coords.latitude;
        startLng = position.coords.longitude;

        //Request the formatted address of the users current coordinates and saves them in userAddress variable
        var URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + startLat + "," + startLng + "&key=AIzaSyCMRNMvB_hrPmwoHo_pkOvAfIOI5IMuMsA";
        $.ajax({
            url: URL,
            method: "GET"
        }).done(function(response) {
            userAddress = response.results["0"].formatted_address;
            console.log("User's address from browser: " + userAddress);
            //Once the user's address is saved in the userAddress variable, call the initMap function to load the map
            initMap();
        });
    };
    //if geolocation is supported, the getCurrentPosition will be called
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        lattitude.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 35.227085, lng: -80.843124 }
    });
    //displays the directions map
    directionsDisplay.setMap(map);
    //gets the drive time from user's current location to the restaurant
    getDriveTime(userAddress, restaurantAddress);
    //displays the route on the map
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}

//calculates and displays the route from the userAddress to the restaurantAddress
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    console.log("Start: " + userAddress);
    console.log("End: " + restaurantAddress);
    directionsService.route({
        origin: userAddress,
        destination: restaurantAddress,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            //Once the route is available, hide the loading gif
            $("#loading").hide();
            //Display the route received on the map
            directionsDisplay.setDirections(response);
        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

//gets the current time it will take to drive the route
function getDriveTime(x, y) {
    var directionsService = new google.maps.DirectionsService();
    var request = {
        origin: x,
        destination: y,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            console.log("RESPONSE: " + response);
            var duration = response.routes[0].legs[0].duration.text;
            $("#theDuration").text(" in " + duration);
            $("#theDuration").show();

        }
        else {
            console.log("There is no route information available for this trip");
        }
    });
}

//initializes geolocation and route
getLocation();
