"use strict";
function initialize() {

    var conges = require("./conges");
    var pointMerger = require("./pointMerger");
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

    var layers = [], map, failTimeout;

    function clearTimeoutLocate() {
        clearTimeout(failTimeout);
        failTimeout = null;
    }

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

        function clearLayers() {
            while (layers.length != 0) {
                map.removeLayer(layers.pop());
            }
        }

        function nvl(v1, v2) {
            return v1 ? v1 : v2;
        }

        clearLayers();

        var response = JSON.parse(r.responseText);

        layers.push(new L.marker(response.center).bindPopup(nvl(getSearchCriteria(), 'Votre position')).addTo(map));
        initSearchCriteria();
        var markers = pointMerger.mergeNearPoints(response.markers).map(function (p) {
            p.type = "Feature";
            p.geometry = { type: "Point" };
            var popupContent = [
                    {v:p.properties.name,f:p.properties.name},
                    {v:interestingPartOfAddress(p.properties.address),f:p.properties.address},
                    {l:"A ",v:Math.round(new L.LatLng(p.coordinates[1], p.coordinates[0]).distanceTo(response.center)) + "m de vous",f:true},
                    {l:"Fermeture le ", v:p.properties.fermeture,f:p.properties.fermeture},
                    {l:"Ouverture",v: p.properties.opening_hours,f: p.properties.opening_hours},
                    {l:"Congés ",v:conges.conge(p.properties.conge),f:p.properties.conge}
                    //, {l: "pos", v: p.coordinates, f:p.coordinates}
            ].filter(function (e) {
                return typeof(e.f) != "undefined";
            }).map(function (e) {
                return e.l ? e.l + " " + e.v : e.v;
            }).join("<br>");

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
        layers.push(L.geoJson({
            features: markers
        }, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: conges.isClose(feature.properties) ? bakeryIconClose : bakeryIconOpen});
            },
            onEachFeature: onEachFeature
        }));
        map.fitBounds(layers[layers.length - 1].addTo(map).getBounds());
    }

    function onLocationFound(e) {
        clearTimeoutLocate();
        document.querySelector(".tp-locator").classList.remove("fa-spin");
        document.querySelector(".tp-locator").style.color = 'black';

        ajax({
            url: '/boulangeries', success: displayMarkers,
            verb: 'GET',
            params: {lat: e.latlng.lat, lng: e.latlng.lng}
        });
    }

    function loadDefaultQuery() {
        clearTimeoutLocate();
        document.querySelector(".tp-locator").classList.remove("fa-spin");
        document.querySelector(".tp-locator").style.color = 'black';
        ajax({
            url: "/boulangeries", success: displayMarkers,
            verb: 'GET'
        })
    }

    function controlSearch() {
        var control = new L.Control();
        control.getContainer = function () {
            return document.getElementById('addrform');
        };
        control.onAdd = function () {
            L.DomEvent.disableClickPropagation(control.getContainer());
            return control.getContainer();
        };
        return control;
    }

    function initMap(callback) {
        map = L.map('map');

        L.tileLayer('https://{s}.tiles.mapbox.com/v3/wadouk.hn2hnhp0/{z}/{x}/{y}.png', {
            maxZoom: 18
        }).addTo(map);

        controlSearch().addTo(map);
        L.easyButton("fa-location-arrow tp-locator",localize,"Localize",map);
        loadDefaultQuery();

        map.on('locationfound', onLocationFound);
        map.on('locationerror', loadDefaultQuery);

        callback();
    }

    function localize() {
        document.querySelector(".tp-locator").classList.add("fa-spin");
        document.querySelector(".tp-locator").style.color = 'blue';
        var timeoutDelay = 10 * 1000;
        map.locate({setView: true, maxZoom: 16, timeout: timeoutDelay});
        failTimeout = setTimeout(loadDefaultQuery, timeoutDelay);
        // TODO still double request to default query
    }

    function getSearchCriteria() {
        return document.querySelector("#addr").value;
    }

    function initSearchCriteria() {
        document.querySelector("#addr").value = '';
    }

    function fetchMakersFromGeocode() {
        ajax({url: "/geocode", success: displayMarkers,
            verb: 'GET', params: {addr: getSearchCriteria()}})
    }

    function submitFieldOnEnter() {
        document.querySelector("#addr").addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                fetchMakersFromGeocode();
            }
        });
    }

    function preventFormToBeSubmited() {
        addrform.addEventListener("submit", function (e) {
            e.preventDefault();
        });
    }

    initMap(localize);
    submitFieldOnEnter();
    var addrform = document.querySelector("#addrform");
    preventFormToBeSubmited();

    document.querySelector("#addrform button").addEventListener("click", function (e) {
        e.preventDefault();
        if (map) {
            fetchMakersFromGeocode();
        } else {
            initMap(fetchMakersFromGeocode);
        }
    });
}


window.addEventListener('load', initialize);
