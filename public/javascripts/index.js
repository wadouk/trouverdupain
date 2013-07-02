function initialize() {

    function ajax(p) {
        var r = new XMLHttpRequest();
        r.onreadystatechange = function () {
            if (r.readyState != 4 || r.status != 200) return;
            p.success(r);
        };
        function map2queryString(params) {
            var queryString = [];
            for (var i in params) {
                if (params.hasOwnProperty(i)) {
                    queryString.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
                }
            }
            return queryString.join("&");
        }

        var data = map2queryString(p.params);
        if (!p.verb || p.verb === 'GET' && p.params) {
            p.url = p.url + '?' + data;
        }

        r.open(p.verb || 'GET', p.url, true);

        if (p.verb === 'POST') {
            r.send(data);
        } else {
            r.send();
        }
    }

    var iconUrlOpen = 'images/pitr_bakery_croissant.png';
    var shadowUrl = 'images/pitr_bakery_croissant_shadow.png';
    var iconUrlClose = 'images/pitr_bakery_croissant_close.png';

    [iconUrlOpen, iconUrlClose, shadowUrl].forEach(function (url) {
        new Image().src = url
    });

    var bakeryIconOpen = L.icon({
        iconUrl: iconUrlOpen, iconAnchor: [16, 35], shadowUrl: shadowUrl, shadowAnchor: [20, 31]

    });
    var bakeryIconClose = L.icon({
        iconUrl: iconUrlClose, iconAnchor: [16, 35], shadowUrl: shadowUrl, shadowAnchor: [20, 31]
    });

    function displayMarkers(r) {
        function onEachFeature(feature, layer) {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }

        function interestingPartOfAddress(addr) {
            try {
                var split = addr.split(",");
                return addr.match(/Paris/i) ? split[0] : addr;
            } catch (e) {
                return addr;
            }
        }

        function numJourFermeture(fermeture) {
            return [
                "Dimanche",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi"
            ].indexOf(fermeture);
        }

        function isClose(properties) {
            var numJourFermeture2 = numJourFermeture(properties.fermeture);
            var congeMonth2 = congeMonth(properties.conge);
            var b = (numJourFermeture2 === new Date().getDay() || congeMonth2 === new Date().getMonth());
            return ( b)
        }


        function congeMonth(num) {
            //2007 Juillet Aout
            //1      x
            //2             x
            var fullYear = new Date().getFullYear();
            var congeAout2007 = (fullYear - 2007) % 2 == 0;
            return (num == 2 && congeAout2007 ? 7 : 6);
        }

        function conge(num) {
            //2007 Juillet Aout
            //1      x
            //2             x
            return (congeMonth(num) === 7 ? "en Aout" : "en Juillet") + " (Groupe " + num + ")";
        }

        var points = JSON.parse(r.responseText);
        var geojson = points.map(function (p) {
            p.type = "Feature";
            p.geometry = { type: "Point" };
            var popupContent = interestingPartOfAddress(p.properties.address) +
                "<br> A " + Math.round(new L.LatLng(p.coordinates[1], p.coordinates[0]).distanceTo(center)) + "m de vous" +
                "<br>Fermeture le " + p.properties.fermeture +
                "<br>Congés " + conge(p.properties.conge);
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: p.coordinates
                },
                properties: { popupContent: popupContent,
                    fermeture: p.properties.fermeture,
                    conge: p.properties.conge
                }
            };
        });
        L.geoJson({
            features: geojson
        }, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: isClose(feature.properties) ? bakeryIconClose : bakeryIconOpen});
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    }

    var center;

    function onLocationFound(e) {
        L.circle(e.latlng, e.accuracy / 2).addTo(map);
        center = e.latlng;
        ajax({
            url: '/boulangeries', success: displayMarkers,
            verb: 'GET',
            params: {lat: e.latlng.lat, lng: e.latlng.lng}
        });
    }

    function localize() {
        document.getElementById("map").style.display = "block";
        document.getElementById("welcome").style.display = "none";
        map = L.map('map');
        L.tileLayer('http://{s}.tile.cloudmade.com/553fcdd9327a493e847991b2074535c0/100985/256/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map);
        map.locate({setView: true, maxZoom: 16});
        map.on('locationfound', onLocationFound);
    }

    document.getElementById("welcome").addEventListener("click", localize);
}


window.addEventListener('load', initialize);