function initialize() {
    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    else
        alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");

    function successCallback(position) {
        console.log("position", position);

        var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var circle = new google.maps.Circle({
            center: center,
            radius: position.coords.accuracy,
            map: map
        });

        console.log(circle.getBounds());
        map.fitBounds(circle.getBounds());
        map.setCenter(center);
        circle.setMap(null);

    }

    function errorCallback(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("L'utilisateur n'a pas autorisé l'accès à sa position");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
                break;
            case error.TIMEOUT:
                alert("Le service n'a pas répondu à temps");
                break;
        }
    }
}
google.maps.event.addDomListener(window, 'load', initialize);