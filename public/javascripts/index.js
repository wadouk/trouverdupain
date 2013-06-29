function initialize() {

    function ajax(p) {
        console.log('ajax', p);
        var r = new XMLHttpRequest();
        r.onreadystatechange = function () {
            console.log('ajax d', r);
            if (r.readyState != 4 || r.status != 200) return;
            p.success(r);
        };
        r.open(p.verb || 'GET', p.url, true);
        r.send();
    }

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

        function conge(num) {
            //2007 Juillet Aout
            //1      x
            //2             x
            var fullYear = new Date().getFullYear();
            var congeAout2007 = (fullYear - 2007) % 2 == 0;
            return (num == 2 && congeAout2007 ? "en Aout" : "en Juillet") + " (Groupe " + num + ")";
        }

        var points = JSON.parse(r.responseText);
        var geojson = points.map(function (p) {
            p.type = "Feature";
            p.geometry = { type: "Point" };
            var popupContent = interestingPartOfAddress(p.properties.address) +
                "<br>" + p.properties.tel +
                "<br>Congés " + conge(p.properties.conge) +
                "<br>Fermeture le " + p.properties.fermeture;
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: p.coordinates
                },
                properties: { popupContent: popupContent }
            };
        });
        console.log(geojson);
        L.geoJson({
            features: geojson
        }, {
            onEachFeature: onEachFeature
        }).addTo(map);
    }

    function onLocationFound(e) {
        console.log('onlocation', e);
        L.circle(e.latlng, e.accuracy / 2).addTo(map);
        ajax({
            url: '/near', success: displayMarkers
        });
    }


    console.log("init");
    var map = L.map('map');
    L.tileLayer('http://{s}.tile.cloudmade.com/553fcdd9327a493e847991b2074535c0/997/256/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);
}


window.addEventListener('load', initialize);