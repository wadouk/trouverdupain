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

    var bakeryIconOpen = L.icon({
        iconUrl: 'images/pitr_bakery_croissant.png'
    });
    var bakeryIconClose = L.icon({
        iconUrl: 'images/pitr_bakery_croissant_close.png'
    });

    function displayMarkers(r) {
        function onEachFeature(feature, layer) {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }

        function interestingPartOfAddress(addr) {
            try {
                return addr.split(",")[0]
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
            return (num == 2 && congeAout2007 ? 8 : 7);
        }

        function conge(num) {
            //2007 Juillet Aout
            //1      x
            //2             x
            return (congeMonth(num) === 8 ? "en Aout" : "en Juillet") + " (Groupe " + num + ")";
        }

        var points = JSON.parse(r.responseText);
        var geojson = points.map(function (p) {
            p.type = "Feature";
            p.geometry = { type: "Point" };
            var popupContent = interestingPartOfAddress(p.properties.address) +
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

    function onLocationFound(e) {
        L.circle(e.latlng, e.accuracy / 2).addTo(map);
        ajax({
            url: '/boulangeries', success: displayMarkers,
            verb: 'GET',
            params: {lat: e.latlng.lat, lng: e.latlng.lng}
        });
    }

    var map = L.map('map');
    L.tileLayer('http://{s}.tile.cloudmade.com/553fcdd9327a493e847991b2074535c0/100985/256/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);
}


window.addEventListener('load', initialize);